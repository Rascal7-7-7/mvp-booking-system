import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getReservationById } from '@/lib/reservations';
import { updateReservationAction } from '@/actions/reservations';
import StatusBadge from '@/components/StatusBadge';
import { STATUS_LABEL, type ReservationStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  return { title: `予約詳細 #${String(id).padStart(6, '0')} | 予約管理システム` };
}

const SERVICES = [
  'カット','カット＆カラー','カット＆トリートメント',
  'カラーリング','パーマ','ヘッドスパ','トリートメント','その他',
];

const STATUSES: ReservationStatus[] = ['pending', 'confirmed', 'completed', 'canceled'];

function formatFullDate(date: string, time: string) {
  const d = new Date(date + 'T00:00:00');
  const w = ['日','月','火','水','木','金','土'][d.getDay()];
  return `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日（${w}） ${time}`;
}

export default async function ReservationDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const [{ id }, { saved }] = await Promise.all([params, searchParams]);
  const r = await getReservationById(Number(id));
  if (!r) notFound();

  const updateAction = updateReservationAction.bind(null, r.id);

  return (
    <div className="px-4 md:px-10 py-6 md:py-8 max-w-4xl">

      {/* 保存成功バナー */}
      {saved === '1' && (
        <div className="flex items-center gap-3 bg-[#ebfaee] border border-[#006e1c]/20 rounded-xl px-5 py-3.5 mb-6 shadow-sm">
          <span
            className="material-symbols-outlined text-[#006e1c] shrink-0"
            style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
          <p className="text-sm font-bold text-[#005313]">予約情報を保存しました</p>
        </div>
      )}

      {/* パンくず + ヘッダー */}
      <div className="mb-6 md:mb-8">
        <nav className="flex items-center gap-1.5 text-xs text-[#757684] mb-3">
          <Link href="/reservations" className="hover:text-[#00288e] transition-colors">予約一覧</Link>
          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>chevron_right</span>
          <span className="text-[#00288e] font-bold">予約詳細 #{String(r.id).padStart(6, '0')}</span>
        </nav>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-[#1a3844] flex items-center gap-3 flex-wrap">
              {r.customer_name} <span className="text-base font-normal text-[#444653]">様 · 予約編集</span>
            </h1>
            <p className="text-xs text-[#757684] mt-1">
              登録日時：{new Date(r.created_at).toLocaleString('ja-JP')}
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/reservations"
              className="px-4 md:px-5 py-2.5 rounded-lg bg-[#e1e3e4] text-[#191c1d] text-sm font-bold hover:bg-[#d9dadb] transition-colors"
            >
              一覧に戻る
            </Link>
            <button
              form="edit-form"
              type="submit"
              className="px-5 md:px-7 py-2.5 rounded-lg text-white text-sm font-bold shadow-md hover:opacity-90 active:scale-95 transition-all"
              style={{ background: 'linear-gradient(135deg, #00288e, #1e40af)' }}
            >
              更新を保存する
            </button>
          </div>
        </div>
      </div>

      <form id="edit-form" action={updateAction}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* 左カラム */}
          <div className="md:col-span-8 space-y-6">

            {/* ステータス切り替え */}
            <div className="bg-[#f3f4f5] p-1 rounded-xl flex gap-1">
              {STATUSES.map(s => (
                <label
                  key={s}
                  className={`flex-1 flex flex-col items-center justify-center py-2.5 md:py-3 rounded-lg cursor-pointer transition-all ${
                    r.status === s ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={s}
                    defaultChecked={r.status === s}
                    className="sr-only"
                  />
                  <span className={`text-[9px] md:text-[10px] font-bold mb-0.5 ${r.status === s ? 'text-[#00288e]' : 'text-[#757684]'}`}>
                    {r.status === s ? '現在' : '　'}
                  </span>
                  <span className={`text-xs md:text-sm font-bold ${r.status === s ? 'text-[#191c1d]' : 'text-[#c4c5d5]'}`}>
                    {STATUS_LABEL[s]}
                  </span>
                </label>
              ))}
            </div>

            {/* 予約内容 */}
            <Section icon="event" title="予約内容詳細">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
                <EditField label="顧客名" required>
                  <input type="text" name="customer_name" required defaultValue={r.customer_name} className={inputCls} />
                </EditField>
                <EditField label="電話番号">
                  <input type="tel" name="customer_phone" defaultValue={r.customer_phone ?? ''} className={inputCls} />
                </EditField>
                <EditField label="メールアドレス" colSpan={2}>
                  <input type="email" name="customer_email" defaultValue={r.customer_email ?? ''} className={inputCls} />
                </EditField>
                <EditField label="予約日時" colSpan={2}>
                  <p className="bg-[#f3f4f5] rounded-lg px-4 py-3 text-sm font-medium text-[#191c1d]">
                    {formatFullDate(r.reservation_date, r.reservation_time)}
                  </p>
                  <input type="hidden" name="reservation_date" value={r.reservation_date} />
                  <input type="hidden" name="reservation_time" value={r.reservation_time} />
                </EditField>
                <EditField label="サービス内容" required colSpan={2}>
                  <select name="service_name" required defaultValue={r.service_name} className={inputCls}>
                    {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </EditField>
                <EditField label="備考・特別リクエスト" colSpan={2}>
                  <textarea name="note" rows={3} defaultValue={r.note ?? ''} className={`${inputCls} resize-none`} />
                </EditField>
              </div>
            </Section>

          </div>

          {/* 右カラム */}
          <div className="md:col-span-4 space-y-5">

            {/* 通知ステータス */}
            <div
              className="bg-white rounded-xl p-5 md:p-6 shadow-sm"
              style={{ borderLeft: '4px solid #00288e' }}
            >
              <div className="flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined text-[#00288e]" style={{ fontSize: '20px' }}>notifications</span>
                <h3 className="text-sm font-bold text-[#1a3844]">通知ステータス</h3>
              </div>
              <div className="space-y-3">
                <NotificationRow label="予約確認通知" sent={r.confirmation_sent} name="confirmation_sent" />
                <NotificationRow label="前日リマインド" sent={r.reminder_sent} name="reminder_sent" />
              </div>
              <p className="text-[10px] text-[#757684] mt-4 leading-relaxed">
                通知を送付後、手動でフラグを更新してください。
              </p>
            </div>

            {/* 現在ステータス確認 */}
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-[10px] font-bold text-[#757684] uppercase tracking-wide mb-2">現在の状態</p>
              <StatusBadge status={r.status as ReservationStatus} />
              <p className="text-[10px] text-[#757684] mt-2">
                最終更新：{new Date(r.updated_at).toLocaleString('ja-JP')}
              </p>
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}

/* ---- サブコンポーネント ---- */

const inputCls =
  'w-full bg-[#f3f4f5] border-0 rounded-lg px-4 py-3 text-sm text-[#191c1d] font-medium ' +
  'focus:ring-2 focus:ring-[#00288e] outline-none transition-all';

function Section({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-5 md:p-7 shadow-sm">
      <div className="flex items-center gap-2 mb-4 md:mb-5 pb-4 border-b border-[#f3f4f5]">
        <span className="material-symbols-outlined text-[#00288e]" style={{ fontSize: '20px' }}>{icon}</span>
        <h2 className="text-sm font-bold text-[#1a3844]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function EditField({
  label, required, colSpan, children,
}: {
  label: string; required?: boolean; colSpan?: number; children: React.ReactNode;
}) {
  return (
    <div className={colSpan === 2 ? 'sm:col-span-2' : ''}>
      <label className="flex items-center gap-1.5 text-xs font-bold text-[#444653] mb-1.5">
        {label}
        {required && <span className="text-[#ba1a1a]">*</span>}
      </label>
      {children}
    </div>
  );
}

function NotificationRow({ label, sent, name }: { label: string; sent: boolean; name: string }) {
  return (
    <div className="flex items-center justify-between bg-[#f3f4f5] rounded-lg px-4 py-3">
      <div className="flex items-center gap-2">
        <span
          className="material-symbols-outlined"
          style={{
            fontSize: '18px',
            color: sent ? '#006e1c' : '#c4c5d5',
            fontVariationSettings: sent ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          check_circle
        </span>
        <span className="text-sm font-medium text-[#191c1d]">{label}</span>
      </div>
      <select
        name={name}
        defaultValue={String(sent)}
        className="text-[10px] font-black px-2 py-1 rounded bg-white ring-1 ring-[#c4c5d5]/30 outline-none cursor-pointer"
      >
        <option value="false">未送信</option>
        <option value="true">送信済み</option>
      </select>
    </div>
  );
}
