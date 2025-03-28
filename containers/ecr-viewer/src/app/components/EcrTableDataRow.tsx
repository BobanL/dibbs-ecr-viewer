"use client";
import React, { useState } from "react";

import { Button } from "@trussworks/react-uswds";
import { motion } from "motion/react";
import Link from "next/link";

import { useQueryParam } from "@/app/hooks/useQueryParam";
import { formatDate, formatDateTime } from "@/app/services/formatDateService";
import { EcrDisplay, RelatedEcr } from "@/app/services/listEcrDataService";
import { noData } from "@/app/utils/data-utils";
import { makePlural, toSentenceCase } from "@/app/utils/format-utils";
import { saveToSessionStorage } from "@/app/utils/storage-utils";

import { ExpandMore } from "./Icon";

const transition = {
  type: "spring",
  stiffness: 203,
  damping: 25,
};

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

  // Used to set aria-controls for the new rows upon expansion
  let relatedEcrIdList = item.related_ecrs
    .slice(0, 5)
    .map(({ eicr_id }) => `related-row-${eicr_id}`)
    .join(" ");

  if (item.related_ecrs.length > 5) {
    relatedEcrIdList = relatedEcrIdList + ` show-more-${item.ecrId}`;
  }

  return (
    <>
      <motion.tr
        className="main-row"
        layout="position"
        transition={transition}
        key={`row-${item.ecrId}`}
      >
        <td>
          <div className="patient-name-cell">
            {item.related_ecrs.length > 0 && (
              <Button
                aria-label="View Related eCRs"
                aria-controls={relatedEcrIdList}
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
      </motion.tr>

      {isExpanded && <RelatedRows item={item} patientName={patientName} />}
    </>
  );
};

const RelatedRows = ({
  item,
  patientName,
}: {
  item: EcrDisplay;
  patientName: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(item.related_ecrs.length <= 5);

  const firstEcrs = item.related_ecrs.slice(0, 5);
  const remainingEcrs = item.related_ecrs.slice(5);

  const remainingEcrIdList = remainingEcrs
    .map(({ eicr_id }) => `related-row-${eicr_id}`)
    .join(" ");

  return (
    <>
      {firstEcrs.map((ecr) => (
        <RelatedRow
          key={ecr.eicr_id}
          ecr={ecr}
          patientName={patientName}
          mainDateCreated={item.date_created}
        />
      ))}
      {!isExpanded ? (
        <SlidingRow id={`show-more-${item.ecrId}`}>
          <td colSpan={999}>
            <Button
              type="button"
              unstyled={true}
              aria-controls={remainingEcrIdList}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              Show {remainingEcrs.length} more eCR
              {makePlural(remainingEcrs.length)}
            </Button>
          </td>
        </SlidingRow>
      ) : (
        remainingEcrs.map((ecr) => (
          <RelatedRow
            key={ecr.eicr_id}
            ecr={ecr}
            patientName={patientName}
            mainDateCreated={item.date_created}
          />
        ))
      )}
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
    <SlidingRow id={ecr.eicr_id}>
      <td>
        <UrlSavingLink ecrId={ecr.eicr_id}>{patientName}</UrlSavingLink>
        {ecr.eicr_version_number && (
          <span className="usa-tag margin-x-1 padding-x-05 padding-y-2px bg-primary-lighter radius-md text-thin text-base-dark">
            V{ecr.eicr_version_number}
          </span>
        )}
      </td>
      <td colSpan={999}>
        {ecrDate === mainDate ? <strong>{ecrTime}</strong> : ecrTime} {ecrDate}
      </td>
    </SlidingRow>
  );
};

const SlidingRow = ({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) => {
  return (
    <motion.tr
      className="related-row"
      layout={true}
      id={`related-row-${id}`}
      key={`row-${id}`}
      initial={{ translateY: "-50%", opacity: 0 }}
      animate={{ translateY: 0, opacity: 1 }}
      transition={{ ...transition, delay: 0.1 }}
    >
      {children}
    </motion.tr>
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
