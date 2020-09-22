import Unit from "./Unit"
import { WrapperClass } from "../../Decorators"

@WrapperClass("C_DOTA_BaseNPC_Creep")
export default class Creep extends Unit {
	get IsCreep(): boolean {
		return true
	}
	get IsLaneCreep(): boolean {
		return this.ClassName === "CDOTA_BaseNPC_Creep_Lane" || this.ClassName === "CDOTA_BaseNPC_Creep_Siege"
	}
	public get IsDeniable(): boolean {
		return super.IsDeniable || this.HPPercent <= 50
	}
	public GetAdditionalAttackDamage(source: Unit): number {
		let damage = 0
		if (this.IsEnemy(source)) {
			let quellingBlade = source.GetItemByName("item_quelling_blade")
			if (quellingBlade !== undefined)
				damage += quellingBlade.GetSpecialValue(source.IsMelee ? "damage_bonus" : "damage_bonus_ranged")
		}
		return damage
	}
	public GetAdditionalAttackDamageMultiplier(source: Unit): number {
		let multiplier = 1
		if (this.IsEnemy(source)) {
			let battleFury = source.GetItemByName("item_bfury")
			if (battleFury !== undefined)
				multiplier *= battleFury.GetSpecialValue(source.IsMelee ? "quelling_bonus" : "quelling_bonus_ranged")
		}
		return multiplier
	}
}
