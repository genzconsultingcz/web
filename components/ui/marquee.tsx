'use client';
import { InfiniteSlider } from './infinite-slider';

const TICKER_ITEMS = ['WORKSHOP', 'ONBOARDING', 'GEN Z FIRST', '50+ FIREM', 'REAL TALK', 'CONSULTING'];

export const Marquee = () => (
  <div className="overflow-hidden bg-black py-4">
    <InfiniteSlider gap={40} speed={50} className="flex items-center">
      {TICKER_ITEMS.map((item) => (
        <span key={item} className="text-xs font-bold uppercase tracking-[0.2em] text-white">
          {item}&nbsp;&nbsp;·
        </span>
      ))}
    </InfiniteSlider>
  </div>
);
