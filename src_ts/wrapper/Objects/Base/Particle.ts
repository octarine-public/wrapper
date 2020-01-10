import Entity from "./Entity"
import { Vector3, Vector2, Color } from "../../Imports"

export type ControlPoints = Array<boolean | number | Entity | Vector3 | Vector2 | Color | [number?, number?, number?]>

// from Native:
// 		Restart()
// 		FullRestart()

export default class Particle {

	ControlPoints: ControlPoints = [];

	IsValid = false

	private effectIndex: number = -1;

	constructor(
		public Name: string,
		public Path: string,
		public Attachment: ParticleAttachment_t,
		public Entity?: Entity,
		...points: ControlPoints) {

		this.ControlPoints = points

		this.Create()
	}

	public get EffectIndex(): number {
		return this.effectIndex
	}

	private Create(): this {
		if (this.IsValid)
			return this

		this.effectIndex = Particles.Create(this.Path,
			this.Attachment, this.Entity?.IsValid ? this.Entity.Index : -1)

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
			this.ControlPoints = points
		}

		for (let i = 0; i < this.ControlPoints.length; i += 2) {

			let index = this.ControlPoints[i] as number
			let point = this.ControlPoints[i + 1]

			if (typeof index !== "number") {
				throw new Error("Control Point Index is not number")
			}

			if (point instanceof Entity)
				point = point.Position

			else if (Array.isArray(point))
				point = Vector3.fromArray(point)

			else if (typeof point === "number" || typeof point === "boolean")
				point = new Vector3((point as number) + 0, 0, 0)

			point.toIOBuffer()

			Particles.SetControlPoint(this.EffectIndex, index)
		}
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



		return this
	}

}