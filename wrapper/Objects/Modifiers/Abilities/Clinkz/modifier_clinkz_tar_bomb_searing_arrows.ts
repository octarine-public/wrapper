import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_clinkz_tar_bomb_searing_arrows extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || this.IsMagicImmune(target)) {
			return [0, false]
		}
		if (!target.HasBuffByName("modifier_clinkz_tar_bomb_slow")) {
			return [0, false]
		}
		return [this.cachedDamage, false]
	}

	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue("damage_bonus", "clinkz_tar_bomb")
	}
}
