"use client";
import React, { useEffect, useState } from 'react';
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
  steps: string[];
  calories?: number;
}

export default function ViewDishDetail({ id }: { id: string }) {
  const [dish, setDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/dishes/${id}`)
      .then(res => res.json())
      .then(data => {
        setDish(data.dish);
        setLoading(false);
      });
  }, [id]);

  if (loading || !dish) return <div className="p-8">Cargando...</div>;

  return (
    <div data-testid="dish-detail-page" className="py-10 px-2 max-w-3xl mx-auto">
      <Link 
        data-testid="dish-back-button"
        href="/dishes" 
        className="inline-block mb-4 text-blue-600 hover:text-blue-800 font-semibold"
      >
        ← Volver a la lista
      </Link>
      <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
        <div className="w-full md:w-1/2 flex flex-col items-center">
          {dish.imageUrl ? (
            <Image data-testid="dish-detail-image" src={dish.imageUrl} alt={dish.name} width={600} height={320} className="rounded-xl w-full h-64 object-cover mb-4 shadow" />
          ) : (
            <div className="bg-gray-200 rounded-xl w-full h-64 flex items-center justify-center text-gray-400 mb-4">Sin imagen</div>
          )}
          <span data-testid="dish-detail-quick-prep" className="bg-green-400 text-white text-xs font-bold px-4 py-2 rounded-full shadow mb-4 tracking-wide uppercase">{dish.quickPrep ? 'Rápido' : `${dish.prepTime + dish.cookTime} min`}</span>
          {dish.calories !== undefined && dish.calories !== null && (
            <div className="mb-4 text-xl font-bold text-pink-600 bg-pink-100 px-4 py-2 rounded-full shadow inline-block">{dish.calories} kcal</div>
          )}
        </div>
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <h2 data-testid="dish-detail-heading" className="font-extrabold text-3xl mb-2 text-gray-800 text-center md:text-left">
            <span data-testid="dish-detail-name">{dish.name}</span>
          </h2>
          <p data-testid="dish-detail-description" className="text-gray-600 mb-4 text-lg text-center md:text-left">{dish.description}</p>
          {dish.steps && dish.steps.length > 0 && (
            <div className="w-full mt-2">
              <h3 className="font-bold text-xl mb-3 text-gray-800 flex items-center gap-2">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                Pasos de preparación
              </h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 pl-2">
                {dish.steps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="inline-block mt-1 w-2 h-2 bg-green-400 rounded-full"></span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
