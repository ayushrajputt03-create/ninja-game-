import React, { useState } from 'react';
import { Smartphone, Monitor, ShieldCheck, Sparkles } from 'lucide-react';
import { sounds } from '../engine/soundEngine';

export const MobileDeviceFrame = ({ children }) => {
  const [deviceMode, setDeviceMode] = useState('responsive'); // 'responsive' | 'iphone' | 'android'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Desktop Device Simulator Control Bar */}
      <div className="hidden lg:flex items-center justify-between px-6 py-2 bg-slate-900 border-b border-slate-800/80 text-xs font-medium">
        <div className="flex items-center gap-2 text-slate-400">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Mobile Phone Simulator View:</span>
        </div>

        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => {
              sounds.playClick();
              setDeviceMode('responsive');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              deviceMode === 'responsive'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full Responsive</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setDeviceMode('iphone');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              deviceMode === 'iphone'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>iPhone 15 Pro (iOS)</span>
          </button>

          <button
            onClick={() => {
              sounds.playClick();
              setDeviceMode('android');
            }}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
              deviceMode === 'android'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Pixel 8 / Galaxy (Android)</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-500 font-mono">
          iOS & Android Native Mobile PWA Ready
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex justify-center items-start overflow-x-hidden">
        {deviceMode === 'responsive' ? (
          <div className="w-full min-h-screen flex flex-col">
            {children}
          </div>
        ) : (
          <div className="my-8 relative">
            {/* Phone Outer Chassis */}
            <div className={`w-[410px] h-[830px] rounded-[52px] p-4 bg-slate-900 border-[10px] ${
              deviceMode === 'iphone' ? 'border-slate-700 shadow-[0_0_60px_rgba(56,189,248,0.2)]' : 'border-slate-800 shadow-[0_0_60px_rgba(245,158,11,0.2)]'
            } relative overflow-hidden flex flex-col`}>
              
              {/* iPhone Dynamic Island / Notch */}
              {deviceMode === 'iphone' && (
                <div className="w-28 h-6 bg-black rounded-full mx-auto my-1 flex items-center justify-between px-3 z-30 shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
                  <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800"></div>
                </div>
              )}

              {/* Android Camera Hole Punch */}
              {deviceMode === 'android' && (
                <div className="w-4 h-4 bg-black rounded-full mx-auto my-1 z-30 border border-slate-800"></div>
              )}

              {/* Mobile Screen Viewport */}
              <div className="flex-1 bg-slate-950 rounded-[38px] overflow-y-auto overflow-x-hidden border border-slate-800/80 scrollbar-none relative">
                {children}
              </div>

              {/* iOS Home Indicator Bar */}
              {deviceMode === 'iphone' && (
                <div className="w-32 h-1 bg-slate-500 rounded-full mx-auto mt-2 opacity-60"></div>
              )}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
