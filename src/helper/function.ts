export const alignment = (num: number): string => {
  if (num > 9) {
    return String(num)
  }
  return `0${num}`
}
