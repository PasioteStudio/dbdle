import { Metadata } from "next"

export const metadata:Metadata = {
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.png',
  },
  title:"DBDle",
  description: 'Guess in multiple categories of the Dead by Daylight game',
  openGraph: {
    title: 'DBDle',
    description: 'Guess in multiple categories of the Dead by Daylight game',
    url: 'https://dbdle.pasiotestudio.hu',
    siteName: 'DBDle',
    images: [
      {
        url: 'https://dbdle.pasiotestudio.hu/imgs/logos/og_image.png',
        width: 1919,
        height: 1079,
        alt: 'Deady by Daylight themed daily guessing game',
      },
      {
        url: 'https://dbdle.pasiotestudio.hu/imgs/logos/og_image_1600x1200.png',
        width: 1600,
        height: 1200,
        alt: 'Deady by Daylight themed daily guessing game',
      },
      {
        url: 'https://dbdle.pasiotestudio.hu/imgs/logos/og_image_800x600.png',
        width: 800,
        height: 600,
        alt: 'Deady by Daylight themed daily guessing game',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Welcome | DBDle',
    description: 'Guess in multiple categories of the Dead by Daylight game',
    images: ['https://dbdle.pasiotestudio.hu/imgs/logos/og_image.png'],
  },
  keywords: ['dead, daylight',' daily','guessing','Dead by Daylight', 'dbd', 'daily', 'dbdle', 'guessing', 'dbdle net','welcome','perk','killer','quote','splash'],
  category: 'games',
  authors: [{ name: 'Attila Pápa', url: 'https://www.pasiotestudio.hu' }],
  creator: 'Attila Pápa',
  publisher: 'Attila Pápa',

}

export const metadataTemplate:Metadata = metadata

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return children
}
