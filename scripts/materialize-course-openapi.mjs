import fs from "node:fs";
import path from "node:path";

const courseRoot = path.resolve(import.meta.dirname, "..");

const surfaces = [
  {
    operationsPath: "apis/app-api/course/operations.json",
    routeManifestPath:
      "sdks/_route-manifests/app-api/sdkwork-router-course-app-api.route-manifest.json",
    authorityPath: "sdks/sdkwork-course-app-sdk/openapi/sdkwork-course-app-api.openapi.yaml",
    sdkgenPath: "sdks/sdkwork-course-app-sdk/openapi/sdkwork-course-app-api.sdkgen.yaml",
    assemblyPath: "sdks/sdkwork-course-app-sdk/.sdkwork-assembly.json",
    routeCrate: "sdkwork-router-course-app-api",
    routeCrateRoot: "crates/sdkwork-router-course-app-api",
    title: "SDKWork Course App API",
  },
  {
    operationsPath: "apis/backend-api/course/operations.json",
    routeManifestPath:
      "sdks/_route-manifests/backend-api/sdkwork-router-course-backend-api.route-manifest.json",
    authorityPath:
      "sdks/sdkwork-course-backend-sdk/openapi/sdkwork-course-backend-api.openapi.yaml",
    sdkgenPath:
      "sdks/sdkwork-course-backend-sdk/openapi/sdkwork-course-backend-api.sdkgen.yaml",
    assemblyPath: "sdks/sdkwork-course-backend-sdk/.sdkwork-assembly.json",
    routeCrate: "sdkwork-router-course-backend-api",
    routeCrateRoot: "crates/sdkwork-router-course-backend-api",
    title: "SDKWork Course Backend API",
  },
];

for (const surface of surfaces) {
  const operationPlan = readJson(surface.operationsPath);
  validateOperationPlan(operationPlan, surface);

  const routeManifest = buildRouteManifest(operationPlan, surface);
  const openApi = buildOpenApi(operationPlan, surface);

  writeJson(surface.routeManifestPath, routeManifest);
  writeJson(surface.authorityPath, openApi);
  writeJson(surface.sdkgenPath, openApi);
  syncAssemblyCount(surface.assemblyPath, operationPlan.operations.length);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(courseRoot, relativePath), "utf8"));
}

function writeJson(relativePath, value) {
  const fullPath = path.join(courseRoot, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, `${JSON.stringify(value, null, 2)}\n`);
}

function validateOperationPlan(operationPlan, surface) {
  const requiredTopLevel = [
    "surface",
    "apiAuthority",
    "sdkFamily",
    "apiPrefix",
    "domain",
    "capability",
    "owner",
  ];

  for (const key of requiredTopLevel) {
    if (!operationPlan[key]) {
      throw new Error(`${surface.operationsPath} is missing ${key}`);
    }
  }

  if (operationPlan.domain !== "content") {
    throw new Error(`${surface.operationsPath} must use domain content`);
  }

  const seen = new Set();
  for (const operation of operationPlan.operations ?? []) {
    const key = `${operation.method} ${operation.path}`;
    if (seen.has(key)) {
      throw new Error(`${surface.operationsPath} contains duplicate route ${key}`);
    }
    seen.add(key);

    if (!operation.path.startsWith(operationPlan.apiPrefix)) {
      throw new Error(`${operation.operationId} must start with ${operationPlan.apiPrefix}`);
    }

    if (!operation.todo?.startsWith("TODO(course):")) {
      throw new Error(`${operation.operationId} must include precise TODO(course) guidance`);
    }
  }
}

