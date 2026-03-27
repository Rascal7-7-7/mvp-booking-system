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
  const todayList  = reservations.filter(r => r.reservation_date === today);
  const otherList  = reservations.filter(r => r.reservation_date !== today);

  return (
    <div className="px-10 py-8 max-w-5xl">

      {/* ページヘッダー */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[11px] font-bold text-[#00288e] uppercase tracking-widest mb-1">Reservation Manager</p>
          <h1 className="text-2xl font-black text-[#1a3844]">予約一覧</h1>
        </div>
        <Link
          href="/reservations/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-sm font-bold shadow-sm transition-all hover:shadow-md"
          style={{ background: 'linear-gradient(135deg, #00288e, #1e40af)' }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>add</span>
          新規予約
        </Link>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-3 gap-5 mb-10">
        <SummaryCard
          label="本日の予約"
          value={summary.total_today}
          unit="件"
          accent="#00288e"
          sub={todayList.length > 0 ? `${todayList.filter(r => r.status !== 'canceled').length}件 対応予定` : undefined}
        />
        <SummaryCard
          label="受付中"
          value={summary.pending_count}
          unit="件"
          accent="#1a3844"
          sub={summary.pending_count > 0 ? '確認が必要な予約があります' : undefined}
        />
        <SummaryCard
          label="未通知（本日）"
          value={summary.unnotified}
          unit="件"
          accent="#ba1a1a"
          sub={summary.unnotified > 0 ? '確認通知が未送信です' : '対応が必要な未通知はありません'}
          alert={summary.unnotified > 0}
        />
      </div>

      {/* 本日の予約 */}
      <section className="mb-8">
        <SectionHeader label="本日の予約" count={todayList.length} dot="#00288e" />
        <ReservationTable rows={todayList} today={today} highlightToday />
      </section>

      {/* その他の予約 */}
      <section>
        <SectionHeader label="その他の予約" count={otherList.length} dot="#c4c5d5" />
        <ReservationTable rows={otherList} today={today} />
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
      className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between"
      style={{ borderBottom: `4px solid ${accent}` }}
    >
      <div>
        <p className="text-xs font-bold text-[#444653] mb-2">{label}</p>
        <p className="font-headline text-4xl font-extrabold" style={{ color: accent }}>
          {value}<span className="text-base font-bold text-[#444653] ml-1">{unit}</span>
        </p>
      </div>
      {sub && (
        <p className={`text-[11px] font-bold mt-3 flex items-center gap-1 ${alert ? 'text-[#ba1a1a]' : 'text-[#444653]'}`}>
          {alert && <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>priority_high</span>}
          {sub}
        </p>
      )}
    </div>
  );
}

function SectionHeader({ label, count, dot }: { label: string; count: number; dot: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: dot }} />
      <h2 className="text-sm font-bold text-[#444653]">
        {label}
        <span className="ml-2 text-[#757684] font-normal">（{count}件）</span>
      </h2>
    </div>
  );
}

function ReservationTable({
  rows, today, highlightToday = false,
}: {
  rows: Awaited<ReturnType<typeof getReservations>>;
  today: string;
  highlightToday?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-xl px-6 py-10 text-center text-sm text-[#757684] shadow-sm">
        該当する予約はありません
      </div>
    );
  }

  return (
    <div className="bg-[#f3f4f5] rounded-xl overflow-hidden">
      {/* テーブルヘッダー */}
      <div className="grid grid-cols-12 px-6 py-3 text-[10px] font-bold text-[#757684] uppercase tracking-widest">
        <div className="col-span-2">予約日時</div>
        <div className="col-span-3">顧客名 / サービス</div>
        <div className="col-span-2 text-center">状態</div>
        <div className="col-span-2 text-center">確認通知</div>
        <div className="col-span-2 text-center">リマインド</div>
        <div className="col-span-1 text-right" />
      </div>

      <div className="space-y-1 px-2 pb-2">
        {rows.map((r) => {
          const isToday = r.reservation_date === today;
          const needsAttention = !r.confirmation_sent && r.status === 'pending';
          return (
            <div
              key={r.id}
              className={`grid grid-cols-12 items-center bg-white px-4 py-4 rounded-lg transition-shadow hover:shadow-md ${
                r.status === 'canceled' ? 'opacity-50' : ''
              } ${needsAttention ? 'border-l-4 border-[#ba1a1a]' : highlightToday && isToday ? 'border-l-4 border-[#00288e]' : ''}`}
            >
              <div className="col-span-2">
                <p className={`text-base font-black ${isToday ? 'text-[#00288e]' : 'text-[#191c1d]'}`}>
                  {r.reservation_time}
                </p>
                <p className="text-[10px] font-bold text-[#757684] mt-0.5">
                  {formatDate(r.reservation_date)}
                </p>
              </div>
              <div className="col-span-3">
                <p className="text-sm font-bold text-[#191c1d]">
                  {r.customer_name} <span className="font-normal text-xs">様</span>
                </p>
                <p className="text-xs text-[#444653] mt-0.5">{r.service_name}</p>
              </div>
              <div className="col-span-2 flex justify-center">
                <StatusBadge status={r.status as ReservationStatus} />
              </div>
              <div className="col-span-2 flex justify-center">
                <NotificationBadge sent={r.confirmation_sent} label={r.confirmation_sent ? '送信済み' : '未送信'} />
              </div>
              <div className="col-span-2 flex justify-center">
                <NotificationBadge sent={r.reminder_sent} label={r.reminder_sent ? '送信済み' : '未送信'} />
              </div>
              <div className="col-span-1 flex justify-end">
                <Link
                  href={`/reservations/${r.id}`}
                  className="p-1.5 rounded-full text-[#757684] hover:text-[#00288e] hover:bg-[#dde1ff]/40 transition-colors"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>chevron_right</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
