/* eslint-disable prettier/prettier */
export class Color {
	// Player color | Index arr (TeamSlot)
	public static get PlayerColorDire(): Color[] {
		return [
			new Color(0xfe, 0x86, 0xc2),
			new Color(0xa1, 0xb4, 0x47),
			new Color(0x65, 0xd9, 0xf7),
			new Color(0x0, 0x83, 0x21),
			new Color(0xa4, 0x69, 0x0)
		]
	}

	// Player color | Index arr (TeamSlot)
	public static get PlayerColorRadiant(): Color[] {
		return [
			new Color(0x33, 0x75, 0xff),
			new Color(0x66, 0xff, 0xbf),
			new Color(0xbf, 0x0, 0xbf),
			new Color(0xf3, 0xf0, 0xb),
			new Color(0xff, 0x6b, 0x0)
		]
	}
	public static get Black() {
		return new Color(0, 0, 0)
	}
	public static get Red() {
		return new Color(255, 0, 0)
	}
	public static get Green() {
		return new Color(0, 255, 0)
	}
	public static get Blue() {
		return new Color(0, 0, 255)
	}
	public static get RoyalBlue() {
		return new Color(78, 121, 248)
	}
	public static get Yellow() {
		return new Color(255, 255)
	}
	public static get Orange() {
		return new Color(255, 128)
	}
	public static get Fuchsia() {
		return new Color(255, 0, 255)
	}
	public static get Aqua() {
		return new Color(0, 255, 255)
	}
	public static get BlackGray() {
		return new Color(90, 90, 90)
	}
	public static get Gray() {
		return new Color(128, 128, 128)
	}
	public static get LightGray() {
		return new Color(190, 190, 190)
	}
	public static get White() {
		return new Color(255, 255, 255)
	}
	// reverse toUint32
	public static fromUint32(num: number): Color {
		const a = num >> 24
		return new Color(
			(num >> 0x00) & 0xff,
			(num >> 0x08) & 0xff,
			(num >> 0x10) & 0xff,
			!num || a ? a : 0xff
		)
	}
	/**
	 * Create new Color with r, g, b, a
	 *
	 * @example
	 * let color = new Color(1, 2, 3)
	 */
	public data32 = -1

	constructor(r = 0, g = 0, b = 0, a = 255, u32: undefined | number = undefined) {
		this.data32 = u32 ?? (
			((0xff & r) << 0x00) |
			((0xff & g) << 0x08) |
			((0xff & b) << 0x10) |
			((0xff & a) << 0x18)
		)
	}

	public get r(): number { return 0xff & this.data32 >> 0x00 }
	public set r(v: number) { this.data32 = this.data32 & ~(0xff << 0x00) | v << 0x00 }
	public get g(): number { return 0xff & this.data32 >> 0x08 }
	public set g(v: number) { this.data32 = this.data32 & ~(0xff << 0x08) | v << 0x08 }
	public get b(): number { return 0xff & this.data32 >> 0x10 }
	public set b(v: number) { this.data32 = this.data32 & ~(0xff << 0x10) | v << 0x10 }
	public get a(): number { return 0xff & this.data32 >> 0x18 }
	public set a(v: number) { this.data32 = this.data32 & ~(0xff << 0x18) | v << 0x18 }

	public Set32(int32: number): Color {
		this.data32 = int32
		return this
	}

	/**
	 * Set Color by numbers
	 */
	public SetColor(r: number = 0, g: number = 0, b: number = 0, a: number = 255): Color {
		this.data32 =
			((0xff & r) << 0x00) |
			((0xff & g) << 0x08) |
			((0xff & b) << 0x10) |
			((0xff & a) << 0x18)
		return this
	}

	/**
	 * Set R of color by number
	 */
	public SetR(r: number): Color {
		this.r = r
		return this
	}

	/**
	 * Set G of color by number
	 */
	public SetG(g: number): Color {
		this.g = g
		return this
	}

	/**
	 * Set B of color by number
	 */
	public SetB(b: number): Color {
		this.b = b
		return this
	}

	/**
	 * Set A of color by number
	 */
	public SetA(a: number): Color {
		this.a = a
		return this
	}

	public Equals(col: Color): boolean {
		return this.data32 === col.data32
	}

	public Clone(): Color {
		return new Color(0, 0, 0, 0, this.data32)
	}

	/**
	 * Copy this color to another color and return it
	 *
	 * @param vec The another color
	 * @returns another color
	 */
	public CopyTo(color: Color): Color {
		color.data32 = this.data32
		return color
	}

	/**
	 * Copy from another color to this color and return it
	 *
	 * @param vec The another color
	 * @returns this color
	 */
	public CopyFrom(color: Color): Color {
		this.data32 = color.data32
		return this
	}

	/**
	 * @return [r, g, b, a]
	 */
	public toArray(): [number, number, number, number] {
		return [this.r, this.g, this.b, this.a]
	}
	public toUint32(): number {
		return this.data32
	}
	public toJSON() {
		return this.toArray()
	}
}
