import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const courseRoot = path.resolve(import.meta.dirname, "..");

const requiredFiles = [
  "README.md",
  "package.json",
  "pnpm-workspace.yaml",
  "Cargo.toml",
  "specs/course-capabilities.yaml",
  "sdks/README.md",
  "sdks/sdkwork-course-app-sdk/.sdkwork-assembly.json",
  "sdks/sdkwork-course-app-sdk/README.md",
  "sdks/sdkwork-course-app-sdk/bin/generate-sdk.ps1",
  "sdks/sdkwork-course-app-sdk/openapi/sdkwork-course-app-api.openapi.yaml",
  "sdks/sdkwork-course-app-sdk/openapi/sdkwork-course-app-api.sdkgen.yaml",
  "sdks/sdkwork-course-app-sdk/specs/README.md",
  "sdks/sdkwork-course-app-sdk/specs/component.spec.json",
  "sdks/sdkwork-course-backend-sdk/.sdkwork-assembly.json",
  "sdks/sdkwork-course-backend-sdk/README.md",
  "sdks/sdkwork-course-backend-sdk/bin/generate-sdk.ps1",
  "sdks/sdkwork-course-backend-sdk/openapi/sdkwork-course-backend-api.openapi.yaml",
  "sdks/sdkwork-course-backend-sdk/openapi/sdkwork-course-backend-api.sdkgen.yaml",
  "sdks/sdkwork-course-backend-sdk/specs/README.md",
  "sdks/sdkwork-course-backend-sdk/specs/component.spec.json",
  "packages/common/course/sdkwork-course-contracts/src/index.ts",
  "packages/native-rust/course/sdkwork-course-rust/Cargo.toml",
  "packages/native-rust/course/sdkwork-course-rust/migrations/0001_course_foundation.sql",
  "packages/native-rust/course/sdkwork-course-rust/src/lib.rs",
  "packages/native-rust/course/sdkwork-course-rust/src/storage.rs",
  "packages/native-rust/course/sdkwork-course-rust/src/router.rs",
];

const forbiddenOwnershipPatterns = [
  /\bcommerce[_-]/iu,
  /\bproduct[_-]/iu,
  /\border[_-]/iu,
  /\bpayment[_-]/iu,
  /\bwallet[_-]/iu,
  /\bcheckout[_-]/iu,
  /\bsubscription[_-]/iu,
  /\bmembership[_-]/iu,
  /\binvoice[_-]/iu,
  /\brefund[_-]/iu,
  /@sdkwork\/(?:commerce|product|order|payment|wallet|checkout|subscription|membership|invoice|refund)/iu,
  /\/(?:app|backend)\/v3\/api\/(?:catalog|products|orders|payments|wallet|checkout|subscriptions|memberships|invoices|refunds)\b/iu,
];

const forbiddenScanAllowlist = new Set([
  "README.md",
  "scripts/course-workspace-boundary.test.mjs",
]);

const requiredAppOperations = [
  "courseCategories.list",
  "courses.list",
  "courses.retrieve",
  "courseSections.list",
  "courseLessons.list",
  "courseRelations.list",
  "courseApplications.create",
];

const requiredBackendOperations = [
  "courses.list",
  "courses.create",
  "courses.update",
  "courses.delete",
  "courseSections.list",
  "courseSections.create",
  "courseSections.update",
  "courseSections.delete",
  "courseLessons.list",
  "courseLessons.create",
  "courseLessons.update",
  "courseLessons.delete",
  "courseRelations.list",
  "courseRelations.replace",
  "courseApplications.list",
  "courseApplications.review",
  "courseComments.list",
  "courseComments.moderate",
  "courseEngagement.list",
];

const requiredCourseTables = [
  "course_category",
  "course_catalog",
  "course_section",
  "course_lesson",
  "course_relation",
  "course_application",
  "course_comment",
  "course_reaction",
  "course_audit_log",
];

const protectedSecurity = [{ AuthToken: [], AccessToken: [] }];
const appApiPrefix = "/app/v3/api";
const backendApiPrefix = "/backend/v3/api";

