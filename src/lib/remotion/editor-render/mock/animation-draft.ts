import type { DraftDataType } from '../schema/draft'

export const animationDraft: DraftDataType = {
  name: 'test',
  background: '#000',
  meta: {
    width: 400,
    height: 200,
    fps: 30,
  },
  timeline: {
    assets: {
      test_image_1: {
        type: 'image',
        width: 200,
        height: 600,
        id: 'test_image_1',
        src: '/image/test1.jpg',
      },
      test_video_1: {
        type: 'video',
        width: 200,
        height: 600,
        id: 'test_video_1',
        src: '/video/test1.mp4',
        duration: 10,
      },
    },
    elements: {
      test_image_1: {
        type: 'image',
        id: 'test_image_1',
        assetId: 'test_image_1',
        start: 0,
        length: 4,
        width: 200,
        height: 100,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
        animation: {
          in: {
            name: 'fade-in',
            duration: 2,
          },
          loop: {
            name: 'imageSlideLeft-loop',
            duration: 0.35,
          },
          out: {
            name: 'fade-out',
            duration: 1,
          },
        },
      },
      test_video_1: {
        type: 'video',
        id: 'test_video_1',
        assetId: 'test_video_1',
        start: 0,
        length: 4,
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        rotate: 0,
      },
    },
    tracks: [
      {
        id: 'track-1',
        type: 'image-video',
        clips: [{ elementId: 'test_image_1' }],
      },
      {
        id: 'track-2',
        type: 'image-video',
        clips: [{ elementId: 'test_video_1' }],
      },
    ],
    fonts: [],
  },
}
