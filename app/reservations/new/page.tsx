import Link from 'next/link';
import { createReservationAction } from '@/actions/reservations';

export default function NewReservationPage() {
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <Link href="/reservations" className="text-sm text-gray-500 hover:text-gray-700">
          ← 一覧に戻る
        </Link>
        <h1 className="text-xl font-bold text-gray-900 mt-2">新規予約登録</h1>
        <p className="text-sm text-gray-500 mt-0.5">お客様の予約情報を入力してください</p>
      </div>

      <form action={createReservationAction} className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">

        {/* 顧客情報 */}
        <div className="px-6 py-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">お客様情報</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              お客様名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="customer_name"
              required
              placeholder="例：田中 花子"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メールアドレス
              </label>
              <input
                type="email"
                name="customer_email"
                placeholder="例：hanako@example.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                電話番号
              </label>
              <input
                type="tel"
                name="customer_phone"
                placeholder="例：090-1234-5678"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 予約情報 */}
        <div className="px-6 py-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">予約内容</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                予約日 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="reservation_date"
                required
                defaultValue={today}
                min={today}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                予約時間 <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="reservation_time"
                required
                defaultValue="10:00"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              サービス内容 <span className="text-red-500">*</span>
            </label>
            <select
              name="service_name"
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="">選択してください</option>
              <option value="カット">カット</option>
              <option value="カット＆カラー">カット＆カラー</option>
              <option value="カット＆トリートメント">カット＆トリートメント</option>
              <option value="カラーリング">カラーリング</option>
              <option value="パーマ">パーマ</option>
              <option value="ヘッドスパ">ヘッドスパ</option>
              <option value="トリートメント">トリートメント</option>
              <option value="その他">その他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              備考
            </label>
            <textarea
              name="note"
              rows={3}
              placeholder="アレルギー情報、ご要望など"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* ボタン */}
        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex items-center justify-between">
          <Link
            href="/reservations"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            キャンセル
          </Link>
          <button
            type="submit"
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          >
            予約を登録する
          </button>
        </div>

      </form>
    </div>
  );
}
