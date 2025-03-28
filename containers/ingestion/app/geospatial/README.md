# The Geospatial Package

This package contains functions useful in the geocoding of raw input data (i.e. strings and dictionaries having no particular formatting standard). The `core.py` file defines the abstract `GeocodeClient` that vendor-specific implementations inherit from, as well as the standard `GeocodeResult` class that encapsulated returned geocoding information in a standardized data structure. All other files in this package directory are vendor-specific implementations of geocoding, with one file per vendor. Each has access to the same basic geocoding utilities, `.geocode_from_str()` and `.geocode_from_dict()`. For an overview of the package as well as common use cases, see the _geospatial-tutorial_ in `/tutorials` at the project root. For a more in-depth explanation of specific formatting and parameters, see the docstrings and comments for each function.

## Provenance

> #TODO: add more info about no longer using the `phdi` package; some central `.md` file with a summary and what that meaning for development moving forward.

Originally this code was from the `phdi` package maintained at the root directory of this repository at `phdi`. See [documentation that communicates above TODO] for more information.
