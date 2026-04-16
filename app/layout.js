import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OpnChart - Create Charts from CSV & Excel Data",
  description:
    "Upload CSV or Excel files and instantly generate professional charts. Free, open-source chart generator with 8 chart types. Your data never leaves your browser.",
  metadataBase: new URL("https://opnchart.abhinavankur.com"),
  openGraph: {
    title: "OpnChart - Create Charts from CSV & Excel Data",
    description:
      "Upload CSV or Excel files and instantly generate professional charts. Free, open-source, runs entirely in your browser.",
    url: "https://opnchart.abhinavankur.com",
    siteName: "OpnChart",
    type: "website",
  },
  keywords: [
    "opnchart",
    "chart generator",
    "csv to chart",
    "excel to chart",
    "open source charts",
    "free chart maker",
    "bar chart",
    "pie chart",
    "line chart",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="opnchart">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
