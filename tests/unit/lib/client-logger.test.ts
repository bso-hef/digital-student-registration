import ClientLogger from "@/lib/client-logger";
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Tests for ClientLogger
 * @file tests/unit/lib/client-logger.test.ts
 */

describe("ClientLogger", () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    // Reset console spies
    vi.restoreAllMocks();
  });

  describe("in development mode", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    it("should call console.log in development", () => {
      const spy = vi.spyOn(console, "log");
      ClientLogger.log("test message");
      expect(spy).toHaveBeenCalledWith("test message");
    });

    it("should call console.error in development", () => {
      const spy = vi.spyOn(console, "error");
      ClientLogger.error("error message");
      expect(spy).toHaveBeenCalledWith("error message");
    });

    it("should call console.debug in development", () => {
      const spy = vi.spyOn(console, "debug");
      ClientLogger.debug("debug message");
      expect(spy).toHaveBeenCalledWith("debug message");
    });

    it("should call console.info in development", () => {
      const spy = vi.spyOn(console, "info");
      ClientLogger.info("info message");
      expect(spy).toHaveBeenCalledWith("info message");
    });

    it("should call console.warn in development", () => {
      const spy = vi.spyOn(console, "warn");
      ClientLogger.warn("warning message");
      expect(spy).toHaveBeenCalledWith("warning message");
    });

    it("should call console.assert in development", () => {
      const spy = vi.spyOn(console, "assert");
      ClientLogger.assert(true, "assertion");
      expect(spy).toHaveBeenCalledWith(true, "assertion");
    });

    it("should call console.trace in development", () => {
      const spy = vi.spyOn(console, "trace");
      ClientLogger.trace("trace message");
      expect(spy).toHaveBeenCalledWith("trace message");
    });

    it("should call console.count in development", () => {
      const spy = vi.spyOn(console, "count");
      ClientLogger.count("counter");
      expect(spy).toHaveBeenCalledWith("counter");
    });

    it("should call console.countReset in development", () => {
      const spy = vi.spyOn(console, "countReset");
      ClientLogger.countReset("counter");
      expect(spy).toHaveBeenCalledWith("counter");
    });

    it("should call console.time in development", () => {
      const spy = vi.spyOn(console, "time");
      ClientLogger.time("timer");
      expect(spy).toHaveBeenCalledWith("timer");
    });

    it("should call console.timeLog in development", () => {
      const spy = vi.spyOn(console, "timeLog");
      ClientLogger.timeLog("timer");
      expect(spy).toHaveBeenCalledWith("timer");
    });

    it("should call console.timeEnd in development", () => {
      const spy = vi.spyOn(console, "timeEnd");
      ClientLogger.timeEnd("timer");
      expect(spy).toHaveBeenCalledWith("timer");
    });

    it("should call console.group in development", () => {
      const spy = vi.spyOn(console, "group");
      ClientLogger.group("group");
      expect(spy).toHaveBeenCalledWith("group");
    });

    it("should call console.groupCollapsed in development", () => {
      const spy = vi.spyOn(console, "groupCollapsed");
      ClientLogger.groupCollapsed("collapsed");
      expect(spy).toHaveBeenCalledWith("collapsed");
    });

    it("should call console.dir in development", () => {
      const spy = vi.spyOn(console, "dir");
      const obj = { test: "object" };
      ClientLogger.dir(obj);
      expect(spy).toHaveBeenCalledWith(obj);
    });

    it("should call console.clear in development", () => {
      const spy = vi.spyOn(console, "clear");
      ClientLogger.clear();
      expect(spy).toHaveBeenCalled();
    });

    it("should handle multiple arguments", () => {
      const spy = vi.spyOn(console, "log");
      ClientLogger.log("message", 123, { key: "value" }, true);
      expect(spy).toHaveBeenCalledWith("message", 123, { key: "value" }, true);
    });
  });

  describe("in production mode", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
    });

    it("should NOT call console.log in production", () => {
      const spy = vi.spyOn(console, "log");
      ClientLogger.log("test message");
      expect(spy).not.toHaveBeenCalled();
    });

    it("should NOT call console.error in production", () => {
      const spy = vi.spyOn(console, "error");
      ClientLogger.error("error message");
      expect(spy).not.toHaveBeenCalled();
    });

    it("should NOT call console.debug in production", () => {
      const spy = vi.spyOn(console, "debug");
      ClientLogger.debug("debug message");
      expect(spy).not.toHaveBeenCalled();
    });

    it("should NOT call console.info in production", () => {
      const spy = vi.spyOn(console, "info");
      ClientLogger.info("info message");
      expect(spy).not.toHaveBeenCalled();
    });

    it("should NOT call console.warn in production", () => {
      const spy = vi.spyOn(console, "warn");
      ClientLogger.warn("warning message");
      expect(spy).not.toHaveBeenCalled();
    });

    it("should NOT call console.trace in production", () => {
      const spy = vi.spyOn(console, "trace");
      ClientLogger.trace("trace");
      expect(spy).not.toHaveBeenCalled();
    });

    it("should NOT call console.clear in production", () => {
      const spy = vi.spyOn(console, "clear");
      ClientLogger.clear();
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe("edge cases", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "development";
    });

    it("should handle no arguments", () => {
      const spy = vi.spyOn(console, "log");
      ClientLogger.log();
      expect(spy).toHaveBeenCalledWith();
    });

    it("should handle undefined label in time", () => {
      const spy = vi.spyOn(console, "time");
      ClientLogger.time(undefined);
      expect(spy).toHaveBeenCalledWith(undefined);
    });

    it("should handle undefined label in timeEnd", () => {
      const spy = vi.spyOn(console, "timeEnd");
      ClientLogger.timeEnd(undefined);
      expect(spy).toHaveBeenCalledWith(undefined);
    });

    it("should handle complex objects", () => {
      const spy = vi.spyOn(console, "log");
      const complexObj = {
        nested: {
          deep: {
            value: 123,
          },
        },
        array: [1, 2, 3],
      };
      ClientLogger.log(complexObj);
      expect(spy).toHaveBeenCalledWith(complexObj);
    });

    it("should handle errors", () => {
      const spy = vi.spyOn(console, "error");
      const error = new Error("Test error");
      ClientLogger.error(error);
      expect(spy).toHaveBeenCalledWith(error);
    });
  });

  // Restore original environment after all tests
  afterAll(() => {
    process.env.NODE_ENV = originalEnv;
  });
});
