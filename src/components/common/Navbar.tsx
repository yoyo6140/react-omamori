"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/useClientCarts";

const Navbar = () => {
  const { cartUnitCount } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // 監聽捲動，改變 Navbar 背景
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "尋找祝福", href: "/home" },
    { name: "御守地圖", href: "/home#omamori-results" },
    { name: "結緣查詢", href: "/check" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 px-8 py-4 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Logo */}
        <div className="text-2xl font-bold tracking-widest text-[#B22222] font-serif">
          拾緣｜祈願願望成真
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-12 tracking-[0.2em] uppercase font-light ml-auto">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="hover:text-[#B22222] transition-colors duration-300 relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#B22222] transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Icons Area */}
        <div className="flex items-center space-x-6 text-[#1A1A1A] ml-auto">
          <Link
            href="/carts"
            className="relative cursor-pointer group"
            aria-label={`購物車，共 ${cartUnitCount} 件商品`}
          >
            <ShoppingBag className="w-8 h-8 group-hover:text-[#B22222] transition-colors" />
            <span
              className={`absolute -top-2 -right-2 flex min-h-4 min-w-4 items-center justify-center rounded-full bg-[#B22222] px-1 text-[10px] font-semibold leading-none text-white ${
                cartUnitCount === 0 ? "opacity-70" : ""
              }`}
            >
              {cartUnitCount > 99 ? "99+" : cartUnitCount}
            </span>
          </Link>

          {/* Mobile Menu Toggle */}
          <div
            className="md:hidden cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-t md:hidden flex flex-col p-8 space-y-6 shadow-xl animate-in fade-in slide-in-from-top-4">
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
        </div>
      )}
    </nav>
  );
};

export default Navbar;
