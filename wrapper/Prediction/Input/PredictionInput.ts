import { Vector3 } from "../../Base/Vector3"
import { CollisionFlag } from "../../Enums/CollisionFlag"
import { CollisionTeam } from "../../Enums/CollisionTypes"
import { ESkillShotType } from "../../Enums/ESkillShotType"
import { Ability } from "../../Objects/Base/Ability"
import { Unit } from "../../Objects/Base/Unit"

export interface IPredictionOverrides {
	Speed: number
	Delay: number
	Radius: number
	Range: number
	SkillShotType: ESkillShotType
	CollisionFlags: number
	CollisionTeam: CollisionTeam
	AoeRadius: number
	ActivationDelay: number
	SpawnOffset: number
}

export class PredictionInput {
	public readonly Source: Unit
	public readonly Ability: Ability
	public readonly Target: Unit
	public readonly Speed: number
	public readonly Delay: number
	public readonly Radius: number
	public readonly Range: number
	public readonly SkillShotType: ESkillShotType
	public readonly CollisionFlags: number
	public readonly CollisionTeam_: CollisionTeam
	public readonly AoeRadius: number
	public readonly ActivationDelay: number
	public readonly SpawnOffset: number

	constructor(
		source: Unit,
		ability: Ability,
		target: Unit,
		speed: number,
		delay: number,
		radius: number,
		range: number,
		skillShotType: ESkillShotType,
		collisionFlags: number,
		collisionTeam: CollisionTeam,
		aoeRadius: number,
		activationDelay: number,
		spawnOffset: number
	) {
		this.Source = source
		this.Ability = ability
		this.Target = target
		this.Speed = speed
		this.Delay = delay
		this.Radius = radius
		this.Range = range
		this.SkillShotType = skillShotType
		this.CollisionFlags = collisionFlags
		this.CollisionTeam_ = collisionTeam
		this.AoeRadius = aoeRadius
		this.ActivationDelay = activationDelay
		this.SpawnOffset = spawnOffset
	}

	public get SourcePosition(): Vector3 {
		return this.Source.Position
	}

	public get RealOrigin(): Vector3 {
		if (this.SpawnOffset === 0) {
			return this.SourcePosition
		}
		const pos = this.SourcePosition
		const dir = this.Source.Forward
		return pos.Add(dir.MultiplyScalar(this.SpawnOffset))
	}

	public get TotalDelay(): number {
		return this.Delay + this.ActivationDelay
	}

	public HasCollisionFlag(flag: CollisionFlag): boolean {
		return (this.CollisionFlags & flag) !== 0
	}

	public static FromAbility(
		ability: Ability,
		target: Unit,
		overrides?: Partial<IPredictionOverrides>
	): PredictionInput {
		const owner = ability.Owner
		if (owner === undefined) {
			throw new Error("Ability has no owner")
		}
		const speed = overrides?.Speed ?? ability.Speed
		const castDelay = ability.CastDelay
		const turnTime = owner.TurnTimeNew(target.Position, false)
		const delay = overrides?.Delay ?? castDelay + turnTime // + GameState.Ping / 2000
		const radius = overrides?.Radius ?? ability.AOERadius
		const range = overrides?.Range ?? ability.CastRange
		const skillShotType = overrides?.SkillShotType ?? ability.PredictionSkillShotType
		const collisionFlags =
			overrides?.CollisionFlags ?? ability.PredictionCollisionFlag
		const collisionTeam = overrides?.CollisionTeam ?? ability.PredictionCollisionTeam
		const aoeRadius = overrides?.AoeRadius ?? ability.AOERadius
		const activationDelay = overrides?.ActivationDelay ?? ability.ActivationDelay
		const spawnOffset = overrides?.SpawnOffset ?? 0

		return new PredictionInput(
			owner,
			ability,
			target,
			speed,
			delay,
			radius,
			range,
			skillShotType,
			collisionFlags,
			collisionTeam,
			aoeRadius,
			activationDelay,
			spawnOffset
		)
	}
}
