import { useForm } from 'react-hook-form';
import api from '../lib/api';
import { Item } from '@prisma/client';

type ItemFormProps = {
  item: Item | null;
  onClose: () => void;
  onSuccess: (item: Item) => void;
};

export default function ItemForm({ item, onClose, onSuccess }: ItemFormProps) {
  const { register, handleSubmit, reset } = useForm<Item>({
    defaultValues: item || { itemNumber: '', name: '' },
  });

  const onSubmit = async (data: Item) => {
    try {
      let response;
      if (item) {
        response = await api.put(`/items/${item.id}`, data); // Edit
      } else {
        response = await api.post('/items', data); // Add
      }
      onSuccess(response.data);
      reset(); // Reset form
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4">{item ? 'Edit Item' : 'Add Item'}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-2">Item Number</label>
            <input
              type="text"
              {...register('itemNumber', { required: true })}
              className="border px-3 py-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Item Name</label>
            <input
              type="text"
              {...register('name', { required: true })}
              className="border px-3 py-2 w-full rounded"
            />
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {item ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
