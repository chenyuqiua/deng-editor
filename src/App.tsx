import { IconParkProvider } from './lib/iconpark/provider'
import { EditorMainPage } from './page/editor'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

function App() {
  return (
    <IconParkProvider jsUrl="https://lf1-cdn-tos.bytegoofy.com/obj/iconpark/icons_40263_79.b132e7fe5f1aa6d9acaf1bae401e1b95.js">
      <DndProvider backend={HTML5Backend}>
        <EditorMainPage />
      </DndProvider>
    </IconParkProvider>
  )
}

export default App
