# SaaS型 Webアプリケーション Mock

Next.js と FastAPI を組み合わせた、モダンなAIチャットアプリケーションです。
OpenAI API (GPT-4o mini) を利用し、ストリーミング応答、会話履歴管理、レスポンシブデザインをサポートしています。

## 機能

- 💬 **リアルタイムチャット**: OpenAI API によるストリーミング応答
- 📝 **会話履歴**: ローカルストレージを使用した履歴管理とサイドバー表示
- 🌙 **ダークモード**: システム設定に連動（Tailwind CSS）
- 📂 **エクスポート**: 会話ログを Markdown / JSON 形式でダウンロード
- 📱 **レスポンシブ**: モバイル対応の UI
- ⚡ **高速**: Next.js App Router と FastAPI の非同期処理

## プロジェクト構成

- `frontend/`: Next.js (TypeScript) アプリケーション
- `backend/`: FastAPI (Python) アプリケーション

## セットアップ手順

### 前提条件

- Node.js 20+
- Python 3.11+
- OpenAI API Key

### 1. 環境変数の設定

ルートディレクトリに `.env` ファイルを作成し、OpenAI APIキーを設定してください。

```bash
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx
```

### 2. バックエンド (Backend)

```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
バックエンドは `http://localhost:8000` で起動します。

### 3. フロントエンド (Frontend)

別のターミナルを開いて実行してください。

```bash
cd frontend
npm ci
npm run dev
```
フロントエンドは `http://localhost:3000` で起動します。

## 開発

### テスト / CI

GitHub Actions が設定されており、Push 時に Lint と Build チェックが自動実行されます。

- フロントエンド: `npm run lint` / `npm run build`
- バックエンド: `flake8`
