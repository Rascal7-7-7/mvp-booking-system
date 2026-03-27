import type { Metadata } from 'next';
import Link from 'next/link';
import { getReservations, getSummary } from '@/lib/reservations';

export const metadata: Metadata = {
  title: '予約一覧 | 予約管理システム',
};
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

  const todayList    = reservations.filter(r => r.reservation_date === today);
  const upcomingList = reservations.filter(r => r.reservation_date > today);
  const pastList     = reservations.filter(r => r.reservation_date < today);

  return (
    <div className="px-4 md:px-10 py-6 md:py-8 max-w-5xl">

      {/* ページヘッダー */}
      <div className="flex items-end justify-between mb-6 md:mb-8">
        <div>
          <p className="text-[11px] font-bold text-[#00288e] uppercase tracking-widest mb-1">Reservation Manager</p>
          <h1 className="text-xl md:text-2xl font-black text-[#1a3844]">予約一覧</h1>
        </div>
        <Link
          href="/reservations/new"
          className="flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg text-white text-xs md:text-sm font-bold shadow-sm transition-all hover:shadow-md"
          style={{ background: 'linear-gradient(135deg, #00288e, #1e40af)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
          <span className="hidden sm:inline">新規予約</span>
          <span className="sm:hidden">新規</span>
        </Link>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-3 gap-3 md:gap-5 mb-8 md:mb-10">
        <SummaryCard
          label="本日の予約"
          value={summary.total_today}
          unit="件"
          accent="#00288e"
          sub={todayList.length > 0 ? `${todayList.filter(r => r.status !== 'canceled').length}件 対応予定` : undefined}
        />
        <SummaryCard
          label="本日 受付中"
          value={summary.pending_count}
          unit="件"
          accent="#1a3844"
          sub={summary.pending_count > 0 ? '確定待ちの予約があります' : '確定待ちなし'}
        />
        <SummaryCard
          label="未通知"
          value={summary.unnotified}
          unit="件"
          accent="#ba1a1a"
          sub={summary.unnotified > 0 ? '確認通知が未送信です' : '未通知なし'}
          alert={summary.unnotified > 0}
        />
      </div>

      {/* 本日の予約 */}
      <section className="mb-8">
        <SectionHeader label="本日の予約" count={todayList.length} dot="#00288e" />
        <ReservationList rows={todayList} today={today} highlightToday />
      </section>

      {/* 近日の予約 */}
      <section className="mb-8">
        <SectionHeader label="近日の予約" count={upcomingList.length} dot="#1a3844" />
        <ReservationList rows={upcomingList} today={today} />
      </section>

      {/* 過去の予約 */}
      <section>
        <SectionHeader label="過去の予約" count={pastList.length} dot="#c4c5d5" muted />
        <ReservationList rows={[...pastList].reverse()} today={today} muted />
      </section>
    </div>
  );
}

/* ---- サブコンポーネント ---- */

function SummaryCard({
  label, value, unit, accent, sub, alert = false,
}: {
  label: string; value: number; unit: string;
  accent: string; sub?: string; alert?: boolean;
}) {
  return (
    <div
      className="bg-white rounded-xl p-3 md:p-6 shadow-sm flex flex-col justify-between"
      style={{ borderBottom: `4px solid ${accent}` }}
    >
      <div>
        <p className="text-[9px] md:text-xs font-bold text-[#444653] mb-1 md:mb-2">{label}</p>
        <p className="text-2xl md:text-4xl font-extrabold" style={{ color: accent }}>
          {value}<span className="text-xs md:text-base font-bold text-[#444653] ml-0.5 md:ml-1">{unit}</span>
        </p>
      </div>
      {sub && (
        <p className={`text-[9px] md:text-[11px] font-bold mt-2 md:mt-3 hidden sm:flex items-center gap-1 ${alert ? 'text-[#ba1a1a]' : 'text-[#444653]'}`}>
          {alert && <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>priority_high</span>}
          {sub}
        </p>
      )}
    </div>
  );
}

function SectionHeader({
  label, count, dot, muted = false,
}: {
  label: string; count: number; dot: string; muted?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: dot }} />
      <h2 className={`text-sm font-bold ${muted ? 'text-[#757684]' : 'text-[#444653]'}`}>
        {label}
        <span className="ml-2 text-[#757684] font-normal">（{count}件）</span>
      </h2>
    </div>
  );
}

function ReservationList({
  rows, today, highlightToday = false, muted = false,
}: {
  rows: Awaited<ReturnType<typeof getReservations>>;
  today: string;
  highlightToday?: boolean;
  muted?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-xl px-6 py-8 text-center text-sm text-[#757684] shadow-sm">
        該当する予約はありません
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* デスクトップ: テーブルヘッダー */}
      <div className="hidden md:grid grid-cols-12 px-4 py-2 text-[10px] font-bold text-[#757684] uppercase tracking-widest bg-[#f3f4f5] rounded-lg">
        <div className="col-span-2">予約日時</div>
        <div className="col-span-3">顧客名 / サービス</div>
        <div className="col-span-2 text-center">状態</div>
        <div className="col-span-2 text-center">確認通知</div>
        <div className="col-span-2 text-center">リマインド</div>
        <div className="col-span-1" />
      </div>

      {rows.map((r) => {
        const isToday = r.reservation_date === today;
        const needsAttention = !r.confirmation_sent && r.status === 'pending';
        const borderCls = needsAttention
          ? 'border-l-4 border-[#ba1a1a]'
          : highlightToday && isToday
          ? 'border-l-4 border-[#00288e]'
          : '';
        return (
          <Link
            key={r.id}
            href={`/reservations/${r.id}`}
            className={`flex md:grid md:grid-cols-12 items-center bg-white px-4 py-3 md:py-4 rounded-xl shadow-sm transition-shadow hover:shadow-md gap-3 md:gap-0 ${
              r.status === 'canceled' || muted ? 'opacity-50' : ''
            } ${borderCls}`}
          >
            {/* 日時 */}
            <div className="shrink-0 md:col-span-2">
              <p className={`text-base font-black ${isToday ? 'text-[#00288e]' : 'text-[#191c1d]'}`}>
                {r.reservation_time}
              </p>
              <p className="text-[10px] font-bold text-[#757684] mt-0.5">
                {formatDate(r.reservation_date)}
              </p>
            </div>

            {/* 顧客名・サービス */}
            <div className="flex-1 min-w-0 md:col-span-3">
              <p className="text-sm font-bold text-[#191c1d] truncate">
                {r.customer_name} <span className="font-normal text-xs">様</span>
              </p>
              <p className="text-xs text-[#444653] truncate mt-0.5">{r.service_name}</p>
            </div>

            {/* ステータス */}
            <div className="shrink-0 md:col-span-2 md:flex md:justify-center">
              <StatusBadge status={r.status as ReservationStatus} />
            </div>

            {/* 確認通知・リマインド: デスクトップのみ */}
            <div className="hidden md:flex col-span-2 justify-center">
              <NotificationBadge sent={r.confirmation_sent} label={r.confirmation_sent ? '送信済み' : '未送信'} />
            </div>
            <div className="hidden md:flex col-span-2 justify-center">
              <NotificationBadge sent={r.reminder_sent} label={r.reminder_sent ? '送信済み' : '未送信'} />
            </div>

            {/* 矢印 */}
            <div className="shrink-0 md:col-span-1 md:flex md:justify-end">
              <span className="material-symbols-outlined text-[#c4c5d5]" style={{ fontSize: '20px' }}>chevron_right</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
