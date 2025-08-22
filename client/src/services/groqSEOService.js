/**
 * AI-Powered SEO Service - Server-Side API Client
 * Clean, lightweight service that calls our AI backend endpoints
 * No more heavy client-side processing or console logs!
 */

class AIServerSEOService {
    constructor() {
        this.baseURL = 'https://myjamii-store.onrender.com';
        this.memoryCache = new Map();
        this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
    }

    /**
     * Generate AI-enhanced meta tags for products via server API
     */
    async generateMetaTags(product) {
        if (!product?.id) {
            return this.getFallbackMetaTags(product);
        }

        try {
            // Check memory cache first
            const cacheKey = `meta_${product.id}`;
            const cached = this.getFromMemoryCache(cacheKey);
            if (cached) {
                return cached;
            }

            // Call server AI endpoint
            const response = await fetch(`${this.baseURL}/ai/products/${product.id}/meta-tags`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000 // 10 second timeout
            });

            if (!response.ok) {
                throw new Error(`AI service error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success && data.meta_tags) {
                const metaTags = {
                    title: data.meta_tags.title,
                    description: data.meta_tags.description,
                    keywords: data.meta_tags.keywords,
                    cached: data.cached || false
                };

                // Cache the result
                this.setMemoryCache(cacheKey, metaTags);
                return metaTags;
            }

            throw new Error('Invalid AI response format');

        } catch (error) {
            // Silent fallback - no console logs
            return this.getFallbackMetaTags(product);
        }
    }

    /**
     * Generate AI-enhanced product description via server API
     */
    async generateProductDescription(product) {
        if (!product?.id) {
            return product?.description || `Experience premium quality with ${product?.name || 'this product'}.`;
        }

        try {
            // Check memory cache first
            const cacheKey = `desc_${product.id}`;
            const cached = this.getFromMemoryCache(cacheKey);
            if (cached) {
                return cached;
            }

            // Call server AI endpoint
            const response = await fetch(`${this.baseURL}/ai/products/${product.id}/description`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 10000
            });

            if (!response.ok) {
                throw new Error(`AI service error: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.success && data.ai_description) {
                // Cache the result
                this.setMemoryCache(cacheKey, data.ai_description);
                return data.ai_description;
            }

            throw new Error('Invalid AI response format');

        } catch (error) {
            // Silent fallback
            return product.description || `Experience premium quality with ${product.name}. Perfect for your needs at an unbeatable price of $${product.price}.`;
        }
    }

    /**
     * Generate page metadata for different page types
     */
    async generatePageMetadata(pageType, pageData = {}) {
        try {
            // Check memory cache first
            const cacheKey = `page_${pageType}_${pageData.categoryId || 'default'}`;
            const cached = this.getFromMemoryCache(cacheKey);
            if (cached) {
                return cached;
            }

            // For category pages, call server endpoint
            if (pageType === 'category' && pageData.categoryId) {
                const response = await fetch(`${this.baseURL}/ai/categories/${pageData.categoryId}/meta-tags`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    timeout: 10000
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success && data.meta_tags) {
                        const metaTags = {
                            title: data.meta_tags.title,
                            description: data.meta_tags.description,
                            keywords: data.meta_tags.keywords
                        };
                        this.setMemoryCache(cacheKey, metaTags);
                        return metaTags;
                    }
                }
            }

            // Fallback to default metadata
            const fallback = this.getFallbackMetadata(pageType, pageData);
            this.setMemoryCache(cacheKey, fallback);
            return fallback;

        } catch (error) {
            return this.getFallbackMetadata(pageType, pageData);
        }
    }

    /**
     * Memory cache management (lightweight, no localStorage spam)
     */
    getFromMemoryCache(key) {
        const cached = this.memoryCache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
            return cached.data;
        }
        this.memoryCache.delete(key);
        return null;
    }

    setMemoryCache(key, data) {
        this.memoryCache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Fallback meta tags (no AI processing needed)
     */
    getFallbackMetaTags(product) {
        return {
            title: `${product?.name || 'Product'} | Myjamii Store`,
            description: `Buy ${product?.name || 'this product'} for $${product?.price || '0'}. High-quality products at Myjamii Store with fast shipping.`,
            keywords: `${product?.name || 'product'}, buy online, e-commerce, ${product?.category || 'products'}, Myjamii Store`,
            cached: false
        };
    }

    /**
     * Fallback page metadata
     */
    getFallbackMetadata(pageType, pageData = {}) {
        const fallbacks = {
            homepage: {
                title: "Myjamii Store - Premium Electronics, Clothing & More | Shop Online",
                description: "Discover premium products across electronics, clothing, books, home appliances & sports. Fast shipping, quality guarantee at Myjamii Store.",
                keywords: "online shopping, electronics, clothing, books, home appliances, sports equipment, premium products"
            },
            products: {
                title: "Shop All Products | Myjamii Store - Quality & Value",
                description: "Browse our extensive collection of electronics, clothing, books, home appliances & sports gear. Premium quality with fast delivery.",
                keywords: "buy online, shop products, electronics, clothing, books, home appliances, sports equipment"
            },
            category: {
                title: `${pageData.categoryName || 'Category'} | Myjamii Store`,
                description: `Shop premium ${pageData.categoryName?.toLowerCase() || 'products'} at Myjamii Store. Quality items with fast shipping.`,
                keywords: `${pageData.categoryName?.toLowerCase() || 'products'}, online shopping, e-commerce, quality products`
            },
            about: {
                title: "About Myjamii Store - Your Trusted Shopping Partner",
                description: "Learn about Myjamii Store's commitment to quality, customer service, and premium products across multiple categories.",
                keywords: "about us, e-commerce, customer service, quality products, online store"
            }
        };

        return fallbacks[pageType] || fallbacks.homepage;
    }

    /**
     * Legacy cache methods for compatibility
     */
    getCachedMetadata(key) {
        return this.getFromMemoryCache(key);
    }

    setCachedMetadata(key, data) {
        this.setMemoryCache(key, data);
    }

    /**
     * Generate alt text for images
     */
    generateAltText(imageName, productContext = {}) {
        return `${productContext.name || 'Product'} - High quality item from Myjamii Store`;
    }
}

// Export singleton instance
export default new AIServerSEOService();