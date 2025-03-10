## Getting Started with the DIBBs Ingestion Service

### Introduction

The DIBBs Ingestion service offers a REST API with endpoints for standardization and harmonization of FHIR messages. It offers name standardization, date of birth (DoB) standardization, phone number standardization, geocoding, and several utilities for working with FHIR servers.

### Running the Ingestion Service

You can run the Ingestion service using Docker, another OCI container runtime (e.g., Podman), or directly from the Python source code.

#### Running with Docker (Recommended for production)

To run the Ingestion service with Docker follow these steps.

1. Confirm that you have Docker installed by running `docker -v`. If you don’t see a response similar to what’s shown below, follow [these instructions](https://docs.docker.com/get-docker/) to install Docker.

```
❯ docker -v
Docker version 20.10.21, build baeda1f
```

2. Download a copy of the Docker image from the PHDI repository by running `docker pull ghcr.io/cdcgov/dibbs-ecr-viewer/ingestion:latest`.
3. Run the service with ` docker run -p 8080:8080 ghcr.io/cdcgov/dibbs-ecr-viewer/ingestion:latest`.

Congratulations, the ingestion service should now be running on `localhost:8080`!

#### Running from Python Source Code

We recommend running the ingestion service from a container, but if that isn't feasible for a given use case, it may also be run directly from Python using the steps below.

1. Ensure that both Git and Python 3.13 or higher are installed.
2. Clone the PHDI repository with `git clone https://github.com/CDCgov/dibbs-ecr-viewer`.
3. Navigate to `/dibbs-ecr-viewer/containers/ingestion/`.
4. Make a fresh virtual environment with `python -m venv .venv`.
5. Activate the virtual environment with `source .venv/bin/activate` (MacOS and Linux), `venv\Scripts\activate` (Windows Command Prompt), or `.venv\Scripts\Activate.ps1` (Windows PowerShell).
6. Install all of the Python dependencies for the ingestion service with `pip install -r requirements.txt` into your virtual environment.
7. Run the FHIR Converter on `localhost:8080` with `python -m uvicorn app.main:app --host 0.0.0.0 --port 8080`.

### Building the Docker Image

To build the Docker image for the Ingestion service from source code instead of downloading it from the PHDI repository, follow these steps.

1. Ensure that both [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Docker](https://docs.docker.com/get-docker/) are installed.
2. Clone the PHDI repository with `git clone https://github.com/CDCgov/dibbs-ecr-viewer`.
3. Navigate to `/dibbs-ecr-viewer/containers/ingestion/`.
4. Run `docker build -t ingestion .`.

### The API

When viewing these docs from the `/redoc` endpoint on a running instance of the ingestion service or the PHDI website, detailed documentation on the API will be available below.

## Diagrams

###

```mermaid
flowchart LR

  subgraph requests["Requests"]
    direction TB
    subgraph GET["fas:fa-download <code>GET</code>"]
      hc["<code>/</code>\n(health check)"]

    end
    subgraph POST-standardization["fas:fa-upload <code>POST Standardization</code>"]
      ecr["<code>/fhir/harmonization/<br>standardization/standardize_names<//code>"]
      phones["<code>/fhir/harmonization/<br>standardization/standardize_phones<//code>"]
      dob["<code>/fhir/harmonization/<br>standardization/standardize_dob<//code>"]
    end
    subgraph POST-geospatial["fas:fa-upload <code>POST Geospatial</code>"]
      geo["<code>/fhir/geospatial/geocode/geocode_bundle<//code>"]
    end
    subgraph POST-linkage["fas:fa-upload <code>POST Linkage</code>"]
      link["<code>/fhir/linkage/link/add_patient_identifier_in_bundle<//code>"]
    end
  end


  subgraph service[REST API Service]
    direction TB
    subgraph mr["fab:fa-docker container"]
      viewer["fab:fa-python <code>ingestion<br>HTTP:3000/</code>"]
    end
    subgraph smarty["fab:fa-docker smarty"]
      smarty-api["fab:fa-python <code>Smarty API</code>"]
    end
    mr <--> |<br><code>GET /geocodeAddress</code>| smarty

  end

  subgraph response["Responses"]
    subgraph JSON["fa:fa-file-alt <code>JSON</code>"]
      rsp-hc["fa:fa-file-code <code>OK</code> fa:fa-thumbs-up"]
      fhirdata["fa:fa-file-code FHIR Data"]
	  post-ecr["200"]
    end
  end

hc -.-> mr -.-> rsp-hc
POST-standardization ===> mr ===> post-ecr
POST-linkage ==> mr ===> post-ecr
POST-geospatial --> mr ---> post-ecr
```
