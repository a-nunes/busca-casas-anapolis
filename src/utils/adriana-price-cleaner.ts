
export function adrianaPriceCleaner (data: string): number {
  const regex = /\d+\.?\d*,/gm
  if(data) {
    const info = data.match(regex)
    if(info) return Number(info[0].replace(".","").replace(",",""))
  }
  return 0
}