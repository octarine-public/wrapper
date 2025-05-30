import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class silencer_oppressive_silence extends Modifier {
	private cachedIncOutDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE,
			this.GetDamageOutgoingPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
			this.GetIncomingDamagePercentage.bind(this)
		]
	])
	protected GetDamageOutgoingPercentage(params?: IModifierParams): [number, boolean] {
		return [this.getDamagePercentage(params), false]
	}
	protected GetIncomingDamagePercentage(params?: IModifierParams): [number, boolean] {
		return [this.getDamagePercentage(params) * -1, false]
	}
	protected UpdateSpecialValues(): void {
		this.cachedIncOutDamage = this.GetSpecialValue(
			"damage_pct",
			"silencer_oppressive_silence"
		)
	}
	private getDamagePercentage(params?: IModifierParams): number {
		if (params === undefined) {
			return 0
		}
		const source = EntityManager.EntityByIndex(params.SourceIndex)
		if (!(source instanceof Unit) || source === this.Parent) {
			return 0
		}
		if (!source.IsEnemy(this.Caster) || !source.IsSilenced) {
			return 0
		}
		return this.cachedIncOutDamage
	}
}
