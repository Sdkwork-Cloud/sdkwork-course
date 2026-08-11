import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initCourseH5I18n } from './bootstrap/i18n'
import { bootstrapCoursePort } from './bootstrap/coursePort'
import { initCourseH5Theme } from './bootstrap/theme'

// Bootstrap before render: theme (`.dark` class from system color scheme),
// i18n resources from the canonical course package, and the Course App SDK
// port binding for the mobile React pages.
initCourseH5Theme()
initCourseH5I18n()
bootstrapCoursePort()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
