/* ------ 公共接口 ------ */
/**
 * 服务标识符接口
 * 既可以作为装饰器使用，也包含类型信息
 */
export interface ServiceIdentifier<T> {
  // 装饰器函数签名
  (target: Constructor, key: string, index: number): void
  // 类型标记（编译时使用，运行时为undefined）
  readonly type: T
  // 字符串表示
  toString(): string
}

/* ------ 类型定义 ------ */
// 构造函数类型，支持任意参数
type Constructor<T = object> = new (...args: unknown[]) => T

// 依赖信息
interface DependencyInfo<T = unknown> {
  id: ServiceIdentifier<T>
  index: number
}

// 带有依赖注入元数据的构造函数
interface DIConstructor extends Constructor {
  [DI_TARGET]?: Constructor
  [DI_DEPENDENCIES]?: DependencyInfo[]
}

/* ------ 常量 ------ */
const DI_TARGET = '$di$target' as const
const DI_DEPENDENCIES = '$di$dependencies' as const

/* ------ 内部工具 ------ */
/**
 * 服务标识符注册表
 */
const serviceIds = new Map<string, ServiceIdentifier<unknown>>()

/**
 * 存储服务依赖关系
 */
function storeServiceDependency<T>(
  id: ServiceIdentifier<T>,
  target: Constructor,
  index: number
): void {
  const diTarget = target as DIConstructor

  if (diTarget[DI_TARGET] === target) {
    // 已经有依赖信息，追加新的依赖
    const dependencies = diTarget[DI_DEPENDENCIES]!
    dependencies.push({ id: id as ServiceIdentifier<unknown>, index })
  } else {
    // 首次添加依赖信息
    diTarget[DI_DEPENDENCIES] = [{ id: id as ServiceIdentifier<unknown>, index }]
    diTarget[DI_TARGET] = target
  }
}

/**
 * 创建服务装饰器
 * 这是创建 ServiceIdentifier 的唯一有效方式
 *
 * @param serviceId 服务的唯一标识符
 * @returns 可用作装饰器的服务标识符
 *
 * @example
 * ```typescript
 * interface IMyService {
 *   doSomething(): void
 * }
 *
 * const IMyService = createDecorator<IMyService>('myService')
 *
 * class MyClass {
 *   constructor(@IMyService private myService: IMyService) {}
 * }
 * ```
 */
export function createDecorator<T>(serviceId: string): ServiceIdentifier<T> {
  // 检查是否已经存在相同的服务ID
  if (serviceIds.has(serviceId)) {
    return serviceIds.get(serviceId)! as ServiceIdentifier<T>
  }

  // 使用自引用模式创建服务标识符
  const id: ServiceIdentifier<T> = Object.assign(
    function decoratorFunction(target: Constructor, key: string, index: number): void {
      storeServiceDependency(id, target, index)
    },
    {
      type: undefined as unknown as T, // 类型标记，运行时不存在
      toString: () => serviceId,
    }
  )

  // 注册到全局映射
  serviceIds.set(serviceId, id as ServiceIdentifier<unknown>)

  return id
}

// ------ 导出工具函数（向后兼容） ------
/**
 * 获取构造函数的依赖信息
 */
function getServiceDependencies<T>(ctor: Constructor<T>): DependencyInfo[] {
  const diCtor = ctor as DIConstructor
  return diCtor[DI_DEPENDENCIES] || []
}

/**
 * 兼容性导出，保持与原始API一致
 */
export const _util = {
  serviceIds: serviceIds as Map<string, ServiceIdentifier<unknown>>,
  DI_TARGET,
  DI_DEPENDENCIES,
  getServiceDependencies,
} as const
