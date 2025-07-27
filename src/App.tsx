import { IconParkProvider } from './lib/iconpark/provider'
import { EditorMainPage } from './page/editor'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function App() {
  return (
    <IconParkProvider jsUrl="https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/icons_40263_85.adf9bcad7cf5aff6219a833a88c373ff.js">
      <DndProvider backend={HTML5Backend}>
        <EditorMainPage />
      </DndProvider>
    </IconParkProvider>
  )
}

export default App
