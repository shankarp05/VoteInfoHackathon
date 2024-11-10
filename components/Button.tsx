// Button.tsx
import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Button({
  text,
  onClick,
  ...props
}: JSX.HTMLAttributes<HTMLButtonElement> & { text: string; onClick: () => void }) {
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      onClick={onClick}
      class="px-2 py-1 border-gray-500 border-2 rounded bg-white hover:bg-yellow-50 transition-colors"
    >
      {text}
    </button>
  );
}
