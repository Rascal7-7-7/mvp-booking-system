export default function NotificationBadge({ sent, label }: { sent: boolean; label?: string }) {
  return sent ? (
    <div className="flex flex-col items-center gap-0.5">
      <span className="material-symbols-outlined text-[#006e1c]" style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>
        check_circle
      </span>
      {label && <span className="text-[9px] text-[#444653]">{label}</span>}
    </div>
  ) : (
    <div className="flex flex-col items-center gap-0.5">
      <span className="material-symbols-outlined text-[#757684]" style={{ fontSize: '20px' }}>
        mail
      </span>
      {label && <span className="text-[9px] text-[#757684]">{label}</span>}
    </div>
  );
}
