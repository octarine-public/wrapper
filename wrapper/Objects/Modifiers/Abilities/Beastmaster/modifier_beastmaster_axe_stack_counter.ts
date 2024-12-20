import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_beastmaster_axe_stack_counter extends Modifier {
	private cachedIncDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])

	protected GetIncomingDamagePercentage(params?: IModifierParams): [number, boolean] {
		const caster = this.Caster,
			target = this.Parent
		if (params === undefined || caster === undefined || target === undefined) {
			return [0, false]
		}
		const source = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (source === undefined || !target.IsEnemy(caster)) {
			return [0, false]
		}
		if (!source.IsControllableByPlayer(caster.PlayerID)) {
			return [0, false]
		}
		return [this.cachedIncDamage * this.StackCount, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues() {
		this.cachedIncDamage = this.GetSpecialValue("damage_amp", "beastmaster_wild_axes")
	}
}
