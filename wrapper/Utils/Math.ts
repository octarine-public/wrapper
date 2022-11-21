/**
 * x * 180 / PI
 */
export function RadianToDegrees(radian: number): number {
	return (radian * 180) / Math.PI
}

/**
 * x * PI / 180
 */
export function DegreesToRadian(degrees: number): number {
	return (degrees * Math.PI) / 180
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param r The red color value
 * @param g The green color value
 * @param b The blue color value
 * @return The HSL representation
 */
export function RGBToHSL(
	r: number,
	g: number,
	b: number
): [number, number, number] {
	r /= 255
	g /= 255
	b /= 255

	const max = Math.max(r, g, b),
		min = Math.min(r, g, b)
	const l = (max + min) / 2
	let h: number, s: number

	if (max !== min) {
		const d = max - min
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			default:
				h = (r - g) / d + 4
				break
		}

		h /= 6
	} else h = s = 0 // achromatic

	return [h, s, l]
}

function HueToRGB(p: number, q: number, t: number): number {
	if (t < 0) t += 1
	if (t > 1) t -= 1
	if (t < 1 / 6) return p + (q - p) * 6 * t
	if (t < 1 / 2) return q
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
	return p
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param h The hue
 * @param s The saturation
 * @param l The lightness
 * @return The RGB representation
 */
export function HSLToRGB(
	h: number,
	s: number,
	l: number
): [number, number, number] {
	let r: number, g: number, b: number

	if (s !== 0) {
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s
		const p = 2 * l - q

		r = HueToRGB(p, q, h + 1 / 3)
		g = HueToRGB(p, q, h)
		b = HueToRGB(p, q, h - 1 / 3)
	} else r = g = b = l // achromatic

	return [r * 255, g * 255, b * 255]
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param r The red color value
 * @param g The green color value
 * @param b The blue color value
 * @return The HSV representation
 */
export function RGBToHSV(
	r: number,
	g: number,
	b: number
): [number, number, number] {
	r /= 255
	g /= 255
	b /= 255

	const max = Math.max(r, g, b),
		min = Math.min(r, g, b)
	const d = max - min,
		s = max === 0 ? 0 : d / max,
		v = max
	let h = 0 // achromatic
	if (max !== min) {
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0)
				break
			case g:
				h = (b - r) / d + 2
				break
			case b:
				h = (r - g) / d + 4
				break
		}

		h /= 6
	}

	return [h, s, v]
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param h The hue
 * @param s The saturation
 * @param v The value
 * @return The RGB representation
 */
export function HSVToRGB(
	h: number,
	s: number,
	v: number
): [number, number, number] {
	let r: number, g: number, b: number

	const i = Math.floor(h * 6),
		p = v * (1 - s)
	const f = h * 6 - i
	const q = v * (1 - f * s),
		t = v * (1 - (1 - f) * s)

	switch (i % 6) {
		case 0:
			r = v
			g = t
			b = p
			break
		case 1:
			r = q
			g = v
			b = p
			break
		case 2:
			r = p
			g = v
			b = t
			break
		case 3:
			r = p
			g = q
			b = v
			break
		case 4:
			r = t
			g = p
			b = v
			break
		default:
			r = v
			g = p
			b = q
			break
	}

	return [r * 255, g * 255, b * 255]
}
