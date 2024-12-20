import { WrapperClassModifier } from "../../../../Decorators"
import { EModifierfunction } from "../../../../Enums/EModifierfunction"
import { EventPriority } from "../../../../Enums/EventPriority"
import { GameActivity } from "../../../../Enums/GameActivity"
import { EntityManager } from "../../../../Managers/EntityManager"
import { EventsSDK } from "../../../../Managers/EventsSDK"
import { GameState } from "../../../../Utils/GameState"
import { FakeUnit } from "../../../Base/FakeUnit"
import { Hero } from "../../../Base/Hero"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

@WrapperClassModifier()
export class modifier_tusk_walrus_punch extends Modifier {
	public LastUpdateAnimationInternal = 0

	private cachedDamage = 0
	private cachedCritDamage = 0

	protected readonly DeclaredFunction = new Map([
		[
			EModifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
			this.GetPreAttackBonusDamage.bind(this)
		],
		[
			EModifierfunction.MODIFIER_PROPERTY_CRITICAL_STRIKE_BONUS,
			this.GetCriticalStrikeBonus.bind(this)
		]
	])

	public get IsAnimation(): boolean {
		return this.LastUpdateAnimationInternal > GameState.RawGameTime
	}

	protected GetPreAttackBonusDamage(params?: IModifierParams): [number, boolean] {
		return this.isValidDamage(params) ? [this.cachedDamage, false] : [0, false]
	}

	protected GetCriticalStrikeBonus(params?: IModifierParams): [number, boolean] {
		return this.isValidDamage(params) ? [this.cachedCritDamage, false] : [0, false]
	}

	protected UpdateSpecialValues(): void {
		const name = "tusk_walrus_punch"
		this.cachedDamage = this.GetSpecialValue("bonus_damage", name)
		this.cachedCritDamage = this.GetSpecialValue("crit_multiplier", name)
	}

	private isValidDamage(params?: IModifierParams) {
		if (params === undefined) {
			return false
		}
		const ability = this.Ability
		if (ability === undefined || !ability.IsReady) {
			return false
		}
		const target = EntityManager.EntityByIndex<Unit>(params.SourceIndex)
		if (target === undefined || target.IsBuilding) {
			return false
		}
		return ability.IsAutoCastEnabled || this.IsAnimation
	}
}

const activitiles: GameActivity[] = [
	GameActivity.ACT_DOTA_CAST_ABILITY_4,
	GameActivity.ACT_DOTA_RUN,
	GameActivity.ACT_DOTA_ATTACK,
	GameActivity.ACT_DOTA_ATTACK2,
	GameActivity.ACT_DOTA_ATTACK_EVENT
]

function NetworkActivityChanged(unit: Unit) {
	if (!unit.IsHero || (unit.IsIllusion && !unit.IsStrongIllusion)) {
		return
	}
	const modifier = unit.GetBuffByClass(modifier_tusk_walrus_punch)
	if (modifier === undefined) {
		return
	}
	if (modifier.IsAnimation && !activitiles.includes(unit.NetworkActivity)) {
		modifier.LastUpdateAnimationInternal = 0
	}
}

function UnitAddGesture(unit: Nullable<Unit | FakeUnit>, activity: GameActivity) {
	if (!(unit instanceof Hero) || !activitiles.includes(activity)) {
		return
	}
	if (!unit.IsHero || (unit.IsIllusion && !unit.IsStrongIllusion)) {
		return
	}
	const modifier = unit.GetBuffByClass(modifier_tusk_walrus_punch)
	if (modifier !== undefined) {
		modifier.LastUpdateAnimationInternal = GameState.RawGameTime + unit.AttackPoint
	}
}

EventsSDK.on(
	"NetworkActivityChanged",
	unit => NetworkActivityChanged(unit),
	EventPriority.HIGH
)

EventsSDK.on(
	"UnitAddGesture",
	(unit, activity) => UnitAddGesture(unit, activity),
	EventPriority.HIGH
)
