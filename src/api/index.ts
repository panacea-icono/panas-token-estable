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

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    // Implementación básica de API client
    console.log(`GET ${this.baseUrl}${endpoint}`);
    return {
      success: true,
      data: {} as T
    };
  }
}
