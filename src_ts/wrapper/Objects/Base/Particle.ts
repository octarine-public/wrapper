import Vector2 from "../../Base/Vector2"
import Vector3 from "../../Base/Vector3"
import Color from "../../Base/Color"
import Entity from "./Entity"
import ParticlesSDK from "../../Managers/ParticleManager"

export type ControlPoint = boolean | number | Entity | Vector3 | Vector2 | Color | [number?, number?, number?]

export type ControlPointsType = [number, ControlPoint]

export default class Particle {
	/* ================ Fields ================ */

	public IsValid = false

	private particleManager: ParticlesSDK | undefined
	private key: any
	private path: string
	private attachment: ParticleAttachment_t
	private entity: Nullable<Entity>
	private controlPoints: ControlPointsType[] = []
	private constolPointsAsMap = new Map<number, Vector3>()
	private effectIndex = -1

	/* ================ Constructor ================ */

	/**
	 * @param particleManager Particle Manager. Adding or removing particle entity in that Manager
	 * @param key Key of particle. Can be any type
	 * @param path Path to Particle
	 * @param attachment Particle attachment as ParticleAttachment_t
	 * @param entity Particle that attached to entity
	 * @param points rest of params. 
	 */
	constructor(
		particleManager: ParticlesSDK | undefined,
		key: any,
		path: string,
		attachment: ParticleAttachment_t,
		entity?: Entity,
		...points: ControlPointsType[]) {

		this.particleManager = particleManager
		this.key = key
		this.path = path
		this.attachment = attachment
		this.entity = entity

		this.controlPoints = points

		this.Create()
	}

	public get Key(): any {
		return this.key
	}
	public get Path(): string {
		return this.path
	}
	public get Attachment(): ParticleAttachment_t {
		return this.attachment
	}
	public get Entity(): Nullable<Entity> {
		return this.entity
	}
	public get ControlPoints(): ControlPointsType[] {
		return this.controlPoints
	}
	/**
	 * Set ControlPoints as array
	 * 
	 * @example
	 *
	 * particle.ControlPoints = [
	 * 	[1, new Vector3(1, 2, 3)],
	 * 	[2, new Vector2(1, 2, 3)],
	 * 	[3, new Color(1, 2, 3)],
	 * 	[4, false],
	 * 	[5, [1, 2]],
	 * 	[6, 646]
	 * ]
	 */
	public set ControlPoints(points: ControlPointsType[]) {
		this.SetControlPoints(...points)
	}
	public get EffectIndex(): number {
		return this.effectIndex
	}

	public SetControlPoint(id: number, point: ControlPoint) {
		if (!this.IsValid)
			return

		if (point instanceof Entity)
			point = point.Position
		else if (Array.isArray(point))
			point = Vector3.fromArray(point)
		else if (typeof point === "number" || typeof point === "boolean")
			point = new Vector3((point as number) + 0, 0, 0)
		else if (point instanceof Vector2)
			point = point.toVector3()
		else if (point instanceof Color)
			point = new Vector3(point.r, point.g, point.b)

		if (this.constolPointsAsMap.get(id)?.Equals(point))
			return

		this.constolPointsAsMap.set(id, point)

		point.toIOBuffer()
		Particles.SetControlPoint(this.effectIndex, id)
	}

	/**
	 * @param points rest params (index as number, point as Vector)
	 *
	 * @example
	 *
	 * particle.SetControlPoints(
	 * 	[1, new Vector3(1, 2, 3)],
	 * 	[2, new Vector2(1, 2, 3)],
	 * 	[3, new Color(1, 2, 3)],
	 * 	[4, false],
	 * 	[5, [1, 2]],
	 * 	[6, 646]
	 * )
	 */
	public SetControlPoints(...points: ControlPointsType[]) {
		if (!this.IsValid)
			return

		this.controlPoints = points
		points.forEach(([id, point]) => this.SetControlPoint(id, point))
	}

	public Restart() {
		if (!this.IsValid)
			return

		this.Destroy().Create()
	}

	/**
	 * 
	 * @param particleManager removing from all particles in manager
	 */
	public Destroy(immediate = true) {
		if (!this.IsValid)
			return this

		Particles.Destroy(this.effectIndex, immediate)
		this.effectIndex = -1
		this.IsValid = false
		this.constolPointsAsMap.clear()

		this.particleManager?.AllParticles.delete(this.key)

		return this
	}

	public toString() {
		return this.Path.replace(/^.*(\\|\/|\:)/, "")
	}

	public toJSON() {
		return {
			Key: this.key,
			Path: this.path,
			Attachment: this.attachment,
			Entity: this.entity,
			ControlPoints: this.controlPoints,
			EffectIndex: this.effectIndex
		}
	}

	private Create(...newControlPoints: ControlPointsType[]): this {
		if (this.IsValid)
			return this

		if (newControlPoints.length === 0)
			newControlPoints = this.controlPoints

		this.effectIndex = Particles.Create(
			this.Path,
			this.attachment,
			this.entity?.IsValid
				? this.entity.Index
				: -1
		)
		this.IsValid = true
		this.SetControlPoints(...newControlPoints)

		this.particleManager?.AllParticles.set(this.key, this)

		return this
	}
}
