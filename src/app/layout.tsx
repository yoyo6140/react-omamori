import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif_JP, Poppins } from "next/font/google";
import { Providers } from "@/components/common/providers";
import logo from "@/asset/images/logo.png";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "600"],
});

const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "拾緣",
  description: "來自日本各地的祝福，將千年神社的守護帶到您的身邊。",
  icons: {
    icon: [{ url: logo.src }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} ${notoSerifJP.variable} h-full antialiased scroll-smooth`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
