import Vector3 from "../Base/Vector3"
import Color from "../Base/Color"
import Entity from "../Objects/Base/Entity"
import Particle, { ControlPointParam, ControlPoint } from "../Base/Particle"
import { tryFindFile } from "../Utils/readFile"

const git_path = "gitlab.com/FNT_Rework/wrapper/scripts_files"
const ParticleRangePath = (name: string) => `${git_path}/particles/range_display/range_display_${name.toLowerCase()}.vpcf`
const ParticleLinePath = (name: string) => `${git_path}/particles/range_line/${name.toLowerCase()}.vpcf`
const ParticleTargetPath = () => `${git_path}/particles/target/range_finder_tower_aoe.vpcf`

const RenderPath = (render: PARTICLE_RENDER) =>
	(PARTICLE_RENDER[render] ?? PARTICLE_RENDER_NAME.NORMAL).toLowerCase()
const RangeRenderPath = (render = PARTICLE_RENDER.NORMAL) =>
	ParticleRangePath(RenderPath(render))
const BoundingAreaRenderPath = (render = PARTICLE_RENDER.NORMAL) =>
	ParticleLinePath("bounding_area_view_" + RenderPath(render))

export enum PARTICLE_RENDER_NAME {
	NORMAL = "Normal",
	ROPE = "Rope",
	ANIMATION = "Animation"
}

export enum PARTICLE_RENDER {
	NORMAL = 0,
	ROPE,
	ANIMATION
}

export interface IDrawCircleOptions {
	Attachment?: ParticleAttachment_t,
	/**
	 * from 0 to 2
	 */
	RenderStyle?: PARTICLE_RENDER,
	Position?: Entity | Vector3,
	Color?: Color,
	Width?: number,
	Alpha?: number
}

export interface IDrawLineOptions {
	Attachment?: ParticleAttachment_t,
	Position?: Entity | Vector3,
	Color?: Color,
	Width?: number,
	Alpha?: number
}

export interface IDrawBoundingAreaOptions {
	/**
	 * from 0 to 1
	 */
	Render?: number,
	Color?: Color,
	Width?: number,
	Alpha?: number
}

class ParticlesSDK {
	/**
	 * @deprecated Will be removed after changed all scripts
	 */
	public static Create(path: string, attach: ParticleAttachment_t, ent?: Entity): number {
		let real_path = tryFindFile(path, 1)
		if (real_path === undefined)
			real_path = "particles/error/error.vpcf"
		return Particles.Create(real_path, attach, ent?.IsValid ? ent.Index : -1)
	}
	/**
	 * @deprecated Will be removed after changed all scripts
	 */
	public static Destroy(particle_id: number, immediate: boolean = true): void {
		Particles.Destroy(particle_id, immediate)
	}
	/**
	 * @deprecated Will be removed after changed all scripts
	 */
	public static SetControlPoint(particle_id: number, control_point: number, vec: Vector3): void {
		vec.toIOBuffer()
		Particles.SetControlPoint(particle_id, control_point)
	}
	/**
	 * @deprecated Will be removed after changed all scripts
	 */
	public static SetControlPointForward(particle_id: number, control_point: number, vec: Vector3): void {
		vec.toIOBuffer()
		Particles.SetControlPointForward(particle_id, control_point)
	}

	public readonly AllParticles = new Map<any, Particle>()
	private readonly AllParticlesRange = new Map<Particle, number>()

	public AddOrUpdate(
		key: any,
		path: string,
		attachment: ParticleAttachment_t,
		entity: Nullable<Entity> | Vector3,
		...points: ControlPointParam[]
	): Particle {
		let particle = this.AllParticles.get(key)

		if (
			particle === undefined
			|| particle.Entity !== entity
			|| particle.Path !== path
			|| particle.Attachment !== attachment
		) {
			if (particle !== undefined)
				particle.Destroy(true)

			particle = new Particle(this, key, path, attachment, entity instanceof Entity ? entity : entity, ...points)

			this.AllParticles.set(key, particle)
		} else if (points !== undefined)
			particle.SetControlPoints(...points)

		return particle
	}

