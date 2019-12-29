//@ts-nocheck
import { Base } from "../Extends/Helper"
import { BreakInit } from "./LinkenBreaker"

import { Utils, Ability, Item, TickSleeper, Menu, Hero, Flow_t } from "wrapper/Imports"
import { MouseTarget, Owner, initAbilityMap, initItemsMap, initHitAndRunMap } from "../Listeners"

import InitItems from "../Extends/Items"
import HitAndRun from "../Extends/HitAndRun"
import InitAbility from "../Extends/Abilities"

import {
	BladeMailItem,
	ComboKeyItem,
	State,
	СomboAbility,
	СomboItems,
	ComboMode,
	ComboModeInvis,
	isRunToTarget,
	StyleCombo,
	ComboHitAndRunAttack,
	TypeHitAndRun
} from "../Menu"

let GameSleep = new TickSleeper(),
	ComboActived = false

ComboKeyItem.OnRelease(() => ComboActived = !ComboActived)

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
				? Owner.Position
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
	if (Items.Armlet && !Items.Armlet.IsToggled
		&& СomboItems.IsEnabled(Items.Armlet.Name)
	) {
		if (!GameSleep.Sleeping) {
			Items.Armlet.UseAbility(Owner, true)
			GameSleep.Sleep((GetAvgLatency(Flow_t.OUT) + 0.1) * 1000)
		}
		return
	}
	if (IsValid(Items.BladeMail, СomboItems)) {
		Items.BladeMail.UseAbility(Owner)
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
}
function AttackTargetHitAndRun(target: Hero, HitAndRun_Unit: HitAndRun) {
	if (!Owner.CanAttack(target) || (!HitAndRun_Unit.ExecuteTo(target, TypeHitAndRun.selected_id)
		&& ComboHitAndRunAttack.value) || !ComboHitAndRunAttack.value)
		return
	Owner.AttackTarget(target)
}
function AttackTargetCustom(target: Hero) {
	if (!GameSleep.Sleeping) {
		Owner.CanAttack(target)
			? Owner.AttackTarget(target)
			: Owner.MoveTo(target.Position)
		GameSleep.Sleep(250)
		return
	}
}

function Init(
	HitAndRun_Unit: HitAndRun,
	target: Hero,
	Items: InitItems,
	Abilities: InitAbility,
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
			let item = Items.InvisSword !== undefined ? Items.InvisSword : Items.SilverEdge
			if (IsValid(item, СomboItems)) {
				item.UseAbility(Owner)
				return
			}
		}
	}
	if (is_invise && Owner.InvisibleLevel > 0) {
		return
	}
	if (Owner.InvisibleLevel === 0 && IsValid(Abilities.Overwhelming, СomboAbility)
		&& Owner.Distance2D(target) <= (Abilities.Overwhelming.CastRange + Owner.HullRadius)
		&& !target.IsMagicImmune
	) {
		Abilities.Overwhelming.UseAbility(target.VelocityWaypoint(Abilities.Overwhelming.CastPoint * 2))
		GameSleep.Sleep(Abilities.Overwhelming.CastPoint * 1000)
		return
	}
	if (Items.Medallion || Items.SolarCrest) {
		let item = Items.Medallion !== undefined ? Items.Medallion : Items.SolarCrest
		if (IsValid(item, СomboItems) && Owner.IsInRange(target, item.CastRange) && !target.IsMagicImmune) {
			item.UseAbility(target)
			return
		}
	}
	if (UseBlink && Items.Blink.CanBeCasted()) {
		Items.Blink.UseAbility(target)
		GameSleep.Sleep(Items.Tick)
		return
	}
	if (blockingAbilities) {
		BreakInit()
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
		let item = Items.UrnOfShadows !== undefined ? Items.UrnOfShadows : Items.SpiritVesel
		if (Owner.IsInRange(target, item.CastRange) && !target.IsMagicImmune) {
			item.UseAbility(Owner)
			GameSleep.Sleep(Items.Tick)
			return
		}
	}
	if (IsValid(Abilities.Duel, СomboAbility)
		&& Owner.Distance2D(target) <= (Abilities.Duel.CastRange + Owner.HullRadius)
	) {
		Abilities.Duel.UseAbility(target)
		return
	}
	Abilities.Duel && !Abilities.Duel.CanBeCasted()
		? AttackTargetHitAndRun(target, HitAndRun_Unit)
		: AttackTargetCustom(target)
}

function CastInvis(HitAndRun_Unit: HitAndRun, Abilities: InitAbility, Items: InitItems, blockingAbilities: boolean, target: Hero) {
	Init(HitAndRun_Unit, target, Items, Abilities, blockingAbilities, false, true, () => {
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
	if (!Base.IsRestrictions(State) || GameSleep.Sleeping) {
		return
	}
	if ((StyleCombo.selected_id === 1 && !ComboActived) || (StyleCombo.selected_id === 0 && !ComboKeyItem.is_pressed)) {
		return
	}
	let target = MouseTarget
	if (target === undefined || (BladeMailItem.value
		&& target.HasBuffByName("modifier_item_blade_mail_reflect"))
	) {
		if (!isRunToTarget.value)
			return
		Owner.MoveTo(Utils.CursorWorldVec)
		GameSleep.Sleep(250)
		return
	}
	let cancelAdditionally = Base.CancelAdditionally(target),
		blockingAbilities = Base.IsBlockingAbilities(target),
		Items = initItemsMap.get(Owner),
		Abilities = initAbilityMap.get(Owner),
		HitAndRun_Unit = initHitAndRunMap.get(Owner)

	if (Abilities === undefined || Items === undefined || HitAndRun_Unit === undefined) {
		return
	}
	if (Base.Cancel(target) && cancelAdditionally) {
		if (!Owner.IsVisibleForEnemies
			&& Owner.ModifiersBook.HasAnyBuffByNames(["modifier_item_invisibility_edge_windwalk", "modifier_item_silver_edge_windwalk"])
		) {
			Abilities.Duel && !Abilities.Duel.CanBeCasted()
				? AttackTargetHitAndRun(target, HitAndRun_Unit)
				: AttackTargetCustom(target)
			return
		}
		if (ComboMode.selected_id === 1 || Owner.IsVisibleForEnemies) {
			if (Owner.IsInRange(target, (Abilities.Duel.CastRange + Owner.HullRadius))) {
				Init(HitAndRun_Unit, target, Items, Abilities, blockingAbilities)
				return
			} else if (Items.Blink
				&& Items.Blink.CanBeCasted()
				&& СomboItems.IsEnabled(Items.Blink.Name)
				&& Owner.IsInRange(target, Items.Blink.CastRange - (Abilities.Duel.CastRange + (Owner.HullRadius + target.HullRadius)))
			) {
				Init(HitAndRun_Unit, target, Items, Abilities, blockingAbilities, true)
				return
			} else {
				if (Items.InvisSword || Items.SilverEdge) {
					CastInvis(HitAndRun_Unit, Abilities, Items, blockingAbilities, target)
				}
				Abilities.Duel && !Abilities.Duel.CanBeCasted()
					? AttackTargetHitAndRun(target, HitAndRun_Unit)
					: AttackTargetCustom(target)
				return
			}
		} else { // IsInvisible
			CastInvis(HitAndRun_Unit, Abilities, Items, blockingAbilities, target)
			return
		}
	}
	return
}

export function GameEndedCombo() {
	GameSleep.ResetTimer()
	ComboActived = false
}
