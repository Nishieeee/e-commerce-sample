'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, Gift, Timer } from 'lucide-react';

export default function PromoBento() {
  const [timeLeft, setTimeLeft] = useState({ days: 2, hours: 18, minutes: 34, seconds: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="deals" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Clean Editorial Banner */}
        <div className="bg-indigo-950 text-white p-8 sm:p-12 lg:p-16 rounded-sm border border-indigo-900">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Copy & Countdown */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 text-white text-[11px] font-bold uppercase tracking-widest">
                Collection 04 / Box Set
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-[1.1] font-heading">
                The Complete Drop 04 <br />
                <span className="text-rose-400">
                  Wardrobe Set
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl font-normal">
                Acquire the flagship <strong className="text-white font-semibold">Core Heavyweight Hoodie</strong>, <strong className="text-white font-semibold">Boxy Graphic Tee</strong>, <strong className="text-white font-semibold">Utility Cargo Joggers</strong>, and <strong className="text-white font-semibold">Matte Titanium Cuff Bracelet</strong> in one cohesive release. Save $85 instantly.
              </p>

              {/* Clean Countdown Boxes */}
              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-300 mb-3">
                  <Timer className="w-4 h-4 text-rose-400" />
                  <span>Drop 04 Allocation Closes In:</span>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 font-mono">
                  <div className="bg-white/5 border border-white/15 px-4 py-3 rounded-sm text-center min-w-[68px]">
                    <span className="text-2xl sm:text-3xl font-bold text-white block">
                      {String(timeLeft.days).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Days</span>
                  </div>
                  <span className="text-xl font-bold text-rose-400">:</span>
                  <div className="bg-white/5 border border-white/15 px-4 py-3 rounded-sm text-center min-w-[68px]">
                    <span className="text-2xl sm:text-3xl font-bold text-white block">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Hours</span>
                  </div>
                  <span className="text-xl font-bold text-rose-400">:</span>
                  <div className="bg-white/5 border border-white/15 px-4 py-3 rounded-sm text-center min-w-[68px]">
                    <span className="text-2xl sm:text-3xl font-bold text-white block">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Mins</span>
                  </div>
                  <span className="text-xl font-bold text-rose-400">:</span>
                  <div className="bg-white/5 border border-white/15 px-4 py-3 rounded-sm text-center min-w-[68px]">
                    <span className="text-2xl sm:text-3xl font-bold text-rose-400 block">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="text-[9px] uppercase font-bold text-slate-400 tracking-widest">Secs</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center gap-4">
                <a
                  href="#bundle-checkout"
                  className="px-8 py-4 rounded-sm bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs uppercase tracking-widest transition-all flex items-center gap-3 cursor-pointer"
                >
                  <Gift className="w-4 h-4" />
                  <span>Acquire Set ($209.00)</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a
                  href="#sizing"
                  className="text-xs font-bold uppercase tracking-wider text-slate-300 underline underline-offset-4 hover:text-white transition-colors"
                >
                  View Sizing & Specs Guide
                </a>
              </div>

            </div>

            {/* Right: Editorial Product Preview */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-4 rounded-sm border border-white/10 space-y-3">
                <img
                  src="https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80"
                  alt="Core Heavyweight Hoodie"
                  className="w-full aspect-square object-cover rounded-sm"
                />
                <div className="text-white">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Included Item 01</span>
                  <h4 className="text-xs font-bold truncate mt-0.5">400 GSM Core Hoodie</h4>
                  <span className="text-xs font-mono text-slate-400 line-through">$115.00</span>
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded-sm border border-white/10 space-y-3 mt-6">
                <img
                  src="https://images.unsplash.com/photo-1611591471483-ed174d5772a1?auto=format&fit=crop&w=600&q=80"
                  alt="Matte Onyx Bracelet"
                  className="w-full aspect-square object-cover rounded-sm"
                />
                <div className="text-white">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Included Item 02</span>
                  <h4 className="text-xs font-bold truncate mt-0.5">Titanium Cuff Bracelet</h4>
                  <span className="text-xs font-mono text-slate-400 line-through">$85.00</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
