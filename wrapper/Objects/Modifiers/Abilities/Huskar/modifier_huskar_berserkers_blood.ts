import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { Modifier } from "../../../Base/Modifier"

@WrapperClassModifier()
export class modifier_huskar_berserkers_blood extends Modifier implements IBuff {
	public readonly IsHidden = false
	public readonly BuffModifierName = this.Name

	private cachedMres = 0
	private cachedAttackSpeed = 0

	private cachedMaxAS = 0
	private cachedMaxMres = 0
	private cachedMaxHPTreshold = 0

	private lastChanged = 0

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
			this.GetMagicalResistanceBonus.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
			this.GetAttackSpeedBonusConstant.bind(this)
		]
	])
	public IsBuff(): this is IBuff {
		return this.cachedMres !== 0
	}
	public PostDataUpdate(): void {
		this.forceUpdate()
		const owner = this.Parent
		if (owner === undefined) {
			this.cachedMres = 0
			this.cachedAttackSpeed = 0
			return
		}
		const calculate = this.healthEffect(owner.HP, owner.MaxHP)
		this.cachedMres = calculate * this.cachedMaxMres
		this.cachedAttackSpeed = calculate * this.cachedMaxAS
	}
	protected GetMagicalResistanceBonus(): [number, boolean] {
		return [this.cachedMres, this.IsPassiveDisabled()]
	}
	protected GetAttackSpeedBonusConstant(): [number, boolean] {
		return [this.cachedAttackSpeed, this.IsPassiveDisabled()]
	}
	protected UpdateSpecialValues(): void {
		const name = "huskar_berserkers_blood"
		this.cachedMaxAS = this.GetSpecialValue("maximum_attack_speed", name)
		this.cachedMaxMres = this.GetSpecialValue("maximum_magic_resist", name)
		this.cachedMaxHPTreshold = this.GetSpecialValue("hp_threshold_max", name)
	}
	private healthEffect(curHP: number, maxHP: number): number {
		const maxThreshold = this.cachedMaxHPTreshold / 100
		const hpThreshold = Math.remapRange(curHP / maxHP, maxThreshold, 1, 0, 1)
		return Math.pow(1 - hpThreshold, 1.85)
	}

	private forceUpdate() {
		if (
			(this.cachedMres === 0 && this.lastChanged !== 0) ||
			(this.cachedMres !== 0 && this.lastChanged === 0)
		) {
			this.Update(true)
			this.lastChanged = this.cachedMres
		}
	}
}
