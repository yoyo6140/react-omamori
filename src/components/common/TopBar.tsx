"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";
import { LogOut, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type TopBarLink = { name: string; href: string };

export default function TopBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const handleLogout = () => {
    Cookies.remove("access_token");
    router.push("/login");
  };

  const navLinks: TopBarLink[] = [
    { name: "商品", href: "/products" },
    { name: "訂單", href: "/orders" },
    // { name: "優惠券", href: "/coupons" },
  ];

  return (
    <nav className="fixed w-full z-50 px-8 py-4 bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center">
        <Link href="/home" className="text-2xl font-bold tracking-widest text-[#B22222] font-serif">
          拾守｜管理後台
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-12 tracking-[0.2em] uppercase font-light ml-[40px]">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-[#B22222] transition-colors duration-300 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#B22222] transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </div>
        <div className="ml-auto hidden md:flex items-center">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            登出
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center ml-auto md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label={isMobileMenuOpen ? "關閉選單" : "開啟選單"}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t md:hidden flex flex-col p-8 space-y-6 shadow-xl animate-in fade-in slide-in-from-top-4 text-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg tracking-widest hover:text-[#B22222]"
            >
              {link.name}
            </Link>
          ))}

          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            登出
          </Button>
        </div>
      )}
    </nav>
  );
}
