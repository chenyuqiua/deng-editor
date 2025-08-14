import { promiseWithResolvers } from './async'

export const getImageSize = (url: string): Promise<{ width: number; height: number }> => {
  const { promise, resolve, reject } = promiseWithResolvers<{ width: number; height: number }>()
  const i = new Image()
  i.onload = () => {
    const { width, height } = i
    resolve({ width, height })
  }
  i.src = url
  i.onerror = () => reject(new Error('Image load failed'))
  return promise
}
