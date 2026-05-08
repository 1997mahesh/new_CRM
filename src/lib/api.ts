const BASE_URL = '/api';

export const api = {
  get: async (path: string, params?: Record<string, any>) => {
    const token = localStorage.getItem('token');
    let url = `${BASE_URL}${path}`;
    
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const text = await response.text();
    try {
      return text ? JSON.parse(text) : { success: response.ok };
    } catch (e) {
      console.error('JSON Parse Error:', e, 'Text:', text);
      return { success: response.ok, message: 'Invalid response format' };
    }
  },
  post: async (path: string, data: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    const text = await response.text();
    try {
      return text ? JSON.parse(text) : { success: response.ok };
    } catch (e) {
      console.error('JSON Parse Error:', e, 'Text:', text);
      return { success: response.ok, message: 'Invalid response format' };
    }
  },
  put: async (path: string, data: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const text = await response.text();
    try {
      return text ? JSON.parse(text) : { success: response.ok };
    } catch (e) {
      console.error('JSON Parse Error:', e, 'Text:', text);
      return { success: response.ok, message: 'Invalid response format' };
    }
  },
  patch: async (path: string, data: any) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const text = await response.text();
    try {
      return text ? JSON.parse(text) : { success: response.ok };
    } catch (e) {
      console.error('JSON Parse Error:', e, 'Text:', text);
      return { success: response.ok, message: 'Invalid response format' };
    }
  },
  delete: async (path: string) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const text = await response.text();
    try {
      return text ? JSON.parse(text) : { success: response.ok };
    } catch (e) {
      console.error('JSON Parse Error:', e, 'Text:', text);
      return { success: response.ok, message: 'Invalid response format' };
    }
  },
};
