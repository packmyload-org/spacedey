import Image from "next/image";

const navSkeletonWidths = ["w-14", "w-[4.5rem]", "w-14", "w-16", "w-12"];
const statsSkeletonWidths = ["w-20", "w-24", "w-[4.5rem]"];
const cardSkeletonHeights = ["h-48", "h-56", "h-52"];

export default function Loading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="min-h-screen bg-[#F6F8FF]"
    >
      <span className="sr-only">Loading Spacedey page</span>

      <div className="fixed inset-x-0 top-0 z-40">
        <div className="border-b-2 border-[#1642F0] bg-[#1642F0]">
          <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-3 lg:px-10">
            <div className="flex items-center">
              <Image
                src="/images/logo.png"
                alt="Spacedey Logo"
                width={107}
                height={28}
                priority
                style={{ height: "auto" }}
                className="rounded-xl"
              />
            </div>

            <div className="hidden items-center gap-8 lg:flex">
              {navSkeletonWidths.map((width) => (
                <div
                  key={width}
                  className={`h-4 ${width} animate-pulse rounded-full bg-white/25`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden h-12 w-36 animate-pulse rounded-full bg-[#D96541] lg:block" />
              <div className="h-10 w-10 animate-pulse rounded-full border-2 border-white/35 bg-white/15" />
            </div>
          </div>
        </div>
      </div>

      <section className="overflow-hidden bg-[#1642F0] px-4 pb-14 pt-28">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 flex w-fit items-center gap-3 rounded-xl bg-white px-4 py-2 shadow-lg">
            <div className="flex items-center">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="-ml-2 h-8 w-8 animate-pulse rounded-full border-2 border-white bg-[#DBEAFE]"
                />
              ))}
            </div>
            <div className="h-3 w-44 animate-pulse rounded-full bg-neutral-200" />
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <div className="mx-auto h-12 w-4/5 animate-pulse rounded-full bg-white/18 sm:h-16" />
            <div className="mx-auto mt-4 h-5 w-3/5 animate-pulse rounded-full bg-white/14" />

            <div className="mt-10 rounded-[28px] bg-white p-5 shadow-2xl">
              <div className="mb-5 flex flex-wrap justify-center gap-3 border-b border-neutral-200 pb-4">
                {statsSkeletonWidths.map((width) => (
                  <div
                    key={width}
                    className={`h-4 ${width} animate-pulse rounded-full bg-[#E9EEFF]`}
                  />
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="h-14 flex-1 animate-pulse rounded-2xl border border-neutral-200 bg-[#F8FAFC]" />
                <div className="h-14 w-full animate-pulse rounded-2xl bg-[#D96541] sm:w-48" />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[0, 1, 2, 3].map((index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-2xl bg-white/18 sm:h-56"
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="h-4 w-28 animate-pulse rounded-full bg-[#D7E3FF]" />
              <div className="h-9 w-64 animate-pulse rounded-full bg-[#E8EEFF]" />
            </div>
            <div className="hidden h-10 w-28 animate-pulse rounded-full bg-white shadow-sm sm:block" />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {cardSkeletonHeights.map((height) => (
              <div
                key={height}
                className={`overflow-hidden rounded-[28px] border border-[#E5ECFF] bg-white p-6 shadow-sm`}
              >
                <div className={`w-full ${height} animate-pulse rounded-[22px] bg-[#EEF3FF]`} />
                <div className="mt-5 h-5 w-2/3 animate-pulse rounded-full bg-[#E8EEFF]" />
                <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-[#F1F5FF]" />
                <div className="mt-2 h-4 w-4/5 animate-pulse rounded-full bg-[#F1F5FF]" />
                <div className="mt-5 h-10 w-32 animate-pulse rounded-full bg-[#D96541]/20" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-[#0D1D73] px-6 py-12 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
          <div>
            <Image
              src="/images/logo.png"
              alt="Spacedey Logo"
              width={107}
              height={28}
              style={{ height: "auto" }}
              className="rounded-xl"
            />
            <div className="mt-6 h-4 w-32 animate-pulse rounded-full bg-white/25" />
            <div className="mt-3 h-4 w-40 animate-pulse rounded-full bg-white/20" />
            <div className="mt-5 h-[2px] w-12 bg-[#D96541]" />
          </div>

          {[0, 1].map((index) => (
            <div key={index} className="space-y-4">
              <div className="h-4 w-24 animate-pulse rounded-full bg-white/25" />
              <div className="h-4 w-28 animate-pulse rounded-full bg-white/20" />
              <div className="h-4 w-20 animate-pulse rounded-full bg-white/20" />
              <div className="h-4 w-32 animate-pulse rounded-full bg-white/20" />
            </div>
          ))}
        </div>
      </footer>
    </main>
  );
}
