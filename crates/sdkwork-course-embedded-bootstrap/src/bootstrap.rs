use std::sync::Arc;

use axum::Router;
use sdkwork_content_course_repository_sqlx::{
    connect_and_bootstrap_course_database_from_env, PostgresCourseRepository,
    SqliteCourseRepository,
};
use sdkwork_content_course_service::{
    ports::repository::{
        CourseApplicationRepository, CourseAuditLogRepository, CourseCatalogRepository,
        CourseCategoryRepository, CourseCommentRepository, CourseEnrollmentRepository,
        CourseInstructorRepository, CourseLessonRepository, CourseLiveSessionRepository,
        CourseOfferingRepository, CourseProgressRepository, CourseReactionRepository,
        CourseResourceRepository,
    },
    CourseApplicationService, CourseServiceImpl,
};
use sdkwork_database_sqlx::DatabasePool;
use sdkwork_routes_course_app_api::gateway_mount as mount_course_app_api;
use sdkwork_routes_course_backend_api::gateway_mount as mount_course_backend_api;

use crate::port_factory::build_provider_ports;

fn build_course_service<R>(repo: R) -> Arc<dyn CourseApplicationService>
where
    R: CourseCategoryRepository
        + CourseCatalogRepository
        + CourseInstructorRepository
        + CourseOfferingRepository
        + CourseLessonRepository
        + CourseLiveSessionRepository
        + CourseEnrollmentRepository
        + CourseProgressRepository
        + CourseCommentRepository
        + CourseApplicationRepository
        + CourseAuditLogRepository
        + CourseResourceRepository
        + CourseReactionRepository
        + Clone
        + 'static,
{
    let ports = build_provider_ports();
    Arc::new(CourseServiceImpl::new(
        Box::new(repo.clone()) as Box<dyn CourseCategoryRepository>,
        Box::new(repo.clone()) as Box<dyn CourseCatalogRepository>,
        Box::new(repo.clone()) as Box<dyn CourseInstructorRepository>,
        Box::new(repo.clone()) as Box<dyn CourseOfferingRepository>,
        Box::new(repo.clone()) as Box<dyn CourseLessonRepository>,
        Box::new(repo.clone()) as Box<dyn CourseLiveSessionRepository>,
        Box::new(repo.clone()) as Box<dyn CourseEnrollmentRepository>,
        Box::new(repo.clone()) as Box<dyn CourseProgressRepository>,
        Box::new(repo.clone()) as Box<dyn CourseCommentRepository>,
        Box::new(repo.clone()) as Box<dyn CourseApplicationRepository>,
        Box::new(repo.clone()) as Box<dyn CourseAuditLogRepository>,
        Box::new(repo.clone()) as Box<dyn CourseResourceRepository>,
        Box::new(repo.clone()) as Box<dyn CourseReactionRepository>,
        ports.drive,
        ports.live,
        ports.entitlement,
        ports.notification,
        ports.audit,
    )) as Arc<dyn CourseApplicationService>
}

pub struct EmbeddedCourseAssembly {
    pub router: Router,
}

pub async fn assemble_embedded_course_application_router_from_env(
) -> Result<EmbeddedCourseAssembly, String> {
    let _ = dotenvy::dotenv();
    let host = connect_and_bootstrap_course_database_from_env().await?;
    assemble_embedded_course_application_router(host.pool().clone()).await
}

pub async fn assemble_embedded_course_application_router(
    pool: DatabasePool,
) -> Result<EmbeddedCourseAssembly, String> {
    let service = match pool {
        DatabasePool::Sqlite(sqlite_pool, _) => {
            let repository = SqliteCourseRepository::new(sqlite_pool);
            repository
                .apply_foundation_migration()
                .await
                .map_err(|error| error.message().to_string())?;
            build_course_service(repository)
        }
        DatabasePool::Postgres(postgres_pool, _) => {
            let repository = PostgresCourseRepository::new(postgres_pool);
            build_course_service(repository)
        }
    };

    let router = mount_course_app_api(Arc::clone(&service)).merge(mount_course_backend_api(service));
    Ok(EmbeddedCourseAssembly { router })
}
