# SmartHR UI MCP Server

SmartHR UIコンポーネント用のModel Context Protocol (MCP) サーバーです。AIツールやClaude CodeがSmartHR UIコンポーネントの情報とコード生成機能に直接アクセスできるようになります。

## 機能

- **コンポーネント発見**: SmartHR UIの全コンポーネントを自動的に発見・一覧表示
- **コンポーネント検索**: 名前、カテゴリ、説明によるコンポーネント検索
- **コード生成**: 指定されたpropsでコンポーネントの使用コードを生成
- **カテゴリフィルタリング**: カテゴリ別（Button、Form、Layoutなど）でのコンポーネント閲覧

## インストール

```bash
# 依存パッケージをインストール
pnpm install or npm install

# サーバーをビルド
pnpm build or npm run build

# MCPサーバーを起動
pnpm start or npm run start
```

## 使用方法

### MCPサーバーとして

MCPクライアントでこのサーバーを使用するように設定してください：

### Cursor

```json
{
  "mcpServers": {
    "smarthr-ui-mcp": {
      "command": "node",
      "args": ["/Users/username/smarthr-ui-mcp/lib/index.js"],
      "cwd": "/Users/username/smarthr-ui-mcp"
    }
  }
}
```

### Claude Code

```
claude mcp add smarthr-ui-mcp -s local -- node /Users/{username}/works/smarthr-ui-mcp-server/lib/index.js
```

※`{username}`を実際のMCPサーバーのパスに置き換えてください。

### Codex

### 開発

```bash
# 開発サーバーを起動
pnpm dev

# サーバーをビルド
pnpm build

# テストを実行
pnpm test
```

## MCPリソース

- `smarthr-ui://components` - SmartHR UIの全コンポーネント一覧
- `smarthr-ui://components/{name}` - 特定のコンポーネントの詳細情報

## MCPツール

### `search_components`

名前、カテゴリ、説明によるコンポーネント検索

### `get_component`

特定のコンポーネントの詳細情報を取得

### `list_components_by_category`

特定のカテゴリの全コンポーネントを一覧表示

### `generate_component_code`

指定されたpropsでコンポーネントの使用コードを生成

## コンポーネントカテゴリ

- **Button**: ボタンコンポーネントと関連するアクション
- **Form**: フォームコントロールとバリデーション
- **Layout**: レイアウトとスペーシングコンポーネント
- **Navigation**: ナビゲーションとルーティングコンポーネント
- **Display**: テキスト、バッジ、コンテンツ表示
- **Feedback**: 通知、ツールチップ、ユーザーフィードバック
- **Dialog**: モーダルとダイアログコンポーネント
- **Table**: データテーブルコンポーネント
- **Input**: 入力フィールドとフォーム要素
- **Experimental**: ベータ版と実験的コンポーネント

## アーキテクチャ

```
src/
├── index.ts              # MCPサーバーのエントリーポイント
├── handlers/
│   └── components.ts     # コンポーネント関連のハンドラー
├── types/
│   └── index.ts         # TypeScript型定義
└── utils/
    └── componentDiscovery.ts  # コンポーネント発見ロジック
```

## ライセンス

MIT
