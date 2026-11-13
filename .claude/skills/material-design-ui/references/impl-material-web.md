# Material Web (`@material/web`) での実装

Google公式のM3 Web Components。M3仕様に最も忠実だが、2024年以降はメンテナンスモード（新規コンポーネント追加は少ない）。Navigation Bar/Rail/Drawer、Top App Bar、Card、Snackbar などは未提供なので、それらは `references/impl-css-tailwind.md` の方法で自作する。

## 導入
```bash
npm install @material/web
```
```js
// 使うものだけ読み込む
import "@material/web/button/filled-button.js";
import "@material/web/button/filled-tonal-button.js";
import "@material/web/button/outlined-button.js";
import "@material/web/button/text-button.js";
import "@material/web/iconbutton/icon-button.js";
import "@material/web/textfield/outlined-text-field.js";
import "@material/web/chips/chip-set.js";
import "@material/web/chips/filter-chip.js";
import "@material/web/dialog/dialog.js";
import "@material/web/icon/icon.js";
import { styles as typescaleStyles } from "@material/web/typography/md-typescale-styles.js";
document.adoptedStyleSheets.push(typescaleStyles.styleSheet);
```

## テーマ
コンポーネントは `--md-sys-color-*` / `--md-sys-typescale-*` / `--md-sys-shape-*` を読むので、`assets/m3-tokens.css` を読み込むだけでテーマが当たる。ブランドカラーは `scripts/generate-palette.mjs --format css` の結果で置き換える。個別調整はコンポーネントトークン（例 `--md-filled-button-container-shape`）で行う。

## 使用例
```html
<md-filled-button>保存</md-filled-button>
<md-outlined-button>キャンセル</md-outlined-button>
<md-icon-button aria-label="設定"><md-icon>settings</md-icon></md-icon-button>
<md-outlined-text-field label="メールアドレス" type="email" supporting-text="仕事用のアドレス"></md-outlined-text-field>
```

## React / Next.js で使う場合
- React 19 はカスタム要素のプロパティ・イベントを扱えるので直接使える。React 18以前は `@lit/react` の `createComponent` でラップする。
- Web ComponentsはSSRされないため、Next.jsでは利用箇所をClient Componentにし、`useEffect` 内で `import()` するか `next/dynamic` の `ssr: false` で読み込む。初期表示のちらつきが気になる場合はMUIを選ぶ方がよい。
- TypeScriptで `<md-filled-button>` を書くには JSX の `IntrinsicElements` 型拡張が必要。
