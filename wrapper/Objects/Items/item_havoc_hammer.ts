import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_havoc_hammer")
export class item_havoc_hammer extends Item {
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("range", level)
	}
	public GetBaseDamageForLevel(level: number): number {
		return this.GetSpecialValue("nuke_base_dmg", level)
	}
	public GetRawDamage(target: Unit): number {
		const owner = this.Owner
		if (owner === undefined || this.Level === 0) {
			return 0
		}
		const baseDamage = super.GetRawDamage(target),
			strDamage = this.GetSpecialValue("nuke_str_dmg")
		return baseDamage + strDamage * owner.TotalStrength
	}
}
