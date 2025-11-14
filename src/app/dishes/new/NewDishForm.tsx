"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewDishForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    description: '',
    quickPrep: false,
    prepTime: 0,
    cookTime: 0,
    imageUrl: '',
    calories: '',
    steps: [''],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handles input changes and ensures numeric fields are parsed as numbers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : (name === 'prepTime' || name === 'cookTime' || name === 'calories')
          ? value === '' ? '' : Number(value)
          : value,
    }));
  };

  const handleStepChange = (idx: number, value: string) => {
    setForm(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => (i === idx ? value : step)),
    }));
  };

  const addStep = () => setForm(prev => ({ ...prev, steps: [...prev.steps, ''] }));
  const removeStep = (idx: number) => setForm(prev => ({ ...prev, steps: prev.steps.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/dishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        calories: form.calories ? Number(form.calories) : null,
        steps: form.steps.filter(s => s.trim() !== ''),
      }),
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      router.push('/dishes');
    } else {
      setError(data.error || 'Error al crear el platillo');
    }
  };

  return (
    <form data-testid="new-dish-form-container" className="bg-white rounded-2xl shadow-2xl p-10 grid grid-cols-1 md:grid-cols-2 gap-10 border border-gray-100" onSubmit={handleSubmit} autoComplete="on">
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-green-600 mb-2">Información básica</h2>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Nombre</label>
          <input data-testid="dish-name-input" name="name" value={form.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-green-200 focus:outline-none" required autoFocus placeholder="Ej: Ensalada de quinoa" />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Descripción</label>
          <textarea data-testid="dish-description-input" name="description" value={form.description} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-green-200 focus:outline-none" required placeholder="Describe el platillo, ingredientes principales, etc." />
        </div>
        <div className="flex items-center gap-2">
          <input data-testid="dish-quick-prep-checkbox" type="checkbox" name="quickPrep" checked={form.quickPrep} onChange={handleChange} id="quickPrep" className="accent-green-500 w-5 h-5" />
          <label htmlFor="quickPrep" className="font-semibold text-gray-700">Preparación rápida</label>
          <span className="text-xs text-gray-400 ml-2">Menos de 20 min</span>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold text-green-600 mb-2">Detalles</h2>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-semibold text-gray-700">Min. preparación</label>
            <input data-testid="dish-prep-time-input" type="number" name="prepTime" value={form.prepTime} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-green-200 focus:outline-none" required min="0" placeholder="Ej: 10" />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-semibold text-gray-700">Min. cocción</label>
            <input data-testid="dish-cook-time-input" type="number" name="cookTime" value={form.cookTime} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-green-200 focus:outline-none" required min="0" placeholder="Ej: 15" />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">Calorías totales</label>
          <input type="number" name="calories" value={form.calories} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-green-200 focus:outline-none" min="0" placeholder="Ej: 350" />
        </div>
        <div>
          <label className="block mb-1 font-semibold text-gray-700">URL de imagen</label>
          <input data-testid="dish-image-url-input" name="imageUrl" value={form.imageUrl} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-lg focus:ring-2 focus:ring-green-200 focus:outline-none" placeholder="https://..." />
        </div>
      </div>
      <div className="md:col-span-2 mt-4">
        <h2 className="text-xl font-bold text-green-600 mb-2">Pasos de preparación</h2>
        <p className="text-gray-500 mb-2 text-sm">Agrega los pasos uno a uno para guiar la preparación del platillo.</p>
        {form.steps.map((step, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text"
              value={step}
              onChange={e => handleStepChange(idx, e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-base focus:ring-2 focus:ring-green-200 focus:outline-none"
              placeholder={`Paso ${idx + 1}`}
              required={idx === 0}
            />
            {form.steps.length > 1 && (
              <button type="button" onClick={() => removeStep(idx)} className="text-red-500 font-bold text-xl px-2">×</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addStep} className="text-blue-500 font-semibold mt-2">+ Agregar paso</button>
      </div>
      <div className="md:col-span-2 mt-4">
        {error && <p data-testid="dish-error-message" className="text-red-500 mb-2">{error}</p>}
        <div className="flex gap-4">
          <button data-testid="dish-submit-button" type="submit" className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold text-lg hover:bg-green-600 transition shadow focus:outline-none focus:ring-2 focus:ring-green-300" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button data-testid="dish-cancel-button" type="button" onClick={() => router.push('/dishes')} className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-bold text-lg hover:bg-gray-400 transition shadow focus:outline-none focus:ring-2 focus:ring-gray-400">
            Cancelar
          </button>
        </div>
      </div>
    </form>
  );
}
