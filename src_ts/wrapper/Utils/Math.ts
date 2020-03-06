/**
 * x * 180 / PI
 */
export function RadianToDegrees(radian: number): number {
	return radian * 180 / Math.PI
}

/**
 * x * PI / 180
 */
export function DegreesToRadian(degrees: number): number {
	return degrees * Math.PI / 180
}
