import { WrapperClassModifier } from "../../../Decorators"
import { EModifierfunction } from "../../../Enums/EModifierfunction"
import { EntityManager } from "../../../Managers/EntityManager"
import { Modifier } from "../../Base/Modifier"
import { Unit } from "../../Base/Unit"

@WrapperClassModifier()
export class modifier_largo_song_attack_burst extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedDamage = 0
	private cachedSpellAmp = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
			this.GetSpellAmpPercentage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
			this.GetProcAttackBonusDamageMagical.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	protected GetSpellAmpPercentage(): [number, boolean] {
		return [this.cachedSpellAmp, false]
	}
	protected GetProcAttackBonusDamageMagical(
		params?: IModifierParams
	): [number, boolean] {
		const owner = this.Parent
		if (params === undefined || owner === undefined) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsBuilding || !target.IsEnemy(this.Caster)) {
			return [0, false]
		}
		return [(params.RawDamageBase ?? 0) * (this.cachedDamage / 100), false]
	}
	protected UpdateSpecialValues(): void {
		const name = "largo_song_fight_song"
		this.cachedSpellAmp = this.GetSpecialValue("spell_amp_bonus", name)
		this.cachedDamage = this.GetSpecialValue("magic_damage_bonus", name)
	}
}
