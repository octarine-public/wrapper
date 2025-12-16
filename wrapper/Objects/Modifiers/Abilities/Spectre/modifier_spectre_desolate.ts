import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EntityManager } from "../../../../Managers/EntityManager"
import { Modifier } from "../../../Base/Modifier"
import { Unit, Units } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_spectre_desolate extends Modifier {
	private cachedBonus = 0
	private cachedRadius = 0
	private Units: Unit[] = []

	protected readonly CanPostDataUpdate = true
	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE,
			this.GetPreAttackBonusDamagePure.bind(this)
		]
	])
	public Remove(): boolean {
		this.Units.clear()
		return super.Remove()
	}
	public PostDataUpdate(): void {
		const owner = this.Parent
		if (owner === undefined) {
			this.Units.clear()
			return
		}
		this.Units = Units.filter(x => this.shouldValidUnit(x, owner))
	}
	protected GetPreAttackBonusDamagePure(params?: IModifierParams): [number, boolean] {
		if (params === undefined || this.IsPassiveDisabled()) {
			return [0, false]
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsBuilding || !target.IsEnemy(this.Parent)) {
			return [0, false]
		}
		let isNearUnits = false
		for (let i = this.Units.length - 1; i > -1; i--) {
			const unit = this.Units[i]
			if (unit === target) {
				continue
			}
			const isInRange = unit.Distance2D(target) <= this.cachedRadius
			if (!unit.IsCreep && isInRange) {
				isNearUnits = true
				break
			}
		}
		if (isNearUnits) {
			return [0, false]
		}
		return [this.cachedBonus, false]
	}
	protected UpdateSpecialValues(): void {
		const name = "spectre_desolate"
		this.cachedRadius = this.GetSpecialValue("radius", name)
		this.cachedBonus = this.GetSpecialValue("bonus_damage", name)
	}
	private shouldValidUnit(unit: Unit, caster: Unit): boolean {
		return (
			(unit.IsCreep || unit.IsHero || unit.IsSpiritBear) &&
			unit.IsEnemy(caster) &&
			unit.IsVisible &&
			unit.IsSpawned &&
			unit.IsAlive
		)
	}
}
