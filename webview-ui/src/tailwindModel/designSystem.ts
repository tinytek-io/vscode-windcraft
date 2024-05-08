import { __unstable__loadDesignSystem as loadDesignSystem } from "tailwindcss";

// TODO: Load the actual project design system this is just a placeholder for now
const cssFile = `
@theme {
  /* Defaults */
  --default-transition-duration: 150ms;
  --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  --default-font-family: var(--font-family-sans);
  --default-font-feature-settings: var(--font-family-sans--font-feature-settings);
  --default-font-variation-settings: var(--font-family-sans--font-variation-settings);
  --default-mono-font-family: var(--font-family-mono);
  --default-mono-font-feature-settings: var(--font-family-mono--font-feature-settings);
  --default-mono-font-variation-settings: var(--font-family-mono--font-variation-settings);

  /* Breakpoints */
  --breakpoint-sm: 40rem;
  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;
  --breakpoint-xl: 80rem;
  --breakpoint-2xl: 96rem;

  /* Colors */
  --color-black: #000;
  --color-white: #fff;
  --color-slate-50: #f8fafc;
  --color-slate-100: #f1f5f9;
  --color-slate-200: #e2e8f0;
  --color-slate-300: #cbd5e1;
  --color-slate-400: #94a3b8;
  --color-slate-500: #64748b;
  --color-slate-600: #475569;
  --color-slate-700: #334155;
  --color-slate-800: #1e293b;
  --color-slate-900: #0f172a;
  --color-slate-950: #020617;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  --color-gray-950: #030712;
  --color-zinc-50: #fafafa;
  --color-zinc-100: #f4f4f5;
  --color-zinc-200: #e4e4e7;
  --color-zinc-300: #d4d4d8;
  --color-zinc-400: #a1a1aa;
  --color-zinc-500: #71717a;
  --color-zinc-600: #52525b;
  --color-zinc-700: #3f3f46;
  --color-zinc-800: #27272a;
  --color-zinc-900: #18181b;
  --color-zinc-950: #09090b;
  --color-neutral-50: #fafafa;
  --color-neutral-100: #f5f5f5;
  --color-neutral-200: #e5e5e5;
  --color-neutral-300: #d4d4d4;
  --color-neutral-400: #a3a3a3;
  --color-neutral-500: #737373;
  --color-neutral-600: #525252;
  --color-neutral-700: #404040;
  --color-neutral-800: #262626;
  --color-neutral-900: #171717;
  --color-neutral-950: #0a0a0a;
  --color-stone-50: #fafaf9;
  --color-stone-100: #f5f5f4;
  --color-stone-200: #e7e5e4;
  --color-stone-300: #d6d3d1;
  --color-stone-400: #a8a29e;
  --color-stone-500: #78716c;
  --color-stone-600: #57534e;
  --color-stone-700: #44403c;
  --color-stone-800: #292524;
  --color-stone-900: #1c1917;
  --color-stone-950: #0c0a09;
  --color-red-50: #fef2f2;
  --color-red-100: #fee2e2;
  --color-red-200: #fecaca;
  --color-red-300: #fca5a5;
  --color-red-400: #f87171;
  --color-red-500: #ef4444;
  --color-red-600: #dc2626;
  --color-red-700: #b91c1c;
  --color-red-800: #991b1b;
  --color-red-900: #7f1d1d;
  --color-red-950: #450a0a;
  --color-orange-50: #fff7ed;
  --color-orange-100: #ffedd5;
  --color-orange-200: #fed7aa;
  --color-orange-300: #fdba74;
  --color-orange-400: #fb923c;
  --color-orange-500: #f97316;
  --color-orange-600: #ea580c;
  --color-orange-700: #c2410c;
  --color-orange-800: #9a3412;
  --color-orange-900: #7c2d12;
  --color-orange-950: #431407;
  --color-amber-50: #fffbeb;
  --color-amber-100: #fef3c7;
  --color-amber-200: #fde68a;
  --color-amber-300: #fcd34d;
  --color-amber-400: #fbbf24;
  --color-amber-500: #f59e0b;
  --color-amber-600: #d97706;
  --color-amber-700: #b45309;
  --color-amber-800: #92400e;
  --color-amber-900: #78350f;
  --color-amber-950: #451a03;
  --color-yellow-50: #fefce8;
  --color-yellow-100: #fef9c3;
  --color-yellow-200: #fef08a;
  --color-yellow-300: #fde047;
  --color-yellow-400: #facc15;
  --color-yellow-500: #eab308;
  --color-yellow-600: #ca8a04;
  --color-yellow-700: #a16207;
  --color-yellow-800: #854d0e;
  --color-yellow-900: #713f12;
  --color-yellow-950: #422006;
  --color-lime-50: #f7fee7;
  --color-lime-100: #ecfccb;
  --color-lime-200: #d9f99d;
  --color-lime-300: #bef264;
  --color-lime-400: #a3e635;
  --color-lime-500: #84cc16;
  --color-lime-600: #65a30d;
  --color-lime-700: #4d7c0f;
  --color-lime-800: #3f6212;
  --color-lime-900: #365314;
  --color-lime-950: #1a2e05;
  --color-green-50: #f0fdf4;
  --color-green-100: #dcfce7;
  --color-green-200: #bbf7d0;
  --color-green-300: #86efac;
  --color-green-400: #4ade80;
  --color-green-500: #22c55e;
  --color-green-600: #16a34a;
  --color-green-700: #15803d;
  --color-green-800: #166534;
  --color-green-900: #14532d;
  --color-green-950: #052e16;
  --color-emerald-50: #ecfdf5;
  --color-emerald-100: #d1fae5;
  --color-emerald-200: #a7f3d0;
  --color-emerald-300: #6ee7b7;
  --color-emerald-400: #34d399;
  --color-emerald-500: #10b981;
  --color-emerald-600: #059669;
  --color-emerald-700: #047857;
  --color-emerald-800: #065f46;
  --color-emerald-900: #064e3b;
  --color-emerald-950: #022c22;
  --color-teal-50: #f0fdfa;
  --color-teal-100: #ccfbf1;
  --color-teal-200: #99f6e4;
  --color-teal-300: #5eead4;
  --color-teal-400: #2dd4bf;
  --color-teal-500: #14b8a6;
  --color-teal-600: #0d9488;
  --color-teal-700: #0f766e;
  --color-teal-800: #115e59;
  --color-teal-900: #134e4a;
  --color-teal-950: #042f2e;
  --color-cyan-50: #ecfeff;
  --color-cyan-100: #cffafe;
  --color-cyan-200: #a5f3fc;
  --color-cyan-300: #67e8f9;
  --color-cyan-400: #22d3ee;
  --color-cyan-500: #06b6d4;
  --color-cyan-600: #0891b2;
  --color-cyan-700: #0e7490;
  --color-cyan-800: #155e75;
  --color-cyan-900: #164e63;
  --color-cyan-950: #083344;
  --color-sky-50: #f0f9ff;
  --color-sky-100: #e0f2fe;
  --color-sky-200: #bae6fd;
  --color-sky-300: #7dd3fc;
  --color-sky-400: #38bdf8;
  --color-sky-500: #0ea5e9;
  --color-sky-600: #0284c7;
  --color-sky-700: #0369a1;
  --color-sky-800: #075985;
  --color-sky-900: #0c4a6e;
  --color-sky-950: #082f49;
  --color-blue-50: #eff6ff;
  --color-blue-100: #dbeafe;
  --color-blue-200: #bfdbfe;
  --color-blue-300: #93c5fd;
  --color-blue-400: #60a5fa;
  --color-blue-500: #3b82f6;
  --color-blue-600: #2563eb;
  --color-blue-700: #1d4ed8;
  --color-blue-800: #1e40af;
  --color-blue-900: #1e3a8a;
  --color-blue-950: #172554;
  --color-indigo-50: #eef2ff;
  --color-indigo-100: #e0e7ff;
  --color-indigo-200: #c7d2fe;
  --color-indigo-300: #a5b4fc;
  --color-indigo-400: #818cf8;
  --color-indigo-500: #6366f1;
  --color-indigo-600: #4f46e5;
  --color-indigo-700: #4338ca;
  --color-indigo-800: #3730a3;
  --color-indigo-900: #312e81;
  --color-indigo-950: #1e1b4b;
  --color-violet-50: #f5f3ff;
  --color-violet-100: #ede9fe;
  --color-violet-200: #ddd6fe;
  --color-violet-300: #c4b5fd;
  --color-violet-400: #a78bfa;
  --color-violet-500: #8b5cf6;
  --color-violet-600: #7c3aed;
  --color-violet-700: #6d28d9;
  --color-violet-800: #5b21b6;
  --color-violet-900: #4c1d95;
  --color-violet-950: #2e1065;
  --color-purple-50: #faf5ff;
  --color-purple-100: #f3e8ff;
  --color-purple-200: #e9d5ff;
  --color-purple-300: #d8b4fe;
  --color-purple-400: #c084fc;
  --color-purple-500: #a855f7;
  --color-purple-600: #9333ea;
  --color-purple-700: #7e22ce;
  --color-purple-800: #6b21a8;
  --color-purple-900: #581c87;
  --color-purple-950: #3b0764;
  --color-fuchsia-50: #fdf4ff;
  --color-fuchsia-100: #fae8ff;
  --color-fuchsia-200: #f5d0fe;
  --color-fuchsia-300: #f0abfc;
  --color-fuchsia-400: #e879f9;
  --color-fuchsia-500: #d946ef;
  --color-fuchsia-600: #c026d3;
  --color-fuchsia-700: #a21caf;
  --color-fuchsia-800: #86198f;
  --color-fuchsia-900: #701a75;
  --color-fuchsia-950: #4a044e;
  --color-pink-50: #fdf2f8;
  --color-pink-100: #fce7f3;
  --color-pink-200: #fbcfe8;
  --color-pink-300: #f9a8d4;
  --color-pink-400: #f472b6;
  --color-pink-500: #ec4899;
  --color-pink-600: #db2777;
  --color-pink-700: #be185d;
  --color-pink-800: #9d174d;
  --color-pink-900: #831843;
  --color-pink-950: #500724;
  --color-rose-50: #fff1f2;
  --color-rose-100: #ffe4e6;
  --color-rose-200: #fecdd3;
  --color-rose-300: #fda4af;
  --color-rose-400: #fb7185;
  --color-rose-500: #f43f5e;
  --color-rose-600: #e11d48;
  --color-rose-700: #be123c;
  --color-rose-800: #9f1239;
  --color-rose-900: #881337;
  --color-rose-950: #4c0519;

  /* Animations */
  --animate-spin: spin 1s linear infinite;
  --animate-ping: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
  --animate-pulse: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-bounce: bounce 1s infinite;

  /* Blurs */
  --blur: 8px;
  --blur-sm: 4px;
  --blur-md: 12px;
  --blur-lg: 16px;
  --blur-xl: 24px;
  --blur-2xl: 40px;
  --blur-3xl: 64px;

  /* Radii */
  --radius: 0.25rem;
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;

  /* Shadows */
  --shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-xs: 0 1px rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);

  /* Inset shadows */
  --inset-shadow-xs: inset 0 1px rgb(0 0 0 / 0.05);
  --inset-shadow-sm: inset 0 1px 1px rgb(0 0 0 / 0.05);
  --inset-shadow: inset 0 2px 4px rgb(0 0 0 / 0.05);

  /* Drop shadows */
  --drop-shadow: 0 1px 2px rgb(0 0 0 / 0.1), 0 1px 1px rgb(0 0 0 / 0.06);
  --drop-shadow-sm: 0 1px 1px rgb(0 0 0 / 0.05);
  --drop-shadow-md: 0 4px 3px rgb(0 0 0 / 0.07), 0 2px 2px rgb(0 0 0 / 0.06);
  --drop-shadow-lg: 0 10px 8px rgb(0 0 0 / 0.04), 0 4px 3px rgb(0 0 0 / 0.1);
  --drop-shadow-xl: 0 20px 13px rgb(0 0 0 / 0.03), 0 8px 5px rgb(0 0 0 / 0.08);
  --drop-shadow-2xl: 0 25px 25px rgb(0 0 0 / 0.15);

  /* Spacing */
  --spacing-px: 1px;
  --spacing-0: 0px;
  --spacing-0_5: 0.125rem;
  --spacing-1: 0.25rem;
  --spacing-1_5: 0.375rem;
  --spacing-2: 0.5rem;
  --spacing-2_5: 0.625rem;
  --spacing-3: 0.75rem;
  --spacing-3_5: 0.875rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-7: 1.75rem;
  --spacing-8: 2rem;
  --spacing-9: 2.25rem;
  --spacing-10: 2.5rem;
  --spacing-11: 2.75rem;
  --spacing-12: 3rem;
  --spacing-14: 3.5rem;
  --spacing-16: 4rem;
  --spacing-20: 5rem;
  --spacing-24: 6rem;
  --spacing-28: 7rem;
  --spacing-32: 8rem;
  --spacing-36: 9rem;
  --spacing-40: 10rem;
  --spacing-44: 11rem;
  --spacing-48: 12rem;
  --spacing-52: 13rem;
  --spacing-56: 14rem;
  --spacing-60: 15rem;
  --spacing-64: 16rem;
  --spacing-72: 18rem;
  --spacing-80: 20rem;
  --spacing-96: 24rem;

  /* Widths */
  --width-3xs: 16rem;
  --width-2xs: 18rem;
  --width-xs: 20rem;
  --width-sm: 24rem;
  --width-md: 28rem;
  --width-lg: 32rem;
  --width-xl: 36rem;
  --width-2xl: 42rem;
  --width-3xl: 48rem;
  --width-4xl: 56rem;
  --width-5xl: 64rem;
  --width-6xl: 72rem;
  --width-7xl: 80rem;
  --width-prose: 65ch;

  /* Fonts */
  --font-family-sans: ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol', 'Noto Color Emoji';
  --font-family-serif: ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif;
  --font-family-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    'Courier New', monospace;

  /* Type scale */
  --font-size-xs: 0.75rem;
  --font-size-xs--line-height: 1rem;
  --font-size-sm: 0.875rem;
  --font-size-sm--line-height: 1.25rem;
  --font-size-base: 1rem;
  --font-size-base--line-height: 1.5rem;
  --font-size-lg: 1.125rem;
  --font-size-lg--line-height: 1.75rem;
  --font-size-xl: 1.25rem;
  --font-size-xl--line-height: 1.75rem;
  --font-size-2xl: 1.5rem;
  --font-size-2xl--line-height: 2rem;
  --font-size-3xl: 1.875rem;
  --font-size-3xl--line-height: 2.25rem;
  --font-size-4xl: 2.25rem;
  --font-size-4xl--line-height: 2.5rem;
  --font-size-5xl: 3rem;
  --font-size-5xl--line-height: 1;
  --font-size-6xl: 3.75rem;
  --font-size-6xl--line-height: 1;
  --font-size-7xl: 4.5rem;
  --font-size-7xl--line-height: 1;
  --font-size-8xl: 6rem;
  --font-size-8xl--line-height: 1;
  --font-size-9xl: 8rem;
  --font-size-9xl--line-height: 1;

  /* Letter spacing */
  --letter-spacing-tighter: -0.05em;
  --letter-spacing-tight: -0.025em;
  --letter-spacing-normal: 0em;
  --letter-spacing-wide: 0.025em;
  --letter-spacing-wider: 0.05em;
  --letter-spacing-widest: 0.1em;

  /* Line-height */
  --line-height-none: 1;
  --line-height-tight: 1.25;
  --line-height-snug: 1.375;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.625;
  --line-height-loose: 2;
  --line-height-3: 0.75rem;
  --line-height-4: 1rem;
  --line-height-5: 1.25rem;
  --line-height-6: 1.5rem;
  --line-height-7: 1.75rem;
  --line-height-8: 2rem;
  --line-height-9: 2.25rem;
  --line-height-10: 2.5rem;

  /* 3D perspectives */
  --perspective-dramatic: 100px;
  --perspective-near: 300px;
  --perspective-normal: 500px;
  --perspective-midrange: 800px;
  --perspective-distant: 1200px;

  /* Transition timing functions */
  --transition-timing-function-linear: linear;
  --transition-timing-function-in: cubic-bezier(0.4, 0, 1, 1);
  --transition-timing-function-out: cubic-bezier(0, 0, 0.2, 1);
  --transition-timing-function-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes ping {
    75%,
    100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  @keyframes pulse {
    50% {
      opacity: 0.5;
    }
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(-25%);
      animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
    }

    50% {
      transform: none;
      animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
    }
  }
}
`;

export const designSystem = loadDesignSystem(cssFile);

function bigIntSign(bigIntValue: bigint) {
  return bigIntValue < 0n ? -1 : bigIntValue > 0n ? 1 : 0;
}

export function sortClassList(classList: string[]) {
  return designSystem
    .getClassOrder(classList)
    .sort(([, a], [, z]) => {
      if (a === z) {
        return 0;
      }
      // if (a === null) return options.unknownClassPosition === 'start' ? -1 : 1
      // if (z === null) return options.unknownClassPosition === 'start' ? 1 : -1
      if (a === null) {
        return -1;
      }
      if (z === null) {
        return 1;
      }
      return bigIntSign(a - z);
    })
    .map(([className]) => className);
}
