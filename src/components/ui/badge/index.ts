import type { VariantProps } from "class-variance-authority"
import { cva } from "class-variance-authority"

export { default as Badge } from "./Badge.vue"

export const badgeVariants = cva(
  "inline-flex gap-1 items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        base: "border-transparent bg-base-30 text-base-80 hover:bg-base-40",
        primary: "border-transparent bg-primary-20 text-primary-80 shadow hover:bg-primary-30",
        info: "border-transparent bg-info-30 text-info-90 hover:bg-info-40",
        positive: "border-transparent bg-positive-30 text-positive-90 hover:bg-positive-40",
        error: "border-transparent bg-error-30 text-error-80 shadow hover:bg-error-40",
        warning: "border-transparent bg-warning-20 text-warning-70 hover:bg-warning-30",
        outline: "border-base-50 bg-transparent text-base-80 hover:bg-base-20",
      },
    },
    defaultVariants: {
      variant: "base",
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
