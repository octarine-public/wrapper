import Vector3 from "../../Base/Vector3"
import Color from "../../Base/Color"
import Entity from "./Entity"
import EntityManager from "../../Managers/EntityManager"
import Vector2 from "../../Base/Vector2"

export class Projectile {
	public IsValid = true

	constructor(
		public readonly ID: number,
		protected path: string,
		protected particleSystemHandle: bigint,
		protected SourceUnit: Entity | number,
		public readonly colorgemcolor: Color,
	) {}

	get Source(): Entity | number {
		if (this.SourceUnit instanceof Entity)
			return this.SourceUnit
		return EntityManager.EntityByIndex(this.SourceUnit) || this.SourceUnit
	}
	get ParticlePath(): string { return this.path }
	get ParticleSystemHandle(): string { return this.ParticleSystemHandle }
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
		super(projID, path, particleSystemHandle, ent, colorgemcolor)
		this.Position = this.Origin.Clone()
		this.Forward = Vector3.FromAngle(this.Velocity.Angle)
		this.TargetLoc = Origin.Rotation(this.Forward, this.Distance)
	}
}
export class TrackingProjectile extends Projectile {
	public readonly Position: Vector3
	public DestroyAtNextTick: boolean = false

	private dodged = false

	constructor(
		projID: number,
		source: Entity | number,
		private TargetEntity: Entity | number,
		private speed: number,
		public readonly sourceAttachment: number,
		path: string,
		particleSystemHandle: bigint,
		private dodgeable: boolean,
		private isAttack: boolean,
		private expireTime: number,
		public readonly maximpacttime: number,
		public LaunchTick: number,
		private readonly targetLoc: Vector3,
		colorgemcolor: Color,
	) {
		super(projID, path, particleSystemHandle, source, colorgemcolor)
		this.Position = this.Source instanceof Entity ? this.Source.Position : new Vector3().Invalidate()
	}

	get IsDodged(): boolean {
		return this.dodged
	}
	Dodge() {
		this.dodged = true
	}

	public get TargetLoc() {
		if (!this.IsDodged && this.Target instanceof Entity)
			return this.Target.Position
		return this.targetLoc
	}

	get IsDodgeable(): boolean { return this.dodgeable }
	get IsAttack(): boolean { return this.isAttack }
	get Speed(): number { return this.speed }
	get ExpireTime(): number { return this.expireTime }

	get Target(): Entity | number {
		if (!(this.TargetEntity instanceof Entity)) {
			let ent = EntityManager.EntityByIndex(this.TargetEntity)
			if (ent !== undefined)
				return this.TargetEntity = ent
		}
		return this.TargetEntity
	}

	Update(TargetEntity: Entity | number, Speed: number, path: string, particleSystemHandle: bigint, dodgeable: boolean, isAttack: boolean, expireTime: number, launchTick: number, targetLoc: Vector3) {
		this.TargetEntity = TargetEntity
		this.speed = Speed
		this.path = path
		this.particleSystemHandle = particleSystemHandle
		this.dodgeable = dodgeable
		this.isAttack = isAttack
		this.expireTime = expireTime
		this.LaunchTick = launchTick
		targetLoc.CopyTo(this.targetLoc)
	}
}
