import React from "react";

/**
 * Button component using global styles and tailwind utility classes.
 * @param {object} props
 * @param {"primary"|"secondary"} props.variant
 * @param {string} [props.as] - "a" or "button"
 * @param {React.ReactNode} props.children
 * @param {any} props.rest - All other props (href, onClick, etc.)
 */
export default function Button({ variant = "primary", as = "button", children, ...rest }) {
  const className = variant === "primary" ? "btn-primary" : "btn-secondary";
  if (as === "a") {
    return (
      <a className={className} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
} 