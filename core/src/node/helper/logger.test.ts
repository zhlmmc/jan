import { Logger, LoggerManager, log } from './logger';

class TestLogger extends Logger {
  name = 'testLogger';
  log(args: any): void {
    console.log(args);
  }
}

describe('LoggerManager', () => {
  beforeEach(() => {
    // Reset global instance between tests
    if (global.core?.logger) {
      delete global.core.logger;
    }
  });

  it('should flush queued logs to registered loggers', () => {
    const loggerManager = new LoggerManager();
    const testLogger = new TestLogger();
    loggerManager.register(testLogger);
    const logSpy = jest.spyOn(testLogger, 'log');
    loggerManager.log('test log');
    expect(logSpy).toHaveBeenCalledWith('test log');
  });

  it('should unregister a logger', () => {
    const loggerManager = new LoggerManager();
    const testLogger = new TestLogger();
    loggerManager.register(testLogger);
    loggerManager.unregister('testLogger');
    const retrievedLogger = loggerManager.get('testLogger');
    expect(retrievedLogger).toBeUndefined();
  });

  it('should register and retrieve a logger', () => {
    const loggerManager = new LoggerManager();
    const testLogger = new TestLogger();
    loggerManager.register(testLogger);
    const retrievedLogger = loggerManager.get('testLogger');
    expect(retrievedLogger).toBe(testLogger);
  });

  it('should maintain singleton instance', () => {
    const instance1 = LoggerManager.instance();
    const instance2 = LoggerManager.instance();
    expect(instance1).toBe(instance2);
  });

  it('should not reflush when already flushing', () => {
    const loggerManager = new LoggerManager();
    const testLogger = new TestLogger();
    loggerManager.register(testLogger);
    const logSpy = jest.spyOn(testLogger, 'log');

    // Set isFlushing to true by accessing private property
    Object.defineProperty(loggerManager, 'isFlushing', {
      value: true,
      writable: true
    });

    loggerManager.flushLogs();
    expect(logSpy).not.toHaveBeenCalled();
  });

  it('should handle multiple queued logs', () => {
    const loggerManager = new LoggerManager();
    const testLogger = new TestLogger();
    loggerManager.register(testLogger);
    const logSpy = jest.spyOn(testLogger, 'log');

    loggerManager.log('log1');
    loggerManager.log('log2');
    loggerManager.log('log3');

    expect(logSpy).toHaveBeenCalledTimes(3);
    expect(logSpy).toHaveBeenNthCalledWith(1, 'log1');
    expect(logSpy).toHaveBeenNthCalledWith(2, 'log2');
    expect(logSpy).toHaveBeenNthCalledWith(3, 'log3');
  });

  it('should not flush when no loggers registered', () => {
    const loggerManager = new LoggerManager();
    loggerManager.log('test');
    expect(loggerManager.queuedLogs).toHaveLength(1);
  });

  it('should do nothing when flushing empty queue', () => {
    const loggerManager = new LoggerManager();
    const testLogger = new TestLogger();
    loggerManager.register(testLogger);
    const logSpy = jest.spyOn(testLogger, 'log');

    loggerManager.flushLogs();
    expect(logSpy).not.toHaveBeenCalled();
  });
});

describe('log function', () => {
  beforeEach(() => {
    if (global.core?.logger) {
      delete global.core.logger;
    }
  });

  it('should use singleton logger manager instance', () => {
    const testLogger = new TestLogger();
    LoggerManager.instance().register(testLogger);
    const logSpy = jest.spyOn(testLogger, 'log');

    log('test message');
    expect(logSpy).toHaveBeenCalledWith(['test message']);
  });
});
