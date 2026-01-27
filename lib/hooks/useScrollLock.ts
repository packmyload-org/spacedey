"use client";

import { useEffect } from "react";

export function useScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return;

    const y = window.scrollY || window.pageYOffset;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    // Lock body and html scroll
    document.body.style.position = 'fixed';
    document.body.style.top = `-${y}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    // Prevent touchmove and wheel events (covers scrollable fixed children)
    const preventDefault = (e: Event) => {
      e.preventDefault();
    };

    document.addEventListener('touchmove', preventDefault as EventListener, { passive: false });
    document.addEventListener('wheel', preventDefault as EventListener, { passive: false });

    // Also find any scrollable elements (overflow: auto|scroll and scrollHeight>clientHeight)
    const scrollableEls: Element[] = [];
    const originalStyles = new Map<Element, { overflow?: string; touchAction?: string }>();
    const all = Array.from(document.querySelectorAll<HTMLElement>('*'));
    for (const el of all) {
      try {
        const style = window.getComputedStyle(el);
        const overflowY = style.overflowY;
        if ((overflowY === 'auto' || overflowY === 'scroll') && el.scrollHeight > el.clientHeight) {
          scrollableEls.push(el);
          originalStyles.set(el, { overflow: el.style.overflow, touchAction: el.style.touchAction });
          el.style.overflow = 'hidden';
          el.style.touchAction = 'none';
        }
      } catch {
        // ignore cross-origin or other access errors
      }
    }

    return () => {
      // restore body/html styles
      document.body.style.overflow = originalOverflow || '';
      document.body.style.position = originalPosition || '';
      document.body.style.top = originalTop || '';
      document.documentElement.style.overflow = originalHtmlOverflow || '';
      window.scrollTo(0, y);

      // remove listeners
      document.removeEventListener('touchmove', preventDefault as EventListener);
      document.removeEventListener('wheel', preventDefault as EventListener);

      // restore scrollable elements
      for (const el of scrollableEls) {
        const orig = originalStyles.get(el) || {};
        (el as HTMLElement).style.overflow = orig.overflow || '';
        (el as HTMLElement).style.touchAction = orig.touchAction || '';
      }
    };
  }, [isLocked]);
}
