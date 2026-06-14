use serde_json::Value;

use crate::error::{CourseRouteError, CourseRouteResult};
use sdkwork_content_course_service::{
    CourseApplicationService, CourseEnrollmentCommand, CourseLessonProgressCommand, CourseQuery,
    CourseServiceContext,
};

fn success(data: Value) -> Value {
    serde_json::json!({ "code": "2000", "msg": "SUCCESS", "data": data })
}

pub async fn course_categories_list(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    query: CourseQuery,
) -> CourseRouteResult<Value> {
    let items = service.list_categories(context, query).await?;
    Ok(success(serde_json::to_value(items).unwrap_or_default()))
}

pub async fn course_categories_retrieve(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    _category_id: String,
) -> CourseRouteResult<Value> {
    let items = service
        .list_categories(context, CourseQuery::default())
        .await?;
    Ok(success(serde_json::to_value(items).unwrap_or_default()))
}

pub async fn courses_list(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    query: CourseQuery,
) -> CourseRouteResult<Value> {
    let page = service.list_courses(context, query).await?;
    Ok(success(serde_json::to_value(page).unwrap_or_default()))
}

pub async fn courses_retrieve(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    course_id: String,
) -> CourseRouteResult<Value> {
    let item = service.retrieve_course(context, course_id).await?;
    match item {
        Some(course) => Ok(success(serde_json::to_value(course).unwrap_or_default())),
        None => Err(CourseRouteError::not_found("Course not found")),
    }
}

pub async fn course_offerings_list(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    course_id: String,
) -> CourseRouteResult<Value> {
    let items = service.list_offerings(context, course_id).await?;
    Ok(success(serde_json::to_value(items).unwrap_or_default()))
}

pub async fn course_offerings_retrieve(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    offering_id: String,
) -> CourseRouteResult<Value> {
    let item = service.retrieve_offering(context, offering_id).await?;
    match item {
        Some(offering) => Ok(success(serde_json::to_value(offering).unwrap_or_default())),
        None => Err(CourseRouteError::not_found("Offering not found")),
    }
}

pub async fn course_enrollments_create(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    offering_id: String,
    body: Value,
) -> CourseRouteResult<Value> {
    let command = CourseEnrollmentCommand {
        offering_id,
        learner_user_id: context.user_id.clone().unwrap_or_default(),
        source: body
            .get("source")
            .and_then(|v| v.as_str())
            .unwrap_or("self_service")
            .to_string(),
        idempotency_key: body
            .get("idempotencyKey")
            .and_then(|v| v.as_str())
            .map(|s| s.to_string()),
    };
    let enrollment_id = service.enroll(context, command).await?;
    Ok(success(
        serde_json::json!({ "enrollmentId": enrollment_id }),
    ))
}

pub async fn course_enrollments_current_list(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    query: CourseQuery,
) -> CourseRouteResult<Value> {
    let items = service.list_enrollments(context, query).await?;
    Ok(success(serde_json::to_value(items).unwrap_or_default()))
}

pub async fn course_enrollments_retrieve(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    enrollment_id: String,
) -> CourseRouteResult<Value> {
    let result = service.retrieve_enrollment(context, enrollment_id).await?;
    Ok(success(serde_json::to_value(result).unwrap_or_default()))
}

pub async fn course_enrollments_cancel(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    enrollment_id: String,
) -> CourseRouteResult<Value> {
    service.revoke_enrollment(context, enrollment_id).await?;
    Ok(success(serde_json::json!(null)))
}

pub async fn course_sections_list(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    course_id: String,
) -> CourseRouteResult<Value> {
    let items = service.list_sections(context, course_id).await?;
    Ok(success(serde_json::to_value(items).unwrap_or_default()))
}

pub async fn course_lessons_list(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    course_id: String,
) -> CourseRouteResult<Value> {
    let items = service.list_lessons(context, course_id).await?;
    Ok(success(serde_json::to_value(items).unwrap_or_default()))
}

pub async fn course_lessons_retrieve(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    lesson_id: String,
) -> CourseRouteResult<Value> {
    let result = service.retrieve_lesson(context, lesson_id).await?;
    Ok(success(serde_json::to_value(result).unwrap_or_default()))
}

pub async fn course_lesson_resources_list(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    lesson_id: String,
) -> CourseRouteResult<Value> {
    let result = service
        .list_resources(context, "lesson".to_string(), lesson_id)
        .await?;
    Ok(success(serde_json::to_value(result).unwrap_or_default()))
}

pub async fn course_progress_retrieve(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    enrollment_id: String,
) -> CourseRouteResult<Value> {
    let item = service.retrieve_progress(context, enrollment_id).await?;
    Ok(success(serde_json::to_value(item).unwrap_or_default()))
}

pub async fn course_lesson_progress_update(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    _lesson_id: String,
    body: Value,
) -> CourseRouteResult<Value> {
    let command = CourseLessonProgressCommand {
        enrollment_id: body
            .get("enrollmentId")
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string(),
        lesson_id: _lesson_id,
        progress_status: serde_json::from_value(
            body.get("progressStatus")
                .cloned()
                .unwrap_or(serde_json::json!("not_started")),
        )
        .unwrap_or(sdkwork_content_course_service::CourseProgressStatus::NotStarted),
        watched_seconds: body.get("watchedSeconds").and_then(|v| v.as_i64()),
        completed_at: body
            .get("completedAt")
            .and_then(|v| v.as_str())
            .map(|s| s.to_string()),
        idempotency_key: None,
    };
    service.update_lesson_progress(context, command).await?;
    Ok(success(serde_json::json!(null)))
}

