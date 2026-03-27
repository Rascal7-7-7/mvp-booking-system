import { STATUS_LABEL, STATUS_COLOR, type ReservationStatus } from '@/lib/types';

export default function StatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLOR[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
