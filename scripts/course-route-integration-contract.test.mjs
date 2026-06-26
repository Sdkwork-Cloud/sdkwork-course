#!/usr/bin/env node

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const courseRoot = path.resolve(import.meta.dirname, '..');

const schemaContract = JSON.parse(
  fs.readFileSync(path.join(courseRoot, 'specs/openapi/course-operation-schemas.contract.json'), 'utf8'),
);
const backendOpenApi = JSON.parse(
  fs.readFileSync(
    path.join(courseRoot, 'sdks/sdkwork-course-backend-sdk/openapi/sdkwork-course-backend-api.openapi.yaml'),
    'utf8',
  ),
);
const backendManifest = JSON.parse(
  fs.readFileSync(
    path.join(courseRoot, 'sdks/_route-manifests/backend-api/sdkwork-routes-course-backend-api.route-manifest.json'),
    'utf8',
  ),
);
const backendSdkCourses = fs.readFileSync(
  path.join(
    courseRoot,
    'sdks/sdkwork-course-backend-sdk/sdkwork-course-backend-sdk-typescript/generated/server-openapi/src/api/courses.ts',
  ),
  'utf8',
);
const gatewayAssembly = fs.readFileSync(
  path.join(courseRoot, 'crates/sdkwork-course-gateway-assembly/src/lib.rs'),
  'utf8',
);

assert.ok(schemaContract.schemas?.CourseCatalogCreateRequest, 'schema contract must define CourseCatalogCreateRequest');
assert.ok(schemaContract.operations?.['courses.create']?.request, 'schema contract must map courses.create request DTO');

const backendSchemas = backendOpenApi.components?.schemas ?? {};
assert.ok(backendSchemas.CourseCatalogCreateRequest, 'backend OpenAPI must materialize CourseCatalogCreateRequest');
assert.ok(backendSchemas.CourseSectionMutationRequest, 'backend OpenAPI must materialize CourseSectionMutationRequest');

const typedCreateRoute = backendManifest.routes.find((route) => route.operationId === 'courses.create');
assert.equal(
  typedCreateRoute?.schemas?.request,
  'CourseCatalogCreateRequest',
  'backend route manifest must bind courses.create to typed request schema',
);

assert.match(
  backendSdkCourses,
  /create\(body: CourseCatalogCreateRequest\): Promise<CourseItem>/u,
  'regenerated backend SDK must expose typed course create API',
);

assert.equal(backendManifest.routes.length, 67, 'backend route manifest must expose 67 operations');

const backendOperationCount = Object.values(backendOpenApi.paths ?? {}).reduce(
  (count, pathItem) => count + Object.keys(pathItem).length,
  0,
);
assert.equal(backendOperationCount, 67, 'backend OpenAPI must expose 67 HTTP operations');

assert.match(
  gatewayAssembly,
  /SDKWORK_COURSE_EMBEDDED_STRICT/u,
  'gateway assembly must support embedded strict bootstrap mode',
);

console.log('sdkwork course route integration contract passed.');
