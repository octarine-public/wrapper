import { Base } from "../Extends/Helper"
import { BreakInit } from "./LinkenBreaker"

import { Utils, Ability, Item, TickSleeper, Menu, Hero } from "wrapper/Imports"
import { MouseTarget, Owner, initAbilityMap, initItemsMap } from "../Listeners"

import InitAbility from "../Extends/Abilities"
import InitItems from "../Extends/Items"

import { BladeMailItem, ComboKeyItem, State, СomboAbility, СomboItems, ComboMode, ComboModeInvis, isRunToTarget } from "../Menu"

let GameSleep = new TickSleeper()

function IsValid(item: Ability | Item, Selector: Menu.ImageSelector) {
	return item && Selector.IsEnabled(item.Name) && item.CanBeCasted()
}

function PressTheAttack(Abilities: InitAbility, Items: InitItems, target: Hero) {
	let Delay = Abilities.PressTheAttack !== undefined
		? Abilities.PressTheAttack.CastPoint * 1000
		: Items.Tick
	if (IsValid(Abilities.PressTheAttack, СomboAbility) && !Owner.IsMagicImmune) {
		if (GameSleep.Sleeping && Abilities.PressTheAttack.IsInAbilityPhase) {
			return
		}
		let Talent = Owner.GetTalentValue("special_bonus_unique_legion_commander_5"),
			ExtendsPosition = !Owner.IsMoving
				? Owner.NetworkPosition
				: Owner.InFront(Talent !== 0 ? Talent : 0 / 1000 * Owner.Speed)

		Talent !== 0
			? Owner.CastPosition(Abilities.PressTheAttack, ExtendsPosition)
			: Abilities.PressTheAttack.UseAbility(Owner)

		GameSleep.Sleep(Delay)
		Owner.AttackTarget(target)
		return
	}
	if (IsValid(Items.BlackKingBar, СomboItems)) {
		if (!GameSleep.Sleeping) {
			Items.BlackKingBar.UseAbility(Owner)
			GameSleep.Sleep(Delay)
		}
		return
	}
	if (IsValid(Items.BladeMail, СomboItems)) {
		Items.BladeMail.UseAbility(Owner)
		return
	}
	if (Items.Medallion || Items.SolarCrest) {
		let Item = Items.Medallion ? Items.Medallion : Items.SolarCrest
		if (IsValid(Item, СomboItems) && Owner.Distance2D(target) <= Item.CastRange && !target.IsMagicImmune) {
			Item.UseAbility(target)
			return
		}
	}
}

function AttackTargetCustom(target: Hero) {
	if (!GameSleep.Sleeping) {
		Owner.CanAttack(target)
			? Owner.AttackTarget(target)
			: Owner.MoveTo(target.NetworkPosition)
		GameSleep.Sleep(300)
		return
	}
}

