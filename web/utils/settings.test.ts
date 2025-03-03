import { updateDistinctId, getAppDistinctId } from './settings'

describe('Settings', () => {
  let mockGetAppConfigurations: jest.Mock
  let mockUpdateAppConfiguration: jest.Mock

  beforeEach(() => {
    mockGetAppConfigurations = jest.fn()
    mockUpdateAppConfiguration = jest.fn()

    Object.defineProperty(window, 'core', {
      value: {
        api: {
          getAppConfigurations: mockGetAppConfigurations,
          updateAppConfiguration: mockUpdateAppConfiguration
        }
      },
      writable: true,
      configurable: true
    })
  })

  afterEach(() => {
    jest.resetAllMocks()
    delete (window as any).core
  })

  describe('updateDistinctId', () => {
    it('should update distinct id in app configuration', async () => {
      const mockConfig = {
        distinct_id: 'old-id'
      }
      mockGetAppConfigurations.mockResolvedValue(mockConfig)

      await updateDistinctId('new-id')

      expect(mockGetAppConfigurations).toHaveBeenCalled()
      expect(mockUpdateAppConfiguration).toHaveBeenCalledWith({
        ...mockConfig,
        distinct_id: 'new-id'
      })
    })

    it('should handle undefined window.core', async () => {
      delete (window as any).core

      await expect(updateDistinctId('new-id')).rejects.toThrow(TypeError)
      expect(mockGetAppConfigurations).not.toHaveBeenCalled()
      expect(mockUpdateAppConfiguration).not.toHaveBeenCalled()
    })

    it('should handle undefined window.core.api', async () => {
      Object.defineProperty(window, 'core', {
        value: {},
        writable: true,
        configurable: true
      })

      await expect(updateDistinctId('new-id')).rejects.toThrow(TypeError)
      expect(mockGetAppConfigurations).not.toHaveBeenCalled()
      expect(mockUpdateAppConfiguration).not.toHaveBeenCalled()
    })

    it('should handle undefined app configuration', async () => {
      mockGetAppConfigurations.mockResolvedValue(undefined)

      await expect(updateDistinctId('new-id')).rejects.toThrow(TypeError)
      expect(mockGetAppConfigurations).toHaveBeenCalled()
      expect(mockUpdateAppConfiguration).not.toHaveBeenCalled()
    })

    it('should handle undefined distinct_id in app configuration', async () => {
      const mockConfig = {} as any
      mockGetAppConfigurations.mockResolvedValue(mockConfig)

      await updateDistinctId('new-id')

      expect(mockGetAppConfigurations).toHaveBeenCalled()
      expect(mockUpdateAppConfiguration).toHaveBeenCalledWith({
        ...mockConfig,
        distinct_id: 'new-id'
      })
    })
  })

  describe('getAppDistinctId', () => {
    it('should return distinct id from app configuration', async () => {
      const mockConfig = {
        distinct_id: 'test-id'
      }
      mockGetAppConfigurations.mockResolvedValue(mockConfig)

      const result = await getAppDistinctId()

      expect(mockGetAppConfigurations).toHaveBeenCalled()
      expect(result).toBe('test-id')
    })

    it('should handle undefined window.core', async () => {
      delete (window as any).core

      await expect(getAppDistinctId()).rejects.toThrow(TypeError)
      expect(mockGetAppConfigurations).not.toHaveBeenCalled()
    })

    it('should handle undefined window.core.api', async () => {
      Object.defineProperty(window, 'core', {
        value: {},
        writable: true,
        configurable: true
      })

      await expect(getAppDistinctId()).rejects.toThrow(TypeError)
      expect(mockGetAppConfigurations).not.toHaveBeenCalled()
    })

    it('should handle undefined app configuration', async () => {
      mockGetAppConfigurations.mockResolvedValue(undefined)

      await expect(getAppDistinctId()).rejects.toThrow(TypeError)
      expect(mockGetAppConfigurations).toHaveBeenCalled()
    })

    it('should return undefined when distinct_id is not set in app configuration', async () => {
      const mockConfig = {} as any
      mockGetAppConfigurations.mockResolvedValue(mockConfig)

      const result = await getAppDistinctId()

      expect(mockGetAppConfigurations).toHaveBeenCalled()
      expect(result).toBeUndefined()
    })
  })
})
