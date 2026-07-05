use std::sync::Arc;

use sdkwork_content_course_service::CourseApplicationService;

#[derive(Clone)]
pub struct CourseAppApiState {
    service: Arc<dyn CourseApplicationService>,
}

impl CourseAppApiState {
    pub fn new(service: Arc<dyn CourseApplicationService>) -> Self {
        Self { service }
    }

    pub fn service(&self) -> Arc<dyn CourseApplicationService> {
        Arc::clone(&self.service)
    }
}
