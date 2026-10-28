import { usePublicPrograms } from "../hooks/usePublicProgram";
import { formatProgramPrice } from "../utils/programPrice";
import PublicHeader from "../components/PublicHeader";
import HomeHero from "../components/HomeHero";
import HomePrinciples from "../components/HomePrinciples";
import HomePhilosophy from "../components/HomePhilosophy";
import HomePrograms from "../components/HomePrograms";
import HomeAboutDaniela from "../components/HomeAboutDaniela";
import HomeFinalCta from "../components/HomeFinalCta";
import PublicFooter from "../components/PublicFooter";

export default function HomePage() {
  const programs = usePublicPrograms();
  // Home has one featured product. Multiple results need an explicit product-selection rule.
  const featured =
    programs.isSuccess && programs.data.length === 1
      ? programs.data[0]
      : undefined;
  const programHref = featured ? `/programs/${featured.id}` : undefined;
  const price = featured ? formatProgramPrice(featured) : null;
  return (
    <div className="bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4"
      >
        Skip to content
      </a>
      <PublicHeader />
      <main id="main-content">
        <HomeHero programHref={programHref} />
        <HomePrinciples />
        <HomePrograms
          programHref={programHref}
          price={price}
          loading={programs.isPending}
        />
        <HomePhilosophy />
        <HomeAboutDaniela />
        <HomeFinalCta programHref={programHref} price={price} />
      </main>
      <PublicFooter />
    </div>
  );
}
