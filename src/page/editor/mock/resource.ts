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

/**
 * 
 * @returns {
    text: 'Body Text',
    commonStyle: {
      fontWeight: 500,
    },
    displayStyle: {
      fontSize: 16,
    },
    elementStyle: {
      fontSize: 16 * 5,
    },
  },
  {
    text: 'Description',
    commonStyle: {
      fontWeight: 400,
    },
    displayStyle: {
      fontSize: 16,
    },
    elementStyle: {
      fontSize: 16 * 4,
    },
  },
 */
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
