import { WrapperClassModifier } from "../../../Decorators"
import { DOTA_ABILITY_BEHAVIOR } from "../../../Enums/DOTA_ABILITY_BEHAVIOR"
import { Modifier } from "../../Base/Modifier"

@WrapperClassModifier()
export class modifier_item_phylactery extends Modifier {
	public CachedTotalSpells = 0
	public CachedBonusDamage = 0
	protected readonly CanPostDataUpdate = true

	public PostDataUpdate(): void {
		const owner = this.Parent,
			ability = this.Ability
		if (owner === undefined || ability === undefined || !ability.IsReady) {
			this.CachedTotalSpells = 0
			return
		}
		let count = 0
		const arr = owner.Spells
		for (let i = arr.length - 1; i > -1; i--) {
			const abil = arr[i]
			if (abil === undefined || abil.IsPassive || !abil.CanBeCasted()) {
				continue
			}
			if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ATTACK)) {
				continue
			}
			count++
		}
		this.CachedTotalSpells = count
	}

	protected UpdateSpecialValues() {
		this.CachedBonusDamage = this.GetSpecialValue(
			"bonus_spell_damage",
			"item_phylactery"
		)
	}
}
