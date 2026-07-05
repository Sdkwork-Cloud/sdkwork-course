import { isBlank } from '@sdkwork/utils/string';

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

export function extractSdkListItems<T extends Record<string, unknown> = Record<string, unknown>>(
  payload: unknown,
): T[] {
  const record = asRecord(payload);
  if (!record) {
    return [];
  }
  if (Array.isArray(record.items)) {
    return record.items as T[];
  }
  if (Array.isArray(payload)) {
    return payload as T[];
  }
  return [];
}

export function extractSdkItem<T extends Record<string, unknown> = Record<string, unknown>>(
  payload: unknown,
): T | null {
  const record = asRecord(payload);
  if (!record) {
    return null;
  }
  const item = asRecord(record.item);
  if (item) {
    return item as T;
  }
  if (Array.isArray(record.items)) {
    return null;
  }
  return record as T;
}

export function readEntityString(
  record: Record<string, unknown>,
  ...keys: string[]
): string {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && !isBlank(value)) {
      return value.trim();
    }
  }
  return '';
}

export function readEntityNumber(
  record: Record<string, unknown>,
  ...keys: string[]
): number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value;
    }
    if (typeof value === 'string' && !isBlank(value)) {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) {
        return parsed;
      }
    }
  }
  return undefined;
}
