# 京都検定クイズアプリ

京都検定（京都・観光文化検定試験）の過去問題を活用した4択クイズアプリ。
友人5人程度で学習・練習できる環境を提供します。

## 🎯 主な機能

- **難易度選択**: 2級 / 3級から選択
- **出題数選択**: 10問 / 100問から選択
- **4択クイズ形式**: ランダム出題
- **即時フィードバック**: 正解/不正解 + 解説表示
- **結果分析**: カテゴリ別正答率、苦手分野の提示
- **学習履歴**: LocalStorageで過去の成績を保存

## 🛠 技術スタック

- **フロントエンド**: React 18 + TypeScript
- **ビルドツール**: Vite
- **テストフレームワーク**: Vitest
- **アーキテクチャ**: Clean Architecture
- **データ形式**: JSON（静的ファイル）
- **データ保存**: LocalStorage
- **デプロイ**: GitHub Pages（自動デプロイ）

## 📁 ディレクトリ構成

```
KyotoKentei/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions デプロイ設定
├── docs/                       # ドキュメント
│   ├── requirements.md         # 要件定義書
│   ├── design.md              # 設計書（Clean Architecture）
│   └── mockups/               # UIモックアップ
├── public/
│   └── data/
│       └── questions.json     # 問題データベース（200問）
├── src/
│   ├── domain/                # ドメイン層（Enterprise Business Rules）
│   │   ├── entities/          # エンティティ
│   │   ├── valueObjects/      # 値オブジェクト
│   │   ├── repositories/      # リポジトリインターフェース
│   │   └── services/          # ドメインサービス
│   ├── application/           # アプリケーション層（Use Cases）
│   │   ├── usecases/          # ユースケース
│   │   └── dto/               # データ転送オブジェクト
│   ├── adapters/              # アダプター層（Interface Adapters）
│   │   ├── controllers/       # コントローラ
│   │   ├── presenters/        # プレゼンター
│   │   └── viewModels/        # ビューモデル
│   ├── infrastructure/        # インフラストラクチャ層
│   │   ├── repositories/      # リポジトリ実装
│   │   └── ui/                # UI コンポーネント
│   └── shared/                # 共通ユーティリティ
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🚀 セットアップ

### 前提条件

- Node.js 20以上
- npm

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/dyundyun2910/KyotoKentei.git
cd KyotoKentei

# 依存関係をインストール
npm install
```

## 💻 開発コマンド

```bash
# 開発サーバー起動
npm run dev
# → http://localhost:3000 で起動

# ビルド
npm run build

# プレビュー（ビルド後の確認）
npm run preview

# テスト実行
npm test

# テスト（watchモード）
npm run test:watch

# カバレッジ付きテスト
npm run test:coverage
```

## 🧪 テスト

### テストケース一覧

本プロジェクトはTDD（Test-Driven Development）で開発されています。

#### Domain Layer（ドメイン層）

**Value Objects:**
- `src/domain/valueObjects/Level.test.ts` - 難易度（2級/3級）
- `src/domain/valueObjects/Category.test.ts` - カテゴリ
- `src/domain/valueObjects/Accuracy.test.ts` - 正答率
- `src/domain/valueObjects/QuestionId.test.ts` - 問題ID
- `src/domain/valueObjects/QuizId.test.ts` - クイズID

**Entities:**
- `src/domain/entities/Question.test.ts` - 問題エンティティ
- `src/domain/entities/Quiz.test.ts` - クイズエンティティ
- `src/domain/entities/CategoryStatistics.test.ts` - カテゴリ統計
- `src/domain/entities/QuizResult.test.ts` - クイズ結果

**Services:**
- `src/domain/services/QuizScoringService.test.ts` - スコアリングサービス

#### Application Layer（アプリケーション層）

**Use Cases:**
- `src/application/usecases/StartQuizUseCase.test.ts` - クイズ開始
- `src/application/usecases/AnswerQuestionUseCase.test.ts` - 回答処理
- `src/application/usecases/CalculateResultUseCase.test.ts` - 結果計算

### テスト実行方法

```bash
# 全テスト実行
npm test

# 特定レイヤーのみ実行
npm test -- src/domain
npm test -- src/application

# 特定ファイルのみ実行
npm test -- Level.test.ts

# カバレッジレポート生成
npm run test:coverage
# → coverage/index.html でレポート確認
```

### テストカバレッジ目標

- **全体**: 80%以上
- **Domain層**: 90%以上（ビジネスロジックの中核）
- **Application層**: 85%以上

## 📐 アーキテクチャ

本プロジェクトは**Clean Architecture**に準拠しています。

### レイヤー構成

