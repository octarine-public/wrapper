import { Ability, Hero, Unit, EntityManager } from "wrapper/Imports"
import { AbilityBase } from "../../Base/Abilities"
export default class AbilityX extends AbilityBase {
	constructor(unit?: Hero | Unit) {
		super(unit)
	}
	public get DragonSlave(): Ability {
		let name = "lina_dragon_slave"
		if (this.unit === undefined)
			return name as any
		return this.unit.GetAbilityByName(name)
	}
	public get LightStrikeArray(): Ability {
		let name = "lina_light_strike_array"
		if (this.unit === undefined)
			return name as any
		return this.unit.GetAbilityByName(name)
	}
	public get LagunaBlade(): Ability {
		let name = "lina_laguna_blade"
		if (this.unit === undefined)
			return name as any
		return this.unit.GetAbilityByName(name)
	}
	// public CastRange(abilName: string, AOE: boolean = false): number {
	// 	let range = 0
	// 	let gadgetRange = EntityManager.GetEntitiesByClass(Unit, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY)
	// 		.some(x => x.HasBuffByName("modifier_item_spy_gadget_aura")
	// 			&& x.IsAlive && (x.IsHero || x.Name.includes("bear"))
	// 			&& x.Distance2D(this.unit) <= 1200)
	// 	range = (gadgetRange ? 125 : 0)
	// 	return !AOE
	// 		? abilName.startsWith("item_")
	// 			? this.unit.GetItemByName(abilName)?.CastRange + range
	// 			: this.unit.GetAbilityByName(abilName)?.CastRange + range
	// 		: abilName.startsWith("item_")
	// 			? this.unit.GetItemByName(abilName)?.AOERadius + range
	// 			: this.unit.GetAbilityByName(abilName)?.AOERadius + range
	// }
}
