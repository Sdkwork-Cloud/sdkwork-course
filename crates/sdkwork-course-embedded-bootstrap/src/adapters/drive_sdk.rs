use async_trait::async_trait;
use sdkwork_content_course_service::domain::commands::{
    CourseMediaResourceRef, CourseServiceContext,
};
use sdkwork_content_course_service::domain::models::{CourseError, CourseResult};
use sdkwork_content_course_service::ports::provider::CourseDrivePort;
use sdkwork_drive_app_sdk_generated_rust::{
    CreateDownloadGrantRequest, CreateDownloadUrlResponse, SdkworkAppClient, SdkworkError,
};
use sdkwork_utils_rust::string::{is_blank, trim};

const DRIVE_FACADE_URL_ENV: &str = "SDKWORK_DRIVE_FACADE_URL";
const DRIVE_APP_API_BASE_ENV: &str = "SDKWORK_DRIVE_APP_API_BASE_URL";

/// Drive integration via generated `@sdkwork/drive-app-sdk` Rust transport.
#[derive(Clone)]
pub struct SdkDriveCoursePort {
    base_url: String,
}

impl SdkDriveCoursePort {
    pub fn from_env() -> Result<Self, String> {
        let base_url = std::env::var(DRIVE_FACADE_URL_ENV)
            .ok()
            .or_else(|| std::env::var(DRIVE_APP_API_BASE_ENV).ok())
            .map(|value| trim(&value).to_string())
            .filter(|value| !is_blank(Some(value.as_str())))
            .ok_or_else(|| {
                format!("{DRIVE_FACADE_URL_ENV} or {DRIVE_APP_API_BASE_ENV} must be configured")
            })?;
        Ok(Self { base_url })
    }

    fn client_for_context(
        &self,
        context: &CourseServiceContext,
    ) -> Result<SdkworkAppClient, CourseError> {
        let client =
            SdkworkAppClient::new_with_base_url(&self.base_url).map_err(map_drive_error)?;
        if let Some(token) = std::env::var("SDKWORK_ACCESS_TOKEN")
            .ok()
            .map(|value| trim(&value).to_string())
            .filter(|value| !is_blank(Some(value.as_str())))
        {
            client.set_access_token(token);
        }
        if let Some(actor_id) = context
            .actor_id
            .as_deref()
            .map(trim)
            .filter(|value| !is_blank(Some(value.as_str())))
        {
            client.set_header("X-Sdkwork-User-Id", actor_id);
        }
        if !is_blank(Some(context.tenant_id.as_str())) {
            client.set_header("X-Sdkwork-Tenant-Id", &context.tenant_id);
        }
        if !is_blank(Some(context.organization_id.as_str())) {
            client.set_header("X-Sdkwork-Organization-Id", &context.organization_id);
        }
        Ok(client)
    }
}

#[async_trait]
impl CourseDrivePort for SdkDriveCoursePort {
    async fn validate_resource(
        &self,
        context: &CourseServiceContext,
        resource: CourseMediaResourceRef,
    ) -> CourseResult<CourseMediaResourceRef> {
        if is_blank(Some(resource.drive_resource_id.as_str())) {
            return Err(CourseError::invalid("driveResourceId is required"));
        }
        let client = self.client_for_context(context)?;
        client
            .drive()
            .nodes_retrieve(&resource.drive_resource_id)
            .await
            .map_err(map_drive_error)?;
        Ok(resource)
    }

    async fn issue_download_grant(
        &self,
        context: &CourseServiceContext,
        resource_ref_id: String,
    ) -> CourseResult<String> {
        if is_blank(Some(resource_ref_id.as_str())) {
            return Err(CourseError::invalid("resourceRefId is required"));
        }
        let client = self.client_for_context(context)?;
        let grant = client
            .drive()
            .download_grants_create(
                &resource_ref_id,
                &CreateDownloadGrantRequest {
                    requested_ttl_seconds: Some(3_600),
                },
            )
            .await
            .map_err(map_drive_error)?;
        let download_data: CreateDownloadUrlResponse =
            serde_json::from_value(grant.data).map_err(|err| {
                CourseError::storage(format!("failed to parse download grant response: {err}"))
            })?;
        Ok(download_data.download_url)
    }
}

fn map_drive_error(error: SdkworkError) -> CourseError {
    let message = error.to_string();
    if message.contains("404") || message.to_lowercase().contains("not found") {
        CourseError::not_found(message)
    } else if message.contains("403") || message.to_lowercase().contains("forbidden") {
        CourseError::invalid(message)
    } else {
        CourseError::storage(message)
    }
}
