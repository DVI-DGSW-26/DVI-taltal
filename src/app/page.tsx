import { Suspense } from "react";
import { CrawlBanner } from "@/components/CrawlBanner";
import { SearchBar } from "@/components/SearchBar";
import { Filters } from "@/components/Filters";
import { ProgramResults } from "@/components/ProgramResults";
import { ProgramListSkeleton } from "@/components/Skeletons";
import { serverApi } from "@/lib/api";
import { parseProgramQuery, programQueryKey } from "@/lib/url";
import type { ProgramPage } from "@/lib/types";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

async function InitialResults({ query }: { query: ReturnType<typeof parseProgramQuery> }) {
  let initialPage: ProgramPage;
  try {
    initialPage = await serverApi.programs(query);
  } catch {
    initialPage = { items: [], page: query.page, size: query.size, total: 0, pages: 0 };
  }
  return <ProgramResults initialPage={initialPage} initialKey={programQueryKey(query)} />;
}

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const query = parseProgramQuery(sp);

  return (
    <div className="space-y-5">
      <CrawlBanner />

      <div>
        <h1 className="sr-only">지원사업 검색</h1>
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)_300px]">
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Filters />
        </aside>

        <section className="@container">
          <Suspense fallback={<ProgramListSkeleton />}>
            <InitialResults query={query} />
          </Suspense>
        </section>

        <div aria-hidden className="hidden lg:block" />
      </div>
    </div>
  );
}
