---
paths: src/api/**
---

# APIルール
src/api配下のファイル編集時に読み込まれる

## ルール
- RESTful原則に従う
- エラーレスポンスは統一フォーマット
- 認証が必要なエンドポイントはmiddlewareで保護

