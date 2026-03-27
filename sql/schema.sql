-- reservations テーブル
CREATE TABLE IF NOT EXISTS reservations (
  id              SERIAL PRIMARY KEY,
  customer_name   VARCHAR(100)  NOT NULL,
  customer_email  VARCHAR(255),
  customer_phone  VARCHAR(20),
  reservation_date DATE         NOT NULL,
  reservation_time TIME         NOT NULL,
  service_name    VARCHAR(100)  NOT NULL,
  note            TEXT,
  status          VARCHAR(20)   NOT NULL DEFAULT 'pending',
  confirmation_sent BOOLEAN     NOT NULL DEFAULT false,
  reminder_sent   BOOLEAN       NOT NULL DEFAULT false,
  created_at      TIMESTAMP     NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- サンプルデータ（デモ用）
INSERT INTO reservations (customer_name, customer_email, customer_phone, reservation_date, reservation_time, service_name, note, status, confirmation_sent, reminder_sent)
VALUES
  ('田中 花子', 'hanako@example.com', '090-1234-5678', CURRENT_DATE, '10:00', 'カット＆カラー', '初回来店', 'confirmed', true, false),
  ('鈴木 美咲', 'misaki@example.com', '080-9876-5432', CURRENT_DATE, '13:00', 'カット', NULL, 'pending', false, false),
  ('山田 太郎', 'taro@example.com', '070-1111-2222', CURRENT_DATE, '15:30', 'ヘッドスパ', 'アレルギーあり（要確認）', 'pending', false, false),
  ('佐藤 あゆみ', 'ayumi@example.com', '090-3333-4444', CURRENT_DATE + 1, '11:00', 'カット＆トリートメント', NULL, 'confirmed', true, true),
  ('伊藤 さくら', 'sakura@example.com', '080-5555-6666', CURRENT_DATE + 1, '14:00', 'カラーリング', '明るめご希望', 'pending', false, false),
  ('中村 健一', 'kenichi@example.com', '090-7777-8888', CURRENT_DATE - 1, '10:30', 'カット', NULL, 'completed', true, true),
  ('小林 奈々', 'nana@example.com', '070-9999-0000', CURRENT_DATE - 1, '16:00', 'パーマ', NULL, 'canceled', false, false);
