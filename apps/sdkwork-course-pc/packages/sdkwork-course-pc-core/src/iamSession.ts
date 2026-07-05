import { isBlank } from '@sdkwork/utils/string';

import {
  getCourseGlobalTokenManager,
  resetCourseGlobalTokenManager,
  saveCourseSession,
  type CourseSession,
  type CourseSessionUser,
} from './session';
import { resetCourseAppSdkClient } from './courseAppSdkClient';
import { resetIamAppSdkClient } from './iamAppSdkClient';
import { resetDriveAppSdkClient } from './driveAppSdkClient';

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value == null || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
}

function emailFallback(userRecord: Record<string, unknown>): string {
  const email = typeof userRecord.email === 'string' ? userRecord.email : '';
  return email || 'learner';
}

export interface IamSessionTokens {
  authToken?: string;
  accessToken?: string;
  user?: CourseSessionUser;
}

export function readIamSessionTokens(payload: unknown): IamSessionTokens {
  const record = asRecord(payload) ?? {};
  const item = asRecord(record.item) ?? record;
  const authToken = typeof item.authToken === 'string' ? item.authToken : undefined;
  const accessToken = typeof item.accessToken === 'string' ? item.accessToken : undefined;
  const userRecord = asRecord(item.user) ?? asRecord(item.profile);
  const user = userRecord
    ? {
        id: String(userRecord.id ?? userRecord.userId ?? emailFallback(userRecord)),
        name: String(userRecord.displayName ?? userRecord.name ?? userRecord.nickname ?? 'Learner'),
        email: String(userRecord.email ?? ''),
      }
    : undefined;
  return { authToken, accessToken, user };
}

export function persistIamSession(
  tokens: IamSessionTokens,
  fallbackEmail: string,
): CourseSession {
  const session: CourseSession = {
    accessToken: tokens.accessToken,
    authToken: tokens.authToken,
    user:
      tokens.user ??
      ({
        id: fallbackEmail,
        name: fallbackEmail.split('@')[0] || 'Learner',
        email: fallbackEmail,
      } satisfies CourseSessionUser),
  };

  saveCourseSession(session);
  resetCourseGlobalTokenManager();
  resetCourseAppSdkClient();
  resetIamAppSdkClient();
  resetDriveAppSdkClient();
  getCourseGlobalTokenManager();

  return session;
}

export function assertIamSessionTokens(tokens: IamSessionTokens): void {
  if (isBlank(tokens.accessToken) && isBlank(tokens.authToken)) {
    throw new Error('IAM session did not return tokens');
  }
}
