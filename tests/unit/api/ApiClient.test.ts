import { ApiClient, ApiResponse } from '../../../src/api/index.js'

// Mock de fetch
global.fetch = jest.fn()

describe('ApiClient', () => {
  let apiClient: ApiClient
  const baseUrl = 'https://api.panas-token.com'

  beforeEach(() => {
    apiClient = new ApiClient(baseUrl)
    jest.clearAllMocks()
  })

  describe('Constructor', () => {
    it('should create ApiClient with base URL', () => {
      expect(apiClient).toBeInstanceOf(ApiClient)
    })

    it('should handle empty base URL', () => {
      const client = new ApiClient('')
      expect(client).toBeInstanceOf(ApiClient)
    })
  })

  describe('GET requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' }
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData)
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await apiClient.get('/test')

      expect(fetch).toHaveBeenCalledWith(`${baseUrl}/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
    })

    it('should handle GET request errors', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await apiClient.get('/not-found')

      expect(result.success).toBe(false)
      expect(result.error).toBe('404 Not Found')
    })

    it('should handle network errors', async () => {
      ;(fetch as jest.Mock).mockRejectedValue(new Error('Network error'))

      const result = await apiClient.get('/test')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })
  })

  describe('POST requests', () => {
    it('should make successful POST request', async () => {
      const mockData = { id: 1, name: 'Test' }
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData)
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await apiClient.post('/test', { name: 'Test' })

      expect(fetch).toHaveBeenCalledWith(`${baseUrl}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'Test' })
      })
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
    })

    it('should handle POST request errors', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await apiClient.post('/test', { invalid: 'data' })

      expect(result.success).toBe(false)
      expect(result.error).toBe('400 Bad Request')
    })
  })

  describe('PUT requests', () => {
    it('should make successful PUT request', async () => {
      const mockData = { id: 1, name: 'Updated' }
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockData)
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await apiClient.put('/test/1', { name: 'Updated' })

      expect(fetch).toHaveBeenCalledWith(`${baseUrl}/test/1`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'Updated' })
      })
      expect(result.success).toBe(true)
      expect(result.data).toEqual(mockData)
    })
  })

  describe('DELETE requests', () => {
    it('should make successful DELETE request', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({})
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await apiClient.delete('/test/1')

      expect(fetch).toHaveBeenCalledWith(`${baseUrl}/test/1`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      expect(result.success).toBe(true)
    })
  })

  describe('Error handling', () => {
    it('should handle JSON parsing errors', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockRejectedValue(new Error('Invalid JSON'))
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      const result = await apiClient.get('/test')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid JSON')
    })

    it('should handle timeout errors', async () => {
      ;(fetch as jest.Mock).mockImplementation(() => 
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 100)
        )
      )

      const result = await apiClient.get('/test')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Timeout')
    })
  })

  describe('Headers', () => {
    it('should include custom headers', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({})
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      await apiClient.get('/test', {
        'Authorization': 'Bearer token',
        'X-Custom-Header': 'value'
      })

      expect(fetch).toHaveBeenCalledWith(`${baseUrl}/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token',
          'X-Custom-Header': 'value'
        }
      })
    })
  })

  describe('URL building', () => {
    it('should handle relative URLs', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({})
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      await apiClient.get('test')

      expect(fetch).toHaveBeenCalledWith(`${baseUrl}/test`, expect.any(Object))
    })

    it('should handle absolute URLs', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({})
      }
      
      ;(fetch as jest.Mock).mockResolvedValue(mockResponse)

      await apiClient.get('https://external-api.com/test')

      expect(fetch).toHaveBeenCalledWith('https://external-api.com/test', expect.any(Object))
    })
  })
})