pub async fn course_lesson_progress_watch_positions_update(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    lesson_id: String,
    body: Value,
) -> CourseRouteResult<Value> {
    let command = CourseLessonProgressCommand {
        enrollment_id: body
            .get("enrollmentId")
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string(),
        lesson_id,
        progress_status: sdkwork_content_course_service::CourseProgressStatus::InProgress,
        watched_seconds: body.get("watchPositionSeconds").and_then(|v| v.as_i64()),
        completed_at: None,
        idempotency_key: None,
    };
    service.update_lesson_progress(context, command).await?;
    Ok(success(serde_json::json!(null)))
}

pub async fn course_live_sessions_list(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    query: CourseQuery,
) -> CourseRouteResult<Value> {
    let items = service.list_live_sessions(context, query).await?;
    Ok(success(serde_json::to_value(items).unwrap_or_default()))
}

pub async fn course_live_sessions_retrieve(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    live_session_id: String,
) -> CourseRouteResult<Value> {
    let item = service
        .retrieve_live_session(context, live_session_id)
        .await?;
    match item {
        Some(session) => Ok(success(serde_json::to_value(session).unwrap_or_default())),
        None => Err(CourseRouteError::not_found("Live session not found")),
    }
}

pub async fn course_live_sessions_join(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    live_session_id: String,
) -> CourseRouteResult<Value> {
    let grant = service.join_live_session(context, live_session_id).await?;
    Ok(success(serde_json::to_value(grant).unwrap_or_default()))
}

pub async fn course_live_sessions_heartbeat(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    live_session_id: String,
) -> CourseRouteResult<Value> {
    service
        .heartbeat_live_session(context, live_session_id)
        .await?;
    Ok(success(serde_json::json!(null)))
}

pub async fn course_live_sessions_leave(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    live_session_id: String,
) -> CourseRouteResult<Value> {
    service.leave_live_session(context, live_session_id).await?;
    Ok(success(serde_json::json!(null)))
}

pub async fn course_live_sessions_replay_retrieve(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    live_session_id: String,
) -> CourseRouteResult<Value> {
    let result = service
        .retrieve_live_session_replay(context, live_session_id)
        .await?;
    match result {
        Some(replay) => Ok(success(replay)),
        None => Ok(success(serde_json::json!(null))),
    }
}

pub async fn course_comments_list(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    query: CourseQuery,
) -> CourseRouteResult<Value> {
    let items = service.list_comments(context, query).await?;
    Ok(success(serde_json::to_value(items).unwrap_or_default()))
}

pub async fn course_comments_create(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    _course_id: String,
    body: Value,
) -> CourseRouteResult<Value> {
    let item = service.create_comment(context, body).await?;
    Ok(success(serde_json::to_value(item).unwrap_or_default()))
}

pub async fn course_comments_delete(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    comment_id: String,
) -> CourseRouteResult<Value> {
    service.delete_comment(context, comment_id).await?;
    Ok(success(serde_json::json!(null)))
}

pub async fn course_reactions_replace(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    body: Value,
) -> CourseRouteResult<Value> {
    let result = service.save_reaction(context, body).await?;
    Ok(success(result))
}

pub async fn course_reactions_delete(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    reaction_id: String,
) -> CourseRouteResult<Value> {
    service.delete_reaction(context, reaction_id).await?;
    Ok(success(serde_json::json!(null)))
}

pub async fn course_applications_create(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    body: Value,
) -> CourseRouteResult<Value> {
    let request = sdkwork_content_course_service::CourseApplicationCreateRequest {
        title: body
            .get("title")
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string(),
        category: body
            .get("category")
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string(),
        description: body
            .get("description")
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .to_string(),
        source_provider: body
            .get("sourceProvider")
            .and_then(|v| v.as_str())
            .unwrap_or("manual")
            .to_string(),
        external_bvid: body
            .get("externalBvid")
            .and_then(|v| v.as_str())
            .map(|s| s.to_string()),
        contact_name: body
            .get("contactName")
            .and_then(|v| v.as_str())
            .map(|s| s.to_string()),
        contact_email: body
            .get("contactEmail")
            .and_then(|v| v.as_str())
            .map(|s| s.to_string()),
        metadata: body.get("metadata").cloned(),
    };
    let item = service.submit_application(context, request).await?;
    Ok(success(serde_json::to_value(item).unwrap_or_default()))
}

pub async fn course_applications_current_list(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    query: CourseQuery,
) -> CourseRouteResult<Value> {
    let items = service.list_applications(context, query).await?;
    Ok(success(serde_json::to_value(items).unwrap_or_default()))
}

pub async fn course_applications_retrieve(
    service: &dyn CourseApplicationService,
    context: &CourseServiceContext,
    application_id: String,
) -> CourseRouteResult<Value> {
    let result = service
        .retrieve_application(context, application_id)
        .await?;
    match result {
        Some(application) => Ok(success(
            serde_json::to_value(application).unwrap_or_default(),
        )),
        None => Ok(success(serde_json::json!(null))),
    }
}
