use std::borrow::Cow;

pub fn translate_sqlite_placeholders(sql: &str) -> String {
    let mut translated = String::with_capacity(sql.len());
    let bytes = sql.as_bytes();
    let mut index = 0;

    while index < bytes.len() {
        if bytes[index] == b'?' && index + 1 < bytes.len() && bytes[index + 1].is_ascii_digit() {
            let start = index + 1;
            let mut end = start;
            while end < bytes.len() && bytes[end].is_ascii_digit() {
                end += 1;
            }
            translated.push('$');
            translated.push_str(std::str::from_utf8(&bytes[start..end]).unwrap_or_default());
            index = end;
            continue;
        }

        translated.push(char::from(bytes[index]));
        index += 1;
    }

    translated
}

pub trait CourseSqlBinding: Send + Sync {
    fn bind_sql<'a>(&self, sql: &'a str) -> Cow<'a, str>;
}

impl CourseSqlBinding for super::course_repository::SqliteCourseRepository {
    fn bind_sql<'a>(&self, sql: &'a str) -> Cow<'a, str> {
        Cow::Borrowed(sql)
    }
}

impl CourseSqlBinding for super::course_repository::PostgresCourseRepository {
    fn bind_sql<'a>(&self, sql: &'a str) -> Cow<'a, str> {
        Cow::Owned(translate_sqlite_placeholders(sql))
    }
}

#[cfg(test)]
mod tests {
    use super::translate_sqlite_placeholders;

    #[test]
    fn translate_sqlite_placeholders_rewrites_numbered_bindings() {
        assert_eq!(
            translate_sqlite_placeholders(
                "SELECT * FROM course_category WHERE tenant_id = ?1 AND status = ?2 LIMIT ?3 OFFSET ?4"
            ),
            "SELECT * FROM course_category WHERE tenant_id = $1 AND status = $2 LIMIT $3 OFFSET $4"
        );
    }
}
