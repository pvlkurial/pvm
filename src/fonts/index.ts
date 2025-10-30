import localFont from 'next/font/local'

export const myCustomFont = localFont({
  src: [
    {
      path: './Ruigslay.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-my-custom'
})

export const HeatherGreen = localFont({
  src: [
    {
      path: './Heathergreen.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-heathergreen',
})