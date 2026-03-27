import Link from 'next/link';
import { getReservationsByDate } from '@/lib/reservations';
import StatusBadge from '@/components/StatusBadge';
import type { ReservationStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

function formatFullDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）`;
}

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: rawDate } = await searchParams;
  const today = new Date().toISOString().slice(0, 10);
  const date = rawDate ?? today;

  const reservations = await getReservationsByDate(date);
  const prevDate = addDays(date, -1);
  const nextDate = addDays(date, +1);

  const active = reservations.filter(r => r.status !== 'canceled');

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">

      {/* ヘッダー */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">日別スケジュール</h1>
        <p className="text-sm text-gray-500 mt-0.5">指定日の予約を時間順に確認します</p>
      </div>

      {/* 日付ナビゲーション */}
      <div className="flex items-center justify-between mb-6 bg-white rounded-xl border border-gray-200 px-5 py-3 shadow-sm">
        <Link
          href={`/schedule?date=${prevDate}`}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          ← 前日
        </Link>
        <div className="text-center">
          <p className="text-base font-bold text-gray-900">{formatFullDate(date)}</p>
          {date === today && (
            <span className="text-xs text-blue-600 font-medium">本日</span>
          )}
        </div>
        <Link
          href={`/schedule?date=${nextDate}`}
          className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          翌日 →
        </Link>
      </div>

      {/* 今日に戻るボタン */}
      {date !== today && (
        <div className="mb-4 text-center">
          <Link
            href="/schedule"
            className="text-xs text-blue-600 hover:text-blue-800 underline underline-offset-2"
          >
            今日に戻る
          </Link>
        </div>
      )}

      {/* サマリー */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 text-center">
          <p className="text-xs text-gray-500">予約件数</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{reservations.length}<span className="text-sm font-normal text-gray-400 ml-1">件</span></p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 px-4 py-3 text-center">
          <p className="text-xs text-gray-500">対応予定</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{active.length}<span className="text-sm font-normal text-gray-400 ml-1">件</span></p>
        </div>
      </div>

      {/* タイムライン */}
      {reservations.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-6 py-14 text-center text-sm text-gray-400">
          この日の予約はありません
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map((r) => (
            <Link
              key={r.id}
              href={`/reservations/${r.id}`}
              className={`flex items-start gap-4 bg-white rounded-xl border px-5 py-4 shadow-sm hover:shadow-md transition-shadow ${
                r.status === 'canceled'
                  ? 'border-gray-100 opacity-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {/* 時間 */}
              <div className="w-14 shrink-0 text-center">
                <p className="text-lg font-bold text-gray-900">{r.reservation_time}</p>
              </div>

              {/* 縦線 */}
              <div className="w-px bg-gray-200 self-stretch mt-1 shrink-0" />

              {/* 内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold text-gray-900">{r.customer_name}</p>
                  <StatusBadge status={r.status as ReservationStatus} />
                </div>
                <p className="text-sm text-gray-600">{r.service_name}</p>
                {r.note && (
                  <p className="text-xs text-gray-400 mt-1 truncate">備考：{r.note}</p>
                )}
                {!r.confirmation_sent && r.status !== 'canceled' && (
                  <p className="text-xs text-red-500 mt-1">⚠ 確認通知未送信</p>
                )}
              </div>

              <span className="text-xs text-gray-400 shrink-0 self-center">→</span>
            </Link>
          ))}
        </div>
      )}

      {/* フッターリンク */}
      <div className="mt-8 text-center">
        <Link href="/reservations" className="text-sm text-gray-500 hover:text-gray-700">
          予約一覧に戻る
        </Link>
      </div>
    </div>
  );
}
