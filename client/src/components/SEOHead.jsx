import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import groqSEOService from '../services/groqSEOService';

const SEOHead = ({ 
    type = 'page', 
    product = null, 
    pageData = {}, 
    customMeta = null 
}) => {
    const [metadata, setMetadata] = useState(null);

    useEffect(() => {
        generateMetadata();
    }, [type, product?.id, pageData?.categoryId]);

    const generateMetadata = async () => {
        if (customMeta) {
            setMetadata(customMeta);
            return;
        }

        try {
            let meta;

            if (type === 'product' && product) {
                meta = await groqSEOService.generateMetaTags(product);
            } else {
                meta = await groqSEOService.generatePageMetadata(type, pageData);
            }

            if (meta) {
                setMetadata(meta);
            } else {
                setMetadata(getDefaultMetadata(type, product, pageData));
            }
        } catch (error) {
            // Silent fallback - no console logs
            setMetadata(getDefaultMetadata(type, product, pageData));
        }
    };

    const getDefaultMetadata = (type, product, pageData) => {
        switch (type) {
            case 'product':
                return {
                    title: `${product?.name || 'Product'} | Myjamii Store`,
                    description: `Buy ${product?.name || 'this product'} for $${product?.price || '0'}. High-quality products at Myjamii Store.`,
                    keywords: `${product?.name || 'product'}, online shopping, e-commerce, Myjamii Store`
                };
            case 'homepage':
                return {
                    title: "Myjamii Store - Premium Products Online | Electronics, Clothing & More",
                    description: "Shop premium electronics, clothing, books, home appliances & sports equipment at Myjamii Store. Quality products, fast shipping, excellent service.",
                    keywords: "online shopping, electronics, clothing, books, home appliances, sports, e-commerce"
                };
            case 'products':
                return {
                    title: "Shop All Products | Myjamii Store - Quality & Value",
                    description: "Browse our extensive collection of premium products across multiple categories. Electronics, clothing, books & more with fast delivery.",
                    keywords: "shop online, buy products, electronics, clothing, books, home appliances, sports equipment"
                };
            case 'category':
                return {
                    title: `${pageData.categoryName || 'Category'} | Myjamii Store`,
                    description: `Shop premium ${pageData.categoryName?.toLowerCase() || 'products'} at Myjamii Store. Quality items with fast shipping and great prices.`,
                    keywords: `${pageData.categoryName?.toLowerCase() || 'products'}, online shopping, e-commerce, quality products`
                };
            case 'about':
                return {
                    title: "About Myjamii Store - Your Trusted Shopping Partner",
                    description: "Learn about Myjamii Store's commitment to quality, customer service, and providing premium products across multiple categories.",
                    keywords: "about us, e-commerce, customer service, quality products, online store"
                };
            default:
                return {
                    title: "Myjamii Store - Premium Online Shopping",
                    description: "Discover quality products at Myjamii Store. Your trusted partner for online shopping.",
                    keywords: "online shopping, e-commerce, quality products"
                };
        }
    };

    const generateStructuredData = () => {
        const baseUrl = "https://myjamii-store-client.onrender.com";
        
        if (type === 'product' && product) {
            return {
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": product.name,
                "description": metadata?.description || product.description,
                "brand": {
                    "@type": "Brand",
                    "name": "Myjamii Store"
                },
                "offers": {
                    "@type": "Offer",
                    "price": product.price,
                    "priceCurrency": "USD",
                    "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                    "seller": {
                        "@type": "Organization",
                        "name": "Myjamii Store",
                        "url": baseUrl
                    }
                },
                "image": product.image_url || `${baseUrl}/images/placeholder.jpg`,
                "category": product.category || "General",
                "sku": `MYJ-${product.id}`,
                "url": `${baseUrl}/products/${product.id}`
            };
        }

        if (type === 'homepage') {
            return {
                "@context": "https://schema.org/",
                "@type": "Organization",
                "name": "Myjamii Store",
                "description": "Premium online store offering electronics, clothing, books, home appliances, and sports equipment",
                "url": baseUrl,
                "logo": `${baseUrl}/images/logo.png`,
                "sameAs": [
                    "https://www.facebook.com/myjamiistore",
                    "https://www.twitter.com/myjamiistore",
                    "https://www.instagram.com/myjamiistore"
                ],
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+1-555-MYJAMII",
                    "contactType": "customer service",
                    "email": "hello@myjamii.com"
                },
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Online",
                    "addressCountry": "US"
                }
            };
        }

        return null;
    };

    const currentMetadata = metadata || getDefaultMetadata(type, product, pageData);
    const structuredData = generateStructuredData();

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{currentMetadata.title}</title>
            <meta name="description" content={currentMetadata.description} />
            <meta name="keywords" content={currentMetadata.keywords} />
            
            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type === 'product' ? 'product' : 'website'} />
            <meta property="og:title" content={currentMetadata.title} />
            <meta property="og:description" content={currentMetadata.description} />
            <meta property="og:url" content={window.location.href} />
            <meta property="og:site_name" content="Myjamii Store" />
            
            {product && (
                <>
                    <meta property="og:image" content={product.image_url} />
                    <meta property="product:price:amount" content={product.price} />
                    <meta property="product:price:currency" content="USD" />
                    <meta property="product:availability" content={product.stock > 0 ? 'in stock' : 'out of stock'} />
                </>
            )}

            {/* Twitter Card */}
            <meta name="twitter:card" content={product ? "summary_large_image" : "summary"} />
            <meta name="twitter:title" content={currentMetadata.title} />
            <meta name="twitter:description" content={currentMetadata.description} />
            {product && <meta name="twitter:image" content={product.image_url} />}

            {/* Additional SEO Tags */}
            <meta name="robots" content="index, follow, max-image-preview:large" />
            <meta name="googlebot" content="index, follow" />
            <link rel="canonical" href={window.location.href} />
            
            {/* Structured Data */}
            {structuredData && (
                <script type="application/ld+json">
                    {JSON.stringify(structuredData, null, 2)}
                </script>
            )}

            {/* Preconnect to external domains for performance */}
            <link rel="preconnect" href="https://myjamii-store.onrender.com" />
            <link rel="preconnect" href="https://res.cloudinary.com" />

            {/* AI-enhanced SEO meta tags */}
            <meta name="generator" content="Myjamii Store AI SEO" />
        </Helmet>
    );
};

export default SEOHead;