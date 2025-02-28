import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EntityManager } from "../../../Managers/EntityManager"
import { Modifier } from "../../Base/Modifier"
import { Unit } from "../../Base/Unit"

@WrapperClassModifier()
export class modifier_item_rippers_lash extends Modifier implements IDebuff {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedDamageHero = 0
	private cachedDamageCreep = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_TARGET,
			this.GetPreAttackIncomingDamageBonus.bind(this)
		]
	])

	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetPreAttackIncomingDamageBonus(
		params?: IModifierParams
	): [number, boolean] {
		const caster = this.Caster
		if (params === undefined || caster === undefined) {
			return [0, false]
		}
		const source = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (source === undefined || this.Parent?.IsBuilding) {
			return [0, false]
		}
		if (source.IsCreep) {
			return [this.cachedDamageCreep, this.IsMagicImmune()]
		}
		return source.IsHero ? [this.cachedDamageHero, this.IsMagicImmune()] : [0, false]
	}
	protected UpdateSpecialValues() {
		const name = "item_rippers_lash"
		this.cachedDamageHero = this.GetSpecialValue("bonus_damage_hero", name)
		this.cachedDamageCreep = this.GetSpecialValue("bonus_damage_creep", name)
	}
}
