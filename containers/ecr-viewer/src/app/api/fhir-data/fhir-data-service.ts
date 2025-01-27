import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import {
  BlobClient,
  BlobDownloadResponseParsed,
  BlobServiceClient,
} from "@azure/storage-blob";
import {
  AZURE_SOURCE,
  POSTGRES_SOURCE,
  S3_SOURCE,
  loadYamlConfig,
  streamToJson,
} from "../utils";
import { getDB } from "../services/postgres_db";
import { s3Client } from "../services/s3Client";

const UNKNOWN_ECR_ID = "eCR ID not found";

type FhirDataResponse = {
  payload: { fhirBundle: any } | { message: string };
  status: number;
};

/**
 * Get the fhir data for a given ECR ID
 * @param ecr_id The id of the ecr to fetch
 * @returns NextResponse with the ecr or error data
 */
export async function get_fhir_data(ecr_id: string | null) {
  let res: FhirDataResponse;
  if (process.env.SOURCE === S3_SOURCE) {
    res = await get_s3(ecr_id);
  } else if (process.env.SOURCE === AZURE_SOURCE) {
    res = await get_azure(ecr_id);
  } else if (process.env.SOURCE === POSTGRES_SOURCE) {
    res = await get_postgres(ecr_id);
  } else {
    res = { payload: { message: "Invalid source" }, status: 500 };
  }
  const { status, payload } = res;
  if (status !== 200) {
    return NextResponse.json(payload, { status });
  }

  const mappings = loadYamlConfig();
  if (!mappings) {
    console.error("Unable to load FHIR mappings");
    return NextResponse.json(
      { message: "Internal system error" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { ...payload, fhirPathMappings: mappings },
    { status },
  );
}

/**
 * Retrieves FHIR data from PostgreSQL database based on eCR ID.
 * @param ecr_id - The id of the ecr to fetch.
 * @returns A promise resolving to the data and status.
 */
export const get_postgres = async (
  ecr_id: string | null,
): Promise<FhirDataResponse> => {
  const { database, pgPromise } = getDB();

  const { ParameterizedQuery: PQ } = pgPromise;
  const findFhir = new PQ({
    text: "SELECT * FROM fhir WHERE ecr_id = $1",
    values: [ecr_id],
  });
  try {
    const entry = await database.one(findFhir);
    return { payload: { fhirBundle: entry.data }, status: 200 };
  } catch (error: any) {
    console.error("Error fetching data:", error);
    if (error.message == "No data returned from the query.") {
      return { payload: { message: UNKNOWN_ECR_ID }, status: 404 };
    } else {
      return { payload: { message: error.message }, status: 500 };
    }
  }
};

/**
 * Retrieves FHIR data from S3 based on eCR ID.
 * @param ecr_id - The id of the ecr to fetch.
 * @returns A promise resolving to a NextResponse object.
 */
export const get_s3 = async (
  ecr_id: string | null,
): Promise<FhirDataResponse> => {
  const bucketName = process.env.ECR_BUCKET_NAME;
  const objectKey = `${ecr_id}.json`; // This could also come from the request, e.g., req.query.key

  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: objectKey,
    });

    const { Body } = await s3Client.send(command);
    const content = await streamToJson(Body);

    return { payload: { fhirBundle: content }, status: 200 };
  } catch (error: any) {
    console.error("S3 GetObject error:", error);
    if (error?.Code === "NoSuchKey") {
      return { payload: { message: UNKNOWN_ECR_ID }, status: 404 };
    } else {
      return { payload: { message: error.message }, status: 500 };
    }
  }
};

/**
 * Retrieves FHIR data from Azure Blob Storage based on eCR ID.
 * @param ecr_id - The id of the ecr to fetch.
 * @returns A promise resolving to a NextResponse object.
 */
export const get_azure = async (
  ecr_id: string | null,
): Promise<FhirDataResponse> => {
  // TODO: Make this global after we get Azure access
  const blobClient = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING!,
  );

  if (!process.env.AZURE_CONTAINER_NAME)
    throw Error("Azure container name not found");

  const containerName = process.env.AZURE_CONTAINER_NAME;
  const blobName = `${ecr_id}.json`;

  try {
    const containerClient = blobClient.getContainerClient(containerName);
    const blockBlobClient: BlobClient = containerClient.getBlobClient(blobName);

    const downloadResponse: BlobDownloadResponseParsed =
      await blockBlobClient.download();
    const content = await streamToJson(downloadResponse.readableStreamBody);

    return {
      payload: { fhirBundle: content },
      status: 200,
    };
  } catch (error: any) {
    console.error(
      "Failed to download the FHIR data from Azure Blob Storage:",
      error,
    );
    if (error?.statusCode === 404) {
      return { payload: { message: UNKNOWN_ECR_ID }, status: 404 };
    } else {
      return { payload: { message: error.message }, status: 500 };
    }
  }
};
