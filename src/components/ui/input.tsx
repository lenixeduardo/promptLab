import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Optional leading icon rendered inside the pill */
  icon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, type = "text", ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {icon && (
          <span className="pointer-events-none absolute left-4 flex h-7 w-7 items-center justify-center text-primary">
            {icon}
          </span>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            /* Duolingo input: rounded 12px, border-subtle, text duolingo-sans 17px/500 */
            "h-14 w-full rounded-[12px] border-2 border-[#e5e5e5] dark:border-[#3a3a3a] bg-white text-[17px] font-medium leading-[20px] text-[#3c3c3c] dark:text-foreground placeholder:text-[#afafaf] shadow-sm transition-colors focus-visible:outline-none focus-visible:border-[#58cc02] focus-visible:ring-2 focus-visible:ring-[#58cc02]/20",
            icon ? "pl-14 pr-5" : "px-5",
            className
          )}
          {...props}
        />
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
