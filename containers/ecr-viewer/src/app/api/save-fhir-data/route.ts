import { NextRequest, NextResponse } from "next/server";

import { S3_SOURCE, AZURE_SOURCE, GCP_SOURCE } from "@/app/api/utils";

import { saveFhirData, saveWithMetadata } from "./save-fhir-data-service";

/**
 * Handles POST requests and saves the FHIR Bundle to the database.
 * @param request - The incoming request object. Expected to have a JSON body in the format `{"fhirBundle":{}, "saveSource": "s3|azure""}`. FHIR bundle must include the ecr ID under entry[0].resource.id.
 * @returns A `NextResponse` object with a JSON payload indicating the success message. The response content type is set to `application/json`.
 */
export async function POST(request: NextRequest) {
  let requestBody;
  let fhirBundle;
  let ecrId;

  try {
    requestBody = await request.json();
    fhirBundle = requestBody.fhirBundle;
    ecrId = requestBody.fhirBundle.entry[0].resource.id;
  } catch (error: unknown) {
    console.error("Error reading request body:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { message: "Error reading request body. " + error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Error reading request body." },
      { status: 400 },
    );
  }

  if (!fhirBundle || !ecrId) {
    return NextResponse.json(
      {
        message:
          "Error reading request body. Body must include a FHIR bundle with an ID.",
      },
      { status: 400 },
    );
  }

  const saveSource = requestBody.saveSource || process.env.SOURCE;

  if ([S3_SOURCE, AZURE_SOURCE, GCP_SOURCE].includes(saveSource) === false) {
    return NextResponse.json({ message: "Invalid source" }, { status: 500 });
  }

  if (requestBody.metadata) {
    const { message, status } = await saveWithMetadata(
      fhirBundle,
      ecrId,
      saveSource,
      requestBody.metadata,
    );
    return NextResponse.json({ message }, { status });
  } else {
    const { message, status } = await saveFhirData(
      fhirBundle,
      ecrId,
      saveSource,
    );
    return NextResponse.json({ message }, { status });
  }
}
