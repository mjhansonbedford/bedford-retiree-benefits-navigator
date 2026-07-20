import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bedford Retirement Benefits Navigator",
  description: "Interactive retirement and health benefits guidance for Town of Bedford employees and retirees."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
