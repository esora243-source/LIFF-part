# Hugmeid — 医学生向け LINE LIFF アプリ

**プロジェクト**: Hugmeid  
**組織**: 株式会社クロスメディスン  
**バージョン**: v1.0.0 (Phase 1 Beta)  
**対象ユーザー**: 浜松医科大学医学部生（Phase 1）→ 全国医学部生（Phase 2〜）  
**技術スタック（本番想定）**: Next.js 14 + TypeScript + LINE LIFF + Supabase + Vercel

---

## 🎯 プロジェクト概要

医学生のための**キャリア・学習・つながりプラットフォーム**。LINE LIFF を使ったモバイルファーストのシングルページアプリケーション（SPA）として構築。

### 主要機能
- 🔐 LINE LIFF 認証 + ユーザープロフィール登録
- 💼 医学生向け求人一覧・詳細・ブックマーク
- 🎓 学校生活・勉強記事（CBT・国試対策）
- 🌟 課外活動・留学・学生団体情報
- 🤝 つながり・FAQ・お問い合わせ
<<<<<<< HEAD
- 👤 **マイページ（Webアプリ）**・プロフィール編集
>>>>>>> c25eb19 (feat: マイページをWebアプリ化し、Supabase統合)

---

## 🗂️ ファイル構成

```
/
├── index.html              ← メインエントリーポイント (SPA)
├── mypage.html             ← **マイページWebアプリ** (Supabase Auth)
├── css/
│   └── style.css           ← アプリ全体のスタイル (CSS Variables ベース)
├── js/
│   └── app.js              ← アプリロジック (Router / PageControllers / API)
├── docs/
│   ├── requirements.md     ← 要件定義書 v1.2（解析済みインデックス）
│   ├── screens.md          ← 画面遷移_Node（解析済みインデックス）
│   ├── auth.md             ← 認証設計書（解析済みインデックス）
│   └── techstack.md        ← 技術スタック・アーキテクチャ設計書（解析済みインデックス）
└── README.md               ← このファイル
```

---

<<<<<<< HEAD
## 📱 画面一覧 / URIマッピング
=======
## � 最新変更 (2024-04-XX)

### マイページのWebアプリ化
- **変更内容**: マイページをLIFF内から独立したWebアプリに変更
- **実装**: 
  - 新規ファイル `mypage.html` を作成 (Supabase Auth + REST API)
  - LIFFアプリのマイページナビゲーションを `mypage.html` への外部リンクに変更
  - Supabase SDKを追加し、LINE UIDベースの認証を実装
- **理由**: リッチメニューからLIFFを起動し、マイページをLINE外のWebアプリとして提供するため
- **注意**: Supabase URL/キーを実際のプロジェクトに置き換えが必要です

---
>>>>>>> c25eb19 (feat: マイページをWebアプリ化し、Supabase統合)

| 画面名 | ページID | 説明 |
|--------|----------|------|
| ログイン | `login` | LINE LIFFログイン / デモモック対応 |
| ユーザー登録 | `register` | 2ステップ登録フォーム（性別・学年・大学・部活・希望診療科） |
| ホーム | `home` | ヒーローバナー + 6タイルメニュー + 新着求人/記事 |
| 求人一覧 | `jobs` | 検索・カテゴリフィルタ付き求人リスト |
| 求人詳細 | `job-detail` | 求人詳細 + ブックマーク + 応募リンク |
| 学校生活 | `school` | 学習ツール (時間割/CBT/国試) + 勉強記事 |
| 課外活動 | `extracurricular` | 活動レポート記事 + 学生団体一覧 |
| つながり | `connections` | FAQ アコーディオン + お問い合わせフォーム |
| マイページ | `mypage` | プロフィール表示・編集 + ブックマーク数 |
| ブックマーク | `bookmarks` | ブックマーク済み求人一覧 |
| 記事詳細 | `article-detail` | 記事タイトル・カテゴリ・本文 |

---

## 🗄️ データモデル (Table API)

### `users` テーブル
| フィールド | 型 | 説明 |
|---|---|---|
| id | text (UUID) | 主キー |
| line_uid | text | LINE UID（ユニーク識別子） |
| name | text | 表示名 |
| gender | text | 性別 (male/female/other) |
| grade | number | 学年 (1〜6) |
| university | text | 大学名 |
| club | text | 部活・サークル |
| desired_dept | text | 希望診療科 |
| avatar_url | text | プロフィール画像URL |

