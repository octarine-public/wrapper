import { Ability, TickSleeper, Hero, Game, Vector3, GameSleeper, Unit, Utils } from "wrapper/Imports";

import { Base } from "../Extends/Helper";
import { Owner, MouseTarget } from "../Listeners";

import InitItems from "../Extends/Items"
import InitAbility from "../Extends/Abilities"

import { State, СomboAbility, СomboItems, ComboKeyItem, BladeMailCancel} from "../Menu";
let Sleep: TickSleeper = new TickSleeper
function IsValidAbility(ability: Ability, target: Hero) {
	return ability !== undefined && ability.IsReady
		&& ability.CanBeCasted() && СomboAbility.IsEnabled(ability.Name)
		&& Owner.Distance2D(target) <= ability.CastRange && !Sleep.Sleeping
}
function IsValidItems(Item: Ability, target: Hero) {
	return Item !== undefined && Item.IsReady
		&& Item.CanBeCasted() && СomboItems.IsEnabled(Item.Name)
		&& Owner.Distance2D(target) <= Item.CastRange && !Sleep.Sleeping
}
export function InitCombo() {
	if (!Base.IsRestrictions(State) || !ComboKeyItem.is_pressed || Sleep.Sleeping) {
		return false
	}
	let target = MouseTarget
	if (target === undefined || target.IsMagicImmune || !target.IsAlive) {
		return false
	}
	if (BladeMailCancel.value && target.HasModifier("modifier_item_blade_mail_reflect")) {
		return false
	}
	let Abilities = new InitAbility(Owner),
		Items = new InitItems(Owner),
		cycloneDebuff = target.GetBuffByName("modifier_eul_cyclone"),
		possibleRange = (Owner.Speed * 0.8),
		DistpossibleRange = 1175 + 0.75 * possibleRange
		
	if (IsValidItems(Items.Discord, target) && !target.IsInvulnerable) {
		Items.Discord.UseAbility(target)
		Sleep.Sleep(Items.Tick)
		return true
	}
	if (IsValidItems(Items.Ethereal, target) && !target.IsInvulnerable) {
		Items.Ethereal.UseAbility(target)
		Sleep.Sleep(Items.Tick + 450)
		return true
	}	
	if (
		Items.Dagon !== undefined && Items.Dagon.IsReady
		&& Items.Dagon.CanBeCasted() && СomboItems.IsEnabled("item_dagon_5")
		&& Owner.Distance2D(target) <= Items.Dagon.CastRange && !target.IsInvulnerable) {
		Items.Dagon.UseAbility(target)
		Sleep.Sleep(Items.Tick)
		return true
	}
	// EulCombo
	if (Abilities.Requiem === undefined) {
		return false
	}
	
	if (!target.HasModifier("modifier_eul_cyclone")) {
		if (IsValidItems(Items.Cyclone, target)
			&& Abilities.Requiem.CanBeCasted()
			&& Owner.IsInRange(target, Items.Blink !== undefined && СomboItems.IsEnabled(Items.Blink.Name) 
			&& Items.Blink.CanBeCasted() 
			? DistpossibleRange
			: 285)
		) {
			Items.Cyclone.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return true
		}
	}
	
	if (cycloneDebuff !== undefined 
		&& Abilities.Requiem.CanBeCasted()
	) {
		let CastTime = Abilities.Requiem.CastPoint + (GetAvgLatency(Flow_t.OUT)),
			blink_pos = target.Position.Add(Owner.NetworkPosition.Subtract(target.NetworkPosition).Normalize().ScaleTo(0.75 * possibleRange))
			
		// TODO => Select for User
		// if (cycloneDebuff.Caster !== Owner) {
		// 	return false
		// }
		
		if (Items.BlackKingBar !== undefined && Items.BlackKingBar.IsReady
			&& Items.BlackKingBar.CanBeCasted() && СomboItems.IsEnabled(Items.BlackKingBar.Name)
		) {
			Items.BlackKingBar.UseAbility(Owner)
			Sleep.Sleep(Items.Tick)
			return true
		}
		if (!Owner.IsInRange(target, possibleRange)) {
			if (Items.Blink !== undefined
				&& СomboItems.IsEnabled(Items.Blink.Name)
				&& Items.Blink.CanBeCasted()
				&& Owner.IsInRange(target, DistpossibleRange)
			) {
				Items.Blink.UseAbility(blink_pos)
				Sleep.Sleep(Items.Tick)
				return true
			}
			else {
				Owner.MoveTo(target.NetworkPosition)
				return true
			}
		}
		if (!Owner.IsInRange(target, 64 / 2)) {
			Owner.MoveTo(target.NetworkPosition)
			Sleep.Sleep(Items.Tick)
			return false
		} else {
			if (IsValidAbility(Abilities.Requiem, target)
				&& cycloneDebuff.DieTime - Game.RawGameTime <= CastTime
			) {
				Abilities.Requiem.UseAbility(target.NetworkPosition)
				Sleep.Sleep(Abilities.Tick)
				return true
			}
		}
	}
	else {
		if (IsValidItems(Items.Sheeps, target) && !target.IsInvulnerable) {
			Items.Sheeps.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return true
		}
		if (IsValidItems(Items.Bloodthorn, target) && !target.IsInvulnerable) {
			Items.Bloodthorn.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return true
		}
		if (IsValidItems(Items.Orchid, target) && !target.IsInvulnerable) {
			Items.Orchid.UseAbility(target)
			Sleep.Sleep(Items.Tick)
			return true
		}
		if (IsValidItems(Items.Shivas, target) && !target.IsInvulnerable) {
			Items.Shivas.UseAbility()
			Sleep.Sleep(Items.Tick)
			return true
		}
		if (!Owner.IsInRange(target, Owner.AttackRange)) {
			Owner.MoveTo(target.Position)
			Sleep.Sleep(Items.Tick)
			return true
		}
	}
	return false
}
export function ComboGameEnded() {
	Sleep.ResetTimer()
}