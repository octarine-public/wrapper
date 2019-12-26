import { Unit, Ability, TickSleeper, EntityManager, Hero } from "wrapper/Imports"
import ItemManagerBase from "../../abstract/Base"
import { StateBase } from "../../abstract/MenuBase"
import {
	State,
	ItemsOfDisable,
	AbilityOfDisable,
	ImportantAbility,
	AngryDisablerState,
	ScrollDisableItems,
	AntiChannelingState,
	ItemsOfDisableState,
	ScrollDisableItemsState,
} from "./Menu"
import { Disabler_Abilities, Disable_Items, Disable_Important } from "./Data"

let Disable = false
let Sleep = new TickSleeper()
let Base = new ItemManagerBase()

export function GetItemsBy(items: any, key: string) {
	let array = []
	for (var i in items)
		if (items[i][key])
			array.push(i)
	return array
}

function UseDisable(unit: Unit, enemy: Unit, abil: Ability) {
	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET)
		&& enemy.IsMagicImmune && enemy.IsInvulnerable)
		return false
	unit.UseSmartAbility(abil, enemy)
	Sleep.Sleep(Base.GetDelayCast + 50)
	return Disable = true
}

function IsReady(unit: Unit, enemy: Unit, abil: Ability | undefined) {
	if (abil === undefined || !abil.CanBeCasted() || (AngryDisablerState.value && abil.Name === "silencer_global_silence"))
		return false
	if ((abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET) && enemy.Distance2D(unit) > abil.AOERadius)
		|| (!abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET) && !abil.CanHit(enemy)))
		return false
	return !UseDisable(unit, enemy, abil)
}

function filter(unit: Unit, enemy: Unit, items: string[] = []) {
	if (Disable)
		return
	// dafuq
	if (items.length !== 0) {
		items.some(item => ScrollDisableItems.IsEnabled(item)
			&& IsReady(unit, enemy, unit.GetItemByName(item)))
	} else if (ItemsOfDisableState.value) {
		GetItemsBy(Disable_Items, "abil").some(item => ItemsOfDisable.IsEnabled(item)
			&& IsReady(unit, enemy, unit.GetItemByName(item)))
	}
	if (Disable /*|| enemy.HasBuffByName("modifier_teleporting") */)
		return
	Disabler_Abilities.some(abil => AbilityOfDisable.IsEnabled(abil) && IsReady(unit, enemy, unit.GetAbilityByName(abil)))
}

function AutoDisable(unit: Unit) {
	if (!unit.IsAlive || !unit.IsControllable)
		return false
	let EnemyHeroes = EntityManager.GetEntitiesByClass(Hero)
	for (var i = 0, len = EnemyHeroes.length; i < len; i++) {
		let hero = EnemyHeroes[i]
		if (!hero.IsEnemy() || hero.IsStunned || hero.IsHexed || hero.IsSilenced)
			continue
		Disable = false
		if (AngryDisablerState.value) {
			filter(unit, hero)
			continue
		}
		if (ScrollDisableItemsState.value && hero.HasBuffByName("modifier_teleporting"))
			filter(unit, hero, ScrollDisableItems.values)

		if (Disable)
			return
		if (AntiChannelingState.value) {
			if (hero.IsChanneling)
				filter(unit, hero)
			continue
		}
		Disable_Important.some(abil => {
			if (!ImportantAbility.IsEnabled(abil))
				return false
			let ability = hero.GetAbilityByName(abil)
			if (ability?.IsChanneling || ability?.IsInAbilityPhase) {
				filter(unit, hero)
				return false
			}
		})
	}
}

export function Tick() {
	if (!StateBase.value || !State.value || Sleep.Sleeping)
		return
	if (EntityManager.GetEntitiesByClass(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY).some(AutoDisable))
		return
}
export function GameEnded() {
	Sleep.ResetTimer()
}
