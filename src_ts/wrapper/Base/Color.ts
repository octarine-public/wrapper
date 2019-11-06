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
	public static readonly BlackGray = new Color(90, 90, 90);
	public static readonly Gray = new Color(128, 128, 128);
	public static readonly LightGray = new Color(190, 190, 190);
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
	public static CopyFrom(color: Color): Color {
		return new Color(color.r, color.g, color.b, color.a);
	}
	/* ================ Constructors ================ */
	/**
	 * Create new Color with r, g, b, a
	 *
	 * @example
	 * var color = new Color(1, 2, 3)
	 */
	constructor(public r: number = 0, public g: number = 0, public b: number = 0, public a: number = 255) { }

	/* ================== Methods ================== */
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
		return new Color(this.r, this.g, this.b, this.a);
	}

	/**
	 * Copy this color to another color and return it
	 * @param vec The another color
	 * @returns another color
	 */
	public CopyTo(color: Color): Color {
		color.r = this.r;
		color.g = this.g;
		color.b = this.b;
		return color
	}
	/**
	 * Copy from another color to this color and return it
	 * @param vec The another color
	 * @returns this color
	 */
	public CopyFrom(color: Color): Color {
		this.r = color.r;
		this.g = color.g;
		this.b = color.b;
		this.a = color.a;
		return this;
	}

	/* ================== To ================== */
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

	public toIOBuffer(offset: number = 0): true {
		IOBuffer[offset + 0] = this.r
		IOBuffer[offset + 1] = this.g
		IOBuffer[offset + 2] = this.b
		IOBuffer[offset + 3] = this.a
		return true
	}
}
global.Color = Color
