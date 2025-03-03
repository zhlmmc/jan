import { ThreadMessageBuilder } from './threadMessageBuilder'
import { MessageRequestBuilder } from './messageRequestBuilder'
import { ChatCompletionRole, ContentType, MessageStatus } from '@janhq/core'

describe('ThreadMessageBuilder', () => {
  let messageRequestBuilder: MessageRequestBuilder
  let threadMessageBuilder: ThreadMessageBuilder

  beforeEach(() => {
    messageRequestBuilder = {
      msgId: 'test-msg-id',
      thread: {
        id: 'test-thread-id'
      }
    } as MessageRequestBuilder

    threadMessageBuilder = new ThreadMessageBuilder(messageRequestBuilder)
  })

  describe('build', () => {
    it('should build thread message with correct properties', () => {
      const message = threadMessageBuilder.build()

      expect(message).toEqual({
        id: 'test-msg-id',
        thread_id: 'test-thread-id',
        attachments: [],
        role: ChatCompletionRole.User,
        status: MessageStatus.Ready,
        created_at: expect.any(Number),
        completed_at: expect.any(Number),
        object: 'thread.message',
        content: [],
        metadata: {}
      })
    })
  })

  describe('pushMessage', () => {
    it('should add text content when prompt is provided', () => {
      threadMessageBuilder.pushMessage('test prompt', undefined)
      const message = threadMessageBuilder.build()

      expect(message.content).toEqual([
        {
          type: ContentType.Text,
          text: {
            value: 'test prompt',
            annotations: []
          }
        }
      ])
    })

    it('should add image content when base64 and image file are provided', () => {
      const base64 = 'data:image/png;base64,test'
      threadMessageBuilder.pushMessage('test prompt', base64, {
        type: 'image',
        id: 'test-image-id',
        name: 'test.png'
      })

      const message = threadMessageBuilder.build()
      expect(message.content).toEqual([
        {
          type: ContentType.Text,
          text: {
            value: 'test prompt',
            annotations: []
          }
        },
        {
          type: ContentType.Image,
          image_url: {
            url: base64
          }
        }
      ])
    })

    it('should add pdf attachment and metadata when base64 and pdf file are provided', () => {
      const base64 = 'data:application/pdf;base64,test'
      threadMessageBuilder.pushMessage('test prompt', base64, {
        type: 'pdf',
        id: 'test-pdf-id',
        name: 'test.pdf',
        file: new File(['test'], 'test.pdf', { type: 'application/pdf' })
      })

      const message = threadMessageBuilder.build()
      expect(message.attachments).toEqual([
        {
          file_id: 'test-pdf-id',
          tools: [
            {
              type: 'file_search'
            }
          ]
        }
      ])

      expect(message.metadata).toEqual({
        filename: 'test.pdf',
        size: 4
      })
    })

    it('should handle empty prompt and no file', () => {
      threadMessageBuilder.pushMessage('', undefined)
      const message = threadMessageBuilder.build()

      expect(message.content).toEqual([])
      expect(message.attachments).toEqual([])
      expect(message.metadata).toEqual({})
    })

    it('should return builder instance for chaining', () => {
      const result = threadMessageBuilder.pushMessage('test', undefined)
      expect(result).toBe(threadMessageBuilder)
    })
  })
})
