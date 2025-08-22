/**
 * Admin AI Service - Frontend interface for admin AI management
 * Handles communication with backend admin AI endpoints
 */
import axios from 'axios';

class AdminAIService {
    constructor() {
        this.baseURL = 'https://myjamii-store.onrender.com';
        this.apiClient = axios.create({
            baseURL: this.baseURL,
            timeout: 30000, // 30 seconds for AI operations
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }

    /**
     * Optimize a specific product with AI
     * @param {number} productId - Product ID to optimize
     * @returns {Promise<Object>} Optimization results
     */
    async optimizeProduct(productId) {
        try {
            const response = await this.apiClient.post(`/admin/ai/products/${productId}/optimize`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Product optimization failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to optimize product'
            };
        }
    }

    /**
     * Get optimization status for a product
     * @param {number} productId - Product ID
     * @returns {Promise<Object>} Optimization status
     */
    async getOptimizationStatus(productId) {
        try {
            const response = await this.apiClient.get(`/admin/ai/products/${productId}/optimize`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Failed to get optimization status:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to get optimization status'
            };
        }
    }

    /**
     * Apply AI optimization to product in database
     * @param {number} productId - Product ID
     * @param {boolean} applyChanges - Whether to apply changes permanently
     * @returns {Promise<Object>} Patch results
     */
    async patchProduct(productId, applyChanges = false) {
        try {
            const response = await this.apiClient.post(`/admin/ai/products/${productId}/patch`, {
                apply_changes: applyChanges
            });
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Product patching failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to patch product'
            };
        }
    }

    /**
     * Batch optimize multiple products
     * @param {Object} options - Batch optimization options
     * @param {number[]} options.productIds - Specific product IDs to optimize
     * @param {number} options.categoryId - Category ID to optimize all products in
     * @param {number} options.limit - Maximum number of products to optimize
     * @returns {Promise<Object>} Batch optimization results
     */
    async batchOptimize(options = {}) {
        try {
            const payload = {};
            
            if (options.productIds && options.productIds.length > 0) {
                payload.product_ids = options.productIds;
            }
            
            if (options.categoryId) {
                payload.category_id = options.categoryId;
            }
            
            if (options.limit) {
                payload.limit = options.limit;
            }

            const response = await this.apiClient.post('/admin/ai/batch-optimize', payload);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Batch optimization failed:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to batch optimize products'
            };
        }
    }

    /**
     * Get AI analytics for admin dashboard
     * @param {Object} options - Analytics options
     * @param {number} options.days - Number of days to analyze (default: 30)
     * @param {number} options.categoryId - Filter by category
     * @returns {Promise<Object>} AI analytics data
     */
    async getAIAnalytics(options = {}) {
        try {
            const params = new URLSearchParams();
            
            if (options.days) {
                params.append('days', options.days);
            }
            
            if (options.categoryId) {
                params.append('category_id', options.categoryId);
            }

            const response = await this.apiClient.get(`/admin/ai/analytics?${params.toString()}`);
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Failed to get AI analytics:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to get AI analytics'
            };
        }
    }

    /**
     * Get SEO performance metrics
     * @returns {Promise<Object>} SEO performance data
     */
    async getSEOPerformance() {
        try {
            const response = await this.apiClient.get('/admin/ai/seo-performance');
            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('Failed to get SEO performance:', error);
            return {
                success: false,
                error: error.response?.data?.error || 'Failed to get SEO performance'
            };
        }
    }

    /**
     * Format AI optimization data for display
     * @param {Object} optimization - Raw optimization data
     * @returns {Object} Formatted optimization data
     */
    formatOptimization(optimization) {
        if (!optimization) return null;

        try {
            const parsed = typeof optimization === 'string' ? JSON.parse(optimization) : optimization;
            
            return {
                enhancedDescription: parsed.enhanced_description || '',
                metaTitle: parsed.meta_title || '',
                metaDescription: parsed.meta_description || '',
                keywords: parsed.keywords || '',
                uniqueSellingPoints: parsed.unique_selling_points || [],
                optimizationReasoning: parsed.optimization_reasoning || '',
                tokensUsed: parsed.tokens_used || 0,
                modelUsed: parsed.model_used || 'Unknown',
                generatedAt: new Date().toISOString()
            };
        } catch (error) {
            console.error('Failed to format optimization data:', error);
            return null;
        }
    }

    /**
     * Calculate optimization ROI estimate
     * @param {Object} analytics - AI analytics data
     * @returns {Object} ROI calculations
     */
    calculateROI(analytics) {
        if (!analytics || !analytics.summary) {
            return {
                totalCost: 0,
                estimatedRevenue: 0,
                roi: 0,
                paybackPeriod: 'N/A'
            };
        }

        const totalCost = analytics.summary.total_cost_dollars || 0;
        const optimizedProducts = analytics.summary.optimized_products_count || 0;
        
        // Conservative estimate: 5% increase in conversion per optimized product
        const estimatedRevenueIncrease = optimizedProducts * 100; // $100 per product
        const roi = totalCost > 0 ? ((estimatedRevenueIncrease - totalCost) / totalCost) * 100 : 0;
        
        return {
            totalCost,
            estimatedRevenue: estimatedRevenueIncrease,
            roi: Math.round(roi),
            paybackPeriod: roi > 0 ? '2-4 weeks' : 'N/A'
        };
    }

    /**
     * Get optimization quality score
     * @param {Object} optimization - Optimization data
     * @returns {number} Quality score (0-100)
     */
    getQualityScore(optimization) {
        if (!optimization) return 0;

        let score = 0;
        
        // Check for key optimization components
        if (optimization.enhancedDescription && optimization.enhancedDescription.length > 50) score += 25;
        if (optimization.metaTitle && optimization.metaTitle.length >= 50 && optimization.metaTitle.length <= 60) score += 25;
        if (optimization.metaDescription && optimization.metaDescription.length >= 150 && optimization.metaDescription.length <= 160) score += 25;
        if (optimization.keywords && optimization.keywords.split(',').length >= 5) score += 15;
        if (optimization.uniqueSellingPoints && optimization.uniqueSellingPoints.length >= 3) score += 10;

        return Math.min(score, 100);
    }
}

// Export singleton instance
const adminAIService = new AdminAIService();
export default adminAIService;