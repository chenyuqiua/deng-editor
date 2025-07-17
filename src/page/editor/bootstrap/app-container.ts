import { getAllServicesForRegister } from '../service/util'
import type { ServiceIdentifier } from './instantiation'

export class AppContainer {
  private _serviceMap = new Map()
  private disposeList: (() => void)[] = []

  dispose() {
    this._serviceMap.forEach((service: { dispose: () => void }) => {
      service?.dispose?.()
    })
    this._serviceMap.clear()
    this.disposeList.forEach(dispose => dispose())
    this.disposeList = []
  }

  bootstrap() {
    this.registerAppService()
  }

  invokeFunction<T>(id: ServiceIdentifier<T>): T {
    const service = this._serviceMap.get(id)
    return service
  }

  registerService<T>(id: ServiceIdentifier<T>, service: T): T {
    this._serviceMap.set(id, service)
    return service
  }

  registerAppService() {
    getAllServicesForRegister().forEach(([id, service]) => {
      this.registerService(id, service)
    })
  }
}
