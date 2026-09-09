"use client";

import React, { useState } from "react";
import { SVGProps } from "react";
import { ConfirmDeleteModal } from "../../../../components/ui/ConfirmDeleteModal";
import Link from "next/link";
import { productService } from "../../../../services/productService";
import { warehouseProductService } from "../../../../services/warehouseProductService";
import { categoryService } from "../../../../services/categoryService";
import { StockActionModal, StockActionType } from "../../../../components/Products/StockActionModal";
import { warehouseService } from "../../../../services/warehouseService";
import { wmsAuthService } from "../../../../services/wmsAuthService";
import toast from "react-hot-toast";

const HINDI_PRODUCT_TRANSLATIONS: Record<string, string> = {
  "tomato": "टमाटर",
  "desi tomato": "देसी टमाटर",
  "hybrid tomato": "हाइब्रिड टमाटर",
  "potato": "आलू",
  "onion": "प्याज",
  "red onion": "लाल प्याज",
  "white onion": "सफेद प्याज",
  "ginger": "अदरक",
  "garlic": "लहसुन",
  "green chilli": "हरी मिर्च",
  "chilli": "मिर्च",
  "lemon": "नींबू",
  "cabbage": "पत्ता गोभी",
  "cauliflower": "फूल गोभी",
  "carrot": "गाजर",
  "cucumber": "खीरा",
  "capsicum": "शिमला मिर्च",
  "green capsicum": "हरी शिमला मिर्च",
  "red capsicum": "लाल शिमला मिर्च",
  "yellow capsicum": "पीली शिमला मिर्च",
  "lady finger": "भिंडी",
  "okra": "भिंडी",
  "bhindi": "भिंडी",
  "brinjal": "बैंगन",
  "eggplant": "बैंगन",
  "round brinjal": "गोल बैंगन",
  "bottle gourd": "लौकी",
  "lauki": "लौकी",
  "bitter gourd": "करेला",
  "karela": "करेला",
  "ridge gourd": "तुरई",
  "turai": "तुरई",
  "sponge gourd": "गिलकी / तोरी",
  "pumpkin": "कद्दू / सीताफल",
  "spinach": "पालक",
  "coriander": "हरा धनिया",
  "mint": "पुदीना",
  "fenugreek": "मेथी",
  "methi": "मेथी",
  "green peas": "हरी मटर",
  "peas": "मटर",
  "mushroom": "मशरूम",
  "button mushroom": "बटन मशरूम",
  "apple": "सेब",
  "banana": "केला",
  "mango": "आम",
  "alphonso mango": "अल्फांसो आम",
  "orange": "संतरा",
  "papaya": "पपीता",
  "pomegranate": "अनार",
  "watermelon": "तरबूज",
  "muskmelon": "खरबूजा",
  "grapes": "अंगूर",
  "green grapes": "हरे अंगूर",
  "black grapes": "काले अंगूर",
  "sweet potato": "शकरकंद",
  "beetroot": "चुकंदर",
  "radish": "मूली",
  "beans": "बीन्स / फलियां",
  "french beans": "फ्रेंच बीन्स",
  "cluster beans": "ग्वार फली",
  "broccoli": "ब्रोकली",
  "sweet corn": "स्वीट कॉर्न",
  "corn": "मक्का / भुट्टा",
  "pineapple": "अनानास",
  "guava": "अमरूद",
  "coconut": "नारियल",
  "raw coconut": "कच्चा नारियल",
  "amla": "आंवला",
  "drumstick": "सहजन / मोरिंगा",
  "arbi": "अरबी",
  "colocasia": "अरबी",
  "raw banana": "कच्चा केला",
  "raw mango": "कच्चा आम / केरी",
  "curry leaves": "कढ़ी पत्ता",
  "paneer": "पनीर",
  "milk": "दूध",
  "curd": "दही",
  "ghee": "घी"
};

const translateProductNameToHindi = (name: string): string => {
  if (!name) return "";
  const lower = name.trim().toLowerCase();
  if (HINDI_PRODUCT_TRANSLATIONS[lower]) {
    return HINDI_PRODUCT_TRANSLATIONS[lower];
  }
  
  let translated = name;
  const wordReplacements: [RegExp, string][] = [
    [/\bdesi\b/gi, "देसी"],
    [/\borganic\b/gi, "ऑर्गेनिक"],
    [/\bfresh\b/gi, "ताज़ा"],
    [/\bhybrid\b/gi, "हाइब्रिड"],
    [/\bgreen\b/gi, "हरी"],
    [/\bred\b/gi, "लाल"],
    [/\bwhite\b/gi, "सफेद"],
    [/\byellow\b/gi, "पीली"],
    [/\bsmall\b/gi, "छोटा"],
    [/\bbig\b/gi, "बड़ा"],
    [/\bpremium\b/gi, "प्रीमियम"],
    [/\btomato\b/gi, "टमाटर"],
    [/\bpotato\b/gi, "आलू"],
    [/\bonion\b/gi, "प्याज"],
    [/\bginger\b/gi, "अदरक"],
    [/\bgarlic\b/gi, "लहसुन"],
    [/\bchilli\b/gi, "मिर्च"],
    [/\blemon\b/gi, "नींबू"],
    [/\bcabbage\b/gi, "पत्ता गोभी"],
    [/\bcauliflower\b/gi, "फूल गोभी"],
    [/\bcarrot\b/gi, "गाजर"],
    [/\bcucumber\b/gi, "खीरा"],
    [/\bcapsicum\b/gi, "शिमला मिर्च"],
    [/\bapple\b/gi, "सेब"],
    [/\bbanana\b/gi, "केला"],
    [/\bmango\b/gi, "आम"],
    [/\bspinach\b/gi, "पालक"],
    [/\bcoriander\b/gi, "धनिया"],
    [/\bmint\b/gi, "पुदीना"],
    [/\bmushroom\b/gi, "मशरूम"],
    [/\blady\s*finger\b/gi, "भिंडी"],
    [/\bbhindi\b/gi, "भिंडी"],
    [/\bbrinjal\b/gi, "बैंगन"],
    [/\blauki\b/gi, "लौकी"],
    [/\bkarela\b/gi, "करेला"],
    [/\bmilk\b/gi, "दूध"],
    [/\bpaneer\b/gi, "पनीर"],
    [/\bpeas\b/gi, "मटर"]
  ];

  for (const [regex, replacement] of wordReplacements) {
    if (regex.test(translated)) {
      translated = translated.replace(regex, replacement);
    }
  }

  return translated;
};

const translateUnitToHindi = (unit: string): string => {
  const u = (unit || '').trim().toLowerCase();
  if (u === 'kg' || u === 'kgs' || u === 'kilogram') return 'किलो';
  if (u === 'gm' || u === 'gram' || u === 'g') return 'ग्राम';
  if (u === 'piece' || u === 'pc' || u === 'pcs') return 'पीस';
  if (u === 'unit' || u === 'units') return 'यूनिट';
  if (u === 'crate' || u === 'crates') return 'क्रेट';
  if (u === 'box' || u === 'boxes') return 'बॉक्स';
  if (u === 'bag' || u === 'bags') return 'बोरी';
  if (u === 'pack' || u === 'packs' || u === 'packet') return 'पैक';
  return unit || 'किलो';
};

