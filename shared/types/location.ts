export type UseDetectedLocationOptions = {
  simulateError?: boolean;
  timeoutMs?: number;
  alwaysRequestOnMount?: boolean;
  resolveName?: boolean;
};

export type DetectedCoords = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  timestamp?: number;
};