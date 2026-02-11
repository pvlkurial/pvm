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
      path: './casko.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-heathergreen',
})

export const Casko = localFont({
  src: [
    {
      path: './casko.otf',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-casko',
})