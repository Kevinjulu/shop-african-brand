import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";

export interface InputOTPProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  maxLength?: number;
  onComplete?: (value: string) => void;
}

const InputOTP = React.forwardRef<HTMLInputElement, InputOTPProps>(
  ({ className, maxLength = 6, onComplete, ...props }, ref) => {
    const [value, setValue] = React.useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      if (newValue.length <= maxLength) {
        setValue(newValue);
        if (newValue.length === maxLength && onComplete) {
          onComplete(newValue);
        }
      }
    };

    return (
      <Input
        ref={ref}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        className={cn(
          "text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
          className
        )}
        {...props}
      />
    );
  }
);
InputOTP.displayName = "InputOTP";

export { InputOTP };