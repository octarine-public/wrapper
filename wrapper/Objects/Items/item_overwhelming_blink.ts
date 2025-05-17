import { WrapperClass } from "../../Decorators"
import { Unit } from "../Base/Unit"
import { item_blink } from "./item_blink"

@WrapperClass("item_overwhelming_blink")
export class item_overwhelming_blink extends item_blink implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("radius", level)
	}
	public GetMaxDurationForLevel(level: number): number {
		return this.GetSpecialValue("duration", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("damage_base", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const damagePct = this.GetSpecialValue("damage_pct_instant")
		return super.GetRawDamage(target) + (owner.TotalStrength * damagePct) / 100
	}
}
