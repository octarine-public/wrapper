import Entity from "../Objects/Base/Entity"
import ParticlesSDK from "../Managers/ParticleManager"
import Vector2 from "./Vector2"
import Vector3 from "./Vector3"
import Color from "./Color"

export type ControlPointParam = boolean | number | Entity | Vector3 | Vector2 | Color | [number?, number?, number?]

export default class Particle {
	public IsValid = false
	public readonly ControlPoints = new Map<number, Vector3>()
	private effectIndex = -1

	constructor(
		public readonly Key: any,
		public readonly Path: string,
		private attachment: ParticleAttachment_t,
		private entity?: Entity,
		controlPoints?: Map<number, ControlPointParam>,
	) {
		this.Create(controlPoints)
	}

	public get Attachment(): ParticleAttachment_t {
		return this.attachment
	}
	public get Entity(): Nullable<Entity> {
		return this.entity
	}

	public SetControlPoint(id: number, param: ControlPointParam): void {
		if (!this.IsValid)
			return

		if (param instanceof Entity)
			param = param.Position
		else if (param instanceof Array)
			param = Vector3.fromArray(param)
		else if (typeof param === "number" || typeof param === "boolean")
			param = new Vector3((param as number) + 0, 0, 0)
		else if (param instanceof Vector2)
			param = param.toVector3()
		else if (param instanceof Color)
			param = new Vector3(param.r, param.g, param.b)

		if (this.ControlPoints.get(id)?.Equals(param))
			return
		this.ControlPoints.set(id, param)
		param.toIOBuffer()
		Particles.SetControlPoint(this.effectIndex, id)
	}

	public SetControlPoints(controlPoints: Map<number, ControlPointParam>): void {
		// loop-optimizer: KEEP
		controlPoints.forEach((param, id) => this.SetControlPoint(id, param))
	}

	public Restart() {
		if (!this.IsValid)
			return

		let save = new Map(this.ControlPoints.entries())
		this.ControlPoints.clear()
		this.Destroy(true).Create(save)
	}

	public Destroy(immediate = true) {
		if (this.IsValid) {
			Particles.Destroy(this.effectIndex, immediate)
			this.effectIndex = -1
			this.IsValid = false
			ParticlesSDK.AllParticles.delete(this.Key)
		}
		return this
	}

	public toString(): string {
		return this.Path
	}
	// TODO: toJSON

	private Create(controlPoints?: Map<number, ControlPointParam>): this {
		if (this.IsValid)
			return this

		this.effectIndex = Particles.Create(
			this.Path,
			this.attachment,
			this.entity?.IsValid
				? this.entity.Index
				: -1
		)
		this.IsValid = true
		if (controlPoints !== undefined)
			this.SetControlPoints(controlPoints)
		ParticlesSDK.AllParticles.set(this.Key, this)

		return this
	}
}
