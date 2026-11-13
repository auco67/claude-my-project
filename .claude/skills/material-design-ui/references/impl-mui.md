# MUIでのM3実装（React / Next.js）

MUI（`@mui/material`）は既定がMaterial 2寄りのため、**テーマでM3トークンに寄せる**のが基本方針。M3のカラーロールは `palette.m3` に丸ごと持たせ、MUI標準のpaletteキーにも対応付ける。

目次: 1. セットアップ / 2. テーマ定義 / 3. コンポーネントの対応表 / 4. 注意点

## 1. セットアップ（Next.js App Router）

```bash
npm install @mui/material @mui/material-nextjs @emotion/react @emotion/styled @emotion/cache
npm install -D @material/material-color-utilities@0.3.0   # ブランドカラーからパレット生成する場合
```

`@mui/material-nextjs` のApp Router用エントリはNext.jsのメジャーバージョン別（例 `@mui/material-nextjs/v15-appRouter`）。インストール済みパッケージの `package.json` の `exports` を見て、プロジェクトのNext.jsに合うものを選ぶ（なければ最も近い新しいもの）。

```tsx
// app/layout.tsx
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter"; // ← バージョンを合わせる
import { Roboto, Noto_Sans_JP } from "next/font/google";
import AppThemeProvider from "@/theme/AppThemeProvider";

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-roboto" });
const notoSansJp = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-noto-sans-jp" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={`${roboto.variable} ${notoSansJp.variable}`} suppressHydrationWarning>
      <body>
        <AppRouterCacheProvider>
          <AppThemeProvider>{children}</AppThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
```

```tsx
// theme/AppThemeProvider.tsx
"use client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { appTheme } from "./appTheme";

export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme />
      {children}
    </ThemeProvider>
  );
}
```

ダークモードは `colorSchemes` + `cssVariables` で行う。ユーザー切り替えが必要なら `useColorScheme()` の `setMode("light" | "dark" | "system")` を使う。SSRのちらつき防止には `InitColorSchemeScript`（`@mui/material/InitColorSchemeScript`）を `<body>` 先頭に置く。

## 2. テーマ定義

カラーロールの値は `scripts/generate-palette.mjs --format ts` の出力、または `assets/m3-tokens.css` のベースライン値を使う。

