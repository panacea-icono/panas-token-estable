// PanasToken Estable - API Layer
// Este directorio contendrá la lógica de la API

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private buildUrl(endpoint: string): string {
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint;
    const base = this.baseUrl?.replace(/\/$/, '') || '';
    const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${base}${path}`;
  }

  private defaultHeaders(extra?: Record<string, string>) {
    return {
      'Content-Type': 'application/json',
      ...(extra || {})
    } as Record<string, string>;
  }

  private async request<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', endpoint: string, body?: unknown, headers?: Record<string, string>, timeoutMs = 5000): Promise<ApiResponse<T>> {
    const url = this.buildUrl(endpoint);
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      // @ts-ignore
      const resp = await fetch(url, {
        method,
        headers: this.defaultHeaders(headers),
        body: body != null && method !== 'GET' && method !== 'DELETE' ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });
      if (!resp.ok) return { success: false, error: `${resp.status} ${resp.statusText}` };
      const data = (await resp.json()) as T;
      return { success: true, data };
    } catch (e: any) {
      const msg = e?.name === 'AbortError' ? 'Timeout' : (e?.message || 'Network error');
      return { success: false, error: msg };
    } finally {
      clearTimeout(id);
    }
  }

  async get<T>(endpoint: string, headers?: Record<string, string>, timeoutMs?: number): Promise<ApiResponse<T>> {
    return this.request<T>('GET', endpoint, undefined, headers, timeoutMs);
  }

  async post<T>(endpoint: string, body?: unknown, headers?: Record<string, string>, timeoutMs?: number): Promise<ApiResponse<T>> {
    return this.request<T>('POST', endpoint, body, headers, timeoutMs);
  }

  async put<T>(endpoint: string, body?: unknown, headers?: Record<string, string>, timeoutMs?: number): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', endpoint, body, headers, timeoutMs);
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>, timeoutMs?: number): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', endpoint, undefined, headers, timeoutMs);
  }
}
