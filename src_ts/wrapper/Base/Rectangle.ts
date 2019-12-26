import Vector2 from "./Vector2"

export default class Rectangle {

	constructor(public pos1: Vector2, public pos2: Vector2) {
		this.pos1 = pos1
		this.pos2 = pos2
	}

	public Contains(pos: Vector2): boolean {
		return this.pos1.x <= pos.x && this.pos1.y <= pos.y && this.pos2.x >= pos.x && this.pos2.y >= pos.y
	}
	public GetOffset(pos: Vector2): Vector2 {
		return pos.Subtract(this.pos1)
	}
	public Add(vec: Vector2): Rectangle {
		this.pos1.AddForThis(vec)
		this.pos2.AddForThis(vec)
		return this
	}
	public Subtract(vec: Vector2): Rectangle {
		this.pos1.Subtract(vec)
		this.pos2.Subtract(vec)
		return this
	}
	public SubtractX(num: number): Rectangle {
		this.pos1.SubtractScalarX(num)
		this.pos2.SubtractScalarX(num)
		return this
	}
	public SubtractY(num: number): Rectangle {
		this.pos1.SubtractScalarY(num)
		this.pos2.SubtractScalarY(num)
		return this
	}
}
