"use client";
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Button } from "@trussworks/react-uswds";

import { useQueryParam } from "@/app/hooks/useQueryParam";
import { formatDateTime } from "@/app/services/formatDateService";
import {
  CustomDateRangeOption,
  DEFAULT_DATE_RANGE,
  DateRangeOption,
  DateRangeOptions,
  dateRangeLabels,
} from "@/app/utils/date-utils";

import {
  Filter,
  RadioDateOption,
  RadioDateOptions,
  CustomDateInput,
} from "./BaseFilter";
import { Autorenew, Coronavirus, Event } from "./Icon";

enum ParamName {
  Condition = "condition",
  DateRange = "dateRange",
  Dates = "dates",
}

// We use a context to communicate between the overall <Filters /> component
// and the `<Filter />` component to avoid prop drilling
type FilterOpenContextValue = {
  filterBoxOpen: string;
  setFilterBoxOpen: (v: string) => void;
  lastOpenButtonRef: { current: HTMLElement | null };
};
// We need the submitted case to differentiate from closing and prevent
// a race condition with submitting and resetting if we try to do a reset
// just after submitting.
export const FILTER_SUBMITTED = "__submitted__";
export const FILTER_CLOSED = "__closed__";

export const FilterOpenContext = createContext<FilterOpenContextValue>({
  filterBoxOpen: FILTER_CLOSED,
  setFilterBoxOpen: () => {},
  lastOpenButtonRef: { current: null },
});

interface FilterProps {
  allConditions: string[];
  initConditions: string[];
  initCustomDate: string;
  initDateRange: DateRangeOption;
}

/**
 * Functional component that renders Filters section in eCR Library.
 * Includes Filter component for reportable conditions.
 * @param props - props to pass to Filters
 * @returns The rendered Filters component.
 */
