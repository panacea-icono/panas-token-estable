type FetchLike = (input: RequestInfo, init?: RequestInit) => Promise<Response>;

export class ApiClient {
  private baseUrl: string;
  private fetcher: FetchLike;
  private defaultTimeoutMs: number;

  constructor(baseUrl: string, fetcher: FetchLike = fetch, defaultTimeoutMs = 10000) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.fetcher = fetcher;
    this.defaultTimeoutMs = defaultTimeoutMs;
  }

  async get(path: string, opts?: { timeoutMs?: number; headers?: Record<string, string> }) {
    return this.request('GET', path, undefined, opts);
  }

  async post(path: string, body?: unknown, opts?: { timeoutMs?: number; headers?: Record<string, string> }) {
    return this.request('POST', path, body, opts);
  }

  private async request(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    path: string,
    body?: unknown,
    opts?: { timeoutMs?: number; headers?: Record<string, string> }
  ) {
    const url = `${this.baseUrl}${path.startsWith('/') ? '' : '/'}${path}`;
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), opts?.timeoutMs ?? this.defaultTimeoutMs);

    try {
      const res = await this.fetcher(url, {
        method,
        headers: {
          'content-type': 'application/json',
          ...(opts?.headers ?? {})
        },
        body: body != null ? JSON.stringify(body) : undefined,
        signal: ctrl.signal
      });
      clearTimeout(timeout);
      if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
      }
      const ctype = res.headers.get('content-type') || '';
      return ctype.includes('application/json') ? res.json() : res.text();
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw err;
    }
  }
}


