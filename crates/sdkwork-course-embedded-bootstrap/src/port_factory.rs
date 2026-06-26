use sdkwork_content_course_service::ports::provider::{
    CourseAuditEventPort, CourseDrivePort, CourseEntitlementPort, CourseLiveProviderPort,
    CourseNotificationPort,
};

use crate::adapters::{
    HttpCourseAuditEventPort, HttpCourseNotificationPort, LoggingCourseAuditEventPort,
    LoggingCourseNotificationPort,
};
use crate::provider_ports::{
    EmbeddedLocalEntitlementPort, EmbeddedPassThroughDrivePort, UnconfiguredAuditEventPort,
    UnconfiguredLiveProviderPort, UnconfiguredNotificationPort,
};

const COURSE_AUDIT_URL_ENV: &str = "SDKWORK_COURSE_AUDIT_URL";
const COURSE_NOTIFICATION_URL_ENV: &str = "SDKWORK_COURSE_NOTIFICATION_URL";
const IM_AUDIT_UPSTREAM_ENV: &str = "SDKWORK_IM_AUDIT_SERVICE_UPSTREAM";
const IM_NOTIFICATION_UPSTREAM_ENV: &str = "SDKWORK_IM_NOTIFICATION_SERVICE_UPSTREAM";
const COURSE_INTEGRATION_LOG_ENV: &str = "SDKWORK_COURSE_INTEGRATION_LOG";

pub fn build_drive_port() -> Box<dyn CourseDrivePort> {
    Box::new(EmbeddedPassThroughDrivePort)
}

pub fn build_entitlement_port() -> Box<dyn CourseEntitlementPort> {
    Box::new(EmbeddedLocalEntitlementPort)
}

pub fn build_live_provider_port() -> Box<dyn CourseLiveProviderPort> {
    Box::new(UnconfiguredLiveProviderPort)
}

pub fn build_notification_port() -> Box<dyn CourseNotificationPort> {
    if let Some(url) = resolve_integration_url(COURSE_NOTIFICATION_URL_ENV, IM_NOTIFICATION_UPSTREAM_ENV)
    {
        return Box::new(HttpCourseNotificationPort::new(url));
    }
    if integration_logging_enabled() {
        return Box::new(LoggingCourseNotificationPort);
    }
    Box::new(UnconfiguredNotificationPort)
}

pub fn build_audit_event_port() -> Box<dyn CourseAuditEventPort> {
    if let Some(url) = resolve_integration_url(COURSE_AUDIT_URL_ENV, IM_AUDIT_UPSTREAM_ENV) {
        return Box::new(HttpCourseAuditEventPort::new(url));
    }
    if integration_logging_enabled() {
        return Box::new(LoggingCourseAuditEventPort);
    }
    Box::new(UnconfiguredAuditEventPort)
}

pub fn build_provider_ports() -> ProviderPorts {
    ProviderPorts {
        drive: build_drive_port(),
        live: build_live_provider_port(),
        entitlement: build_entitlement_port(),
        notification: build_notification_port(),
        audit: build_audit_event_port(),
    }
}

pub struct ProviderPorts {
    pub drive: Box<dyn CourseDrivePort>,
    pub live: Box<dyn CourseLiveProviderPort>,
    pub entitlement: Box<dyn CourseEntitlementPort>,
    pub notification: Box<dyn CourseNotificationPort>,
    pub audit: Box<dyn CourseAuditEventPort>,
}

fn resolve_integration_url(primary_env: &str, fallback_env: &str) -> Option<String> {
    read_env_url(primary_env).or_else(|| read_env_url(fallback_env))
}

fn read_env_url(key: &str) -> Option<String> {
    std::env::var(key)
        .ok()
        .map(|value| value.trim().to_string())
        .filter(|value| !value.is_empty())
}

fn integration_logging_enabled() -> bool {
    matches!(
        std::env::var(COURSE_INTEGRATION_LOG_ENV)
            .ok()
            .map(|value| value.trim().to_ascii_lowercase())
            .as_deref(),
        Some("1") | Some("true") | Some("yes") | Some("on")
    )
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn resolve_integration_url_prefers_primary_env() {
        unsafe {
            std::env::set_var("SDKWORK_COURSE_AUDIT_URL", "http://audit.local");
            std::env::set_var("SDKWORK_IM_AUDIT_SERVICE_UPSTREAM", "http://fallback.local");
        }
        assert_eq!(
            resolve_integration_url(COURSE_AUDIT_URL_ENV, IM_AUDIT_UPSTREAM_ENV).as_deref(),
            Some("http://audit.local")
        );
        unsafe {
            std::env::remove_var("SDKWORK_COURSE_AUDIT_URL");
            std::env::remove_var("SDKWORK_IM_AUDIT_SERVICE_UPSTREAM");
        }
    }

    #[test]
    fn integration_logging_enabled_parses_truthy_values() {
        unsafe {
            std::env::set_var(COURSE_INTEGRATION_LOG_ENV, "true");
        }
        assert!(integration_logging_enabled());
        unsafe {
            std::env::remove_var(COURSE_INTEGRATION_LOG_ENV);
        }
    }
}
