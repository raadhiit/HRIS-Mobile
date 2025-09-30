export type UseDetectedLocationOptions = {
  simulateError?: boolean;
  timeoutMs?: number;
  alwaysRequestOnMount?: boolean; // default: false (hemat request)
  resolveName?: boolean;          // default: false (jangan reverse geocode)
};

export type DetectedCoords = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  timestamp?: number;
};