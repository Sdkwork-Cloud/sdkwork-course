export function asRecord(value: unknown): Record<string, unknown> {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  return value as Record<string, unknown>;
}

type ReadKeyArg = string | string[] | number;

function splitReadArgs(
  args: ReadKeyArg[],
): { keys: string[]; fallback?: string | number } {
  const last = args[args.length - 1];
  const penultimate = args[args.length - 2];
  if (
    args.length > 1
    && (typeof last === 'number' || typeof last === 'string')
    && Array.isArray(penultimate)
  ) {
    return {
      keys: args.slice(0, -1).flat().filter((key): key is string => typeof key === 'string'),
      fallback: last,
    };
  }
  return {
    keys: args.flat().filter((key): key is string => typeof key === 'string'),
    fallback: undefined,
  };
}

export function readString(
  record: Record<string, unknown>,
  ...args: ReadKeyArg[]
): string {
  const { keys, fallback } = splitReadArgs(args);
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }
  return typeof fallback === 'string' ? fallback : '';
}

export function readNumber(
  record: Record<string, unknown>,
  ...args: ReadKeyArg[]
): number {
  const { keys, fallback } = splitReadArgs(args);
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && value.trim().length > 0) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return typeof fallback === 'number' ? fallback : 0;
}

export function unwrapCourseBackendEnvelope<T = unknown>(value: unknown): T {
  const record = asRecord(value);
  if ('data' in record) {
    return record.data as T;
  }
  return value as T;
}

function extractRecords(payload: unknown): Record<string, unknown>[] {
  const unwrapped = unwrapCourseBackendEnvelope(payload);
  if (Array.isArray(unwrapped)) {
    return unwrapped.map((entry) => asRecord(entry)).filter((item) => Object.keys(item).length > 0);
  }

  const record = asRecord(unwrapped);
  if (Array.isArray(record.items)) {
    return record.items.map((entry) => asRecord(entry)).filter((item) => Object.keys(item).length > 0);
  }
  return [];
}

export function readRecords(value: unknown, collectionKeys: string[]): Record<string, unknown>[] {
  const standard = extractRecords(value);
  if (standard.length > 0) {
    return standard;
  }

  const record = asRecord(unwrapCourseBackendEnvelope(value));
  for (const key of collectionKeys) {
    const nested = record[key];
    if (Array.isArray(nested)) {
      return nested
        .map((entry) => asRecord(entry))
        .filter((item) => Object.keys(item).length > 0);
    }
  }
  return [];
}

export function readSingleRecord(value: unknown): Record<string, unknown> {
  const unwrapped = unwrapCourseBackendEnvelope(value);
  if (Array.isArray(unwrapped)) {
    return asRecord(unwrapped[0]);
  }
  return asRecord(unwrapped);
}
