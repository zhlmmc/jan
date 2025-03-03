import { MessageRequest, AssistantTool } from '../../types'
import { InferenceTool } from './tool'
import { ToolManager } from './manager'

describe('ToolManager', () => {
  let toolManager: ToolManager

  beforeEach(() => {
    toolManager = new ToolManager()
  })

  describe('register', () => {
    it('should register a tool', () => {
      const mockTool: InferenceTool = {
        name: 'test-tool',
        process: jest.fn()
      }

      toolManager.register(mockTool)

      expect(toolManager.tools.get('test-tool')).toBe(mockTool)
    })
  })

  describe('get', () => {
    it('should return registered tool', () => {
      const mockTool: InferenceTool = {
        name: 'test-tool',
        process: jest.fn()
      }

      toolManager.register(mockTool)

      expect(toolManager.get('test-tool')).toBe(mockTool)
    })

    it('should return undefined for non-existent tool', () => {
      expect(toolManager.get('non-existent')).toBeUndefined()
    })
  })

  describe('process', () => {
    it('should process request with enabled tools', async () => {
      const mockRequest: MessageRequest = {
        content: 'test content'
      }

      const mockTool1: InferenceTool = {
        name: 'tool1',
        process: jest.fn().mockImplementation((req) => Promise.resolve({
          ...req,
          content: req.content + '-tool1'
        }))
      }

      const mockTool2: InferenceTool = {
        name: 'tool2',
        process: jest.fn().mockImplementation((req) => Promise.resolve({
          ...req,
          content: req.content + '-tool2'
        }))
      }

      toolManager.register(mockTool1)
      toolManager.register(mockTool2)

      const tools: AssistantTool[] = [
        { type: 'tool1', enabled: true },
        { type: 'tool2', enabled: true }
      ]

      const result = await toolManager.process(mockRequest, tools)

      expect(result.content).toBe('test content-tool1-tool2')
      expect(mockTool1.process).toHaveBeenCalledTimes(1)
      expect(mockTool2.process).toHaveBeenCalledTimes(1)
    })

    it('should skip disabled tools', async () => {
      const mockRequest: MessageRequest = {
        content: 'test content'
      }

      const mockTool: InferenceTool = {
        name: 'tool1',
        process: jest.fn()
      }

      toolManager.register(mockTool)

      const tools: AssistantTool[] = [
        { type: 'tool1', enabled: false }
      ]

      const result = await toolManager.process(mockRequest, tools)

      expect(result).toBe(mockRequest)
      expect(mockTool.process).not.toHaveBeenCalled()
    })

    it('should handle non-existent tools', async () => {
      const mockRequest: MessageRequest = {
        content: 'test content'
      }

      const tools: AssistantTool[] = [
        { type: 'non-existent', enabled: true }
      ]

      const result = await toolManager.process(mockRequest, tools)

      expect(result).toBe(mockRequest)
    })
  })

  describe('instance', () => {
    it('should return existing instance if available', () => {
      const mockWindow = {
        core: {
          toolManager: new ToolManager()
        }
      }

      // @ts-ignore
      global.window = mockWindow

      const instance = ToolManager.instance()

      expect(instance).toBe(mockWindow.core.toolManager)
    })

    it('should create new instance if none exists', () => {
      // @ts-ignore
      global.window = {}

      const instance = ToolManager.instance()

      expect(instance).toBeInstanceOf(ToolManager)
    })
  })
})
