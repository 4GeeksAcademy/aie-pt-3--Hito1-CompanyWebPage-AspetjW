/**
 * Opciones para selectores de estado y etapa
 */

import { CandidateStatus, CandidateStage, STATUS_LABELS, STAGE_LABELS } from '@/types/candidate';

export const STATUS_OPTIONS: Array<{
  value: CandidateStatus;
  label: string;
}> = [
  { value: 'applied', label: STATUS_LABELS.applied },
  { value: 'screening', label: STATUS_LABELS.screening },
  { value: 'interviewed', label: STATUS_LABELS.interviewed },
  { value: 'offered', label: STATUS_LABELS.offered },
  { value: 'hired', label: STATUS_LABELS.hired },
  { value: 'rejected', label: STATUS_LABELS.rejected },
];

export const STAGE_OPTIONS: Array<{
  value: CandidateStage;
  label: string;
}> = [
  { value: 'initial_review', label: STAGE_LABELS.initial_review },
  { value: 'phone_screening', label: STAGE_LABELS.phone_screening },
  { value: 'technical_assessment', label: STAGE_LABELS.technical_assessment },
  { value: 'interview', label: STAGE_LABELS.interview },
  { value: 'final_round', label: STAGE_LABELS.final_round },
  { value: 'offer_pending', label: STAGE_LABELS.offer_pending },
  { value: 'completed', label: STAGE_LABELS.completed },
];
