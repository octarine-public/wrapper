import Entity from "./Entity"
import { Vector3, Vector2, Color } from "../../Imports"
import ParticlesSDK from "../../Managers/ParticleManager"

export type ControlPoints = Array<boolean | number | Entity | Vector3 | Vector2 | Color | [number?, number?, number?]>

// from Native:
// 		Restart()
// 		FullRestart()

export default class Particle {

	/* ================== Static ================== */

	static GetHashCodeControlPoints(...controlPoints: ControlPoints): number {

		let hash = 0

		controlPoints.forEach(value => {

			if (value instanceof Entity)
				value = value.Position

			if (value instanceof Vector2 || value instanceof Vector3 || value instanceof Color) {
				hash += value.GetHashCode()

			} else if (Array.isArray(value)) {
				var hashArray = 0

				for (var length = value.length, i = (length >= 8 ? length - 8 : 0); i < length; i++) {
					hashArray = ((hashArray << 5) + hashArray) ^ (value[i] ?? 0)
				}

				hash += hashArray
			}
			else {
				hash += (value as number) + 0
			}
		})

		return hash
	}

	/* ================ Fields ================ */

	public IsValid = false

	private key: any
	private path: string
	private attachment: ParticleAttachment_t
	private entity: Nullable<Entity>
	private controlPoints: ControlPoints = [];

	private effectIndex = -1;
	private controlPointsHashCode = -1;

	/* ================ Constructor ================ */

	constructor(
		key: any,
		path: string,
		attachment: ParticleAttachment_t,
		entity?: Entity,
		...points: ControlPoints) {

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
	public get ControlPoints(): ControlPoints {
		return this.controlPoints
	}
	public set ControlPoints(value: ControlPoints) {
		this.SetControlPoints(...value)
	}

	public get EffectIndex(): number {
		return this.effectIndex
	}
	public get GetHashCodeControlPoints(): number {
		return this.controlPointsHashCode
	}

	private Create(): this {
		if (this.IsValid)
			return this

		this.effectIndex = Particles.Create(this.Path,
			this.attachment, this.entity?.IsValid ? this.entity.Index : -1)

		this.IsValid = true

		this.SetControlPoints()

		return this
	}

	/**
	 * @param points (indes as number, point as Vector)
	 * 
	 * @example
	 * 
	 * particle.SetControlPoints(
	 * 	1, new Vector3(1, 2, 3),
	 * 	2, new Vector2(1, 2, 3),
	 * 	3, new Color(1, 2, 3), 
	 * 	4, false, 
	 * 	5, [1, 2], 
	 * 	6, 646
	 * )
	 */
	public SetControlPoints(...points: ControlPoints) {
		if (!this.IsValid)
			return

		if (points.length > 0) {
			this.controlPoints = points
		}

		for (let i = 0; i < this.controlPoints.length; i += 2) {

			let index = this.controlPoints[i] as number
			let point = this.controlPoints[i + 1]

			if (typeof index !== "number") {
				throw new Error("Control Point Index is not a number")
			}

			if (point instanceof Entity)
				point = point.Position

			else if (Array.isArray(point))
				point = Vector3.fromArray(point)

			else if (typeof point === "number" || typeof point === "boolean")
				point = new Vector3((point as number) + 0, 0, 0)

			point.toIOBuffer()

			Particles.SetControlPoint(this.effectIndex, index)
		}

		this.controlPointsHashCode = Particle.GetHashCodeControlPoints(...this.controlPoints)
	}

	public Restart() {
		if (!this.IsValid)
			return

		this.Destroy(true)
			.Create()
	}

	public Destroy(particleDestroy?: boolean, immediate = true) {
		if (!this.IsValid)
			return this

		if (particleDestroy) {
			Particles.Destroy(this.effectIndex, immediate)
			this.effectIndex = -1
		}

		this.IsValid = false

		ParticlesSDK.Remove(this.key)

		return this
	}

	public toString() {
		return this.Path.replace(/^.*(\\|\/|\:)/, "")
	}
}
