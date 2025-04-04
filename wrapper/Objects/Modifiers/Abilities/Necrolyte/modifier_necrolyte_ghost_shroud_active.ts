import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Heroes } from "../../../Base/Hero"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_necrolyte_ghost_shroud_active
	extends Modifier
	implements IBuff, IShield
{
	public readonly IsGhost = true
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name
	public readonly ShieldModifierName = this.Name

	private cachedSpeed = 0
	private cachedMres = 0
	private cachedSpeedTotal = 0
	private cachedSpeedTransfer = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_DECREPIFY_UNIQUE,
			this.GetMagicalResistanceDecrepifyUnique.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return true
	}
	public IsShield(): this is IShield {
		return true
	}
	public PostDataUpdate() {
		const owner = this.Parent
		if (owner === undefined) {
			return
		}
		let result = 0
		for (let i = Heroes.length - 1; i > -1; i--) {
			const hero = Heroes[i]
			if (!hero.IsValid || hero === owner) {
				continue
			}
			if (!hero.IsAlive || !hero.IsEnemy(owner) || this.IsMagicImmune(hero)) {
				continue
			}
			if (!hero.HasBuffByName("modifier_necrolyte_ghost_shroud_aura_effect")) {
				continue
			}
			const speed = hero.GetMoveSpeedModifier(hero.BaseMoveSpeed, true)
			const slowStacking = hero.ModifierManager.GetPercentageMultiplicativeInternal(
				EModifierfunction.MODIFIER_PROPERTY_SLOW_RESISTANCE_STACKING
			)
			const slow = 2 - slowStacking,
				multiplier = 0.000099999997,
				transfer = this.cachedSpeedTransfer
			result += this.cachedSpeed * multiplier * speed * transfer * slow
		}
		if (this.cachedSpeedTotal === 0 || Math.abs(result - this.cachedSpeedTotal) > 1) {
			this.cachedSpeedTotal = Math.round(result * 100) / 100
		}
	}
	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [this.cachedSpeedTotal, false]
	}
	protected GetMagicalResistanceDecrepifyUnique(): [number, boolean] {
		return [this.cachedMres, false]
	}
	protected UpdateSpecialValues() {
		const name = "necrolyte_ghost_shroud"
		this.cachedMres = this.GetSpecialValue("bonus_damage", name)
		this.cachedSpeed = this.GetSpecialValue("movement_speed", name)
		this.cachedSpeedTransfer = this.GetSpecialValue("movement_transfer", name)
	}
}
