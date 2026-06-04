"use client";

import React, { SVGProps } from "react";
import toast from "react-hot-toast";

const inventoryReports = [
  { id: "REP-01", title: "Current Stock Report", desc: "Complete inventory status", generated: "16 Mar 2024" },
  { id: "REP-02", title: "Low Stock Report", desc: "Products below reorder level", generated: "16 Mar 2024" },
  { id: "REP-03", title: "Inventory Valuation", desc: "Total inventory value", generated: "15 Mar 2024" },
  { id: "REP-04", title: "Wastage Report", desc: "Product wastage analysis", generated: "15 Mar 2024" }
];

const procurementReports = [
  { id: "REP-05", title: "Purchase Order Summary", desc: "Overview of all purchase orders", generated: "16 Mar 2024" },
  { id: "REP-06", title: "Supplier Performance", desc: "Metrics on supplier delivery", generated: "14 Mar 2024" },
  { id: "REP-07", title: "Cost Variation Analysis", desc: "Track procurement cost changes", generated: "10 Mar 2024" }
];

export default function ReportsPage() {
  const handleDownloadReportPDF = async (report: any) => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      // Create a temporary hidden container styled like a high-fidelity analytics report
      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      container.style.width = "800px";
      container.style.padding = "40px";
      container.style.background = "#ffffff";
      container.style.color = "#0f172a";
      container.style.fontFamily = "'Helvetica Neue', Helvetica, Arial, sans-serif";
      container.style.boxSizing = "border-box";

      // Choose mock data according to report id
      let reportTableHtml = "";
      let summaryCardsHtml = "";

      if (report.id === "REP-01") {
        // Current Stock Report
        summaryCardsHtml = `
          <div style="display: flex; gap: 15px; margin-bottom: 25px;">
            <div style="flex: 1; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Total SKUs</div>
              <div style="font-size: 18px; font-weight: 700; color: #0f172a;">142</div>
            </div>
            <div style="flex: 1; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Total In-Stock Qty</div>
              <div style="font-size: 18px; font-weight: 700; color: #16a34a;">12,450 Kg</div>
            </div>
            <div style="flex: 1; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Out of Stock SKUs</div>
              <div style="font-size: 18px; font-weight: 700; color: #ef4444;">3</div>
            </div>
          </div>
        `;

        reportTableHtml = `
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; font-size: 11px; font-weight: bold; color: #475569; text-align: left;">
                <th style="padding: 10px;">Product Name</th>
                <th style="padding: 10px;">SKU</th>
                <th style="padding: 10px; text-align: center;">Stock Qty</th>
                <th style="padding: 10px; text-align: center;">Reorder Point</th>
                <th style="padding: 10px; text-align: right;">Status</th>
              </tr>
            </thead>
            <tbody style="font-size: 11px; color: #334155;">
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Fresh Potato</td><td style="padding: 10px;">POT-001</td><td style="padding: 10px; text-align: center;">4,200 Kg</td><td style="padding: 10px; text-align: center;">1,000 Kg</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #16a34a;">Healthy</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Red Onions</td><td style="padding: 10px;">ONN-002</td><td style="padding: 10px; text-align: center;">3,850 Kg</td><td style="padding: 10px; text-align: center;">1,200 Kg</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #16a34a;">Healthy</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Fresh Tomato</td><td style="padding: 10px;">TOM-003</td><td style="padding: 10px; text-align: center;">350 Kg</td><td style="padding: 10px; text-align: center;">500 Kg</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #ca8a04;">Low Stock</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Green Chillies</td><td style="padding: 10px;">CHL-004</td><td style="padding: 10px; text-align: center;">0 Kg</td><td style="padding: 10px; text-align: center;">200 Kg</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #ef4444;">Out of Stock</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Carrots</td><td style="padding: 10px;">CAR-005</td><td style="padding: 10px; text-align: center;">1,500 Kg</td><td style="padding: 10px; text-align: center;">300 Kg</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #16a34a;">Healthy</td></tr>
            </tbody>
          </table>
        `;
      } else if (report.id === "REP-02") {
        // Low Stock Report
        summaryCardsHtml = `
          <div style="display: flex; gap: 15px; margin-bottom: 25px;">
            <div style="flex: 1; background-color: #fefce8; border: 1px solid #fef08a; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #854d0e; margin-bottom: 4px;">Low Stock Alerts</div>
              <div style="font-size: 18px; font-weight: 700; color: #ca8a04;">8 SKUs</div>
            </div>
            <div style="flex: 1; background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #991b1b; margin-bottom: 4px;">Out of Stock Alerts</div>
              <div style="font-size: 18px; font-weight: 700; color: #ef4444;">3 SKUs</div>
            </div>
            <div style="flex: 1; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #166534; margin-bottom: 4px;">Pending Purchase Orders</div>
              <div style="font-size: 18px; font-weight: 700; color: #16a34a;">4 Orders</div>
            </div>
          </div>
        `;

        reportTableHtml = `
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; font-size: 11px; font-weight: bold; color: #475569; text-align: left;">
                <th style="padding: 10px;">Product Name</th>
                <th style="padding: 10px; text-align: center;">Current Qty</th>
                <th style="padding: 10px; text-align: center;">Reorder level</th>
                <th style="padding: 10px; text-align: center;">Suggested PO Qty</th>
                <th style="padding: 10px; text-align: right;">Status</th>
              </tr>
            </thead>
            <tbody style="font-size: 11px; color: #334155;">
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Fresh Tomato</td><td style="padding: 10px; text-align: center;">350 Kg</td><td style="padding: 10px; text-align: center;">500 Kg</td><td style="padding: 10px; text-align: center;">800 Kg</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #ca8a04;">Low Stock</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Green Chillies</td><td style="padding: 10px; text-align: center;">0 Kg</td><td style="padding: 10px; text-align: center;">200 Kg</td><td style="padding: 10px; text-align: center;">500 Kg</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #ef4444;">Out of Stock</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Garlic</td><td style="padding: 10px; text-align: center;">45 Kg</td><td style="padding: 10px; text-align: center;">150 Kg</td><td style="padding: 10px; text-align: center;">300 Kg</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #ca8a04;">Low Stock</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Ginger</td><td style="padding: 10px; text-align: center;">10 Kg</td><td style="padding: 10px; text-align: center;">100 Kg</td><td style="padding: 10px; text-align: center;">200 Kg</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #ef4444;">Out of Stock</td></tr>
            </tbody>
          </table>
        `;
      } else if (report.id === "REP-03") {
        // Inventory Valuation
        summaryCardsHtml = `
          <div style="display: flex; gap: 15px; margin-bottom: 25px;">
            <div style="flex: 1; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Total Value (Cost)</div>
              <div style="font-size: 18px; font-weight: 700; color: #0f172a;">₹5,84,300</div>
            </div>
            <div style="flex: 1; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Total Value (Retail)</div>
              <div style="font-size: 18px; font-weight: 700; color: #16a34a;">₹7,20,500</div>
            </div>
            <div style="flex: 1; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Est. Profit Margin</div>
              <div style="font-size: 18px; font-weight: 700; color: #2563eb;">23.3%</div>
            </div>
          </div>
        `;

        reportTableHtml = `
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; font-size: 11px; font-weight: bold; color: #475569; text-align: left;">
                <th style="padding: 10px;">Category</th>
                <th style="padding: 10px; text-align: center;">Stock Qty</th>
                <th style="padding: 10px; text-align: right;">Avg Cost (₹)</th>
                <th style="padding: 10px; text-align: right;">Avg Retail (₹)</th>
                <th style="padding: 10px; text-align: right;">Total Cost Value</th>
              </tr>
            </thead>
            <tbody style="font-size: 11px; color: #334155;">
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Vegetables</td><td style="padding: 10px; text-align: center;">9,550 Kg</td><td style="padding: 10px; text-align: right;">₹32.00</td><td style="padding: 10px; text-align: right;">₹40.00</td><td style="padding: 10px; text-align: right; font-weight: 700;">₹3,05,600</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Fruits</td><td style="padding: 10px; text-align: center;">2,100 Kg</td><td style="padding: 10px; text-align: right;">₹95.00</td><td style="padding: 10px; text-align: right;">₹115.00</td><td style="padding: 10px; text-align: right; font-weight: 700;">₹1,99,500</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Roots & Tubers</td><td style="padding: 10px; text-align: center;">800 Kg</td><td style="padding: 10px; text-align: right;">₹99.00</td><td style="padding: 10px; text-align: right;">₹120.00</td><td style="padding: 10px; text-align: right; font-weight: 700;">₹79,200</td></tr>
            </tbody>
          </table>
        `;
      } else if (report.id === "REP-04") {
        // Wastage Report
        summaryCardsHtml = `
          <div style="display: flex; gap: 15px; margin-bottom: 25px;">
            <div style="flex: 1; background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #991b1b; margin-bottom: 4px;">Total Wastage Cost</div>
              <div style="font-size: 18px; font-weight: 700; color: #ef4444;">₹12,450</div>
            </div>
            <div style="flex: 1; background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #991b1b; margin-bottom: 4px;">Wastage Qty</div>
              <div style="font-size: 18px; font-weight: 700; color: #ef4444;">340 Kg</div>
            </div>
            <div style="flex: 1; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Wastage Rate (Stock)</div>
              <div style="font-size: 18px; font-weight: 700; color: #2563eb;">2.1%</div>
            </div>
          </div>
        `;

        reportTableHtml = `
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; font-size: 11px; font-weight: bold; color: #475569; text-align: left;">
                <th style="padding: 10px;">Product Name</th>
                <th style="padding: 10px; text-align: center;">Wasted Qty</th>
                <th style="padding: 10px; text-align: left;">Reason</th>
                <th style="padding: 10px; text-align: right;">Unit Cost (₹)</th>
                <th style="padding: 10px; text-align: right;">Total Loss (₹)</th>
              </tr>
            </thead>
            <tbody style="font-size: 11px; color: #334155;">
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Fresh Tomato</td><td style="padding: 10px; text-align: center;">120 Kg</td><td style="padding: 10px;">Rotten / Overripe</td><td style="padding: 10px; text-align: right;">₹35.00</td><td style="padding: 10px; text-align: right; font-weight: 700; color: #ef4444;">₹4,200</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Red Onions</td><td style="padding: 10px; text-align: center;">150 Kg</td><td style="padding: 10px;">Moisture Damage</td><td style="padding: 10px; text-align: right;">₹45.00</td><td style="padding: 10px; text-align: right; font-weight: 700; color: #ef4444;">₹6,750</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Cabbage</td><td style="padding: 10px; text-align: center;">70 Kg</td><td style="padding: 10px;">Transit Damage</td><td style="padding: 10px; text-align: right;">₹21.00</td><td style="padding: 10px; text-align: right; font-weight: 700; color: #ef4444;">₹1,500</td></tr>
            </tbody>
          </table>
        `;
      } else if (report.id === "REP-05") {
        // Purchase Order Summary
        summaryCardsHtml = `
          <div style="display: flex; gap: 15px; margin-bottom: 25px;">
            <div style="flex: 1; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Total POs Raised</div>
              <div style="font-size: 18px; font-weight: 700; color: #0f172a;">24</div>
            </div>
            <div style="flex: 1; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Planned PO Value</div>
              <div style="font-size: 18px; font-weight: 700; color: #0f172a;">₹8,45,200</div>
            </div>
            <div style="flex: 1; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Actual Received Value</div>
              <div style="font-size: 18px; font-weight: 700; color: #16a34a;">₹8,12,050</div>
            </div>
          </div>
        `;

        reportTableHtml = `
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; font-size: 11px; font-weight: bold; color: #475569; text-align: left;">
                <th style="padding: 10px;">PO Number</th>
                <th style="padding: 10px;">Supplier</th>
                <th style="padding: 10px; text-align: center;">Order Date</th>
                <th style="padding: 10px; text-align: right;">Amount (₹)</th>
                <th style="padding: 10px; text-align: right;">Status</th>
              </tr>
            </thead>
            <tbody style="font-size: 11px; color: #334155;">
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #2563eb;">PO-00234</td><td style="padding: 10px;">Green Valley Suppliers</td><td style="padding: 10px; text-align: center;">12 Mar 2024</td><td style="padding: 10px; text-align: right; font-weight: bold;">₹1,45,000</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #16a34a;">Received</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #2563eb;">PO-00235</td><td style="padding: 10px;">Fresh Farms Ltd</td><td style="padding: 10px; text-align: center;">14 Mar 2024</td><td style="padding: 10px; text-align: right; font-weight: bold;">₹88,250</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #16a34a;">Received</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #2563eb;">PO-00236</td><td style="padding: 10px;">Golden Organics</td><td style="padding: 10px; text-align: center;">15 Mar 2024</td><td style="padding: 10px; text-align: right; font-weight: bold;">₹2,10,000</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #ca8a04;">Pending</td></tr>
            </tbody>
          </table>
        `;
      } else if (report.id === "REP-06") {
        // Supplier Performance
        summaryCardsHtml = `
          <div style="display: flex; gap: 15px; margin-bottom: 25px;">
            <div style="flex: 1; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Avg On-Time Rate</div>
              <div style="font-size: 18px; font-weight: 700; color: #16a34a;">94.2%</div>
            </div>
            <div style="flex: 1; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Avg Quality Rating</div>
              <div style="font-size: 18px; font-weight: 700; color: #2563eb;">4.7 / 5.0</div>
            </div>
            <div style="flex: 1; background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #991b1b; margin-bottom: 4px;">Delayed Shipments</div>
              <div style="font-size: 18px; font-weight: 700; color: #ef4444;">2</div>
            </div>
          </div>
        `;

        reportTableHtml = `
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; font-size: 11px; font-weight: bold; color: #475569; text-align: left;">
                <th style="padding: 10px;">Supplier</th>
                <th style="padding: 10px; text-align: center;">Total POs</th>
                <th style="padding: 10px; text-align: center;">On-Time Delivery</th>
                <th style="padding: 10px; text-align: center;">Quality rating</th>
                <th style="padding: 10px; text-align: right;">Status</th>
              </tr>
            </thead>
            <tbody style="font-size: 11px; color: #334155;">
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Green Valley Suppliers</td><td style="padding: 10px; text-align: center;">15</td><td style="padding: 10px; text-align: center;">96.0%</td><td style="padding: 10px; text-align: center;">4.8</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #16a34a;">Preferred</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Fresh Farms Ltd</td><td style="padding: 10px; text-align: center;">8</td><td style="padding: 10px; text-align: center;">91.5%</td><td style="padding: 10px; text-align: center;">4.5</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #16a34a;">Approved</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Golden Organics</td><td style="padding: 10px; text-align: center;">1</td><td style="padding: 10px; text-align: center;">80.0%</td><td style="padding: 10px; text-align: center;">3.9</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #ca8a04;">Under Review</td></tr>
            </tbody>
          </table>
        `;
      } else {
        // Cost Variation Analysis
        summaryCardsHtml = `
          <div style="display: flex; gap: 15px; margin-bottom: 25px;">
            <div style="flex: 1; background-color: #fef2f2; border: 1px solid #fca5a5; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #991b1b; margin-bottom: 4px;">POs with Cost Overrun</div>
              <div style="font-size: 18px; font-weight: 700; color: #ef4444;">6 Orders</div>
            </div>
            <div style="flex: 1; background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #166534; margin-bottom: 4px;">POs with Savings</div>
              <div style="font-size: 18px; font-weight: 700; color: #16a34a;">12 Orders</div>
            </div>
            <div style="flex: 1; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; text-align: center;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 4px;">Net Cost Variance</div>
              <div style="font-size: 18px; font-weight: 700; color: #16a34a;">-₹15,400 (Saved)</div>
            </div>
          </div>
        `;

        reportTableHtml = `
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #e2e8f0;">
            <thead>
              <tr style="background: #f8fafc; border-bottom: 1.5px solid #e2e8f0; font-size: 11px; font-weight: bold; color: #475569; text-align: left;">
                <th style="padding: 10px;">Product</th>
                <th style="padding: 10px; text-align: center;">Planned Unit Price</th>
                <th style="padding: 10px; text-align: center;">Actual Unit Price</th>
                <th style="padding: 10px; text-align: right;">Variance (₹)</th>
                <th style="padding: 10px; text-align: right;">Status</th>
              </tr>
            </thead>
            <tbody style="font-size: 11px; color: #334155;">
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Fresh Tomato</td><td style="padding: 10px; text-align: center;">₹35.00</td><td style="padding: 10px; text-align: center;">₹38.50</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #ef4444;">+₹3.50</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #ef4444;">Cost Increase</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Red Onions</td><td style="padding: 10px; text-align: center;">₹55.00</td><td style="padding: 10px; text-align: center;">₹50.00</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #16a34a;">-₹5.00</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #16a34a;">Savings</td></tr>
              <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px; font-weight: bold; color: #0f172a;">Cabbage</td><td style="padding: 10px; text-align: center;">₹25.00</td><td style="padding: 10px; text-align: center;">₹21.00</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #16a34a;">-₹4.00</td><td style="padding: 10px; text-align: right; font-weight: bold; color: #16a34a;">Savings</td></tr>
            </tbody>
          </table>
        `;
      }

      container.innerHTML = `
        <div style="width: 100%;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px;">
            <div>
              <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0 0 5px 0; letter-spacing: -0.5px;">ANALYTICS REPORT</h1>
              <div style="font-size: 14px; font-weight: bold; color: #3b82f6; margin-bottom: 4px;">${report.title}</div>
              <div style="font-size: 12px; color: #64748b;">${report.desc}</div>
            </div>
            <div style="text-align: right; font-size: 12px; line-height: 1.6;">
              <div style="font-size: 13px; font-weight: bold; color: #0f172a; margin-bottom: 6px;">Report Details:</div>
              <div><strong>Report ID:</strong> ${report.id}</div>
              <div><strong>Generated Date:</strong> ${report.generated}</div>
              <div><strong>System Status:</strong> Active</div>
            </div>
          </div>

          <!-- Summary Cards Section -->
          ${summaryCardsHtml}

          <!-- Data Table -->
          <h3 style="font-size: 14px; font-weight: bold; color: #0f172a; margin-bottom: 12px;">Detailed Report Records</h3>
          ${reportTableHtml}

          <!-- Footer/Notes -->
          <div style="font-size: 10px; color: #94a3b8; line-height: 1.5; margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 15px;">
            <div><strong>Disclaimer:</strong> This report is computer-generated from the active Warehouse Management Database system on 2026-06-04. Verify data with operations desk for accounting audits.</div>
          </div>
        </div>
      `;

      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });

      document.body.removeChild(container);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [canvas.width / 2, canvas.height / 2]
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
      pdf.save(`${report.title.toLowerCase().replace(/\s+/g, "_")}_${report.id.toLowerCase()}.pdf`);
      toast.success(`${report.title} downloaded as PDF!`);
    } catch (error) {
      console.error("Failed to generate report PDF:", error);
      toast.error(`Failed to download report PDF.`);
    }
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1400px]">
      
      {/* Top Header Row */}
      <div className="flex justify-between items-center">
        <h1 className="text-[24px] font-bold text-[#0f172a]">Reports & Analytics</h1>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white text-[#475569] text-[14px] font-medium rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm tracking-tight">
            <CalendarIcon className="w-4 h-4 text-[#64748b]" />
            28 Feb 24 - 31 Mar 25
            <ChevronDownIcon className="w-4 h-4 ml-1" />
          </button>
          <button className="flex items-center justify-center p-2 border border-[#e2e8f0] bg-white text-[#475569] rounded-lg hover:bg-[#f8fafc] transition-colors shadow-sm">
            <MoreVerticalIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Group 1: Inventory Reports */}
      <div className="flex flex-col gap-5">
         
         {/* Category Header */}
         <div className="flex items-center gap-3">
            <div className="w-[34px] h-[34px] bg-[#3b82f6] rounded flex items-center justify-center text-white shadow-sm shrink-0">
               <BoxIcon className="w-5 h-5" />
            </div>
            <h2 className="text-[17px] font-bold text-[#0f172a] tracking-tight">Inventory Reports</h2>
         </div>

         {/* Grid Cards Array */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {inventoryReports.map((report) => (
              <div key={report.id} className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col pt-6">
                 
                 {/* Metadata Stack */}
                 <div className="flex flex-col gap-1 mb-6 flex-1">
                    <span className="text-[#0f172a] font-bold text-[15px]">{report.title}</span>
                    <span className="text-[#64748b] text-[13px]">{report.desc}</span>
                    <span className="text-[#94a3b8] text-[12px] mt-3">Last generated: {report.generated}</span>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex gap-3">
                    <button className="flex-1 py-2.5 border border-[#e2e8f0] text-[#475569] hover:text-[#0f172a] hover:bg-[#f8fafc] rounded-lg font-bold text-[13.5px] transition-colors shadow-sm flex items-center justify-center gap-2">
                       <FileIcon className="w-4 h-4 text-[#94a3b8]" />
                       View
                    </button>
                    <button 
                       onClick={() => handleDownloadReportPDF(report)}
                       className="flex-1 right-btn py-2.5 bg-[#16a34a] text-white hover:bg-[#15803d] rounded-lg font-bold text-[13.5px] transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                       <DownloadIcon className="w-4 h-4" />
                       Download
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Group 2: Procurement Reports */}
      <div className="flex flex-col gap-5">
         
         {/* Category Header */}
         <div className="flex items-center gap-3">
            <div className="w-[34px] h-[34px] bg-[#a855f7] rounded flex items-center justify-center text-white shadow-sm shrink-0">
               <ShoppingCartIcon className="w-5 h-5" />
            </div>
            <h2 className="text-[17px] font-bold text-[#0f172a] tracking-tight">Procurement Reports</h2>
         </div>

         {/* Grid Cards Array */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {procurementReports.map((report) => (
              <div key={report.id} className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col pt-6">
                 
                 {/* Metadata Stack */}
                 <div className="flex flex-col gap-1 mb-6 flex-1">
                    <span className="text-[#0f172a] font-bold text-[15px]">{report.title}</span>
                    <span className="text-[#64748b] text-[13px]">{report.desc}</span>
                    <span className="text-[#94a3b8] text-[12px] mt-3">Last generated: {report.generated}</span>
                 </div>

                 {/* Action Buttons */}
                 <div className="flex gap-3">
                    <button className="flex-1 py-2.5 border border-[#e2e8f0] text-[#475569] hover:text-[#0f172a] hover:bg-[#f8fafc] rounded-lg font-bold text-[13.5px] transition-colors shadow-sm flex items-center justify-center gap-2">
                       <FileIcon className="w-4 h-4 text-[#94a3b8]" />
                       View
                    </button>
                    <button 
                       onClick={() => handleDownloadReportPDF(report)}
                       className="flex-1 right-btn py-2.5 bg-[#16a34a] text-white hover:bg-[#15803d] rounded-lg font-bold text-[13.5px] transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                       <DownloadIcon className="w-4 h-4" />
                       Download
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>

    </div>
  );
}

// Inline SVGs
function CalendarIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

function MoreVerticalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="1"/>
      <circle cx="12" cy="5" r="1"/>
      <circle cx="12" cy="19" r="1"/>
    </svg>
  );
}

function BoxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
}

function ShoppingCartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="9" cy="21" r="1"/>
      <circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  );
}

function FileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}

function DownloadIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/>
      <line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  );
}
