---
name: material-design-ui
description: Google Material Design 3 (Material You) に準拠したUIを設計・実装するためのガイド。カラーロール、タイポグラフィスケール、シェイプ、エレベーション、ステートレイヤー、モーション、ウィンドウサイズクラス、各コンポーネント仕様（ボタン、FAB、カード、App Bar、Navigation Bar/Rail/Drawer、テキストフィールド、ダイアログ等）とMUI / Tailwind / Material Webでの実装方法を提供する。ユーザーが「マテリアルデザイン」「Material Design」「M3」「Material You」「MUI」「Googleっぽい」「Androidアプリ風」のUIを求めたとき、Material準拠のテーマ・デザイントークン・ダークモード・ブランドカラーからのパレット生成を求めたとき、既存UIをMaterialガイドラインに沿って修正・レビューしたいときは、明示的に「スキル」と言われなくても必ずこのスキルを使うこと。
---

# Material Design 3 UI

Material Design 3（以下M3）に沿ったUIを作るためのスキル。M3の要点は「見た目を真似る」ことではなく、**トークン（色・文字・形・高さ・動き）を一元定義し、すべてのコンポーネントがそのトークンだけを参照する**ことにある。こうしておくと、ダークモード・ブランドカラー変更・コントラスト調整がトークン差し替えだけで済み、画面ごとの見た目のブレも起きない。

## 参照ファイル（必要なときに読む）

| ファイル | 読むタイミング |
|---|---|
| `references/tokens.md` | 色・文字・形・エレベーション・ステートレイヤー・モーションの具体値が必要なとき（ほぼ毎回） |
| `references/components.md` | 個別コンポーネントのサイズ・色ロール・使い分けを決めるとき |
| `references/layout.md` | 画面レイアウト、レスポンシブ、ナビゲーション方式を決めるとき |
| `references/impl-mui.md` | React / Next.js でMUIを使う場合 |
| `references/impl-css-tailwind.md` | 素のHTML/CSS、Tailwind、CSS Modulesで実装する場合 |
| `references/impl-material-web.md` | Google公式Web Components (`@material/web`) を使う場合 |
| `assets/m3-tokens.css` | ベースライン（紫シード）のライト/ダーク全トークン。CSS変数でそのまま使える |
| `scripts/generate-palette.mjs` | ブランドカラー（16進）から全カラーロールを生成するとき |

## ワークフロー

### 1. 既存環境を確認する
`package.json`、既存のテーマファイル、`tailwind.config.*`、グローバルCSSを確認し、すでにある仕組みに乗る。MUIが入っていればMUI、Tailwindだけならトークン＋Tailwind、何もなければ下表で選ぶ。既存プロジェクトに新しいUIライブラリを勝手に追加しない（追加が必要ならユーザーに確認する）。

| 状況 | 推奨 |
|---|---|
| React / Next.js、コンポーネントを早く揃えたい | MUI（M3寄せのテーマを当てる） |
| Tailwind中心、ライブラリ依存を増やしたくない | `m3-tokens.css` ＋ Tailwindにトークンをマッピング |
| 素のHTML / LP / フレームワーク非依存 | `m3-tokens.css` ＋ 素のCSS、または `@material/web` |

### 2. カラースキームを決める
- ブランドカラーがあれば `node scripts/generate-palette.mjs "#1F6F78"` で全ロールを生成する（依存: `@material/material-color-utilities@0.3.0`。0.4.0はNodeで動かないので注意）。ブランドカラーの16進値をそのまま `primary` に入れてはいけない。M3はHCT色空間のトーンでコントラストを保証しているため、生の値だと文字とのコントラストが崩れやすい。
- 指定がなければ `assets/m3-tokens.css` のベースラインを使う。
- ライトとダークの両方を必ず用意する。ダークは「色を反転」ではなく別トーンのスキーム。

### 3. トークンだけでスタイリングする
- コンポーネント内に `#6750A4` や `box-shadow: 0 2px ...` のような生値を書かない。`var(--md-sys-color-primary)` や `theme.palette.primary.main` 等のトークン経由にする。
- 色は**ペアで使う**：`primary` の上には `on-primary`、`primary-container` の上には `on-primary-container`。この対応を守ればコントラストは自動的に満たされる。
- 面の階層は影よりも **surface-container 系の色の違い**で表現する（M3はトーナルエレベーションが基本）。影は FAB・メニュー・ドラッグ中など本当に浮いている要素に限る。
- 文字は15段階のタイプスケール（Display/Headline/Title/Body/Label × L/M/S）から選ぶ。任意のfont-sizeを作らない。
- 角丸はシェイプスケール（0/4/8/12/16/28/full）から選ぶ。

### 4. レイアウトとナビゲーションを決める
ウィンドウサイズクラス（Compact <600 / Medium 600–839 / Expanded 840–1199 / Large 1200+）ごとにナビゲーションを切り替える：Compact=Navigation Bar（下部）、Medium=Navigation Rail、Expanded以上=Rail または Drawer。詳細は `references/layout.md`。

### 5. コンポーネントを選び、仕様に合わせる
`references/components.md` で役割に合うものを選ぶ。特にボタンの強調階層（Filled > Tonal > Elevated > Outlined > Text）を意識し、1つの領域で最重要アクション（Filled）は1つに絞る。

### 6. インタラクション状態を実装する
hover/focus/pressed は「色を変える」のではなく、`on-*` 色の半透明レイヤー（ステートレイヤー: 8% / 10% / 10%）を重ねる。disabled はコンテナ12%・内容38%の `on-surface`。キーボードフォーカスは `:focus-visible` で見えるフォーカスリングを出す。モーションはM3のイージング・デュレーショントークンを使い、`prefers-reduced-motion` を尊重する。

### 7. アクセシビリティ
- タッチターゲットは最小48×48px（見た目が40pxのボタン・アイコンボタンでも当たり判定は48px）。
- アイコンのみのボタンには `aria-label`。
- 本文テキストのコントラスト比4.5:1以上（正しいロールのペアを使えば満たせる）。
- 状態を色だけで伝えない（エラーはアイコン＋サポーティングテキストも出す）。

### 8. 仕上げのセルフチェック
完成前に次を確認し、満たしていない項目があれば直してから報告する。

- [ ] 生のカラーコード・任意のfont-size・任意の角丸がコンポーネントに残っていない
- [ ] `X` の上の文字・アイコンが `on-X` になっている
- [ ] ライト/ダーク両方で表示が破綻しない
- [ ] 1領域にFilledボタンが1つ以下
- [ ] hover/focus/pressed/disabled の各状態がある
- [ ] Compact幅（360px）で横スクロールが出ず、ナビゲーションが適切に切り替わる
- [ ] タッチターゲット48px以上、アイコンボタンにラベルあり
- [ ] Material Symbols等、M3に合うアイコンセットを使っている

## プロジェクト規約との整合
このリポジトリの規約（変数はcamelCase、定数はUPPER_SNAKE_CASE、関数は動詞始まり）に従ってコードを書く。CSSカスタムプロパティ名だけはM3の公式命名（`--md-sys-color-on-primary` 等のkebab-case）に揃える。公式名に揃えることで `@material/web` や公式ドキュメントとそのまま対応が取れるため。

## 報告の仕方
実装後は、選んだ実装手段とその理由、使用したカラースキーム（シード色）、ナビゲーション方式、セルフチェックで気づいて直した点を簡潔に伝える。
