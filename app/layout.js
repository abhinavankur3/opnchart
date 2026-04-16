import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OpnChart - Create Charts from CSV & Excel Data",
  description:
    "Upload CSV or Excel files and instantly generate professional charts. Free, open-source chart generator with 8 chart types.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="opnchart">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
