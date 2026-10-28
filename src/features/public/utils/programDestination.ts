// Only program sales destinations may be carried through authentication.
export const programIdPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function programReturnTo(search: string): string | null {
  const destination = new URLSearchParams(search).get("returnTo");
  if (!destination?.startsWith("/programs/")) return null;
  return programIdPattern.test(destination.slice("/programs/".length))
    ? destination
    : null;
}

export function authDestination(
  path: "/login" | "/register",
  returnTo: string | null,
) {
  return returnTo ? `${path}?${new URLSearchParams({ returnTo })}` : path;
}
