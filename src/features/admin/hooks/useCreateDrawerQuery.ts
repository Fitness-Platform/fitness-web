import { useSearchParams } from "react-router-dom";

export function useCreateDrawerQuery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isOpen = searchParams.get("create") === "1";

  function setOpen(open: boolean) {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (open) next.set("create", "1");
        else next.delete("create");
        return next;
      },
      { replace: !open },
    );
  }

  return [isOpen, setOpen] as const;
}
