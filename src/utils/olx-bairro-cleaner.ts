
export function olxCleaner (data: string): string {
  const regex = /(?<=Bairro).*/gm
  if(data) {
    const info = data.match(regex)
    if(info) return info[0]
  }
  return ''
}