Math.radianToDegrees = (radian: number): number => (radian * 180) / Math.PI

Math.degreesToRadian = (degrees: number): number => (degrees * Math.PI) / 180

Math.randomRange = (min: number, max: number): number => Math.random() * (max - min) + min

Math.clamp = (value: number, min: number, max: number): number =>
	Math.min(Math.max(value, min), max)

Math.remapRange = (
	value: number,
	min: number,
	max: number,
	minResult: number,
	maxResult: number
): number =>
	minResult + (maxResult - minResult) * Math.clamp((value - min) / (max - min), 0, 1)

Math.lerp = (start: number, end: number, amount: number): number =>
	(1 - amount) * start + amount * end

Math.smoothStep = (amount: number) => {
	if (amount <= 0) {
		return 0
	}
	if (amount >= 1) {
		return 1
	}
	return amount * amount * (3 - 2 * amount)
}
