import { ResourcePanelPageEnum } from '../type/page'
import { AssetPanel } from '../asset'
import { TextPanel } from '../text'
import { MusicPanel } from '../music'
import { TransitionPanel } from '../transition'
import { DevPanel } from '../dev'

export const pageConfig = [
  {
    icon: 'upload-line',
    label: 'Assets',
    value: ResourcePanelPageEnum.ASSETS,
    component: <AssetPanel />,
  },
  {
    icon: 'text',
    label: 'Text',
    value: ResourcePanelPageEnum.TEXT,
    component: <TextPanel />,
  },
  {
    icon: 'audio',
    label: 'Music',
    value: ResourcePanelPageEnum.MUSIC,
    component: <MusicPanel />,
  },
  {
    icon: 'transition',
    label: 'Transition',
    value: ResourcePanelPageEnum.TRANSITION,
    component: <TransitionPanel />,
  },
  {
    icon: 'upload-line',
    label: 'Dev',
    value: ResourcePanelPageEnum.DEV,
    component: <DevPanel />,
  },
]
