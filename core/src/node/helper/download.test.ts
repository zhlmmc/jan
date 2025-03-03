import { DownloadManager } from './download';

describe('DownloadManager', () => {
  let downloadManager: DownloadManager;

  beforeEach(() => {
    downloadManager = new DownloadManager();
  });

  it('should maintain singleton instance', () => {
    const instance1 = new DownloadManager();
    const instance2 = new DownloadManager();

    expect(instance1).toBe(instance2);
    expect(instance1).toBe(DownloadManager.instance);
  });

  it('should set a network request for a specific file', () => {
    const fileName = 'testFile';
    const request = { url: 'http://example.com' };

    downloadManager.setRequest(fileName, request);

    expect(downloadManager.networkRequests[fileName]).toEqual(request);
  });

  it('should clear a network request when undefined is passed', () => {
    const fileName = 'testFile';
    const request = { url: 'http://example.com' };

    downloadManager.setRequest(fileName, request);
    downloadManager.setRequest(fileName, undefined);

    expect(downloadManager.networkRequests[fileName]).toBeUndefined();
  });

  it('should initialize with empty maps', () => {
    expect(downloadManager.networkRequests).toEqual({});
    expect(downloadManager.downloadProgressMap).toEqual({});
    expect(downloadManager.downloadInfo).toEqual({});
  });

  it('should maintain separate network requests for different files', () => {
    const file1 = 'file1';
    const file2 = 'file2';
    const request1 = { url: 'http://example.com/1' };
    const request2 = { url: 'http://example.com/2' };

    downloadManager.setRequest(file1, request1);
    downloadManager.setRequest(file2, request2);

    expect(downloadManager.networkRequests[file1]).toEqual(request1);
    expect(downloadManager.networkRequests[file2]).toEqual(request2);
  });

  it('should share state across instances due to singleton pattern', () => {
    const instance1 = new DownloadManager();
    const instance2 = new DownloadManager();

    const fileName = 'shared';
    const request = { url: 'http://example.com/shared' };

    instance1.setRequest(fileName, request);
    expect(instance2.networkRequests[fileName]).toEqual(request);
  });

  it('should maintain separate maps for progress and info', () => {
    const modelId = 'model1';
    const filePath = 'path/to/file';
    const downloadState = { progress: 50, status: 'downloading' };

    downloadManager.downloadProgressMap[modelId] = downloadState;
    downloadManager.downloadInfo[filePath] = downloadState;

    expect(downloadManager.downloadProgressMap[modelId]).toBe(downloadState);
    expect(downloadManager.downloadInfo[filePath]).toBe(downloadState);
    expect(Object.keys(downloadManager.downloadProgressMap)).toHaveLength(1);
    expect(Object.keys(downloadManager.downloadInfo)).toHaveLength(1);
  });
});
