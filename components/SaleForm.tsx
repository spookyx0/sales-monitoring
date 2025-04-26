"use client";

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Item } from '@prisma/client';
import api from '../lib/api';

type SaleFormValues = {
  itemId: number;
  quantity: number;
  total: number;
  soldAt: string;
};

type SaleWithSoldAt = {
  id: number;
  quantity: number;
  total: number;
  itemId: number;
  soldAt: string; // manually define soldAt
};

type Props = {
  sale: SaleWithSoldAt | null;
  items: Item[];
  onClose: () => void;
  onSuccess: () => void;
};

export default function SalesForm({ sale, items, onClose, onSuccess }: Props) {
  const { register, handleSubmit } = useForm<SaleFormValues>({
    defaultValues: sale
      ? {
          itemId: sale.itemId,
          quantity: sale.quantity,
          total: sale.total,
          soldAt: sale.soldAt.split('T')[0],
        }
      : {
          itemId: items[0]?.id || 0,
          quantity: 1,
          total: 0,
          soldAt: new Date().toISOString().split('T')[0],
        },
  });

  const onSubmit: SubmitHandler<SaleFormValues> = async (data) => {
    if (sale) {
      await api.put(`/sales/${sale.id}`, data);
    } else {
      await api.post('/sales', data);
    }
    onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{sale ? 'Edit Sale' : 'Add Sale'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block">Item</label>
            <select {...register('itemId')} className="w-full border px-3 py-2 rounded">
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block">Quantity</label>
            <input type="number" {...register('quantity')} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block">Total</label>
            <input type="number" step="0.01" {...register('total')} className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block">Date Sold</label>
            <input type="date" {...register('soldAt')} className="w-full border px-3 py-2 rounded" />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              {sale ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}