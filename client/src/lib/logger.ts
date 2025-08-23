const isInDebugMode = (): boolean => {
  return process.env.NODE_ENV === "development";
};

const ClientLogger = {
  log: (...params: Parameters<typeof console.log>): void => {
    if (isInDebugMode()) console.log(...params);
  },
  error: (...params: Parameters<typeof console.error>): void => {
    if (isInDebugMode()) console.error(...params);
  },
  debug: (...params: Parameters<typeof console.debug>): void => {
    if (isInDebugMode()) console.debug(...params);
  },
  info: (...params: Parameters<typeof console.info>): void => {
    if (isInDebugMode()) console.info(...params);
  },
  warn: (...params: Parameters<typeof console.warn>): void => {
    if (isInDebugMode()) console.warn(...params);
  },
  assert: (...params: Parameters<typeof console.assert>): void => {
    if (isInDebugMode()) console.assert(...params);
  },
  trace: (...params: Parameters<typeof console.trace>): void => {
    if (isInDebugMode()) console.trace(...params);
  },
  count: (...params: Parameters<typeof console.count>): void => {
    if (isInDebugMode()) console.count(...params);
  },
  countReset: (...params: Parameters<typeof console.countReset>): void => {
    if (isInDebugMode()) console.countReset(...params);
  },
  time: (label?: string): void => {
    if (isInDebugMode()) console.time(label);
  },
  timeLog: (...params: Parameters<typeof console.timeLog>): void => {
    if (isInDebugMode()) console.timeLog(...params);
  },
  timeStamp: (...params: Parameters<typeof console.timeStamp>): void => {
    if (isInDebugMode()) console.timeStamp(...params);
  },
  timeEnd: (label?: string): void => {
    if (isInDebugMode()) console.timeEnd(label);
  },
  group: (...params: Parameters<typeof console.group>): void => {
    if (isInDebugMode()) console.group(...params);
  },
  groupCollapsed: (
    ...params: Parameters<typeof console.groupCollapsed>
  ): void => {
    if (isInDebugMode()) console.groupCollapsed(...params);
  },
  profile: (...params: Parameters<typeof console.profile>): void => {
    if (isInDebugMode()) console.profile(...params);
  },
  profileEnd: (...params: Parameters<typeof console.profileEnd>): void => {
    if (isInDebugMode()) console.profileEnd(...params);
  },
  dir: (...params: Parameters<typeof console.dir>): void => {
    if (isInDebugMode()) console.dir(...params);
  },
  clear: (): void => {
    if (isInDebugMode()) console.clear();
  },
};

export default ClientLogger;
