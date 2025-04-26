"use client"

import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const res = await axios.post('http://localhost:3001/auth/login', data);
      localStorage.setItem('token', res.data.access_token);
      router.push('/items');
    } catch (err) {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-6 rounded shadow-md w-80 space-y-4"
      >
        <h2 className="text-xl font-bold">Login</h2>
        <input
          {...register('email')}
          placeholder="Email"
          className="border px-3 py-2 w-full rounded"
        />
        <input
          {...register('password')}
          type="password"
          placeholder="Password"
          className="border px-3 py-2 w-full rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
}
