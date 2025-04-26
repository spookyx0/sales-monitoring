"use client"

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import api from '../lib/api';
import { Item } from '@prisma/client';

type ItemFormValues = {
  name: string;
  itemNumber: number;
};

type ItemFormProps = {
  item: Item | null;
  onClose: () => void;
  onSuccess: (item: Item) => void;
};

export default function ItemForm({ item, onClose, onSuccess }: ItemFormProps) {
  const { register, handleSubmit, reset } = useForm<ItemFormValues>({
    defaultValues: item
      ? {
          name: item.name,
          itemNumber: item.itemNumber,
        }
      : {
          name: '',
          itemNumber: 0,
        },
  });

  const onSubmit: SubmitHandler<ItemFormValues> = async (data) => {
    try {
      const preparedData = {
        ...data,
        itemNumber: Number(data.itemNumber), // ensure it's a number
      };

      let response;
      if (item) {
        response = await api.put(`/items/${item.id}`, preparedData);
      } else {
        response = await api.post('/items', preparedData);
      }

      onSuccess(response.data);
      reset();
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{item ? 'Edit Item' : 'Add Item'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1">Item Number</label>
            <input
              type="number"
              {...register('itemNumber', { required: true })}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-1">Item Name</label>
            <input
              type="text"
              {...register('name', { required: true })}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              {item ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}