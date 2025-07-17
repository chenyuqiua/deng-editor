import { IDraftService } from '../service/draft-service.type'
import type { AppContainer } from './app-container'
import type { ServiceIdentifier } from './instantiation'

let appContainer: AppContainer | null = null

export function registerGlobalAppContainer(container: AppContainer) {
  appContainer = container
}

function ensureContainer(): AppContainer {
  if (!appContainer) {
    throw new Error(
      'Service container is not initialized. Make sure registerGlobalAppContainer is called before accessing services.'
    )
  }
  return appContainer
}

export function useServices<T>(id: ServiceIdentifier<T>) {
  const container = ensureContainer()
  return container.invokeFunction(id)
}

export function getService<T>(id: ServiceIdentifier<T>) {
  const container = ensureContainer()
  return container.invokeFunction(id)
}

export function useDraftService() {
  return useServices(IDraftService)
}
