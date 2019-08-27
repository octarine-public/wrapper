export default class Color {
	public static readonly Black = new Color(0, 0, 0)
	public static readonly Red = new Color(255)
	public static readonly Green = new Color(0, 255)
	public static readonly Blue = new Color(0, 0, 255)
	public static readonly RoyalBlue = new Color(78, 121, 248)
	public static readonly Yellow = new Color(255, 255)
	public static readonly Orange = new Color(255, 128)
	public static readonly Fuchsia = new Color(255, 0, 255)
	public static readonly Aqua = new Color(0, 255, 255)
	public static readonly White = new Color(255, 255, 255)

	/* ================== Static ================== */
	public static fromIOBuffer(bufferOrOffset?: boolean | number, offset: number = 0): Color {
		if (bufferOrOffset === undefined)
			return new Color(IOBuffer[0], IOBuffer[1], IOBuffer[2], IOBuffer[3])

		if (typeof bufferOrOffset === "boolean") {
			if (!bufferOrOffset)
				return new Color()

			bufferOrOffset = offset
		}

		return new Color(IOBuffer[bufferOrOffset + 0], IOBuffer[bufferOrOffset + 1], IOBuffer[bufferOrOffset + 2], IOBuffer[bufferOrOffset + 3])
	}

	/* ================ Constructors ================ */
	/**
	 * Create new Color with r, g, b, a
	 *
	 * @example
	 * var color = new Color(1, 2, 3)
	 */
	constructor(public r: number = 0, public g: number = 0, public b: number = 0, public a: number = 255) {}

	/* ================== Methods ================== */
	/**
	 * Set Color by numbers
	 */
	SetColor(r: number = 0, g: number = 0, b: number = 0, a: number = 255): Color {
		this.r = r
		this.g = g
		this.b = b
		this.a = a
		return this
	}
	/**
	 * Set R of color by number
	 */
	SetR(r: number): Color {
		this.r = r
		return this
	}
	/**
	 * Set G of color by number
	 */
	SetG(g: number ): Color {
		this.g = g
		return this
	}
	/**
	 * Set B of color by number
	 */
	SetB(b: number): Color {
		this.b = b
		return this
	}
	/**
	 * Set A of color by number
	 */
	SetA(a: number): Color {
		this.a = a
		return this
	}

	Equals(col: Color): boolean {
		return this.r === col.r && this.g === col.g && this.b === col.b && this.a === col.a
	}

	/* ================== To ================== */
	/**
	 * Color to String Color
	 * @return Color(r,g,b,a)
	 */
	toString(): string {
		return "Color(" + this.r + "," + this.g + "," + this.b + "," + this.a + ")"
	}
	/**
	 * @return [r, g, b, a]
	 */
	toArray(): [number, number, number, number] {
		return [this.r, this.g, this.b, this.a]
	}

	toIOBuffer(offset: number = 0): true {
		IOBuffer[offset + 0] = this.r
		IOBuffer[offset + 1] = this.g
		IOBuffer[offset + 2] = this.b
		IOBuffer[offset + 3] = this.a
		return true
	}
}
global.Color = Color
