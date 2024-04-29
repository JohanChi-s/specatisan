import * as React from "react";
import { mergeRefs } from "react-merge-refs";
import { cn } from "@/lib/utils";

export interface Props
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>,
    "prefix"
  > {
  type?: "text" | "email" | "checkbox" | "search" | "textarea";
  labelHidden?: boolean;
  label?: string;
  flex?: boolean;
  short?: boolean;
  margin?: string | number;
  error?: string;
  prefix?: React.ReactNode;
  icon?: React.ReactNode;
  autoSelect?: boolean;
  onRequestSubmit?: (
    ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => unknown;
  onFocus?: (ev: React.SyntheticEvent) => unknown;
  onBlur?: (ev: React.SyntheticEvent) => unknown;
}

function Input(
  props: Props,
  ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement>
) {
  const internalRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>();
  const [focused, setFocused] = React.useState(false);

  const handleBlur = (ev: React.SyntheticEvent) => {
    setFocused(false);

    if (props.onBlur) {
      props.onBlur(ev);
    }
  };

  const handleFocus = (ev: React.SyntheticEvent) => {
    setFocused(true);

    if (props.onFocus) {
      props.onFocus(ev);
    }
  };

  const handleKeyDown = (
    ev: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (ev.key === "Enter" && ev.metaKey) {
      if (props.onRequestSubmit) {
        props.onRequestSubmit(ev);
      }
    }

    if (props.onKeyDown) {
      props.onKeyDown(ev);
    }
  };

  React.useEffect(() => {
    if (props.autoSelect && internalRef.current) {
      internalRef.current.select();
    }
  }, [props.autoSelect, internalRef]);

  const {
    type = "text",
    icon,
    label,
    margin,
    error,
    className,
    short,
    flex,
    prefix,
    labelHidden,
    onFocus,
    onBlur,
    onRequestSubmit,
    children,
    ...rest
  } = props;

  const wrappedLabel = <span>{label}</span>;

  return (
    <div
      className={cn(`flex ${short ? "w-1/2" : "w-auto"} max-w-350`, className)}
    >
      <label>
        {label && (labelHidden ? <div>{wrappedLabel}</div> : wrappedLabel)}
        <div>
          {prefix}
          {icon && <span className="relative left-4 w-6 h-6">{icon}</span>}
          {type === "textarea" ? (
            <textarea
              ref={mergeRefs([
                internalRef,
                ref as React.RefObject<HTMLTextAreaElement>,
              ])}
              onBlur={handleBlur}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              className={`border-0 flex-1 px-12 py-8 ${
                icon ? "pl-8" : "px-12"
              }`}
              {...rest}
            />
          ) : (
            <input
              ref={mergeRefs([
                internalRef,
                ref as React.RefObject<HTMLInputElement>,
              ])}
              onBlur={handleBlur}
              onFocus={handleFocus}
              onKeyDown={handleKeyDown}
              className="border-0 flex-1 px-12 py-8 min-w-0 text-base outline-none bg-transparent"
              type={type}
              {...rest}
            />
          )}
          {children}
        </div>
      </label>
      {error && (
        <span className="block mt-4">
          <span className="text-red-500 text-xs">{error}</span>
        </span>
      )}
    </div>
  );
}

export default React.forwardRef(Input);