const getHindiDateString = () => {
  const d = new Date();
  const months = ['जनवरी', 'फ़रवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
  const day = String(d.getDate()).padStart(2, '0');
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
};

export default function WMSProductInventory() {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [selectedGlobalProducts, setSelectedGlobalProducts] = useState<string[]>([]);
  const [globalProducts, setGlobalProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [modalSearchValue, setModalSearchValue] = useState("");
  const [modalSelectedCategory, setModalSelectedCategory] = useState("All Categories");
  const [modalCurrentPage, setModalCurrentPage] = useState(1);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingInventory, setIsLoadingInventory] = useState(false);
  const [setupData, setSetupData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [warehouseCosts, setWarehouseCosts] = useState({ overhead: 0, logistic: 0 });
  
  // Stock action modal states
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [activeStockAction, setActiveStockAction] = useState<StockActionType | null>(null);
  const [selectedProductForAction, setSelectedProductForAction] = useState<any>(null);

  // PDF download modal states
  const [isPdfLanguageModalOpen, setIsPdfLanguageModalOpen] = useState(false);
  const [selectedPdfLanguage, setSelectedPdfLanguage] = useState<'en' | 'hi'>('en');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  React.useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setIsLoadingProducts(true);
    setIsLoadingInventory(true);
    try {
      const token = localStorage.getItem('wmsToken');
      if (!token) return;

      const profile = await wmsAuthService.getProfile(token);
      const warehouseId = profile.id;

      const [productsRes, inventoryData, categoriesData] = await Promise.all([
        productService.getAll(0, 100), // Get first 100 for the selection modal
        warehouseProductService.getAll(warehouseId),
        categoryService.getAll(),
      ]);
      setGlobalProducts(productsRes.items);
      setInventoryItems(inventoryData);
      setCategories(categoriesData);
      setWarehouseCosts({
        overhead: profile.overheadCost || 0,
        logistic: profile.logisticCost || 0
      });
    } catch (error) {
      console.error("Failed to fetch initial data:", error);
    } finally {
      setIsLoadingProducts(false);
      setIsLoadingInventory(false);
    }
  };

  const handleSetupChange = (productId: string, field: string, value: any) => {
    setSetupData(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [field]: value
      }
    }));
  };

  const handleAddInventory = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('wmsToken');
      if (!token) return;
      const profile = await wmsAuthService.getProfile(token);
      const warehouseId = profile.id;

      const promises = selectedGlobalProducts.map(gid => {
        const itemData = setupData[gid] || {};
        const gp = globalProducts.find(p => p.id === gid);
        const payload = {
          productId: gid,
          warehouseId: warehouseId,
          initialStock: itemData.initialStock !== undefined ? Number(itemData.initialStock) : 0,
          reorderLevel: itemData.reorderLevel !== undefined ? Number(itemData.reorderLevel) : 0,
          basePrice: itemData.basePrice !== undefined ? Number(itemData.basePrice) : (gp?.basePrice ? Number(gp.basePrice) : 0),
          location: itemData.location || "",
          status: itemData.status || "Active",
        };
        return warehouseProductService.create(payload);
      });
      await Promise.all(promises);
      
      // Refresh inventory
      const inventoryData = await warehouseProductService.getAll(warehouseId);
      setInventoryItems(inventoryData);
      
      setIsAddModalOpen(false);
      setSelectedGlobalProducts([]);
      setAddStep(1);
      setSetupData({});
    } catch (err) {
      console.error("Error creating inventory:", err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Dropdown states
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showBulkActionMenu, setShowBulkActionMenu] = useState(false);
  const [showColumnsModal, setShowColumnsModal] = useState(false);

  const handleStockActionSubmit = async (actionType: StockActionType, quantity: number, reason: string, notes: string) => {
    if (!selectedProductForAction) return;
    try {
      await warehouseProductService.stockAction(selectedProductForAction.id, {
        actionType,
        quantity,
        reason,
        notes
      });
      await fetchInitialData(); // Refresh the full list after stock update
    } catch (error) {
      console.error("Failed to submit stock action", error);
    }
  };

  // Modal states for Action column
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string } | null>(null);

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [dateRange, setDateRange] = useState("Loading...");

  React.useEffect(() => {
    const today = new Date();
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);
    const formatDate = (date: Date) => date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }).replace(/ /g, ' '); 
    setDateRange(`${formatDate(today)} - ${formatDate(nextYear)}`);
  }, []);
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const initialColumns = [
    { id: 'product', label: 'Product', required: true, visible: true },
    { id: 'category', label: 'Category', required: false, visible: true },
    { id: 'subcategory', label: 'Subcategory', required: false, visible: true },
    { id: 'currentStock', label: 'Current Stock', required: true, visible: true },
    { id: 'available', label: 'Available', required: false, visible: true },
    { id: 'reserved', label: 'Reserved', required: false, visible: true },
    { id: 'stockIn', label: 'Stock In', required: false, visible: true },
    { id: 'stockOut', label: 'Stock Out', required: false, visible: true },
    { id: 'missing', label: 'Missing', required: false, visible: true },
    { id: 'wastage', label: 'Wastage', required: false, visible: true },
    { id: 'reorder', label: 'Reorder', required: false, visible: true },
    { id: 'basePrice', label: 'Base Price', required: false, visible: true },
    { id: 'sellingPrice', label: 'Selling Price', required: false, visible: true },
    { id: 'location', label: 'Location', required: false, visible: true },
    { id: 'status', label: 'Status', required: false, visible: true }
  ];
  const [columns, setColumns] = useState(initialColumns);

  const toggleColumn = (id: string) => {
    setColumns(columns.map(col => {
      if (col.id === id && !col.required) {
        return { ...col, visible: !col.visible };
      }
      return col;
    }));
  };

  const showAllColumns = () => setColumns(columns.map(c => ({ ...c, visible: true })));
  const resetColumns = () => setColumns(initialColumns);

  const mappedInventory = inventoryItems.map(invItem => {
    const gp = globalProducts.find(p => p.id === invItem.productId) || {};
    return {
      id: invItem.id,
      productId: invItem.productId,
      name: invItem.productName || gp.name || "Unknown Product",
      category: invItem.category || gp.category || "-",
      subcategory: invItem.subcategory || gp.subcategory || "-",
      stock: invItem.currentStock ?? invItem.initialStock ?? 0,
      available: invItem.availableStock ?? invItem.initialStock ?? 0,
      reserved: invItem.reservedStock ?? 0,
      stockIn: invItem.stockIn ?? invItem.initialStock ?? 0,
      stockOut: invItem.stockOut ?? 0,
      missing: invItem.missingStock ?? 0,
      wastage: invItem.wastageStock ?? 0,
      reorder: invItem.reorderLevel || 0,
      basePrice: invItem.basePrice ? `₹${Number(invItem.basePrice).toFixed(2)}` : "-",
      sellingPrice: invItem.sellingPrice ? `₹${Number(invItem.sellingPrice).toFixed(2)}` : "-",
      location: invItem.location || "-",
      status: invItem.status || "In Stock",
      unit: gp.baseUnit || gp.unit || "Units",
      imageUrl: invItem.imageUrl || gp.imageUrl || null
    };
  });

  const filteredInventory = mappedInventory.filter((item) => {
    const isLowStock = item.available <= item.reorder;
    const itemStatus = isLowStock ? 'Low Stock' : 'In Stock';
    
    if (selectedCategory !== "All Categories" && item.category !== selectedCategory) return false;
    if (selectedStatus !== "All Status" && itemStatus !== selectedStatus) return false;
    return true;
  });

  const totalProducts = filteredInventory.length;
  const currentStockTotal = filteredInventory.reduce((acc, curr) => acc + curr.stock, 0);
  const stockInTotal = filteredInventory.reduce((acc, curr) => acc + curr.stockIn, 0);
  const stockOutTotal = filteredInventory.reduce((acc, curr) => acc + curr.stockOut, 0);
  const reservedTotal = filteredInventory.reduce((acc, curr) => acc + curr.reserved, 0);
  const missingTotal = filteredInventory.reduce((acc, curr) => acc + curr.missing, 0);
  const wastageTotal = filteredInventory.reduce((acc, curr) => acc + curr.wastage, 0);

  const filteredGlobalProducts = globalProducts.filter(gp => {
    if (modalSelectedCategory !== "All Categories" && gp.category !== modalSelectedCategory) return false;
    if (modalSearchValue && !gp.name.toLowerCase().includes(modalSearchValue.toLowerCase())) return false;
    return true;
  }).sort((a, b) => {
    const aExists = inventoryItems.some(inv => inv.productId === a.id);
    const bExists = inventoryItems.some(inv => inv.productId === b.id);
    if (aExists === bExists) return 0;
    return aExists ? 1 : -1;
  });

  const [modalItemsPerPage, setModalItemsPerPage] = useState(50);
  const modalTotalPages = Math.max(1, Math.ceil(filteredGlobalProducts.length / modalItemsPerPage));

  React.useEffect(() => {
    setModalCurrentPage(1);
  }, [modalSearchValue, modalSelectedCategory, isAddModalOpen, modalItemsPerPage]);

  React.useEffect(() => {
    if (isAddModalOpen) {
      const refreshProducts = async () => {
        setIsLoadingProducts(true);
        try {
          const res = await productService.getAll(0, 100);
          setGlobalProducts(res.items || []);
        } catch (err) {
          console.error("Failed to refresh products in modal:", err);
        } finally {
          setIsLoadingProducts(false);
        }
      };
      refreshProducts();
    }
  }, [isAddModalOpen]);

  const paginatedGlobalProducts = filteredGlobalProducts.slice((modalCurrentPage - 1) * modalItemsPerPage, modalCurrentPage * modalItemsPerPage);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) setSelectedItems(filteredInventory.map(item => item.id));
    else setSelectedItems([]);
  };

  const handleSelectItem = (id: number) => {
    if (selectedItems.includes(id)) setSelectedItems(selectedItems.filter(i => i !== id));
    else setSelectedItems([...selectedItems, id]);
  };

  const handleDownloadExcel = async () => {
    try {
      const XLSX = await import("xlsx");
      
      const itemsToExport = selectedItems.length > 0 
        ? filteredInventory.filter(item => selectedItems.includes(item.id))
        : filteredInventory;

      if (itemsToExport.length === 0) {
        toast.error("No items available to export.");
        return;
      }

      const exportData = itemsToExport.map(item => ({
        "Product Name": item.name,
        "Category": item.category,
        "Subcategory": item.subcategory,
        "Current Stock": item.stock,
        "Available Stock": item.available,
        "Reserved Stock": item.reserved,
        "Stock In": item.stockIn,
        "Stock Out": item.stockOut,
        "Missing Stock": item.missing,
        "Wastage Stock": item.wastage,
        "Reorder Level": item.reorder,
        "Base Price": item.basePrice,
        "Selling Price": item.sellingPrice,
        "Location": item.location,
        "Status": item.status,
        "Unit": item.unit
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

      let filename = "warehouse_inventory";
      if (selectedItems.length > 0) {
        filename += `_selected_${selectedItems.length}`;
      } else {
        if (selectedCategory !== "All Categories") {
          filename += `_${selectedCategory.toLowerCase().replace(/\s+/g, '_')}`;
        }
        if (selectedStatus !== "All Status") {
          filename += `_${selectedStatus.toLowerCase().replace(/\s+/g, '_')}`;
        }
      }
      filename += ".xlsx";

      XLSX.writeFile(workbook, filename);
      toast.success(`Exported ${itemsToExport.length} item(s) to Excel successfully!`);
    } catch (error) {
      console.error("Failed to download inventory excel:", error);
      toast.error("Failed to generate Excel download.");
    }
  };

  const handleDownloadPDF = async (language: 'en' | 'hi' = 'en') => {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");

      const itemsToExport = selectedItems.length > 0 
        ? filteredInventory.filter(item => selectedItems.includes(item.id))
        : filteredInventory;

      if (itemsToExport.length === 0) {
        toast.error(language === 'hi' ? "निर्यात के लिए कोई उत्पाद उपलब्ध नहीं है।" : "No items available to export.");
        return;
      }

      const isHindi = language === 'hi';
      const titleText = isHindi ? "उत्पाद दर सूची" : "PRODUCT RATE LIST";
      const subtitleText = isHindi ? "कीमत केवल आज के लिए मान्य है" : "Price Only Applicable for today";
      const dateLabel = isHindi ? "दिनांक :" : "Date :";
      const dateValue = isHindi ? getHindiDateString() : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      const totalItemLabel = isHindi ? "कुल उत्पाद :" : "Total Item :";
      const colProductHeader = isHindi ? "उत्पाद" : "PRODUCT";
      const colRateHeader = isHindi ? "दर" : "RATE";

      const waitForImages = async (container: HTMLElement) => {
        const images = Array.from(container.querySelectorAll("img"));
        if (images.length === 0) return;
        await Promise.all(
          images.map(img => {
            if (img.complete && img.naturalHeight > 0) return Promise.resolve();
            return new Promise<void>(resolve => {
              const timer = setTimeout(() => resolve(), 1500);
              img.onload = () => { clearTimeout(timer); resolve(); };
              img.onerror = () => { clearTimeout(timer); resolve(); };
            });
          })
        );
      };

      const buildRowHtml = (item: any) => {
        const gp = globalProducts.find(p => p.id === item.productId) || {};
        const bMargin = parseFloat(gp.baseMargin || "0");
        const rawSellingPriceText = String(item.sellingPrice || item.basePrice || "0");
        const sellingPrice = parseFloat(rawSellingPriceText.replace(/[^0-9.]/g, '')) || 0;
        const landedCost = bMargin > 0 ? sellingPrice / (1 + bMargin / 100) : sellingPrice;
        const unit = gp.baseUnit || gp.unit || "Kg";
        const displayUnit = isHindi ? translateUnitToHindi(unit) : unit;
        const displayName = isHindi ? translateProductNameToHindi(item.name) : item.name;

        const slabs = (gp.b2bBulkSlabs || []).map((slab: any, idx: number) => {
          let calculatedRate = sellingPrice;
          if (idx !== 0) {
            const effectiveMargin = bMargin - (idx * 2);
            calculatedRate = landedCost * (1 + effectiveMargin / 100);
          }
          const formattedRate = calculatedRate % 1 === 0 ? calculatedRate.toFixed(0) : calculatedRate.toFixed(2);
          return {
            ...slab,
            rateText: `₹${formattedRate}/${displayUnit}`,
            rangeText: `(${slab.minQty} - ${slab.maxQty} ${displayUnit})`
          };
        });

        const cell1 = `
          <div style="display: flex; align-items: center; gap: 12px;">
            ${item.imageUrl 
              ? `<img src="${item.imageUrl}" crossOrigin="anonymous" style="width: 36px; height: 36px; border-radius: 8px; object-fit: cover; border: 1px solid #e2e8f0; flex-shrink: 0;" />` 
              : `<div style="width: 36px; height: 36px; border-radius: 8px; background: #f1f5f9; display: flex; align-items: center; justify-content: center; border: 1px solid #e2e8f0; flex-shrink: 0;"><svg style="width: 16px; height: 16px; color: #94a3b8;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>`
            }
            <span style="font-weight: 600; color: #0f172a; font-size: 13.5px; line-height: 1.35;">${displayName}</span>
          </div>
        `;

        const renderSlabCell = (idx: number) => {
          if (slabs && slabs[idx]) {
            return `
              <span style="font-weight: 700; color: #0f172a; font-size: 13.5px;">${slabs[idx].rateText}</span>
              <span style="font-size: 11px; color: #64748b; font-weight: 500; margin-left: 4px; white-space: nowrap;">${slabs[idx].rangeText}</span>
            `;
          }
          if (idx === 0) {
            const formattedSellingPrice = rawSellingPriceText.replace(".00", "");
            return `<span style="font-weight: 700; color: #0f172a; font-size: 13.5px;">${formattedSellingPrice}/${displayUnit}</span>`;
          }
          return `<span style="color: #94a3b8;">-</span>`;
        };

        return `
          <tr style="border-bottom: 1px solid #e2e8f0; font-size: 13px;">
            <td style="padding: 10px; text-align: left; vertical-align: middle; width: 40%;">${cell1}</td>
            <td style="padding: 10px; text-align: left; vertical-align: middle; width: 20%;">${renderSlabCell(0)}</td>
            <td style="padding: 10px; text-align: left; vertical-align: middle; width: 20%;">${renderSlabCell(1)}</td>
            <td style="padding: 10px; text-align: left; vertical-align: middle; width: 20%;">${renderSlabCell(2)}</td>
          </tr>
        `;
      };

      // 1. Measure row heights to perform clean, mathematically sound page splitting
      const measureContainer = document.createElement("div");
      measureContainer.style.position = "absolute";
      measureContainer.style.left = "-9999px";
      measureContainer.style.top = "-9999px";
      measureContainer.style.width = "800px";
      measureContainer.style.padding = "35px 40px";
      measureContainer.style.boxSizing = "border-box";
      measureContainer.style.visibility = "hidden";
      measureContainer.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
          <tbody>
            ${itemsToExport.map((item, idx) => `
              <tr id="measure-tr-${idx}" style="border-bottom: 1px solid #e2e8f0; font-size: 13px;">
                <td style="padding: 10px; width: 40%; text-align: left; vertical-align: middle;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="width: 36px; height: 36px; flex-shrink: 0;"></div>
                    <span style="font-weight: 600; font-size: 13.5px; line-height: 1.35;">${isHindi ? translateProductNameToHindi(item.name) : item.name}</span>
                  </div>
                </td>
                <td style="padding: 10px; width: 20%;"><span style="font-size: 13.5px;">-</span></td>
                <td style="padding: 10px; width: 20%;"><span style="font-size: 13.5px;">-</span></td>
                <td style="padding: 10px; width: 20%;"><span style="font-size: 13.5px;">-</span></td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
      document.body.appendChild(measureContainer);

      const rowHeights = itemsToExport.map((_, idx) => {
        const el = measureContainer.querySelector(`#measure-tr-${idx}`);
        const h = el ? el.getBoundingClientRect().height : 58;
        return Math.max(58, h);
      });
      document.body.removeChild(measureContainer);

      // 2. Chunk items into page groups without cutting any rows
      const pages: any[][] = [];
      let currentPage: any[] = [];
      let currentHeight = 0;

      for (let i = 0; i < itemsToExport.length; i++) {
        const item = itemsToExport[i];
        const h = rowHeights[i] || 58;
        const isFirstPage = pages.length === 0;
        const maxAllowedHeight = isFirstPage ? 830 : 890;

        if (currentHeight + h > maxAllowedHeight && currentPage.length > 0) {
          pages.push(currentPage);
          currentPage = [item];
          currentHeight = h;
        } else {
          currentPage.push(item);
          currentHeight += h;
        }
      }
      if (currentPage.length > 0) {
        pages.push(currentPage);
      }

      const totalPages = pages.length;

      // 3. Render and capture each page independently with jsPDF
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      for (let p = 0; p < pages.length; p++) {
        const pageItems = pages[p];
        const isFirstPage = p === 0;

        const pageContainer = document.createElement("div");
        pageContainer.style.position = "absolute";
        pageContainer.style.left = "-9999px";
        pageContainer.style.top = "-9999px";
        pageContainer.style.width = "800px";
        pageContainer.style.height = "1131px";
        pageContainer.style.maxHeight = "1131px";
        pageContainer.style.boxSizing = "border-box";
        pageContainer.style.padding = "35px 40px 25px 40px";
        pageContainer.style.background = "#ffffff";
        pageContainer.style.color = "#0f172a";
        pageContainer.style.fontFamily = isHindi 
          ? "'Noto Sans Devanagari', 'Segoe UI', 'Mangal', 'Nirmala UI', system-ui, sans-serif"
          : "'Inter', system-ui, -apple-system, sans-serif";
        pageContainer.style.display = "flex";
        pageContainer.style.flexDirection = "column";
        pageContainer.style.justifyContent = "space-between";
        pageContainer.style.overflow = "hidden";

        const pageHeader = isFirstPage ? `
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 12px; padding-bottom: 8px;">
            <div>
              <h1 style="font-size: 24px; font-weight: 800; color: #0f172a; margin: 0; letter-spacing: -0.5px;">${titleText}</h1>
              <p style="font-size: 12px; color: #64748b; margin: 3px 0 0 0; font-weight: 500;">${subtitleText}</p>
            </div>
            <div style="text-align: right; font-size: 12.5px; color: #0f172a; line-height: 1.5; font-weight: 600;">
              <div><strong>${dateLabel}</strong> ${dateValue}</div>
              <div><strong>${totalItemLabel}</strong> ${itemsToExport.length}</div>
            </div>
          </div>
          <div style="border-bottom: 2.5px solid #07ac57; margin-bottom: 16px;"></div>
        ` : `
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; padding-bottom: 6px;">
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 16px; font-weight: 800; color: #0f172a;">${titleText}</span>
              <span style="font-size: 11.5px; font-weight: 600; color: #07ac57; background: #ecfdf5; padding: 2px 8px; border-radius: 4px; border: 1px solid #a7f3d0;">
                ${isHindi ? 'जारी...' : 'Continued...'}
              </span>
            </div>
            <div style="font-size: 12px; color: #64748b; font-weight: 600;">
              <strong>${dateLabel}</strong> ${dateValue}
            </div>
          </div>
          <div style="border-bottom: 2px solid #07ac57; margin-bottom: 16px;"></div>
        `;

        const pageRowsHtml = pageItems.map(item => buildRowHtml(item)).join("");

        const pageFooter = `
          <div style="margin-top: auto; border-top: 1px solid #e2e8f0; padding-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #94a3b8; font-weight: 500;">
            <span>${isHindi ? 'कीमत केवल आज के लिए मान्य है • JiyoFresh Warehouse' : 'Price only valid for today • JiyoFresh Warehouse'}</span>
            <span>${isHindi ? `पृष्ठ ${p + 1} / ${totalPages}` : `Page ${p + 1} of ${totalPages}`}</span>
          </div>
        `;

        pageContainer.innerHTML = `
          <div style="width: 100%;">
            ${p === 0 ? `
              <link rel="preconnect" href="https://fonts.googleapis.com">
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
              <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
            ` : ''}
            ${pageHeader}
            <table style="width: 100%; border-collapse: collapse; text-align: left; margin-bottom: 12px; table-layout: fixed;">
              <thead>
                <tr style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; font-size: 11px; font-weight: 700; color: #475569; letter-spacing: 0.5px;">
                  <th style="padding: 10px 10px; width: 40%; text-align: left;">${colProductHeader}</th>
                  <th style="padding: 10px 10px; width: 20%; text-align: left;">${colRateHeader}</th>
                  <th style="padding: 10px 10px; width: 20%; text-align: left;">${colRateHeader}</th>
                  <th style="padding: 10px 10px; width: 20%; text-align: left;">${colRateHeader}</th>
                </tr>
              </thead>
              <tbody>
                ${pageRowsHtml}
              </tbody>
            </table>
          </div>
          ${pageFooter}
        `;

        document.body.appendChild(pageContainer);
        await waitForImages(pageContainer);

        const canvas = await html2canvas(pageContainer, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          windowWidth: 800,
          width: 800
        });

        document.body.removeChild(pageContainer);

        const pageImgData = canvas.toDataURL("image/png");
        if (p > 0) {
          pdf.addPage();
        }
        pdf.addImage(pageImgData, "PNG", 0, 0, pageWidth, pageHeight);
      }

      const pdfFilename = isHindi
        ? `product_rate_list_hindi_${new Date().toISOString().split('T')[0]}.pdf`
        : `product_rate_list_english_${new Date().toISOString().split('T')[0]}.pdf`;

      pdf.save(pdfFilename);
      toast.success(isHindi ? "उत्पाद दर सूची (हिन्दी) डाउनलोड हो गई!" : "Product Rate List (English) downloaded successfully!");
    } catch (error) {
      console.error("Failed to generate PDF report:", error);
      toast.error("Failed to generate PDF download.");
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-[1400px]">
      {/* TOP ROW: Title & Actions */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold text-[#111827]">Warehouse Inventory</h1>
          <span className="text-xl text-[#94a3b8] font-medium">5</span>
          <ChevronDownIcon className="w-5 h-5 text-[#94a3b8] cursor-pointer" />
        </div>

        <div className="flex items-center gap-4">

          <button className="flex items-center gap-2 px-4 py-2 border border-[#e2e8f0] bg-white rounded-lg text-sm font-medium text-[#111827] hover:bg-[#f9fafb] transition-colors">
            <CalendarIcon className="w-4 h-4 text-[#6b7280]" />
            {dateRange}
            <ChevronDownIcon className="w-4 h-4 ml-1" />
          </button>

          <button 
            onClick={handleDownloadExcel}
            className="flex items-center justify-center min-w-[36px] h-[36px] px-3 border border-[#e2e8f0] bg-white text-[#111827] rounded-lg font-medium hover:bg-[#f9fafb] hover:text-[#07ac57] active:scale-95 transition-all gap-2 cursor-pointer"
            title="Download Inventory as Excel"
          >
            <DownloadIcon className="w-4 h-4" />
            <span className="text-sm">Download</span>
          </button>

          <button 
            onClick={() => { setIsAddModalOpen(true); setAddStep(1); }}
            className="flex items-center justify-center min-w-[36px] h-[36px] px-3 bg-[#07ac57] text-white rounded-lg font-medium hover:opacity-90 transition-opacity gap-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="text-sm">New</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setShowMoreActions(!showMoreActions)}
              className="flex items-center justify-center w-[36px] h-[36px] border border-[#e2e8f0] rounded-lg text-[#6b7280] hover:bg-[#f9fafb] bg-white transition-colors"
            >
              <MoreVerticalIcon className="w-5 h-5" />
            </button>
            {showMoreActions && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#e2e8f0] rounded-xl shadow-lg py-1 z-10">
                <button className="w-full text-left px-4 py-2 text-sm text-[#111827] hover:bg-[#f9fafb]">Download Sample</button>
                <button className="w-full text-left px-4 py-2 text-sm text-[#111827] hover:bg-[#f9fafb]">Bulk Upload</button>
                <button 
                  onClick={() => {
                    setShowMoreActions(false);
                    setIsPdfLanguageModalOpen(true);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-[#07ac57] font-semibold hover:bg-[#f9fafb] flex items-center gap-2 border-t border-[#f3f4f6]"
                >
                  <DownloadIcon className="w-4 h-4" />
                  Download Rate List PDF
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SECOND ROW: Filters */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowColumnsModal(!showColumnsModal)}
            className="flex items-center gap-2 px-3 py-1.5 border border-[#e2e8f0] bg-white rounded-lg hover:bg-[#f9fafb] text-[#111827] text-sm font-medium transition-colors"
          >
            <SettingsIcon className="w-4 h-4" />
            Columns
          </button>
          
          {/* Columns Customization Modal */}
          {showColumnsModal && (
            <div className="absolute left-0 top-full mt-2 w-[360px] bg-white border border-[#e2e8f0] rounded-xl shadow-2xl z-20 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center px-5 py-4 border-b border-[#f3f4f6]">
                <h3 className="font-bold text-[#111827] text-lg">Customize Columns</h3>
                <button onClick={() => setShowColumnsModal(false)} className="text-[#94a3b8] hover:text-[#111827] transition-colors">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="px-5 py-4 bg-white border-b border-[#f3f4f6]">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-[#475569]">Select which columns to display in the table</span>
                  <span className="text-xs font-medium text-[#6b7280]">{columns.filter(c => c.visible).length} of {columns.length} visible</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={showAllColumns} className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs font-semibold text-[#111827] hover:bg-[#f9fafb] transition-colors">Show All</button>
                  <button onClick={resetColumns} className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-xs font-semibold text-[#111827] hover:bg-[#f9fafb] transition-colors">Reset to Default</button>
                </div>
              </div>
              
              <div className="max-h-[350px] overflow-y-auto px-5 py-3 flex flex-col gap-2">
                {columns.map(col => (
                  <div 
                    key={col.id} 
                    onClick={() => toggleColumn(col.id)}
                    className={`flex justify-between items-center px-4 py-3 rounded-xl border-2 transition-all select-none ${
                      col.required 
                        ? 'border-[#f1f5f9] bg-[#f8fafc] cursor-not-allowed opacity-80' 
                        : col.visible 
                          ? 'border-[#a7f3d0] bg-[#f2fcf6] cursor-pointer hover:border-[#34d399]' 
                          : 'border-[#f1f5f9] bg-white cursor-pointer hover:border-[#cbd5e1]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center ${
                        col.required 
                          ? 'bg-[#cbd5e1]' 
                          : col.visible 
                            ? 'bg-[#07ac57]' 
                            : 'bg-white border border-[#cbd5e1]'
                      }`}>
                        {(col.required || col.visible) && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm font-semibold ${col.required ? 'text-[#111827]' : col.visible ? 'text-[#07ac57]' : 'text-[#111827]'}`}>{col.label}</span>
                    </div>
                    {col.required && (
                      <span className="text-[10px] uppercase font-bold text-[#64748b] bg-[#e2e8f0] px-2 py-1 rounded">Required</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="text-[#94a3b8]">Filter by:</span>
          
          <div className="relative">
            <select 
              value={selectedCategory} 
              onChange={e => setSelectedCategory(e.target.value)}
              className="appearance-none flex items-center justify-between min-w-[140px] px-3 py-1.5 border border-[#e2e8f0] bg-white rounded-lg hover:bg-[#f9fafb] text-[#111827] transition-colors outline-none focus:border-[#07ac57] cursor-pointer font-medium"
            >
              <option value="All Categories">All Categories</option>
              {Array.from(new Set(mappedInventory.map(i => i.category))).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDownIcon className="w-4 h-4 text-[#6b7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          
          <div className="relative">
            <select 
              value={selectedStatus} 
              onChange={e => setSelectedStatus(e.target.value)}
              className="appearance-none flex items-center justify-between min-w-[120px] px-3 py-1.5 border border-[#e2e8f0] bg-white rounded-lg hover:bg-[#f9fafb] text-[#111827] transition-colors outline-none focus:border-[#07ac57] cursor-pointer font-medium"
            >
              <option value="All Status">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
            </select>
            <ChevronDownIcon className="w-4 h-4 text-[#6b7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* THIRD ROW: Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-nowrap overflow-x-auto gap-4 pb-2">
        <StatMini icon={<BoxIcon className="w-5 h-5" />} title="Total Inventory" value={totalProducts.toString()} unit="Products" color="text-[#3b82f6]" borderHighlight="border-l-[3px] border-l-[#3b82f6]" />
        <StatMini icon={<CheckCircleIcon className="w-5 h-5" />} title="Current Stock" value={currentStockTotal.toLocaleString()} unit="Units" color="text-[#111827]" iconColor="text-[#07ac57]" />
        <StatMini icon={<TrendingUpIcon className="w-5 h-5" />} title="Stock In" value={stockInTotal.toLocaleString()} unit="Units" color="text-[#07ac57]" iconColor="text-[#07ac57]" />
        <StatMini icon={<TrendingDownIcon className="w-5 h-5" />} title="Stock Out" value={stockOutTotal.toLocaleString()} unit="Units" color="text-[#ea580c]" iconColor="text-[#ea580c]" />
        <StatMini icon={<InboxIcon className="w-5 h-5" />} title="Reserved" value={reservedTotal.toLocaleString()} unit="Units" color="text-[#a855f7]" iconColor="text-[#a855f7]" />
        <StatMini icon={<AlertCircleIcon className="w-5 h-5" />} title="Missing" value={missingTotal.toLocaleString()} unit="Units" color="text-[#d97706]" iconColor="text-[#d97706]" />
        <StatMini icon={<XCircleIcon className="w-5 h-5" />} title="Wastage" value={wastageTotal.toLocaleString()} unit="Units" color="text-[#dc2626]" iconColor="text-[#dc2626]" />
      </div>
      {/* Bulk Action Dynamic Bar */}
      {selectedItems.length > 0 && (
        <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-xl px-5 py-3 flex justify-between items-center -mb-2">
          <span className="text-sm font-semibold text-[#1e40af]">{selectedItems.length} item(s) selected</span>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select className="appearance-none border border-[#e2e8f0] rounded-lg pl-4 pr-10 py-2 text-sm outline-none w-48 bg-white text-[#111827] cursor-pointer">
                <option>Bulk Actions</option>
                <option>Update Base Price</option>
                <option>Update Reorder Level</option>
                <option>Update Missing Stock</option>
                <option>Update Wastage</option>
              </select>
              <ChevronDownIcon className="w-4 h-4 text-[#6b7280] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button 
              onClick={() => setIsPdfLanguageModalOpen(true)}
              className="bg-[#07ac57] text-white px-5 py-2 rounded-lg text-sm font-medium hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <DownloadIcon className="w-4 h-4" />
              Download PDF
            </button>
            <button className="bg-[#dc2626] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#b91c1c] transition-colors">
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Main Table Container */}
      <div className="bg-white border border-[#f3f4f6] rounded-xl shadow-sm flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#fcfcfc] text-[#6b7280] font-medium border-b border-[#f3f4f6]">
              <tr>
                <th className="px-6 py-4 font-semibold w-10">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={selectedItems.length === filteredInventory.length && filteredInventory.length > 0}
                    className="rounded border-[#cbd5e1] text-[#07ac57] cursor-pointer" 
                  />
                </th>
                {columns.find(c => c.id === 'product')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Product</th>}
                {columns.find(c => c.id === 'category')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Category</th>}
                {columns.find(c => c.id === 'subcategory')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Subcategory</th>}
                {columns.find(c => c.id === 'currentStock')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Current Stock</th>}
                {columns.find(c => c.id === 'available')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Available</th>}
                {columns.find(c => c.id === 'reserved')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Reserved</th>}
                {columns.find(c => c.id === 'stockIn')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Stock In</th>}
                {columns.find(c => c.id === 'stockOut')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Stock Out</th>}
                {columns.find(c => c.id === 'missing')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Missing</th>}
                {columns.find(c => c.id === 'wastage')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Wastage</th>}
                {columns.find(c => c.id === 'reorder')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Reorder</th>}
                {columns.find(c => c.id === 'basePrice')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Base Price</th>}
                {columns.find(c => c.id === 'sellingPrice')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Selling Price</th>}
                {columns.find(c => c.id === 'location')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider">Location</th>}
                {columns.find(c => c.id === 'status')?.visible && <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider text-center">Status</th>}
                <th className="px-6 py-4 font-semibold uppercase text-xs tracking-wider text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={columns.filter(c => c.visible).length + 1} className="px-6 py-12 text-center text-[#6b7280]">
                    No products found matching the selected filters.
                  </td>
                </tr>
              ) : filteredInventory.map((item) => {
                const isSelected = selectedItems.includes(item.id);
                const isLowStock = item.available <= item.reorder;
                return (
                  <tr key={item.id} className={`hover:bg-[#f9fafb] transition-colors ${isSelected ? 'bg-[#f2fcf6]' : ''}`}>
                    <td className="px-6 py-4">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => handleSelectItem(item.id)}
                        className="rounded border-[#cbd5e1] text-[#07ac57] cursor-pointer" 
                      />
                    </td>
                    {columns.find(c => c.id === 'product')?.visible && (
                      <td className="px-6 py-4 font-bold text-[#111827] cursor-pointer hover:text-[#07ac57]">
                        <div className="flex items-center gap-3">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} className="w-8 h-8 rounded-lg object-cover border border-[#e2e8f0]" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-[#f2fcf6] text-[#07ac57] flex items-center justify-center border border-[#dcfce7]">
                              <BoxIcon className="w-4 h-4" />
                            </div>
                          )}
                          {item.name}
                        </div>
                      </td>
                    )}
                    {columns.find(c => c.id === 'category')?.visible && <td className="px-6 py-4 text-[#6b7280]">{item.category}</td>}
                    {columns.find(c => c.id === 'subcategory')?.visible && <td className="px-6 py-4 text-[#6b7280]">{item.subcategory}</td>}
                    {columns.find(c => c.id === 'currentStock')?.visible && <td className="px-6 py-4 font-bold text-[#111827]">{item.stock}</td>}
                    {columns.find(c => c.id === 'available')?.visible && <td className="px-6 py-4 text-[#07ac57]">{item.available}</td>}
                    {columns.find(c => c.id === 'reserved')?.visible && <td className="px-6 py-4 text-[#a855f7]">{item.reserved}</td>}
                    {columns.find(c => c.id === 'stockIn')?.visible && <td className="px-6 py-4 text-[#059669]">{item.stockIn}</td>}
                    {columns.find(c => c.id === 'stockOut')?.visible && <td className="px-6 py-4 text-[#ea580c]">{item.stockOut}</td>}
                    {columns.find(c => c.id === 'missing')?.visible && <td className="px-6 py-4 text-[#d97706]">{item.missing > 0 ? item.missing : '-'}</td>}
                    {columns.find(c => c.id === 'wastage')?.visible && <td className="px-6 py-4 text-[#ef4444]">{item.wastage > 0 ? item.wastage : '-'}</td>}
                    {columns.find(c => c.id === 'reorder')?.visible && (
                      <td className="px-6 py-4">
                        <div 
                          className="flex items-center gap-2 cursor-pointer text-[#3b82f6] hover:text-[#2563eb]"
                          onClick={() => {
                            setSelectedProductForAction(item);
                            setActiveStockAction('Update Reorder Level');
                            setStockModalOpen(true);
                          }}
                        >
                          <span className="font-semibold underline decoration-dashed underline-offset-4">{item.reorder}</span>
                          <EditIcon className="w-3.5 h-3.5" />
                        </div>
                      </td>
                    )}
                    {columns.find(c => c.id === 'basePrice')?.visible && <td className="px-6 py-4 text-[#6b7280]">{item.basePrice}</td>}
                    {columns.find(c => c.id === 'sellingPrice')?.visible && <td className="px-6 py-4 text-[#6b7280]">{item.sellingPrice}</td>}
                    {columns.find(c => c.id === 'location')?.visible && <td className="px-6 py-4 text-[#6b7280]">{item.location}</td>}
                    {columns.find(c => c.id === 'status')?.visible && <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-sm text-xs font-bold ${
                        isLowStock ? 'bg-[#fff7ed] text-[#ea580c]' : 'bg-[#ecfdf5] text-[#059669]'
                      }`}>
                        {isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>}
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link href={`/wms/inventory/products/${item.id}`}>
                          <button className="text-[#07ac57] hover:bg-[#f2fcf6] p-1.5 rounded transition-colors" title="View Details">
                            <EyeIcon className="w-4 h-4" />
                          </button>
                        </Link>
                        <button className="text-[#3b82f6] hover:bg-[#eff6ff] p-1.5 rounded transition-colors" title="Update">
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setItemToDelete({ id: item.id, name: item.name });
                            setDeleteModalOpen(true);
                          }}
                          className="text-[#ef4444] hover:bg-[#fef2f2] p-1.5 rounded transition-colors" 
                          title="Delete"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Products Modal overlays */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#f3f4f6] flex justify-between items-center bg-white">
              <h2 className="text-lg font-semibold text-[#111827]">
                {addStep === 1 ? "Step 1: Add Products to Inventory" : "Setup Inventory - Configure Products"}
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#94a3b8] hover:text-[#111827] p-1 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - Step 1 */}
            {addStep === 1 && (
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 bg-white">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="relative flex-1 min-w-[200px]">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94a3b8]" />
                    <input 
                      type="text" 
                      placeholder="Search product catalogue..." 
                      value={modalSearchValue}
                      onChange={(e) => setModalSearchValue(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-[#e2e8f0] rounded-lg text-sm outline-none focus:border-[#07ac57]" 
                    />
                  </div>
                  <select 
                    value={modalSelectedCategory}
                    onChange={(e) => setModalSelectedCategory(e.target.value)}
                    className="border border-[#e2e8f0] rounded-lg px-4 py-2 text-sm outline-none w-44 bg-white text-[#111827]"
                  >
                    <option value="All Categories">All Categories</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-2 text-sm text-[#6b7280]">
                    <span>Show:</span>
                    <select
                      value={modalItemsPerPage}
                      onChange={(e) => setModalItemsPerPage(Number(e.target.value))}
                      className="border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm outline-none bg-white text-[#111827]"
                    >
                      <option value={10}>10 per page</option>
                      <option value={25}>25 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </select>
                  </div>
                </div>
                
                <div className="border border-[#e2e8f0] rounded-xl overflow-hidden mt-2 flex flex-col flex-1">
                  <div className="max-h-[460px] overflow-y-auto">
                    <table className="w-full text-left text-sm relative">
                      <thead className="bg-[#f9fafb] text-[#6b7280] font-medium border-b border-[#f3f4f6] sticky top-0 z-10">
                        <tr>
                          <th className="px-4 py-3 w-10">
                            <input 
                              type="checkbox" 
                              title="Select all available on this page"
                              className="rounded text-[#07ac57] cursor-pointer"
                              checked={
                                paginatedGlobalProducts.filter(gp => !inventoryItems.some(inv => inv.productId === gp.id)).length > 0 &&
                                paginatedGlobalProducts
                                  .filter(gp => !inventoryItems.some(inv => inv.productId === gp.id))
                                  .every(gp => selectedGlobalProducts.includes(gp.id))
                              }
                              onChange={(e) => {
                                const availableOnPage = paginatedGlobalProducts
                                  .filter(gp => !inventoryItems.some(inv => inv.productId === gp.id))
                                  .map(gp => gp.id);
                                if (e.target.checked) {
                                  setSelectedGlobalProducts(Array.from(new Set([...selectedGlobalProducts, ...availableOnPage])));
                                } else {
                                  setSelectedGlobalProducts(selectedGlobalProducts.filter(id => !availableOnPage.includes(id)));
                                }
                              }}
                            />
                          </th>
                          <th className="px-4 py-3">Product</th>
                          <th className="px-4 py-3">Category</th>
                          <th className="px-4 py-3">Unit</th>
                          <th className="px-4 py-3">HSN</th>
                          <th className="px-4 py-3">GST</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f3f4f6]">
                        {isLoadingProducts ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-[#6b7280]">
                              Loading products...
                            </td>
                          </tr>
                        ) : paginatedGlobalProducts.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-[#6b7280]">
                              No products found matching the criteria.
                            </td>
                          </tr>
                        ) : paginatedGlobalProducts.map(gp => {
                          const isExisting = inventoryItems.some(inv => inv.productId === gp.id);
                          return (
                            <tr key={gp.id} className={isExisting ? "opacity-50 bg-[#f9fafb] cursor-not-allowed" : "hover:bg-[#fcfcfc] cursor-pointer"} onClick={() => {
                              if (isExisting) return;
                              if (selectedGlobalProducts.includes(gp.id)) setSelectedGlobalProducts(selectedGlobalProducts.filter(id => id !== gp.id));
                              else setSelectedGlobalProducts([...selectedGlobalProducts, gp.id]);
                            }}>
                              <td className="px-4 py-3">
                                <input 
                                  type="checkbox" 
                                  checked={isExisting || selectedGlobalProducts.includes(gp.id)}
                                  disabled={isExisting}
                                  readOnly
                                  className="rounded text-[#07ac57] pointer-events-none" 
                                />
                              </td>
                              <td className="px-4 py-3 font-medium text-[#111827]">
                                <div className="flex items-center gap-3">
                                  {gp.imageUrl ? (
                                    <img src={gp.imageUrl} alt={gp.name} className="w-8 h-8 rounded-lg object-cover border border-[#e2e8f0]" />
                                  ) : (
                                    <div className="w-8 h-8 rounded-lg bg-[#f2fcf6] text-[#07ac57] flex items-center justify-center border border-[#dcfce7]">
                                      <BoxIcon className="w-4 h-4" />
                                    </div>
                                  )}
                                  <div>
                                    {gp.name}
                                    {isExisting && <span className="text-xs text-[#ef4444] ml-2 font-normal rounded-md border border-[#fca5a5] px-1.5 py-0.5 bg-[#fef2f2]">Added</span>}
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-[#6b7280]">{gp.category || '-'}</td>
                              <td className="px-4 py-3 text-[#6b7280]">{gp.baseUnit || '-'}</td>
                              <td className="px-4 py-3 text-[#6b7280]">{gp.hsn || '-'}</td>
                              <td className="px-4 py-3 text-[#6b7280]">{gp.gstRate ? `${gp.gstRate}%` : '-'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between px-4 py-3 border-t border-[#f3f4f6] bg-[#fcfcfc]">
                    <span className="text-sm text-[#6b7280]">
                      Showing <span className="font-semibold text-[#111827]">{filteredGlobalProducts.length === 0 ? 0 : (modalCurrentPage - 1) * modalItemsPerPage + 1}</span> to <span className="font-semibold text-[#111827]">{Math.min(modalCurrentPage * modalItemsPerPage, filteredGlobalProducts.length)}</span> of <span className="font-semibold text-[#111827]">{filteredGlobalProducts.length}</span> products
                    </span>
                    {modalTotalPages > 1 && (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setModalCurrentPage(p => Math.max(p - 1, 1))}
                          disabled={modalCurrentPage === 1}
                          className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-sm font-medium hover:bg-[#f9fafb] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-[#374151] font-medium px-2">Page {modalCurrentPage} of {modalTotalPages}</span>
                        <button 
                          onClick={() => setModalCurrentPage(p => Math.min(p + 1, modalTotalPages))}
                          disabled={modalCurrentPage === modalTotalPages}
                          className="px-3 py-1.5 border border-[#e2e8f0] rounded-lg text-sm font-medium hover:bg-[#f9fafb] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Content - Step 2 */}
            {addStep === 2 && (
              <div className="flex-1 overflow-y-auto p-6 bg-white">
                <div className="bg-[#eff6ff] border border-[#bfdbfe] rounded-lg p-3 mb-6 flex items-start gap-2">
                  <p className="text-[#1e40af] text-sm">
                    <span className="font-bold">Setup Instructions:</span> Configure initial stock, reorder level, location, and base price for each product before adding to inventory.
                  </p>
                </div>
                
                <div className="overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-[#f8fafc] text-[#64748b] font-semibold text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3 rounded-tl-lg">PRODUCT</th>
                        <th className="px-4 py-3">INITIAL STOCK</th>
                        <th className="px-4 py-3">REORDER LEVEL *</th>
                        <th className="px-4 py-3">BASE PRICE * (₹)</th>
                        <th className="px-4 py-3">LOCATION *</th>
                        <th className="px-4 py-3">STATUS</th>
                        <th className="px-4 py-3 text-center rounded-tr-lg">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f1f5f9]">
                      {selectedGlobalProducts.map(gid => {
                        const gp = globalProducts.find(p => p.id === gid);
                        if (!gp) return null;
                        return (
                          <tr key={gp.id}>
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                {gp.imageUrl ? (
                                  <img src={gp.imageUrl} alt={gp.name} className="w-10 h-10 rounded-lg object-cover border border-[#e2e8f0]" />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-[#f2fcf6] text-[#07ac57] flex items-center justify-center border border-[#dcfce7]">
                                    <BoxIcon className="w-5 h-5" />
                                  </div>
                                )}
                                <div>
                                  <p className="font-bold text-[#111827] text-base">{gp.name}</p>
                                  <p className="text-xs text-[#94a3b8] mt-0.5">{gp.baseUnit || 'Unit'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4"><input type="number" placeholder="0" value={setupData[gp.id]?.initialStock || ''} onChange={e => handleSetupChange(gp.id, 'initialStock', e.target.value)} className="w-[100px] border border-[#e2e8f0] px-3 py-2 rounded-lg outline-none focus:border-[#07ac57] text-[#111827] bg-white"/></td>
                            <td className="px-4 py-4"><input type="number" placeholder="0" value={setupData[gp.id]?.reorderLevel || ''} onChange={e => handleSetupChange(gp.id, 'reorderLevel', e.target.value)} className="w-[100px] border border-[#e2e8f0] px-3 py-2 rounded-lg outline-none focus:border-[#07ac57] text-[#111827] bg-white"/></td>
                            <td className="px-4 py-4"><input type="number" value={setupData[gp.id]?.basePrice !== undefined ? setupData[gp.id].basePrice : (gp.basePrice || '')} onChange={e => handleSetupChange(gp.id, 'basePrice', e.target.value)} placeholder="0.00" className="w-[120px] border border-[#e2e8f0] px-3 py-2 rounded-lg outline-none focus:border-[#07ac57] text-[#111827] bg-white"/></td>
                            <td className="px-4 py-4"><input type="text" placeholder="A-12" value={setupData[gp.id]?.location || ''} onChange={e => handleSetupChange(gp.id, 'location', e.target.value)} className="w-[100px] border border-[#e2e8f0] px-3 py-2 rounded-lg outline-none focus:border-[#07ac57] text-[#111827] bg-white"/></td>
                            <td className="px-4 py-4">
                              <div className="relative w-[110px]">
                                <select value={setupData[gp.id]?.status || 'Active'} onChange={e => handleSetupChange(gp.id, 'status', e.target.value)} className="w-full appearance-none border border-[#e2e8f0] px-3 py-2 rounded-lg outline-none focus:border-[#07ac57] text-[#111827] bg-white cursor-pointer font-medium">
                                  <option>Active</option>
                                  <option>Inactive</option>
                                </select>
                                <ChevronDownIcon className="w-4 h-4 text-[#64748b] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <button 
                                onClick={() => setSelectedGlobalProducts(selectedGlobalProducts.filter(id => id !== gp.id))}
                                className="text-[#ef4444] hover:bg-[#fef2f2] p-2 rounded-lg transition-colors flex items-center justify-center mx-auto"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {selectedGlobalProducts.length === 0 && (
                    <div className="p-8 text-center text-[#94a3b8] italic border-t border-[#f1f5f9]">No products selected. Please go back to Step 1.</div>
                  )}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className={`px-6 py-4 border-t border-[#f3f4f6] bg-white flex ${addStep === 2 ? 'justify-between' : 'justify-end'} gap-3`}>
              {addStep === 2 ? (
                <button 
                  onClick={() => setAddStep(1)}
                  className="px-5 py-2.5 border border-[#e2e8f0] text-[#111827] rounded-lg text-sm font-semibold hover:bg-[#f9fafb] transition-colors flex items-center gap-2"
                >
                  &larr; Back to Selection
                </button>
              ) : null}
              
              <div className="flex gap-3">
                {addStep === 2 && (
                  <button 
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-5 py-2.5 border border-[#e2e8f0] text-[#111827] bg-white rounded-lg text-sm font-semibold hover:bg-[#f9fafb] transition-colors"
                  >
                    Cancel
                  </button>
                )}
                {addStep === 1 ? (
                  <button 
                    onClick={() => setAddStep(2)}
                    disabled={selectedGlobalProducts.length === 0}
                    className="px-6 py-2 bg-[#07ac57] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Setup
                  </button>
                ) : (
                  <button 
                    onClick={handleAddInventory}
                    disabled={selectedGlobalProducts.length === 0 || isSubmitting}
                    className="px-6 py-2.5 bg-[#07ac57] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Adding...' : `Add ${selectedGlobalProducts.length} Product(s) to Inventory`}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={() => {
          // Implement delete logic here in real app
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        itemName={itemToDelete?.name}
      />
      
      {selectedProductForAction && (
        <StockActionModal
          isOpen={stockModalOpen}
          onClose={() => {
            setStockModalOpen(false);
            setSelectedProductForAction(null);
          }}
          actionType={activeStockAction}
          product={{
            name: selectedProductForAction.name,
            currentStock: selectedProductForAction.stock,
            unit: selectedProductForAction.unit
          }}
          onSubmit={handleStockActionSubmit}
        />
      )}

      {/* PDF Language Selection Modal */}
      {isPdfLanguageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-[#e2e8f0] relative animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-xl font-bold text-[#0f172a]">Download Product Rate List</h3>
                <p className="text-xs text-[#64748b] mt-0.5">Select your preferred PDF language format</p>
              </div>
              <button 
                onClick={() => !isGeneratingPdf && setIsPdfLanguageModalOpen(false)}
                className="text-[#94a3b8] hover:text-[#0f172a] p-1.5 rounded-lg hover:bg-[#f1f5f9] transition-colors"
                disabled={isGeneratingPdf}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Language Options */}
            <div className="flex flex-col gap-3 mb-6">
              {/* English Option */}
              <div 
                onClick={() => setSelectedPdfLanguage('en')}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedPdfLanguage === 'en'
                    ? 'border-[#07ac57] bg-[#f0fdf4]'
                    : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                }`}
              >
                <div className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selectedPdfLanguage === 'en' ? 'border-[#07ac57] bg-[#07ac57]' : 'border-[#cbd5e1]'
                }`}>
                  {selectedPdfLanguage === 'en' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#0f172a]">English Version</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-[#e2e8f0] text-[#475569] rounded">Standard</span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-1">
                    Rate list in English with standard units (Kg, Rate) and English product names.
                  </p>
                </div>
              </div>

              {/* Hindi Option */}
              <div 
                onClick={() => setSelectedPdfLanguage('hi')}
                className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  selectedPdfLanguage === 'hi'
                    ? 'border-[#07ac57] bg-[#f0fdf4]'
                    : 'border-[#e2e8f0] hover:border-[#cbd5e1] bg-white'
                }`}
              >
                <div className={`w-5 h-5 mt-0.5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  selectedPdfLanguage === 'hi' ? 'border-[#07ac57] bg-[#07ac57]' : 'border-[#cbd5e1]'
                }`}>
                  {selectedPdfLanguage === 'hi' && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#0f172a]">हिन्दी प्रारूप (Hindi Version)</span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 bg-[#dcfce7] text-[#15803d] rounded">लोकल भाव</span>
                  </div>
                  <p className="text-xs text-[#64748b] mt-1">
                    उत्पाद दर सूची (दैनिक भाव) हिन्दी नामों और 'दर' व 'किलो' प्रारूप में।
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsPdfLanguageModalOpen(false)}
                disabled={isGeneratingPdf}
                className="px-4 py-2 border border-[#e2e8f0] text-[#475569] hover:bg-[#f8fafc] text-sm font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setIsGeneratingPdf(true);
                  try {
                    await handleDownloadPDF(selectedPdfLanguage);
                    setIsPdfLanguageModalOpen(false);
                  } finally {
                    setIsGeneratingPdf(false);
                  }
                }}
                disabled={isGeneratingPdf}
                className="px-5 py-2 bg-[#07ac57] hover:bg-[#069a4e] active:scale-95 text-white text-sm font-semibold rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isGeneratingPdf ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <DownloadIcon className="w-4 h-4" />
                    Download {selectedPdfLanguage === 'hi' ? 'हिन्दी' : 'English'} PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatMini({ icon, title, value, unit, color, iconColor, borderHighlight }: { icon: React.ReactNode, title: string, value: string, unit: string, color: string, iconColor?: string, borderHighlight?: string }) {
  return (
    <div className={`bg-white min-w-[160px] flex-1 border border-[#f3f4f6] rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-[#e2e8f0] transition-colors ${borderHighlight || ''}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={iconColor || color}>{icon}</div>
        <p className="text-sm font-medium text-[#6b7280]">{title}</p>
      </div>
      <div>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        <p className="text-xs text-[#94a3b8] mt-1">{unit}</p>
      </div>
    </div>
  );
}

// Icons
function EditIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
}

function FilterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

function SearchIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
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

function TrashIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
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

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function ColumnsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <line x1="12" y1="3" x2="12" y2="21"/>
    </svg>
  );
}

function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
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

function CheckCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

function TrendingUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
      <polyline points="17 6 23 6 23 12"/>
    </svg>
  );
}

function TrendingDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
      <polyline points="17 18 23 18 23 12"/>
    </svg>
  );
}

function InboxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/>
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>
    </svg>
  );
}

function AlertCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function XCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  );
}

function EyeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
