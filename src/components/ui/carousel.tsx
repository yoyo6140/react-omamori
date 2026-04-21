"use client";

import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaCarouselType, EmblaOptionsType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type CarouselApi = EmblaCarouselType;

type CarouselContextProps = {
  emblaRef: ReturnType<typeof useEmblaCarousel>[0];
  api: CarouselApi | null;
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
};

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("Carousel components must be used within <Carousel />");
  return ctx;
}

function Carousel({
  opts,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { opts?: EmblaOptionsType }) {
  const [emblaRef, api] = useEmblaCarousel(opts);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((embla: EmblaCarouselType) => {
    setCanScrollPrev(embla.canScrollPrev());
    setCanScrollNext(embla.canScrollNext());
  }, []);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

  return (
    <CarouselContext.Provider
      value={{ emblaRef, api: api ?? null, scrollPrev, scrollNext, canScrollPrev, canScrollNext }}
    >
      <div className={cn("relative", className)} {...props}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { emblaRef } = useCarousel();
  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div className={cn("flex -ml-4", className)} {...props} />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("min-w-0 shrink-0 grow-0 basis-full pl-4", className)} {...props} />;
}

function CarouselPrevious({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return (
    <button
      type="button"
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      className={cn(
        "absolute -left-3 top-1/2 -translate-y-1/2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:bg-black/55 disabled:opacity-30",
        className
      )}
      aria-label="Previous slide"
      {...props}
    >
      <ChevronLeft className="h-5 w-5" />
    </button>
  );
}

function CarouselNext({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { scrollNext, canScrollNext } = useCarousel();
  return (
    <button
      type="button"
      onClick={scrollNext}
      disabled={!canScrollNext}
      className={cn(
        "absolute -right-3 top-1/2 -translate-y-1/2 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur transition hover:bg-black/55 disabled:opacity-30",
        className
      )}
      aria-label="Next slide"
      {...props}
    >
      <ChevronRight className="h-5 w-5" />
    </button>
  );
}

export { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious };

