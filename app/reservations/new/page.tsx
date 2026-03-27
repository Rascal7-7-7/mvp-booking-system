import type { Metadata } from 'next';
import Link from 'next/link';
import { createReservationAction } from '@/actions/reservations';

export const metadata: Metadata = {
  title: '新規予約登録 | 予約管理システム',
};

const SERVICES = [
  'カット',
  'カット＆カラー',
  'カット＆トリートメント',
  'カラーリング',
  'パーマ',
  'ヘッドスパ',
  'トリートメント',
  'その他',
];

export default function NewReservationPage() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="px-4 md:px-10 py-6 md:py-8 max-w-5xl">

      {/* ヘッダー */}
      <div className="mb-8 md:mb-10">
        <p className="text-[11px] font-bold text-[#00288e] uppercase tracking-widest mb-1">New Appointment</p>
        <h1 className="text-xl md:text-2xl font-black text-[#1a3844]">新規予約の登録</h1>
        <p className="text-sm text-[#444653] mt-2">
          お客様の予約情報を入力してください。登録後、管理画面で確認できます。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7">

        {/* フォーム本体 */}
        <form id="new-form" action={createReservationAction} className="md:col-span-2 space-y-6">

          {/* お客様情報 */}
          <FormSection icon="person" title="お客様情報">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              <Field label="顧客名" required>
                <input
                  type="text" name="customer_name" required
                  placeholder="山田 太郎"
                  className={inputCls}
                />
              </Field>
              <Field label="メールアドレス">
                <input
                  type="email" name="customer_email"
                  placeholder="example@email.com"
                  className={inputCls}
                />
              </Field>
              <Field label="電話番号" colSpan={2}>
                <input
                  type="tel" name="customer_phone"
                  placeholder="090-0000-0000"
                  className={inputCls}
                />
              </Field>
            </div>
          </FormSection>

          {/* 予約内容 */}
          <FormSection icon="calendar_today" title="予約内容">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-5">
              <Field label="予約日" required>
                <input
                  type="date" name="reservation_date" required
                  defaultValue={today} min={today}
                  className={inputCls}
                />
              </Field>
              <Field label="予約時間" required>
                <input
                  type="time" name="reservation_time" required
                  defaultValue="10:00"
                  className={inputCls}
                />
              </Field>
              <Field label="サービス内容" required colSpan={2}>
                <select name="service_name" required className={inputCls}>
                  <option value="">メニューを選択してください</option>
                  {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="備考" colSpan={2}>
                <textarea
                  name="note" rows={3}
                  placeholder="アレルギーの有無やご要望があればご記入ください。"
                  className={`${inputCls} resize-none`}
                />
              </Field>
            </div>
          </FormSection>

          {/* モバイル用送信ボタン */}
          <div className="flex gap-3 md:hidden">
            <Link href="/reservations" className="flex-1 py-3 text-center text-sm text-[#444653] bg-[#e1e3e4] rounded-lg font-bold">
              キャンセル
            </Link>
            <button
              type="submit"
              className="flex-1 py-3 text-white text-sm font-black rounded-lg shadow-md flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #00288e, #1e40af)' }}
            >
              登録する
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
            </button>
          </div>
        </form>

        {/* 右サイドパネル: デスクトップのみ */}
        <div className="hidden md:block">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e7e8e9] sticky top-8">
            <h3 className="text-xs font-bold text-[#00288e] flex items-center gap-1.5 mb-5">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>info</span>
              登録の流れ
            </h3>
            <ol className="space-y-4">
              {[
                { icon: 'person', step: '01', label: 'お客様情報を入力', desc: '顧客名は必須です' },
                { icon: 'calendar_today', step: '02', label: '日時を選択', desc: '予約日・時間を指定' },
                { icon: 'spa', step: '03', label: 'サービスを選択', desc: 'メニューを選んでください' },
                { icon: 'check_circle', step: '04', label: '登録ボタンを押す', desc: '一覧画面に反映されます' },
              ].map(({ icon, step, label, desc }) => (
                <li key={step} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#dde1ff] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#00288e]" style={{ fontSize: '16px' }}>{icon}</span>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-[#00288e] tracking-widest">STEP {step}</p>
                    <p className="text-xs font-bold text-[#1a3844] mt-0.5">{label}</p>
                    <p className="text-[10px] text-[#757684] mt-0.5">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6 pt-5 border-t border-[#f3f4f5]">
              <button
                form="new-form"
                type="submit"
                className="w-full py-4 text-white font-black rounded-xl shadow-lg flex items-center justify-center gap-2 text-sm transition-all hover:opacity-90 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #00288e, #1e40af)' }}
              >
                予約を登録する
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
              </button>
              <Link
                href="/reservations"
                className="block w-full mt-3 py-2.5 text-center text-sm text-[#444653] hover:text-[#191c1d] rounded-lg hover:bg-[#f3f4f5] transition-colors font-medium"
              >
                キャンセル
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ---- ヘルパー ---- */

const inputCls =
  'w-full bg-[#f3f4f5] border-none rounded-lg px-4 py-3 text-sm text-[#191c1d] ' +
  'ring-1 ring-[#c4c5d5]/30 focus:ring-2 focus:ring-[#00288e] outline-none transition-all ' +
  'placeholder:text-[#757684]/60';

function FormSection({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
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

function Field({ label, required, colSpan, children }: { label: string; required?: boolean; colSpan?: number; children: React.ReactNode }) {
  return (
    <div className={colSpan === 2 ? 'sm:col-span-2' : ''}>
      <label className="flex items-center gap-1.5 text-xs font-bold text-[#444653] mb-1.5">
        {label}
        {required
          ? <span className="text-[10px] px-1.5 py-0.5 bg-[#ffdad6] text-[#93000a] rounded-full font-bold">必須</span>
          : <span className="text-[10px] px-1.5 py-0.5 bg-[#e7e8e9] text-[#757684] rounded-full font-bold">任意</span>
        }
      </label>
      {children}
    </div>
  );
}
