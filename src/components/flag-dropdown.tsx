"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { Flag } from "./flag";

type Item = {
  id: string;
  /** Code ISO du drapeau (ex. ng). */
  flag: string;
  title: string;
  subtitle: string;
};

type Props = {
  label: string;
  value: string;
  items: Item[];
  onChange: (id: string) => void;
  buttonText: string;
  align?: "left" | "right";
  wide?: boolean;
  header?: ReactNode;
};

/** Liste déroulante avec drapeaux image. */
export function FlagDropdown({
  label,
  value,
  items,
  onChange,
  buttonText,
  align = "right",
  wide = false,
  header,
}: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const current = items.find((item) => item.id === value) ?? items[0];

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="flex min-h-11 items-center gap-1.5 rounded-[10px] border border-[var(--line)] px-2.5 text-sm font-bold hover:border-[var(--ink)]"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
      >
        {current ? <Flag code={current.flag} className="h-4 w-6" /> : null}
        <span className="max-w-[4.5rem] truncate uppercase tracking-wide">{buttonText}</span>
        <span aria-hidden className="text-[0.65rem] opacity-50">
          ▾
        </span>
      </button>

      {open ? (
        <div
          className={`absolute z-50 mt-2 overflow-hidden rounded-2xl border border-[var(--line)] bg-white shadow-[0_18px_40px_-20px_rgba(22,24,35,0.45)] ${
            align === "right" ? "right-0" : "left-0"
          } ${wide ? "w-[min(22rem,calc(100vw-1.5rem))]" : "w-[min(18rem,calc(100vw-1.5rem))]"}`}
        >
          {header ? (
            <div className="border-b border-[var(--line)] px-3 py-2.5 text-xs font-semibold text-[var(--ink-soft)]">{header}</div>
          ) : null}
          <ul id={listId} role="listbox" aria-label={label} className="max-h-[min(70vh,22rem)] overflow-auto py-1">
            {items.map((item) => {
              const selected = item.id === current?.id;
              return (
                <li key={item.id} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm font-semibold hover:bg-[var(--wall)] ${
                      selected ? "bg-[var(--main-soft)] text-[var(--main-deep)]" : ""
                    }`}
                    onClick={() => {
                      onChange(item.id);
                      setOpen(false);
                    }}
                  >
                    <Flag code={item.flag} className="h-5 w-7 shrink-0" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{item.title}</span>
                      <span className="block truncate text-xs font-medium text-[var(--muted)]">{item.subtitle}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
