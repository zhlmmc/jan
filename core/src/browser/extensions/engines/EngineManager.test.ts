/**
 * @jest-environment jsdom
 */
import { EngineManager } from './EngineManager'
import { AIEngine } from './AIEngine'
import { InferenceEngine } from '../../../types'

// @ts-ignore
class MockAIEngine implements AIEngine {
  provider: string
  constructor(provider: string) {
    this.provider = provider
  }
}

describe('EngineManager', () => {
  let engineManager: EngineManager

  beforeEach(() => {
    engineManager = new EngineManager()
    // Reset window.core before each test
    window.core = undefined
  })

  test('should register an engine', () => {
    const engine = new MockAIEngine('testProvider')
    // @ts-ignore
    engineManager.register(engine)
    expect(engineManager.engines.get('testProvider')).toBe(engine)
  })

  test('should retrieve a registered engine by provider', () => {
    const engine = new MockAIEngine('testProvider')
    // @ts-ignore
    engineManager.register(engine)
    // @ts-ignore
    const retrievedEngine = engineManager.get<MockAIEngine>('testProvider')
    expect(retrievedEngine).toBe(engine)
  })

  test('should return undefined for an unregistered provider', () => {
    // @ts-ignore
    const retrievedEngine = engineManager.get<MockAIEngine>('nonExistentProvider')
    expect(retrievedEngine).toBeUndefined()
  })

  test('should map nitro provider to cortex', () => {
    const cortexEngine = new MockAIEngine(InferenceEngine.cortex)
    // @ts-ignore
    engineManager.register(cortexEngine)
    // @ts-ignore
    const retrievedEngine = engineManager.get<MockAIEngine>(InferenceEngine.nitro)
    expect(retrievedEngine).toBe(cortexEngine)
  })

  test('should map all cortex variants to cortex', () => {
    const cortexEngine = new MockAIEngine(InferenceEngine.cortex)
    // @ts-ignore
    engineManager.register(cortexEngine)

    const variants = [
      InferenceEngine.cortex_llamacpp,
      InferenceEngine.cortex_onnx,
      InferenceEngine.cortex_tensorrtllm
    ]

    variants.forEach(variant => {
      // @ts-ignore
      const retrievedEngine = engineManager.get<MockAIEngine>(variant)
      expect(retrievedEngine).toBe(cortexEngine)
    })
  })

  test('should handle multiple cortex variant registrations', () => {
    const cortexEngine = new MockAIEngine(InferenceEngine.cortex)
    const cortexLlamaCppEngine = new MockAIEngine(InferenceEngine.cortex_llamacpp)

    // @ts-ignore
    engineManager.register(cortexEngine)
    // @ts-ignore
    engineManager.register(cortexLlamaCppEngine)

    // Both should resolve to the cortex engine
    // @ts-ignore
    expect(engineManager.get(InferenceEngine.cortex)).toBe(cortexEngine)
    // @ts-ignore
    expect(engineManager.get(InferenceEngine.cortex_llamacpp)).toBe(cortexEngine)
  })

  test('should create new instance when window.core is undefined', () => {
    const instance = EngineManager.instance()
    expect(instance).toBeInstanceOf(EngineManager)
  })

  test('should use existing instance from window.core', () => {
    const existingManager = new EngineManager()
    window.core = {
      engineManager: existingManager
    }
    const instance = EngineManager.instance()
    expect(instance).toBe(existingManager)
  })

  test('should consistently return same instance when window.core is set', () => {
    const existingManager = new EngineManager()
    window.core = {
      engineManager: existingManager
    }
    const instance1 = EngineManager.instance()
    const instance2 = EngineManager.instance()
    expect(instance1).toBe(instance2)
    expect(instance1).toBe(existingManager)
  })

  test('should handle undefined window.core.engineManager', () => {
    window.core = {}
    const instance = EngineManager.instance()
    expect(instance).toBeInstanceOf(EngineManager)
  })
})
