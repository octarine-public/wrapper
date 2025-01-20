import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EntityManager } from "../../../Managers/EntityManager"
import { Modifier } from "../../Base/Modifier"
import { Unit } from "../../Base/Unit"

@WrapperClassModifier()
export class modifier_bloodthorn_debuff extends Modifier implements IDebuff, IDisable {
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	private cachedDamageHero = 0
	private cachedDamageCreep = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL_TARGET,
			this.GetPreAttackBonusDamageMagicalTarget.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return true
	}
	public IsDisable(): this is IDisable {
		return true
	}
	protected GetPreAttackBonusDamageMagicalTarget(
		params?: IModifierParams
	): [number, boolean] {
		if (params === undefined) {
			return [0, false]
		}
		const source = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (source === undefined || source.IsBuilding) {
			return [0, false]
		}
		if (source.IsHero) {
			return [this.cachedDamageHero, this.IsMagicImmune()]
		}
		if (source.IsCreep) {
			return [this.cachedDamageCreep, this.IsMagicImmune()]
		}
		return [0, false]
	}

	protected UpdateSpecialValues() {
		const name = "item_bloodthorn"
		this.cachedDamageHero = this.GetSpecialValue("proc_damage_heroes", name)
		this.cachedDamageCreep = this.GetSpecialValue("proc_damage_creeps", name)
	}
}
