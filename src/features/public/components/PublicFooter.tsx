import { container } from "./styles";

export default function PublicFooter({
  inverted = false,
  embedded = false,
}: {
  inverted?: boolean;
  embedded?: boolean;
}) {
  const Wrapper = embedded ? "div" : "footer";
  return (
    <Wrapper className={`${container} relative`}>
      <div
        className={`flex flex-col gap-2 border-t py-6 text-[11px] md:flex-row md:items-center md:justify-between md:py-4 ${inverted ? "border-white/25 text-[#F7F5F0]" : "border-border text-muted-foreground"}`}
      >
        <p>© 2026 Daniela Brito</p>
        <nav
          aria-label="Footer navigation"
          className="flex items-center gap-2 md:gap-6"
        >
          {/* TODO: Replace disabled placeholders when approved destinations exist. */}
          {["Privacy", "Terms", "Instagram"].map((label, index) => (
            <span key={label} className="inline-flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="md:hidden">
                  ·
                </span>
              )}
              <a
                role="link"
                aria-disabled="true"
                className="inline-flex min-h-11 items-center"
              >
                {label}
              </a>
            </span>
          ))}
        </nav>
      </div>
    </Wrapper>
  );
}
