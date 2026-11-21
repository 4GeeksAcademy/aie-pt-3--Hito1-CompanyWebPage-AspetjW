/**
 * Página principal del Talent Pipeline Tracker
 * Ruta: /
 */

import { Suspense } from 'react';
import { CandidatesList } from '@/components/candidates/CandidatesList';
import { LoadingSkeleton } from '@/components/common/UIElements';

export const metadata = {
  title: 'Talent Pipeline Tracker',
  description: 'Gestión de candidaturas para el equipo de People & Talent',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">
            Talent Pipeline Tracker
          </h1>
          <p className="text-gray-600 mt-2">
            Gestión de candidaturas para el equipo de People & Talent
          </p>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <CandidatesList />
        </Suspense>
      </div>
    </main>
  );
}
