

import "./Pagniation.css";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  
  // function to calculate the page numbers to display based on the current page and total pages
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const siblingCount = 2; 

    // condition to show all pages if total pages are less than or equal to 5
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    // calculate the neighboring boundaries
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    // always add the first page
    pages.push(1);

    if (showLeftDots) {
      pages.push("...");
    } else if (leftSiblingIndex > 1) {
      // if dots are not shown, add pages between 1 and the left sibling
      for (let i = 2; i < leftSiblingIndex; i++) pages.push(i);
    }

    // add the current page and its neighbors
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i);
      }
    }

    if (showRightDots) {
      pages.push("...");
    } else if (rightSiblingIndex < totalPages - 1) {
      // if dots are not shown, add pages between the right sibling and the last page
      for (let i = rightSiblingIndex + 1; i < totalPages; i++) pages.push(i);
    }

    // always add the last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-container">
      {/* Previous page button */}
      <button 
        className="pagination-arrow"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        &lt;
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page, index) => {
        if (page === "...") {
          return <span key={`dots-${index}`} className="pagination-dots">...</span>;
        }

        return (
          <button
            key={`page-${page}`}
            className={`pagination-number ${currentPage === page ? "active" : ""}`}
            onClick={() => onPageChange(page as number)}
          >
            {page}
          </button>
        );
      })}

      {/* Next page button */}
      <button 
        className="pagination-arrow"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
