export function QuantizePlaybackRate(f: number): number {
	return (7.9921875 / 1023) * Math.floor(f * 128 + 0.5)
}