### `jobs` テーブル
| フィールド | 型 | 説明 |
|---|---|---|
| id | text (UUID) | 主キー |
| title | text | 求人タイトル |
| category | text | 家庭教師/オンライン家庭教師/塾講師/ITインターン/飲食・医療事務/その他 |
| location_type | text | オフライン/オンライン/ハイブリッド |
| company_name | text | 企業・団体名 |
| description | rich_text | 業務内容・説明 |
| salary | text | 給与・時給 |
| apply_url | text | 応募先URL |
| is_published | bool | 公開フラグ |
| tags | array | タグ一覧 |

### `bookmarks` テーブル
| フィールド | 型 | 説明 |
|---|---|---|
| id | text (UUID) | 主キー |
| user_id | text | users.id (FK) |
| job_id | text | jobs.id (FK) |

### `articles` テーブル
| フィールド | 型 | 説明 |
|---|---|---|
| id | text (UUID) | 主キー |
| title | text | 記事タイトル |
| category | text | 勉強/起業/研究/臨床/留学/その他 |
| section | text | school / extracurricular |
| thumbnail_url | text | サムネイル画像URL |
| content | rich_text | 本文（Markdown） |
| is_published | bool | 公開フラグ |

### `organizations` テーブル
| フィールド | 型 | 説明 |
|---|---|---|
| id | text (UUID) | 主キー |
| name | text | 団体名 |
| description | rich_text | 活動紹介 |
| contact | text | 連絡先 |
| sns_url | text | SNSリンク |
| logo_url | text | ロゴ画像URL |
| is_published | bool | 公開フラグ |

---

## ✅ 実装済み機能 (Phase 1 初期版)

### 認証・ユーザー管理
- [x] LINE LIFF 認証フロー（開発モックあり）
- [x] 2ステップ ユーザー登録フォーム
- [x] LINE UID と DB ユーザーの紐づけ
- [x] LocalStorage によるセッション保持
- [x] プロフィール編集（モーダル）
- [x] ログアウト

### 求人機能
- [x] 求人一覧（カード表示）
- [x] カテゴリフィルタリング（7カテゴリ）
- [x] テキスト検索（タイトル・会社名・カテゴリ）
- [x] 求人詳細ページ
- [x] ブックマーク追加・解除（要ログイン）
- [x] 応募ページリンク

### コンテンツ
- [x] 学校生活記事一覧（セクション: school）
- [x] 課外活動記事一覧（セクション: extracurricular）
- [x] 記事詳細ページ
- [x] 学生団体一覧（モーダル詳細）

### UI/UX
- [x] モバイルファースト SPA（ボトムナビ）
- [x] LINE グリーンテーマ（CSS Variables）
- [x] 6タイルメニュー（ホーム）
- [x] ローディングスピナー
- [x] トースト通知
- [x] FAQ アコーディオン
- [x] お問い合わせフォーム（フロントのみ）

### データ
- [x] Table API 連携（5テーブル）
- [x] サンプルデータ投入（求人6件・記事5件・団体4件）

---

## ❌ 未実装機能（今後の開発対象）

### Phase 1 残項目
- [ ] **LINE Narrowcast（セグメント別プッシュ通知）** — 学年別通知セグメント管理
- [ ] **時間割 OCR 機能** — Google Cloud Vision API 連携
- [ ] **リッチメニュー管理** — LINE Messaging API 経由での切り替え
- [ ] **管理者向け Supabase Studio 接続** — 本番CMS
- [ ] **Supabase Storage 設定** — 記事サムネイル・ロゴ画像管理
- [ ] **お問い合わせ送信バックエンド** — Webhook / メール送信

### Phase 2 予定機能
- [ ] **全国展開** — 複数大学対応・大学別コンテンツ
- [ ] **CBT・国試対策** — 一問一答システム
- [ ] **研修病院紹介** — 病院検索・マニュアル
- [ ] **OBマッチング** — 先輩医師との繋がり機能
- [ ] **医学生コミュニティ** — 掲示板・交流機能
- [ ] **過去問データベース** — 1〜5年生向け
- [ ] **SEO対応** — Next.js SSR + OGP + 構造化データ
- [ ] **Google 流入設計** — コンテンツ公開 + LINE CTA

