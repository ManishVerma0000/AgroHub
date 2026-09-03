'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { ImagePreviewModal } from '@/components/ui/ImagePreviewModal';

export interface ProductData {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  subcategoryId: string;
  categoryName?: string;
  hsn: string;
  basePrice: string;
  b2b: 'Enabled' | 'Off';
  status: 'Active' | 'Inactive';
  createdDate: string;
  imageUrl?: string | null;
}

interface ProductListProps {
  data: ProductData[];
  categories: any[];
  onEdit: (item: ProductData) => void;
  onDelete: (id: string) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize?: number;
    onNext: () => void;
    onPrev: () => void;
  };
}

export function ProductList({ data, categories, onEdit, onDelete, pagination }: ProductListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ProductData | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleSelectAllPage = () => {
    const pageIds = filteredData.map(item => item.id);
    const allSelected = pageIds.length > 0 && pageIds.every(id => selectedItems.includes(id));
    if (allSelected) {
      setSelectedItems(selectedItems.filter(id => !pageIds.includes(id)));
    } else {
      setSelectedItems(Array.from(new Set([...selectedItems, ...pageIds])));
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const itemsToExport = data.filter(item => selectedItems.includes(item.id));

      if (itemsToExport.length === 0) {
        toast.error("No items selected to export.");
        return;
      }

      // Create a temporary hidden container styled beautifully
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      container.style.width = "800px";
      container.style.padding = "40px";
      container.style.background = "#ffffff";
      container.style.color = "#0f172a";
      container.style.fontFamily = "'Inter', system-ui, -apple-system, sans-serif";
      container.style.boxSizing = "border-box";

      const rowsHtml = itemsToExport.map(item => {
        const catName = item.categoryName || categories.find(c => c.id === item.categoryId)?.name || item.categoryId;
        return `
          <tr style="border-bottom: 1px solid #e2e8f0; font-size: 13px;">
            <td style="padding: 12px 10px; font-weight: 600; color: #0f172a; word-break: break-word; white-space: normal;">${item.name}</td>
            <td style="padding: 12px 10px; color: #475569; word-break: break-word; white-space: normal;">${item.code}</td>
            <td style="padding: 12px 10px; color: #475569; word-break: break-word; white-space: normal;">${catName}</td>
            <td style="padding: 12px 10px; color: #475569;">${item.hsn}</td>
            <td style="padding: 12px 10px; font-weight: 600; color: #0f172a;">₹${item.basePrice}</td>
            <td style="padding: 12px 10px; color: #475569;">${item.b2b}</td>
            <td style="padding: 12px 10px;">
              <span style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; ${
                item.status === 'Active' 
                  ? 'background: #ecfdf5; color: #059669;' 
                  : 'background: #f3f4f6; color: #6b7280;'
              }">${item.status}</span>
            </td>
          </tr>
        `;
      }).join("");

      container.innerHTML = `
        <div style="width: 100%;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; border-bottom: 2px solid #07ac57; padding-bottom: 20px;">
            <div>
              <h1 style="font-size: 28px; font-weight: 800; color: #111827; margin: 0 0 5px 0;">PRODUCTS REPORT</h1>
              <p style="font-size: 14px; color: #475569; margin: 0;">Product Catalogue Export</p>
            </div>
            <div style="text-align: right; font-size: 12px; color: #475569; line-height: 1.5;">
              <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
              <div><strong>Selected Items:</strong> ${itemsToExport.length}</div>
            </div>
          </div>

          <!-- Summary Metrics Cards -->
          <div style="display: flex; gap: 20px; margin-bottom: 30px;">
            <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; text-align: left;">
              <div style="font-size: 12px; color: #64748b; font-weight: 600; margin-bottom: 5px; text-transform: uppercase;">Total Items Selected</div>
              <div style="font-size: 24px; font-weight: 700; color: #0f172a;">${itemsToExport.length}</div>
            </div>
          </div>

          <!-- Table -->
          <table style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 20px; table-layout: fixed;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 2px solid #cbd5e1; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase;">
                <th style="padding: 10px; width: 25%;">Product</th>
                <th style="padding: 10px; width: 15%;">Code</th>
                <th style="padding: 10px; width: 20%;">Category</th>
                <th style="padding: 10px; width: 10%;">HSN</th>
                <th style="padding: 10px; width: 12%;">Base Price</th>
                <th style="padding: 10px; width: 8%;">B2B</th>
                <th style="padding: 10px; width: 10%;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <!-- Footer -->
          <div style="margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 15px; text-align: center; font-size: 11px; color: #94a3b8;">
            This document is a computer-generated report. All data is real-time product catalogue information at the time of export.
          </div>
        </div>
      `;

      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: 800,
        width: 800
      });

      document.body.removeChild(container);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`selected_products_catalogue.pdf`);
      toast.success("Products list downloaded successfully as A4 PDF!");
    } catch (error) {
      console.error("Failed to generate PDF report:", error);
      toast.error("Failed to generate PDF download.");
    }
  };

  const columns: Column<ProductData>[] = [
    {
      header: 'Select',
      cell: (item) => (
        <input 
          type="checkbox" 
          checked={selectedItems.includes(item.id)}
          onChange={() => handleSelectItem(item.id)}
          className="rounded border-[#cbd5e1] text-[#07ac57] cursor-pointer" 
        />
      )
    },
    {
      header: 'Product',
      cell: (item) => (
        <div className="flex items-center gap-3">
          {/* Clickable image/thumbnail */}
          {item.imageUrl ? (
            <button
              type="button"
              title="Click to preview image"
              onClick={() => setPreviewImage(item.imageUrl!)}
              className="w-10 h-10 rounded overflow-hidden border border-[#e5e7eb] hover:ring-2 hover:ring-[#07ac57]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#07ac57] group flex-shrink-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-200" />
            </button>
          ) : (
            <div className="w-10 h-10 rounded bg-[#dcfce7] flex items-center justify-center text-[#166534] bg-opacity-40 flex-shrink-0">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
              </svg>
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium text-[#111827]">{item.name}</span>
            <span className="text-xs text-[#6b7280]">{item.code}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Category',
      cell: (item) => (
        <Badge variant="blue" className="font-normal border border-blue-200 bg-blue-50 text-center inline-block">
          {item.categoryName || item.categoryId}
        </Badge>
      )
    },
    {
      header: 'HSN',
      accessorKey: 'hsn',
    },
    {
      header: 'Base Price (Kg)',
      accessorKey: 'basePrice',
    },
    {
      header: 'B2B',
      cell: (item) => (
        <Badge variant={item.b2b === 'Enabled' ? 'blue' : 'neutral'} className={item.b2b === 'Enabled' ? 'bg-[#e0e7ff] text-[#3730a3]' : 'bg-[#f3f4f6] text-[#6b7280]'}>
          {item.b2b}
        </Badge>
      )
    },
    {
      header: 'Status',
      cell: (item) => (
        <Badge variant={item.status === 'Active' ? 'success' : 'neutral'}>
          {item.status}
        </Badge>
      )
    },
    {
      header: 'Created Date',
      cell: (item) => (
        <div className="flex flex-col text-sm text-[#4b5563]">
          <span>{item.createdDate}</span>
        </div>
      )
    },
    {
      header: 'Actions',
      cell: (item) => (
        <div className="flex gap-2">
          <button
            className="text-blue-500 hover:text-blue-700"
            onClick={() => onEdit(item)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          </button>
          <button
            className="text-red-500 hover:text-red-700"
            onClick={() => {
              setItemToDelete(item);
              setDeleteModalOpen(true);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
          </button>
        </div>
      )
    }
  ];

  const filteredData = data.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          d.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? d.categoryId === categoryFilter : true;
    const matchesStatus = statusFilter ? d.status === statusFilter : true;
    const matchesDate = dateFilter ? d.createdDate === dateFilter : true;
    return matchesSearch && matchesCategory && matchesStatus && matchesDate;
  });

  const isAllPageSelected = filteredData.length > 0 && filteredData.every(item => selectedItems.includes(item.id));

  return (
    <>
      {selectedItems.length > 0 && (
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl px-5 py-3 flex justify-between items-center mb-4 animate-in fade-in slide-in-from-top-1 duration-200">
          <span className="text-sm font-semibold text-[#1e40af]">{selectedItems.length} item(s) selected</span>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownloadPDF}
              className="bg-[#07ac57] text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </button>
            <button 
              onClick={() => setSelectedItems([])}
              className="text-[#4b5563] hover:text-[#111827] px-3 py-2 text-sm font-medium transition-colors"
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
      <DataTable
        columns={columns}
        data={filteredData}
        searchPlaceholder="Search products..."
        onSearch={setSearchTerm}
        filters={
          <>
            <Button 
              variant="outline" 
              onClick={handleSelectAllPage}
              className="text-xs h-10 px-3 whitespace-nowrap"
            >
              {isAllPageSelected ? "Deselect Page" : "Select Page"}
            </Button>
            <input 
              type="date"
              className="hidden sm:block border border-[#d1d5db] rounded-lg px-3 py-2 text-sm text-[#374151] focus:outline-none focus:ring-2 focus:ring-[#07ac57]/20 focus:border-[#07ac57] h-10 w-40 bg-white"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
            <Select
              className="w-40"
              options={[
                { label: 'All Categories', value: '' },
                ...categories.map(c => ({ label: c.name, value: c.id }))
              ]}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
            <Select
              className="w-40"
              options={[
                { label: 'All Statuses', value: '' },
                { label: 'Active', value: 'Active' },
                { label: 'Inactive', value: 'Inactive' }
              ]}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            />
          </>
        }
        pagination={pagination}
      />

      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={() => {
          if (itemToDelete) {
            onDelete(itemToDelete.id);
          }
        }}
        itemName={itemToDelete?.name}
      />

      <ImagePreviewModal
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        imageUrl={previewImage}
        altText="Product Image"
      />
    </>
  );
}
