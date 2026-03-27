import pool from './db';
import type { Reservation, ReservationSummary } from './types';

export async function getReservations(): Promise<Reservation[]> {
  const { rows } = await pool.query<Reservation>(`
    SELECT
      id, customer_name, customer_email, customer_phone,
      TO_CHAR(reservation_date, 'YYYY-MM-DD') AS reservation_date,
      TO_CHAR(reservation_time, 'HH24:MI')    AS reservation_time,
      service_name, note, status,
      confirmation_sent, reminder_sent,
      created_at, updated_at
    FROM reservations
    ORDER BY reservation_date ASC, reservation_time ASC
  `);
  return rows;
}

export async function getReservationById(id: number): Promise<Reservation | null> {
  const { rows } = await pool.query<Reservation>(`
    SELECT
      id, customer_name, customer_email, customer_phone,
      TO_CHAR(reservation_date, 'YYYY-MM-DD') AS reservation_date,
      TO_CHAR(reservation_time, 'HH24:MI')    AS reservation_time,
      service_name, note, status,
      confirmation_sent, reminder_sent,
      created_at, updated_at
    FROM reservations
    WHERE id = $1
  `, [id]);
  return rows[0] ?? null;
}

export async function getReservationsByDate(date: string): Promise<Reservation[]> {
  const { rows } = await pool.query<Reservation>(`
    SELECT
      id, customer_name, customer_email, customer_phone,
      TO_CHAR(reservation_date, 'YYYY-MM-DD') AS reservation_date,
      TO_CHAR(reservation_time, 'HH24:MI')    AS reservation_time,
      service_name, note, status,
      confirmation_sent, reminder_sent,
      created_at, updated_at
    FROM reservations
    WHERE reservation_date = $1
    ORDER BY reservation_time ASC
  `, [date]);
  return rows;
}

export async function getSummary(): Promise<ReservationSummary> {
  const { rows } = await pool.query<ReservationSummary>(`
    SELECT
      COUNT(*) FILTER (WHERE reservation_date = CURRENT_DATE)                                        AS total_today,
      COUNT(*) FILTER (WHERE reservation_date = CURRENT_DATE AND status = 'pending')                 AS pending_count,
      COUNT(*) FILTER (WHERE reservation_date = CURRENT_DATE AND confirmation_sent = false AND status NOT IN ('canceled','completed')) AS unnotified
    FROM reservations
  `);
  const row = rows[0];
  return {
    total_today:   Number(row.total_today),
    pending_count: Number(row.pending_count),
    unnotified:    Number(row.unnotified),
  };
}

export async function createReservation(data: {
  customer_name:    string;
  customer_email:   string;
  customer_phone:   string;
  reservation_date: string;
  reservation_time: string;
  service_name:     string;
  note:             string;
}): Promise<number> {
  const { rows } = await pool.query<{ id: number }>(`
    INSERT INTO reservations
      (customer_name, customer_email, customer_phone, reservation_date, reservation_time, service_name, note)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
  `, [
    data.customer_name,
    data.customer_email  || null,
    data.customer_phone  || null,
    data.reservation_date,
    data.reservation_time,
    data.service_name,
    data.note            || null,
  ]);
  return rows[0].id;
}

export async function updateReservation(id: number, data: {
  customer_name:     string;
  customer_email:    string;
  customer_phone:    string;
  reservation_date:  string;
  reservation_time:  string;
  service_name:      string;
  note:              string;
  status:            string;
  confirmation_sent: boolean;
  reminder_sent:     boolean;
}): Promise<void> {
  await pool.query(`
    UPDATE reservations SET
      customer_name     = $1,
      customer_email    = $2,
      customer_phone    = $3,
      reservation_date  = $4,
      reservation_time  = $5,
      service_name      = $6,
      note              = $7,
      status            = $8,
      confirmation_sent = $9,
      reminder_sent     = $10,
      updated_at        = NOW()
    WHERE id = $11
  `, [
    data.customer_name,
    data.customer_email   || null,
    data.customer_phone   || null,
    data.reservation_date,
    data.reservation_time,
    data.service_name,
    data.note             || null,
    data.status,
    data.confirmation_sent,
    data.reminder_sent,
    id,
  ]);
}
