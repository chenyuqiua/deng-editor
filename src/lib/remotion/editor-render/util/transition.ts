export function getTransitionId(fromElementId: string, toElementId: string) {
  // 不允许改变id, 否则会导致用户草稿的过渡动画不工作
  return `${fromElementId}&${toElementId}`
}
