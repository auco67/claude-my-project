# M3 レイアウト

## ウィンドウサイズクラス

| クラス | 幅 | 代表デバイス | 左右マージン | ペイン数 | ナビゲーション |
|---|---|---|---|---|---|
| Compact | < 600 | スマホ縦 | 16 | 1 | Navigation Bar（下部）＋必要ならModal Drawer |
| Medium | 600–839 | タブレット縦、折りたたみ | 24 | 1（2も可） | Navigation Rail |
| Expanded | 840–1199 | タブレット横、小型PC | 24 | 1〜2 | Navigation Rail または Standard Drawer |
| Large | 1200–1599 | PC | 24 | 1〜2 | Standard Drawer または Rail |
| Extra-large | ≥ 1600 | 大型モニタ | 24 | 1〜3 | Standard Drawer |

CSSブレークポイント例:
```css
/* compact はデフォルト */
@media (min-width: 600px)  { /* medium */ }
@media (min-width: 840px)  { /* expanded */ }
@media (min-width: 1200px) { /* large */ }
@media (min-width: 1600px) { /* extra-large */ }
```

## スペーシング
- 4pxベースグリッド（主に8の倍数、細部で4）。
- ペイン間のスペーサー: 24。
- コンポーネント内の余白はコンポーネント仕様（components.md）に従う。
- 本文の1行は全角40字前後（英文なら60〜75字）に収まる幅に制限する（`max-width` を設ける）。

## カノニカルレイアウト
画面の目的に応じて次から選ぶ。

1. **List-detail**: 一覧と詳細。Compactでは一覧→詳細の画面遷移、Expanded以上では左右2ペイン（一覧は固定幅360程度）。メール、設定、ファイル一覧向け。
2. **Supporting pane**: メインコンテンツ＋補助情報。Expanded以上で右側に補助ペイン（幅360程度）、Compactでは下部シートや別セクションに。ドキュメント編集、詳細＋関連情報向け。
3. **Feed**: カードのグリッド。列数を幅に応じて増やす（Compact 1列 → Medium 2列 → Expanded 3列以上）。`grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))` が使いやすい。ニュース、商品一覧向け。

## ナビゲーションの切り替え実装の考え方
- 同じ遷移先リストを1か所で定義し、サイズクラスに応じて Bar / Rail / Drawer のどれで描画するかだけを切り替える（遷移先の定義を重複させない）。
- アクティブ状態の判定（現在のルート）も共通化する。
- Navigation Bar表示時は、コンテンツ下端にバーの高さ（80）分の余白を確保し、FAB・Snackbarをその上に配置する。
- Safe area（`env(safe-area-inset-bottom)`）を考慮する。

## ランディングページ等マーケティング寄りの画面
M3はアプリUI向けの体系だが、LPでも適用できる。
- ヒーロー見出しは display-large/medium、セクション見出しは headline 系、本文は body-large。
- セクション背景の切り替えは surface → surface-container-low → surface のように色の階層で行う。
- CTAはFilledボタン1つ＋必要ならOutlined/Textを1つ。
- 画像やイラストの角丸は shape スケール（16 / 28）に合わせる。
