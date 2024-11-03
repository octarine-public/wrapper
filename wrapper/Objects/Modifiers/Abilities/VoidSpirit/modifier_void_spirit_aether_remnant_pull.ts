import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Thinker } from "../../../Base/Thinker"

@WrapperClassModifier()
export class modifier_void_spirit_aether_remnant_pull extends Modifier {
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MAX,
			this.GetMoveSpeedAbsoluteMax.bind(this)
		]
	])

	private cachedSpeed = 0

	protected GetMoveSpeedAbsoluteMax(): [number, boolean] {
		return [this.cachedSpeed, this.IsMagicImmune()]
	}

	protected UpdateSpecialValues(): void {
		const caster = this.Caster,
			owner = this.Parent
		if (caster === undefined || owner === undefined) {
			return
		}
		const thinker = EntityManager.GetEntitiesByClass(Thinker).find(
			x => x.IsAlive && x.Owner === caster
		)
		if (thinker === undefined) {
			return
		}
		const destination = this.GetSpecialValue(
			"pull_destination",
			"void_spirit_aether_remnant"
		)
		const distance = thinker.Distance2D(owner.Position)
		this.cachedSpeed = (distance * destination) / 100 / this.Duration
	}
}
