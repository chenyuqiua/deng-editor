import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { createAppContainer } from './page/editor/bootstrap/app-bootstrap.ts'
import { registerGlobalAppContainer } from './page/editor/bootstrap/context.tsx'

// bootstrap app before render
const appContainer = createAppContainer()
registerGlobalAppContainer(appContainer)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
