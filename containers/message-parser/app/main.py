import json
import os
from pathlib import Path
from typing import Annotated

from fastapi import Body, Response, status

from app.base_service import BaseService
from app.config import get_settings
from app.models import (
    FhirToPhdcInput,
    GetSchemaResponse,
    ListSchemasResponse,
    ParseMessageInput,
    ParseMessageResponse,
    ParsingSchemaModel,
    PutSchemaResponse,
)
from app.phdc.builder import PHDCBuilder
from app.utils import (
    clean_schema,
    convert_to_fhir,
    extract_and_apply_parsers,
    freeze_parsing_schema,
    get_credential_manager,
    get_metadata,
    load_parsing_schema,
    read_json_from_assets,
    search_for_required_values,
    transform_to_phdc_input_data,
)

# Read settings immediately to fail fast in case there are invalid values.
get_settings()

# Instantiate FastAPI via DIBBs' BaseService class
app = BaseService(
    service_name="DIBBs Message Parser",
    service_path="/message-parser",
    description_path=Path(__file__).parent.parent / "README.md",
    openapi_url="/message-parser/openapi.json",
).start()

# /parse_message endpoint #
parse_message_request_examples = read_json_from_assets(
    "sample_parse_message_requests.json"
)
raw_parse_message_response_examples = read_json_from_assets(
    "sample_parse_message_responses.json"
)
parse_message_response_examples = {200: raw_parse_message_response_examples}


@app.get("/")
async def health_check():
    """
    This endpoint checks service status. If an HTTP 200 status code is
    returned along with '{"status": "OK"}' then the service is available and
    running properly.
    """
    return {"status": "OK"}


@app.post("/parse_message", status_code=200, responses=parse_message_response_examples)
async def parse_message_endpoint(
    input: Annotated[ParseMessageInput, Body(examples=parse_message_request_examples)],
    response: Response,
) -> ParseMessageResponse:
    """
    This endpoint extracts the desired values from a message. If the message is
    not already in FHIR format, convert it to FHIR first. You can either
    provide a parsing schema or the name of a previously loaded parsing schema.
    """
    # 1. Load schema.
    if input.parsing_schema:
        parsing_schema = freeze_parsing_schema(input.parsing_schema)
    else:
        try:
            parsing_schema = load_parsing_schema(input.parsing_schema_name)
        except FileNotFoundError as error:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"message": error.__str__(), "parsed_values": {}}

    # 2. Convert to FHIR, if necessary.
    if input.message_format != "fhir":
        if input.credential_manager is not None:
            input.credential_manager = get_credential_manager(
                credential_manager=input.credential_manager,
                location_url=input.fhir_converter_url,
            )

        search_result = search_for_required_values(dict(input), ["fhir_converter_url"])
        if search_result != "All values were found.":
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {"message": search_result, "parsed_values": {}}

        fhir_converter_response = convert_to_fhir(
            message=input.message,
            message_type=input.message_type,
            fhir_converter_url=input.fhir_converter_url,
            credential_manager=input.credential_manager,
        )
        if fhir_converter_response.status_code == 200:
            input.message = fhir_converter_response.json()["FhirResource"]
        else:
            response.status_code = status.HTTP_400_BAD_REQUEST
            return {
                "message": f"Failed to convert to FHIR: {fhir_converter_response.text}",
                "parsed_values": {},
            }

    # 3. Parse the desired values and find metadata, if needed
    parsed_values = extract_and_apply_parsers(parsing_schema, input.message, response)
    if input.include_metadata == "true":
        parsed_values = get_metadata(parsed_values, parsing_schema)
    return {"message": "Parsing succeeded!", "parsed_values": parsed_values}


# /fhir_to_phdc endpoint #
fhir_to_phdc_request_examples = read_json_from_assets(
    "sample_fhir_to_phdc_requests.json"
)
raw_fhir_to_phdc_response_examples = read_json_from_assets(
    "sample_fhir_to_phdc_response.json"
)
fhir_to_phdc_response_examples = {200: raw_fhir_to_phdc_response_examples}


