'use server';

import { redirect } from 'next/navigation';
import { createReservation, updateReservation } from '@/lib/reservations';

export async function createReservationAction(formData: FormData) {
  const id = await createReservation({
    customer_name:    String(formData.get('customer_name')    ?? ''),
    customer_email:   String(formData.get('customer_email')   ?? ''),
    customer_phone:   String(formData.get('customer_phone')   ?? ''),
    reservation_date: String(formData.get('reservation_date') ?? ''),
    reservation_time: String(formData.get('reservation_time') ?? ''),
    service_name:     String(formData.get('service_name')     ?? ''),
    note:             String(formData.get('note')             ?? ''),
  });
  redirect(`/reservations/${id}?saved=1`);
}

export async function updateReservationAction(id: number, formData: FormData) {
  await updateReservation(id, {
    customer_name:     String(formData.get('customer_name')     ?? ''),
    customer_email:    String(formData.get('customer_email')    ?? ''),
    customer_phone:    String(formData.get('customer_phone')    ?? ''),
    reservation_date:  String(formData.get('reservation_date')  ?? ''),
    reservation_time:  String(formData.get('reservation_time')  ?? ''),
    service_name:      String(formData.get('service_name')      ?? ''),
    note:              String(formData.get('note')              ?? ''),
    status:            String(formData.get('status')            ?? 'pending'),
    confirmation_sent: formData.get('confirmation_sent') === 'true',
    reminder_sent:     formData.get('reminder_sent')     === 'true',
  });
  redirect(`/reservations/${id}?saved=1`);
}
