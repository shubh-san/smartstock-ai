/**
 * API Service Client for SmartStock AI
 * Designed for 1-step plug-and-play integration with FastAPI / Express backend.
 * Once the single base URL is supplied, all operations route through this service.
 */

export const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('smartstock_api_url');
    if (saved && saved.trim()) return saved.trim().replace(/\/+$/, '');
  }
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && envUrl.trim()) return envUrl.trim().replace(/\/+$/, '');
  return null;
};

export const apiService = {
  // Check if live backend URL is configured
  isLiveBackend: () => Boolean(getApiBaseUrl()),

  getBaseUrl: getApiBaseUrl,

  // Set the live backend URL programmatically
  setBaseUrl: (url) => {
    if (typeof window !== 'undefined') {
      if (url && url.trim()) {
        localStorage.setItem('smartstock_api_url', url.trim().replace(/\/+$/, ''));
      } else {
        localStorage.removeItem('smartstock_api_url');
      }
    }
  },

  // 1. Products & Inventory
  async getProducts() {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) return null;
    const res = await fetch(`${baseUrl}/api/v1/products`);
    if (!res.ok) throw new Error(`Products fetch failed: ${res.statusText}`);
    return await res.json();
  },

  async createProduct(productData) {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) return productData;
    const res = await fetch(`${baseUrl}/api/v1/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error(`Product creation failed: ${res.statusText}`);
    return await res.json();
  },

  async addBatch(productId, batchData) {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) return batchData;
    const res = await fetch(`${baseUrl}/api/v1/products/${productId}/batches`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(batchData),
    });
    if (!res.ok) throw new Error(`Batch creation failed: ${res.statusText}`);
    return await res.json();
  },

  async updateProduct(productId, productData) {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) return productData;
    const res = await fetch(`${baseUrl}/api/v1/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error(`Product update failed: ${res.statusText}`);
    return await res.json();
  },

  async deleteProduct(productId) {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) return true;
    const res = await fetch(`${baseUrl}/api/v1/products/${productId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`Product deletion failed: ${res.statusText}`);
    return true;
  },

  // 2. Sales & Billing
  async recordSale(salePayload) {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) return salePayload;
    const res = await fetch(`${baseUrl}/api/v1/sales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(salePayload),
    });
    if (!res.ok) throw new Error(`Sale recording failed: ${res.statusText}`);
    return await res.json();
  },

  async getSales() {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) return null;
    const res = await fetch(`${baseUrl}/api/v1/sales`);
    if (!res.ok) throw new Error(`Sales fetch failed: ${res.statusText}`);
    return await res.json();
  },

  // 3. Discount Recommendations
  async getDiscounts() {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) return null;
    const res = await fetch(`${baseUrl}/api/v1/discounts`);
    if (!res.ok) throw new Error(`Discounts fetch failed: ${res.statusText}`);
    return await res.json();
  },

  async applyDiscount(recommendationId, updateData) {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) return true;
    const res = await fetch(`${baseUrl}/api/v1/discounts/${recommendationId}/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (!res.ok) throw new Error(`Apply discount failed: ${res.statusText}`);
    return await res.json();
  },

  async rejectDiscount(recommendationId) {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) return true;
    const res = await fetch(`${baseUrl}/api/v1/discounts/${recommendationId}/reject`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error(`Reject discount failed: ${res.statusText}`);
    return true;
  },

  // 4. AI Assistant
  async sendAIQuery({ query, language, contextData }) {
    const baseUrl = getApiBaseUrl();
    if (!baseUrl) return null;
    const res = await fetch(`${baseUrl}/api/v1/ai/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, language, contextData }),
    });
    if (!res.ok) throw new Error(`AI assistant query failed: ${res.statusText}`);
    return await res.json();
  },
};
