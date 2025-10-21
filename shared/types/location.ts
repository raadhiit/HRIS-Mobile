export type UseDetectedLocationOptions = {
  simulateError?: boolean;
  timeoutMs?: number;
  alwaysRequestOnMount?: boolean;
  resolveName?: boolean;
  antiMock?: boolean;
};

export type DetectedCoords = {
  latitude: number;
  longitude: number;
  accuracy?: number | null;
  timestamp?: number;
  speed?: number | null;
  mocked?: boolean | null;
  ageMs?: number | null;
};