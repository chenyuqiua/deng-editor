import type { Point } from '@/lib/remotion/editor-render/schema/common'
import type Moveable from 'moveable'

export function pointRotate(point: Point, rad: number) {
  const { x, y } = point
  const matrix = [Math.cos(rad), Math.sin(rad), -Math.sin(rad), Math.cos(rad)]
  return {
    x: x * matrix[0] + y * matrix[2],
    y: x * matrix[1] + y * matrix[3],
  }
}

export const getPointDist = (p1: number[], p2: number[]) => {
  const dx = p1[0] - p2[0]
  const dy = p1[1] - p2[1]
  return Math.sqrt(dx * dx + dy * dy)
}

export function isHitControlBox(moveable: Moveable, event: MouseEvent) {
  const rect = moveable.getRect()
  const parent = moveable.getControlBoxElement().parentElement
  if (!parent) return false
  if (rect.width <= 0 || rect.height <= 0) return false

  // 以moveable中心点为坐标原点，建立坐标系，relativePoint为点击的点的点坐标
  const relativePoint = {
    x: event.clientX - parent.getBoundingClientRect().left - rect.left - rect.width / 2,
    y: event.clientY - parent.getBoundingClientRect().top - rect.top - rect.height / 2,
  }

  const boxWidth = getPointDist(rect.pos1, rect.pos2)
  const boxHeight = getPointDist(rect.pos2, rect.pos4)

  // 旋转回正
  const relativePointWithCorrect = pointRotate(relativePoint, (-rect.rotation / 180) * Math.PI)

  // 判断是否在举行框内
  return !(
    Math.abs(relativePointWithCorrect.x) >= boxWidth / 2 ||
    Math.abs(relativePointWithCorrect.y) >= boxHeight / 2
  )
}
