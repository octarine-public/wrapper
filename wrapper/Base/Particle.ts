import { ParticleAttachment } from "../Enums/ParticleAttachment"
import { ParticlesSDK } from "../Managers/ParticleManager"
import { Entity } from "../Objects/Base/Entity"
import { tryFindFile } from "../Utils/readFile"
import { Color } from "./Color"
import { Vector2 } from "./Vector2"
import { Vector3 } from "./Vector3"

export type ControlPointParam = [number, ControlPoint]
export type ControlPoint =
	| boolean
	| number
	| Entity
	| Vector3
	| Vector2
	| Color
	| number[]

export class Particle {
	public IsValid = false
	public IsHidden = false
	public readonly ControlPoints = new Map<number, Vector3>()
	private EffectIndex = -1
	private Generation = 0
	private IsCreating = false
	private InFogVisible = true

	constructor(
		public readonly Parent: ParticlesSDK,
		public readonly Key: any,
		public readonly Path: string,
		public readonly Attachment: ParticleAttachment,
		public readonly AttachedTo: Entity,
		...controlPoints: ControlPointParam[]
	) {
		this.Create(...controlPoints)
	}

	public SetControlPoint(id: number, param: ControlPoint): void {
		if (!this.IsValid && !this.IsCreating && !this.IsHidden) {
			return
		}

		if (Array.isArray(param)) {
			param = Vector3.fromArray(param)
		} else if (param instanceof Entity) {
			param = param.Position
		} else if (param instanceof Vector2) {
			param = Vector3.FromVector2(param)
		} else if (param instanceof Color) {
			param = new Vector3(param.r, param.g, param.b)
		} else if (typeof param === "number") {
			param = new Vector3(param, 0, 0)
		} else if (typeof param === "boolean") {
			param = new Vector3(param ? 1 : 0, 0, 0)
		} else {
			param = param.Clone()
		}

		if (this.ControlPoints.get(id)?.Equals(param)) {
			return
		}
		this.ControlPoints.set(id, param)
		if (this.EffectIndex === -1) {
			return
		}
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
		if (!this.IsValid && !this.IsCreating && !this.IsHidden) {
			return
		}
		for (let i = controlPoints.length - 1; i > -1; i--) {
			const [id, param] = controlPoints[i]
			this.SetControlPoint(id, param)
		}
	}

	public SetInFogVisible(state = true) {
		this.InFogVisible = state
		if (this.EffectIndex !== -1) {
			Particles.SetInFogVisible(this.EffectIndex, state)
		}
		return this
	}

	public Restart() {
		if (!this.IsValid && !this.IsCreating && !this.IsHidden) {
			return
		}
		const save = [...this.ControlPoints.entries()]
		this.Destroy().Create(...save)
	}

	public Destroy(immediate = true) {
		this.Generation++
		this.IsCreating = false
		if (this.IsValid) {
			Particles.Destroy(this.EffectIndex, immediate)
			this.EffectIndex = -1
			this.IsValid = false
		} else {
			this.IsHidden = false
		}
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
		if (this.IsValid || this.IsCreating) {
			return this
		}
		let path = this.Path
		if (!path.endsWith("_c")) {
			path += "_c"
		}
		path = tryFindFile(path, 2) ?? path
		path = path.substring(0, path.length - 2)

		const generation = ++this.Generation
		this.IsCreating = true
		this.SetControlPoints(...controlPoints)
		this.Parent.AllParticles.set(this.Key, this)

		Particles.Create(path, this.Attachment, this.AttachedTo.Index)
			.then(effectIndex => {
				if (generation !== this.Generation) {
					Particles.Destroy(effectIndex, true)
					return
				}
				this.IsCreating = false
				this.EffectIndex = effectIndex
				this.IsValid = true
				this.SetInFogVisible(this.InFogVisible)
				this.FlushControlPoints()
			})
			.catch(err => {
				if (generation === this.Generation) {
					this.IsCreating = false
					this.Parent.AllParticles.delete(this.Key)
				}
				console.error(err)
			})
		return this
	}

	private FlushControlPoints(): void {
		this.ControlPoints.forEach((param, id) => {
			param.toIOBuffer()
			Particles.SetControlPoint(this.EffectIndex, id)
		})
	}
}
