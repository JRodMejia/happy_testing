"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Dish {
  id: number;
  name: string;
  description: string;
  quickPrep: boolean;
  prepTime: number;
  cookTime: number;
  imageUrl?: string;
}

export default function DishesClientList({ dishes }: { dishes: Dish[] }) {
  const [dishList, setDishList] = useState<Dish[]>(dishes);

  const handleDelete = async (id: number) => {
    await fetch(`/api/dishes/${id}`, { method: 'DELETE' });
    setDishList(dishList.filter(d => d.id !== id));
  };

  return (
    <div data-testid="dishes-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {dishList.map((dish, index) => (
        <div key={dish.id} data-testid={`dish-card-${index}`} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col hover:shadow-xl transition group border border-gray-100">
          <div className="relative mb-4">
            {dish.imageUrl ? (
              <Image src={dish.imageUrl} alt={dish.name} width={400} height={180} className="rounded-xl w-full h-44 object-cover group-hover:scale-105 transition" />
            ) : (
              <div className="bg-gray-200 rounded-xl w-full h-44 flex items-center justify-center text-gray-400">Sin imagen</div>
            )}
            <span className="absolute top-2 right-2 bg-green-400 text-white text-xs font-bold px-4 py-1 rounded-full shadow tracking-wide uppercase">{dish.quickPrep ? 'Rápido' : `${dish.prepTime + dish.cookTime} min`}</span>
          </div>
          <h2 data-testid={`dish-name-${index}`} className="font-extrabold text-xl mb-1 text-gray-800 truncate" title={dish.name}>{dish.name}</h2>
          <p data-testid={`dish-description-${index}`} className="text-gray-600 mb-2 text-sm line-clamp-2" title={dish.description}>{dish.description}</p>
          <div className="flex-1" />
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex gap-2">
              <Link data-testid={`dish-view-button-${index}`} href={`/dishes/${dish.id}/view`} className="flex-1 bg-blue-100 text-blue-700 px-3 py-2 rounded-lg font-semibold text-center hover:bg-blue-200 transition focus:outline-none focus:ring-2 focus:ring-blue-300" title="Ver detalles">Ver</Link>
              <Link data-testid={`dish-edit-button-${index}`} href={`/dishes/${dish.id}`} className="flex-1 bg-yellow-100 text-yellow-700 px-3 py-2 rounded-lg font-semibold text-center hover:bg-yellow-200 transition focus:outline-none focus:ring-2 focus:ring-yellow-300" title="Editar platillo">Editar</Link>
            </div>
            <button data-testid={`dish-delete-button-${index}`} className="w-full bg-red-100 text-red-600 px-3 py-2 rounded-lg font-semibold hover:bg-red-200 transition focus:outline-none focus:ring-2 focus:ring-red-300" title="Eliminar platillo" onClick={() => handleDelete(dish.id)}>
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
