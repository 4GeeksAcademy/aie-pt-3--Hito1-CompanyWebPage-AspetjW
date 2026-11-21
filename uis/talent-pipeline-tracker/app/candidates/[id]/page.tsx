/**
 * Página de detalle de un candidato específico
 * Ruta: /candidates/[id]
 */

import { CandidateDetail } from '../components/CandidateDetail';

export const metadata = {
  title: 'Detalle del Candidato | Talent Pipeline Tracker',
  description: 'Vista detallada de la información del candidato',
};

export default function CandidateDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <CandidateDetail id={params.id} />
      </div>
    </main>
  );
}
