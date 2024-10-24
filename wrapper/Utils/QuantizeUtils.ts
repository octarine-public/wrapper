export function QuantizePlaybackRate(f: number): number {
	return (7.9921875 / 1023) * Math.floor(f * 128 + 0.5)
}

export function QuantitizedVecCoordToCoord(
	cell: Nullable<number>,
	inside: Nullable<number>
): number {
	return ((cell ?? 0) - 128) * 128 + (inside ?? 0)
}
