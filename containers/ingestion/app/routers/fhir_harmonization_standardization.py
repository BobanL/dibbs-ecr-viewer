from typing import Literal

from fastapi import APIRouter
from pydantic import BaseModel, Field, field_validator

from app.fhir.harmonization.standardization import (
    standardize_dob,
    standardize_names,
    standardize_phones,
)
from app.utils import StandardResponse, check_for_fhir, read_json_from_assets

router = APIRouter(
    prefix="/fhir/harmonization/standardization",
    tags=["fhir/harmonization"],
)

# Sample request/response for name endpoint
sample_name_request_data = read_json_from_assets(
    "sample_standardize_name_request_data.json"
)

raw_sample_name_response = read_json_from_assets(
    "sample_standardize_name_response.json"
)

sample_name_response = {200: raw_sample_name_response}


class StandardizeNamesInput(BaseModel):
    data: dict = Field(
        description="A FHIR resource or bundle in JSON format.",
        json_schema_extra={"example": sample_name_request_data},
    )
    trim: bool | None = Field(
        description="When true, leading and trailing spaces are removed.", default=True
    )
    overwrite: bool | None = Field(
        description="If true, `data` is modified in-place; if false, a copy of `data` "
        "is modified and returned.",
        default=True,
    )
    case: Literal["upper", "lower", "title"] | None = Field(
        description="The type of casing that should be used.",
        default="upper",
    )
    remove_numbers: bool | None = Field(
        description="If true, delete numeric characters; if false leave numbers in "
        "place.",
        default=True,
    )

    _check_for_fhir = field_validator(
        "data",
    )(check_for_fhir)


@router.post("/standardize_names", responses=sample_name_response)
async def standardize_names_endpoint(input: StandardizeNamesInput) -> StandardResponse:
    """
    This endpoint standardizes the names in the provided FHIR bundle or resource.

    ### Inputs and Outputs
    - :param input: A dictionary with the schema specified by the StandardizeNamesInput
        model.
    - :return: A FHIR bundle or resource with standardized names.
    """
    input = dict(input)
    return {"status_code": 200, "bundle": standardize_names(**input)}


# Sample request/response for phone endpoint
sample_phone_request_data = read_json_from_assets(
    "sample_standardize_phone_request_data.json"
)

raw_sample_phone_response = read_json_from_assets(
    "sample_standardize_phone_response.json"
)

sample_phone_response = {200: raw_sample_phone_response}


class StandardizePhonesInput(BaseModel):
    data: dict = Field(
        description="A FHIR resource or bundle in JSON format.",
        json_schema_extra={"example": sample_phone_request_data},
    )
    overwrite: bool | None = Field(
        description="If true, `data` is modified in-place; if false, a copy of `data` "
        "is modified and returned.",
        default=True,
    )

    _check_for_fhir = field_validator(
        "data",
    )(check_for_fhir)


@router.post("/standardize_phones", responses=sample_phone_response)
async def standardize_phones_endpoint(
    input: StandardizePhonesInput,
) -> StandardResponse:
    """
    This endpoint standardizes the phone numbers in the provided FHIR bundle
    or resource.

    The endpoint requires an address so that country code can be generated.

    ### Inputs and Outputs

    - :param input: A dictionary with the schema specified by the StandardizePhonesInput
        model.
    - :return: A FHIR bundle with standardized phone numbers.
    """
    input = dict(input)
    return {"status_code": 200, "bundle": standardize_phones(**input)}


# Sample request/response for date of birth endpoint
sample_date_of_birth_request_data = read_json_from_assets(
    "sample_standardize_date_of_birth_request_data.json"
)

raw_sample_date_of_birth_response = read_json_from_assets(
    "sample_standardize_date_of_birth_response.json"
)

sample_date_of_birth_response = {200: raw_sample_date_of_birth_response}


class StandardizeBirthDateInput(BaseModel):
    data: dict = Field(
        description="A FHIR resource or bundle in JSON format.",
        json_schema_extra={"example": sample_date_of_birth_request_data},
    )
    overwrite: bool | None = Field(
        description="If true, `data` is modified in-place; if false, a copy of `data` is modified and returned.",
        default=True,
    )
    format: str | None = Field(
        default="%Y-%m-%d",
        description="The date format that the input DOB is supplied in.",
        json_schema_extra={
            "example": "%m/%d/%Y",
        },
    )

    _check_for_fhir = field_validator(
        "data",
    )(check_for_fhir)


@router.post("/standardize_dob", responses=sample_date_of_birth_response)
async def standardize_dob_endpoint(
    input: StandardizeBirthDateInput,
) -> StandardResponse:
    """
    This endpoint standardizes the patient date of birth in the provided
    FHIR bundle or resourceDates are changed to the FHIR standard of
    YYYY-MM-DD.

    The endpoint returns a FHIR bundle with standardized birth dates.
    """
    input = dict(input)
    result = {}
    try:
        standardized_bundles = standardize_dob(**input)
        result["status_code"] = "200"
        result["bundle"] = standardized_bundles
    except Exception as error:
        result["status_code"] = "400"
        result["bundle"] = input["data"]
        result["message"] = error.__str__()
    return result
