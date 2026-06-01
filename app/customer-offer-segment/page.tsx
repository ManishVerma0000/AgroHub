"use client";

import React, { useState, useEffect, SVGProps } from "react";
import { customerService, Customer } from "../../services/customerService";
import { offerService, Offer } from "../../services/offerService";
import api from "../../services/api";
import toast from "react-hot-toast";

// Interface for evaluation result from backend
interface EvaluationResult {
  offer: Offer | null;
  logs: string[];
  customerStatus: string;
  customerType: string;
  customerName: string;
  customerPhone: string;
  totalOrders: number;
}

export default function CustomerOfferSegmentPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [cartValue, setCartValue] = useState<number>(1000);
  
  // Simulation overrides
  const [useSimulationMode, setUseSimulationMode] = useState<boolean>(false);
  const [simulatedInactive, setSimulatedInactive] = useState<boolean>(false);
  const [simulatedNew, setSimulatedNew] = useState<boolean>(false);

  // Result state
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);

  // Create Offer Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    offerName: "",
    offerType: "CART VALUE" as "CART VALUE" | "NEW CUSTOMER" | "WIN-BACK",
    minOrderValue: "",
    benefitType: "Flat" as "L" | "M" | "H" | "Flat",
    benefitValue: "",
    usageLimit: "1",
    usageType: "Once" as "Monthly" | "Weekly" | "Once" | "Unlimited",
    validUntil: "",
    status: true,
    imageUrl: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      setIsUploading(true);
      const res = await api.post("/upload/", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFormData(prev => ({ ...prev, imageUrl: res.data.image_url }));
      toast.success("Image uploaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const openModal = () => {
    setFormData({
      offerName: "",
      offerType: "CART VALUE",
      minOrderValue: "",
      benefitType: "Flat",
      benefitValue: "",
      usageLimit: "1",
      usageType: "Once",
      validUntil: "",
      status: true,
      imageUrl: "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (!formData.offerName || formData.minOrderValue === "" || formData.benefitValue === "" || !formData.validUntil) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = {
      offerName: formData.offerName,
      offerType: formData.offerType,
      minOrderValue: Number(formData.minOrderValue),
      benefitType: formData.benefitType,
      benefitValue: Number(formData.benefitValue),
      usageLimit: Number(formData.usageLimit),
      usageType: formData.usageType,
      validUntil: new Date(formData.validUntil).toISOString(),
      status: (formData.status ? "Active" : "Inactive") as "Active" | "Inactive",
      imageUrl: formData.imageUrl,
    };

    try {
      await offerService.create(payload);
      toast.success("Offer created successfully");
      closeModal();
      fetchData(); // Refresh metrics instantly
    } catch (err) {
      console.error(err);
      toast.error("Failed to save offer");
    }
  };

  // Fetch initial data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [custList, offerList] = await Promise.all([
        customerService.getAll(),
        offerService.getAll(),
      ]);
      setCustomers(custList);
      setOffers(offerList);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load customer list or offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // When customer changes, preset variables or reset results
  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cid = e.target.value;
    setSelectedCustomerId(cid);
    setEvaluationResult(null); // Clear previous trace logs
    
    if (cid && !useSimulationMode) {
      const selected = customers.find(c => c.id === cid);
      if (selected) {
        toast.success(`Loaded customer: ${selected.shopName || selected.ownerName}`);
      }
    }
  };

  // Evaluate route
  const handleEvaluate = async () => {
    if (!useSimulationMode && !selectedCustomerId) {
      toast.error("Please select a customer or enable Simulation Mode.");
      return;
    }

    try {
      setEvaluating(true);
      const payload = {
        customerId: useSimulationMode ? null : selectedCustomerId,
        cartValue: Number(cartValue),
        simulateInactive: useSimulationMode ? simulatedInactive : null,
        simulateNew: useSimulationMode ? simulatedNew : null,
      };

      const res = await api.post("/offers/evaluate", payload);
      setEvaluationResult(res.data);
      toast.success("Offer evaluation complete!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to evaluate offer segments");
    } finally {
      setEvaluating(false);
    }
  };

  // Get active customer details helper
  const getActiveCustomerDetails = () => {
    if (useSimulationMode) {
      return {
        name: "Simulated Guest Profile",
        phone: "SIM-00000",
        status: simulatedInactive ? "Inactive" : "Active",
        type: simulatedNew ? "New" : "Existing (Low/Medium/High)",
        orders: simulatedNew ? 0 : 5
      };
    }
    const customer = customers.find(c => c.id === selectedCustomerId);
    if (customer) {
      return {
        name: customer.shopName || customer.ownerName || "Unknown",
        phone: customer.mobileNumber || "N/A",
        status: customer.customerStatus || "Active",
        type: customer.customerType || "Low",
        orders: customer.totalOrders || 0
      };
    }
    return null;
  };

  const activeDetails = getActiveCustomerDetails();

  // Helper to color log rows
  const getLogRowStyle = (log: string) => {
    if (log.includes("🎉 SUCCESS") || log.includes("applied")) return "text-[#10b981] font-semibold";
    if (log.includes("❌ Rejected") || log.includes("Condition failed")) return "text-[#ef4444]";
    if (log.includes("⚠️") || log.includes("Skipping")) return "text-[#f59e0b]";
    if (log.includes("🔍") || log.includes("Loaded database")) return "text-[#3b82f6]";
    if (log.includes("⚙️") || log.includes("Override")) return "text-[#c084fc]";
    return "text-[#94a3b8]";
  };

  return (
    <div className="flex flex-col gap-8 max-w-[1400px] p-6 text-slate-800 font-sans">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">Customer Offer Segment</h1>
          <p className="text-sm text-[#64748b] mt-1">
            Dynamic target rule engine to prioritize, validate, and simulate customer incentives.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#07ac57] text-white rounded-xl text-sm font-semibold hover:bg-[#06994e] active:scale-95 transition-all shadow-[0_4px_14px_rgba(7,172,87,0.3)]"
          >
            <PlusIcon className="w-4 h-4" />
            Create Offer
          </button>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#e8f5ed] text-[#07ac57]">
            <span className="w-2 h-2 rounded-full bg-[#07ac57] animate-pulse" />
            Evaluation Engine Active
          </span>
        </div>
      </div>

      {/* Segment Distribution & Target Objectives Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-[#07ac57] to-[#059048] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold">1. Win-Back Offers</h3>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              Targeted to inactive customers to restore interaction. This segment holds the highest priority in checkout matches.
            </p>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black">{offers.filter(o => o.offerType === "WIN-BACK" && o.status === "Active").length}</span>
            <span className="text-xs text-white/80">Active Campaigns</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#3b82f6] to-[#2563eb] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold">2. New Customer Offers</h3>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              Incentivize initial purchases and maximize checkout conversions for first-time shoppers. Evaluated at Priority 2.
            </p>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black">{offers.filter(o => o.offerType === "NEW CUSTOMER" && o.status === "Active").length}</span>
            <span className="text-xs text-white/80">Active Campaigns</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#9333ea] to-[#7c3aed] text-white p-6 rounded-2xl shadow-md flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold">3. Cart Value Offers</h3>
            <p className="text-xs text-white/80 mt-1 leading-relaxed">
              Volume discounts triggered upon exceeding order thresholds. Evaluated as a baseline fallback when segments don't match.
            </p>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black">{offers.filter(o => o.offerType === "CART VALUE" && o.status === "Active").length}</span>
            <span className="text-xs text-white/80">Active Slabs</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Playground Control Panel (Left) & Live Trace Logic (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Playground Panel */}
        <div className="xl:col-span-5 flex flex-col gap-6">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl shadow-sm p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center border-b border-[#f1f5f9] pb-4">
              <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                <SlidersIcon className="w-5 h-5 text-[#07ac57]" />
                Incentive Simulator
              </h2>
              
              <button 
                onClick={() => {
                  setUseSimulationMode(!useSimulationMode);
                  setEvaluationResult(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  useSimulationMode 
                    ? "bg-[#64748b] text-white hover:bg-slate-700" 
                    : "bg-[#07ac57]/10 text-[#07ac57] hover:bg-[#07ac57]/20"
                }`}
              >
                {useSimulationMode ? "Select Real Customer" : "Simulate Guest Status"}
              </button>
            </div>

            {/* Inputs: Real DB Customer vs Simulated Customer Toggles */}
            {!useSimulationMode ? (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#475569]">Select Database Customer</label>
                <div className="relative">
                  <select 
                    value={selectedCustomerId}
                    onChange={handleCustomerChange}
                    className="w-full pl-3 pr-10 py-2.5 border border-[#e2e8f0] bg-white rounded-xl text-[#1e293b] text-sm font-medium outline-none cursor-pointer focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57]"
                  >
                    <option value="">-- Choose a Customer Profile --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.shopName || c.ownerName} ({c.customerStatus || "Active"} | {c.customerType || "New"})
                      </option>
                    ))}
                  </select>
                </div>
                <p className="text-[11px] text-[#94a3b8] mt-0.5">
                  Loads real computed segments and transaction stats from MongoDB customer schemas.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl">
                <h4 className="text-xs font-bold text-[#475569] uppercase tracking-wider">Simulated Segment Settings</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#1e293b]">Is Inactive Customer?</p>
                    <p className="text-[11px] text-[#64748b]">Toggles priority WIN-BACK checks.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={simulatedInactive}
                      onChange={(e) => {
                        setSimulatedInactive(e.target.checked);
                        setEvaluationResult(null);
                      }}
                    />
                    <div className="w-11 h-6 bg-[#e2e8f0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ef4444]"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between border-t border-[#e2e8f0] pt-4">
                  <div>
                    <p className="text-sm font-semibold text-[#1e293b]">Is First-Time Shopper?</p>
                    <p className="text-[11px] text-[#64748b]">Toggles priority NEW CUSTOMER checks.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={simulatedNew}
                      onChange={(e) => {
                        setSimulatedNew(e.target.checked);
                        setEvaluationResult(null);
                      }}
                    />
                    <div className="w-11 h-6 bg-[#e2e8f0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#3b82f6]"></div>
                  </label>
                </div>
              </div>
            )}

            {/* Cart Value input */}
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-[#475569]">Checkout Cart Value</label>
                <span className="text-sm font-bold text-[#07ac57] bg-[#e8f5ed] px-2 py-1 rounded">
                  ${Number(cartValue).toLocaleString()}
                </span>
              </div>
              
              <input 
                type="range" 
                min="0" 
                max="10000" 
                step="50" 
                value={cartValue}
                onChange={(e) => {
                  setCartValue(Number(e.target.value));
                  setEvaluationResult(null);
                }}
                className="w-full accent-[#07ac57] bg-[#cbd5e1] rounded-lg h-2 cursor-pointer"
              />
              
              <input 
                type="number"
                value={cartValue}
                onChange={(e) => {
                  setCartValue(Math.max(0, Number(e.target.value)));
                  setEvaluationResult(null);
                }}
                className="w-full mt-1 px-3 py-2 border border-[#e2e8f0] rounded-xl text-sm focus:outline-none focus:border-[#07ac57]"
                placeholder="Type absolute cart amount"
              />
            </div>

            {/* Selected Profile Stats Metadata */}
            {activeDetails && (
              <div className="p-4 bg-[#f8fafc] border border-[#e2e8f0] rounded-xl flex flex-col gap-2.5">
                <h4 className="text-xs font-bold text-[#64748b] uppercase tracking-wider">Evaluation Profile Stats</h4>
                <div className="grid grid-cols-2 gap-y-2 text-xs">
                  <div className="text-[#64748b]">Name:</div>
                  <div className="font-semibold text-right text-slate-800">{activeDetails.name}</div>
                  
                  <div className="text-[#64748b]">Mobile No:</div>
                  <div className="font-semibold text-right text-slate-800">{activeDetails.phone}</div>

                  <div className="text-[#64748b]">Total Order History:</div>
                  <div className="font-semibold text-right text-slate-800">{activeDetails.orders} orders</div>
                  
                  <div className="text-[#64748b]">Resolved Segment:</div>
                  <div className="text-right">
                    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      activeDetails.status === "Inactive" ? "bg-red-50 text-red-600" : "bg-[#dcfce7] text-[#07ac57]"
                    }`}>
                      {activeDetails.status}
                    </span>
                    <span className="ml-1.5 inline-flex px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600">
                      {activeDetails.type}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Run Button */}
            <button
              onClick={handleEvaluate}
              disabled={evaluating || (!useSimulationMode && !selectedCustomerId)}
              className="w-full py-3 bg-[#07ac57] text-white rounded-xl text-sm font-bold hover:bg-[#06994e] active:scale-[0.98] transition-all disabled:opacity-50 shadow-md shadow-[#07ac57]/20 flex items-center justify-center gap-2"
            >
              {evaluating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Running rule validations...
                </>
              ) : (
                <>
                  <PlayIcon className="w-4 h-4" />
                  Evaluate Offer Rules
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Rules flowchart, applied result, and real-time step terminal */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          
          {/* Top Panel: Interactive Receipt and Rules Flowchart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Rules Flowchart (Priority Visualizer) */}
            <div className="lg:col-span-7 bg-white border border-[#e2e8f0] rounded-2xl shadow-sm p-6 flex flex-col gap-4">
              <h3 className="text-sm font-bold text-[#111827] uppercase tracking-wider">Evaluation Priority Rules</h3>
              
              <div className="flex flex-col gap-4 relative">
                
                {/* Rule Node 1 */}
                <div className={`p-3 rounded-xl border transition-all ${
                  evaluationResult && evaluationResult.customerStatus === "Inactive" && evaluationResult.offer && evaluationResult.offer.offerType === "WIN-BACK"
                    ? "bg-[#fef2f2] border-red-200 ring-2 ring-red-400"
                    : "bg-[#fff] border-[#e2e8f0] opacity-80"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xs font-bold">1</span>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">WIN-BACK Offer Check</h5>
                      <p className="text-[10px] text-[#64748b]">{"IF customerStatus = INACTIVE & offer exists"}</p>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center -my-2">
                  <ArrowDownIcon className="w-4 h-4 text-[#94a3b8]" />
                </div>

                {/* Rule Node 2 */}
                <div className={`p-3 rounded-xl border transition-all ${
                  evaluationResult && evaluationResult.customerType === "New" && evaluationResult.offer && evaluationResult.offer.offerType === "NEW CUSTOMER"
                    ? "bg-blue-50 border-blue-200 ring-2 ring-blue-400"
                    : "bg-[#fff] border-[#e2e8f0] opacity-80"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">2</span>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">NEW CUSTOMER Offer Check</h5>
                      <p className="text-[10px] text-[#64748b]">{"IF customerType = NEW (0 orders) & offer exists"}</p>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center -my-2">
                  <ArrowDownIcon className="w-4 h-4 text-[#94a3b8]" />
                </div>

                {/* Rule Node 3 */}
                <div className={`p-3 rounded-xl border transition-all ${
                  evaluationResult && evaluationResult.offer && evaluationResult.offer.offerType === "CART VALUE"
                    ? "bg-purple-50 border-purple-200 ring-2 ring-purple-400"
                    : "bg-[#fff] border-[#e2e8f0] opacity-80"
                }`}>
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">3</span>
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">CART VALUE Offer Check</h5>
                      <p className="text-[10px] text-[#64748b]">{"Fallback: IF cartValue >= minOrderValue"}</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Receipt Visual Output */}
            <div className="lg:col-span-5 bg-[#1e293b] text-white rounded-2xl shadow-lg p-6 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-24 h-24 bg-white/5 rounded-full blur-xl pointer-events-none" />
              
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-800 px-2 py-1 rounded">
                  Calculated Output
                </span>
                
                {evaluationResult ? (
                  <div className="mt-4 flex flex-col gap-3">
                    <div className="text-xs text-slate-400">Applied Offer:</div>
                    <div className="text-lg font-black text-[#10b981] leading-tight">
                      {evaluationResult.offer ? evaluationResult.offer.offerName : "NO OFFER APPLICABLE"}
                    </div>
                    
                    {evaluationResult.offer && (
                      <div className="flex flex-col gap-1 border-t border-slate-700/50 pt-2 text-xs">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Offer Type:</span>
                          <span className="font-semibold">{evaluationResult.offer.offerType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Benefit Type:</span>
                          <span className="font-semibold">{evaluationResult.offer.benefitType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Incentive Off:</span>
                          <span className="font-semibold text-[#10b981]">${evaluationResult.offer.benefitValue}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-8 text-center text-xs text-slate-400 py-4">
                    Ready to compute checkout. Click 'Evaluate Offer Rules' to run simulation.
                  </div>
                )}
              </div>

              {evaluationResult && (
                <div className="border-t border-slate-700 pt-4 mt-4">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Original Price:</span>
                    <span>${Number(cartValue).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#10b981] mt-1 font-semibold">
                    <span>Discount Applied:</span>
                    <span>-${evaluationResult.offer ? Number(evaluationResult.offer.benefitValue).toFixed(2) : "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-white border-t border-dashed border-slate-700 mt-2 pt-2">
                    <span>Total Checkout:</span>
                    <span>
                      ${Math.max(0, Number(cartValue) - (evaluationResult.offer ? Number(evaluationResult.offer.benefitValue) : 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Bottom Panel: Dynamic terminal tracing logs */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl shadow-xl p-6 flex flex-col gap-4 font-mono">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <span className="text-xs font-semibold text-slate-400 ml-2">Trace Logs Terminal</span>
              </div>
              {evaluationResult && (
                <button 
                  onClick={() => setEvaluationResult(null)}
                  className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Clear Console
                </button>
              )}
            </div>

            <div className="h-60 overflow-y-auto flex flex-col gap-1.5 text-xs text-slate-300 select-all pr-2">
              {evaluationResult ? (
                evaluationResult.logs.map((log, i) => (
                  <div key={i} className={`whitespace-pre-wrap leading-relaxed ${getLogRowStyle(log)}`}>
                    {log}
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                  <TerminalIcon className="w-8 h-8 text-slate-700 animate-pulse" />
                  <span>Interactive diagnostics output will stream here in real-time...</span>
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-[500px] bg-white rounded-2xl shadow-xl flex flex-col text-slate-800">
            <div className="px-6 py-5 flex items-center justify-between border-b border-[#f1f5f9]">
              <h2 className="text-lg font-bold text-[#111827]">Create Offer</h2>
              <button onClick={closeModal} className="text-[#94a3b8] hover:text-[#111827]">
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
              {/* Banner Upload */}
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-semibold text-[#475569]">Offer Banner</label>
                <div 
                  className="relative h-28 w-full bg-[#f8fafc] border border-dashed border-[#cbd5e1] rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#f1f5f9] transition-colors overflow-hidden"
                  onClick={() => document.getElementById('segment-banner-upload')?.click()}
                >
                  {formData.imageUrl ? (
                    <>
                      <img src={formData.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white/90 px-3 py-1 rounded-full text-[10px] font-bold text-[#111827]">Change Image</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm border border-[#e2e8f0]">
                        {isUploading ? (
                          <div className="w-4 h-4 border-2 border-[#07ac57] border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <PlusIcon className="w-5 h-5 text-[#94a3b8]" />
                        )}
                      </div>
                      <span className="text-xs text-[#64748b] font-medium">Upload Banner</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    id="segment-banner-upload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUploading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-1.5">Offer Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. FLAT 100 OFF"
                  value={formData.offerName}
                  onChange={(e) => setFormData({ ...formData, offerName: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-1.5">Offer Type <span className="text-red-500">*</span></label>
                <select
                  value={formData.offerType}
                  onChange={(e) => setFormData({ ...formData, offerType: e.target.value as any })}
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57]"
                >
                  <option value="CART VALUE">CART VALUE</option>
                  <option value="NEW CUSTOMER">NEW CUSTOMER</option>
                  <option value="WIN-BACK">WIN-BACK</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-1.5">Min Order Value <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1.5">Benefit Type</label>
                  <select
                    value={formData.benefitType}
                    onChange={(e) => setFormData({ ...formData, benefitType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57]"
                  >
                    <option value="Flat">Flat</option>
                    <option value="L">L (Low)</option>
                    <option value="M">M (Medium)</option>
                    <option value="H">H (High)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1.5">Discount <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    value={formData.benefitValue}
                    onChange={(e) => setFormData({ ...formData, benefitValue: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1.5">Usage Type</label>
                  <select
                    value={formData.usageType}
                    onChange={(e) => setFormData({ ...formData, usageType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57]"
                  >
                    <option value="Once">Once</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Unlimited">Unlimited</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#475569] mb-1.5">Usage Limit</label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#475569] mb-1.5">Valid Until <span className="text-red-500">*</span></label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e2e8f0] rounded-lg text-sm focus:outline-none focus:border-[#07ac57] focus:ring-1 focus:ring-[#07ac57]"
                />
              </div>

              <div className="flex items-center justify-between border-t border-[#f1f5f9] pt-4 mt-2">
                <div>
                  <p className="text-sm font-semibold text-[#111827]">Status</p>
                  <p className="text-[11px] text-[#64748b]">Enable or disable this offer</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-[#e2e8f0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#07ac57]"></div>
                </label>
              </div>
            </div>

            <div className="p-6 border-t border-[#f1f5f9] flex items-center justify-between gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 px-4 bg-white border border-[#e2e8f0] text-[#64748b] rounded-xl text-sm font-semibold hover:bg-[#f8fafc] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 px-4 bg-[#07ac57] text-white rounded-xl text-sm font-semibold hover:bg-[#06994e] transition-colors shadow-sm"
              >
                Create Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Custom SVGs
function SlidersIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="4" y1="21" x2="4" y2="14" />
      <line x1="4" y1="10" x2="4" y2="3" />
      <line x1="12" y1="21" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12" y2="3" />
      <line x1="20" y1="21" x2="20" y2="16" />
      <line x1="20" y1="10" x2="20" y2="3" />
      <line x1="2" y1="14" x2="6" y2="14" />
      <line x1="10" y1="8" x2="14" y2="8" />
      <line x1="18" y1="16" x2="22" y2="16" />
    </svg>
  );
}

function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function TerminalIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  );
}

function ArrowDownIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  );
}

function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}

function PlusIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}
