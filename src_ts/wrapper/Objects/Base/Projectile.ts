import Color from "../../Base/Color"
import Vector2 from "../../Base/Vector2"
import Vector3 from "../../Base/Vector3"
import EntityManager from "../../Managers/EntityManager"
import Entity from "./Entity"

export class Projectile {
	public IsValid = true

	constructor(
		public readonly ID: number,
		protected path: string,
		protected particleSystemHandle: bigint,
		protected SourceUnit: Entity | number,
		public readonly colorgemcolor: Color,
		protected speed: number,
	) {}

	public get Source(): Entity | number {
		if (this.SourceUnit instanceof Entity)
			return this.SourceUnit
		return EntityManager.EntityByIndex(this.SourceUnit) || this.SourceUnit
	}
	public get ParticlePath(): string { return this.path }
	public get ParticleSystemHandle(): string { return this.ParticleSystemHandle }
	public get Speed(): number { return this.speed }
}

export class LinearProjectile extends Projectile {
	public readonly Position: Vector3
	public readonly Forward: Vector3
	public readonly TargetLoc: Vector3

	constructor(
		projID: number,
		ent: Entity | number,
		path: string,
		particleSystemHandle: bigint,
		public readonly MaxSpeed: number,
		public readonly FowRadius: number,
		public readonly StickyFowReveal: boolean,
		public readonly Distance: number,
		public readonly Origin: Vector3,
		public readonly Velocity: Vector2,
		public readonly Acceleration: Vector2,
		colorgemcolor: Color,
	) {
		super(projID, path, particleSystemHandle, ent, colorgemcolor, Math.round(Velocity.Length))
		this.Position = this.Origin.Clone()
		this.Forward = Vector3.FromAngle(this.Velocity.Angle)
		this.TargetLoc = Origin.Rotation(this.Forward, this.Distance)
	}
}
export class TrackingProjectile extends Projectile {
	public readonly Position: Vector3 = new Vector3()
	public HadHitTargetLoc = false
	public IsDodged = false

	constructor(
		projID: number,
		source: Entity | number,
		private TargetEntity: Entity | number,
		speed: number,
		public readonly sourceAttachment: number,
		path: string,
		particleSystemHandle: bigint,
		private dodgeable: boolean,
		private isAttack: boolean,
		private expireTime: number,
		public readonly maximpacttime: number,
		public LaunchTick: number,
		public readonly TargetLoc: Vector3,
		colorgemcolor: Color,
	) {
		super(projID, path, particleSystemHandle, source, colorgemcolor, speed)
		if (this.Source instanceof Entity)
			this.Source.Position.CopyTo(this.Position)
		else
			this.Position.Invalidate()
		if (this.TargetEntity instanceof Entity)
			this.TargetEntity.Position.CopyTo(this.TargetLoc)
	}

	public get IsDodgeable(): boolean { return this.dodgeable }
	public get IsAttack(): boolean { return this.isAttack }
	public get ExpireTime(): number { return this.expireTime }

	public get Target(): Entity | number {
		if (this.IsDodged)
			return undefined
		if (!(this.TargetEntity instanceof Entity)) {
			let ent = EntityManager.EntityByIndex(this.TargetEntity)
			if (ent !== undefined)
				return this.TargetEntity = ent
		}
		return this.TargetEntity
	}

	public Update(TargetEntity: Entity | number, Speed: number, path: string, particleSystemHandle: bigint, dodgeable: boolean, isAttack: boolean, expireTime: number, launchTick: number, targetLoc: Vector3) {
		this.TargetEntity = TargetEntity
		this.speed = Speed
		this.path = path
		this.particleSystemHandle = particleSystemHandle
		this.dodgeable = dodgeable
		this.isAttack = isAttack
		this.expireTime = expireTime
		this.LaunchTick = launchTick
		targetLoc.CopyTo(this.TargetLoc)
	}
}
