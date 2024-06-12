import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";

import { Inter } from "next/font/google";

export const metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const font = Inter({ subsets: ["latin", "cyrillic"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${font.className}`}>
      <body className="bg-amber-100">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
