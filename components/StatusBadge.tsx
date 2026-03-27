import { STATUS_LABEL, STATUS_COLOR, type ReservationStatus } from '@/lib/types';

export default function StatusBadge({ status }: { status: ReservationStatus }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${STATUS_COLOR[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
