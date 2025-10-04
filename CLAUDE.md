# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

京都検定（京都・観光文化検定試験）の過去問題を活用した4択クイズアプリ。
友人5人程度で学習・練習できる環境を提供することを目的とする。

### 主な機能
- 難易度選択（2級/3級）
- 出題数選択（10問/100問）
- 4択クイズ形式
- 即時フィードバック（正解/不正解+解説）
- カテゴリ別正答率の表示
- 過去の成績閲覧
- LocalStorageによるデータ保存

## 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite
- **アーキテクチャ**: Clean Architecture
- **テスト**: Jest (予定)
- **データ形式**: JSON
- **データ保存**: LocalStorage
- **ホスティング**: 静的ホスティング（GitHub Pages / Netlify / Cloudflare Pages）

## リポジトリ構造

```
KyotoKentei/
├── contents/過去問題/     # 過去問題PDF（Gitから除外）
├── docs/                  # ドキュメント
│   ├── requirements.md    # 要件定義書
│   ├── design.md         # 設計書（Clean Architecture）
│   └── mockups/          # UIモックアップ
├── public/
│   └── data/
│       └── questions.json # 問題データベース
├── src/                   # ソースコード
│   ├── components/
│   │   └── screens/      # 画面コンポーネント（プロトタイプ）
│   ├── styles/           # スタイルシート
│   ├── App.tsx           # メインアプリ
│   └── main.tsx          # エントリーポイント
├── package.json
├── vite.config.ts
└── tsconfig.json
```

**注**: 現在の`src/`ディレクトリはUIの方向性を決めるためのシンプルなプロトタイプです。
本実装では`docs/design.md`に従ったClean Architectureの構造に再構築します。

## 開発コマンド

### 初回セットアップ
```bash
npm install
```

### 開発サーバー起動
```bash
npm run dev
# http://localhost:3000 で起動
```

### ビルド
```bash
npm run build
```

### プレビュー
```bash
npm run preview
```

## 開発ルール

### Git コミットメッセージ
- **コミットメッセージは日本語で記述すること**
- 簡潔で分かりやすい説明を心がける
- 主要な変更内容を箇条書きで記載

### コーディング規約
- 京都の文化に関する日本語コンテンツを扱うプロジェクトであることを考慮
- UI/UXは日本語ユーザー向けに最適化

### アーキテクチャと開発方針
- **アーキテクチャはClean Architectureに従うこと**
  - 依存性のルールを守り、ビジネスロジックをフレームワークから独立させる
  - 詳細は `docs/design.md` を参照
- **Uncle Bobに怒られないように、Clean Codeを心がけること**
  - 意図を明確にする命名
  - 小さく単一責任の関数
  - 過剰なコメントではなく、自己説明的なコード
- **Takuto Wadaに怒られないように、実装はTDDで進めること**
  - Red → Green → Refactor サイクルを守る
  - テストファーストで実装
  - テストカバレッジ80%以上を目標

## 重要なドキュメント

### 要件定義
- `docs/requirements.md` - プロジェクトの全体要件、機能要件、データスキーマ

### 設計
- `docs/design.md` - Clean Architectureに基づいた詳細設計
  - ドメインモデル設計
  - ユースケース設計
  - レイヤー分離
  - TDD戦略

### UI/UX
- `docs/mockups/README.md` - 全画面のモックアップ（ASCIIアート）
  - ホーム、難易度選択、出題数選択
  - クイズ、フィードバック、結果
  - 過去の成績

## 開発の進め方

### 現在の状態（Phase 0: プロトタイプ）
- ✅ 要件定義完了
- ✅ 設計書完成
- ✅ UIモックアップ完成
- ✅ Reactプロトタイプ完成（画面遷移確認用）

### 次のフェーズ（Phase 1: ドメイン層）
1. Value Objectの実装（TDD）
   - Level, Category, Accuracy など
2. Entityの実装（TDD）
   - Question, Quiz, QuizResult など
3. Domain Serviceの実装（TDD）
   - QuizScoringService

### Phase 2以降
- Application層（Use Cases）の実装
- Infrastructure層（Repository）の実装
- UI層の再実装（Clean Architectureに基づく）

詳細は`docs/design.md`の「開発フロー」セクションを参照。

## データスキーマ

### questions.json
```json
{
  "questions": [
    {
      "id": "q001",
      "level": "3級",
      "category": "歴史",
      "exam-year": "2004/12/12",
      "question": "問題文",
      "options": ["選択肢1", "選択肢2", "選択肢3", "選択肢4"],
      "correctAnswer": 0,
      "explanation": "解説文"
    }
  ]
}
```

### カテゴリ一覧
歴史、史跡、神社、寺院、建築、庭園、美術、伝統工芸、伝統文化、花街、祭と行事、京料理、京菓子、ならわし、ことばと伝説、地名、自然、観光学 等

## デザインガイドライン

### カラーパレット
- **プライマリー**: 朱色 #D32F2F、金色 #FFB300（京都らしい色）
- **背景**: 白 #FFFFFF、薄いグレー #F5F5F5
- **テキスト**: ダークグレー #212121、ミディアムグレー #757575
- **正解**: グリーン #4CAF50
- **不正解**: レッド #F44336

### レスポンシブ対応
- モバイルファースト
- 最小幅: 375px
- ボタンの最小タップサイズ: 44px × 44px

## トラブルシューティング

### 開発サーバーが起動しない
```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### ビルドエラー
- TypeScriptのエラーは厳格にチェックされます
- `tsconfig.json`の設定を確認してください

## 参考資料

- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Code 原則](https://www.oreilly.co.jp/books/9784048930291/)
- [TDD By Example (t_wada)](https://www.shoeisha.co.jp/book/detail/9784798124582)