function Init(
	Abilities: InitAbility,
	Items: InitItems,
	target: Hero,
	blockingAbilities: boolean,
	UseBlink: boolean = false,
	is_invise: boolean = false,
	callback?: () => void,
) {
	typeof callback !== "function"
		? PressTheAttack(Abilities, Items, target)
		: callback()

	if (IsValid(Items.Mjollnir, СomboItems)) {
		Items.Mjollnir.UseAbility(Owner)
		return
	}
	if (is_invise) {
		if (Items.InvisSword || Items.SilverEdge) {
			let Item = Items.InvisSword ? Items.InvisSword : Items.SilverEdge
			if (IsValid(Item, СomboItems)) {
				Item.UseAbility(Owner)
				return
			}
		}
	}
	if (Items.Armlet && !Items.Armlet.IsToggled
		&& СomboItems.IsEnabled(Items.Armlet.Name)
	) {
		if (!GameSleep.Sleeping) {
			Items.Armlet.UseAbility(Owner, true)
			GameSleep.Sleep((GetAvgLatency(Flow_t.OUT) + 0.1) * 1000)
		}
		return
	}
	if (is_invise && Owner.InvisibleLevel > 0) {
		return
	}
	if (Owner.InvisibleLevel === 0 && IsValid(Abilities.Overwhelming, СomboAbility)
		&& Owner.Distance2D(target) <= (Abilities.Overwhelming.CastRange + Owner.HullRadius)
		&& !target.IsMagicImmune
	) {
		Abilities.Overwhelming.UseAbility(target)
		GameSleep.Sleep(Abilities.Overwhelming.CastPoint * 1000)
		return
	}
	if (blockingAbilities) {
		BreakInit()
		return
	}
	if (IsValid(Items.LotusOrb, СomboItems)) {
		Items.LotusOrb.UseAbility(Owner)
		GameSleep.Sleep(Items.Tick)
		return
	}
	if (IsValid(Items.Shivas, СomboItems)) {
		Items.Shivas.UseAbility(Owner)
		GameSleep.Sleep(Items.Tick)
		return
	}
	if (UseBlink && Items.Blink.CanBeCasted()) {
		Items.Blink.UseAbility(target)
		GameSleep.Sleep(Items.Tick)
		return
	}
	if (IsValid(Items.Nullifier, СomboItems)
		&& Owner.Distance2D(target) <= (Items.Nullifier.CastRange + Owner.HullRadius)
		&& !target.IsMagicImmune
	) {
		Items.Nullifier.UseAbility(target)
		GameSleep.Sleep(Items.Tick)
		return
	}
	if (IsValid(Items.Orchid, СomboItems)
		&& Owner.Distance2D(target) <= (Items.Orchid.CastRange + Owner.HullRadius)
		&& !target.IsMagicImmune
	) {
		Items.Orchid.UseAbility(target)
		GameSleep.Sleep(Items.Tick)
		return
	}
	if (IsValid(Items.Bloodthorn, СomboItems)
		&& Owner.Distance2D(target) <= (Items.Bloodthorn.CastRange + Owner.HullRadius)
		&& !target.IsMagicImmune
	) {
		Items.Bloodthorn.UseAbility(target)
		GameSleep.Sleep(Items.Tick)
		return
	}
	if (IsValid(Items.RodofAtos, СomboItems)
		&& Owner.Distance2D(target) <= (Items.RodofAtos.CastRange + Owner.HullRadius)
		&& !target.IsMagicImmune
	) {
		Items.RodofAtos.UseAbility(target)
		GameSleep.Sleep(Items.Tick)
		return
	}
	if (IsValid(Items.Satanic, СomboItems)) {
		Items.Satanic.UseAbility(Owner)
		GameSleep.Sleep(Items.Tick)
		return
	}
	if (IsValid(Items.UrnOfShadows, СomboItems) || IsValid(Items.SpiritVesel, СomboItems)) {
		let Item = Items.UrnOfShadows ? Items.UrnOfShadows : Items.SpiritVesel
		if (Owner.Distance2D(target) <= (Item.CastRange + Owner.HullRadius) && !target.IsMagicImmune) {
			Item.UseAbility(Owner)
			GameSleep.Sleep(Items.Tick)
			return
		}
	}
	if (IsValid(Abilities.Duel, СomboAbility)
		&& Owner.Distance2D(target) <= (Abilities.Duel.CastRange + Owner.HullRadius)
	) {
		Abilities.Duel.UseAbility(target)
		GameSleep.Sleep(Abilities.Duel.CastPoint * 1000)
		return
	}

	AttackTargetCustom(target)
}

function CastInvis(Abilities: InitAbility, Items: InitItems, blockingAbilities: boolean, target: Hero) {
	Init(Abilities, Items, target, blockingAbilities, false, true, () => {
		if (ComboModeInvis.value) {
			PressTheAttack(Abilities, Items, target)
		} else {
			if (Owner.IsInRange(target, (Abilities.Duel && Abilities.Duel.CastRange + Owner.HullRadius))) {
				PressTheAttack(Abilities, Items, target)
			}
		}
	})
}

export function InitCombo() {
	if (!Base.IsRestrictions(State) || !ComboKeyItem.is_pressed || GameSleep.Sleeping) {
		return
	}
	let target = MouseTarget
	if (target === undefined || (BladeMailItem.value
		&& target.HasModifier("modifier_item_blade_mail_reflect"))
	) {
		if (isRunToTarget.value) {
			Owner.MoveTo(Utils.CursorWorldVec)
			GameSleep.Sleep(300)
		}
		return
	}
	let cancelAdditionally = Base.CancelAdditionally(target),
		blockingAbilities = Base.IsBlockingAbilities(target),
		Items = initItemsMap.get(Owner),
		Abilities = initAbilityMap.get(Owner)
	if (Abilities === undefined || Items === undefined) {
		return
	}
	if (Base.Cancel(target) && cancelAdditionally) {
		if (!Owner.IsVisibleForEnemies
			&& Owner.ModifiersBook.HasAnyBuffByNames(["modifier_item_invisibility_edge_windwalk", "modifier_item_silver_edge_windwalk"])
		) {
			AttackTargetCustom(target)
			return
		}
		if (ComboMode.selected_id === 1 || Owner.IsVisibleForEnemies) {
			if (Owner.IsInRange(target, (Abilities.Duel.CastRange + Owner.HullRadius))) {
				Init(Abilities, Items, target, blockingAbilities)
				return
			} else if (Items.Blink
				&& Items.Blink.CanBeCasted()
				&& СomboItems.IsEnabled(Items.Blink.Name)
				&& Owner.IsInRange(target, (Items.Blink.AOERadius - (Owner.HullRadius + target.HullRadius)))
			) {
				Init(Abilities, Items, target, blockingAbilities, true)
				return
			}
			else {
				if (Items.InvisSword || Items.SilverEdge) {
					CastInvis(Abilities, Items, blockingAbilities, target)
				}
				AttackTargetCustom(target)
				return
			}
		} else { // IsInvisible
			CastInvis(Abilities, Items, blockingAbilities, target)
			return
		}
	}
	return
}

export function GameEndedCombo() {
	GameSleep.ResetTimer()
}