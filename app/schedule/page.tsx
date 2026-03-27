import type { Metadata } from 'next';
import Link from 'next/link';
import { getReservationsByDate } from '@/lib/reservations';
import StatusBadge from '@/components/StatusBadge';
import type { ReservationStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'スケジュール | 予約管理システム',
};

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatFullDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  const w = ['日','月','火','水','木','金','土'][d.getDay()];
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日（${w}）`;
}

function toMinutes(time: string) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: rawDate } = await searchParams;
  const today = new Date().toISOString().slice(0, 10);
  const date  = rawDate ?? today;

  const reservations = await getReservationsByDate(date);
  const prevDate = addDays(date, -1);
  const nextDate = addDays(date, +1);

  const active     = reservations.filter(r => r.status !== 'canceled');
  const unnotified = reservations.filter(r => !r.confirmation_sent && r.status === 'pending');

  // 予約時間から動的に時間範囲を計算（±1時間のパディング）
  const SLOT_H = 96;
  const { HOURS, START_MIN } = (() => {
    if (reservations.length === 0) {
      return { HOURS: [9, 10, 11, 12, 13, 14, 15, 16, 17], START_MIN: 9 * 60 };
    }
    const allMin = reservations.map(r => toMinutes(r.reservation_time));
    const startH = Math.max(7, Math.floor(Math.min(...allMin) / 60) - 1);
    const endH   = Math.min(22, Math.ceil(Math.max(...allMin) / 60) + 1);
    return {
      HOURS:     Array.from({ length: endH - startH + 1 }, (_, i) => startH + i),
      START_MIN: startH * 60,
    };
  })();

  return (
    <div className="px-4 md:px-10 py-6 md:py-8 max-w-4xl">

      {/* ヘッダー */}
      <div className="mb-6 md:mb-8">
        <p className="text-[11px] font-bold text-[#00288e] uppercase tracking-widest mb-1">Daily Schedule</p>
        <h1 className="text-xl md:text-2xl font-black text-[#1a3844]">日別スケジュール</h1>
      </div>

      {/* 日付ナビゲーション */}
      <div className="flex items-center justify-between bg-white rounded-xl px-4 md:px-6 py-3 md:py-4 shadow-sm mb-6">
        <Link
          href={`/schedule?date=${prevDate}`}
          className="flex items-center gap-1 text-sm text-[#444653] hover:text-[#00288e] transition-colors font-medium"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_left</span>
          前日
        </Link>
        <div className="text-center">
          <p className="text-sm md:text-base font-black text-[#191c1d]">{formatFullDate(date)}</p>
          {date === today && (
            <span className="text-[11px] font-bold text-[#00288e]">本日</span>
          )}
          {date !== today && (
            <Link href="/schedule" className="text-[11px] text-[#757684] hover:text-[#00288e] underline underline-offset-2">
              今日に戻る
            </Link>
          )}
        </div>
        <Link
          href={`/schedule?date=${nextDate}`}
          className="flex items-center gap-1 text-sm text-[#444653] hover:text-[#00288e] transition-colors font-medium"
        >
          翌日
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
        </Link>
      </div>

      {/* サマリー */}
      <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
        {[
          { label: '予約件数', value: reservations.length, color: '#191c1d' },
          { label: '対応予定', value: active.length,       color: '#00288e' },
          { label: '未通知',   value: unnotified.length,   color: unnotified.length > 0 ? '#ba1a1a' : '#191c1d' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-xl px-3 md:px-5 py-3 md:py-4 shadow-sm text-center">
            <p className="text-[9px] md:text-[10px] font-bold text-[#757684] uppercase tracking-wide mb-1">{label}</p>
            <p className="text-2xl md:text-3xl font-black" style={{ color }}>
              {value}<span className="text-xs font-bold text-[#757684] ml-0.5 md:ml-1">件</span>
            </p>
          </div>
        ))}
      </div>

      {/* タイムライン */}
      {reservations.length === 0 ? (
        <div className="bg-white rounded-xl px-6 py-14 text-center text-sm text-[#757684] shadow-sm">
          この日の予約はありません
        </div>
      ) : (
        <>
          {/* デスクトップ: タイムライン */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-[72px_1fr]">
              {/* 時間軸 */}
              <div className="bg-[#f3f4f5]/50 border-r border-[#f3f4f5] pt-3">
                {HOURS.map(h => (
                  <div
                    key={h}
                    className="flex items-start justify-end pr-3 text-[10px] font-black text-[#757684]/70"
                    style={{ height: `${SLOT_H}px` }}
                  >
                    {String(h).padStart(2,'0')}:00
                  </div>
                ))}
              </div>

              {/* 予約カード エリア */}
              <div className="relative" style={{ height: `${SLOT_H * HOURS.length}px` }}>
                {HOURS.map(h => (
                  <div
                    key={h}
                    className="absolute left-0 right-0 border-t border-[#f3f4f5]"
                    style={{ top: `${(h - HOURS[0]) * SLOT_H + 3}px` }}
                  />
                ))}

                {reservations.map(r => {
                  const topPx = ((toMinutes(r.reservation_time) - START_MIN) / 60) * SLOT_H + 3;
                  const isCanceled = r.status === 'canceled';
                  const needsAttention = !r.confirmation_sent && r.status === 'pending';

                  return (
                    <Link
                      key={r.id}
                      href={`/reservations/${r.id}`}
                      className={`absolute left-3 right-3 group transition-shadow hover:shadow-md rounded-lg overflow-hidden ${isCanceled ? 'opacity-40' : ''}`}
                      style={{ top: `${topPx}px`, minHeight: '52px' }}
                    >
                      <div
                        className="h-full px-4 py-2.5 flex items-start justify-between bg-white ring-1 ring-[#c4c5d5]/20 rounded-lg"
                        style={{
                          borderLeft: `4px solid ${
                            isCanceled             ? '#c4c5d5' :
                            needsAttention         ? '#ba1a1a' :
                            r.status === 'completed' ? '#006e1c' :
                            r.status === 'confirmed' ? '#00288e' :
                                                   '#1a3844'
                          }`,
                        }}
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="shrink-0">
                            <p
                              className="text-[11px] font-black"
                              style={{
                                color: isCanceled ? '#c4c5d5' :
                                       r.status === 'confirmed' ? '#00288e' :
                                       r.status === 'completed' ? '#006e1c' : '#1a3844',
                              }}
                            >
                              {r.reservation_time}
                            </p>
                            <div className="mt-1">
                              <StatusBadge status={r.status as ReservationStatus} />
                            </div>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[#191c1d] truncate">
                              {r.customer_name} <span className="font-normal text-xs text-[#444653]">様</span>
                            </p>
                            <p className="text-xs text-[#444653] truncate mt-0.5">{r.service_name}</p>
                            {needsAttention && (
                              <p className="text-[10px] text-[#ba1a1a] font-bold mt-1 flex items-center gap-1">
                                <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>warning</span>
                                確認通知未送信
                              </p>
                            )}
                            {r.note && (
                              <p className="text-[10px] text-[#757684] mt-0.5 truncate">備考: {r.note}</p>
                            )}
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-[#c4c5d5] group-hover:text-[#00288e] transition-colors shrink-0 ml-2" style={{ fontSize: '18px' }}>
                          chevron_right
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* モバイル: カードリスト */}
          <div className="md:hidden space-y-3">
            {reservations.map(r => {
              const isCanceled = r.status === 'canceled';
              const needsAttention = !r.confirmation_sent && r.status === 'pending';
              return (
                <Link
                  key={r.id}
                  href={`/reservations/${r.id}`}
                  className={`flex items-start gap-3 bg-white rounded-xl px-4 py-4 shadow-sm ${isCanceled ? 'opacity-40' : ''}`}
                  style={{
                    borderLeft: `4px solid ${
                      isCanceled             ? '#c4c5d5' :
                      needsAttention         ? '#ba1a1a' :
                      r.status === 'completed' ? '#006e1c' :
                      r.status === 'confirmed' ? '#00288e' :
                                             '#1a3844'
                    }`,
                  }}
                >
                  <div className="shrink-0 w-14 text-center">
                    <p className="text-base font-black text-[#191c1d]">{r.reservation_time}</p>
                    <div className="mt-1.5">
                      <StatusBadge status={r.status as ReservationStatus} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[#191c1d] truncate">
                      {r.customer_name} <span className="font-normal text-xs text-[#444653]">様</span>
                    </p>
                    <p className="text-xs text-[#444653] mt-0.5 truncate">{r.service_name}</p>
                    {needsAttention && (
                      <p className="text-[10px] text-[#ba1a1a] font-bold mt-1 flex items-center gap-1">
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>warning</span>
                        確認通知未送信
                      </p>
                    )}
                  </div>
                  <span className="material-symbols-outlined text-[#c4c5d5] shrink-0" style={{ fontSize: '18px' }}>chevron_right</span>
                </Link>
              );
            })}
          </div>
        </>
      )}

      {/* フッターリンク */}
      <div className="mt-6 text-center">
        <Link href="/reservations" className="text-sm text-[#757684] hover:text-[#00288e] transition-colors">
          ← 予約一覧に戻る
        </Link>
      </div>
    </div>
  );
}
