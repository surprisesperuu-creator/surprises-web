'use client';

import { useEffect } from 'react';

export function ScrollAnimationInitializer() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Agregar la clase solo en el cliente. NUNCA escribir atributos
            // extra en el DOM (ej. data-scroll-observed) porque React los
            // detecta como mismatch con el HTML del servidor.
            entry.target.classList.add('scroll-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: '0px 0px -2% 0px',
      }
    );

    // Elementos ya observados: se guardan en MEMORIA (no como atributo del
    // DOM) para no provocar hydration mismatches en elementos SSR.
    const observed = new Set<Element>();

    const observeElements = () => {
      const elements = document.querySelectorAll('[data-scroll-animate]');

      elements.forEach((el) => {
        if (!el.classList.contains('scroll-visible') && !observed.has(el)) {
          observed.add(el);
          observer.observe(el);
        }
      });
    };

    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: false,
    });

    return () => {
      mutationObserver.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
