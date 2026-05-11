import { GetHeroTexture } from "../../../../Data/ImageData"
import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_nevermore_necromastery extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedDamagePerStack = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return this.StackCount !== 0
	}
	public GetTexturePath(): string {
		return GetHeroTexture(this.Caster?.Name ?? "")
	}
	protected GetPreAttackBonusDamage(): [number, boolean] {
		return [this.cachedDamagePerStack * this.StackCount, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "nevermore_necromastery",
			specialName = "necromastery_damage_per_soul",
			lvl = Math.max(this.Ability?.Level ?? this.AbilityLevel, 1)
		this.cachedDamagePerStack = this.GetSpecialValue(specialName, name, lvl)
	}
}
