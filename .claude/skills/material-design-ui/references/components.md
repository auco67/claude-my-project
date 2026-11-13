# M3 コンポーネント仕様

目次: Actions（Buttons / FAB / Icon Button / Segmented Button）・Containment（Card / Dialog / Bottom Sheet / Divider / List）・Navigation（Top App Bar / Navigation Bar / Rail / Drawer / Tabs）・Selection & Input（Text Field / Chips / Checkbox・Radio・Switch / Menu / Search）・Communication（Snackbar / Badge / Progress / Tooltip）

数値はpx（=dp）。「色」はカラーロール名。すべての操作要素はタッチターゲット48×48以上を確保する。

## Actions

### Common Buttons
高さ40、角丸full、ラベル label-large、左右パディング24（先頭アイコンあり時は左16）、アイコン18。

| 種類 | 強調度 | コンテナ | ラベル | 使いどころ |
|---|---|---|---|---|
| Filled | 最高 | primary | on-primary | 画面/領域の最重要アクション（保存、送信、購入） |
| Filled Tonal | 高 | secondary-container | on-secondary-container | 重要だが主役ではない（次へ、追加） |
| Elevated | 中 | surface-container-low + elevation1 | primary | 背景から分離が必要な場合のみ（画像上など） |
| Outlined | 中 | 透明 + outline 1px | primary | 補助アクション（キャンセル、戻る） |
| Text | 低 | 透明 | primary | ダイアログのアクション、カード内の軽いリンク的操作 |

ルール: 1つの領域にFilledは1つ。並べるときは強調度の高い方を末尾（右）に置く。ラベルは動詞で短く（「保存」「削除」）。

M3 Expressive のサイズ（XS32 / S40 / M56 / L96 / XL136）やトグルボタン、角丸→四角のモーフィングはExpressive指定時のみ。

### FAB
画面の最重要の「作成系」アクションに1つだけ。コンテナ primary-container、アイコン on-primary-container、elevation3（hover4）。
- Small: 40×40、角丸12、アイコン24
- FAB: 56×56、角丸16、アイコン24
- Large: 96×96、角丸28、アイコン36
- Extended FAB: 高さ56、角丸16、アイコン+ラベル。スクロールで通常FABに縮める。
配置: Compactでは右下（下端16、Navigation Barがあればその上）。Medium以上ではNavigation Rail上部に置ける。

### Icon Button
40×40（ターゲット48）、アイコン24。Standard（透明, on-surface-variant）/ Filled（primary）/ Tonal（secondary-container）/ Outlined（outline）。トグル型は選択時に塗りアイコン＋色ロール変更。`aria-label` 必須。

### Segmented Button
2〜5個の選択肢。高さ40、外枠角丸full、outline 1px。選択中は secondary-container + チェックアイコン。

## Containment

### Card
角丸12、内側パディング16。タイトル title-medium、本文 body-medium。
- Elevated: surface-container-low + elevation1
- Filled: surface-container-highest、影なし
- Outlined: surface + outline-variant 1px
カード全体をクリック可能にする場合はステートレイヤーをカード全体に。カード内に複数の操作がある場合はカード自体をクリック可能にしない。

### Dialog
surface-container-high、角丸28、パディング24、幅280〜560。見出し headline-small（on-surface）、本文 body-medium（on-surface-variant）、アクションはText Buttonを右寄せ（確認系を右端）。背景は scrim 32%。重要な確認・短い入力のみに使い、長いフォームは全画面ダイアログ（Compact）か別画面にする。

### Bottom Sheet
surface-container-low、上辺角丸28、ドラッグハンドル32×4（on-surface-variant 40%）。Modalはscrim付き。

### Divider
outline-variant 1px。全幅、またはインセット（左16）。セクションの区切りに最小限使う。余白で区切れるなら使わない。

### List
- 1行: 高さ56、2行: 72、3行: 88。左右パディング16。
- 見出し body-large（on-surface）、補足 body-medium（on-surface-variant）。
- 先頭: アイコン24 / アバター40 / 画像56。末尾: メタテキスト label-small、アイコン、チェックボックス、スイッチ。

