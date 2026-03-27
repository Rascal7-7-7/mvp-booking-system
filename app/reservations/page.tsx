import Link from 'next/link';
import { getReservations, getSummary } from '@/lib/reservations';
import StatusBadge from '@/components/StatusBadge';
import NotificationBadge from '@/components/NotificationBadge';
import type { ReservationStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getMonth() + 1}/${d.getDate()}(${['日','月','火','水','木','金','土'][d.getDay()]})`;
}

export default async function ReservationsPage() {
  const [reservations, summary] = await Promise.all([getReservations(), getSummary()]);

  const today = new Date().toISOString().slice(0, 10);
  const todayReservations = reservations.filter(r => r.reservation_date === today);
  const otherReservations = reservations.filter(r => r.reservation_date !== today);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* ページタイトル */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">予約一覧</h1>
          <p className="text-sm text-gray-500 mt-0.5">店舗の予約状況を管理します</p>
        </div>
        <Link
          href="/reservations/new"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          ＋ 新規予約
        </Link>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">本日の予約</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">{summary.total_today}<span className="text-base font-normal text-gray-500 ml-1">件</span></p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">受付中</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{summary.pending_count}<span className="text-base font-normal text-gray-500 ml-1">件</span></p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">未通知（本日）</p>
          <p className="mt-2 text-3xl font-bold text-red-500">{summary.unnotified}<span className="text-base font-normal text-gray-500 ml-1">件</span></p>
          {summary.unnotified > 0 && (
            <p className="text-xs text-red-500 mt-1">確認通知が未送信の予約があります</p>
          )}
        </div>
      </div>

      {/* 本日の予約 */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
          本日の予約
          <span className="text-gray-400 font-normal">({todayReservations.length}件)</span>
        </h2>
        <ReservationTable reservations={todayReservations} highlight />
      </section>

      {/* 今後・過去の予約 */}
      <section>
        <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
          その他の予約
          <span className="text-gray-400 font-normal">({otherReservations.length}件)</span>
        </h2>
        <ReservationTable reservations={otherReservations} />
      </section>

    </div>
  );
}

function ReservationTable({
  reservations,
  highlight = false,
}: {
  reservations: Awaited<ReturnType<typeof getReservations>>;
  highlight?: boolean;
}) {
  if (reservations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 px-6 py-10 text-center text-sm text-gray-400">
        該当する予約はありません
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border shadow-sm overflow-hidden ${highlight ? 'border-blue-200' : 'border-gray-200'}`}>
      <table className="min-w-full divide-y divide-gray-100">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">日時</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">顧客名</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">サービス</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">状態</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">確認通知</th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">リマインド</th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {reservations.map((r) => (
            <tr
              key={r.id}
              className={`hover:bg-gray-50 transition-colors ${
                r.status === 'canceled' ? 'opacity-50' : ''
              } ${
                !r.confirmation_sent && r.status === 'pending' ? 'bg-red-50 hover:bg-red-50' : ''
              }`}
            >
              <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                {formatDate(r.reservation_date)} {r.reservation_time}
              </td>
              <td className="px-4 py-3 text-sm text-gray-800">{r.customer_name}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{r.service_name}</td>
              <td className="px-4 py-3">
                <StatusBadge status={r.status as ReservationStatus} />
              </td>
              <td className="px-4 py-3">
                <NotificationBadge sent={r.confirmation_sent} />
              </td>
              <td className="px-4 py-3">
                <NotificationBadge sent={r.reminder_sent} />
              </td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/reservations/${r.id}`}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  詳細 →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
