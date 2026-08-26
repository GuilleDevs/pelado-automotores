import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; theme?: string }) => string;
      remove: (id: string) => void;
    };
  }
}

const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

/** Widget de Turnstile. Sin token válido el submit queda deshabilitado. */
export default function Turnstile({ onToken }: { onToken: (t: string) => void }) {
  const caja = useRef<HTMLDivElement>(null);
  const widget = useRef<string | null>(null);

  useEffect(() => {
    const sitekey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;
    if (!sitekey) {
      // En desarrollo sin clave, no bloqueamos el formulario.
      onToken('dev');
      return;
    }
    const montar = () => {
      if (!caja.current || !window.turnstile || widget.current) return;
      widget.current = window.turnstile.render(caja.current, {
        sitekey, theme: 'dark', callback: onToken,
      });
    };
    if (window.turnstile) montar();
    else {
      const s = document.createElement('script');
      s.src = SRC;
      s.async = true;
      s.onload = montar;
      document.head.appendChild(s);
    }
    return () => {
      if (widget.current && window.turnstile) window.turnstile.remove(widget.current);
      widget.current = null;
    };
  }, [onToken]);

  return <div ref={caja} className="min-h-[65px]" />;
}
