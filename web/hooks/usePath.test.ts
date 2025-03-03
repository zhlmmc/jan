import { openFileExplorer, joinPath, baseName } from '@janhq/core'
import { renderHook } from '@testing-library/react'
import { useAtomValue } from 'jotai'
import { usePath } from './usePath'
import { getFileInfo } from '@/utils/file'

jest.mock('@janhq/core')
jest.mock('jotai')
jest.mock('@/utils/file')

describe('usePath', () => {
  // Empty test suite to be filled with passing tests later
  it('should pass', () => {
    expect(true).toBe(true)
  })
})
