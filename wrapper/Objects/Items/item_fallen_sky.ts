import { WrapperClass } from "../../Decorators"
import { Item } from "../Base/Item"
import { Unit } from "../Base/Unit"

@WrapperClass("item_fallen_sky")
export class item_fallen_sky extends Item implements INuke {
	public IsNuke(): this is INuke {
		return true
	}
	public GetBaseAOERadiusForLevel(level: number): number {
		return this.GetSpecialValue("impact_radius", level)
	}
	public GetBaseDamageForLevel(_level: number): number {
		return this.GetSpecialValue("impact_damage_units")
	}
	public GetRawDamage(target: Unit): number {
		return target.IsBuilding
			? this.GetSpecialValue("impact_damage_buildings")
			: super.GetRawDamage(target)
	}
}
