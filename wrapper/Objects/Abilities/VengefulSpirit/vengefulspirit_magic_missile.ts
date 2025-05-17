import { WrapperClass } from "../../../Decorators"
import { Ability } from "../../Base/Ability"
import { Unit } from "../../Base/Unit"
import { PlayerCustomData } from "../../DataBook/PlayerCustomData"

@WrapperClass("CDOTA_Ability_VengefulSpirit_Magic_Missile")
export class vengefulspirit_magic_missile extends Ability implements INuke {
	public get ProjectileAttachment(): string {
		return "attach_attack2"
	}
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseSpeedForLevel(level: number): number {
		return this.GetSpecialValue("magic_missile_speed", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("magic_missile_damage", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		let baseDamage = super.GetRawDamage(target)
		const damagePerLastHit = this.GetSpecialValue("damage_per_lasthit")
		if (target.PlayerID !== -1 && damagePerLastHit !== 0) {
			const lastHitCount = PlayerCustomData.get(target.PlayerID)?.LastHitCount ?? 0
			baseDamage += (lastHitCount * (damagePerLastHit * 100)) / 100
		}
		return baseDamage
	}
}
