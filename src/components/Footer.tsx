import React from "react";

export default function Footer() {
  return (
    <footer id="admin" className="w-full bg-[var(--sumi-black)] text-white">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="relative flex flex-col gap-5 items-center md:flex-row md:gap-0 md:items-center">
          <div className="text-center text-sm md:text-base text-white/70 md:absolute md:left-1/2 md:-translate-x-1/2">
            © {new Date().getFullYear()} Omamori Connect ・ 僅供面試用途。
          </div>

          <a
            href="/LoginPage"
            className="md:ml-auto inline-flex items-center justify-center px-8 py-3 rounded-full bg-[var(--torii-red)] text-white hover:opacity-90 transition font-medium tracking-wide"
          >
            管理者登入
          </a>
        </div>
      </div>
    </footer>
  );
}
