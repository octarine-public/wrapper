import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_venomancer_sepsis extends Modifier {
	private cachedDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
			this.GetProcAttackBonusDamageMagical.bind(this)
		]
	])

	protected GetProcAttackBonusDamageMagical(
		params?: IModifierParams
	): [number, boolean] {
		const caster = this.Caster
		if (params === undefined || caster === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsBuilding) {
			return [0, false]
		}
		const count = this.debuffCount(target)
		if (count === 0) {
			return [0, false]
		}
		const stackPerDebuff = this.cachedDamage * count
		return [(caster.AttackDamageMin * stackPerDebuff) / 100, this.IsPassiveDisabled()]
	}

	protected UpdateSpecialValues(): void {
		this.cachedDamage = this.GetSpecialValue(
			"bonus_dmg_per_debuff_pct",
			"venomancer_sepsis"
		)
	}

	private debuffCount(unit: Unit): number {
		let debuffs = 0
		for (let i = unit.Buffs.length - 1; i > -1; i--) {
			const mod = unit.Buffs[i]
			if (!mod.IsDebuff()) {
				continue
			}
			if (mod.Caster === this.Caster || mod.AuraOwner === this.Caster) {
				debuffs++
			}
		}
		return debuffs
	}
}
