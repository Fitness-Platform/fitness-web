import { useEffect, useId, useState } from "react";

import { useAdminUsersQuery } from "../hooks/useAdminUsersQuery";
import type { AdminUser } from "../types/adminUser";
import {
  structureButton,
  structureInput,
  structureLabel,
} from "./programStructureStyles";

export default function AdminUserPicker({
  value,
  onChange,
  disabled = false,
  error,
  label = "Client",
  optional = false,
}: {
  value: AdminUser | null;
  onChange: (user: AdminUser | null) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  optional?: boolean;
}) {
  const id = useId();

  const [draft, setDraft] = useState("");
  const [email, setEmail] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const search = isEditing ? draft : (value?.email ?? "");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setEmail(search.trim());
    }, 300);

    return () => window.clearTimeout(timer);
  }, [search]);

  const query = useAdminUsersQuery(email);
  const results = query.data ?? [];

  function selectUser(user: AdminUser) {
    setDraft(user.email);
    setIsEditing(false);
    setIsOpen(false);
    onChange(user);
  }

  function clearSelection() {
    setDraft("");
    setEmail("");
    setIsEditing(false);
    setIsOpen(false);
    onChange(null);
  }

  function handleSearchChange(nextValue: string) {
    setDraft(nextValue);
    setIsEditing(true);
    setIsOpen(true);

    if (value && nextValue !== value.email) {
      onChange(null);
    }

    if (!nextValue.trim() && optional) {
      onChange(null);
    }
  }

  const showResults =
    isOpen &&
    !query.isPending &&
    !query.isError &&
    results.length > 0;

  return (
    <fieldset disabled={disabled} className="min-w-0">
      <label className={structureLabel} htmlFor={`${id}-search`}>
        {label}
        {optional ? "" : " *"}
      </label>

      <div className="relative">
        <input
          id={`${id}-search`}
          type="search"
          autoComplete="off"
          placeholder={
            optional ? "Search or select a client" : "Search client email"
          }
          value={search}
          onFocus={() => {
            setDraft(value?.email ?? "");
            setIsEditing(true);
            setIsOpen(true);
          }}
          onChange={(event) => handleSearchChange(event.target.value)}
          onBlur={() => {
            window.setTimeout(() => {
              setIsOpen(false);
              setIsEditing(false);
            }, 150);
          }}
          className={structureInput}
          aria-invalid={Boolean(error)}
          aria-describedby={`${id}-status ${id}-error`}
          aria-expanded={showResults}
          aria-controls={`${id}-results`}
          aria-autocomplete="list"
        />

        {showResults && (
          <div
            id={`${id}-results`}
            className="absolute left-0 right-0 z-40 mt-1 max-h-64 overflow-y-auto border border-border bg-background shadow-sm"
          >
            {optional && (
              <button
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={clearSelection}
                className="flex min-h-12 w-full items-center px-4 text-left text-sm transition hover:bg-border/30"
              >
                All clients
              </button>
            )}

            {results.map((user) => (
              <button
                key={user.id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectUser(user)}
                className={[
                  "flex min-h-14 w-full items-center justify-between gap-4 border-t border-border px-4 text-left transition hover:bg-border/30",
                  value?.id === user.id ? "bg-primary/10" : "",
                ].join(" ")}
              >
                <span className="min-w-0 truncate text-sm">
                  {user.email}
                </span>

                <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {user.role}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div
        id={`${id}-status`}
        aria-live="polite"
        className="mt-2 text-xs leading-5 text-muted-foreground"
      >
        {query.isPending || search.trim() !== email
          ? "Searching clients..."
          : query.isError
            ? "Unable to search clients."
            : search.trim() && !results.length
              ? "No users match this email."
              : value
                ? `${value.email} selected.`
                : optional
                  ? "All clients."
                  : "Search by email to select a client."}
      </div>

      {query.isError && (
        <button
          type="button"
          onClick={() => query.refetch()}
          className={structureButton + " mt-2"}
        >
          Retry client search
        </button>
      )}

      <p id={`${id}-error`} className="mt-2 text-xs text-red-700">
        {error}
      </p>
    </fieldset>
  );
}