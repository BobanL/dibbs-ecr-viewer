import React from "react";

import { render, screen } from "@testing-library/react";
import { Procedure } from "fhir/r4";
import { axe } from "jest-axe";

import ClinicalInfo from "@/app/view-data/components/ClinicalInfo";
import {
  evaluateClinicalData,
  evaluateMiscNotes,
  returnProceduresTable,
} from "@/app/view-data/components/EcrDocument/clinical-data";

describe("Snapshot test for Procedures (Treatment Details)", () => {
  let container: HTMLElement;

  beforeAll(() => {
    const proceduresArray = [
      {
        id: "b40f0081-4052-4971-3f3b-e3d9f5e1e44d",
        code: {
          coding: [
            {
              code: "0241U",
              system: "http://www.ama-assn.org/go/cpt",
              display:
                "HC INFECTIOUS DISEASE PATHOGEN SPECIFIC RNA SARS-COV-2/INF A&B/RSV UPPER RESP SPEC DETECTED OR NOT",
            },
            {
              code: "12345",
              system: "something that isn't loinc",
              display: "Don't display me!",
            },
          ],
        },
        meta: {
          source: ["ecr"],
          profile: [
            "http://hl7.org/fhir/us/core/StructureDefinition/us-core-procedure",
          ],
        },
        reason: [
          {
            display: "Struck by nonvenomous lizards, sequela",
            reference: "e436d9b7-6b4e-f553-0314-5a388d15e02e",
          },
        ],
        status: "completed",
        subject: {
          reference: "Patient/5360b569-1354-4ece-b6a1-58b0946fc861",
        },
        identifier: [
          {
            value: "2884257^",
            system: "urn:oid:1.2.840.114350.1.13.502.3.7.1.1988.1",
          },
        ],
        resourceType: "Procedure",
        performedDateTime: "2022-06-24T12:50:00-04:00",
      },
      {
        id: "b40f0081-4052-4971-3f3b-e3d9f5e1e44e",
        code: {
          coding: [
            {
              code: "86308",
              system: "http://www.ama-assn.org/go/cpt",
              display: "HC HETEROPHILE ANTIBODIES SCREENING",
            },
            {
              code: "12345",
              system: "http://loinc.org",
              display: "LOINC codes are better",
            },
          ],
        },
        meta: {
          source: ["ecr"],
          profile: [
            "http://hl7.org/fhir/us/core/StructureDefinition/us-core-procedure",
          ],
        },
        reason: [
          {
            display:
              "Routine general medical examination at a health care facility",
            reference: "7cda2e3e-5d91-428f-8abe-517846d4749e",
          },
        ],
        status: "completed",
        subject: {
          reference: "Patient/5360b569-1354-4ece-b6a1-58b0946fc861",
        },
        identifier: [
          {
            value: "2884257^",
            system: "urn:oid:1.2.840.114350.1.13.502.3.7.1.1988.1",
          },
        ],
        resourceType: "Procedure",
        performedDateTime: "06/16/2022",
      },
    ] as unknown as Procedure[];

    const treatmentData = [
      {
        title: "Procedures",
        value: returnProceduresTable(proceduresArray),
      },
    ];

    container = render(
      <ClinicalInfo
        clinicalNotes={[]}
        activeProblemsDetails={[]}
        vitalData={[]}
        reasonForVisitDetails={[]}
        immunizationsDetails={[]}
        treatmentData={treatmentData}
      />,
    ).container;
  });
  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });
  it("should pass accessibility test", async () => {
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Snapshot test for Clinical Notes", () => {
  it("should match snapshot for non table notes", async () => {
    const clinicalNotes = [
      {
        title: "Miscellaneous Notes",
        value: (
          <p>
            This patient was only recently discharged for a recurrent GI bleed
            as described
          </p>
        ),
      },
    ];
    const { container } = render(
      <ClinicalInfo
        clinicalNotes={clinicalNotes}
        activeProblemsDetails={[]}
        vitalData={[]}
        reasonForVisitDetails={[]}
        immunizationsDetails={[]}
        treatmentData={[]}
      />,
    );
    expect(container).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  });
  it("should match snapshot for table notes", async () => {
    const mockChildMethod = jest.fn();
    jest.spyOn(React, "useRef").mockReturnValue({
      current: {
        childMethod: mockChildMethod,
      },
    });
    const testData = `<table>
          <thead>
            <tr>
              <th>Active Problems</th>
              <th>Noted Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Parkinson's syndrome</td>
              <td>7/25/22</td>
            </tr>
            <tr>
              <td>Essential hypertension</td>
              <td>7/21/22</td>
            </tr>
          </tbody>
        </table>`;
    const clinicalNotes = [
      evaluateMiscNotes({
        resourceType: "Bundle",
        type: "batch",
        entry: [
          {
            // @ts-expect-error
            resource: {
              resourceType: "Composition",
              section: [
                {
                  code: {
                    coding: [
                      {
                        code: "10164-2",
                      },
                    ],
                  },
                  text: {
                    status: "generated",
                    div: testData,
                  },
                },
              ],
            },
          },
        ],
      }),
    ];
    const { container } = render(
      <ClinicalInfo
        clinicalNotes={clinicalNotes}
        activeProblemsDetails={[]}
        vitalData={[]}
        reasonForVisitDetails={[]}
        immunizationsDetails={[]}
        treatmentData={[]}
      />,
    );
    expect(container).toMatchSnapshot();
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Check that Clinical Info components render given FHIR bundle", () => {
  const fhirBundleClinicalInfo = require("../../../../../../test-data/fhir/BundleClinicalInfo.json");
  const testClinicalData = evaluateClinicalData(fhirBundleClinicalInfo);

  const testImmunizationsData =
    testClinicalData.immunizationsDetails.availableData;
  const testActiveProblemsData =
    testClinicalData.activeProblemsDetails.availableData;
  const testVitalSignsData = testClinicalData.vitalData.availableData;
  const testReasonForVisitData =
    testClinicalData.reasonForVisitDetails.availableData;
  const testTreatmentData = testClinicalData.treatmentData.availableData;

  it("eCR Viewer renders immunization table given FHIR bundle with immunization info", () => {
    const clinicalInfo = render(
      <ClinicalInfo
        immunizationsDetails={testImmunizationsData}
        reasonForVisitDetails={[]}
        activeProblemsDetails={[]}
        vitalData={[]}
        treatmentData={[]}
        clinicalNotes={[]}
      />,
    );

    // Ensure that Immunizations Section renders
    const expectedImmunizationsElement = clinicalInfo.getByTestId(
      "immunization-history",
    );
    expect(expectedImmunizationsElement).toBeInTheDocument();

    // Ensure only one table (Immunization History) is rendering
    const expectedTable = clinicalInfo.getAllByTestId("table");
    expect(expectedTable[0]).toBeInTheDocument();
    expect(expectedTable.length).toEqual(1);
  });

  it("eCR Viewer renders active problems table given FHIR bundle with active problems info", () => {
    const clinicalInfo = render(
      <ClinicalInfo
        immunizationsDetails={[]}
        reasonForVisitDetails={[]}
        activeProblemsDetails={testActiveProblemsData}
        vitalData={[]}
        treatmentData={[]}
        clinicalNotes={[]}
      />,
    );

    const expectedActiveProblemsElement =
      clinicalInfo.getByTestId("active-problems");
    expect(expectedActiveProblemsElement).toBeInTheDocument();

    // Ensure only one table (Active Problems) is rendering
    const expectedTable = clinicalInfo.getAllByTestId("table");
    expect(expectedTable[0]).toBeInTheDocument();
    expect(expectedTable.length).toEqual(1);
  });

  it("eCR Viewer renders vital signs given FHIR bundle with vital signs info", () => {
    const clinicalInfo = render(
      <ClinicalInfo
        immunizationsDetails={[]}
        reasonForVisitDetails={[]}
        activeProblemsDetails={[]}
        vitalData={testVitalSignsData}
        treatmentData={[]}
        clinicalNotes={[]}
      />,
    );

    const expectedVitalSignsElement = clinicalInfo.getByTestId("vital-signs");
    expect(expectedVitalSignsElement).toBeInTheDocument();

    // Ensure only one table (Vital Signs) is rendering
    const expectedTable = clinicalInfo.getAllByTestId("table");
    expect(expectedTable.length).toEqual(1);
    expect(expectedTable[0]).toBeInTheDocument();

    // Check Vital Signs table contents
    const expectedValues = [
      "60 in",
      "152.4 cm",
      "140 lb",
      "63.5 kg",
      "20 kg/m2",
    ];
    const expectedDate = "02/04/2025 12:48 PM EST";

    // Check if all expected values are present in the document
    expectedValues.forEach((value) => {
      expect(screen.getByText(value)).toBeInTheDocument();
    });
    const numVitalSignsDate = screen.getAllByText(expectedDate);
    expect(numVitalSignsDate.length).toBe(5);
  });

  it("eCR Viewer renders reason for visit given FHIR bundle with reason for visit info", () => {
    const clinicalInfo = render(
      <ClinicalInfo
        immunizationsDetails={[]}
        reasonForVisitDetails={testReasonForVisitData}
        activeProblemsDetails={[]}
        vitalData={[]}
        treatmentData={[]}
        clinicalNotes={[]}
      />,
    );

    const expectedReasonForVisitElement =
      clinicalInfo.getByTestId("reason-for-visit");
    expect(expectedReasonForVisitElement).toBeInTheDocument();
  });

  it("eCR Viewer renders treatment data given FHIR bundle with treatment data info", () => {
    const clinicalInfo = render(
      <ClinicalInfo
        immunizationsDetails={[]}
        reasonForVisitDetails={[]}
        activeProblemsDetails={[]}
        vitalData={[]}
        treatmentData={testTreatmentData}
        clinicalNotes={[]}
      />,
    );

    const expectedTreatmentElement =
      clinicalInfo.getByTestId("treatment-details");
    expect(expectedTreatmentElement).toBeInTheDocument();

    const expectedTable = clinicalInfo.getAllByTestId("table");
    expect(expectedTable[0]).toBeInTheDocument();
    expect(expectedTable.length).toEqual(4);
  });

  it("eCR Viewer renders all Clinical Info sections", () => {
    const clinicalInfo = render(
      <ClinicalInfo
        immunizationsDetails={testImmunizationsData}
        reasonForVisitDetails={testReasonForVisitData}
        activeProblemsDetails={testActiveProblemsData}
        vitalData={testVitalSignsData}
        treatmentData={testTreatmentData}
        clinicalNotes={[]}
      />,
    );

    const expectedImmunizationsElement = clinicalInfo.getByTestId(
      "immunization-history",
    );
    expect(expectedImmunizationsElement).toBeInTheDocument();

    const expectedActiveProblemsElement =
      clinicalInfo.getByTestId("active-problems");
    expect(expectedActiveProblemsElement).toBeInTheDocument();

    const expectedTreatmentElement =
      clinicalInfo.getByTestId("treatment-details");
    expect(expectedTreatmentElement).toBeInTheDocument();

    const expectedTable = clinicalInfo.getAllByTestId("table");
    expect(expectedTable[0]).toBeInTheDocument();
    expect(expectedTable.length).toEqual(7);

    const expectedVitalSignsElement = clinicalInfo.getByTestId("vital-signs");
    expect(expectedVitalSignsElement).toBeInTheDocument();

    const expectedReasonForVisitElement =
      clinicalInfo.getByTestId("reason-for-visit");
    expect(expectedReasonForVisitElement).toBeInTheDocument();
  });
});
