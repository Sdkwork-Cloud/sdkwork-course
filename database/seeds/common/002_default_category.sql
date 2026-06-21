-- Root course category for composed Claw Router bootstrap (tenant 100001 / org 0).
INSERT INTO course_category
    (
        id,
        uuid,
        tenant_id,
        organization_id,
        category_code,
        name,
        description,
        level_no,
        sort_order,
        status,
        created_at,
        updated_at
    )
VALUES
    (
        'course-category-root',
        'course-category-root',
        '100001',
        '0',
        'root',
        'Courses',
        'Default course catalog root category',
        0,
        0,
        'active',
        CURRENT_TIMESTAMP::text,
        CURRENT_TIMESTAMP::text
    )
ON CONFLICT (id) DO UPDATE SET
    tenant_id = EXCLUDED.tenant_id,
    organization_id = EXCLUDED.organization_id,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;
