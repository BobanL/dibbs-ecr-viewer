"use client";
import React, { useState } from "react";

import { Button } from "@trussworks/react-uswds";
import Link from "next/link";

import { useQueryParam } from "@/app/hooks/useQueryParam";
import { formatDate, formatDateTime } from "@/app/services/formatDateService";
import { EcrDisplay, RelatedEcr } from "@/app/services/listEcrDataService";
import { noData } from "@/app/utils/data-utils";
import { toSentenceCase } from "@/app/utils/format-utils";
import { saveToSessionStorage } from "@/app/utils/storage-utils";

import { ExpandMore } from "./Icon";

/**
 * Formats a single row of the eCR table.
 * @param props - The properties passed to the component.
 * @param props.item - The eCR data to be formatted.
 * @returns A JSX table row element representing the eCR data.
 */
export const EcrTableDataRow = ({ item }: { item: EcrDisplay }) => {
  const [isExpanded, setExpanded] = useState(false);
  const patientName =
    toSentenceCase(item.patient_first_name) +
    " " +
    toSentenceCase(item.patient_last_name);
  console.log({ related_ecrs: item.related_ecrs });

  const conditionsList = (
    <ul className="ecr-table-list">
      {item.reportable_conditions.map((rc, index) => (
        <li key={index}>{rc}</li>
      ))}
    </ul>
  );

  const summariesList = (
    <ul className="ecr-table-list">
      {item.rule_summaries.map((rs, index) => (
        <li key={index}>{rs}</li>
      ))}
    </ul>
  );

  const relatedEcrs = item.related_ecrs.filter(
    ({ eicr_id }) => eicr_id !== item.ecrId,
  );

  return (
    <>
      <tr className="main-row">
        <td>
          <div className="patient-name-cell">
            {relatedEcrs.length > 0 && (
              <Button
                aria-label="View Related eCRs"
                className="usa-button expand-ecrs-button text-base"
                type="button"
                onClick={() => setExpanded(!isExpanded)}
                unstyled={true}
              >
                <ExpandMore
                  aria-hidden={true}
                  className="square-3 expand-icon"
                  viewBox="2 2 20 20"
                  style={{
                    transform: `rotate(${isExpanded ? "0" : "-90deg"})`,
                  }}
                />
              </Button>
            )}
            <div className="patient-name-content">
              <UrlSavingLink ecrId={item.ecrId}>{patientName}</UrlSavingLink>
              {item.eicr_version_number && (
                <span className="usa-tag margin-x-1 padding-x-05 padding-y-2px bg-primary-lighter radius-md text-thin text-base-dark">
                  V{item.eicr_version_number}
                </span>
              )}
              <br />
              DOB: {item.patient_date_of_birth}
            </div>
          </div>
        </td>
        <td>{item.date_created}</td>
        <td>{item.patient_report_date || noData}</td>
        <td>{conditionsList}</td>
        <td>{summariesList}</td>
      </tr>
      {isExpanded &&
        relatedEcrs.map((ecr) => (
          <RelatedRow
            ecr={ecr}
            patientName={patientName}
            mainDateCreated={item.date_created}
          />
        ))}
    </>
  );
};

const RelatedRow = ({
  patientName,
  ecr,
  mainDateCreated,
}: {
  patientName: string;
  ecr: RelatedEcr;
  mainDateCreated: string;
}) => {
  const mainDate = formatDate(mainDateCreated);
  const ecrDateTime = formatDateTime(ecr.date_created.toISOString());
  const [ecrDate, ecrTime] = ecrDateTime.split(" ");

  return (
    <tr className="related-row">
      <td>
        <UrlSavingLink ecrId={ecr.eicr_id}>{patientName}</UrlSavingLink>
        {ecr.eicr_version_number && (
          <span className="usa-tag margin-x-1 padding-x-05 padding-y-2px bg-primary-lighter radius-md text-thin text-base-dark">
            V{ecr.eicr_version_number}
          </span>
        )}
      </td>
      <td colSpan={4}>
        {ecrDate} {ecrDate === mainDate ? <strong>{ecrTime}</strong> : ecrTime}
      </td>
    </tr>
  );
};

const UrlSavingLink = ({
  ecrId,
  children,
}: {
  ecrId: string;
  children: React.ReactNode;
}) => {
  const { searchParams } = useQueryParam();

  const saveUrl = () => {
    saveToSessionStorage("urlParams", searchParams.toString());
  };

  return (
    <Link onClick={saveUrl} href={`/view-data?id=${ecrId}`}>
      {children}
    </Link>
  );
};
