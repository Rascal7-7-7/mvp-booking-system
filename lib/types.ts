export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'canceled';

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending:   '受付',
  confirmed: '確定',
  completed: '完了',
  canceled:  'キャンセル',
};

export const STATUS_COLOR: Record<ReservationStatus, string> = {
  pending:   'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  canceled:  'bg-gray-100 text-gray-500',
};

export interface Reservation {
  id:                number;
  customer_name:     string;
  customer_email:    string | null;
  customer_phone:    string | null;
  reservation_date:  string; // YYYY-MM-DD
  reservation_time:  string; // HH:MM
  service_name:      string;
  note:              string | null;
  status:            ReservationStatus;
  confirmation_sent: boolean;
  reminder_sent:     boolean;
  created_at:        string;
  updated_at:        string;
}

export interface ReservationSummary {
  total_today:    number;
  pending_count:  number;
  unnotified:     number;
}
