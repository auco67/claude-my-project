# claude-my-project

Udemy講座「CLAUDE .md・rules・カスタムコマンド・サブエージェント・Skills・Hooksの違いと使い分けを完全マスター！コンテキスト節約しながら開発効率を最大化する実践講座」を元に検証した内容が含まれます。

## CLAUDE.md
Claude Codeが起動時に自動で読み込まれるファイル

- Claude Codeが理解した状態で作業を開始することができる
- CLAUDE.mdは指示であり絶対行われるものではない

### 役割に対する設置場所

```
claude-my-project
├─ CLAUDE.md         # セッション開始時に読み込まれる
├─ CLAUDE.local.md   # セッション開始時に読み込まれる
└─ .claude/rules
    ├─ code-style.md # セッション開始時に読み込まれる
    ├─ testing.md
    ├─ frontend
    |   ├─react.md
    |   └─style.md
    └─ backend
        └─api.md
```

### CLAUDE.md

プロジェクト固有設定（開発で統一したい、命名規約、コーディング規約など）を記述する

### CLAUDE.local.md

ローカル環境で使用するものを設定（チームに共有したくないもの）を記述する

### claude-my-project/.claude/rules

プロジェクト内での特定のルールを記述する


## カスタムコマンド

定型フレーズをワンパターンで呼び出すこと

```
claude-my-project
└─.claude
   └─commands              # プロジェクトコマンド
     └─ create-test.md    # /create-testで呼び出す
```

### フロントマター

- Markdownファイルの最上部で記載する、ハイフン「-」を３つで囲まれた中に予め設定された項目を設定する
- この設定をCLAUDE CODEが読み取ってくれる

#### 主なフィールド

- description: コマンドの説明
- argument-hint: 引数のヒント
- allowed-tools: 使用するツールの制限
- model: 使用するモデルを指定

## サブエージェント

- メインのCLAUDE.mdとは別のコンテキストで動く分身
- サブエージェントが活躍する場面
 - 大規模なコードの調査
 - 複数ファイルへの並列編集
 - 広範なドキュメント生成

### 事前に用意されているサブエージェント

 - general-purpose：複雑なタスク全般（Sonnet）
 - Explore：高速な読み取り調査（Haiku）
 - Plan：計画モードの調査（inherit）
 - claude-code-guide：Claude Code機能の質問（Haiku）
 - stausline-setup：ステータスライン設定（Sonnet）

### カスタムエージェント

自分専用のオリジナルのエージェントを作成することができる

```
claude-my-project
└─ .claude
    └─agents               # エージェント
      └─ code-reviewer.md
```

## Skills

- Claudeがこの知識が必要だと判断したときにだけ読み込まれる
- 既に作成されたSkillsがマーケットプレイスで入手することができるプラグインがある


