import Image from 'next/image'
import { Chess } from 'chess.js'

async function getData() {
  const response = await fetch('https://api.chess.com/pub/player/GingerDawng/games/2023/09/pgn', {
    headers: {
      'Content-Type':'application/x-chess-pgn',
      'Content-Disposition': 'attachment; filename="ChessCom_erik_200910.pgn"' 
    }
  });
  console.log('PRINT;)', response)
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('Body is bad')
  }
  let chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      // Do something with last chunk of data then exit reader
      console.log('FINAL CHUNKS', chunks)
      const allPgn = Buffer.concat(chunks).toString('utf8')
      console.log('ALLPGN', allPgn)
      const chessa = new Chess()
      const chessb = new Chess()
      const splittedPgn = allPgn.split(/\n\s*\n/)
      console.log('EVENTSPLIT', splittedPgn)
      // const sortedPgns = splittedPgn.sort((a,b)=>{
      //   chessa.loadPgn(a)
      //   chessb.loadPgn(b)
      //   return chessa.header().UTCDate.replaceAll() - chessb.header().UTCDate
      // })
      splittedPgn.forEach(game => {
        chessa.loadPgn(game)
        const ascii = chessa.ascii()
        console.log(chessa.header())
        console.log(ascii) 
      })
     
      return allPgn
    }
    chunks.push(Buffer.from(value));
  }
}

export default async function Home() {
  const data = await getData()
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {data}
    </main>
  )
}
