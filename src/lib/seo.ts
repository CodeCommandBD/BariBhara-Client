// SEO utility — BariBhara
// এই ফাইলটি সব পেজের জন্য SEO meta data প্রদান করে

export const SITE_NAME = "BariBhara";
export const SITE_URL = "https://baribhara.com"; // production URL
export const DEFAULT_LOCALE = "bn_BD";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "product";
  noIndex?: boolean;
  canonicalUrl?: string;
  structuredData?: object | object[];
}

// প্রতিটি পেজের ডিফল্ট SEO data
export const PAGE_SEO: Record<string, SEOProps> = {
  home: {
    title: "BariBhara — বাংলাদেশের সেরা বাসা ভাড়ার পোর্টাল",
    description:
      "BariBhara-তে বাংলাদেশের হাজারো ফ্ল্যাট, রুম ও বাসা খুঁজুন। ঢাকা, চট্টগ্রাম, সিলেট-সহ সারা দেশে সাশ্রয়ী ভাড়া খুঁজে নিন সহজেই।",
    keywords:
      "বাসা ভাড়া, ফ্ল্যাট ভাড়া, ঢাকা বাসা ভাড়া, বাংলাদেশ ভাড়া বাসা, rental bangladesh, house rent dhaka, flat rent chittagong",
    ogType: "website",
  },
  search: {
    title: "বাসা খুঁজুন — BariBhara",
    description:
      "BariBhara-তে ফ্ল্যাট, সিঙ্গেল রুম ও কমার্শিয়াল স্পেস খুঁজুন। লোকেশন, বাজেট ও সুবিধা অনুযায়ী ফিল্টার করুন।",
    keywords: "বাসা সার্চ, ফ্ল্যাট খোঁজা, বাসা ভাড়া ঢাকা, house search bangladesh",
    ogType: "website",
  },
  savedProperties: {
    title: "পছন্দের বাসাসমূহ — BariBhara",
    description: "আপনার সেভ করা পছন্দের বাসা ও ফ্ল্যাটের তালিকা।",
    noIndex: true, // personal page, don't index
    ogType: "website",
  },
  termsPrivacy: {
    title: "Terms & Privacy — BariBhara",
    description: "BariBhara-এর ব্যবহারের শর্তাবলী এবং গোপনীয়তা নীতি পড়ুন।",
    keywords: "terms of service, privacy policy, BariBhara",
    ogType: "website",
  },
  login: {
    title: "লগইন করুন — BariBhara",
    description: "BariBhara-তে লগইন করুন এবং আপনার বাসা পরিচালনা শুরু করুন।",
    noIndex: true,
    ogType: "website",
  },
  register: {
    title: "একাউন্ট খুলুন — BariBhara",
    description: "বিনামূল্যে একাউন্ট খুলুন এবং আপনার বাড়ি/ফ্ল্যাট তালিকাভুক্ত করুন।",
    noIndex: true,
    ogType: "website",
  },
};

// JSON-LD Structured Data generators
export const generatePropertySchema = (property: {
  name: string;
  description?: string;
  address: string;
  rent: number;
  image?: string;
  ownerName?: string;
  url: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  name: property.name,
  description: property.description || `${property.name} — ভাড়ার জন্য উপলব্ধ`,
  url: property.url,
  image: property.image || DEFAULT_OG_IMAGE,
  offers: {
    "@type": "Offer",
    priceCurrency: "BDT",
    price: property.rent,
    availability: "https://schema.org/InStock",
    priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: property.address,
    addressCountry: "BD",
  },
  ...(property.ownerName && {
    seller: {
      "@type": "Person",
      name: property.ownerName,
    },
  }),
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: "বাংলাদেশের সেরা বাসা ভাড়ার পোর্টাল",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/search?location={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
});

export const generateBreadcrumbSchema = (
  items: Array<{ name: string; url: string }>
) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
});

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["Bengali", "English"],
  },
});
