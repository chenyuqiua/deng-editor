export const getAssetsList = () => {
  return [
    {
      id: 1,
      name: 'Asset 1',
      type: 'image' as const,
      url: '/image/test1.jpg',
    },
    {
      id: 2,
      name: 'Asset 2',
      type: 'image' as const,
      url: '/image/test2.jpg',
    },
    {
      id: 3,
      name: 'Asset 3',
      type: 'image' as const,
      url: '/image/test3.jpg',
    },
    {
      id: 4,
      name: 'Asset 4',
      type: 'video' as const,
      url: '/video/test1.mp4',
    },
    {
      id: 5,
      name: 'Asset 5',
      type: 'video' as const,
      url: '/video/test2.mp4',
    },
    {
      id: 6,
      name: 'Asset 6',
      type: 'video' as const,
      url: '/video/test3.mp4',
    },
    {
      id: 7,
      name: 'Asset 7',
      type: 'video' as const,
      url: '/video/test4.mp4',
    },
    {
      id: 8,
      name: 'Asset 8',
      type: 'video' as const,
      url: '/video/test5.mp4',
    },
    {
      id: 9,
      name: 'Asset 9',
      type: 'video' as const,
      url: '/video/test6.mp4',
    },
  ]
}

export const getTextList = () => {
  return [
    {
      id: 'Headline',
      name: 'Headline',
      styles: {
        common: {
          fontWeight: 700,
        },
        display: {
          fontSize: 24,
        },
        element: {
          fontSize: 24 * 6,
        },
      },
    },
    {
      id: 'Subtitle',
      name: 'Subtitle',
      styles: {
        common: {
          fontWeight: 600,
        },
        display: {
          fontSize: 18,
        },
        element: {
          fontSize: 18 * 6,
        },
      },
    },
    {
      id: 'Body Text',
      name: 'Body Text',
      styles: {
        common: {
          fontWeight: 500,
        },
        display: {
          fontSize: 16,
        },
        element: {
          fontSize: 16 * 5,
        },
      },
    },
    {
      id: 'Description',
      name: 'Description',
      styles: {
        common: {
          fontWeight: 400,
        },
        display: {
          fontSize: 16,
        },
        element: {
          fontSize: 16 * 4,
        },
      },
    },
  ]
}

export const getMusicList = () => {
  return [
    {
      id: 'music1',
      name: 'Music 1',
      url: '/audio/audio1.mp3',
      cover: '/image/audio-cover/audio-cover1.jpg',
    },
    {
      id: 'music2',
      name: 'Music 2',
      url: '/audio/audio2.mp3',
      cover: '/image/audio-cover/audio-cover2.jpg',
    },
    {
      id: 'music3',
      name: 'Music 3',
      url: '/audio/audio3.mp3',
      cover: '/image/audio-cover/audio-cover3.jpg',
    },
    {
      id: 'music4',
      name: 'Music 4',
      url: '/audio/audio4.mp3',
      cover: '/image/audio-cover/audio-cover4.jpg',
    },
    {
      id: 'music5',
      name: 'Music 5',
      url: '/audio/audio5.mp3',
      cover: '/image/audio-cover/audio-cover5.jpg',
    },
  ]
}

export const getTransitionList = () => {
  return [
    {
      id: 'transition1',
      name: 'slide',
      cover: '/transition/slide-left-preview.jpg',
      url: '/transition/slide-left.mp4',
    },
    // {
    //   id: 'transition2',
    //   name: 'Transition 2',
    //   cover: '/transition/slide-right-preview.png',
    //   url: '/transition/slide-right.mp4',
    // },
  ]
}
