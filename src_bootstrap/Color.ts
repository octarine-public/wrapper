/// internal declarations
/// you may use ONLY this ones & default V8 things
declare var global: any

/// actual code
global.Color = class Color {
	/* ================== Static ================== */
	static fromIOBuffer(buffer: boolean, offset: number = 0): Color {
		return buffer
			? new Color(
				IOBuffer[offset + 0], 
				IOBuffer[offset + 1], 
				IOBuffer[offset + 2], 
				IOBuffer[offset + 3])
			: new Color();
	}
	
	/* =================== Fields =================== */
	r: number
	g: number
	b: number
	a: number
	
	/* ================ Constructors ================ */
	/**
	 * Create new Color with r, g, b, a
	 *
	 * @example
	 * var color = new Color(1, 2, 3)
	 */
	constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 255) {
		this.SetColor(r, g, b, a);
	}
	
	/* ================== Getters ================== */
	

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

	toIOBuffer(offset: number = 0): void {
		IOBuffer[offset + 0] = this.r;
		IOBuffer[offset + 1] = this.g;
		IOBuffer[offset + 2] = this.b;
		IOBuffer[offset + 3] = this.a;
	}
}