const sdkFamilies = [
  {
    root: "sdks/sdkwork-course-app-sdk",
    workspace: "sdkwork-course-app-sdk",
    title: "SDKWork Course App API SDK",
    sdkType: "app",
    apiAuthority: "sdkwork-course-app-api",
    apiPrefix: "/app/v3/api",
    authoritySpec: "openapi/sdkwork-course-app-api.openapi.yaml",
    generationInputSpec: "openapi/sdkwork-course-app-api.sdkgen.yaml",
    packageName: "@sdkwork/course-app-sdk",
    languages: ["typescript"],
  },
  {
    root: "sdks/sdkwork-course-backend-sdk",
    workspace: "sdkwork-course-backend-sdk",
    title: "SDKWork Course Backend API SDK",
    sdkType: "backend",
    apiAuthority: "sdkwork-course-backend-api",
    apiPrefix: "/backend/v3/api",
    authoritySpec: "openapi/sdkwork-course-backend-api.openapi.yaml",
    generationInputSpec: "openapi/sdkwork-course-backend-api.sdkgen.yaml",
    packageName: "@sdkwork/course-backend-sdk",
    languages: ["typescript"],
  },
];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(courseRoot, relativePath), "utf8"));
}

function collectTextFiles(directory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (
      entry.name === ".git" ||
      entry.name === "node_modules" ||
      entry.name === "target" ||
      entry.name === "generated"
    ) {
      return [];
    }

    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? collectTextFiles(fullPath) : [fullPath];
  });
}

function collectOperationIds(document) {
  const operationIds = [];
  for (const pathItem of Object.values(document.paths ?? {})) {
    for (const [method, operation] of Object.entries(pathItem ?? {})) {
      if (!["get", "post", "patch", "put", "delete"].includes(method)) {
        continue;
      }

      operationIds.push(operation.operationId);
    }
  }

  return operationIds.sort();
}

function collectOperations(document) {
  const operations = [];
  for (const [routePath, pathItem] of Object.entries(document.paths ?? {})) {
    for (const [method, operation] of Object.entries(pathItem ?? {})) {
      if (!["get", "post", "patch", "put", "delete"].includes(method)) {
        continue;
      }

      operations.push({ routePath, method, operation });
    }
  }

  return operations;
}

function collectOpenApiOperationContracts(document) {
  return collectOperations(document)
    .map(({ routePath, method, operation }) => ({
      method: method.toUpperCase(),
      operationId: operation.operationId,
      path: routePath,
      tag: operation.tags?.[0],
    }))
    .sort((left, right) => operationKey(left).localeCompare(operationKey(right)));
}

function collectContractOperationContracts(source, surface) {
  return [...source.matchAll(/operation\(\s*"(app|backend)"\s*,\s*"([A-Z]+)"\s*,\s*`([^`]+)`\s*,\s*"([^"]+)"\s*,\s*"([^"]+)"\s*\)/gu)]
    .filter((match) => match[1] === surface)
    .map((match) => ({
      method: match[2],
      path: match[3].replaceAll("${app}", appApiPrefix).replaceAll("${backend}", backendApiPrefix),
      operationId: match[4],
      tag: match[5],
    }))
    .sort((left, right) => operationKey(left).localeCompare(operationKey(right)));
}

function operationKey(operation) {
  return `${operation.method} ${operation.path} ${operation.operationId} ${operation.tag}`;
}

function routeKey(operation) {
  return `${operation.method} ${operation.path}`;
}

function collectRustRouterRouteKeys(source) {
  return extractRouteCalls(source)
    .flatMap((call) => {
      const [routePathExpression, handlerExpression] = splitTopLevelComma(call);
      const routePath = routePathExpression.match(/^"([^"]+)"$/u)?.[1];
      assert.ok(routePath, `router route path must be a string literal: ${routePathExpression}`);

      return [...handlerExpression.matchAll(/\b(get|post|patch|put|delete)\s*\(/gu)].map(
        (match) => `${match[1].toUpperCase()} ${routePath}`,
      );
    })
    .sort();
}

function extractRouteCalls(source) {
  const calls = [];
  let cursor = 0;
  while ((cursor = source.indexOf(".route(", cursor)) !== -1) {
    const start = cursor + ".route(".length;
    let depth = 1;
    let quote = null;
    let escape = false;
    let end = start;

    for (; end < source.length; end += 1) {
      const char = source[end];
      if (quote) {
        if (escape) {
          escape = false;
        } else if (char === "\\") {
          escape = true;
        } else if (char === quote) {
          quote = null;
        }
        continue;
      }

      if (char === '"' || char === "'" || char === "`") {
        quote = char;
      } else if (char === "(") {
        depth += 1;
      } else if (char === ")") {
        depth -= 1;
        if (depth === 0) {
          break;
        }
      }
    }

    calls.push(source.slice(start, end));
    cursor = end + 1;
  }

  return calls;
}

