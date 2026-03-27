import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getReservationById } from '@/lib/reservations';
import { updateReservationAction } from '@/actions/reservations';
import StatusBadge from '@/components/StatusBadge';
import NotificationBadge from '@/components/NotificationBadge';
import type { ReservationStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

function formatDateTime(date: string, time: string) {
  const d = new Date(date + 'T00:00:00');
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）${time}`;
}

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reservation = await getReservationById(Number(id));
  if (!reservation) notFound();

  const updateAction = updateReservationAction.bind(null, reservation.id);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* ヘッダー */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Link href="/reservations" className="text-sm text-gray-500 hover:text-gray-700">
            ← 一覧に戻る
          </Link>
          <h1 className="text-xl font-bold text-gray-900 mt-2">予約詳細 / 編集</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            登録日時：{new Date(reservation.created_at).toLocaleString('ja-JP')}
          </p>
        </div>
        <StatusBadge status={reservation.status as ReservationStatus} />
      </div>

      {/* 通知状態バナー */}
      {!reservation.confirmation_sent && reservation.status !== 'canceled' && reservation.status !== 'completed' && (
        <div className="mb-5 flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <span>⚠</span>
          確認通知が未送信です。対応後に通知状態を更新してください。
        </div>
      )}

      <form action={updateAction} className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">

        {/* お客様情報 */}
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
              defaultValue={reservation.customer_name}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
              <input
                type="email"
                name="customer_email"
                defaultValue={reservation.customer_email ?? ''}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">電話番号</label>
              <input
                type="tel"
                name="customer_phone"
                defaultValue={reservation.customer_phone ?? ''}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* 予約内容 */}
        <div className="px-6 py-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">予約内容</h2>

          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">予約日時</label>
            <p className="text-sm font-medium text-gray-900 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
              {formatDateTime(reservation.reservation_date, reservation.reservation_time)}
            </p>
            {/* hidden で保持 */}
            <input type="hidden" name="reservation_date" value={reservation.reservation_date} />
            <input type="hidden" name="reservation_time" value={reservation.reservation_time} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              サービス内容 <span className="text-red-500">*</span>
            </label>
            <select
              name="service_name"
              required
              defaultValue={reservation.service_name}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
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
            <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
            <textarea
              name="note"
              rows={3}
              defaultValue={reservation.note ?? ''}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* ステータス */}
        <div className="px-6 py-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">対応状態</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
            <select
              name="status"
              defaultValue={reservation.status}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="pending">受付</option>
              <option value="confirmed">確定</option>
              <option value="completed">完了</option>
              <option value="canceled">キャンセル</option>
            </select>
          </div>
        </div>

        {/* 通知状態 */}
        <div className="px-6 py-5 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">通知状態</h2>
          <p className="text-xs text-gray-500">対応完了後に手動で更新してください</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">確認通知</span>
                <NotificationBadge sent={reservation.confirmation_sent} />
              </div>
              <select
                name="confirmation_sent"
                defaultValue={String(reservation.confirmation_sent)}
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="false">未送信</option>
                <option value="true">送信済み</option>
              </select>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">リマインド通知</span>
                <NotificationBadge sent={reservation.reminder_sent} />
              </div>
              <select
                name="reminder_sent"
                defaultValue={String(reservation.reminder_sent)}
                className="w-full rounded-md border border-gray-300 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="false">未送信</option>
                <option value="true">送信済み</option>
              </select>
            </div>
          </div>
        </div>

        {/* 保存ボタン */}
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
            変更を保存する
          </button>
        </div>

      </form>
    </div>
  );
}
