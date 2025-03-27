"use client";
import React, { useState } from "react";

import { Button } from "@trussworks/react-uswds";
import Link from "next/link";

import { useQueryParam } from "@/app/hooks/useQueryParam";
import { formatDateTime } from "@/app/services/formatDateService";
import { EcrDisplay } from "@/app/services/listEcrDataService";
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

  const patient_first_name = toSentenceCase(item.patient_first_name);
  const patient_last_name = toSentenceCase(item.patient_last_name);
  console.log({ related_ecrs: item.related_ecrs });

  const { searchParams } = useQueryParam();

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

  const saveUrl = () => {
    saveToSessionStorage("urlParams", searchParams.toString());
  };

  return (
    <>
      <tr className="main-row">
        <td>
          <div className="patient-name-cell">
            {relatedEcrs.length > 0 && (
              <Button
                aria-label="View Related eCRs"
                className="usa-button expand-ecrs-button"
                type="button"
                onClick={() => setExpanded(!isExpanded)}
                unstyled={true}
              >
                <ExpandMore
                  aria-hidden={true}
                  className="square-3 expand-icon"
                  style={{
                    transform: `rotate(${isExpanded ? "0" : "-90deg"})`,
                  }}
                />
              </Button>
            )}
            <div className="patient-name-content">
              <Link onClick={saveUrl} href={`/view-data?id=${item.ecrId}`}>
                {patient_first_name} {patient_last_name}
              </Link>
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
          <tr className="related-row">
            <td>
              <Link onClick={saveUrl} href={`/view-data?id=${ecr.eicr_id}`}>
                {patient_first_name} {patient_last_name}
              </Link>
              {ecr.eicr_version_number && (
                <span className="usa-tag margin-x-1 padding-x-05 padding-y-2px bg-primary-lighter radius-md text-thin text-base-dark">
                  V{ecr.eicr_version_number}
                </span>
              )}
            </td>
            <td>{formatDateTime(ecr.date_created.toISOString())}</td>
            <td />
            <td />
            <td />
          </tr>
        ))}
    </>
  );
};
