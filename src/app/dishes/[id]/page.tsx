import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EditDishForm from './EditDishForm';

export default async function EditDishPage({ params }: { params: { id: string } }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('session');
  if (!session || !session.value) {
    redirect('/login');
  }
  return (
    <div data-testid="edit-dish-page" className="max-w-7xl mx-auto p-8">
      <h1 data-testid="edit-dish-heading" className="text-4xl font-extrabold mb-8 text-center text-gray-800 tracking-tight">
        Editar Platillo
      </h1>
      <EditDishForm id={params.id} />
    </div>
  );
}
