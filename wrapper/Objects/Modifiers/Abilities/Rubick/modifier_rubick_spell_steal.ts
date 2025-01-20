import { WrapperClassModifier } from "../../../../Decorators"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_rubick_spell_steal extends Modifier implements IBuff {
	public CachedSpellAmpDamage = 0
	public CachedManaCostReduction = 0
	public StealAbilityName: Nullable<string>

	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	public get ForceVisible(): boolean {
		return true
	}

	// public GetTexturePath(): string {
	// 	const abilName = this.kv.PortalLoopAppear
	// 	return abilName === undefined ? super.GetTexturePath() : GetSpellTexture(abilName)
	// }
	public IsBuff(): this is IBuff {
		return true
	}
	protected UpdateSpecialValues(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.CachedSpellAmpDamage = 0
			this.CachedManaCostReduction = 0
			return
		}
		this.CachedManaCostReduction = this.GetSpecialValue(
			"stolen_mana_reduction",
			"rubick_spell_steal"
		)
		const ability = owner.GetAbilityByName("special_bonus_unique_rubick_5")
		if (ability === undefined) {
			this.CachedSpellAmpDamage = 0
			return
		}
		this.CachedSpellAmpDamage = ability?.GetSpecialValue("value") ?? 0
	}
}
