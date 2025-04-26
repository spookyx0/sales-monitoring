"use client"

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import api from '../lib/api';
import { Price, Item } from '@prisma/client';

type PriceFormValues = {
  itemId: number;
  price: number;
  dateEffective: string;
};

type PriceFormProps = {
  price: Price | null;
  items: Item[];
  onClose: () => void;
  onSuccess: (price: Price) => void;
};

export default function PriceForm({ price, items, onClose, onSuccess }: PriceFormProps) {
  const { register, handleSubmit, reset } = useForm<PriceFormValues>({
    defaultValues: price
      ? {
          itemId: price.itemId,
          price: price.amount,
        }
      : {
          itemId: items[0]?.id || 0,
          price: 0,
          dateEffective: '',
        },
  });

  const onSubmit: SubmitHandler<PriceFormValues> = async (data) => {
    try {
      const formatted = {
        ...data,
        itemId: Number(data.itemId),
        price: Number(data.price),
      };

      let response;
      if (price) {
        response = await api.put(`/prices/${price.id}`, formatted);
      } else {
        response = await api.post('/prices', formatted);
      }

      onSuccess(response.data);
      reset();
    } catch (error) {
      console.error('Error submitting price form', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{price ? 'Edit Price' : 'Add Price'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Item</label>
            <select {...register('itemId')} className="border w-full px-3 py-2 rounded">
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1">Price</label>
            <input
              type="number"
              {...register('price', { required: true })}
              className="border w-full px-3 py-2 rounded"
            />
          </div>
          <div>
            <label className="block mb-1">Date Effective</label>
            <input
              type="date"
              {...register('dateEffective', { required: true })}
              className="border w-full px-3 py-2 rounded"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
              {price ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
