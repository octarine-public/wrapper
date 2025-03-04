import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_winter_wyvern_winters_curse_aura
	extends Modifier
	implements IDebuff
{
	public readonly IsHidden = false
	public readonly DebuffModifierName = this.Name

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PURE,
			this.GetAbsoluteNoDamagePure.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_MAGICAL,
			this.GetAbsoluteNoDamageMagical.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PHYSICAL,
			this.GetAbsoluteNoDamagePhysical.bind(this)
		]
	])

	public IsDebuff(): this is IDebuff {
		return true
	}
	protected GetAbsoluteNoDamagePure(params?: IModifierParams): [number, boolean] {
		if (params === undefined || this.Caster === undefined) {
			return [0, false]
		}
		const source = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (source === undefined || source.IsEnemy(this.Caster)) {
			return [0, false]
		}
		return [this.Caster !== source ? 1 : 0, false]
	}
	protected GetAbsoluteNoDamageMagical(params?: IModifierParams): [number, boolean] {
		if (params === undefined || this.Caster === undefined) {
			return [0, false]
		}
		const source = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (source === undefined || source.IsEnemy(this.Caster)) {
			return [0, false]
		}
		return [this.Caster !== source ? 1 : 0, false]
	}
	protected GetAbsoluteNoDamagePhysical(params?: IModifierParams): [number, boolean] {
		if (params === undefined || this.Caster === undefined) {
			return [0, false]
		}
		const source = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (source === undefined || source.IsEnemy(this.Caster)) {
			return [0, false]
		}
		return [this.Caster !== source ? 1 : 0, false]
	}
}
