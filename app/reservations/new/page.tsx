import Link from 'next/link';
import { createReservationAction } from '@/actions/reservations';

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
    <div className="px-10 py-8 max-w-5xl">

      {/* ヘッダー */}
      <div className="mb-10">
        <p className="text-[11px] font-bold text-[#00288e] uppercase tracking-widest mb-1">New Appointment</p>
        <h1 className="text-2xl font-black text-[#1a3844]">新規予約の登録</h1>
        <p className="text-sm text-[#444653] mt-2">
          お客様の予約情報を入力してください。登録後、管理画面で確認できます。
        </p>
      </div>

      <div className="grid grid-cols-3 gap-7">

        {/* フォーム本体 */}
        <form action={createReservationAction} className="col-span-2 space-y-6">

          {/* お客様情報 */}
          <FormSection icon="person" title="お客様情報">
            <div className="grid grid-cols-2 gap-5">
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
            <div className="grid grid-cols-2 gap-5">
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

          {/* ボタン（モバイル用） */}
          <div className="flex gap-3 lg:hidden">
            <Link href="/reservations" className="flex-1 py-3 text-center text-sm text-[#444653] hover:text-[#191c1d] bg-[#e1e3e4] rounded-lg font-bold">
              キャンセル
            </Link>
            <button
              type="submit"
              className="flex-1 py-3 text-white text-sm font-black rounded-lg shadow-md flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #00288e, #1e40af)' }}
            >
              予約を登録する
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
            </button>
          </div>
        </form>

        {/* 右サイドパネル */}
        <div className="space-y-5">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#e7e8e9] sticky top-8">
            <h3 className="text-xs font-bold text-[#00288e] flex items-center gap-1.5 mb-5">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>visibility</span>
              登録内容の確認
            </h3>
            <div className="space-y-4">
              <PreviewItem icon="account_circle" label="お客様" value="入力してください" />
              <PreviewItem icon="schedule" label="スケジュール" value="日付・時間を選択" />
              <PreviewItem icon="spa" label="メニュー" value="サービスを選択" />
            </div>
            <div className="mt-6 pt-5 border-t border-[#f3f4f5]">
              <p className="text-[11px] text-[#757684] leading-relaxed mb-4">
                内容に問題がなければ「予約を登録する」ボタンを押してください。
              </p>
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

function FormSection({
  icon, title, children,
}: {
  icon: string; title: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl p-7 shadow-sm">
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-[#f3f4f5]">
        <span className="material-symbols-outlined text-[#00288e]" style={{ fontSize: '20px' }}>{icon}</span>
        <h2 className="text-sm font-bold text-[#1a3844]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({
  label, required, colSpan, children,
}: {
  label: string; required?: boolean; colSpan?: number; children: React.ReactNode;
}) {
  return (
    <div className={colSpan === 2 ? 'col-span-2' : ''}>
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

function PreviewItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-[#f3f4f5] flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined text-[#00288e]" style={{ fontSize: '18px' }}>{icon}</span>
      </div>
      <div>
        <p className="text-[9px] font-bold text-[#757684] uppercase tracking-wide">{label}</p>
        <p className="text-xs font-bold text-[#1a3844] mt-0.5">{value}</p>
      </div>
    </div>
  );
}
