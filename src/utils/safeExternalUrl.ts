export function safeExternalUrl(value: string): string | null {
  const trimmedValue = value.trim();

  if (!/^https?:\/\//i.test(trimmedValue)) {
    return null;
  }

  try {
    const url = new URL(trimmedValue);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    return url.href;
  } catch {
    return null;
  }
}