function splitTopLevelComma(source) {
  let depth = 0;
  let quote = null;
  let escape = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escape) {
        escape = false;
      } else if (char === "\\") {
        escape = true;
      } else if (char === quote) {
        quote = null;
      }
      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
    } else if (char === "(" || char === "[" || char === "{") {
      depth += 1;
    } else if (char === ")" || char === "]" || char === "}") {
      depth -= 1;
    } else if (char === "," && depth === 0) {
      return [source.slice(0, index).trim(), source.slice(index + 1).trim()];
    }
  }

  return [source.trim(), ""];
}

function assertSdkworkV3PathAndSecurity(document, apiPrefix) {
  const violations = collectOperations(document).flatMap(({ routePath, method, operation }) => {
    const operationViolations = [];
    if (!routePath.startsWith(apiPrefix)) {
      operationViolations.push(`${method.toUpperCase()} ${routePath}: invalid prefix`);
    }

    for (const segment of routePath.split("/").filter(Boolean)) {
      if (segment.startsWith("{") && segment.endsWith("}")) {
        if (!/^\{[a-z][A-Za-z0-9]*\}$/u.test(segment)) {
          operationViolations.push(`${method.toUpperCase()} ${routePath}: path parameter ${segment} is not lowerCamelCase`);
        }
        continue;
      }

      if (!/^[a-z0-9]+(?:_[a-z0-9]+)*$/u.test(segment)) {
        operationViolations.push(`${method.toUpperCase()} ${routePath}: static segment ${segment} is not lower_snake_case`);
      }
    }

    assert.equal(operation["x-sdkwork-owner"], "sdkwork-course");
    assert.equal(operation["x-sdkwork-domain"], "course");
    assert.deepEqual(
      operation.security,
      protectedSecurity,
      `${method.toUpperCase()} ${routePath} must declare operation-level dual token security`,
    );

    return operationViolations;
  });

  assert.deepEqual(violations, []);
}

test("course workspace owns the expected source, API, SDK, and Rust storage files", () => {
  const missingFiles = requiredFiles.filter((relativePath) => !fs.existsSync(path.join(courseRoot, relativePath)));
  assert.deepEqual(missingFiles, []);
});

test("course app and backend OpenAPI documents expose the complete course API surface", () => {
  const appApi = readJson("sdks/sdkwork-course-app-sdk/openapi/sdkwork-course-app-api.openapi.yaml");
  const backendApi = readJson("sdks/sdkwork-course-backend-sdk/openapi/sdkwork-course-backend-api.openapi.yaml");

  assert.equal(appApi.info["x-sdkwork-api-authority"], "sdkwork-course-app-api");
  assert.equal(appApi.info["x-sdkwork-sdk-family"], "sdkwork-course-app-sdk");
  assert.equal(backendApi.info["x-sdkwork-api-authority"], "sdkwork-course-backend-api");
  assert.equal(backendApi.info["x-sdkwork-sdk-family"], "sdkwork-course-backend-sdk");

  assert.deepEqual(
    requiredAppOperations.filter((operationId) => !collectOperationIds(appApi).includes(operationId)),
    [],
  );
  assert.deepEqual(
    requiredBackendOperations.filter((operationId) => !collectOperationIds(backendApi).includes(operationId)),
    [],
  );
});

test("course OpenAPI documents use SDKWork v3 path and security standards", () => {
  const appApi = readJson("sdks/sdkwork-course-app-sdk/openapi/sdkwork-course-app-api.openapi.yaml");
  const appSdkgen = readJson("sdks/sdkwork-course-app-sdk/openapi/sdkwork-course-app-api.sdkgen.yaml");
  const backendApi = readJson("sdks/sdkwork-course-backend-sdk/openapi/sdkwork-course-backend-api.openapi.yaml");
  const backendSdkgen = readJson("sdks/sdkwork-course-backend-sdk/openapi/sdkwork-course-backend-api.sdkgen.yaml");

  assertSdkworkV3PathAndSecurity(appApi, "/app/v3/api");
  assertSdkworkV3PathAndSecurity(appSdkgen, "/app/v3/api");
  assertSdkworkV3PathAndSecurity(backendApi, "/backend/v3/api");
  assertSdkworkV3PathAndSecurity(backendSdkgen, "/backend/v3/api");
});

