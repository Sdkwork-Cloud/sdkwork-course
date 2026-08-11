-- Top-level course categories for the commercial catalog (tenant 100001 / org 0).
--
-- These root categories give the course center an immediately browsable
-- category system: the H5 category tabs, catalog listing, and course detail
-- pages all key off `course_category`. The seed is idempotent (upsert by id)
-- so re-running `pnpm db:seed` never duplicates rows.
--
-- `level_no = 1` places every category directly under the bootstrap root
-- (`course-category-root`); sort_order controls tab ordering in the UI.

INSERT INTO course_category
    (
        id,
        uuid,
        tenant_id,
        organization_id,
        parent_id,
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
        'course-category-programming',
        'course-category-programming',
        '100001',
        '0',
        'course-category-root',
        'programming',
        '编程开发',
        '前端、后端、移动端与全栈开发实战课程',
        1,
        10,
        'active',
        CURRENT_TIMESTAMP::text,
        CURRENT_TIMESTAMP::text
    ),
    (
        'course-category-ai',
        'course-category-ai',
        '100001',
        '0',
        'course-category-root',
        'ai',
        '人工智能',
        '机器学习、深度学习、大模型与 AIGC 应用',
        1,
        20,
        'active',
        CURRENT_TIMESTAMP::text,
        CURRENT_TIMESTAMP::text
    ),
    (
        'course-category-data',
        'course-category-data',
        '100001',
        '0',
        'course-category-root',
        'data',
        '数据分析',
        '数据分析、SQL、商业智能与数据科学',
        1,
        30,
        'active',
        CURRENT_TIMESTAMP::text,
        CURRENT_TIMESTAMP::text
    ),
    (
        'course-category-design',
        'course-category-design',
        '100001',
        '0',
        'course-category-root',
        'design',
        '设计创意',
        'UI/UX、平面设计、三维与品牌视觉',
        1,
        40,
        'active',
        CURRENT_TIMESTAMP::text,
        CURRENT_TIMESTAMP::text
    ),
    (
        'course-category-product',
        'course-category-product',
        '100001',
        '0',
        'course-category-root',
        'product',
        '产品经理',
        '产品思维、需求分析、增长与商业化',
        1,
        50,
        'active',
        CURRENT_TIMESTAMP::text,
        CURRENT_TIMESTAMP::text
    ),
    (
        'course-category-operations',
        'course-category-operations',
        '100001',
        '0',
        'course-category-root',
        'operations-marketing',
        '运营营销',
        '新媒体运营、增长营销与品牌推广',
        1,
        60,
        'active',
        CURRENT_TIMESTAMP::text,
        CURRENT_TIMESTAMP::text
    ),
    (
        'course-category-workplace',
        'course-category-workplace',
        '100001',
        '0',
        'course-category-root',
        'workplace',
        '职场技能',
        '职场沟通、管理能力与职业发展',
        1,
        70,
        'active',
        CURRENT_TIMESTAMP::text,
        CURRENT_TIMESTAMP::text
    ),
    (
        'course-category-language',
        'course-category-language',
        '100001',
        '0',
        'course-category-root',
        'language',
        '语言学习',
        '英语、日语等实用语言课程',
        1,
        80,
        'active',
        CURRENT_TIMESTAMP::text,
        CURRENT_TIMESTAMP::text
    ),
    (
        'course-category-finance',
        'course-category-finance',
        '100001',
        '0',
        'course-category-root',
        'finance',
        '金融财经',
        '投资理财、会计与金融知识',
        1,
        90,
        'active',
        CURRENT_TIMESTAMP::text,
        CURRENT_TIMESTAMP::text
    ),
    (
        'course-category-growth',
        'course-category-growth',
        '100001',
        '0',
        'course-category-root',
        'personal-growth',
        '个人成长',
        '思维提升、时间管理与自我管理',
        1,
        100,
        'active',
        CURRENT_TIMESTAMP::text,
        CURRENT_TIMESTAMP::text
    )
ON CONFLICT (id) DO UPDATE SET
    tenant_id = EXCLUDED.tenant_id,
    organization_id = EXCLUDED.organization_id,
    parent_id = EXCLUDED.parent_id,
    category_code = EXCLUDED.category_code,
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    level_no = EXCLUDED.level_no,
    sort_order = EXCLUDED.sort_order,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;
