import { execute_ability } from "../Data"
import { UnitsOrbWalker, XIAOlinkenItems } from "../../../Core/bootstrap"
import { Unit, Ability, Menu, Input, Item, GameSleeper, EventsSDK, item_aeon_disk, skywrath_mage_arcane_bolt, skywrath_mage_ancient_seal } from "wrapper/Imports"

import SkyAbilitiesHelper from "../Extentd/Abilities"

import {
	SkyBlink,
	ItemsMenu,
	AbilityMenu,
	ACItemsMenu,
	ACAbilityMenu,
	XAIOComboKey,
	XAIOStyleCombo,
	SkyProjectileItems,
	SkyAutoComboDisableWhen,
	SkyAutoComboMinHPpercent,
	LinkenBreakAbilityItems,
	SkyAutoComboState,
	XAIOOrbWalkerState,
	XAIOOrbWalkerSwitchState,
	SkyAutoComboTargetSelector
} from "../Menu"

export let ComboActived: boolean = false

let GameSleep = new GameSleeper()
let Helper = new SkyAbilitiesHelper()

XAIOComboKey.OnRelease(() => ComboActived = !ComboActived)


let LinkenBreakClassItems: (typeof Ability)[] = [
	skywrath_mage_arcane_bolt,
	skywrath_mage_ancient_seal,
	...XIAOlinkenItems
]
let custom_item: string[] = [
	"item_dagon_",
	"item_rod_of_atos",
	"item_clumsy_net",
	"item_ethereal_blade",
	"item_blink",
	"item_sheepstick",
	"item_nullifier"
]

export function XAIOSKYSmartCast(
	Owner: Unit,
	target: Unit,
	Helper: SkyAbilitiesHelper,
	abil_class: Constructor<Ability>,
	ItemMenu: Menu.ImageSelector,
	AbilitiesMenu: Menu.ImageSelector,
	OrbWalkerState: boolean,
) {
	if (Owner.IsIllusion || target.IsMagicImmune)
		return false

	let abil = Owner.GetAbilityByClass(abil_class) ?? Owner.GetItemByClass(abil_class as Constructor<Item>)

	if (abil === undefined || !ItemMenu.IsEnabled(abil.Name.includes("item_dagon") ? "item_dagon_5" : abil.Name) && !AbilitiesMenu.IsEnabled(abil.Name))
		return false

	let sheepbuff = target.GetBuffByName("modifier_sheepstick_debuff"),
		atosbuff = target.GetBuffByName("modifier_rod_of_atos_debuff"),
		clumsybuff = target.GetBuffByName("modifier_clumsy_net_ensnare"),
		etherealbuff = target.ModifiersBook.GetAnyBuffByNames(["modifier_item_ethereal_blade_slow", "modifier_item_ethereal_blade_ethereal"])


	if (abil.Name === "item_blink") {

		let castRange = abil.CastRange + Owner.CastRangeBonus,
			blinkPos = target.Position.Extend(Input.CursorOnWorld, SkyBlink.value)

		if (Owner.Distance2D(blinkPos) > castRange)
			blinkPos = Owner.Position.Extend(blinkPos, castRange - 1)

		if (Helper.UseAbility(abil, OrbWalkerState, blinkPos))
			return true
	}

	if (!abil.CanHit(target))
		return false

	if (abil.Name === "item_clumsy_net") {
		if (clumsybuff?.IsValid && clumsybuff.RemainingTime >= 0.5)
			return false
		if (Helper.UseAbility(abil, OrbWalkerState, target)) {
			if (!SkyProjectileItems.IsEnabled(abil.Name))
				return true
			GameSleep.Sleep(abil.GetHitTime(target.Position) + 30, "await_projectile")
			return true
		}
	}

	if (abil.Name === "item_ethereal_blade") {
		if (etherealbuff?.IsValid && etherealbuff.RemainingTime >= 0.8)
			return false
		if (Helper.UseAbility(abil, OrbWalkerState, target)) {
			GameSleep.Sleep(abil.GetHitTime(target.Position) + 30, "await_ethereal", true)
			if (!SkyProjectileItems.IsEnabled(abil.Name))
				return true
			GameSleep.Sleep(abil.GetHitTime(target.Position), "await_projectile", true)
			return true
		}
	}

	if (abil.Name.includes("item_dagon")) {
		if (!GameSleep.Sleeping("await_ethereal"))
			if (Helper.UseAbility(abil, OrbWalkerState, target))
				return true
	}

	if (abil.Name === "skywrath_mage_concussive_shot") {
		if (Helper.UseAbility(abil)) {
			if (!SkyProjectileItems.IsEnabled(abil.Name))
				return true
			GameSleep.Sleep(abil.GetHitTime(target.Position) + 30, "await_projectile", true)
			return true
		}
	}

	if (abil.Name === "item_rod_of_atos") {
		if (atosbuff?.IsValid && atosbuff.RemainingTime >= 0.5)
			return false
		if (Helper.UseAbility(abil, OrbWalkerState, target)) {
			if (!SkyProjectileItems.IsEnabled(abil.Name))
				return true

			if (GameSleep.Sleeping("await_projectile")) // fast any projectile
				GameSleep.FullReset()

			GameSleep.Sleep(abil.GetHitTime(target.Position) + 30, "await_projectile")
			return true
		}
	}

	if (abil.Name === "item_sheepstick") {
		if (sheepbuff?.IsValid && sheepbuff?.RemainingTime >= 0.3)
			return false
		if (Helper.UseAbility(abil, OrbWalkerState, target))
			return true
	}

	if (abil.Name === "skywrath_mage_mystic_flare") {
		if (!GameSleep.Sleeping("await_projectile") || (atosbuff?.IsValid && atosbuff.RemainingTime >= 1))
			if (Helper.UseAbilityExtend(abil, target, ItemMenu.IsEnabled("item_ultimate_scepter")))
				return true
	}

	if (abil.Name === "item_nullifier") {
		let AeonDisk = target.GetItemByClass(item_aeon_disk)
		if (AeonDisk === undefined) {
			if (Helper.UseAbility(abil, OrbWalkerState, target))
				return true
		} else if (AeonDisk !== undefined && target.HPPercent <= 70) {
			if (Helper.UseAbility(abil, OrbWalkerState, target))
				return true
		}
	}

	if (abil.Name !== "skywrath_mage_concussive_shot" && abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET))
		if (Helper.UseAbility(abil))
			return true

	if (abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) && !custom_item.some(name => name.includes(abil!.Name)))
		if (Helper.UseAbility(abil, OrbWalkerState, target))
			return true

	if (abil.Name !== "skywrath_mage_mystic_flare" && abil.HasBehavior(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT))
		if (Helper.UseAbility(abil, OrbWalkerState, target))
			return true
}

