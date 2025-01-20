import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Hero } from "../../../Base/Hero"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_kunkka_x_marks_the_spot extends Modifier implements IBuff, IDebuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly DebuffModifierName = this.Name

	private cachedSpeed = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
			this.GetMoveSpeedBonusPercentage.bind(this)
		]
	])
	public IsDebuff(): this is IDebuff {
		return this.Parent?.IsEnemy(this.Caster) ?? false
	}
	public IsBuff(): this is IBuff {
		return !this.IsDebuff()
	}
	protected GetMoveSpeedBonusPercentage(): [number, boolean] {
		const owner = this.Parent,
			caster = this.Caster
		if (owner === undefined || caster === undefined) {
			return [0, false]
		}
		return [
			owner.IsEnemy(caster) ? -this.cachedSpeed : this.cachedSpeed,
			owner.IsEnemy(caster) ? this.IsMagicImmune() : false
		]
	}
	protected UpdateSpecialValues(): void {
		const name = "kunkka_x_marks_the_spot"
		const caster = this.Caster
		if (!(caster instanceof Hero)) {
			this.cachedSpeed = 0
			return
		}
		let specialSpeed = 0
		if (caster.HeroFacetID === 2) {
			specialSpeed = this.GetSpecialValue("movespeed_bonus", name)
		}
		const abil = caster.GetAbilityByName("special_bonus_unique_kunkka_6")
		if (abil === undefined || abil.Level === 0) {
			this.cachedSpeed = specialSpeed
			return
		}
		// override special speed
		this.cachedSpeed = this.GetSpecialValue("ally_ms", name)
	}
}
