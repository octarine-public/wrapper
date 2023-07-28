import { ParticleAttachment } from "../Enums/ParticleAttachment"
import { ParticlesSDK } from "../Managers/ParticleManager"
import { Entity } from "../Objects/Base/Entity"
import { GameState } from "../Utils/GameState"
import { tryFindFile } from "../Utils/readFile"
import { Color } from "./Color"
import { Vector2 } from "./Vector2"
import { Vector3 } from "./Vector3"

export type ControlPoint =
	| boolean
	| number
	| Entity
	| Vector3
	| Vector2
	| Color
	| number[]
export type ControlPointParam = [number, ControlPoint]

export class Particle {
	public IsValid = false
	public IsHidden = false
	public readonly ControlPoints = new Map<number, Vector3>()
	private EffectIndex = -1

	constructor(
		public readonly Parent: ParticlesSDK,
		public readonly Key: any,
		public readonly Path: string,
		public readonly Attachment: ParticleAttachment,
		// tslint:disable-next-line: no-shadowed-variable
		public readonly AttachedTo?: Entity | Vector3,
		...controlPoints: ControlPointParam[]
	) {
		this.Create(...controlPoints)
	}

	public SetControlPoint(id: number, param: ControlPoint): void {
		if (!this.IsValid && !this.IsHidden) return

		if (Array.isArray(param)) param = Vector3.fromArray(param)
		else if (param instanceof Entity) param = param.Position
		else if (param instanceof Vector2) param = Vector3.FromVector2(param)
		else if (param instanceof Color)
			param = new Vector3(param.r, param.g, param.b)
		else if (typeof param === "number") param = new Vector3(param, 0, 0)
		else if (typeof param === "boolean")
			param = new Vector3(param ? 1 : 0, 0, 0)
		else param = param.Clone()

		if (this.ControlPoints.get(id)?.Equals(param)) return
		this.ControlPoints.set(id, param)
		param.toIOBuffer()
		Particles.SetControlPoint(this.EffectIndex, id)
	}

	/**
	 * @param points rest params (index as number, point as Vector)
	 *
	 * @example
	 * particle.SetControlPoints(
	 * 	[1, new Vector3(1, 2, 3)],
	 * 	[2, new Vector2(1, 2, 3)],
	 * 	[3, new Color(1, 2, 3)],
	 * 	[4, false],
	 * 	[5, [1, 2]],
	 * 	[6, 646]
	 * )
	 */
	public SetControlPoints(...controlPoints: ControlPointParam[]): void {
		if (!this.IsValid && !this.IsHidden) return
		controlPoints.forEach(([id, param]) => this.SetControlPoint(id, param))
	}

	public SetInFogVisible(state = true) {
		Particles.SetInFogVisible(this.EffectIndex, state)
		return this
	}

	public Restart() {
		if (!this.IsValid && !this.IsHidden) return
		const save = [...this.ControlPoints.entries()]
		this.Destroy().Create(...save)
	}

	public Destroy(immediate = true) {
		if (this.IsValid) {
			Particles.Destroy(this.EffectIndex, immediate)
			this.EffectIndex = -1
			this.IsValid = false
		} else this.IsHidden = false
		if (!this.IsHidden) {
			this.ControlPoints.clear()
			this.Parent.AllParticles.delete(this.Key)
		}
		return this
	}

	public toJSON() {
		return {
			Key: this.Key,
			Path: this.Path,
			Attachment: this.Attachment,
			Entity: this.AttachedTo,
			ControlPoints: [...this.ControlPoints.entries()],
			EffectIndex: this.EffectIndex
		}
	}

	private Create(...controlPoints: ControlPointParam[]): this {
		if (this.IsValid) return this

		let path = this.Path
		if (!path.endsWith("_c")) path += "_c"
		path = tryFindFile(path, 2) ?? path
		path = path.substring(0, path.length - 2)
		if (!GameState.OBSBypassEnabled) {
			this.EffectIndex = Particles.Create(
				path,
				this.Attachment,
				this.AttachedTo?.IsValid
					? this.AttachedTo instanceof Entity
						? this.AttachedTo.Index
						: this.AttachedTo.Length
					: -1
			)
			this.IsValid = true
			this.SetInFogVisible()
			this.SetControlPoints(...controlPoints)
		} else this.IsHidden = true
		this.Parent.AllParticles.set(this.Key, this)

		return this
	}
}
