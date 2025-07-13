import { Color } from "../../Base/Color"
import { Vector2 } from "../../Base/Vector2"
import { Vector3 } from "../../Base/Vector3"
import { EntityManager } from "../../Managers/EntityManager"
import { GameState } from "../../Utils/GameState"
import { readJSON } from "../../Utils/Utils"
import { Thinkers } from "../Units/Thinker"
import { Ability as AbilitySDK } from "./Ability"
import { Entity } from "./Entity"
import { FakeUnit } from "./FakeUnit"
import { Heroes } from "./Hero"
import { Unit } from "./Unit"

interface INetworkedProjectileData {
	abilityName: string | string[]
}

const networkedProjectileData = new Map<string, INetworkedProjectileData>(
	Object.entries(readJSON("network_projectile.json"))
)

export class Projectile {
	public IsValid = true
	public ParticlePathNoEcon = ""
	public AbilityIndex: Nullable<number>
	public readonly OriginalSpeed: number
	public readonly CreateTime: number
	public readonly VisualPosition: Vector3 = new Vector3().Invalidate()
	// TODO: calcluate speed by modifier

	constructor(
		public readonly ID: number,
		public ParticlePath: string,
		public ParticleSystemHandle: bigint,
		public Source: Nullable<Unit | FakeUnit>,
		public readonly ColorGemColor: Color,
		public Speed: number
	) {
		this.UpdateParticlePathNoEcon()
		this.OriginalSpeed = this.Speed
		this.CreateTime = GameState.RawGameTime
	}
	public UpdateParticlePathNoEcon(): void {
		this.ParticlePathNoEcon = GetOriginalParticlePath(this.ParticlePath)
	}
	protected UpdateData(): void {
		// implement
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
		this.VisualPosition.CopyFrom(this.Position)
		this.Forward = Vector3.FromAngle(this.Velocity.Angle)
		this.TargetLoc = Origin.Rotation(this.Forward, this.Distance)
		this.UpdateData()
	}
	public get Ability() {
		return EntityManager.EntityByIndex<AbilitySDK>(this.AbilityIndex)
	}
	public GetRemainingTime(
		start: Vector3 = this.Origin,
		end: Vector3 = this.TargetLoc
	): number {
		return this.CreateTime + start.Distance(end) / this.Speed - GameState.RawGameTime
	}
	protected UpdateData(): void {
		if (!(this.Source instanceof Unit)) {
			return
		}
		const obj = networkedProjectileData.get(this.ParticlePathNoEcon)
		if (obj === undefined) {
			return
		}
		const [constructors, isOnce] = this.getConstructors(obj)
		if (!isOnce) {
			this.AbilityIndex = this.getAbility(this.Source, constructors[0])?.Index
			return
		}
		for (let i = constructors.length - 1; i > -1; i--) {
			const constructor = constructors[i]
			const abil = this.getAbility(this.Source, constructor)
			if (abil !== undefined && abil.Speed === this.Speed) {
				this.AbilityIndex = abil.Index
				break
			}
		}
	}
	private getConstructors(
		obj: INetworkedProjectileData
	): [Constructor<AbilitySDK>[], boolean] {
		const abilNames = obj.abilityName
		if (!Array.isArray(abilNames)) {
			const constructor = EntityManager.GetConstructorByName<AbilitySDK>(abilNames)
			return constructor !== undefined ? [[constructor], false] : [[], false]
		}
		const arr: Constructor<AbilitySDK>[] = []
		for (let i = abilNames.length - 1; i > -1; i--) {
			const name = abilNames[i]
			const constructor = EntityManager.GetConstructorByName<AbilitySDK>(name)
			if (constructor !== undefined) {
				arr.push(constructor)
			}
		}
		return [arr, true]
	}
	private getAbility(source: Unit, constructor: Constructor<AbilitySDK>) {
		return EntityManager.GetEntitiesByClass(constructor).find(
			x => x.Owner === source && x.Level !== 0
		)
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
		public readonly MaxImpactTime: Nullable<number>,
		public LaunchTick: number,
		public readonly TargetLoc = new Vector3().Invalidate(),
		colorgemcolor: Color,
		public readonly OriginalMoveSpeed: number,
		public readonly Ability?: Nullable<AbilitySDK>
	) {
		super(projID, path, particleSystemHandle, source, colorgemcolor, speed)
		this.AbilityIndex = this.Ability?.Index
		if (source instanceof Entity) {
			source.GetAttachmentPosition(this.SourceAttachment).CopyTo(this.Position)
			this.VisualPosition.CopyFrom(this.Position)
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
	/** @internal */
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
		this.UpdateData()
	}
	/** @internal */
	public UpdateProjectileSpeed() {
		if (!(this.Source instanceof Unit) || !(this.Target instanceof Unit)) {
			return
		}
		const baseSpeed = this.OriginalSpeed,
			distortionAura = this.ModifierDistortionAura(this.Source),
			timeZoneAura = this.ModifierTimeZoneAura(this.Source)
		this.Speed = baseSpeed * (1 - (distortionAura + timeZoneAura))
	}
	// Passive distortion aura (faceless_void)
	protected ModifierDistortionAura(source: Unit): number {
		if (!this.IsAttack) {
			return 0
		}

		const name = "modifier_faceless_void_time_dilation_distortion_aura"
		const modifier = Heroes.find(
			x =>
				x.IsAlive &&
				x !== source &&
				!x.IsIllusion &&
				x.Team !== source.Team &&
				x.HasBuffByName(name) &&
				this.Position.IsInRange(x.RealPosition, 2500)
		)?.GetBuffByName(name)

		const ability = modifier?.Ability,
			caster = modifier?.Caster
		if (modifier === undefined || ability === undefined || caster === undefined) {
			return 0
		}
		const radius = ability.AOERadius + 24
		if (!this.Position.IsInRange(caster.RealPosition, radius)) {
			return 0
		}
		return ability.GetSpecialValue("attack_projectile_slow") / 100
	}
	// TimeZone (faceless_void)
	protected ModifierTimeZoneAura(source: Unit): number {
		const name = "modifier_faceless_void_time_zone"
		const modifier = Thinkers.find(x => x.HasBuffByName(name))?.GetBuffByName(name)
		const ability = modifier?.Ability,
			owner = modifier?.Parent
		if (modifier === undefined || ability === undefined || owner === undefined) {
			return 0
		}
		const radius = ability.AOERadius + 24
		if (!this.Position.IsInRange(owner.RealPosition, radius)) {
			return 0
		}
		const value = ability.GetSpecialValue("bonus_projectile_speed") / 100
		return source.Team === owner.Team ? -value : value
	}
}
