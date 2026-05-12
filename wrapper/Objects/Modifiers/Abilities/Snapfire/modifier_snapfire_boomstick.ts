import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_snapfire_boomstick extends Modifier {
	private cachedAmpMin = 0
	private cachedAmpMax = 0
	private cachedDistMin = 0
	private cachedDistMax = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		]
	])
	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		const owner = this.Parent
		if (params === undefined || owner === undefined || this.IsPassiveDisabled()) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex ?? -1)
		if (target === undefined) {
			return [0, false]
		}
		const ampPct = this.amplificationPercent(owner.Distance2D(target))
		if (ampPct <= 0) {
			return [0, false]
		}
		const baseDamage = params.RawDamageBase ?? 0
		return [(baseDamage * ampPct) / 100, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "snapfire_boomstick"
		this.cachedAmpMin = this.GetSpecialValue("damage_amp_min", name)
		this.cachedAmpMax = this.GetSpecialValue("damage_amp_max", name)
		this.cachedDistMin = this.GetSpecialValue("distance_threshold_min", name)
		this.cachedDistMax = this.GetSpecialValue("distance_threshold_max", name)
	}
	/**
	 * Linear interpolation between `damage_amp_max` (at `distance_threshold_min`,
	 * i.e. point-blank) and `damage_amp_min` (at `distance_threshold_max`,
	 * i.e. maximum range). Clamped at both ends.
	 */
	private amplificationPercent(distance: number): number {
		const near = this.cachedDistMin
		const far = this.cachedDistMax
		if (far <= near) {
			return this.cachedAmpMax
		}
		if (distance <= near) {
			return this.cachedAmpMax
		}
		if (distance >= far) {
			return this.cachedAmpMin
		}
		const t = (distance - near) / (far - near)
		return this.cachedAmpMax - t * (this.cachedAmpMax - this.cachedAmpMin)
	}
}