test("course contracts and Rust router stay aligned with OpenAPI operations", () => {
  const appApi = readJson("sdks/sdkwork-course-app-sdk/openapi/sdkwork-course-app-api.openapi.yaml");
  const backendApi = readJson("sdks/sdkwork-course-backend-sdk/openapi/sdkwork-course-backend-api.openapi.yaml");
  const contracts = fs.readFileSync(
    path.join(courseRoot, "packages/common/course/sdkwork-course-contracts/src/index.ts"),
    "utf8",
  );
  const router = fs.readFileSync(
    path.join(courseRoot, "packages/native-rust/course/sdkwork-course-rust/src/router.rs"),
    "utf8",
  );

  const appOpenApiOperations = collectOpenApiOperationContracts(appApi);
  const backendOpenApiOperations = collectOpenApiOperationContracts(backendApi);
  const openApiRouteKeys = [...appOpenApiOperations, ...backendOpenApiOperations].map(routeKey).sort();

  assert.deepEqual(collectContractOperationContracts(contracts, "app").map(operationKey), appOpenApiOperations.map(operationKey));
  assert.deepEqual(
    collectContractOperationContracts(contracts, "backend").map(operationKey),
    backendOpenApiOperations.map(operationKey),
  );
  assert.deepEqual(collectRustRouterRouteKeys(router), openApiRouteKeys);
});

test("course SDK families declare discoverable ownership metadata outside generated output", () => {
  for (const family of sdkFamilies) {
    const assembly = readJson(`${family.root}/.sdkwork-assembly.json`);
    const componentSpec = readJson(`${family.root}/specs/component.spec.json`);
    const familyReadme = fs.readFileSync(path.join(courseRoot, family.root, "README.md"), "utf8");
    const specsReadme = fs.readFileSync(path.join(courseRoot, family.root, "specs/README.md"), "utf8");

    assert.equal(assembly.workspace, family.workspace);
    assert.equal(assembly.title, family.title);
    assert.equal(assembly.sdkOwner, "sdkwork-course");
    assert.equal(assembly.apiAuthority, family.apiAuthority);
    assert.equal(assembly.authoritySpec, family.authoritySpec);
    assert.equal(assembly.generationInputSpec, family.generationInputSpec);
    assert.equal(assembly.discoverySurface.sdkTarget, family.sdkType);
    assert.equal(assembly.discoverySurface.apiPrefix, family.apiPrefix);
    assert.deepEqual(assembly.sdkDependencies, []);
    assert.deepEqual(assembly.metadata?.standardProfile, "sdkwork-v3");
    assert.equal(assembly.generator?.package, "@sdkwork/sdk-generator");
    assert.equal(
      assembly.generator?.entrypoint,
      "D:\\javasource\\spring-ai-plus\\sdk\\sdkwork-sdk-generator\\bin\\sdkgen.js",
    );

    assert.equal(componentSpec.schemaVersion, 1);
    assert.equal(componentSpec.kind, "sdkwork.component.spec");
    assert.equal(componentSpec.component.name, family.workspace);
    assert.equal(componentSpec.component.type, "sdk-family");
    assert.equal(componentSpec.component.root, family.root);
    assert.equal(componentSpec.component.domain, "course");
    assert.equal(componentSpec.component.capability, "course");
    assert.deepEqual(componentSpec.component.languages, family.languages);
    assert.equal(componentSpec.component.generated, true);
    assert.equal(componentSpec.contracts.apiAuthority, family.apiAuthority);
    assert.equal(componentSpec.contracts.apiPrefix, family.apiPrefix);
    assert.deepEqual(componentSpec.contracts.sdkDependencies, assembly.sdkDependencies);
    assert.ok(componentSpec.verification.commands.length > 0);

    for (const requiredText of [
      family.workspace,
      family.apiAuthority,
      family.apiPrefix,
      family.packageName,
      "@sdkwork/sdk-generator",
      "D:\\javasource\\spring-ai-plus\\sdk\\sdkwork-sdk-generator\\bin\\sdkgen.js",
      "--standard-profile sdkwork-v3",
    ]) {
      assert.ok(familyReadme.includes(requiredText), `${family.root}/README.md must include ${requiredText}`);
    }
    assert.ok(specsReadme.includes(family.workspace));
    assert.ok(specsReadme.includes(family.apiAuthority));
  }
});

test("course SDK language declarations match generated transport workspaces", () => {
  for (const family of sdkFamilies) {
    const assembly = readJson(`${family.root}/.sdkwork-assembly.json`);
    const declaredLanguages = assembly.languages.map((language) => language.language).sort();
    assert.deepEqual(declaredLanguages, family.languages);

    for (const language of assembly.languages) {
      const generatedPath = path.join(courseRoot, family.root, language.generatedPath);
      assert.ok(fs.existsSync(generatedPath), `${family.workspace} ${language.language} generated output is missing`);
      assert.ok(
        fs.existsSync(path.join(generatedPath, "sdkwork-sdk.json")),
        `${family.workspace} ${language.language} generated sdkwork-sdk.json is missing`,
      );
      assert.ok(
        fs.existsSync(path.join(generatedPath, ".sdkwork", "sdkwork-generator-manifest.json")),
        `${family.workspace} ${language.language} generator manifest is missing`,
      );
      assert.ok(
        fs.existsSync(path.join(generatedPath, ".sdkwork", "sdkwork-generator-changes.json")),
        `${family.workspace} ${language.language} generator changes report is missing`,
      );
      assert.ok(
        fs.existsSync(path.join(generatedPath, ".sdkwork", "sdkwork-generator-report.json")),
        `${family.workspace} ${language.language} generator report is missing`,
      );
      assert.ok(
        fs.existsSync(path.join(generatedPath, "custom")),
        `${family.workspace} ${language.language} custom root is missing`,
      );
    }
  }
});

