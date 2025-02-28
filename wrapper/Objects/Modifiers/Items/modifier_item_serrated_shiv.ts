import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EntityManager } from "../../../Managers/EntityManager"
import { Modifier } from "../../Base/Modifier"
import { Unit } from "../../Base/Unit"

@WrapperClassModifier()
export class modifier_item_serrated_shiv extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		if (params === undefined || !(this.Ability?.IsCooldownReady ?? false)) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || !target.IsRoshan) {
			return [0, false]
		}
		return [this.cachedDamage, false]
	}

	protected UpdateSpecialValues() {
		this.cachedDamage = this.GetSpecialValue("hp_dmg_rosh", "item_serrated_shiv")
	}
}
