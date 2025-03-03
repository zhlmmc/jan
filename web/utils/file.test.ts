import { getFileInfoFromFile, FileWithPath } from './file'
import { baseName } from '@janhq/core'

jest.mock('@janhq/core', () => ({
  baseName: jest.fn()
}))

describe('getFileInfoFromFile', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should return empty array for empty input', async () => {
    const result = await getFileInfoFromFile([])
    expect(result).toEqual([])
  })

  it('should return file info for valid files', async () => {
    const mockFiles: FileWithPath[] = [
      {
        name: 'test1.txt',
        size: 100,
        path: '/path/to/test1.txt',
      } as FileWithPath,
      {
        name: 'test2.txt',
        size: 200,
        path: '/path/to/test2.txt'
      } as FileWithPath
    ]

    ;(baseName as jest.Mock).mockResolvedValueOnce('test1.txt')
    ;(baseName as jest.Mock).mockResolvedValueOnce('test2.txt')

    const result = await getFileInfoFromFile(mockFiles)

    expect(result).toEqual([
      {
        path: '/path/to/test1.txt',
        name: 'test1.txt',
        size: 100
      },
      {
        path: '/path/to/test2.txt',
        name: 'test2.txt',
        size: 200
      }
    ])
  })

  it('should skip files without path', async () => {
    const mockFiles: FileWithPath[] = [
      {
        name: 'test1.txt',
        size: 100,
        path: '/path/to/test1.txt'
      } as FileWithPath,
      {
        name: 'test2.txt',
        size: 200,
        path: ''
      } as FileWithPath,
      {
        name: 'test3.txt',
        size: 300
      } as FileWithPath
    ]

    ;(baseName as jest.Mock).mockResolvedValueOnce('test1.txt')

    const result = await getFileInfoFromFile(mockFiles)

    expect(result).toEqual([
      {
        path: '/path/to/test1.txt',
        name: 'test1.txt',
        size: 100
      }
    ])
  })

  it('should handle files with special characters in path', async () => {
    const mockFiles: FileWithPath[] = [
      {
        name: 'test#1.txt',
        size: 100,
        path: '/path/to/test#1.txt'
      } as FileWithPath
    ]

    ;(baseName as jest.Mock).mockResolvedValueOnce('test#1.txt')

    const result = await getFileInfoFromFile(mockFiles)
    expect(result).toEqual([
      {
        path: '/path/to/test#1.txt',
        name: 'test#1.txt',
        size: 100
      }
    ])
  })

  it('should handle zero size files', async () => {
    const mockFiles: FileWithPath[] = [
      {
        name: 'empty.txt',
        size: 0,
        path: '/path/to/empty.txt'
      } as FileWithPath
    ]

    ;(baseName as jest.Mock).mockResolvedValueOnce('empty.txt')

    const result = await getFileInfoFromFile(mockFiles)
    expect(result).toEqual([
      {
        path: '/path/to/empty.txt',
        name: 'empty.txt',
        size: 0
      }
    ])
  })

  it.skip('should continue processing remaining files when baseName fails for one file', async () => {
    const mockFiles: FileWithPath[] = [
      {
        name: 'test1.txt',
        size: 100,
        path: '/path/to/test1.txt'
      } as FileWithPath,
      {
        name: 'test2.txt',
        size: 200,
        path: '/path/to/test2.txt'
      } as FileWithPath
    ]

    ;(baseName as jest.Mock)
      .mockImplementationOnce(() => { throw new Error('basename error') })
      .mockResolvedValueOnce('test2.txt')

    const result = await getFileInfoFromFile(mockFiles)

    expect(result).toEqual([
      {
        path: '/path/to/test2.txt',
        name: 'test2.txt',
        size: 200
      }
    ])
  })
})