```ts
// theme/appTheme.ts
import { createTheme } from "@mui/material/styles";
import { LIGHT_COLOR_ROLES, DARK_COLOR_ROLES, type M3ColorRoles } from "./m3ColorRoles";

declare module "@mui/material/styles" {
  interface Palette { m3: M3ColorRoles }
  interface PaletteOptions { m3?: M3ColorRoles }
  interface TypographyVariants { displayLarge: React.CSSProperties; titleMedium: React.CSSProperties; labelLarge: React.CSSProperties /* 必要なものを追加 */ }
  interface TypographyVariantsOptions { displayLarge?: React.CSSProperties; titleMedium?: React.CSSProperties; labelLarge?: React.CSSProperties }
}
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides { displayLarge: true; titleMedium: true; labelLarge: true }
}
declare module "@mui/material/Button" {
  interface ButtonPropsVariantOverrides { tonal: true; elevated: true }
}

const buildPalette = (roles: M3ColorRoles) => ({
  m3: roles,
  primary: { main: roles.primary, contrastText: roles.onPrimary },
  secondary: { main: roles.secondary, contrastText: roles.onSecondary },
  error: { main: roles.error, contrastText: roles.onError },
  background: { default: roles.surface, paper: roles.surfaceContainerLow },
  text: { primary: roles.onSurface, secondary: roles.onSurfaceVariant },
  divider: roles.outlineVariant,
});

const FONT_STACK = 'var(--font-roboto), var(--font-noto-sans-jp), "Noto Sans JP", sans-serif';

export const appTheme = createTheme({
  cssVariables: { colorSchemeSelector: "class" },
  colorSchemes: {
    light: { palette: buildPalette(LIGHT_COLOR_ROLES) },
    dark: { palette: buildPalette(DARK_COLOR_ROLES) },
  },
  shape: { borderRadius: 4 }, // 個別コンポーネントでM3のshapeを指定する
  typography: {
    fontFamily: FONT_STACK,
    // MUI標準バリアントをM3スケールに対応付け
    h1: { fontSize: 57, lineHeight: "64px", fontWeight: 400, letterSpacing: -0.25 }, // display-large
    h2: { fontSize: 45, lineHeight: "52px", fontWeight: 400 },                      // display-medium
    h3: { fontSize: 36, lineHeight: "44px", fontWeight: 400 },                      // display-small
    h4: { fontSize: 32, lineHeight: "40px", fontWeight: 400 },                      // headline-large
    h5: { fontSize: 28, lineHeight: "36px", fontWeight: 400 },                      // headline-medium
    h6: { fontSize: 24, lineHeight: "32px", fontWeight: 400 },                      // headline-small
    subtitle1: { fontSize: 16, lineHeight: "24px", fontWeight: 500, letterSpacing: 0.15 }, // title-medium
    subtitle2: { fontSize: 14, lineHeight: "20px", fontWeight: 500, letterSpacing: 0.1 },  // title-small
    body1: { fontSize: 16, lineHeight: "24px", letterSpacing: 0.5 },   // body-large
    body2: { fontSize: 14, lineHeight: "20px", letterSpacing: 0.25 },  // body-medium
    caption: { fontSize: 12, lineHeight: "16px", letterSpacing: 0.4 }, // body-small
    button: { fontSize: 14, lineHeight: "20px", fontWeight: 500, letterSpacing: 0.1, textTransform: "none" }, // label-large
    displayLarge: { fontSize: 57, lineHeight: "64px", fontWeight: 400, letterSpacing: -0.25 },
    titleMedium: { fontSize: 16, lineHeight: "24px", fontWeight: 500, letterSpacing: 0.15 },
    labelLarge: { fontSize: 14, lineHeight: "20px", fontWeight: 500, letterSpacing: 0.1 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: ({ theme }) => {
          const m3 = (theme.vars ?? theme).palette.m3;
          return {
            borderRadius: 9999, height: 40, paddingInline: 24,
            variants: [
              { props: { variant: "contained" }, style: { backgroundColor: m3.primary, color: m3.onPrimary } },
              { props: { variant: "tonal" }, style: { backgroundColor: m3.secondaryContainer, color: m3.onSecondaryContainer } },
              { props: { variant: "elevated" }, style: { backgroundColor: m3.surfaceContainerLow, color: m3.primary, boxShadow: "var(--md-sys-elevation-1, 0 1px 2px rgb(0 0 0 / .3), 0 1px 3px 1px rgb(0 0 0 / .15))" } },
              { props: { variant: "outlined" }, style: { borderColor: m3.outline, color: m3.primary } },
              { props: { variant: "text" }, style: { paddingInline: 12, color: m3.primary } },
            ],
          };
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: ({ theme }) => {
          const m3 = (theme.vars ?? theme).palette.m3;
          return { borderRadius: 16, backgroundColor: m3.primaryContainer, color: m3.onPrimaryContainer, "&:hover": { backgroundColor: m3.primaryContainer } };
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: ({ theme }) => ({ borderRadius: 12, backgroundColor: (theme.vars ?? theme).palette.m3.surfaceContainerHighest }) },
    },
    MuiDialog: {
      styleOverrides: { paper: ({ theme }) => ({ borderRadius: 28, padding: 8, backgroundColor: (theme.vars ?? theme).palette.m3.surfaceContainerHigh, backgroundImage: "none" }) },
    },
    MuiChip: { styleOverrides: { root: { borderRadius: 8, height: 32 } } },
    MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 4 } } },
    MuiFilledInput: {
      styleOverrides: { root: ({ theme }) => ({ borderRadius: "4px 4px 0 0", backgroundColor: (theme.vars ?? theme).palette.m3.surfaceContainerHighest }) },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: "inherit" },
      styleOverrides: { root: ({ theme }) => ({ backgroundColor: (theme.vars ?? theme).palette.m3.surface }) },
    },
    MuiBottomNavigation: {
      styleOverrides: { root: ({ theme }) => ({ height: 80, backgroundColor: (theme.vars ?? theme).palette.m3.surfaceContainer }) },
    },
    MuiSnackbarContent: {
      styleOverrides: { root: ({ theme }) => { const m3 = (theme.vars ?? theme).palette.m3; return { borderRadius: 4, backgroundColor: m3.inverseSurface, color: m3.inverseOnSurface }; } },
    },
    MuiMenu: {
      styleOverrides: { paper: ({ theme }) => ({ borderRadius: 4, backgroundColor: (theme.vars ?? theme).palette.m3.surfaceContainer }) },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } }, // MUIのダーク時の白オーバーレイを無効化（M3はsurface-containerで表現）
  },
});
```

