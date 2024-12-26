export function hexToRgb(hex: string): { r: number; g: number; b: number } {
    hex = hex.startsWith('0x') ? hex.replace('0x', '#') : hex
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
        ? {
              r: parseInt(result[1], 16),
              g: parseInt(result[2], 16),
              b: parseInt(result[3], 16)
          }
        : null
}

export function euclideanDistance(
    rgb1: { r: number; g: number; b: number },
    rgb2: {
        r: number
        g: number
        b: number
    }
): number {
    return Math.sqrt(Math.pow(rgb1.r - rgb2.r, 2) + Math.pow(rgb1.g - rgb2.g, 2) + Math.pow(rgb1.b - rgb2.b, 2))
}

export function normalizeDistance(distance: number): number {
    return 1 - distance / Math.sqrt(Math.pow(255, 2) * 3)
}
