import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-bold tracking-[0.8px] uppercase transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        /* Duolingo primary CTA — verde com sombra inferior pressionável.
           Texto preto: branco sobre #58cc02 fica em ~2.1:1 de contraste (falha WCAG AA). */
        primary:
          "rounded-[12px] bg-[#58cc02] text-black shadow-[0_4px_0_0_#58a700] hover:bg-[#5ad002] active:shadow-none active:translate-y-[4px]",
        /* Duolingo secondary — borda sutil, texto azul céu */
        outline:
          "rounded-[12px] border-2 border-[#e5e5e5] dark:border-[#3a3a3a] bg-white text-[#1cb0f6] hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a] active:translate-y-[2px]",
        /* Ghost — sem borda, texto verde */
        ghost: "rounded-[12px] text-[#58cc02] hover:bg-[#d7ffb8]/40 dark:hover:bg-[#58cc02]/10 active:bg-[#d7ffb8]/60 dark:active:bg-[#58cc02]/20",
        /* Social — branco com borda leve, usado em login Google/Apple */
        social:
          "rounded-[12px] border-2 border-[#e5e5e5] dark:border-[#3a3a3a] bg-white text-[#3c3c3c] dark:text-foreground shadow-sm hover:bg-[#f7f7f7] dark:hover:bg-[#2a2a2a] active:translate-y-[2px]",
        /* Destructive */
        destructive:
          "rounded-[12px] bg-destructive text-destructive-foreground shadow-[0_4px_0_0_hsl(var(--destructive)/0.6)] hover:bg-destructive/90 active:shadow-none active:translate-y-[4px]",
      },
      size: {
        default: "h-12 px-6 text-[15px]",
        lg: "h-14 px-8 text-[15px]",
        sm: "h-10 px-4 text-[13px]",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)
