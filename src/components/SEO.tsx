import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

export default function SEO({ 
  title = "AmarShop | Premium Ecommerce Store", 
  description = "Experience premium shopping with AmarShop. Discover high-quality jewelry, fashion, and electronics at the best prices.",
  keywords = "ecommerce, luxury, jewelry, fashion, electronics, AmarShop, Bangladesh",
  image = "https://picsum.photos/seed/amarshop/1200/630",
  url = "https://amarshop.com.bd",
  type = "website"
}: SEOProps) {
  const siteTitle = title.includes("AmarShop") ? title : `${title} | AmarShop`;

  return (
    <Helmet>
      {/* Standard Metadata */}
      <title>{siteTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={siteTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Canonical */}
      <link rel="canonical" href={url} />
    </Helmet>
  );
}
