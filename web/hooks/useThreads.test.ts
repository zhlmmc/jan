import { renderHook, waitFor } from '@testing-library/react'
import { ExtensionTypeEnum, Thread } from '@janhq/core'
import { extensionManager } from '@/extension/ExtensionManager'
import useThreads from './useThreads'

jest.mock('@/extension/ExtensionManager', () => ({
  extensionManager: {
    get: jest.fn()
  }
}))

describe('useThreads', () => {
  const mockThreads: Thread[] = [
    {
      id: 'thread1',
      metadata: {
        updated_at: 1000,
        lastMessage: 'Hello'
      },
      assistants: [
        {
          model: {
            parameters: {
              param1: 'value1'
            },
            settings: {
              setting1: 'value1'
            }
          }
        }
      ]
    },
    {
      id: 'thread2',
      metadata: {
        updated_at: 2000,
        lastMessage: 'Hi'
      },
      assistants: [
        {
          model: {
            parameters: {
              param2: 'value2'
            },
            settings: {
              setting2: 'value2'
            }
          }
        }
      ]
    }
  ]

  const mockListThreads = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockListThreads.mockResolvedValue(mockThreads)
    ;(extensionManager.get as jest.Mock).mockReturnValue({
      listThreads: mockListThreads
    })
  })

  it('should fetch and sort threads', async () => {
    renderHook(() => useThreads())

    await waitFor(() => expect(mockListThreads).toHaveBeenCalled())

    expect(extensionManager.get).toHaveBeenCalledWith(ExtensionTypeEnum.Conversational)
    expect(mockListThreads).toHaveBeenCalled()
  })

  it('should handle empty threads list', async () => {
    mockListThreads.mockResolvedValue([])

    renderHook(() => useThreads())

    await waitFor(() => expect(mockListThreads).toHaveBeenCalled())

    expect(extensionManager.get).toHaveBeenCalledWith(ExtensionTypeEnum.Conversational)
    expect(mockListThreads).toHaveBeenCalled()
  })

  it('should handle threads without metadata', async () => {
    const threadsWithoutMetadata: Thread[] = [
      {
        id: 'thread1',
        assistants: []
      }
    ]

    mockListThreads.mockResolvedValue(threadsWithoutMetadata)

    renderHook(() => useThreads())

    await waitFor(() => expect(mockListThreads).toHaveBeenCalled())
  })

  it('should handle threads without assistants', async () => {
    const threadsWithoutAssistants: Thread[] = [
      {
        id: 'thread1',
        metadata: {
          updated_at: 1000,
          lastMessage: 'Hello'
        }
      }
    ]

    mockListThreads.mockResolvedValue(threadsWithoutAssistants)

    renderHook(() => useThreads())

    await waitFor(() => expect(mockListThreads).toHaveBeenCalled())
  })

  it('should handle extension not found', async () => {
    ;(extensionManager.get as jest.Mock).mockReturnValue(undefined)

    renderHook(() => useThreads())

    await waitFor(() => expect(extensionManager.get).toHaveBeenCalledWith(ExtensionTypeEnum.Conversational))
  })
})
