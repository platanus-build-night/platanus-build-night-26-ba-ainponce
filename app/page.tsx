'use client';

import { useState, useEffect, lazy, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { OnboardingWizard } from '@/components/onboarding-wizard';
import { PracticeView } from '@/components/practice-view';
import { hasCompletedOnboarding, getSettings, clearSettings, clearCurrentPhrase } from '@/lib/storage';
import { setWaterColorsByLanguage, setWaterColors, setWaveSpeed, setWaveIntensity } from '@/lib/water-state';
import type { AppView, AppSettings } from '@/types';

const WaterRippleCanvas = lazy(() =>
  import('@/components/water-ripple-canvas').then((m) => ({ default: m.WaterRippleCanvas })),
);

export default function HomePage() {
  const [view, setView] = useState<AppView | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    if (hasCompletedOnboarding()) {
      const saved = getSettings();
      if (saved) {
        setSettings(saved);
        setWaterColorsByLanguage(saved.language);
        setView('practice');
      } else {
        setView('onboarding');
      }
    } else {
      setView('onboarding');
    }
  }, []);

  const handleOnboardingComplete = (newSettings: AppSettings) => {
    setSettings(newSettings);
    setWaterColorsByLanguage(newSettings.language);
    setView('practice');
  };

  const handleEndSession = () => {
    clearSettings();
    clearCurrentPhrase();
    setSettings(null);
    setWaterColors([0.039, 0.098, 0.184], [0.392, 1.0, 0.855]);
    setWaveSpeed(1.0);
    setWaveIntensity(1.0);
    setView('onboarding');
  };

  if (view === null) {
    return <div className="h-screen" />;
  }

  return (
    <div className="h-screen relative overflow-hidden">
      {/* ── Persistent water background ── */}
      <div className="absolute inset-0 z-0">
        <Suspense fallback={null}>
          <WaterRippleCanvas />
        </Suspense>
      </div>

      {/* ── Content over water ── */}
      <div className="relative z-10 h-full">
        <AnimatePresence mode="wait">
          {view === 'onboarding' && (
            <motion.div
              key="onboarding"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="h-full"
            >
              <OnboardingWizard onComplete={handleOnboardingComplete} />
            </motion.div>
          )}

          {view === 'practice' && settings && (
            <motion.div
              key="practice"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
              className="h-full"
            >
              <PracticeView settings={settings} onEndSession={handleEndSession} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