function buildRouteManifest(operationPlan, surface) {
  return {
    schemaVersion: 1,
    kind: "sdkwork.route.manifest",
    packageName: surface.routeCrate,
    surface: operationPlan.surface,
    owner: operationPlan.owner,
    domain: operationPlan.domain,
    capability: operationPlan.capability,
    apiAuthority: operationPlan.apiAuthority,
    sdkFamily: operationPlan.sdkFamily,
    prefix: operationPlan.apiPrefix,
    source: {
      crateRoot: surface.routeCrateRoot,
      crateImport: surface.routeCrate.replaceAll("-", "_"),
      operations: surface.operationsPath,
    },
    routes: operationPlan.operations.map((operation) => ({
      method: operation.method,
      path: operation.path,
      operationId: operation.operationId,
      resource: operation.resource,
      tags: [operation.resource],
      auth: {
        mode: operation.authMode,
        required: true,
        permission: operation.permission ?? null,
        tenantScope: "tenant",
        dataScope: "organization",
      },
      handler: {
        module: "crate::handlers",
        name: handlerName(operation.operationId),
      },
      schemas: {
        request: hasRequestBody(operation.method) ? "CourseOperationCommand" : null,
        response: "CourseOperationResult",
        problem: "ProblemDetail",
      },
      ownership: {
        owner: operationPlan.owner,
        domain: operationPlan.domain,
        capability: operationPlan.capability,
        apiAuthority: operationPlan.apiAuthority,
        sdkFamily: operationPlan.sdkFamily,
      },
      idempotency: operation.idempotency ?? null,
      auditEvent: operation.auditEvent ?? null,
      todo: operation.todo,
    })),
  };
}

function buildOpenApi(operationPlan, surface) {
  const paths = {};
  for (const operation of operationPlan.operations) {
    paths[operation.path] ??= {};
    paths[operation.path][operation.method.toLowerCase()] = buildOpenApiOperation(
      operationPlan,
      surface,
      operation,
    );
  }

  return {
    openapi: "3.1.2",
    info: {
      title: surface.title,
      version: "1.0.0",
      description:
        "SDKWork Course authority generated from apis/*/course/operations.json. TODO(course): Replace generic schemas with reviewed per-operation request and response DTOs before SDK publication.",
    },
    "x-sdkwork-owner": operationPlan.owner,
    "x-sdkwork-domain": operationPlan.domain,
    "x-sdkwork-api-authority": operationPlan.apiAuthority,
    "x-sdkwork-sdk-family": operationPlan.sdkFamily,
    servers: [
      {
        url: operationPlan.apiPrefix,
        description: `${operationPlan.surface} canonical SDKWork v3 prefix`,
      },
    ],
    security: [{ AuthToken: [], AccessToken: [] }],
    paths,
    components: buildComponents(),
  };
}

function buildOpenApiOperation(operationPlan, surface, operation) {
  const operationObject = {
    tags: [operation.resource],
    summary: toTitle(operation.operationId),
    description: operation.todo,
    operationId: operation.operationId,
    parameters: [
      ...pathParameters(operation.path),
      ...queryParameters(operation),
      ...idempotencyParameters(operation),
    ],
    responses: {
      "200": {
        description: "Course operation result. TODO(course): Specialize the response schema for this operation.",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CourseOperationResult" },
          },
        },
      },
      "400": problemResponse("Invalid request"),
      "401": problemResponse("Authentication required"),
      "403": problemResponse("Permission denied"),
      "404": problemResponse("Course resource not found"),
      "409": problemResponse("Conflict or idempotency mismatch"),
    },
    security: [{ AuthToken: [], AccessToken: [] }],
    "x-sdkwork-owner": operationPlan.owner,
    "x-sdkwork-api-authority": operationPlan.apiAuthority,
    "x-sdkwork-domain": operationPlan.domain,
    "x-sdkwork-resource": operation.resource,
    "x-sdkwork-permission": operation.permission ?? null,
    "x-sdkwork-auth-mode": "dual-token",
    "x-sdkwork-tenant-scope": "tenant",
    "x-sdkwork-data-scope": "organization",
    "x-sdkwork-audit-event": operation.auditEvent ?? null,
    "x-sdkwork-idempotent": operation.idempotency ?? null,
    "x-sdkwork-source": surface.operationsPath,
    "x-sdkwork-source-route-crate": surface.routeCrate,
  };

  if (hasRequestBody(operation.method)) {
    operationObject.requestBody = {
      required: true,
      description:
        "TODO(course): Replace CourseOperationCommand with a typed request schema for this operation.",
      content: {
        "application/json": {
          schema: { $ref: "#/components/schemas/CourseOperationCommand" },
        },
      },
    };
  }

  return operationObject;
}

