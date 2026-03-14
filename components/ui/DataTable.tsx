import React from 'react';
import { Button } from './Button';
import { Input } from './Input';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  filters?: React.ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    onNext: () => void;
    onPrev: () => void;
  };
}

export function DataTable<T>({ 
  columns, 
  data, 
  searchPlaceholder = "Search...", 
  onSearch, 
  filters,
  pagination
}: DataTableProps<T>) {
  return (
    <div className="bg-white border border-[#f3f4f6] rounded-xl flex flex-col">
      {/* Header operations area */}
      <div className="p-4 border-b border-[#f3f4f6] flex flex-wrap items-center gap-4 bg-[#f9fafb] rounded-t-xl">
        <span className="text-sm font-medium text-[#4b5563]">Filter by:</span>
        {onSearch && (
          <div className="w-64">
            <Input 
              placeholder={searchPlaceholder} 
              onChange={(e) => onSearch(e.target.value)}
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              }
            />
          </div>
        )}
        {filters && <div className="flex gap-4">{filters}</div>}
        {pagination && (
          <div className="ml-auto text-sm text-[#6b7280]">
            {data.length} results
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#f3f4f6]">
              {columns.map((col, i) => (
                <th key={i} className="py-3 px-4 text-xs font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-[#374151]">
                    {col.header}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m18 15-6-6-6 6"/>
                    </svg>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8 text-center text-[#6b7280]">
                  No data found
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr key={rowIndex} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition-colors">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="py-4 px-4 align-middle">
                      {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey]) : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {pagination && (
        <div className="p-4 flex items-center justify-between border-t border-[#f3f4f6]">
          <div className="text-sm text-[#6b7280]">
            Showing {(pagination.currentPage - 1) * 10 + 1}-{Math.min(pagination.currentPage * 10, pagination.totalItems)} of {(pagination.totalItems)}
          </div>
          <div className="flex items-center gap-2">
            <button 
              className="text-sm text-[#6b7280] hover:text-[#111827] disabled:opacity-50"
              onClick={pagination.onPrev}
              disabled={pagination.currentPage === 1}
            >
              &lt; Prev
            </button>
            <div className="w-8 h-8 rounded-full bg-[#07ac57] text-white flex items-center justify-center text-sm font-medium">
              {pagination.currentPage}
            </div>
            <button 
              className="text-sm text-[#6b7280] hover:text-[#111827] disabled:opacity-50"
              onClick={pagination.onNext}
              disabled={pagination.currentPage === pagination.totalPages}
            >
              Next &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
