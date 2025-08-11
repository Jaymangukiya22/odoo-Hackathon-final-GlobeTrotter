import { useEffect } from "react";

interface SeoProps {
  title: string;
  description: string;
  canonical?: string;
  jsonLd?: Record<string, any>;
}

const Seo = ({ title, description, canonical = "/", jsonLd }: SeoProps) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const upsertMetaByName = (name: string, content: string) => {
      let el = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const upsertMetaByProperty = (property: string, content: string) => {
      let el = document.head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("property", property);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Description
    upsertMetaByName("description", description);

    // Canonical
    let link = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    const href = typeof window !== "undefined" ? new URL(canonical, window.location.origin).href : canonical;
    link.setAttribute("href", href);

    // OpenGraph
    upsertMetaByProperty("og:title", title);
    upsertMetaByProperty("og:description", description);
    upsertMetaByProperty("og:type", "website");

    // JSON-LD
    const scriptId = "app-jsonld";
    const prev = document.getElementById(scriptId);
    if (prev?.parentNode) prev.parentNode.removeChild(prev);
    if (jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = scriptId;
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [title, description, canonical, JSON.stringify(jsonLd)]);

  return null;
};

export default Seo;