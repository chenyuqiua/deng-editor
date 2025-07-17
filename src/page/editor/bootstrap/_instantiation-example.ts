// // ------ internal util

// /* eslint-disable @typescript-eslint/no-namespace */
// /* eslint-disable @typescript-eslint/no-explicit-any */
// /* eslint-disable @typescript-eslint/no-unsafe-function-type */
// export namespace _util {
//   export const serviceIds = new Map<string, ServiceIdentifier<any>>()

//   export const DI_TARGET = '$di$target'
//   export const DI_DEPENDENCIES = '$di$dependencies'

//   export function getServiceDependencies(
//     ctor: any
//   ): { id: ServiceIdentifier<any>; index: number }[] {
//     return ctor[DI_DEPENDENCIES] || []
//   }
// }

// // --- interfaces ------

// /**
//  * Identifies a service of type `T`.
//  */
// export interface ServiceIdentifier<T> {
//   (...args: any[]): void
//   type: T
// }

// function storeServiceDependency(id: Function, target: Function, index: number): void {
//   if ((target as any)[_util.DI_TARGET] === target) {
//     ;(target as any)[_util.DI_DEPENDENCIES].push({ id, index })
//   } else {
//     ;(target as any)[_util.DI_DEPENDENCIES] = [{ id, index }]
//     ;(target as any)[_util.DI_TARGET] = target
//   }
// }

// /**
//  * The *only* valid way to create a {{ServiceIdentifier}}.
//  */
// export function createDecorator<T>(serviceId: string): ServiceIdentifier<T> {
//   if (_util.serviceIds.has(serviceId)) {
//     return _util.serviceIds.get(serviceId)!
//   }

//   const id = function (target: Function, key: string, index: number) {
//     if (arguments.length !== 3) {
//       throw new Error('@IServiceName-decorator can only be used to decorate a parameter')
//     }
//     storeServiceDependency(id, target, index)
//   } as ServiceIdentifier<T>

//   id.toString = () => serviceId

//   _util.serviceIds.set(serviceId, id)
//   return id
// }
