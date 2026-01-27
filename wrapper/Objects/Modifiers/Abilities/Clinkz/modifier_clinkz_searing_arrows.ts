import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { clinkz_searing_arrows } from "../../../Abilities/Clinkz/clinkz_searing_arrows"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_clinkz_searing_arrows extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		const ability = this.Ability
		if (params === undefined || !(ability instanceof clinkz_searing_arrows)) {
			return [0, false]
		}
		const owner = this.Parent
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (owner === undefined || target === undefined) {
			return [0, false]
		}
		if (!ability.IsAutoCastEnabled) {
			return [0, false]
		}
		return [this.cachedDamage, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue("damage_bonus", "clinkz_searing_arrows")
	}
}
