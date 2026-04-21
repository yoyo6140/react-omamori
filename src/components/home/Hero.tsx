"use client";

import React from 'react';
import { ChevronDown } from 'lucide-react';
import homeBg from '../../asset/images/home-bg.avif';

const Hero = () => {
  return (
    <section
      id="home"
      className="w-full relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-28"
    >
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40 transition-transform duration-[10s] hover:scale-110"
        style={{ 
          backgroundImage: `url(${homeBg.src})`,
        }}
      />
      
      {/* 漸層遮罩：與底部米白色背景 (#FAF9F6) 銜接 */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent to-[#FAF9F6]"></div>

      {/* 內容文字 */}
      <div className="relative z-20 text-center space-y-8 px-4 hero-enter">
        <p className="text-[#B22222] tracking-[1em] text-sm uppercase font-light">
          Omamori Connect
        </p>
        
        <h1 className="text-6xl md:text-8xl font-bold leading-tight font-serif">
          來自日本各地的<br />
          <span className="text-[#B22222] italic">祝福</span>
        </h1>
        
        <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
          跨越海洋與山川，將千年神社的守護帶到您的身邊。每一枚御守，都是一段跨時空的祈願。
        </p>

        <div className="pt-8">
          <a 
            href="#wishes" 
            className="px-12 py-4 border border-[#B22222] text-[#B22222] hover:bg-[#B22222] hover:text-white transition-all duration-500 tracking-widest text-sm uppercase inline-block"
          >
            開始參拜流程
          </a>
        </div>

        <style jsx>{`
          .hero-enter {
            animation: slideUpFade 700ms ease-out both;
          }
          @keyframes slideUpFade {
            from {
              opacity: 0;
              transform: translateY(24px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @media (prefers-reduced-motion: reduce) {
            .hero-enter {
              animation: none;
            }
          }
        `}</style>
      </div>

      {/* 下滑提示圖示 */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce z-20">
        <ChevronDown className="w-6 h-6 text-gray-400" />
      </div>
    </section>
  );
};

export default Hero;