test("course SQL migration owns course tables without legacy commerce table ownership", () => {
  const migration = fs.readFileSync(
    path.join(courseRoot, "packages/native-rust/course/sdkwork-course-rust/migrations/0001_course_foundation.sql"),
    "utf8",
  );

  const missingTables = requiredCourseTables.filter((tableName) => !migration.includes(`CREATE TABLE IF NOT EXISTS ${tableName}`));
  assert.deepEqual(missingTables, []);

  assert.doesNotMatch(migration, /\b(?:commerce|product|order|payment|wallet|checkout|subscription|membership|invoice|refund)_/iu);
});

test("course Rust storage has no migrated Postgres placeholder wiring", () => {
  const storage = fs.readFileSync(
    path.join(courseRoot, "packages/native-rust/course/sdkwork-course-rust/src/storage.rs"),
    "utf8",
  );
  const postgresImpl = storage.slice(storage.indexOf("impl CourseStore for PostgresCourseStore"));

  assert.ok(postgresImpl.length > 0, "PostgresCourseStore must implement CourseStore");
  assert.doesNotMatch(postgresImpl, /postgres course writes require repository wiring/u);
  assert.doesNotMatch(postgresImpl, /let _ = &self\.pool;/u);
});

test("course Rust store trait is fully implemented for empty, SQLite, and Postgres stores", () => {
  const storage = fs.readFileSync(
    path.join(courseRoot, "packages/native-rust/course/sdkwork-course-rust/src/storage.rs"),
    "utf8",
  );
  const traitBlock = storage.match(/pub trait CourseStore \{([\s\S]*?)\n\}/u)?.[1] ?? "";
  const traitMethods = [...traitBlock.matchAll(/fn\s+([a-z_]+)/gu)].map((match) => match[1]).sort();

  assert.deepEqual(
    traitMethods,
    [
      "create_application",
      "create_course",
      "create_lesson",
      "create_section",
      "delete_course",
      "delete_lesson",
      "delete_section",
      "get_course",
      "list_applications",
      "list_categories",
      "list_comments",
      "list_courses",
      "list_engagement",
      "list_lessons",
      "list_relations",
      "list_sections",
      "moderate_comment",
      "replace_relations",
      "review_application",
      "update_course",
      "update_lesson",
      "update_section",
    ],
  );

  for (const implementation of ["EmptyCourseStore", "SqliteCourseStore", "PostgresCourseStore"]) {
    const start = storage.indexOf(`impl CourseStore for ${implementation}`);
    assert.notEqual(start, -1, `${implementation} must implement CourseStore`);
    const nextImplementation = ["EmptyCourseStore", "SqliteCourseStore", "PostgresCourseStore"]
      .map((candidate) => storage.indexOf(`impl CourseStore for ${candidate}`, start + 1))
      .filter((index) => index > start)
      .sort((left, right) => left - right)[0] ?? storage.length;
    const implementationBlock = storage.slice(start, nextImplementation);
    const implementationMethods = new Set([...implementationBlock.matchAll(/fn\s+([a-z_]+)/gu)].map((match) => match[1]));
    const missingMethods = traitMethods.filter((method) => !implementationMethods.has(method));

    assert.deepEqual(missingMethods, [], `${implementation} is missing CourseStore methods`);
  }
});

test("course source keeps course ownership separated from commerce and payment domains", () => {
  const violations = collectTextFiles(courseRoot).flatMap((fullPath) => {
    const relativePath = path.relative(courseRoot, fullPath).replaceAll("\\", "/");
    if (forbiddenScanAllowlist.has(relativePath)) {
      return [];
    }

    const content = fs.readFileSync(fullPath, "utf8");
    return forbiddenOwnershipPatterns.flatMap((pattern) => {
      const match = content.match(pattern);
      return match ? [`${relativePath}: ${match[0]}`] : [];
    });
  });

  assert.deepEqual(violations, []);
});
