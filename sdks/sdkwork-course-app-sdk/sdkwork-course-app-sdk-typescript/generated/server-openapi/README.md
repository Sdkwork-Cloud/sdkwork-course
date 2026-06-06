# sdkwork-course-app-sdk

Professional TypeScript SDK for SDKWork API.

## Installation

```bash
npm install @sdkwork/course-app-sdk
# or
yarn add @sdkwork/course-app-sdk
# or
pnpm add @sdkwork/course-app-sdk
```

## Quick Start

```typescript
import { SdkworkAppClient } from '@sdkwork/course-app-sdk';

const client = new SdkworkAppClient({
  baseUrl: 'http://localhost:8080',
  timeout: 30000,
});

// Mode A: API Key (recommended for server-to-server calls)
client.setApiKey('your-api-key');

// Use the SDK
const params = {
  status: 'status',
};
const result = await client.courseCategories.list(params);
```

## Authentication Modes (Mutually Exclusive)

Choose exactly one mode for the same client instance.

### Mode A: API Key

```typescript
const client = new SdkworkAppClient({ baseUrl: 'http://localhost:8080' });
client.setApiKey('your-api-key');
// Sends: Access-Token: <apiKey>
```

### Mode B: Dual Token

```typescript
const client = new SdkworkAppClient({ baseUrl: 'http://localhost:8080' });
client.setAuthToken('your-auth-token');
client.setAccessToken('your-access-token');
// Sends:
// Authorization: Bearer <authToken>
// Access-Token: <accessToken>
```

> Do not call `setApiKey(...)` together with `setAuthToken(...)` + `setAccessToken(...)` on the same client.

## Configuration (Non-Auth)

```typescript
import { SdkworkAppClient } from '@sdkwork/course-app-sdk';

const client = new SdkworkAppClient({
  baseUrl: 'http://localhost:8080',
  timeout: 30000, // Request timeout in ms
  headers: {      // Custom headers
    'X-Custom-Header': 'value',
  },
});
```

## API Modules

- `client.courseApplications` - course_applications API
- `client.courses` - courses API
- `client.courseCategories` - course_categories API
- `client.courseLessons` - course_lessons API
- `client.courseRelations` - course_relations API
- `client.courseSections` - course_sections API

## Usage Examples

### course_applications

```typescript
// Course Applications create.
const body = {
  title: 'title',
  category: 'category',
  description: 'description',
  sourceProvider: 'sourceProvider',
  externalBvid: 'externalBvid',
  contactName: 'contactName',
  contactEmail: 'contactEmail',
  metadata: {},
};
const result = await client.courseApplications.create(body);
```

### courses

```typescript
// Courses list.
const params = {
  page: 1,
  page_size: 2,
  q: 'q',
  category: 'category',
  level: 'level',
};
const result = await client.courses.list(params);
```

### course_categories

```typescript
// Course Categories list.
const params = {
  status: 'status',
};
const result = await client.courseCategories.list(params);
```

### course_lessons

```typescript
// Course Lessons list.
const courseId = '1';
const params = {
  status: 'status',
};
const result = await client.courseLessons.list(courseId, params);
```

### course_relations

```typescript
// Course Relations list.
const courseId = '1';
const result = await client.courseRelations.list(courseId);
```

### course_sections

```typescript
// Course Sections list.
const courseId = '1';
const params = {
  status: 'status',
};
const result = await client.courseSections.list(courseId, params);
```

## Error Handling

```typescript
import { SdkworkAppClient, NetworkError, TimeoutError, AuthenticationError } from '@sdkwork/course-app-sdk';

try {
  const params = {
    status: 'status',
  };
  const result = await client.courseCategories.list(params);
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.error('Authentication failed:', error.message);
  } else if (error instanceof TimeoutError) {
    console.error('Request timed out:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network error:', error.message);
  } else {
    throw error;
  }
}
```

## Publishing

This SDK includes cross-platform publish scripts in `bin/`:
- `bin/publish-core.mjs`
- `bin/publish.sh`
- `bin/publish.ps1`

### Check

```bash
./bin/publish.sh --action check
```

### Publish

```bash
./bin/publish.sh --action publish --channel release
```

```powershell
.\bin\publish.ps1 --action publish --channel test --dry-run
```

> Set `NPM_TOKEN` (and optional `NPM_REGISTRY_URL`) before release publish.

## License

MIT

## Regeneration Contract

- Generator-owned files are tracked in `.sdkwork/sdkwork-generator-manifest.json`.
- Each run also writes `.sdkwork/sdkwork-generator-changes.json` so automation can inspect created, updated, deleted, unchanged, scaffolded, and backed-up files plus the classified impact areas, verification plan, and execution decision for the latest generation.
- Apply mode also writes `.sdkwork/sdkwork-generator-report.json` with the full execution report, including `schemaVersion`, `generator`, stable artifact paths, and the execution handoff commands that match CLI `--json` output.
- CLI JSON output also includes an execution handoff with concrete next commands, including reviewed apply commands for dry-run flows.
- Put hand-written wrappers, adapters, and orchestration in `custom/`.
- Files scaffolded under `custom/` are created once and preserved across regenerations.
- If a generated-owned file was modified locally, its previous content is copied to `.sdkwork/manual-backups/` before overwrite or removal.
