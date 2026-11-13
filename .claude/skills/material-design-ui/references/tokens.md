# M3 デザイントークン

目次: 1. カラーロール / 2. タイポグラフィ / 3. シェイプ / 4. エレベーション / 5. ステートレイヤー / 6. モーション

トークン名は公式の `md.sys.*` に対応する。CSS変数では `--md-sys-color-primary` のように書く。ベースライン値の全一覧は `assets/m3-tokens.css`。

## 1. カラーロール

M3の色は「何色か」ではなく「どの役割か」で指定する。

| グループ | ロール | 用途 |
|---|---|---|
| Primary | `primary` / `on-primary` | 最重要アクション（Filledボタン、アクティブ状態、FABアイコン以外の強調） |
| | `primary-container` / `on-primary-container` | 目立たせたいが primary ほど強くない要素（FAB、選択状態の面） |
| Secondary | `secondary(-container)` / `on-*` | 補助的な強調。Tonalボタン、ナビのアクティブインジケーター、フィルターチップ選択時 |
| Tertiary | `tertiary(-container)` / `on-*` | 対比アクセント。primary/secondaryとバランスを取る差し色 |
| Error | `error(-container)` / `on-*` | エラー表示、破壊的操作 |
| Surface | `surface` / `on-surface` | 画面の基本背景と基本テキスト |
| | `on-surface-variant` | 補助テキスト、アイコン、プレースホルダー |
| | `surface-container-lowest` 〜 `-highest`（5段） | 面の階層。カード・シート・ダイアログ・ナビの背景 |
| | `surface-dim` / `surface-bright` | 明るさを固定したい面 |
| Outline | `outline` | Outlinedボタン/テキストフィールドの境界（重要な境界） |
| | `outline-variant` | Divider、Outlinedカードの境界（装飾的な境界） |
| Inverse | `inverse-surface` / `inverse-on-surface` / `inverse-primary` | Snackbar等、周囲と反転した面 |
| その他 | `scrim`, `shadow` | モーダル背景の暗幕（scrim 32%不透明）、影色 |

`background` / `surface-variant` は旧ロール。新規実装では `surface` と `surface-container-*` を使う。

### surface-container の使い分け（目安）
- lowest: 最も沈んだ面、上に乗るカードとの対比
- low: Elevated Card、Bottom Sheet、Modal Navigation Drawer
- container (default): Navigation Bar/Rail、Menu、スクロール時のTop App Bar
- high: Dialog、Date/Time Picker
- highest: Filled Card、Filled Text Field、Search Bar

## 2. タイポグラフィ

ブランドフォント（`--md-ref-typeface-brand`）は Display/Headline/Title(L) に、プレーンフォント（`--md-ref-typeface-plain`）は Body/Label 等に使う。既定はどちらも Roboto。日本語では `"Noto Sans JP"` を併記する。日本語本文は行間がやや詰まって見えるため、Body系の line-height を +2〜4px 広げてもよい。

| トークン | size / line-height | weight | tracking |
|---|---|---|---|
| display-large | 57 / 64 | 400 | -0.25 |
| display-medium | 45 / 52 | 400 | 0 |
| display-small | 36 / 44 | 400 | 0 |
| headline-large | 32 / 40 | 400 | 0 |
| headline-medium | 28 / 36 | 400 | 0 |
| headline-small | 24 / 32 | 400 | 0 |
| title-large | 22 / 28 | 400 | 0 |
| title-medium | 16 / 24 | 500 | 0.15 |
| title-small | 14 / 20 | 500 | 0.1 |
| body-large | 16 / 24 | 400 | 0.5 |
| body-medium | 14 / 20 | 400 | 0.25 |
| body-small | 12 / 16 | 400 | 0.4 |
| label-large | 14 / 20 | 500 | 0.1 |
| label-medium | 12 / 16 | 500 | 0.5 |
| label-small | 11 / 16 | 500 | 0.5 |

単位はpx（dp）。trackingはpx。日本語ではtrackingを0にしてよい。

主な割り当て: ボタン=label-large、Top App Barタイトル=title-large、ダイアログ見出し=headline-small、リスト見出し=body-large、カードタイトル=title-medium、チップ・タブ=label-large、ナビラベル=label-medium。

## 3. シェイプ

