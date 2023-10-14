import { Color } from "../../Base/Color"
import { Vector2 } from "../../Base/Vector2"
import { Vector3 } from "../../Base/Vector3"
import * as EconHelper from "../../Managers/EconHelper"
import { Entity } from "./Entity"
import { FakeUnit } from "./FakeUnit"
import { Unit } from "./Unit"

export class Projectile {
	public IsValid = true
	public LastUpdate = 0
	public ParticlePathNoEcon = ""

	constructor(
		public readonly ID: number,
		public ParticlePath: string,
		public ParticleSystemHandle: bigint,
		public Source: Nullable<Unit | FakeUnit>,
		public readonly ColorGemColor: Color,
		public Speed: number
	) {
		this.UpdateParticlePathNoEcon()
	}

	public UpdateParticlePathNoEcon(): void {
		const orig = EconHelper.Particles.repl2orig.get(this.ParticlePath)
		this.ParticlePathNoEcon =
			orig !== undefined && orig.length !== 0 ? orig[0] : this.ParticlePath
	}
}

export class LinearProjectile extends Projectile {
	public readonly Position: Vector3
	public readonly Forward: Vector3
	public readonly TargetLoc: Vector3

	constructor(
		projID: number,
		ent: Nullable<Unit | FakeUnit>,
		path: string,
		particleSystemHandle: bigint,
		public readonly MaxSpeed: number,
		public readonly FowRadius: number,
		public readonly StickyFowReveal: boolean,
		public readonly Distance: number,
		public readonly Origin: Vector3,
		public readonly Velocity: Vector2,
		public readonly Acceleration: Vector2,
		colorgemcolor: Color
	) {
		super(
			projID,
			path,
			particleSystemHandle,
			ent,
			colorgemcolor,
			Math.round(Velocity.Length)
		)
		this.Position = this.Origin.Clone()

		this.Forward = Vector3.FromAngle(this.Velocity.Angle)
		this.TargetLoc = Origin.Rotation(this.Forward, this.Distance)
	}
}
export class TrackingProjectile extends Projectile {
	public readonly Position: Vector3 = new Vector3()
	public IsDodged = false

	constructor(
		projID: number,
		source: Nullable<Unit | FakeUnit>,
		public Target: Nullable<Unit | FakeUnit>,
		speed: number,
		public readonly SourceAttachment: string,
		path: string,
		particleSystemHandle: bigint,
		private dodgeable: boolean,
		private isAttack: boolean,
		private expireTime: number,
		public readonly MaxImpactTime: number | undefined,
		public LaunchTick: number,
		public readonly TargetLoc = new Vector3(),
		colorgemcolor: Color,
		public readonly OriginalMoveSpeed: number,
		public readonly Ability?: Nullable<Entity>
	) {
		super(projID, path, particleSystemHandle, source, colorgemcolor, speed)

		if (this.Source instanceof Entity) {
			this.Source.Position.CopyTo(this.Position)
		} else {
			this.Position.Invalidate()
		}
	}

	public get IsDodgeable(): boolean {
		return this.dodgeable
	}
	public get IsAttack(): boolean {
		return this.isAttack
	}
	public get ExpireTime(): number {
		return this.expireTime
	}

	public Update(
		targetEntity: Nullable<Unit | FakeUnit>,
		speed: number,
		path: string,
		particleSystemHandle: bigint,
		dodgeable: boolean,
		isAttack: boolean,
		expireTime: number,
		launchTick: number,
		targetLoc: Vector3
	) {
		this.Target = targetEntity
		this.Speed = speed
		this.ParticlePath = path
		this.UpdateParticlePathNoEcon()
		this.ParticleSystemHandle = particleSystemHandle
		this.dodgeable = dodgeable
		this.isAttack = isAttack
		this.expireTime = expireTime
		this.LaunchTick = launchTick
		targetLoc.CopyTo(this.TargetLoc)
	}
	public UpdateTargetLoc(): void {
		if (this.IsDodged) {
			return
		}

		const target = this.Target
		if (target instanceof Entity) {
			this.TargetLoc.CopyFrom(target.GetAttachmentPosition("attach_hitloc"))
		}
	}
}
