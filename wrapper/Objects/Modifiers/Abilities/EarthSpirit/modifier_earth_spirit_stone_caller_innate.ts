import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { earth_spirit_stone_caller } from "../../../Abilities/EarthSpiritStone/earth_spirit_stone_caller"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_earth_spirit_stone_caller_innate extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedDamage = 0
	private cachedUsedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		const raw = params?.RawDamageBase
		const abil = this.Ability
		if (raw === undefined || !(abil instanceof earth_spirit_stone_caller)) {
			return [0, false]
		}
		let damage = this.cachedDamage * abil.CurrentCharges
		if (this.RemainingTime !== 0) {
			damage += this.cachedUsedDamage
		}
		return [(raw * damage) / 100, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "earth_spirit_stone_caller"
		this.cachedDamage = this.GetSpecialValue("attack_damage_per_stone", name)
		this.cachedUsedDamage = this.GetSpecialValue("attack_damage_per_stone_used", name)
	}
}
