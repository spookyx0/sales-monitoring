"use client"

import React from 'react';
import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Price, Item } from '@prisma/client';
import PriceForm from '../components/PriceForm';

type PriceWithItem = Price & { item: Item };

export default function PricesPage() {
  const [prices, setPrices] = useState<PriceWithItem[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<PriceWithItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [priceRes, itemRes] = await Promise.all([
        api.get('/prices'),
        api.get('/items'),
      ]);
      setPrices(priceRes.data);
      setItems(itemRes.data);
    };
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    await api.delete(`/prices/${id}`);
    setPrices(prices.filter((p) => p.id !== id));
  };

  const handleSuccess = async () => {
    const res = await api.get('/prices');
    setPrices(res.data);
    setShowModal(false);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Price List</h1>

      <button
        onClick={() => {
          setSelectedPrice(null);
          setShowModal(true);
        }}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Add Price
      </button>

      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2">Item</th>
            <th className="border px-4 py-2">Price</th>
            <th className="border px-4 py-2">Effective Date</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((p) => (
            <tr key={p.id}>
              <td className="border px-4 py-2">{p.item.name}</td>
              <td className="border px-4 py-2">₱{p.amount.toFixed(2)}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => {
                    setSelectedPrice(p);
                    setShowModal(true);
                  }}
                  className="bg-yellow-400 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <PriceForm
          price={selectedPrice}
          items={items}
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
}