### Phase 3 予定機能
- [ ] **ネイティブアプリ化** — React Native / Flutter 移行検討
- [ ] **大学ダッシュボード連携** — 課題リマインダー API
- [ ] **マネタイズ** — プレミアム機能、求人掲載課金

---

## 🚀 本番実装に向けた次の開発ステップ

### 優先度: 高（Phase 1 完成に向けて）

1. **LINE LIFF 本番設定**
   ```
   1. LINE Developers Console で LIFF アプリ作成
   2. LIFF ID を app.js の APP_CONFIG.liffId に設定
   3. APP_CONFIG.isDev を false に変更
   4. index.html の LIFF SDK スクリプトタグをコメントイン
   ```

2. **Supabase 本番連携**
   ```
   - 現在: Table API (静的サイト用モック)
   - 本番: Next.js + Supabase JS SDK
   - RLS (Row Level Security) 設定
   - users テーブルの line_uid に UNIQUE 制約
   - bookmarks テーブルに (user_id, job_id) UNIQUE 制約
   ```

3. **Vercel デプロイ**
   ```
   - Production: hugmeid.vercel.app (main ブランチ)
<<<<<<< HEAD
   - Development: hugmeid-dev.vercel.app (develop ブランチ)
=======
   - Development: hugmeid-dev.vercel.app (main ブランチ)
>>>>>>> c25eb19 (feat: マイページをWebアプリ化し、Supabase統合)
   - 環境変数: NEXT_PUBLIC_LIFF_ID, SUPABASE_URL, SUPABASE_ANON_KEY
   ```

4. **CMS 設定（Phase 1 は Supabase Studio 直接管理）**
   ```
   - 求人データ: Shimizu + Hakuno が Supabase Studio で管理
   - 記事: Markdown 形式で Hakuno + コンテンツチームが管理
   - 時間割データ: OCR後手動修正、Hakuno + Yoshimuda
   ```

### 優先度: 中

5. **LINE 公式アカウント・リッチメニュー設定**
   - 6スロットリッチメニュー作成（求人/学校/課外活動/つながり/マイページ）
   - Messaging API Webhook 設定（follow/unfollow イベント）

6. **プッシュ通知（Narrowcast）**
   - LINE タグ設定（grade: 1〜6）
   - ユーザー登録時に自動タグ付け
   - セグメント別配信ロジック（Vercel Edge Functions）

7. **Next.js 移行**
   - App Router 対応
   - Server Components（求人・記事ページ = SSR/ISR）
   - Client Components（LIFF画面 = 登録・マイページ）

---

## 🔧 開発環境 / デモモード

現在の実装は**デモモード**で動作します：

- **モックLIFF**: 実際の LINE 認証なしでデモ動作
- **Table API**: Genspark 提供の RESTful API でデータ保存
- **サンプルデータ**: 求人6件・記事5件・団体4件を投入済み

### デモの操作方法
1. ページ右上の「LINEでログイン」ボタンを押す
2. モックユーザー（医学 太郎 / 浜松医科大学3年）でログイン
3. プロフィール登録 → ホーム画面へ
4. 各機能を操作

---

## 👥 開発チーム（設計書より）

| 役割 | 担当者 | 担当領域 |
|------|--------|---------|
| PM / フロントエンド補佐 | Hakuno | 要件定義・コンテンツ管理 |
| フロントエンド / バックエンド | Fushimi | Next.js・Supabase・LIFF |
| バックエンド | Yoshimuda | API・DB・インフラ |
| 営業 / 事業開発 | Shimizu | 求人獲得・大学連携 |

---

## 📋 フェーズ計画

| フェーズ | 期間 | 目標 |
|----------|------|------|
| **Phase 1** | 〜2ヶ月 | 浜松医科大学限定 MVP・PMF検証 |
| **Phase 2** | 3〜6ヶ月 | 全国展開・マネタイズ・機能拡充 |
| **Phase 3** | 6ヶ月〜 | プラットフォーム確立・ネイティブアプリ化 |

---

## 📚 関連ドキュメント

- [要件定義書 v1.2](docs/requirements.md)
- [画面遷移_Node](docs/screens.md)
- [認証設計書 — LINE LIFF/Supabase](docs/auth.md)
- [技術スタック・アーキテクチャ設計書](docs/techstack.md)
