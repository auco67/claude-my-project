# 素のCSS / Tailwind でのM3実装

ライブラリに頼らず、`assets/m3-tokens.css` のCSS変数を土台にする方法。LP、静的HTML、Tailwindプロジェクト、CSS Modules いずれでも同じ考え方で使える。

## 1. トークンを読み込む
`assets/m3-tokens.css` をプロジェクトにコピー（例 `app/m3-tokens.css` / `styles/m3-tokens.css`）し、グローバルCSSの先頭で読み込む。ブランドカラーがある場合は `scripts/generate-palette.mjs` の出力（`--format css`）で色ブロックを置き換える。

ダークモードは2通りに対応済み:
- OS設定に追従: `@media (prefers-color-scheme: dark)`
- 手動切り替え: `<html data-theme="dark">` / `data-theme="light"`

## 2. Tailwind へのマッピング

### Tailwind v4（CSS-first 設定）
```css
@import "tailwindcss";
@import "./m3-tokens.css";

@theme inline {
  --color-primary: var(--md-sys-color-primary);
  --color-on-primary: var(--md-sys-color-on-primary);
  --color-primary-container: var(--md-sys-color-primary-container);
  --color-on-primary-container: var(--md-sys-color-on-primary-container);
  --color-secondary-container: var(--md-sys-color-secondary-container);
  --color-on-secondary-container: var(--md-sys-color-on-secondary-container);
  --color-surface: var(--md-sys-color-surface);
  --color-on-surface: var(--md-sys-color-on-surface);
  --color-on-surface-variant: var(--md-sys-color-on-surface-variant);
  --color-surface-container-low: var(--md-sys-color-surface-container-low);
  --color-surface-container: var(--md-sys-color-surface-container);
  --color-surface-container-high: var(--md-sys-color-surface-container-high);
  --color-surface-container-highest: var(--md-sys-color-surface-container-highest);
  --color-outline: var(--md-sys-color-outline);
  --color-outline-variant: var(--md-sys-color-outline-variant);
  --color-error: var(--md-sys-color-error);
  --color-on-error: var(--md-sys-color-on-error);
  /* 必要なロールを同じ形式で追加 */

  --radius-xs: 4px; --radius-sm: 8px; --radius-md: 12px; --radius-lg: 16px; --radius-xl: 28px;

  --text-display-large: 57px; --text-display-large--line-height: 64px; --text-display-large--letter-spacing: -0.25px;
  --text-headline-small: 24px; --text-headline-small--line-height: 32px;
  --text-title-large: 22px; --text-title-large--line-height: 28px;
  --text-title-medium: 16px; --text-title-medium--line-height: 24px; --text-title-medium--font-weight: 500;
  --text-body-large: 16px; --text-body-large--line-height: 24px;
  --text-body-medium: 14px; --text-body-medium--line-height: 20px;
  --text-label-large: 14px; --text-label-large--line-height: 20px; --text-label-large--font-weight: 500;
  /* 残りのスケールも同様に */

  --ease-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1);
  --ease-emphasized-accelerate: cubic-bezier(0.3, 0, 0.8, 0.15);
  --ease-standard: cubic-bezier(0.2, 0, 0, 1);
}
```
`inline` を付けるとCSS変数参照のまま展開されるため、ダークモード切り替えがユーティリティにもそのまま効く。

### Tailwind v3（`tailwind.config.js`）
```js
const toVar = (name) => `var(--md-sys-color-${name})`;
const COLOR_ROLES = ["primary", "on-primary", "primary-container", "on-primary-container", "secondary", "on-secondary", "secondary-container", "on-secondary-container", "tertiary", "on-tertiary", "tertiary-container", "on-tertiary-container", "error", "on-error", "error-container", "on-error-container", "surface", "on-surface", "on-surface-variant", "surface-container-lowest", "surface-container-low", "surface-container", "surface-container-high", "surface-container-highest", "outline", "outline-variant", "inverse-surface", "inverse-on-surface", "inverse-primary"];

module.exports = {
  theme: {
    extend: {
      colors: Object.fromEntries(COLOR_ROLES.map((role) => [role, toVar(role)])),
      borderRadius: { xs: "4px", sm: "8px", md: "12px", lg: "16px", xl: "28px" },
      fontSize: {
        "display-large": ["57px", { lineHeight: "64px", letterSpacing: "-0.25px" }],
        "headline-small": ["24px", { lineHeight: "32px" }],
        "title-large": ["22px", { lineHeight: "28px" }],
        "title-medium": ["16px", { lineHeight: "24px", fontWeight: "500" }],
        "body-large": ["16px", { lineHeight: "24px" }],
        "body-medium": ["14px", { lineHeight: "20px" }],
        "label-large": ["14px", { lineHeight: "20px", fontWeight: "500" }],
      },
    },
  },
};
```
v3のCDN版（`cdn.tailwindcss.com`）でも `tailwind.config = {...}` に同じ内容を書けば使える。

## 3. コンポーネント実装パターン（素のCSS）

```css
/* ステートレイヤー共通 */
.mdState { position: relative; overflow: hidden; isolation: isolate; }
.mdState::before {
  content: ""; position: absolute; inset: 0; z-index: -1;
  background: currentColor; opacity: 0; pointer-events: none;
  transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}
.mdState:hover::before { opacity: var(--md-sys-state-hover-opacity); }
.mdState:focus-visible::before, .mdState:active::before { opacity: var(--md-sys-state-pressed-opacity); }
.mdState:focus-visible { outline: 3px solid var(--md-sys-color-secondary); outline-offset: 2px; }

/* Buttons */
.mdButton {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  height: 40px; min-width: 48px; padding-inline: 24px; border: none;
  border-radius: var(--md-sys-shape-corner-full);
  font: var(--md-sys-typescale-label-large); letter-spacing: .1px; cursor: pointer;
}
.mdButton--filled   { background: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); }
.mdButton--tonal    { background: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); }
.mdButton--outlined { background: transparent; color: var(--md-sys-color-primary); border: 1px solid var(--md-sys-color-outline); }
.mdButton--text     { background: transparent; color: var(--md-sys-color-primary); padding-inline: 12px; }
.mdButton:disabled  {
  background: color-mix(in srgb, var(--md-sys-color-on-surface) 12%, transparent);
  color: color-mix(in srgb, var(--md-sys-color-on-surface) 38%, transparent);
  border-color: color-mix(in srgb, var(--md-sys-color-on-surface) 12%, transparent);
  cursor: default;
}
.mdButton--filled:hover { box-shadow: var(--md-sys-elevation-1); }

/* Cards */
.mdCard { border-radius: var(--md-sys-shape-corner-medium); padding: 16px; }
.mdCard--elevated { background: var(--md-sys-color-surface-container-low); box-shadow: var(--md-sys-elevation-1); }
.mdCard--filled   { background: var(--md-sys-color-surface-container-highest); }
.mdCard--outlined { background: var(--md-sys-color-surface); border: 1px solid var(--md-sys-color-outline-variant); }
```

クラス名はプロジェクトの命名規約（camelCase）に合わせてある。BEMの修飾子部分（`--filled`）はCSSの慣習として許容。Tailwindなら同等のユーティリティを並べればよい（例: Filledボタン `h-10 px-6 rounded-full bg-primary text-on-primary text-label-large`）。

## 4. アイコン
Material Symbols を使う。

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@24,400,0..1,0" />
<span class="material-symbols-rounded" aria-hidden="true">home</span>
```
アクティブ状態は `font-variation-settings: "FILL" 1;` で塗りアイコンに切り替える。React なら `@mui/icons-material` や `react-material-symbols` 等でもよい。