@app.post(
    "/fhir_to_phdc",
    status_code=200,
    responses=fhir_to_phdc_response_examples,
    summary="FHIR To PHDC Endpoint",
)
async def fhir_to_phdc_endpoint(
    input: Annotated[FhirToPhdcInput, Body(examples=fhir_to_phdc_request_examples)],
    response: Response,
):
    """
    This endpoint converts a FHIR bundle to a Public Health Document Container
    (PHDC).
    """

    # 1. Identify the parsing schema based on the supplied phdc type
    match input.phdc_report_type:
        case "case_report":
            parsing_schema = load_parsing_schema("phdc_case_report_schema.json")
        case "contact_record":
            pass
        case "lab_report":
            pass
        case "morbidity_report":
            pass

    # 2. Extract data from FHIR
    parsed_values = extract_and_apply_parsers(parsing_schema, input.message, response)

    # 3. Transform to PHDCbuilder data classes
    input_data = transform_to_phdc_input_data(parsed_values)

    # 4. Build PHDC
    builder = PHDCBuilder()
    builder.set_input_data(input_data)
    phdc = builder.build()

    return Response(content=phdc.to_xml_string(), media_type="application/xml")


# /schemas endpoint #
raw_list_schemas_response = read_json_from_assets("sample_list_schemas_response.json")
sample_list_schemas_response = {200: raw_list_schemas_response}


@app.get("/schemas", responses=sample_list_schemas_response)
async def list_schemas() -> ListSchemasResponse:
    """
    This endpoint gets a list of all the parsing schemas currently available.
    """
    default_schemas = os.listdir(Path(__file__).parent / "default_schemas")
    custom_schemas = os.listdir(Path(__file__).parent / "custom_schemas")
    custom_schemas = [schema for schema in custom_schemas if schema != ".keep"]
    schemas = {"default_schemas": default_schemas, "custom_schemas": custom_schemas}
    return schemas


# /schemas/{parsing_schema_name} endpoint #
raw_get_schema_response = read_json_from_assets("sample_get_schema_response.json")
sample_get_schema_response = {200: raw_get_schema_response}


@app.get(
    "/schemas/{parsing_schema_name}",
    status_code=200,
    responses=sample_get_schema_response,
)
async def get_schema(parsing_schema_name: str, response: Response) -> GetSchemaResponse:
    """
    Get the schema specified by 'parsing_schema_name'.
    """
    try:
        parsing_schema = load_parsing_schema(parsing_schema_name)
    except FileNotFoundError as error:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": error.__str__(), "parsing_schema": {}}
    return {"message": "Schema found!", "parsing_schema": parsing_schema}


upload_schema_request_examples = read_json_from_assets(
    "sample_upload_schema_requests.json"
)

upload_schema_response_examples = {
    200: "sample_upload_schema_response.json",
    201: "sample_update_schema_response.json",
    400: "sample_upload_schema_failure_response.json",
}
for status_code, file_name in upload_schema_response_examples.items():
    upload_schema_response_examples[status_code] = read_json_from_assets(file_name)
    upload_schema_response_examples[status_code]["model"] = PutSchemaResponse


@app.put(
    "/schemas/{parsing_schema_name}",
    status_code=200,
    response_model=PutSchemaResponse,
    responses=upload_schema_response_examples,
)
async def upload_schema(
    parsing_schema_name: str,
    input: Annotated[ParsingSchemaModel, Body(examples=upload_schema_request_examples)],
    response: Response,
) -> PutSchemaResponse:
    """
    This endpoint uploads a new parsing schema to the service or updates an
    existing schema.
    """

    file_path = Path(__file__).parent / "custom_schemas" / parsing_schema_name
    schema_exists = file_path.exists()
    if schema_exists and not input.overwrite:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {
            "message": f"A schema for the name '{parsing_schema_name}' already exists. "
            "To proceed submit a new request with a different schema name or set the "
            "'overwrite' field to 'true'."
        }

    # Convert Pydantic models to dicts so they can be serialized to JSON.
    schema_dict = input.model_dump()
    clean_schema(schema_dict["parsing_schema"])  # remove secondary_schemas

    with open(file_path, "w") as file:
        json.dump(schema_dict["parsing_schema"], file, indent=4)

    if schema_exists:
        return {"message": "Schema updated successfully!"}
    else:
        response.status_code = status.HTTP_201_CREATED
        return {"message": "Schema uploaded successfully!"}


# This block is only executed if the script is run directly, for local development and debugging.
if "__main__" == __name__:
    import uvicorn

    uvicorn.run(
        app="app.main:app",
        host="0.0.0.0",
        port=8080,
        reload=True,
    )
