import { IconParkProvider } from './lib/remotion/iconpark/provider'
import { EditorMainPage } from './page/editor'

function App() {
  return (
    <IconParkProvider jsUrl="https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/icons_40263_1.7e52233aca30e9af3bfa0f3aff0eac50.js">
      <EditorMainPage />
    </IconParkProvider>
  )
}

export default App
