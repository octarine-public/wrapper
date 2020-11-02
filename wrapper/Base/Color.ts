export default class Color {
	public static get Black() { return new Color(0, 0, 0) }
	public static get Red() { return new Color(255, 0, 0) }
	public static get Green() { return new Color(0, 255, 0) }
	public static get Blue() { return new Color(0, 0, 255) }
	public static get RoyalBlue() { return new Color(78, 121, 248) }
	public static get Yellow() { return new Color(255, 255) }
	public static get Orange() { return new Color(255, 128) }
	public static get Fuchsia() { return new Color(255, 0, 255) }
	public static get Aqua() { return new Color(0, 255, 255) }
	public static get BlackGray() { return new Color(90, 90, 90) }
	public static get Gray() { return new Color(128, 128, 128) }
	public static get LightGray() { return new Color(190, 190, 190) }
	public static get White() { return new Color(255, 255, 255) }

	public static fromIOBuffer(buffer: boolean = true, offset: number = 0): Color | undefined {
		if (buffer !== true)
			return undefined
		return new Color(IOBuffer[offset + 0], IOBuffer[offset + 1])
	}
	public static CopyFrom(color: Color): Color {
		return new Color(color.r, color.g, color.b, color.a)
	}

	/**
	 * Create new Color with r, g, b, a
	 *
	 * @example
	 * var color = new Color(1, 2, 3)
	 */
	constructor(public r: number = 0, public g: number = 0, public b: number = 0, public a: number = 255) { }

	/**
	 * Set Color by numbers
	 */
	public SetColor(r: number = 0, g: number = 0, b: number = 0, a: number = 255): Color {
		this.r = r
		this.g = g
		this.b = b
		this.a = a
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
		return this.r === col.r && this.g === col.g && this.b === col.b && this.a === col.a
	}

	public Clone(): Color {
		return new Color(this.r, this.g, this.b, this.a)
	}

	/**
	 * Copy this color to another color and return it
	 * @param vec The another color
	 * @returns another color
	 */
	public CopyTo(color: Color): Color {
		color.r = this.r
		color.g = this.g
		color.b = this.b
		return color
	}

	/**
	 * Copy from another color to this color and return it
	 * @param vec The another color
	 * @returns this color
	 */
	public CopyFrom(color: Color): Color {
		this.r = color.r
		this.g = color.g
		this.b = color.b
		this.a = color.a
		return this
	}

	/**
	 * Color to String Color
	 * @return Color(r,g,b,a)
	 */
	public toString(): string {
		return "Color(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")"
	}

	/**
	 * @return [r, g, b, a]
	 */
	public toArray(): [number, number, number, number] {
		return [this.r, this.g, this.b, this.a]
	}
	public toJSON() {
		return this.toArray()
	}

	public toIOBuffer(offset: number = 0): true {
		IOBuffer[offset + 0] = this.r
		IOBuffer[offset + 1] = this.g
		IOBuffer[offset + 2] = this.b
		IOBuffer[offset + 3] = this.a
		return true
	}
}