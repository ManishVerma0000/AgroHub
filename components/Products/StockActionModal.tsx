'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';

export type StockActionType = 'Add Stock' | 'Reduce Stock' | 'Update Missing Stock' | 'Update Wastage Stock' | 'Update Reorder Level' | 'Update Base Price';

interface StockActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  actionType: StockActionType | null;
  product: {
    name: string;
    currentStock: number;
    unit: string;
  };
  onSubmit: (actionType: StockActionType, quantity: number, reason: string, notes: string) => Promise<void>;
}

export function StockActionModal({ isOpen, onClose, actionType, product, onSubmit }: StockActionModalProps) {
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!actionType) return null;

  const isReorder = actionType === 'Update Reorder Level';
  const isBasePrice = actionType === 'Update Base Price';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || isNaN(Number(quantity))) return;
    
    setIsSubmitting(true);
    try {
      await onSubmit(actionType, Number(quantity), reason, notes);
      setQuantity('');
      setReason('');
      setNotes('');
      onClose();
    } catch (error) {
      console.error("Submission failed", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderAlert = () => {
    if (actionType === 'Update Missing Stock') {
      return (
        <div className="bg-[#fefce8] text-[#d97706] p-3 rounded-md text-sm mt-4 flex gap-2 items-start">
          <span>⚠️</span>
          <p>
            This action will reduce current stock by {quantity || '0'} {product.unit}. This operation creates a stock movement record for audit trail.
          </p>
        </div>
      );
    }
    if (actionType === 'Update Wastage Stock') {
      return (
        <div className="bg-[#fef2f2] text-[#ef4444] p-3 rounded-md text-sm mt-4 flex gap-2 items-start">
          <span>⚠️</span>
          <p>
            This action will reduce current stock by {quantity || '0'} {product.unit}. This operation creates a stock movement record for audit trail.
          </p>
        </div>
      );
    }
    if (actionType === 'Update Reorder Level') {
      return (
        <div className="bg-[#eff6ff] text-[#3b82f6] p-3 rounded-md text-sm mt-4 flex gap-2 items-start">
          <span>💡</span>
          <p>
            The reorder level is the minimum stock quantity that triggers a low stock alert.
          </p>
        </div>
      );
    }
    if (actionType === 'Update Base Price') {
      return (
        <div className="bg-[#eff6ff] text-[#3b82f6] p-3 rounded-md text-sm mt-4 flex gap-2 items-start">
          <span>💰</span>
          <p>
            Updating the base price will automatically recalculate the selling price based on logistics and overhead costs.
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={actionType}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        
        {/* Product Info Box */}
        <div className="bg-[#f9fafb] p-4 rounded-lg flex flex-col gap-1">
          <span className="text-xs text-[#6b7280]">Product</span>
          <span className="text-[15px] font-bold text-[#111827]">{product.name}</span>
          {actionType !== 'Add Stock' && (
            <span className="text-xs text-[#6b7280] mt-1">
              Current Stock: {product.currentStock} {product.unit}
            </span>
          )}
        </div>

        {/* Quantity / Reorder Level / Base Price Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#374151]">
            {isReorder ? 'New Reorder Level' : isBasePrice ? 'New Base Price' : 'Quantity'} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder={isReorder ? 'Enter reorder threshold' : isBasePrice ? 'Enter new base price' : 'Enter quantity'}
              className="w-full px-4 py-2.5 border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent text-sm pr-12"
              required
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <span className="text-[#6b7280] text-sm">{isBasePrice ? '₹' : (product.unit === 'N/A' || !product.unit ? 'Units' : product.unit)}</span>
            </div>
          </div>
        </div>

        {/* Reason Field */}
        {!isReorder && !isBasePrice && (
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#374151]">
              Reason {(actionType === 'Update Missing Stock' || actionType === 'Update Wastage Stock') && <span className="text-red-500">*</span>}
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={
                actionType === 'Add Stock' ? 'e.g., PO Received, Transfer In' :
                actionType === 'Reduce Stock' ? 'e.g., Order Dispatch, Adjustment' :
                actionType === 'Update Missing Stock' ? 'e.g., Stock Discrepancy, Physical Count' :
                'e.g., Quality Issue, Damage, Expiry'
              }
              className="w-full px-4 py-2.5 border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent text-sm"
              required={actionType === 'Update Missing Stock' || actionType === 'Update Wastage Stock'}
            />
          </div>
        )}

        {/* Notes Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-[#374151]">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any additional notes..."
            className="w-full px-4 py-2.5 border border-[#d1d5db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent text-sm min-h-[100px] resize-y"
          />
        </div>

        {/* Dynamic Alerts */}
        {renderAlert()}

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-2 pt-4 border-t border-[#f3f4f6]">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-[#d1d5db] text-[#374151] font-semibold rounded-lg text-sm hover:bg-[#f9fafb] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-[#86efac] text-white font-semibold rounded-lg text-sm hover:bg-[#4ade80] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : (isReorder || isBasePrice ? 'Update' : 'Confirm')}
          </button>
        </div>
      </form>
    </Modal>
  );
}
