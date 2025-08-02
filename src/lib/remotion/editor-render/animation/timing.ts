import { Easing } from 'remotion'

export function linear(x: number) {
  if (x < 0) return 0
  if (x > 1) return 1
  return x
}

const easeBase = Easing.bezier(0.42, 0, 0.58, 1)

export const ease = (t: number) => {
  return easeBase(linear(t))
}
