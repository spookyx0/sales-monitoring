import { useEffect, useState } from 'react';
import api from '../lib/api';
import { Item } from '@prisma/client'; // Make sure you have the correct types
import ItemForm from '../components/ItemForm';

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch all items from the backend
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get('/items');
        setItems(response.data);
      } catch (error) {
        console.error('Error fetching items', error);
      }
    };
    fetchItems();
  }, []);

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/items/${id}`);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting item', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Items</h1>

      <button
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Add Item
      </button>

      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="border px-4 py-2">Item Number</th>
            <th className="border px-4 py-2">Item Name</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td className="border px-4 py-2">{item.itemNumber}</td>
              <td className="border px-4 py-2">{item.name}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
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
        <ItemForm
          item={selectedItem}
          onClose={() => setShowModal(false)}
          onSuccess={(newItem: Item) => {
            setItems(prevItems => {
              if (selectedItem) {
                return prevItems.map(item =>
                  item.id === selectedItem.id ? newItem : item
                );
              }
              return [newItem, ...prevItems];
            });
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}