	public DrawCircle(
		key: any,
		entity: Entity,
		range: number = 100,
		options: IDrawCircleOptions = {}
	) {
		this.CheckChangedRange(key, range)

		return this.AddOrUpdate(key,
			RangeRenderPath(options.RenderStyle),
			options.Attachment ?? ParticleAttachment_t.PATTACH_ABSORIGIN,
			entity,
			[0, options.Position ?? entity],
			[1, range],
			[2, options.Color ?? Color.Aqua],
			[3, options.Width ?? 10],
			[4, options.Alpha ?? 255],
		)
	}

	public DrawSelectedRing(
		key: any,
		entity: Entity,
		range: number = 100,
		position: Entity | Vector3 = entity,
		color = Color.Aqua
	) {
		this.CheckChangedRange(key, range)

		return this.AddOrUpdate(key,
			"particles/ui_mouseactions/drag_selected_ring.vpcf",
			ParticleAttachment_t.PATTACH_ABSORIGIN,
			entity,
			[0, position],
			[1, color],
			[2, new Vector3(range * 1.1, 255)]
		)
	}

	public DrawLine(
		key: any,
		entity: Entity,
		endPosition: Entity | Vector3,
		options: IDrawLineOptions = {}
	) {
		return this.AddOrUpdate(key,
			ParticleLinePath("line"),
			options.Attachment ?? ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
			entity,
			[0, options.Position ?? entity],
			[1, endPosition],
			[2, options.Color ?? Color.Aqua],
			[3, options.Width ?? 10],
			[4, options.Alpha ?? 255]
		)
	}

	public DrawRangeLine(
		key: any,
		entity: Entity,
		endPosition: Entity | Vector3
	) {
		return this.AddOrUpdate(key,
			"particles/ui_mouseactions/range_finder_line.vpcf",
			ParticleAttachment_t.PATTACH_ABSORIGIN,
			entity,
			[0, entity],
			[1, entity],
			[2, endPosition]
		)
	}

	public DrawLineToTarget(
		key: any,
		entity: Entity,
		target: Entity | Vector3,
		color = Color.Red
	) {
		return this.AddOrUpdate(key,
			ParticleTargetPath(),
			ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
			target,
			[2, entity],
			[6, color.Clone().SetR(Math.max(color.r, 1))],
			[7, target]
		)
	}
	/**
	 *
	 * ControlPoints:
	 * 	0: Start Position (|| entity pos)
	 * 	1: End Position
	 * 	2: Color
	 * 	3: Width
	 * 	4: Alpha
	 */
	public DrawBoundingArea(
		key: any,
		entity: Entity,
		endPosition: Entity | Vector3,
		startPos: Entity | Vector3 = entity,
		options: IDrawBoundingAreaOptions = {}
	) {
		return this.AddOrUpdate(key,
			BoundingAreaRenderPath(options.Render),
			ParticleAttachment_t.PATTACH_ABSORIGIN,
			entity,
			[0, startPos],
			[1, endPosition],
			[2, options.Color ?? Color.Aqua],
			[3, options.Width ?? 10],
			[4, options.Alpha ?? 255]
		)
	}

	public SetConstrolPointByKey(key: any, id: number, point: ControlPoint) {
		this.AllParticles.get(key)?.SetControlPoint(id, point)
	}
	public SetConstrolPointsByKey(key: any, ...points: ControlPointParam[]) {
		this.AllParticles.get(key)?.SetControlPoints(...points)
	}
	public RestartByKey(key: any) {
		this.AllParticles.get(key)?.Restart()
	}
	public DestroyByKey(key: any, immediate = true) {
		this.AllParticles.get(key)?.Destroy(immediate)
		this.AllParticlesRange.delete(key)
	}

	public DestroyAll(immediate = true) {
		this.AllParticles.forEach(particle => particle.Destroy(immediate))
		this.AllParticlesRange.clear()
	}

	public CheckChangedRange(key: any, range: number) {
		let particleRange = this.AllParticlesRange.get(key)

		if (particleRange !== undefined && particleRange !== range) {
			this.DestroyByKey(key)
			this.AllParticlesRange.set(key, range)
			return
		}

		if (particleRange === undefined)
			this.AllParticlesRange.set(key, range)

		return
	}
}

export default ParticlesSDK
