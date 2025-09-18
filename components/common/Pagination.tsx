"use client";

import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalElements: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  pageSize,
  totalElements,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
      {/* Info text */}
      <div className="text-sm text-gray-700">
        Showing{" "}
        <span className="font-medium">{currentPage * pageSize + 1}</span> to{" "}
        <span className="font-medium">
          {Math.min((currentPage + 1) * pageSize, totalElements)}
        </span>{" "}
        of <span className="font-medium">{totalElements}</span> results
      </div>

      {/* Page buttons */}
      <nav className="inline-flex -space-x-px rounded-md shadow-sm">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i)}
            className={`px-4 py-2 border text-sm font-medium ${
              currentPage === i
                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
            } ${i === 0 ? "rounded-l-md" : ""} ${
              i === totalPages - 1 ? "rounded-r-md" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </nav>
    </div>
  );
};
