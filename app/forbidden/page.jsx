import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-6xl font-bold text-red-600">403</h1>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Accès Refusé
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Vous n'avez pas les permissions nécessaires pour accéder à cette
            page.
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <p className="text-sm text-gray-500">
            Cette page est réservée aux administrateurs.
          </p>
          <Link
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
