import React from "react";

import { Button, Pagination as USWDSPagination } from "@trussworks/react-uswds";
import classnames from "classnames";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { NavigateBefore, NavigateNext } from "./Icon";

type PaginationProps = React.ComponentProps<typeof USWDSPagination>;

/**
 * A copy of the Trussworks USWDS Pagination that will make the previous and forward buttons invisible
 * @param props - properties Pagination component
 * @param props.pathname - pathname of results page. Only used when onClick is not used
 * @param props.totalPages - total items divided by items per page
 * @param props.currentPage - current page number (starting at 1)
 * @param props.className - classes to be applied to the nav
 * @param props.maxSlots - number of pagination "slots"
 * @param props.onClickPrevious - function that triggers on previous page
 * @param props.onClickNext - function that triggers on next page
 * @param props.onClickPageNumber - function that triggers on page number
 * @returns - Pagination component
 */
export const Pagination = ({
  pathname,
  totalPages,
  currentPage,
  className,
  maxSlots = 7,
  onClickPrevious,
  onClickNext,
  onClickPageNumber,
  ...props
}: PaginationProps): React.ReactElement => {
  const navClasses = classnames("usa-pagination", className);

  const isOnFirstPage = currentPage === 1;
  const isOnLastPage = totalPages ? currentPage === totalPages : false;

  const showOverflow = totalPages ? totalPages > maxSlots : true; // If more pages than slots, use overflow indicator(s)

  const middleSlot = Math.round(maxSlots / 2); // 4 if maxSlots is 7
  const isBeforeMiddleSlot = !!(
    totalPages && totalPages - currentPage >= middleSlot
  );
  const showPrevOverflow = showOverflow && currentPage > middleSlot;
  const showNextOverflow = isBeforeMiddleSlot || !totalPages;
  // Assemble array of page numbers to be shown
  const currentPageRange: Array<number | "overflow"> =
    showOverflow || !totalPages
      ? [currentPage]
      : Array.from({ length: totalPages }).map((_, i) => i + 1);

  if (showOverflow) {
    // Determine range of pages to show based on current page & number of slots
    // Follows logic described at: https://designsystem.digital.gov/components/pagination/
    const prevSlots = isOnFirstPage ? 0 : showPrevOverflow ? 2 : 1; // first page + prev overflow
    const nextSlots = isOnLastPage ? 0 : showNextOverflow ? 2 : 1; // next overflow + last page
    const pageRangeSize = maxSlots - 1 - (prevSlots + nextSlots); // remaining slots to show (minus one for the current page)

    // Determine how many slots we have before/after the current page
    let currentPageBeforeSize = 0;
    let currentPageAfterSize = 0;
    if (showPrevOverflow && showNextOverflow) {
      // We are in the middle of the set, there will be overflow (...) at both the beginning & end
      // Ex: [1] [...] [9] [10] [11] [...] [24]
      currentPageBeforeSize = Math.round((pageRangeSize - 1) / 2);
      currentPageAfterSize = pageRangeSize - currentPageBeforeSize;
    } else if (showPrevOverflow) {
      // We are in the end of the set, there will be overflow (...) at the beginning
      // Ex: [1] [...] [20] [21] [22] [23] [24]
      currentPageAfterSize = (totalPages || 0) - currentPage - 1; // current & last
      currentPageAfterSize =
        currentPageAfterSize < 0 ? 0 : currentPageAfterSize;
      currentPageBeforeSize = pageRangeSize - currentPageAfterSize;
    } else if (showNextOverflow) {
      // We are in the beginning of the set, there will be overflow (...) at the end
      // Ex: [1] [2] [3] [4] [5] [...] [24]
      currentPageBeforeSize = currentPage - 2; // first & current
      currentPageBeforeSize =
        currentPageBeforeSize < 0 ? 0 : currentPageBeforeSize;
      currentPageAfterSize = pageRangeSize - currentPageBeforeSize;
    }

    // Populate the remaining slots
    let counter = 1;
    while (currentPageBeforeSize > 0) {
      // Add previous pages before the current page
      currentPageRange.unshift(currentPage - counter);
      counter++;
      currentPageBeforeSize--;
    }

    counter = 1;
    while (currentPageAfterSize > 0) {
      // Add subsequent pages after the current page
      currentPageRange.push(currentPage + counter);
      counter++;
      currentPageAfterSize--;
    }

    // Add prev/next overflow indicators, and first/last pages as needed
    if (showPrevOverflow) currentPageRange.unshift("overflow");
    if (currentPage !== 1) currentPageRange.unshift(1);
    if (showNextOverflow) currentPageRange.push("overflow");
    if (totalPages && currentPage !== totalPages)
      currentPageRange.push(totalPages);
  }

  const prevPage = !isOnFirstPage && currentPage - 1;
  const nextPage = !isOnLastPage && currentPage + 1;

  return (
    <nav aria-label="Pagination" className={navClasses} {...props}>
      <ul className="usa-pagination__list">
        <li className="usa-pagination__item usa-pagination__arrow">
          {/* add visible-hidden */}
          {onClickPrevious ? (
            <Button
              type="button"
              unstyled={true}
              className={classnames(
                "usa-pagination__link usa-pagination__previous-page text-bold",
                { "visibility-hidden": !prevPage },
              )}
              aria-label="Previous page"
              data-testid="pagination-previous"
              onClick={onClickPrevious}
              hidden={!prevPage}
            >
              <NavigateBefore aria-hidden={true} className="text-ink" />
              <span className="usa-pagination__link-text">Previous</span>
            </Button>
          ) : (
            <Link
              href={createPageURL(pathname, prevPage || 0)}
              className={classnames(
                "usa-pagination__link usa-pagination__previous-page text-bold",
                { "visibility-hidden": !prevPage },
              )}
              hidden={!prevPage}
              aria-label="Previous page"
            >
              <NavigateBefore aria-hidden={true} className="text-ink" />
              <span className="usa-pagination__link-text">Previous</span>
            </Link>
          )}
        </li>

        {currentPageRange.map((pageNum, i) =>
          pageNum === "overflow" ? (
            <PaginationOverflow key={`pagination_overflow_${i}`} />
          ) : (
            <PaginationPage
              key={`pagination_page_${pageNum}`}
              page={pageNum}
              pathname={pathname}
              isCurrent={pageNum === currentPage}
              onClickPageNumber={onClickPageNumber}
            />
          ),
        )}

        {/* add visible-hidden to keep width the same */}
        <li className="usa-pagination__item usa-pagination__arrow">
          {onClickNext ? (
            <Button
              type="button"
              unstyled={true}
              className={classnames(
                "usa-pagination__link usa-pagination__next-page text-bold",
                { "visibility-hidden": !nextPage },
              )}
              hidden={!nextPage}
              aria-label="Next page"
              data-testid="pagination-next"
              onClick={onClickNext}
            >
              <span className="usa-pagination__link-text">Next</span>
              <NavigateNext aria-hidden={true} className="text-ink" />
            </Button>
          ) : (
            <Link
              href={createPageURL(pathname, nextPage || 0)}
              className={classnames(
                "usa-pagination__link usa-pagination__next-page text-bold",
                { "visibility-hidden": !nextPage },
              )}
              hidden={!nextPage}
              aria-label="Next page"
            >
              <span className="usa-pagination__link-text">Next</span>
              <NavigateNext aria-hidden={true} className="text-ink" />
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

type PaginationPageProps = Pick<
  PaginationProps,
  "pathname" | "onClickPageNumber"
> & {
  page: number;
  isCurrent?: boolean;
};

const PaginationPage = ({
  pathname,
  page,
  isCurrent,
  onClickPageNumber,
}: PaginationPageProps) => {
  const linkClasses = classnames("usa-pagination__button text-bold", {
    "usa-current": isCurrent,
  });

  return (
    <li className="usa-pagination__item usa-pagination__page-no">
      {onClickPageNumber ? (
        <Button
          type="button"
          unstyled={true}
          data-testid="pagination-page-number"
          className={linkClasses}
          aria-label={`Page ${page}`}
          aria-current={isCurrent ? "page" : undefined}
          onClick={(event) => {
            onClickPageNumber(event, page);
          }}
        >
          {page}
        </Button>
      ) : (
        <Link
          href={createPageURL(pathname, page)}
          className={linkClasses}
          aria-label={`Page ${page}`}
          aria-current={isCurrent ? "page" : undefined}
        >
          {page}
        </Link>
      )}
    </li>
  );
};

const PaginationOverflow = () => (
  <li
    className="usa-pagination__item usa-pagination__overflow"
    aria-label="ellipsis indicating non-visible pages"
  >
    <span>…</span>
  </li>
);

/**
 * Custom function used to create a new path with existing search parameters
 * @param pathname - pathname of the string
 * @param pageNumber - number to append to url params
 * @returns - string of path and search params
 */
const createPageURL = (
  pathname: string,
  pageNumber: number | string,
): string => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  params.set("page", pageNumber.toString());
  return `${pathname}?${params.toString()}`;
};
