import type { Metadata } from 'next';
import './globals.css';
import NavItem from '@/components/NavItem';

export const metadata: Metadata = {
  title: '予約管理システム',
  description: '小規模店舗向け予約管理・通知確認システム',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;700;800&family=Noto+Sans+JP:wght@300;400;500;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col md:flex-row bg-[#f8f9fa]">

        {/* モバイル: トップヘッダー */}
        <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#f3f4f5] flex items-center justify-between px-4 h-14 border-b border-[#c4c5d5]/20">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#00288e] to-[#1e40af] flex items-center justify-center text-white">
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>spa</span>
            </div>
            <span className="text-sm font-black text-[#00288e]">予約管理システム</span>
          </div>
        </header>

        {/* デスクトップ: サイドバー */}
        <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col p-6 z-50 bg-[#f3f4f5]">
          {/* ロゴ */}
          <div className="mb-10 px-2">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00288e] to-[#1e40af] flex items-center justify-center text-white">
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>spa</span>
              </div>
              <div>
                <h1 className="text-base font-black text-[#00288e] leading-tight">予約管理システム</h1>
                <p className="text-[9px] text-[#757684] uppercase tracking-widest mt-0.5">Digital Sanctuary</p>
              </div>
            </div>
          </div>

          {/* ナビゲーション */}
          <nav className="flex flex-col gap-1.5 flex-1">
            <NavItem href="/reservations" icon="event_note" label="予約一覧" />
            <NavItem href="/reservations/new" icon="add_circle" label="新規登録" />
            <NavItem href="/schedule" icon="calendar_view_day" label="スケジュール" />
          </nav>

          {/* フッター */}
          <div className="pt-5 border-t border-[#c4c5d5]/30">
            <div className="flex items-center gap-3 px-2">
              <div className="w-8 h-8 rounded-full bg-[#1e40af]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#00288e]" style={{ fontSize: '16px' }}>account_circle</span>
              </div>
              <div>
                <p className="text-xs font-bold text-[#191c1d]">管理者</p>
                <p className="text-[10px] text-[#757684]">店舗マネージャー</p>
              </div>
            </div>
          </div>
        </aside>

        {/* メインコンテンツ */}
        <main className="flex-1 min-h-screen pt-14 pb-20 md:pt-0 md:pb-0 md:ml-64">
          {children}
        </main>

        {/* モバイル: ボトムナビ */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#e7e8e9] flex">
          <NavItem href="/reservations" icon="event_note" label="予約一覧" mobile />
          <NavItem href="/reservations/new" icon="add_circle" label="新規登録" mobile />
          <NavItem href="/schedule" icon="calendar_view_day" label="スケジュール" mobile />
        </nav>

      </body>
    </html>
  );
}
