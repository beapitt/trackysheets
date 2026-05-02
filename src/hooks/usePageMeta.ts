import { useEffect } from 'react';

/**
 * Hook personalizzato per gestire Meta Tag (SEO) e JSON-LD (GEO)
 * senza librerie esterne.
 */
export function usePageMeta(title: string, description: string, schema?: any) {
  useEffect(() => {
    // 1. Aggiorna il Titolo della scheda del browser
    document.title = title;

    // 2. Aggiorna la Meta Description per Google
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // 3. Gestione JSON-LD (GEO per le AI)
    if (schema) {
      // Rimuove eventuali script SEO precedenti per evitare duplicati
      const existingScript = document.getElementById('json-ld-seo');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = 'json-ld-seo';
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      document.head.appendChild(script);
    }
  }, [title, description, schema]);
}
