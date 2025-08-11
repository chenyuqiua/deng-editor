import { v4 } from 'uuid'

export function generateUuid(namespace?: string): string {
  if (!namespace) {
    return v4()
  }
  return `${namespace}-${v4()}`
}