`m3ColorRoles.ts` には `M3ColorRoles` 型（camelCaseのロール名: `primary`, `onPrimary`, `primaryContainer`, …, `surfaceContainerHighest`, `inverseSurface`, `inverseOnSurface`, `inversePrimary`, `scrim`, `shadow`）と `LIGHT_COLOR_ROLES` / `DARK_COLOR_ROLES` 定数を置く。`generate-palette.mjs --format ts` でそのまま生成できる。

## 3. MUIコンポーネントとM3の対応

| M3 | MUI |
|---|---|
| Filled / Tonal / Elevated / Outlined / Text Button | `Button` variant `contained` / `tonal`(独自) / `elevated`(独自) / `outlined` / `text` |
| FAB / Extended FAB | `Fab` / `Fab variant="extended"` |
| Icon Button | `IconButton`（`aria-label` 必須） |
| Segmented Button | `ToggleButtonGroup`（角丸full・選択時secondaryContainerに上書き） |
| Card | `Card`（Elevated/Filled/Outlinedは `variant` や `sx` で切替） |
| Top App Bar | `AppBar` + `Toolbar`（高さ64、スクロール時は `useScrollTrigger` で surfaceContainer に） |
| Navigation Bar | `BottomNavigation`（インジケーターは `BottomNavigationAction` の `Mui-selected` アイコン背景に 64×32 pill を自作） |
| Navigation Rail | 既製なし。`Box` + `ListItemButton` で自作（幅80） |
| Navigation Drawer | `Drawer`（幅360、`ListItemButton` 角丸full・選択時 secondaryContainer） |
| Text Field | `TextField variant="filled" / "outlined"` |
| Chips | `Chip`（Filter は `variant` 切替＋選択時チェックアイコン） |
| Dialog / Bottom Sheet | `Dialog` / `Drawer anchor="bottom"`（上辺角丸28） |
| Snackbar / Menu / Tooltip | `Snackbar` / `Menu` / `Tooltip` |

アイコンは `@mui/icons-material` の Outlined 系か、Material Symbols（Rounded/Outlined）を使い、1つのUI内で混在させない。

## 4. 注意点
- 色は `sx={{ bgcolor: "m3.secondaryContainer" }}` のようにテーマパス文字列で指定できる。生の16進値を `sx` に書かない。
- `theme.vars` は `cssVariables` 有効時のみ存在するので `(theme.vars ?? theme)` で参照する。
- MUIのリップルはM3のステートレイヤーとほぼ同等なので残してよい。hover時の背景色はMUI既定（`action.hover`）ではなく on-* の8%に寄せたい場合、`palette.action.hoverOpacity: 0.08` を設定する。
- ThemeProvider・`useColorScheme` を使うコンポーネントはClient Component（`"use client"`）にする。ページ自体はServer Componentのままでよい。
