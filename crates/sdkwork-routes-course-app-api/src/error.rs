use std::error::Error;
use std::fmt::{Display, Formatter};

use sdkwork_content_course_service::CourseError;
use serde::Serialize;

pub type CourseRouteResult<T> = Result<T, CourseRouteError>;

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
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

    pub fn to_problem_detail(&self) -> ProblemDetail {
        let status = match self.code {
            "not_found" => 404,
            "invalid" => 400,
            "internal" => 500,
            _ => 400,
        };
        ProblemDetail {
            r#type: format!("https://sdkwork.com/errors/{}", self.code),
            title: self.code.to_string(),
            status,
            detail: self.message.clone(),
            instance: None,
        }
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

#[derive(Debug, Clone, Serialize)]
pub struct ProblemDetail {
    pub r#type: String,
    pub title: String,
    pub status: u16,
    pub detail: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub instance: Option<String>,
}
