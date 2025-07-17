import { AppContainer } from './app-container'

export function createAppContainer() {
  const appContainer = new AppContainer()
  appContainer.bootstrap()
  return appContainer
}
