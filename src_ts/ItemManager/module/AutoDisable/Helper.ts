import ItemManagerBase from "abstract/Base";
import { AlliesUnits, EnemyHeroes } from "Core/Listeners"
import { Unit, Ability, Game, TickSleeper } from "wrapper/Imports"
import { StateBase } from "abstract/MenuBase"
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
} from "Menu";
import { Disabler_Abilities, Disable_Items, Disable_Important } from "./Data";


let Disable = false
let Sleep = new TickSleeper
let Base: ItemManagerBase = new ItemManagerBase

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
	unit.UseSmartAbility(abil, enemy);
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
	items.length !== 0
		? items.some(item => ScrollDisableItems.IsEnabled(item)
			&& IsReady(unit, enemy, unit.GetItemByName(item)))
		: ItemsOfDisableState.value && GetItemsBy(Disable_Items, "abil").some(item => ItemsOfDisable.IsEnabled(item)
			&& IsReady(unit, enemy, unit.GetItemByName(item)))
	if (Disable /*|| enemy.HasBuffByName("modifier_teleporting") */)
		return
	Disabler_Abilities.some(abil => AbilityOfDisable.IsEnabled(abil) && IsReady(unit, enemy, unit.GetAbilityByName(abil)))
}

function AutoDisable(unit: Unit) {
	if (!unit.IsAlive || !unit.IsControllable)
		return false
	for (var i = 0, len = EnemyHeroes.length; i < len; i++) {
		let enemy = EnemyHeroes[i]
		if (enemy.IsStunned || enemy.IsHexed || enemy.IsSilenced)
			continue
		Disable = false
		if (AngryDisablerState.value) {
			filter(unit, enemy)
			continue
		}
		if (ScrollDisableItemsState.value && enemy.HasBuffByName("modifier_teleporting"))
			filter(unit, enemy, ScrollDisableItems.values)

		if (Disable)
			return
		if (AntiChannelingState.value) {
			if (enemy.IsChanneling)
				filter(unit, enemy);
			continue
		}
		Disable_Important.some(abil => {
			if (!ImportantAbility.IsEnabled(abil))
				return false
			let ability = enemy.GetAbilityByName(abil)
			if (ability?.IsChanneling || ability?.IsInAbilityPhase) {
				filter(unit, enemy)
				return false
			}
		})
	}
}

export function Init() {
	if (!StateBase.value || !State.value || Game.IsPaused || Sleep.Sleeping)
		return
	if (AlliesUnits.some(AutoDisable))
		return
}
export function GameEnded() {
	Sleep.ResetTimer()
}