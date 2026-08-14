'use client';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

const EXIT_DURATION = 0.2;
const ENTER_DURATION = 0.4;
const LOADING_DURATION = 650;
const LOADING_MAX_MS = 10_000;

function RouteLoadingBar({ reduce }: { reduce: boolean | null }) {
  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[100]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.25 } }}
      transition={{ duration: 0.15 }}
      aria-hidden="true"
    >
      <div className="h-[3px] w-full overflow-hidden bg-gtc-primary/15">
        <motion.div
          className={reduce ? 'h-full w-full bg-gtc-primary' : 'h-full w-1/3 bg-gtc-primary'}
          initial={reduce ? false : { x: '-100%' }}
          animate={reduce ? undefined : { x: '400%' }}
          transition={{ duration: 0.65, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  );
}

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const [loading, setLoading] = useState(false);
  const firstRender = useRef(true);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stopLoading = () => {
    setLoading(false);
    if (hideTimer.current) clearTimeout(hideTimer.current);
    if (maxTimer.current) clearTimeout(maxTimer.current);
  };

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(stopLoading, LOADING_DURATION);
  }, [pathname]);

  useEffect(() => {
    const isInternalNav = (anchor: HTMLAnchorElement) => {
      if (anchor.target && anchor.target !== '_self') return false;
      if (anchor.hasAttribute('download')) return false;
      if (anchor.origin !== window.location.origin) return false;
      if (anchor.pathname === window.location.pathname && !anchor.search) return false;
      return true;
    };

    const handleClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element).closest('a');
      if (!anchor || !isInternalNav(anchor)) return;
      setLoading(true);
      if (maxTimer.current) clearTimeout(maxTimer.current);
      maxTimer.current = setTimeout(stopLoading, LOADING_MAX_MS);
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, []);

  return (
    <>
      <AnimatePresence>{loading && <RouteLoadingBar reduce={reduce} />}</AnimatePresence>
      {reduce ? (
        <>{children}</>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10, transition: { duration: EXIT_DURATION, ease: 'easeIn' } }}
            transition={{ duration: ENTER_DURATION, ease: 'easeOut' }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      )}
    </>
  );
}
