export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'canceled';

export const STATUS_LABEL: Record<ReservationStatus, string> = {
  pending:   '受付',
  confirmed: '確定',
  completed: '完了',
  canceled:  'キャンセル',
};

// 受付=グレー / 確定=青 / 完了=緑 / キャンセル=赤
export const STATUS_COLOR: Record<ReservationStatus, string> = {
  pending:   'bg-[#e7e8e9] text-[#444653]',
  confirmed: 'bg-[#dde1ff] text-[#173bab]',
  completed: 'bg-[#98f994] text-[#005313]',
  canceled:  'bg-[#ffdad6] text-[#93000a]',
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
