#!/usr/bin/env node
/**
 * ブランドカラー（16進）から Material Design 3 の全カラーロール（ライト/ダーク）を生成する。
 *
 * 依存: @material/material-color-utilities@0.3.0（0.4.0 はNodeから直接importすると壊れるため0.3.0に固定）
 *   プロジェクトに入っていなければ `npm install -D @material/material-color-utilities@0.3.0`
 *   （プロジェクトを汚したくない場合は一時ディレクトリでインストールし、NODE_PATH を通して実行）
 *
 * 使い方:
 *   node generate-palette.mjs "#1F6F78"                      # CSS変数（既定）
 *   node generate-palette.mjs "#1F6F78" --format ts          # MUI用TypeScript定数
 *   node generate-palette.mjs "#1F6F78" --format json
 *   node generate-palette.mjs "#1F6F78" --variant fidelity   # ブランド色に忠実なスキーム
 *   node generate-palette.mjs "#1F6F78" --contrast 0.5       # コントラスト強化（-1〜1）
 *
 * variant:
 *   tonal-spot（既定・M3標準。落ち着いたトーン）
 *   fidelity  （primary-container がブランド色にほぼ一致。ブランド色を強く出したい場合）
 *   vibrant / expressive / neutral / monochrome
 */
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const require = createRequire(import.meta.url);

const COLOR_ROLE_NAMES = [
  "primary", "onPrimary", "primaryContainer", "onPrimaryContainer",
  "secondary", "onSecondary", "secondaryContainer", "onSecondaryContainer",
  "tertiary", "onTertiary", "tertiaryContainer", "onTertiaryContainer",
  "error", "onError", "errorContainer", "onErrorContainer",
  "surface", "onSurface", "surfaceVariant", "onSurfaceVariant",
  "surfaceDim", "surfaceBright",
  "surfaceContainerLowest", "surfaceContainerLow", "surfaceContainer",
  "surfaceContainerHigh", "surfaceContainerHighest",
  "outline", "outlineVariant",
  "inverseSurface", "inverseOnSurface", "inversePrimary",
  "scrim", "shadow",
];

const VARIANT_CLASS_NAMES = {
  "tonal-spot": "SchemeTonalSpot",
  fidelity: "SchemeFidelity",
  vibrant: "SchemeVibrant",
  expressive: "SchemeExpressive",
  neutral: "SchemeNeutral",
  monochrome: "SchemeMonochrome",
};

async function loadColorUtilities() {
  try {
    return await import("@material/material-color-utilities");
  } catch {
    try {
      // カレントディレクトリや NODE_PATH 配下にインストールされている場合にも対応
      const nodePathParents = (process.env.NODE_PATH ?? "").split(path.delimiter).filter(Boolean).map((dir) => path.dirname(dir));
      const resolvedPath = require.resolve("@material/material-color-utilities", { paths: [process.cwd(), ...nodePathParents] });
      return await import(pathToFileURL(resolvedPath).href);
    } catch {
      console.error("@material/material-color-utilities が見つかりません。`npm install -D @material/material-color-utilities@0.3.0` を実行してください。");
      process.exit(1);
    }
  }
}

function parseArgs(argv) {
  const options = { seedHex: null, format: "css", variant: "tonal-spot", contrast: 0 };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--format") options.format = argv[++i];
    else if (arg === "--variant") options.variant = argv[++i];
    else if (arg === "--contrast") options.contrast = Number(argv[++i]);
    else if (!arg.startsWith("--")) options.seedHex = arg;
  }
  if (!options.seedHex || !/^#?[0-9a-fA-F]{6}$/.test(options.seedHex)) {
    console.error('使い方: node generate-palette.mjs "#RRGGBB" [--format css|ts|json] [--variant tonal-spot|fidelity|...] [--contrast -1..1]');
    process.exit(1);
  }
  if (!options.seedHex.startsWith("#")) options.seedHex = `#${options.seedHex}`;
  if (!VARIANT_CLASS_NAMES[options.variant]) {
    console.error(`未対応のvariantです: ${options.variant}（${Object.keys(VARIANT_CLASS_NAMES).join(", ")}）`);
    process.exit(1);
  }
  return options;
}

function resolveDynamicColor(utilities, roleName) {
  const { MaterialDynamicColors } = utilities;
  // バージョンによって静的プロパティ / インスタンスプロパティの違いがあるため両方試す
  if (MaterialDynamicColors[roleName]) return MaterialDynamicColors[roleName];
  const instance = new MaterialDynamicColors();
  if (typeof instance[roleName] === "function") return instance[roleName]();
  return instance[roleName];
}

function buildColorRoles(utilities, options, isDark) {
  const { Hct, argbFromHex, hexFromArgb } = utilities;
  const SchemeClass = utilities[VARIANT_CLASS_NAMES[options.variant]];
  const scheme = new SchemeClass(Hct.fromInt(argbFromHex(options.seedHex)), isDark, options.contrast);
  const roles = {};
  for (const roleName of COLOR_ROLE_NAMES) {
    const dynamicColor = resolveDynamicColor(utilities, roleName);
    roles[roleName] = hexFromArgb(dynamicColor.getArgb(scheme)).toUpperCase();
  }
  return roles;
}

function toKebabCase(name) {
  return name.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

function formatCssBlock(roles, indent) {
  return Object.entries(roles)
    .map(([roleName, hex]) => `${indent}--md-sys-color-${toKebabCase(roleName)}: ${hex};`)
    .join("\n");
}

function formatCss(lightRoles, darkRoles, options) {
  return [
    `/* Generated from ${options.seedHex} (variant: ${options.variant}, contrast: ${options.contrast}) */`,
    ":root, [data-theme=\"light\"] {",
    formatCssBlock(lightRoles, "  "),
    "}",
    "@media (prefers-color-scheme: dark) {",
    "  :root:not([data-theme=\"light\"]) {",
    formatCssBlock(darkRoles, "    "),
    "  }",
    "}",
    "[data-theme=\"dark\"] {",
    formatCssBlock(darkRoles, "  "),
    "}",
  ].join("\n");
}

function formatTs(lightRoles, darkRoles, options) {
  const toObjectLiteral = (roles) => Object.entries(roles).map(([roleName, hex]) => `  ${roleName}: "${hex}",`).join("\n");
  return [
    `// Generated from ${options.seedHex} (variant: ${options.variant}, contrast: ${options.contrast})`,
    `export type M3ColorRoles = Record<${COLOR_ROLE_NAMES.map((name) => `"${name}"`).join(" | ")}, string>;`,
    "",
    "export const LIGHT_COLOR_ROLES: M3ColorRoles = {",
    toObjectLiteral(lightRoles),
    "};",
    "",
    "export const DARK_COLOR_ROLES: M3ColorRoles = {",
    toObjectLiteral(darkRoles),
    "};",
  ].join("\n");
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const utilities = await loadColorUtilities();
  const lightRoles = buildColorRoles(utilities, options, false);
  const darkRoles = buildColorRoles(utilities, options, true);

  if (options.format === "json") console.log(JSON.stringify({ seed: options.seedHex, variant: options.variant, light: lightRoles, dark: darkRoles }, null, 2));
  else if (options.format === "ts") console.log(formatTs(lightRoles, darkRoles, options));
  else console.log(formatCss(lightRoles, darkRoles, options));
}

main();
