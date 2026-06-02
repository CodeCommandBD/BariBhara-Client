import { Helmet } from "react-helmet-async";
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from "@/lib/seo";

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  noIndex?: boolean;
  canonicalUrl?: string;
  structuredData?: object | object[];
  lang?: string;
}

const SEOHead = ({
  title,
  description = "BariBhara-তে বাংলাদেশের হাজারো ফ্ল্যাট, রুম ও বাসা খুঁজুন।",
  keywords = "বাসা ভাড়া, ফ্ল্যাট ভাড়া, ঢাকা বাসা ভাড়া, বাংলাদেশ",
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noIndex = false,
  canonicalUrl,
  structuredData,
  lang = "bn",
}: SEOHeadProps) => {
  const fullTitle = title
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — বাংলাদেশের সেরা বাসা ভাড়ার পোর্টাল`;

  const canonical = canonicalUrl || (typeof window !== "undefined" ? window.location.href : SITE_URL);

  const structuredDataArray = structuredData
    ? Array.isArray(structuredData)
      ? structuredData
      : [structuredData]
    : [];

  return (
    <Helmet>
      {/* ===== Primary Meta Tags ===== */}
      <html lang={lang} />
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow"} />
      <meta name="language" content="Bengali" />
      <link rel="canonical" href={canonical} />

      {/* ===== Open Graph (Facebook / WhatsApp / LinkedIn) ===== */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="bn_BD" />

      {/* ===== Twitter Card ===== */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* ===== Performance / Mobile ===== */}
      <meta name="theme-color" content="#7c3aed" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />

      {/* ===== JSON-LD Structured Data ===== */}
      {structuredDataArray.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
