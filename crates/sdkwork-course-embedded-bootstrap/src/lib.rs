mod adapters;
mod bootstrap;
mod port_factory;
mod provider_ports;

pub use bootstrap::{
    assemble_embedded_course_application_router,
    assemble_embedded_course_application_router_from_env, EmbeddedCourseAssembly,
};
