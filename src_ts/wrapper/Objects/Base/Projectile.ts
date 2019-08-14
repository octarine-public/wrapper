import { Color, Entity, EntityManager } from "wrapper/Imports"

export class Projectile {
	public IsValid = true
	public readonly ProjectileID: number
	protected SourceUnit: Entity | number
	protected path: string
	protected particleSystemHandle: bigint

	constructor(projID: number, path: string, particleSystemHandle: bigint, SourceUnit: Entity | number, protected launchTick: number) {
		this.ProjectileID = projID
		this.path = path
		this.particleSystemHandle = particleSystemHandle
		this.SourceUnit = SourceUnit
	}

	get Source(): Entity | number {
		if (this.SourceUnit instanceof Entity)
			return this.SourceUnit
		return EntityManager.EntityByIndex(this.SourceUnit) || this.SourceUnit
	}
	get ParticlePath(): string { return this.path }
	get ParticleSystemHandle(): string { return this.ParticleSystemHandle }
}

export class LinearProjectile extends Projectile {
	constructor(
		projID: number,
		ent: Entity | number,
		path: string,
		particleSystemHandle: bigint,
		public readonly moveSpeed: number,
		public readonly fowRadius: number,
		public readonly stickyFowReveal: boolean,
		public readonly distance: number,
		public readonly colorgemcolor: Color,
	) {
		super(projID, path, particleSystemHandle, ent, 0)
	}
}
export class TrackingProjectile extends Projectile {
	private dodged = false

	constructor(
		projID: number,
		source: Entity | number,
		private TargetEntity: Entity | number,
		private speed: number,
		readonly sourceAttachment: number,
		path: string,
		particleSystemHandle: bigint,
		private dodgeable: boolean,
		private isAttack: boolean,
		private expireTime: number,
		readonly maximpacttime: number,
		launchTick: number,
	) {
		super(projID, path, particleSystemHandle, source, launchTick)
	}

	get IsDodged(): boolean {
		return this.dodged
	}
	Dodge() {
		this.dodged = true
	}

	get IsDodgeable(): boolean { return this.dodgeable }
	get IsAttack(): boolean { return this.isAttack }
	get Speed(): number { return this.speed }
	get ExpireTime(): number { return this.expireTime }

	get Target(): Entity | number {
		if (this.TargetEntity instanceof Entity)
			return this.TargetEntity
		return EntityManager.EntityByIndex(this.TargetEntity) || this.TargetEntity
	}

	Update(TargetEntity: Entity | number, Speed: number, path: string, particleSystemHandle: bigint, dodgeable: boolean, isAttack: boolean, expireTime: number, launchTick: number) {
		this.TargetEntity = TargetEntity
		this.speed = Speed
		this.path = path
		this.particleSystemHandle = particleSystemHandle
		this.dodgeable = dodgeable
		this.isAttack = isAttack
		this.expireTime = expireTime
		this.launchTick = launchTick
	}
}
