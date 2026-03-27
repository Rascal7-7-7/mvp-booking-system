import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '予約管理システム',
  description: '小規模店舗向け予約管理・通知確認システム',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col bg-gray-50">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center gap-6">
                <Link href="/reservations" className="text-base font-bold text-gray-900 hover:text-blue-600 transition-colors">
                  予約管理
                </Link>
                <nav className="flex items-center gap-4 text-sm">
                  <Link href="/reservations" className="text-gray-600 hover:text-gray-900 transition-colors">
                    一覧
                  </Link>
                  <Link href="/schedule" className="text-gray-600 hover:text-gray-900 transition-colors">
                    スケジュール
                  </Link>
                </nav>
              </div>
              <Link
                href="/reservations/new"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                <span>＋</span> 予約登録
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}
