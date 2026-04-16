import Link from "next/link";

const chartTypes = [
  "Bar",
  "Line",
  "Pie",
  "Doughnut",
  "Bubble",
  "Scatter",
  "Radar",
  "Polar Area",
];

const features = [
  {
    title: "CSV & Excel",
    description:
      "Upload .csv or .xlsx files with two columns of data. Your data stays in the browser.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    title: "8 Chart Types",
    description:
      "Bar, line, pie, doughnut, bubble, scatter, radar, and polar area charts.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    title: "Instant Preview",
    description:
      "See your chart update in real-time as you switch types or upload new data.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: "Download PNG",
    description:
      "Export your chart as a high-quality PNG image with a single click.",
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
        />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-16 sm:pt-24 pb-16">
        <p className="text-2xl font-bold tracking-tight mb-10">OpnChart</p>
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-sm text-primary mb-8">
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Free &amp; Open Source
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold max-w-4xl leading-tight tracking-tight">
          Transform Data Into{" "}
          <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Beautiful Charts
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-lg md:text-xl text-neutral-content max-w-2xl leading-relaxed">
          Upload CSV or Excel files and instantly generate professional charts.
          8 chart types, one-click download, zero setup.
        </p>

        <p className="mt-3 text-base text-neutral-content/70 max-w-xl">
          Your files never leave your browser. Nothing is uploaded to any server,
          all processing happens locally on your device.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link href="/charts" className="btn btn-primary btn-lg gap-2">
            Get Started
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 pb-20 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <div
              key={i}
              className="rounded-xl bg-base-200 border border-base-300 p-5 hover:border-primary/40 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-1.5">{feature.title}</h3>
              <p className="text-neutral-content text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Chart Types Showcase */}
      <section className="px-6 pb-24 max-w-4xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3">
          Supported Chart Types
        </h2>
        <p className="text-neutral-content mb-8">
          Pick the right visualization for your data
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {chartTypes.map((t) => (
            <span
              key={t}
              className="px-4 py-2 rounded-lg bg-base-200 border border-base-300 text-sm font-medium"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-base-300 py-8 text-center text-sm text-neutral-content">
        <p>OpnChart &mdash; Open-source chart generator</p>
      </footer>
    </main>
  );
}
