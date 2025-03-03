import { extractDescription, removeYamlFrontMatter, extractModelName, extractModelRepo } from './modelSource'

describe('modelSource', () => {
  describe('extractDescription', () => {
    it('should return undefined when input is undefined', () => {
      expect(extractDescription(undefined)).toBeUndefined()
    })

    it('should extract text between ## Overview and next section', () => {
      const input = `
# Title
## Overview
This is the overview text
## Another Section
Other content
`
      expect(extractDescription(input)).toBe('This is the overview text')
    })

    it('should extract first 500 chars when no Overview section exists', () => {
      const input = 'A'.repeat(1000)
      expect(extractDescription(input)).toBe('A'.repeat(500))
    })

    it('should handle empty string input', () => {
      expect(extractDescription('')).toBe('')
    })
  })

  describe('removeYamlFrontMatter', () => {
    it('should remove YAML front matter', () => {
      const input = `---
title: Test
date: 2025-03-01
---
Content here`
      expect(removeYamlFrontMatter(input)).toBe('Content here')
    })

    it('should return original content if no front matter exists', () => {
      const input = 'Just content'
      expect(removeYamlFrontMatter(input)).toBe('Just content')
    })

    it('should handle empty string', () => {
      expect(removeYamlFrontMatter('')).toBe('')
    })
  })

  describe('extractModelName', () => {
    it('should extract model name from repo path', () => {
      expect(extractModelName('cortexso/tinyllama')).toBe('tinyllama')
    })

    it('should return full string if no slash exists', () => {
      expect(extractModelName('tinyllama')).toBe('tinyllama')
    })

    it('should return undefined for undefined input', () => {
      expect(extractModelName(undefined)).toBeUndefined()
    })

    it('should handle empty string', () => {
      expect(extractModelName('')).toBe('')
    })
  })

  describe('extractModelRepo', () => {
    it('should extract repo path from HF URL', () => {
      expect(extractModelRepo('https://huggingface.co/cortexso/tinyllama')).toBe('cortexso/tinyllama')
    })

    it('should return original string if not HF URL', () => {
      expect(extractModelRepo('cortexso/tinyllama')).toBe('cortexso/tinyllama')
    })

    it('should return undefined for undefined input', () => {
      expect(extractModelRepo(undefined)).toBeUndefined()
    })

    it('should handle empty string', () => {
      expect(extractModelRepo('')).toBe('')
    })
  })
})
