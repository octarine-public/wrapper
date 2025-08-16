Math.radianToDegrees = (radian: number): number => (radian * 180) / Math.PI

Math.degreesToRadian = (degrees: number): number => (degrees * Math.PI) / 180

Math.randomRange = (min: number, max: number, skew = 1): number =>
	Math.pow(Math.random(), skew) * (max - min) + min

Math.randomRangeGaussian = (min: number, max: number, skew = 1) => {
	let num = -1
	while (num > 1 || num < 0) {
		let u = 0,
			v = 0
		while (u === 0) {
			u = Math.random()
		}
		while (v === 0) {
			v = Math.random()
		}
		num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
		num = num / 10.0 + 0.5 // Translate to 0 -> 1
	}
	return Math.pow(num, skew) * (max - min) + min
}

Math.clamp = (value: number, min: number, max: number): number =>
	Math.min(Math.max(value, min), max)

Math.remapRange = (
	value: number,
	min: number,
	max: number,
	minResult: number,
	maxResult: number
): number =>
	min === max
		? minResult
		: minResult +
			(maxResult - minResult) * Math.clamp((value - min) / (max - min), 0, 1)

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
