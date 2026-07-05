use std::error::Error;
use std::fmt::{Display, Formatter};

use sdkwork_content_course_service::CourseError;

pub type CourseRouteResult<T> = Result<T, CourseRouteError>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct CourseRouteError {
    code: &'static str,
    message: String,
}

impl CourseRouteError {
    pub fn invalid(message: impl Into<String>) -> Self {
        Self {
            code: "invalid",
            message: message.into(),
        }
    }

    pub fn not_found(message: impl Into<String>) -> Self {
        Self {
            code: "not_found",
            message: message.into(),
        }
    }

    pub fn internal(message: impl Into<String>) -> Self {
        Self {
            code: "internal",
            message: message.into(),
        }
    }

    pub fn code(&self) -> &'static str {
        self.code
    }

    pub fn message(&self) -> &str {
        &self.message
    }
}

impl Display for CourseRouteError {
    fn fmt(&self, formatter: &mut Formatter<'_>) -> std::fmt::Result {
        write!(formatter, "{}: {}", self.code, self.message)
    }
}

impl Error for CourseRouteError {}

impl From<CourseError> for CourseRouteError {
    fn from(error: CourseError) -> Self {
        match error.code() {
            "not_found" => Self::not_found(error.message()),
            "storage" => Self::internal(error.message()),
            _ => Self::invalid(error.message()),
        }
    }
}
