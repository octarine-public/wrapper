import { WrapperClassModifier } from "../../../../Decorators"
import { EntityManager } from "../../../../Managers/EntityManager"
import { EventsSDK } from "../../../../Managers/EventsSDK"
import { GameState } from "../../../../Utils/GameState"
import { Ability } from "../../../Base/Ability"
import { Hero } from "../../../Base/Hero"
import { Modifier } from "../../../Base/Modifier"
import { Unit } from "../../../Base/Unit"

class DamageTracker {
	constructor(
		public readonly Damage: number,
		public readonly LastDamageTime = 0
	) {}

	public get IsExpired() {
		return GameState.RawGameTime >= this.LastDamageTime
	}
}

@WrapperClassModifier()
export class modifier_nyx_assassin_jolt_damage_tracker extends Modifier {
	public EchoDuration = 0
	public BonusTotalDamage = 0
	public readonly BonusDamages: DamageTracker[] = []

	protected readonly CanPostDataUpdate = true

	public PostDataUpdate(): void {
		const owner = this.Parent,
			abil = this.Ability,
			caster = this.Caster
		if (owner === undefined || abil === undefined || caster === undefined) {
			this.BonusDamages.clear()
			return
		}
		this.BonusDamages.removeCallback(x => x.IsExpired)
		this.BonusTotalDamage = this.reduceDamage(abil, owner)
	}

	protected UpdateSpecialValues(): void {
		this.EchoDuration = this.GetSpecialValue(
			"damage_echo_duration",
			"nyx_assassin_jolt"
		)
	}

	private reduceDamage(abil: Ability, owner: Unit): number {
		let totalDamage = 0
		const castTime = GameState.RawGameTime + abil.GetCastDelay(owner)
		for (let i = this.BonusDamages.length - 1; i > -1; i--) {
			const obj = this.BonusDamages[i]
			if (obj.LastDamageTime >= castTime) {
				totalDamage += obj.Damage
			}
		}
		return totalDamage
	}
}

EventsSDK.on("GameEvent", (name, obj) => {
	if (name !== "entity_hurt" || obj.damage === 0) {
		return
	}
	const victim = EntityManager.EntityByIndex(obj.entindex_killed),
		attacker = EntityManager.EntityByIndex(obj.entindex_attacker),
		inflictor = EntityManager.EntityByIndex(obj.entindex_inflictor)
	if (!(attacker instanceof Hero) || !(victim instanceof Hero)) {
		return
	}
	if (!victim.IsEnemy(attacker) || !attacker.IsRealHero || !victim.IsRealHero) {
		return
	}
	const modifier = victim.GetBuffByClass(modifier_nyx_assassin_jolt_damage_tracker)
	if (modifier === undefined || modifier.EchoDuration === 0) {
		return
	}
	if (modifier.Caster !== attacker) {
		return
	}
	if (inflictor === modifier.Ability) {
		modifier.BonusDamages.clear()
	}
	modifier.BonusDamages.push(
		new DamageTracker(obj.damage, GameState.RawGameTime + modifier.EchoDuration)
	)
})
