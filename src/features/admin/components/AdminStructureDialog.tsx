import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

type Props = {
  title: string;
  description: string;
  pending: boolean;
  drawer?: boolean;
  onClose: () => void;
  children: ReactNode;
};

// Native modal dialogs provide focus containment and make the background inert.
export default function AdminStructureDialog({
  title,
  description,
  pending,
  drawer = false,
  onClose,
  children,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const id = useId();
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const dialog = ref.current!;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (opener?.isConnected) opener.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (!first) {
          event.preventDefault();
          return;
        }
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !pending) onClose();
      }}
      className={
        drawer
          ? "fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-dvh w-full max-w-[540px] border-l border-border bg-background p-0 text-foreground backdrop:bg-foreground/30"
          : "fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-y-auto border border-border bg-background p-6 text-foreground backdrop:bg-foreground/30 sm:p-8"
      }
    >
      <div className={drawer ? "flex h-full flex-col" : ""}>
        <header
          className={
            drawer
              ? "flex shrink-0 items-start justify-between gap-4 border-b border-border px-6 py-7 sm:px-8"
              : ""
          }
        >
          <div>
            <p
              className={`text-[10px] font-medium uppercase tracking-[0.18em] ${drawer ? "text-primary-dark" : "text-red-700"}`}
            >
              Program Structure
            </p>
            <h2
              id={`${id}-title`}
              className="mt-3 text-2xl font-semibold tracking-tight"
            >
              {title}
            </h2>
            <p
              id={`${id}-description`}
              className="mt-3 text-sm leading-6 text-muted-foreground"
            >
              {description}
            </p>
          </div>
          {drawer && (
            <button
              type="button"
              aria-label="Close drawer"
              disabled={pending}
              onClick={onClose}
              className="flex min-h-11 min-w-11 items-center justify-center disabled:opacity-50"
            >
              <X size={20} aria-hidden="true" />
            </button>
          )}
        </header>
        {children}
      </div>
    </dialog>
  );
}
