import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aayush Keshari — Software Engineer",
  description:
    "Aayush Keshari's interactive Classic Mac portfolio—software engineering experience, projects, skills, and contact information.",
  icons: {
    icon: "favicon.svg",
    shortcut: "favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
