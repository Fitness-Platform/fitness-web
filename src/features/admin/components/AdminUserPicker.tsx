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
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  useEffect(() => {
    const timer = window.setTimeout(() => setEmail(search.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [search]);
  const query = useAdminUsersQuery(email);
  const results = query.data ?? [];
  const options =
    value && !results.some((user) => user.id === value.id)
      ? [value, ...results]
      : results;
  return (
    <fieldset disabled={disabled} className="min-w-0">
      <label className={structureLabel} htmlFor={`${id}-search`}>
        Search clients by email
      </label>
      <input
        id={`${id}-search`}
        type="search"
        autoComplete="off"
        placeholder="Search email"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className={structureInput}
      />
      <label className={structureLabel + " mt-4"} htmlFor={`${id}-client`}>
        {label}
        {optional ? "" : " *"}
      </label>
      <select
        id={`${id}-client`}
        value={value?.id ?? ""}
        onChange={(event) =>
          onChange(
            options.find((user) => user.id === event.target.value) ?? null,
          )
        }
        className={structureInput}
        aria-invalid={Boolean(error)}
        aria-describedby={`${id}-status ${id}-error`}
      >
        <option value="">{optional ? "All clients" : "Select a client"}</option>
        {options.map((user) => (
          <option key={user.id} value={user.id}>
            {user.email} · {user.role}
          </option>
        ))}
      </select>
      <div
        id={`${id}-status`}
        aria-live="polite"
        className="mt-2 text-xs leading-5 text-muted-foreground"
      >
        {query.isPending || search.trim() !== email
          ? "Searching clients..."
          : query.isError
            ? "Unable to search clients."
            : !results.length
              ? "No users match this email search."
              : `${results.length} ${results.length === 1 ? "client" : "clients"} found.`}
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
