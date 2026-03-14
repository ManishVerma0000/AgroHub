'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Button } from '@/components/ui/Button';
import StatusToggle from '../StatusToggle/StatusToggle';

interface CategoryFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export function CategoryForm({ initialData, onSave, onCancel }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    priority: '',
    description: '',
    status: ""
  });

  const [image, setImage] = useState<File | null>(null);
  const [status, setStatus] = useState<string>('')

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        priority: initialData.priority?.toString() || '',
        description: initialData.description || '',
        status: status
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Category Form Submitted:', { ...formData, image });
    onSave({
      name: formData.name,
      priority: parseInt(formData.priority, 10),
      description: formData.description,
      status:status
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[#f3f4f6] p-8 max-w-4xl shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col gap-6">
          <Input
            label="Category Name"
            placeholder="e.g. Fruits & Vegetables"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Priority"
            type="number"
            placeholder="e.g. 1"
            required
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          />
          <div className="flex flex-col gap-1.5 w-full">
            <label className="text-sm font-medium text-[#374151]">Description</label>
            <textarea
              className="w-full bg-white border border-[#d1d5db] rounded-lg py-2 px-3 text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#07ac57]/20 focus:border-[#07ac57] transition-all min-h-[120px] resize-y"
              placeholder="Enter category description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5 h-full">
          <ImageUpload
            label="Category Image"
            className="h-full flex-1"
            onChange={setImage}
          />
        </div>
        <StatusToggle
          label="Status"
          onChange={(value) =>
            setStatus(value)
          }
        />

      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-[#f3f4f6]">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Update Category' : 'Save Category'}
        </Button>
      </div>
    </form>
  );
}