```
┌─────────────────────────────────────────┐
│     Infrastructure Layer               │  ← フレームワーク、外部I/O
│  ┌───────────────────────────────────┐ │
│  │    Interface Adapters Layer      │ │  ← コントローラ、プレゼンター
│  │  ┌─────────────────────────────┐ │ │
│  │  │   Application Layer         │ │ │  ← ユースケース
│  │  │  ┌───────────────────────┐  │ │ │
│  │  │  │   Domain Layer        │  │ │ │  ← エンティティ、ビジネスルール
│  │  │  └───────────────────────┘  │ │ │
│  │  └─────────────────────────────┘ │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### 依存性のルール

- 依存関係は常に**外側から内側**へ
- 内側の層は外側の層について何も知らない
- ビジネスルールはフレームワークから独立

詳細は [`docs/design.md`](./docs/design.md) を参照してください。

## 📝 コーディング規約

### Clean Code プラクティス

- **意図を明確にする命名**: 変数名、関数名で意図を表現
- **Small Functions**: 1関数1責務、20行以内が理想
- **DRY原則**: 重複を避ける
- **Self-Documenting Code**: コメントよりコードで説明

### TDD（Test-Driven Development）

開発は以下のサイクルで進めます：

1. **Red**: 失敗するテストを書く
2. **Green**: テストが通る最小限のコードを書く
3. **Refactor**: コードをクリーンにする

## 🌐 デプロイ

### GitHub Pages（自動デプロイ）

masterブランチへのpushで自動的にデプロイされます。

**デプロイURL**: https://dyundyun2910.github.io/KyotoKentei/

### デプロイフロー

1. コードをmasterブランチにpush
2. GitHub Actionsが自動的にビルド
3. `dist/` フォルダをGitHub Pagesにデプロイ
4. 数分後にURLで確認可能

デプロイ状況は [Actions](https://github.com/dyundyun2910/KyotoKentei/actions) タブで確認できます。

## 📊 データスキーマ

### questions.json

```json
{
  "questions": [
    {
      "id": "q001",
      "level": "3級",
      "category": "歴史",
      "exam-year": "2004/12/12",
      "question": "延暦13年(794)、桓武天皇は( )から、平安京に新しい都を遷した。",
      "options": [
        "長岡京",
        "平城京",
        "難波京",
        "藤原京"
      ],
      "correctAnswer": 0,
      "explanation": "桓武天皇は**長岡京**から新しい都の平安京に遷都しました..."
    }
  ]
}
```

### カテゴリ一覧

歴史、史跡、神社、寺院、建築、庭園、美術、伝統工芸、伝統文化、花街、祭と行事、京料理、京菓子、ならわし、ことばと伝説、地名、自然、観光学 等

## 🎨 UI/UXデザイン

### カラーパレット

- **プライマリー**: 朱色 `#D32F2F`、金色 `#FFB300`（京都らしい色）
- **背景**: 白 `#FFFFFF`、薄いグレー `#F5F5F5`
- **テキスト**: ダークグレー `#212121`、ミディアムグレー `#757575`
- **正解**: グリーン `#4CAF50`
- **不正解**: レッド `#F44336`

### レスポンシブ対応

- モバイルファースト
- 最小幅: 375px
- ボタンの最小タップサイズ: 44px × 44px

詳細なモックアップは [`docs/mockups/README.md`](./docs/mockups/README.md) を参照してください。

## 📚 ドキュメント

- [要件定義書](./docs/requirements.md) - 機能要件、非機能要件、データ構造
- [設計書](./docs/design.md) - Clean Architecture詳細設計、TDD戦略
- [UIモックアップ](./docs/mockups/README.md) - 全画面のASCIIモックアップ

## 🔧 トラブルシューティング

### 開発サーバーが起動しない

```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install
```

### ビルドエラー

- TypeScriptのエラーは厳格にチェックされます
- `tsconfig.json`の設定を確認してください

### テストが失敗する

```bash
# キャッシュをクリア
npm test -- --clearCache

# 依存関係を再インストール
npm ci
```

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Requestを作成

### コミットメッセージ

- **日本語で記述**すること
- 簡潔で分かりやすい説明を心がける
- 主要な変更内容を箇条書きで記載

## 📄 ライセンス

This project is licensed under the MIT License.

## 🙏 参考資料

- [Clean Architecture (Uncle Bob)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Clean Code 原則](https://www.oreilly.co.jp/books/9784048930291/)
- [TDD By Example](https://www.shoeisha.co.jp/book/detail/9784798124582)

## 👤 Author

**dyundyun2910**

- GitHub: [@dyundyun2910](https://github.com/dyundyun2910)

---

**🤖 Generated with [Claude Code](https://claude.com/claude-code)**