function buildComponents() {
  return {
    securitySchemes: {
      AuthToken: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "SDKWork auth token supplied by the appbase TokenManager.",
      },
      AccessToken: {
        type: "apiKey",
        in: "header",
        name: "Access-Token",
        description: "SDKWork access token supplied by the appbase TokenManager.",
      },
    },
    schemas: {
      ProblemDetail: {
        type: "object",
        additionalProperties: false,
        required: ["type", "title", "status"],
        properties: {
          type: { type: "string" },
          title: { type: "string" },
          status: { type: "integer", format: "int32" },
          detail: { type: "string" },
          code: { type: "string" },
          traceId: { type: "string" },
          requestId: { type: "string" },
        },
      },
      CourseOperationCommand: {
        type: "object",
        additionalProperties: true,
        description:
          "TODO(course): Materialize operation-specific command DTOs from the service contracts.",
      },
      CourseOperationResult: {
        type: "object",
        additionalProperties: false,
        required: ["requestId", "data"],
        properties: {
          requestId: { type: "string" },
          data: {
            type: "object",
            additionalProperties: true,
            description:
              "TODO(course): Materialize operation-specific result DTOs from the service contracts.",
          },
        },
      },
    },
  };
}

function pathParameters(routePath) {
  const parameters = [...routePath.matchAll(/\{([^}]+)\}/gu)].map((match) => match[1]);
  return parameters.map((name) => ({
    name,
    in: "path",
    required: true,
    schema: { type: "string" },
  }));
}

function queryParameters(operation) {
  if (operation.method !== "GET") {
    return [];
  }

  const isList = operation.operationId.endsWith(".list");
  if (!isList) {
    return [];
  }

  return [
    { name: "q", in: "query", required: false, schema: { type: "string" } },
    { name: "cursor", in: "query", required: false, schema: { type: "string" } },
    {
      name: "limit",
      in: "query",
      required: false,
      schema: { type: "integer", format: "int32", minimum: 1, maximum: 200 },
    },
    { name: "status", in: "query", required: false, schema: { type: "string" } },
  ];
}

function idempotencyParameters(operation) {
  if (!operation.idempotency) {
    return [];
  }

  return [
    {
      name: "Idempotency-Key",
      in: "header",
      required: operation.idempotency === "required",
      schema: { type: "string", minLength: 8, maxLength: 256 },
      description: "Client retry idempotency key. This is not the server requestId.",
    },
  ];
}

function problemResponse(description) {
  return {
    description,
    content: {
      "application/problem+json": {
        schema: { $ref: "#/components/schemas/ProblemDetail" },
      },
    },
  };
}

function hasRequestBody(method) {
  return ["PATCH", "POST", "PUT"].includes(method);
}

function handlerName(operationId) {
  return operationId
    .replaceAll(".", "_")
    .replace(/[A-Z]/gu, (match) => `_${match.toLowerCase()}`)
    .replaceAll("__", "_")
    .toLowerCase();
}

function toTitle(operationId) {
  return operationId
    .replaceAll(".", " ")
    .replace(/[A-Z]/gu, (match) => ` ${match}`)
    .replace(/\s+/gu, " ")
    .trim();
}

function syncAssemblyCount(relativePath, count) {
  const assembly = readJson(relativePath);
  assembly.ownerOnlyOperationCount = count;
  writeJson(relativePath, assembly);
}
