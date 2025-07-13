import { Vector3 } from "../../../Base/Vector3"
import { WrapperClass } from "../../../Decorators"
import { SPELL_IMMUNITY_TYPES } from "../../../Enums/SPELL_IMMUNITY_TYPES"
import { GameState } from "../../../Utils/GameState"
import { Ability } from "../../Base/Ability"

@WrapperClass("muerta_dead_shot")
export class muerta_dead_shot extends Ability implements INuke {
	public get ProjectileAttachment(): string {
		return "attach_attack1"
	}
	public get AbilityImmunityType(): SPELL_IMMUNITY_TYPES {
		return this.GetSpecialValue("scepter_pierces") !== 0
			? SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_YES
			: super.AbilityImmunityType
	}
	public get RicochetRadiusStart(): number {
		return this.GetSpecialValue("ricochet_radius_start")
	}
	public get RicochetExpandPerSecond(): number {
		return this.GetSpecialValue("ricochet_radius_expansion_per_second")
	}
	public GetEndRadius(createTime: number, bulletTime: number): number {
		const elapsed = GameState.RawGameTime - createTime
		return this.getRadiusAtTime(Math.min(elapsed, bulletTime))
	}
	public GetEndRadiusByTime(lifetime: number): number {
		return this.getRadiusAtTime(lifetime)
	}
	public GetEndRadiusByPoints(
		start: Vector3,
		end: Vector3,
		bulletSpeed: number = this.Speed
	): number {
		return this.GetEndRadiusByTime(start.Distance2D(end) / bulletSpeed)
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage", level)
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("speed", level)
	}
	public GetMaxChargesForLevel(level: number): number {
		const owner = this.Owner
		if (owner === undefined) {
			return 0
		}
		const ability = owner.GetAbilityByName(
			"special_bonus_unique_muerta_dead_shot_charges"
		)
		return ability?.GetSpecialValue("value", level) ?? 0
	}
	private getRadiusAtTime(t: number): number {
		return this.RicochetRadiusStart + this.RicochetExpandPerSecond * t
	}
}