| トークン | 値 | 代表例 |
|---|---|---|
| corner-none | 0 | 全幅のTop App Bar、Navigation Bar |
| corner-extra-small | 4px | Menu、Snackbar、Text Field（Filledは上辺のみ） |
| corner-small | 8px | Chip |
| corner-medium | 12px | Card、Small FAB |
| corner-large | 16px | FAB、Navigation Drawer（端側）|
| corner-extra-large | 28px | Dialog、Bottom Sheet（上辺）、Large FAB |
| corner-full | 9999px | Button、Search Bar、Navインジケーター、Badge |

M3 Expressive では large-increased 20px / extra-large-increased 32px / extra-extra-large 48px が追加されている。Expressiveを明示的に求められた場合のみ使う。

## 4. エレベーション

| レベル | dp | 用途 |
|---|---|---|
| 0 | 0 | Filled/Outlined Card、Filledボタン（静止時）、Top App Bar（静止時） |
| 1 | 1 | Elevated Card、Elevatedボタン、Modal Bottom Sheet |
| 2 | 3 | Menu、Top App Bar（スクロール時）、hover時の+1 |
| 3 | 6 | FAB、Dialog、Search（展開時） |
| 4 | 8 | hover中のFAB |
| 5 | 12 | ほぼ不使用 |

M3はまず色（surface-container）で高さを表現し、影は補助。影を付ける場合のCSS例（`--md-sys-color-shadow` 基準）:

```css
--md-sys-elevation-1: 0 1px 2px rgb(0 0 0 / .3), 0 1px 3px 1px rgb(0 0 0 / .15);
--md-sys-elevation-2: 0 1px 2px rgb(0 0 0 / .3), 0 2px 6px 2px rgb(0 0 0 / .15);
--md-sys-elevation-3: 0 1px 3px rgb(0 0 0 / .3), 0 4px 8px 3px rgb(0 0 0 / .15);
--md-sys-elevation-4: 0 2px 3px rgb(0 0 0 / .3), 0 6px 10px 4px rgb(0 0 0 / .15);
--md-sys-elevation-5: 0 4px 4px rgb(0 0 0 / .3), 0 8px 12px 6px rgb(0 0 0 / .15);
```

## 5. ステートレイヤー

インタラクション状態は、要素の上に「内容色（on-*）」を一定不透明度で重ねて表現する。背景色そのものを別の色に差し替えない。

| 状態 | 不透明度 |
|---|---|
| hover | 8% |
| focus | 10% |
| pressed | 10%（＋リップル） |
| dragged | 16% |

disabled: コンテナ `on-surface` 12%、ラベル・アイコン `on-surface` 38%。カーソルは `not-allowed` ではなく操作不能であることを `aria-disabled`/`disabled` で示す。

CSS実装例:

```css
.stateLayerHost { position: relative; overflow: hidden; }
.stateLayerHost::before {
  content: ""; position: absolute; inset: 0;
  background: currentColor; opacity: 0;
  transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
  pointer-events: none;
}
.stateLayerHost:hover::before { opacity: .08; }
.stateLayerHost:focus-visible::before,
.stateLayerHost:active::before { opacity: .10; }
```

フォーカスリング: `outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px;`（公式Web実装に準拠）

## 6. モーション

| イージング | cubic-bezier | 用途 |
|---|---|---|
| emphasized | (0.2, 0, 0, 1) ※公式は複合パス、Webではこれで近似 | 画面内の主要な遷移 |
| emphasized-decelerate | (0.05, 0.7, 0.1, 1) | 入ってくる要素 |
| emphasized-accelerate | (0.3, 0, 0.8, 0.15) | 出ていく要素 |
| standard | (0.2, 0, 0, 1) | 小さな状態変化 |
| standard-decelerate | (0, 0, 0, 1) | |
| standard-accelerate | (0.3, 0, 1, 1) | |

| デュレーション | ms |
|---|---|
| short1–4 | 50 / 100 / 150 / 200 |
| medium1–4 | 250 / 300 / 350 / 400 |
| long1–4 | 450 / 500 / 550 / 600 |
| extra-long1–4 | 700 / 800 / 900 / 1000 |

目安: ステートレイヤー=short2〜3、ボタンやチップの変化=short4〜medium1、メニュー/ダイアログ表示=medium2〜4（入り emphasized-decelerate、出 emphasized-accelerate、出る方を短く）、画面遷移=long系。

`@media (prefers-reduced-motion: reduce)` では移動・拡大を止め、フェードのみかデュレーション0にする。
