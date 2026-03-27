export default function NotificationBadge({ sent }: { sent: boolean }) {
  return sent ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
      送信済み
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">
      <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" />
      未送信
    </span>
  );
}
