import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-6 text-[#048B9A]">Bienvenue sur le tableau de bord</h1>
        <p className="mb-8 text-gray-700">Veuillez vous connecter pour accéder à l'administration.</p>
        <Link href="/login">
          <button className="px-6 py-3 bg-[#048B9A] text-white font-semibold rounded-lg hover:bg-[#037483] transition duration-300">
            Se connecter
          </button>
        </Link>
      </div>
    </div>
  );
}
