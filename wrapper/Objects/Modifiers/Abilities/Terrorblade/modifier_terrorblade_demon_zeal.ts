import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_terrorblade_demon_zeal extends Modifier {
	private cachedSpeed = 0
	private cachedAttackSpeed = 0
	private cachedReflectionPct = 0

	private cachedAS = 0
	private cachedMS = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
			this.GetMoveSpeedBonusConstant.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])

	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedMS = 0
			this.cachedAS = 0
			return
		}
		let moveSpeed = this.cachedSpeed,
			attackSpeed = this.cachedAttackSpeed
		const isReflection = owner.HasBuffByName(
			"modifier_terrorblade_reflection_invulnerability"
		)
		if (owner.IsIllusion && isReflection) {
			const half = (100 - this.cachedReflectionPct) / 100
			moveSpeed *= half
			attackSpeed *= half
		}
		this.cachedMS = moveSpeed
		this.cachedAS = attackSpeed
	}

	protected GetMoveSpeedBonusConstant(): [number, boolean] {
		return [this.cachedMS, false]
	}

	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAS, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "terrorblade_demon_zeal"
		this.cachedReflectionPct = this.GetSpecialValue("reflection_pct", name)
		this.cachedSpeed = this.GetSpecialValue("berserk_bonus_movement_speed", name)
		this.cachedAttackSpeed = this.GetSpecialValue("berserk_bonus_attack_speed", name)
	}
}
