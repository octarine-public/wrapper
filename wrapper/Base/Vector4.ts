export class Vector4 {
	public static fromArray(array: ArrayLike<number>): Vector4 {
		return new Vector4(array[0] ?? 0, array[1] ?? 0, array[2] ?? 0, array[3] ?? 0)
	}

	/**
	 * Create new Vector4 with x, y, z, w
	 *
	 * @example
	 * let vec = new Vector4(1, 2, 3, 4)
	 * vec.Normalize()
	 */
	constructor(
		public x: number,
		public y: number,
		public z: number,
		public w: number
	) {}
}
