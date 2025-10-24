import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Button } from "./Button.vue"

export const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
      variants: {
        variant: {
          primary: "bg-primary-80 text-base-10 shadow hover:bg-primary-90",
          base: "bg-base-30 text-base-80 shadow-sm hover:bg-base-40",
          info: "bg-info-80 text-base-10 shadow hover:bg-info-90",
          positive: "bg-positive-80 text-base-10 shadow hover:bg-positive-90",
          error: "bg-error-80 text-base-10 shadow-sm hover:bg-error-90",
          warning: "bg-warning-70 text-base-10 shadow-sm hover:bg-warning-80",
          outline: "border border-base-50 bg-transparent text-base-80 shadow-sm hover:bg-base-20",
          ghost: "hover:bg-base-20 text-base-80",
          link: "text-primary-80 underline-offset-4 hover:underline",
        },
        size: {
          "default": "h-9 px-4 py-2 rounded-md",
          "xs": "h-7 px-2 rounded",
          "sm": "h-8 px-3 text-xs rounded-sm",
          "lg": "h-10 px-8 rounded-lg",
          "icon": "h-9 w-9 rounded-md",
          "icon-sm": "size-8 rounded-md",
          "icon-lg": "size-10 rounded-md",
        },
      },
      defaultVariants: {
        variant: "primary",
        size: "default",
      },
    },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
