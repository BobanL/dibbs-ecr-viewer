/**
 * @jest-environment node
 */

import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandOutput,
} from "@aws-sdk/client-s3";
import { mockClient } from "aws-sdk-client-mock";
import { NextRequest } from "next/server";

import { POST } from "@/app/api/save-fhir-data/route";

const s3Mock = mockClient(S3Client);
jest.mock("@azure/storage-blob", () => {
  const uploadMock = jest.fn();
  const getBlockBlobClientMock = jest.fn(() => ({
    upload: uploadMock,
  }));

  const getContainerClientMock = jest.fn(() => ({
    getBlockBlobClient: getBlockBlobClientMock,
  }));

  return {
    BlobServiceClient: {
      fromConnectionString: jest.fn(() => ({
        getContainerClient: getContainerClientMock,
      })),
    },
  };
});
jest.mock("../../../app/api/services/database");

const fakeData = (source: string) => ({
  fhirBundle: {
    resourceType: "Bundle",
    type: "batch",
    entry: [
      {
        fullUrl: "urn:uuid:12345",
        resource: {
          resourceType: "Composition",
          id: "12345",
        },
      },
    ],
  },
  saveSource: source,
});

describe("POST Save FHIR Data API Route", () => {
  beforeEach(() => {
    s3Mock.reset();
  });

  it("sends data to S3 and returns a success response", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/save-fhir-data",
      {
        method: "POST",
        body: JSON.stringify(fakeData("s3")),
      },
    );

    const output: PutObjectCommandOutput = {
      $metadata: {
        httpStatusCode: 200,
        requestId: "biz",
        extendedRequestId: "bar",
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0,
      },
      ETag: "foo",
      ServerSideEncryption: "AES256",
    };

    s3Mock
      .on(PutObjectCommand, {
        Bucket: process.env.ECR_BUCKET_NAME,
        Key: "12345.json",
        Body: JSON.stringify(fakeData("s3").fhirBundle),
        ContentType: "application/json",
      })
      .resolves(output);

    const response = await POST(request);
    const responseJson = await response.json();
    expect(response.status).toBe(200);
    expect(responseJson.message).toBe("Success. Saved FHIR bundle.");
  });

  it("throws an error when bucket is not found", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    const request = new NextRequest(
      "http://localhost:3000/api/save-fhir-data",
      {
        method: "POST",
        body: JSON.stringify(fakeData("s3")),
      },
    );

    const output = {
      $fault: "client",
      $metadata: {
        httpStatusCode: 403,
        requestId: "foo",
        extendedRequestId: "foobizbarbiz",
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0,
      },
      Code: "AllAccessDisabled",
      RequestId: "foobiz",
      HostId: "foobar",
    };

    s3Mock
      .on(PutObjectCommand, {
        Bucket: process.env.ECR_BUCKET_NAME,
        Key: "12345.json",
        Body: JSON.stringify(fakeData("s3").fhirBundle),
        ContentType: "application/json",
      })
      .resolves(output);

    const response = await POST(request);
    const responseJson = await response.json();
    expect(response.status).toBe(500);
    expect(responseJson.message).toBe("Failed to save FHIR bundle.");
  });

  it("uses SOURCE environment variable if saveSource parameter is not provided", async () => {
    process.env.SOURCE = "s3";
    const reqBody = {
      fhirBundle: {
        resourceType: "Bundle",
        type: "batch",
        entry: [
          {
            fullUrl: "urn:uuid:12345",
            resource: {
              resourceType: "Composition",
              id: "12345",
            },
          },
        ],
      },
    };

    const request = new NextRequest(
      "http://localhost:3000/api/save-fhir-data",
      {
        method: "POST",
        body: JSON.stringify(reqBody),
      },
    );

    const output: PutObjectCommandOutput = {
      $metadata: {
        httpStatusCode: 200,
        requestId: "biz",
        extendedRequestId: "bar",
        cfId: undefined,
        attempts: 1,
        totalRetryDelay: 0,
      },
      ETag: "foo",
      ServerSideEncryption: "AES256",
    };

    s3Mock
      .on(PutObjectCommand, {
        Bucket: process.env.ECR_BUCKET_NAME,
        Key: "12345.json",
        Body: JSON.stringify(reqBody.fhirBundle),
        ContentType: "application/json",
      })
      .resolves(output);

    const response = await POST(request);
    const responseJson = await response.json();
    expect(response.status).toBe(200);
    expect(responseJson.message).toBe("Success. Saved FHIR bundle.");
  });

  it("throws an error when saveSource is invalid", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/save-fhir-data",
      {
        method: "POST",
        body: JSON.stringify(fakeData("bad-source")),
      },
    );

    const response = await POST(request);
    const responseJson = await response.json();
    expect(response.status).toBe(500);
    expect(responseJson.message).toBe("Invalid source");
  });
});

describe("POST Save FHIR Data API Route - Azure", () => {
  const { BlobServiceClient } = require("@azure/storage-blob");
  const mockBlobServiceClient = BlobServiceClient.fromConnectionString;
  const mockContainerClient = mockBlobServiceClient().getContainerClient();
  const mockBlockBlobClient = mockContainerClient.getBlockBlobClient();

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.AZURE_STORAGE_CONNECTION_STRING = "connection";
  });

  afterAll(() => {
    delete process.env.AZURE_STORAGE_CONNECTION_STRING;
  });

  it("sends data to Azure Blob Storage and returns a success response", async () => {
    mockBlockBlobClient.upload.mockResolvedValue({
      _response: { status: 201 },
    });

    const request = new NextRequest(
      "http://localhost:3000/api/save-fhir-data",
      {
        method: "POST",
        body: JSON.stringify(fakeData("azure")),
      },
    );

    const response = await POST(request);
    const responseJson = await response.json();

    expect(response.status).toBe(200);
    expect(responseJson.message).toBe("Success. Saved FHIR bundle.");
    expect(mockBlockBlobClient.upload).toHaveBeenCalledOnce();
    expect(mockBlockBlobClient.upload).toHaveBeenCalledWith(
      JSON.stringify(fakeData("azure").fhirBundle),
      134,
      {
        blobHTTPHeaders: { blobContentType: "application/json" },
      },
    );
  });

  it("throws an error when Azure upload fails", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});
    mockBlockBlobClient.upload.mockRejectedValue({
      _response: { status: 400 },
    });

    const request = new NextRequest(
      "http://localhost:3000/api/save-fhir-data",
      {
        method: "POST",
        body: JSON.stringify(fakeData("azure")),
      },
    );

    const response = await POST(request);
    const responseJson = await response.json();

    expect(response.status).toBe(500);
    expect(responseJson.message).toInclude("Failed to save FHIR bundle.");
    expect(mockBlockBlobClient.upload).toHaveBeenCalledOnce();
    expect(mockBlockBlobClient.upload).toHaveBeenCalledWith(
      JSON.stringify(fakeData("azure").fhirBundle),
      134,
      {
        blobHTTPHeaders: { blobContentType: "application/json" },
      },
    );
  });
});
