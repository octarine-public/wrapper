import { WorldPolygon } from "../Geometry/WorldPolygon"
import ParticlesSDK from "../Managers/ParticleManager"
import { GetPositionHeight } from "../Native/WASM"
import Entity from "../Objects/Base/Entity"
import Color from "./Color"
import Vector2 from "./Vector2"
import Vector3 from "./Vector3"

export default class Rectangle {
	constructor(public pos1 = new Vector2(), public pos2 = new Vector2()) {
		this.pos1 = pos1
		this.pos2 = pos2
	}

	public get x(): number {
		return this.pos1.x
	}
	public set x(val: number) {
		const diff = val - this.pos1.x
		this.pos1.x += diff
		this.pos2.x += diff
	}
	public get y(): number {
		return this.pos1.y
	}
	public set y(val: number) {
		const diff = val - this.pos1.y
		this.pos1.y += diff
		this.pos2.y += diff
	}
	public get Size(): Vector2 {
		return this.pos2.Subtract(this.pos1)
	}
	public get Width(): number {
		return this.pos2.x - this.x
	}
	public set Width(val: number) {
		this.pos2.x = this.pos1.x + val
	}
	public get Height(): number {
		return this.pos2.y - this.y
	}
	public set Height(val: number) {
		this.pos2.y = this.pos1.y + val
	}
	public get Left(): number {
		return this.x
	}
	public get Right(): number {
		return this.x + this.Width
	}
	public get Top(): number {
		return this.y
	}
	public get Bottom(): number {
		return this.y + this.Height
	}
	public get Center(): Vector2 {
		return new Vector2(
			this.pos1.x + (this.Width / 2),
			this.pos1.y + (this.Height / 2),
		)
	}
	public get Polygon(): WorldPolygon {
		const pos1 = this.pos1,
			pos2 = new Vector2(this.pos1.x, this.pos2.y),
			pos3 = this.pos2,
			pos4 = new Vector2(this.pos2.x, this.pos1.y)
		return new WorldPolygon(
			Vector3.FromVector2(pos1).SetZ(GetPositionHeight(pos1)),
			Vector3.FromVector2(pos2).SetZ(GetPositionHeight(pos2)),
			Vector3.FromVector2(pos3).SetZ(GetPositionHeight(pos3)),
			Vector3.FromVector2(pos4).SetZ(GetPositionHeight(pos4)),
		)
	}
	public Contains(pos: Vector2): boolean {
		return this.pos1.x <= pos.x && this.pos1.y <= pos.y && this.pos2.x > pos.x && this.pos2.y > pos.y
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
	public Clone(): Rectangle {
		return new Rectangle(
			this.pos1.Clone(),
			this.pos2.Clone(),
		)
	}
	public Draw(key: string, ent: Entity, ParticleManager: ParticlesSDK, color: Color, width = 10, mode2D = 10): void {
		this.Polygon.Draw(key, ent, ParticleManager, color, width, mode2D)
	}
	public Destroy(key: string, ParticleManager: ParticlesSDK): void {
		this.Polygon.Destroy(key, ParticleManager)
	}
}
