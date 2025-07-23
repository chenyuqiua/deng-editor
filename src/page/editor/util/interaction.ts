import type { Point } from '@/lib/remotion/editor-render/schema/common'
import type Moveable from 'moveable'
import { isDisplayElement } from '@/lib/remotion/editor-render/util/draft'
import { getService } from '../bootstrap/context'
import { IDraftService } from '../service/draft-service.type'
import _ from 'lodash'

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

  // 判断是否在矩形框内
  return !(
    Math.abs(relativePointWithCorrect.x) >= boxWidth / 2 ||
    Math.abs(relativePointWithCorrect.y) >= boxHeight / 2
  )
}

/**
 * 将逻辑从interaction-manager中抽离出来, 减少interaction-manager的复杂度
 * 监听moveable的拖拽、旋转、缩放、resize事件处理, 获取增量数据更新
 * - update 事件中, 将变动更新到视图上
 * - dragEnd 事件中, 将变动更新到draft中
 */
export function refreshClickMoveableListeners(
  moveable: Moveable | null,
  selectedElementId?: string
) {
  if (!moveable || !selectedElementId) return
  moveable.off()

  const getInitialDiff = () => {
    return {
      x: 0,
      y: 0,
      rotate: 0,
      scaleX: 1,
      scaleY: 1,
      width: 0,
      height: 0,
    }
  }

  const startData = { transform: '', width: 0, height: 0 }
  let diff = getInitialDiff()

  const handleStart = () => {
    const targetEl = moveable.target as HTMLElement
    if (!targetEl) return

    // 保存初始数据
    const rect = moveable.getRect()
    startData.width = rect.offsetWidth
    startData.height = rect.offsetHeight
    startData.transform = targetEl.style.transform

    // 初始化差值
    diff = getInitialDiff()
  }
  // 这里只将变动更新到视图上, 对draft的更新需要等待dragEnd事件
  const handleUpdate = () => {
    const targetEl = moveable.target as HTMLElement
    if (!targetEl) return

    const [t1, t2] = startData.transform.split(' scale')

    // 保留原有的 translate 和 rotate, 但是会用新的对其覆盖
    targetEl.style.transform = `translate(${diff.x}px, ${diff.y}px) ${t1} rotate(${diff.rotate}deg) scale${t2} scale(${diff.scaleX},${diff.scaleY})`

    // 对resize的宽高进行处理
    if (moveable.resizable && Array.isArray(moveable.renderDirections)) {
      const renderDirections = moveable.renderDirections
      if (renderDirections.includes('w') || renderDirections.includes('e')) {
        targetEl.style.width = `${startData.width + diff.width}px`
      }

      if (renderDirections.includes('n') || renderDirections.includes('s')) {
        targetEl.style.height = `${startData.height + diff.height}px`
      }
    }
  }
  // 将数据更新到draft中
  const handleEnd = () => {
    if (_.isEqual(diff, getInitialDiff())) return

    const draftService = getService(IDraftService)
    const draftEl = draftService.getElementById(selectedElementId)
    if (!draftEl || !isDisplayElement(draftEl)) return

    const data = {
      x: draftEl.x,
      y: draftEl.y,
      width: draftEl.width,
      height: draftEl.height,
      rotate: draftEl.rotate,
      scaleX: draftEl.scaleX,
      scaleY: draftEl.scaleY,
    }

    if (moveable.resizable && Array.isArray(moveable.renderDirections)) {
      const renderDirections = moveable.renderDirections
      if (renderDirections.includes('w') || renderDirections.includes('e')) {
        data.width = (data.width || startData.width) + diff.width
      }

      if (renderDirections.includes('n') || renderDirections.includes('s')) {
        data.height = (data.height || startData.height) + diff.height
      }
    }

    data.x += diff.x
    data.y += diff.y
    data.rotate += diff.rotate
    data.scaleX *= diff.scaleX
    data.scaleY *= diff.scaleY

    draftService.updateDisplayElement(selectedElementId, data)
  }

  moveable
    .on('dragStart', handleStart)
    .on('rotateStart', handleStart)
    .on('resizeStart', handleStart)
    .on('scaleStart', handleStart)
    .on('dragEnd', handleEnd)
    .on('rotateEnd', handleEnd)
    .on('resizeEnd', handleEnd)
    .on('scaleEnd', handleEnd)

  /*
    rotate -> data.delta -> 旋转角度的增量
    scale -> data.delta[0] -> x轴上缩放的增量
    scale -> data.delta[1] -> y轴上缩放的增量
    resize -> data.delta[0] -> 宽度增量
    resize -> data.delta[1] -> 高度增量
    data.drag.delta[0] -> 元素的中心点x的增量
    data.drag.delta[1] -> 元素的中心点y的增量
  */
  moveable.on('drag', data => {
    diff.x += data.delta[0]
    diff.y += data.delta[1]
    handleUpdate()
  })
  moveable.on('rotate', data => {
    diff.rotate += data.delta
    handleUpdate()
  })
  moveable.on('scale', data => {
    diff.scaleX *= data.delta[0]
    diff.scaleY *= data.delta[1]
    diff.x += data.drag.delta[0]
    diff.y += data.drag.delta[1]
    handleUpdate()
  })
  moveable.on('resize', data => {
    diff.width += data.delta[0]
    diff.height += data.delta[1]
    diff.x += data.drag.delta[0]
    diff.y += data.drag.delta[1]
    handleUpdate()
  })
}