## Navigation

### Top App Bar
| 種類 | 高さ | タイトル |
|---|---|---|
| Small | 64 | title-large、左寄せ |
| Center-aligned | 64 | title-large、中央。トップ階層の画面向け |
| Medium | 112 | headline-small |
| Large | 152 | headline-medium |
背景 surface、スクロール時 surface-container（色の変化で浮きを表現）。先頭にナビアイコン（戻る/メニュー）、末尾にアクションアイコン最大3つ、それ以上はオーバーフローメニュー。

### Navigation Bar（Compact向け、画面下部）
高さ80、背景 surface-container、3〜5項目。アクティブインジケーター 64×32 角丸full secondary-container。アイコン24、ラベル label-medium。アクティブはアイコン on-secondary-container（塗りアイコン）、ラベル on-surface、非アクティブは on-surface-variant。

### Navigation Rail（Medium向け、画面左）
幅80、背景 surface（またはsurface-container）、3〜7項目、上部にメニューボタン/FAB可。インジケーター 56×32。

### Navigation Drawer（Expanded以上 / 項目が多いとき）
幅360、項目高さ56、インジケーターは項目幅いっぱいの角丸full secondary-container。Standard（常設、surface）とModal（surface-container-low、端側角丸16、scrim付き）。

### Tabs
Primary Tabs（コンテンツの最上位切り替え、インジケーター3px primary・角丸上辺）、Secondary Tabs（下位の切り替え、インジケーター2px）。高さ48（アイコン+ラベルは64）、ラベル title-small。

## Selection & Input

### Text Field
高さ56、ラベル body-large（フォーカス/入力時は body-small に縮んで上へ）、入力文字 body-large、サポーティングテキスト body-small。
- Filled: surface-container-highest、上辺角丸4・下辺0、下線インジケーター（通常 on-surface-variant 1px、フォーカス primary 2px）
- Outlined: 角丸4、outline 1px、フォーカス primary 2px
- エラー: インジケーター/ラベル/サポーティングテキストを error に、末尾にエラーアイコン
- ラベルは必ず表示（placeholderだけで代用しない）。1つのフォーム内でFilledとOutlinedを混在させない。

### Chips
高さ32、角丸8、ラベル label-large、outline-variant 1px（選択時は枠なし secondary-container）。
- Assist: 文脈に応じたアクションの提案
- Filter: 絞り込み（複数選択、選択時チェックアイコン）
- Input: 入力された値（末尾に削除アイコン）
- Suggestion: 候補（入力補完など）

### Checkbox / Radio / Switch
- Checkbox: 18×18、角丸2、選択時 primary + on-primary のチェック
- Radio: 20×20、選択時 primary
- Switch: トラック52×32 角丸full。ON: トラック primary・ハンドル on-primary（24）。OFF: トラック surface-container-highest＋outline 2px・ハンドル outline（16）
いずれもターゲット48×48。ラベル要素をクリックしても切り替わるようにする。

### Menu
surface-container、角丸4、elevation2、幅112〜280、項目高さ48、パディング左右12、ラベル label-large。

### Search Bar
高さ56、角丸full、surface-container-high、先頭に検索アイコン、プレースホルダー body-large。

## Communication

### Snackbar
inverse-surface、文字 inverse-on-surface（body-medium）、アクション inverse-primary、角丸4、高さ48（2行時68）、elevation3。画面下（Navigation Bar/FABの上）。4〜10秒で自動消去、アクションは1つまで。

### Badge
error 色。Small: 6×6の点。Large: 高さ16・最小幅16、label-small、on-error、999+で打ち切り。

### Progress Indicator
Linear（トラック高さ4、active primary、track secondary-container / surface-container-highest）、Circular（直径48、太さ4）。確定（進捗率あり）/不確定を使い分け、200ms以下で終わる処理には出さない。

### Tooltip
Plain: inverse-surface、body-small、角丸4、高さ24。Rich: surface-container、角丸12、タイトル＋本文＋アクション。