const Filters = (props: FilterProps) => {
  const [filterBoxOpen, setFilterBoxOpen] = useState<string>(FILTER_CLOSED);
  const lastOpenButtonRef = useRef<HTMLElement | null>(null);
  const { searchParams, deleteQueryParam, pushQueryUpdate } = useQueryParam();

  const filterOpenContextValue = {
    filterBoxOpen,
    setFilterBoxOpen,
    lastOpenButtonRef,
  };

  const resetFilters = useCallback(() => {
    setFilterBoxOpen(FILTER_CLOSED);
  }, []);

  // When a filter is open, close it if the escape key is hit or a click happens
  // outside the <Filter /> component (implemented by stopping click propogation on <Filter />)
  useEffect(() => {
    if (filterBoxOpen !== FILTER_CLOSED && filterBoxOpen !== FILTER_SUBMITTED) {
      const handleEscapeFilters = (event: KeyboardEvent) => {
        if (event.code === "Escape") {
          resetFilters();

          // Return focus to the most recently selected open button
          lastOpenButtonRef.current?.focus();
          lastOpenButtonRef.current = null;
        }
      };

      window.addEventListener("keydown", handleEscapeFilters);
      window.addEventListener("click", resetFilters);
      return () => {
        window.removeEventListener("keydown", handleEscapeFilters);
        window.removeEventListener("click", resetFilters);
      };
    }
  }, [filterBoxOpen]);

  const paramKeys = Object.values(ParamName);
  const resetToDefault = () => {
    for (const key of paramKeys) {
      deleteQueryParam(key);
    }
    pushQueryUpdate();
  };

  return (
    <div>
      <div className="border-top border-base-lighter"></div>
      <div className="margin-x-3 margin-y-105 display-flex flex-align-center gap-105">
        <span className="line-height-sans-6">FILTERS:</span>
        <FilterOpenContext.Provider value={filterOpenContextValue}>
          <FilterByDate {...props} />
          <FilterReportableConditions {...props} />
        </FilterOpenContext.Provider>

        {paramKeys.some((k) => searchParams.get(k) !== null) && (
          <Button
            type="button"
            unstyled={true}
            onClick={resetToDefault}
            aria-label="Reset Filters to Defaults"
            className="gap-05"
          >
            <span className="square-205 usa-icon">
              <Autorenew aria-hidden={true} className="square-205" />
            </span>
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};

/**
 * Functional component for filtering eCRs in the Library based on reportable conditions.
 * @param props - props to pass to FilterReportableConditions
 * @param props.allConditions - List of conditions to filter on
 * @param props.initConditions - List of conditions that are initially true (default undefined)
 * @returns The rendered FilterReportableConditions component.
 * - Users can select specific conditions or select all conditions.
 * - Updates the browser's query string when the filter is applied.
 */
const FilterReportableConditions = ({
  initConditions,
  allConditions,
}: FilterProps) => {
  const { updateQueryParam, pushQueryUpdate } = useQueryParam();

  const initFilterState = allConditions.reduce(
    (dict: { [key: string]: boolean }, condition: string) => {
      dict[condition] = initConditions.includes(condition);
      return dict;
    },
    {} as { [key: string]: boolean },
  );

  const [filterConditions, setFilterConditions] = useState(initFilterState);

  // Keep state in sync with updated params while maintaining correct focus on submit
  useEffect(() => setFilterConditions(initFilterState), [initConditions]);

  // Build list of conditions to filter on
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setFilterConditions((prev) => {
      return { ...prev, [value]: checked };
    });
  };

  // Check/Uncheck all boxes based on Select all checkbox
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;

    const updatedConditions = Object.keys(filterConditions).reduce(
      (dict, condition) => {
        dict[condition] = checked;
        return dict;
      },
      {} as { [key: string]: boolean },
    );

    setFilterConditions(updatedConditions);
  };

  const isAllSelected = Object.values(filterConditions).every(
    (val) => val === true,
  );

  return (
    <Filter
      type="Reportable Condition"
      isActive={!isAllSelected}
      resetHandler={() => setFilterConditions(initFilterState)}
      icon={Coronavirus}
      tag={
        Object.keys(filterConditions).filter(
          (key) => filterConditions[key] === true,
        ).length || "0"
      }
      submitHandler={() => {
        updateQueryParam(ParamName.Condition, filterConditions, isAllSelected);
        pushQueryUpdate();
      }}
    >
      {/* Select All checkbox */}
      <div className="display-flex flex-column">
        <div className="checkbox-color usa-checkbox padding-bottom-1 padding-x-105">
          <input
            id="condition-all"
            className="usa-checkbox__input"
            type="checkbox"
            value="all"
            onChange={handleSelectAll}
            checked={isAllSelected}
          />
          <label
            className="line-height-sans-6 font-sans-xs margin-y-0 usa-checkbox__label"
            htmlFor="condition-all"
          >
            {isAllSelected ? "Deselect all" : "Select all"}
          </label>
        </div>
        <div className="border-top-1px border-base-lighter margin-x-105"></div>

        {/* (Scroll) Filter Conditions checkboxes */}
        <div className="position-relative bg-white overflow-y-auto maxh-38 display-flex flex-column gap-1 padding-y-1 padding-x-105">
          {Object.keys(filterConditions).map((condition) => (
            <div className="checkbox-color usa-checkbox" key={condition}>
              <input
                id={`condition-${condition}`}
                className="usa-checkbox__input"
                type="checkbox"
                value={condition}
                onChange={handleCheckboxChange}
                checked={filterConditions[condition]}
              />
              <label
                className="line-height-sans-6 font-sans-xs margin-y-0 usa-checkbox__label minw-40"
                htmlFor={`condition-${condition}`}
              >
                {condition}
              </label>
            </div>
          ))}
        </div>
      </div>
      <div className="border-top-1px border-base-lighter margin-x-neg-105"></div>
    </Filter>
  );
};

/**
 * Functional component for filtering eCRs in the Library based on date.
 * @param props component props
 * @param props.initCustomDate initial custom date value
 * @param props.initDateRange initial range option selected
 * @returns The rendered FilterByDate component.
 * - Users can select specific date ranges or specify a custom date range.
 * - Updates the browser's query string when the filter is applied.
 */
const FilterByDate = ({ initCustomDate, initDateRange }: FilterProps) => {
  const today = new Date().toLocaleDateString("en-CA");
  const { deleteQueryParam, updateQueryParam, pushQueryUpdate } =
    useQueryParam();
  const [filterDateOption, setFilterDateOption] =
    useState<string>(initDateRange);
  const [initStart, initEnd] = initCustomDate.split("|");
  const [startDate, setStartDate] = useState<string>(initStart);
  const [endDate, setEndDate] = useState<string>(initEnd);
  const isFilterDateDefault = filterDateOption === DEFAULT_DATE_RANGE;

  // Keep state in sync with updated params while maintaining correct focus on submit
  useEffect(() => {
    setStartDate(initStart);
    setEndDate(initEnd);
  }, [initCustomDate]);
  useEffect(() => {
    setFilterDateOption(initDateRange);
  }, [initDateRange]);

  const submitHandler = () => {
    if (filterDateOption === CustomDateRangeOption) {
      const actualEndDate = endDate || today;
      const datesParam = `${startDate}|${actualEndDate}`;
      updateQueryParam(
        ParamName.DateRange,
        filterDateOption,
        isFilterDateDefault,
      );
      updateQueryParam(ParamName.Dates, datesParam);
      pushQueryUpdate();
    } else {
      updateQueryParam(
        ParamName.DateRange,
        filterDateOption,
        isFilterDateDefault,
      );
      deleteQueryParam(ParamName.Dates);
      pushQueryUpdate();
    }
  };

  return (
    <Filter
      type="Received Date"
      isActive={true}
      resetHandler={() => {
        setStartDate(initStart);
        setEndDate(initEnd);
        setFilterDateOption(initDateRange);
      }}
      icon={Event}
      title={
        filterDateOption === CustomDateRangeOption
          ? startDate &&
            endDate &&
            `From ${formatDateTime(startDate)} to ${formatDateTime(endDate)}`
          : dateRangeLabels[filterDateOption as DateRangeOptions] || ""
      }
      submitHandler={submitHandler}
    >
      <div className="display-flex flex-column">
        <RadioDateOptions
          groupName="filter-date"
          optionsMap={dateRangeLabels}
          onChange={setFilterDateOption}
          currentOption={filterDateOption}
          classNames="padding-bottom-1"
        />
        <div className="border-top-1px border-base-lighter margin-x-105 padding-bottom-1"></div>
        <RadioDateOption
          groupName="filter-date"
          option={CustomDateRangeOption}
          label="Custom date range"
          onChange={setFilterDateOption}
          isChecked={filterDateOption === CustomDateRangeOption}
        />
        {filterDateOption === CustomDateRangeOption && (
          <div className="padding-x-105">
            <CustomDateInput
              label="Start date"
              onDateChange={setStartDate}
              defaultValue={startDate || ""}
              isRequired={true}
            />
            <CustomDateInput
              label="End date"
              onDateChange={setEndDate}
              defaultValue={endDate || ""}
              minValue={startDate || ""}
              isRequired={false}
            />
          </div>
        )}
      </div>
    </Filter>
  );
};

export default Filters;
