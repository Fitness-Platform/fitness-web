import { Link } from "react-router-dom";

export default function MemberNotFoundPage() {
  return (
    <section className="border border-border p-5 sm:p-6">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        This page is not available in your training area.
      </p>
      <Link
        to="/app"
        className="mt-4 inline-block text-sm text-primary-dark underline underline-offset-4"
      >
        Back to Member Home
      </Link>
    </section>
  );
}