export function XIAOSKYCombo(unit: Unit, target: Nullable<Unit>) {

	if (target === undefined || unit.IsInvulnerable || target.IsInvulnerable)
		return

	if ((XAIOStyleCombo.selected_id === 1 && !ComboActived) || (XAIOStyleCombo.selected_id === 0 && !XAIOComboKey.is_pressed))
		return

	if (Helper.IsBlockingAbilities(unit, target, LinkenBreakClassItems, XAIOOrbWalkerState.value, LinkenBreakAbilityItems))
		return

	if (execute_ability.some(class_name => XAIOSKYSmartCast(unit, target, Helper, class_name, ItemsMenu, AbilityMenu, XAIOOrbWalkerState.value)))
		return

	if (!XAIOOrbWalkerState.value)
		return

	let orbWalker = UnitsOrbWalker.get(unit)

	if (orbWalker === undefined)
		return

	if (!orbWalker.Execute(target, XAIOOrbWalkerSwitchState.selected_id))
		return

	unit.AttackTarget(target)
}

export function XIAOSKYAutoCombo(unit: Unit, targetMouse: Unit, targetInRange: Unit) {

	if (!SkyAutoComboState.value || (unit.InvisibleLevel !== 0 && !unit.IsVisibleForEnemies))
		return

	let target = SkyAutoComboTargetSelector.selected_id === 0 ? targetMouse : targetInRange

	if (SkyAutoComboDisableWhen.value && (XAIOStyleCombo.selected_id === 1 && ComboActived) || (XAIOStyleCombo.selected_id === 0 && XAIOComboKey.is_pressed))
		return

	if (target === undefined || !target.IsVisible || target.IsInvulnerable || !Helper.TriggerAutoCombo(target))
		return

	if (target.HPPercent > SkyAutoComboMinHPpercent.value && SkyAutoComboMinHPpercent.value !== 0)
		return

	if (Helper.IsBlockingAbilities(unit, target, XIAOlinkenItems, false, LinkenBreakAbilityItems))
		return

	if (execute_ability.some(abil_str => XAIOSKYSmartCast(unit, target, Helper, abil_str, ACItemsMenu, ACAbilityMenu, false)))
		return

}

EventsSDK.on("GameEnded", () => {
	GameSleep.FullReset()
	ComboActived = false
})
