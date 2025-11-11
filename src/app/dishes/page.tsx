import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DishesClientList from './DishesClientList';

interface Dish {
  id: number;
  name: string;
  description: string;
  quickPrep: boolean;
  prepTime: number;
  cookTime: number;
  imageUrl?: string;
}

export default async function DishesPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session || !session.value) {
    redirect('/login');
  }

  // SSR fetch directo a la API local
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/dishes`, {
    headers: { Cookie: `session=${session.value}` },
    cache: 'no-store',
  });
  const data = await res.json();
  const dishes: Dish[] = data.dishes || [];

  return (
    <div className="py-10 px-2 max-w-7xl mx-auto" data-testid="dishes-page">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight" data-testid="dishes-heading">Sugerencias de Platillos</h1>
        <Link href="/dishes/new" className="bg-green-500 text-white px-8 py-3 rounded-xl font-bold text-lg shadow hover:bg-green-600 transition focus:outline-none focus:ring-2 focus:ring-green-300" title="Agregar un nuevo platillo" data-testid="add-dish-button">+ Agregar Platillo</Link>
      </div>
      {dishes.length === 0 ? (
        <div className="flex justify-center items-center h-40" data-testid="dishes-empty-state">
          <span className="text-lg text-gray-500" data-testid="dishes-empty-text">No hay platillos registrados.</span>
        </div>
      ) : (
        <div data-testid="dishes-list">
          <DishesClientList dishes={dishes} />
        </div>
      )}
    </div>
  );
}
