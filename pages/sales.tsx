// pages/sales.tsx
import { useEffect, useState } from 'react';
import { Sale, Item } from '@prisma/client';
import api from '../lib/api';
import SalesForm from '../components/SaleForm';

type SaleWithItem = {
  id: number;
  quantity: number;
  total: number;
  itemId: number;
  soldAt: string;
  item: {
    id: number;
    name: string;
    itemNumber: number;
  };
};

export default function SalesPage() {
  const [sales, setSales] = useState<SaleWithItem[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedSale, setSelectedSale] = useState<SaleWithItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchSales = async () => {
    const [saleRes, itemRes] = await Promise.all([
      api.get('/sales'),
      api.get('/items'),
    ]);
    setSales(saleRes.data);
    setItems(itemRes.data);
  };

  useEffect(() => {
    fetchSales();
  }, []);

  const handleDelete = async (id: number) => {
    await api.delete(`/sales/${id}`);
    fetchSales();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sales Tracking</h1>

      <button
        onClick={() => {
          setSelectedSale(null);
          setShowModal(true);
        }}
        className="bg-green-600 text-white px-4 py-2 rounded mb-4"
      >
        Add Sale
      </button>

      <table className="min-w-full border table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2">Item</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Total</th>
            <th className="border px-4 py-2">Date Sold</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s) => (
            <tr key={s.id}>
              <td className="border px-4 py-2">{s.item.name}</td>
              <td className="border px-4 py-2">{s.quantity}</td>
              <td className="border px-4 py-2">₱{s.total.toFixed(2)}</td>
              <td className="border px-4 py-2">{new Date(s.soldAt).toLocaleDateString()}</td>
              <td className="border px-4 py-2 space-x-2">
                <button
                  onClick={() => {
                    setSelectedSale(s);
                    setShowModal(true);
                  }}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
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
        <SalesForm
          sale={selectedSale}
          items={items}
          onClose={() => setShowModal(false)}
          onSuccess={fetchSales}
        />
      )}
    </div>
  );
}