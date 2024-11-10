// Button.tsx
import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Button({
  text,
  href,
  onClick,
  ...props
}: JSX.HTMLAttributes<HTMLButtonElement> & { text: string; href?: string; onClick?: () => void }) {
  // Styling common to both button and anchor tags
  const baseClass =
    "inline-block px-4 py-2 rounded-lg font-semibold text-blue-600 border-2 border-blue-500 " +
    "transition-all duration-200 ease-out shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400";

  // Styling variations for hover and active states
  const hoverClass =
    "hover:bg-blue-500 hover:text-white active:bg-blue-600 active:shadow-inner";

  // If `href` is provided, render an anchor tag with improved styles
  if (href) {
    return (
      <a
        href={href}
        class={`${baseClass} ${hoverClass} bg-white`}
      >
        {text}
      </a>
    );
  }

  // Otherwise, render a button with an onClick handler and improved styles
  return (
    <button
      {...props}
      disabled={!IS_BROWSER || props.disabled}
      onClick={onClick}
      class={`${baseClass} ${hoverClass} bg-white`}
    >
      {text}
    </button>
  );
}
