import { ImportingModel } from '@janhq/core'
import { atom } from 'jotai'
import {
  removeDownloadedModelAtom,
  downloadedModelsAtom,
  addDownloadingModelAtom,
  downloadingModelsAtom,
  removeDownloadingModelAtom,
  importingModelsAtom,
  updateImportingModelProgressAtom,
  setImportingModelErrorAtom,
  setImportingModelSuccessAtom,
  updateImportingModelAtom
} from './Model.atom'

describe('Model Atoms', () => {
  let mockGet: jest.Mock
  let mockSet: jest.Mock

  beforeEach(() => {
    mockGet = jest.fn()
    mockSet = jest.fn()
  })

  describe('removeDownloadedModelAtom', () => {
    it('should remove model from downloaded models', () => {
      const downloadedModels = [
        { id: '1', name: 'Model 1' },
        { id: '2', name: 'Model 2' }
      ]
      mockGet.mockReturnValue(downloadedModels)

      removeDownloadedModelAtom.write(mockGet, mockSet, '1')

      expect(mockSet).toHaveBeenCalledWith(
        downloadedModelsAtom,
        expect.arrayContaining([{ id: '2', name: 'Model 2' }])
      )
    })
  })

  describe('addDownloadingModelAtom', () => {
    it('should add model to downloading list if not present', () => {
      mockGet.mockReturnValue(['model1'])

      addDownloadingModelAtom.write(mockGet, mockSet, 'model2')

      expect(mockSet).toHaveBeenCalledWith(
        downloadingModelsAtom,
        ['model1', 'model2']
      )
    })

    it('should not add duplicate model to downloading list', () => {
      mockGet.mockReturnValue(['model1'])

      addDownloadingModelAtom.write(mockGet, mockSet, 'model1')

      expect(mockSet).not.toHaveBeenCalled()
    })
  })

  describe('removeDownloadingModelAtom', () => {
    it('should remove model from downloading list', () => {
      mockGet.mockReturnValue(['model1', 'model2'])

      removeDownloadingModelAtom.write(mockGet, mockSet, 'model1')

      expect(mockSet).toHaveBeenCalledWith(
        downloadingModelsAtom,
        ['model2']
      )
    })
  })

  describe('updateImportingModelProgressAtom', () => {
    it('should update importing model progress', () => {
      const importingModel: ImportingModel = {
        importId: 'import1',
        name: 'Model 1',
        status: 'IMPORTING',
        percentage: 0
      }
      mockGet.mockReturnValue([importingModel])

      updateImportingModelProgressAtom.write(mockGet, mockSet, 'import1', 0.5)

      expect(mockSet).toHaveBeenCalledWith(
        importingModelsAtom,
        [{
          ...importingModel,
          percentage: 0.5
        }]
      )
    })

    it('should not update if model not found', () => {
      mockGet.mockReturnValue([])

      updateImportingModelProgressAtom.write(mockGet, mockSet, 'import1', 0.5)

      expect(mockSet).not.toHaveBeenCalled()
    })
  })

  describe('setImportingModelErrorAtom', () => {
    it('should set importing model error status', () => {
      const importingModel: ImportingModel = {
        importId: 'import1',
        name: 'Model 1',
        status: 'IMPORTING',
        percentage: 0
      }
      mockGet.mockReturnValue([importingModel])

      setImportingModelErrorAtom.write(mockGet, mockSet, 'import1', 'Error message')

      expect(mockSet).toHaveBeenCalledWith(
        importingModelsAtom,
        [{
          ...importingModel,
          status: 'FAILED'
        }]
      )
    })
  })

  describe('setImportingModelSuccessAtom', () => {
    it('should set importing model success status', () => {
      const importingModel: ImportingModel = {
        importId: 'import1',
        name: 'Model 1',
        status: 'IMPORTING',
        percentage: 0
      }
      mockGet.mockReturnValue([importingModel])

      setImportingModelSuccessAtom.write(mockGet, mockSet, 'import1', 'model1')

      expect(mockSet).toHaveBeenCalledWith(
        importingModelsAtom,
        [{
          ...importingModel,
          modelId: 'model1',
          status: 'IMPORTED',
          percentage: 1
        }]
      )
    })
  })

  describe('updateImportingModelAtom', () => {
    it('should update importing model metadata', () => {
      const importingModel: ImportingModel = {
        importId: 'import1',
        name: 'Model 1',
        status: 'IMPORTING',
        percentage: 0
      }
      mockGet.mockReturnValue([importingModel])

      updateImportingModelAtom.write(
        mockGet,
        mockSet,
        'import1',
        'New Name',
        'New Description',
        ['tag1', 'tag2']
      )

      expect(mockSet).toHaveBeenCalledWith(
        importingModelsAtom,
        [{
          ...importingModel,
          name: 'New Name',
          description: 'New Description',
          tags: ['tag1', 'tag2']
        }]
      )
    })

    it('should not update if model not found', () => {
      mockGet.mockReturnValue([])

      updateImportingModelAtom.write(
        mockGet,
        mockSet,
        'import1',
        'New Name',
        'New Description',
        ['tag1']
      )

      expect(mockSet).not.toHaveBeenCalled()
    })
  })
})
