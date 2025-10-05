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
- **アーキテクチャ**: Clean Architecture（4層構造）
- **テストフレームワーク**: Vitest
- **状態管理**: DI Container（Dependency Injection）
- **データ形式**: JSON（静的ファイル）
- **データ保存**: LocalStorage
- **デプロイ**: GitHub Pages（GitHub Actions自動デプロイ）
- **URL**: https://dyundyun2910.github.io/KyotoKentei/

## リポジトリ構造

```
KyotoKentei/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions デプロイ設定
├── contents/過去問題/           # 過去問題PDF（Gitから除外）
├── docs/                        # ドキュメント
│   ├── requirements.md          # 要件定義書
│   ├── design.md               # 設計書（Clean Architecture）
│   └── mockups/                # UIモックアップ
├── public/
│   └── data/
│       └── questions.json      # 問題データベース（200問）
├── src/                         # Clean Architecture実装
│   ├── domain/                 # ドメイン層
│   │   ├── entities/           # エンティティ（Question, Quiz, QuizResult等）
│   │   ├── valueObjects/       # 値オブジェクト（Level, Category, Accuracy等）
│   │   ├── repositories/       # リポジトリインターフェース
│   │   └── services/           # ドメインサービス
│   ├── application/            # アプリケーション層
│   │   ├── usecases/           # ユースケース
│   │   └── dto/                # データ転送オブジェクト
│   ├── infrastructure/         # インフラストラクチャ層
│   │   └── repositories/       # リポジトリ実装
│   ├── presentation/           # プレゼンテーション層
│   │   ├── controllers/        # コントローラ
│   │   └── viewModels/         # ビューモデル
│   ├── di/                     # 依存性注入
│   │   └── Container.ts        # DIコンテナ
│   ├── components/             # UIコンポーネント
│   │   └── screens/            # 画面コンポーネント
│   ├── styles/                 # スタイルシート
│   ├── App.tsx                 # メインアプリ
│   └── main.tsx                # エントリーポイント
├── README.md                    # プロジェクトドキュメント
├── package.json
├── vite.config.ts
└── tsconfig.json
```

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

### テスト実行
```bash
# 全テスト実行
npm test

# watchモード
npm run test:watch

# カバレッジ付き
npm run test:coverage

# 特定レイヤーのみ
npm test -- src/domain
npm test -- src/application
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

### Git設定
```bash
# リポジトリ固有のユーザー設定
git config user.name "dyundyun2910"
git config user.email "dyundyun2910@gmail.com"
```

### Git コミットメッセージ
- **コミットメッセージは日本語で記述すること**
- 簡潔で分かりやすい説明を心がける
- 主要な変更内容を箇条書きで記載
- フッターに以下を含める：
  ```
  🤖 Generated with [Claude Code](https://claude.com/claude-code)

  Co-Authored-By: Claude <noreply@anthropic.com>
  ```

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

### 現在の状態（実装完了）

**✅ Phase 0: ドキュメント**
- 要件定義完了（`docs/requirements.md`）
- 設計書完成（`docs/design.md`）
- UIモックアップ完成（`docs/mockups/README.md`）

**✅ Phase 1: Domain層（TDD実装完了）**
- Value Objects: Level, Category, Accuracy, QuestionId, QuizId
- Entities: Question, Quiz, QuizResult, CategoryStatistics
- Domain Services: QuizScoringService
- Repository Interfaces

**✅ Phase 2: Application層（TDD実装完了）**
- Use Cases: StartQuizUseCase, AnswerQuestionUseCase, CalculateResultUseCase
- DTOs: Request/Response オブジェクト

**✅ Phase 3: Infrastructure層（実装完了）**
- JsonQuestionRepository: questions.json読み込み
- LocalStorageQuizHistoryRepository: 履歴保存

**✅ Phase 4: Presentation層（実装完了）**
- QuizController: ユースケースのオーケストレーション
- ViewModels: UI表示用データ変換

**✅ Phase 5: UI層（実装完了）**
- 画面コンポーネント（8画面）
- DI Container
- スタイリング

**✅ Phase 6: デプロイ**
- GitHub Actions自動デプロイ設定
- 本番環境公開: https://dyundyun2910.github.io/KyotoKentei/

### テストカバレッジ
- Domain層: 18テストファイル
- Application層: 3テストファイル
- 合計21テストファイル（継続的に追加中）

詳細は`docs/design.md`の「開発フロー」セクションおよび`README.md`を参照。

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
歴史、史跡、神社、寺院、建築、庭園、美術、伝統工芸、伝統文化、花街、祭と行事、京料理、京菓子、ならわし、ことばと伝説、地名、自然、観光学

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
- 未使用のimport/変数は削除してください
- `tsconfig.json`の設定を確認してください
- GitHub Actionsでビルドエラーが出る場合はローカルで`npm run build`を実行して確認

### テストが失敗する
```bash
# キャッシュをクリア
npm test -- --clearCache

# 依存関係を再インストール
npm ci
```

### デプロイが失敗する
- GitHub リポジトリの Settings → Pages → Source が "GitHub Actions" に設定されているか確認
- Actions タブでビルドログを確認
- vite.config.ts の base 設定が正しいか確認（`base: '/KyotoKentei/'`）

## 参考資料

- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Code 原則](https://www.oreilly.co.jp/books/9784048930291/)
- [TDD By Example (t_wada)](https://www.shoeisha.co.jp/book/detail/9784798124582)
