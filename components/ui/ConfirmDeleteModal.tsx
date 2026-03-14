'use client';

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export function ConfirmDeleteModal({ isOpen, onClose, onConfirm, itemName = 'this item' }: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4 text-[#4b5563]">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </div>
          <p className="text-sm">
            Are you sure you want to delete <span className="font-semibold text-[#111827]">{itemName}</span>? This action cannot be undone.
          </p>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose} className="px-6">
            Cancel
          </Button>
          <Button variant="danger" onClick={() => {
            onConfirm();
            onClose();
          }} className="px-6">
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
