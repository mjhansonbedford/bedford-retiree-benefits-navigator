import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bedford Retirement Benefits Navigator",
  description: "Personalized retirement, GIC, and Medicare planning guidance for Bedford employees and retirees."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
