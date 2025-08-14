import type { CSSProperties } from 'react'

export const DefaultElementDuration = 0.3

export const defaultTextElementStyle: CSSProperties & Record<string, any> = {
  display: 'inline-block',
  fontSize: 30,
  fontStyle: 'normal',
  fontWeight: 'normal',
  textDecoration: 'none',
  color: 'black',
  lineHeight: 1.2,
}
