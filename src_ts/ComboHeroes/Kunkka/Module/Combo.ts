import { GameSleeper, Utils, Game, Vector3, Ability, Hero, Item, Entity, TickSleeper } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { Owner, MouseTarget } from "../Listeners"

import InitItems from "../Extends/Items"
import InitAbility from "../Extends/Abilities"
import {
	State, ComboKeyItem, BlinkRadius, //HarassModeCombo, 
	СomboItems, AutoComboMenu, СomboAbility, ComboKeyTorrent, BladeMailItem 
} from "../Menu"

// import { BreakInit } from "./LinkenBreaker"
export let ShipCombo: boolean = false
export let XMarkCastTime: number = 0
export let ComboTimer: number = 0
export let XMarkPos: Vector3 = new Vector3
export let XMarkType: number = 0

let Sleep: TickSleeper = new TickSleeper, 
	AutoCombo: boolean = false,
	DisableStaticTime = 1.6

function CheckAbility(ability: Ability | Item, target: Hero | Vector3): boolean {
	return ability !== undefined && ability.IsReady
		&& ability.CanBeCasted() && СomboAbility.IsEnabled(ability.Name) 
		&& Owner.Distance2D(target) <= ability.CastRange
}

function XMode(abils: Ability, target: Hero, Time: number, Combo: boolean) {
	let Predict = target.InFront(600 / 1000 * (target.IsMoving ? target.IdealSpeed : 0))
	if (CheckAbility(abils, target)) {
		ShipCombo = Combo
		XMarkPos = Predict
		abils.UseAbility(target)
		XMarkCastTime = Time + 1
		ComboTimer = Time + 3.08
	}
}
function SetCastDelay() {
	return ((Game.Ping / 2) + 600)
}
function ComboInit() {
	let Items = new InitItems(Owner),
		Abilities = new InitAbility(Owner),
		Time = Game.RawGameTime
	let Q = Abilities.Torrent as Ability,
		X = Abilities.MarksSpot as Ability,
		R = Abilities.Ghostship as Ability,
		RX = Abilities.Return as Ability,
		RF = Items.Refresher as Item,
		RFS = Items.RefresherShard as Item,
		SHG = Items.Shivas as Item
	if (!XMarkPos.IsZero()) {
		if(RX !== undefined && RX.IsHidden && X !== undefined && !X.IsInAbilityPhase) {
			XMarkPos = new Vector3
			return false
		}
	}
	if (ShipCombo) {
		if (CheckAbility(R, XMarkPos)) {
			if (Owner.Distance2D(XMarkPos) > (R.CastRange - 100)) {
				Owner.MoveTo(XMarkPos)
				return false
			}
			R.UseAbility(XMarkPos)
			ComboTimer = Time + 3.08
			Sleep.Sleep(Abilities.CastDelay(R))
		}
	}
	if (ComboTimer - Time <= 2.05) {
		if (XMarkPos.LengthSqr === 0 || X.CanBeCasted()) {
			return false
		}
		if (CheckAbility(Q, XMarkPos)) {
			Q.UseAbility(XMarkPos)
			Sleep.Sleep(Abilities.CastDelay(Q))
		}
	}
	if (ComboTimer - Time <= 0.55) {
		if (SHG !== undefined && SHG.CanBeCasted() && СomboItems.IsEnabled(SHG.Name)) {
			Owner.CastNoTarget(SHG)
			Sleep.Sleep(Abilities.Tick + SetCastDelay())
		}
		if (RFS !== undefined && RFS.CanBeCasted() && СomboItems.IsEnabled(RFS.Name)) {
			Owner.CastNoTarget(RFS)
			Sleep.Sleep(Abilities.Tick + SetCastDelay())
		}
		if (RF !== undefined && RF.CanBeCasted() && СomboItems.IsEnabled(RF.Name)) {
			Owner.CastNoTarget(RF)
			Sleep.Sleep(Items.Tick + SetCastDelay())
		}
		if (RX !== undefined && !RX.IsHidden) {
			Owner.CastNoTarget(RX)
			Sleep.Sleep(Abilities.CastDelay(RX))
		}
	}
	if (ComboTimer - Time <= 0.1) {
		XMarkPos = new Vector3
		ShipCombo = false
		AutoCombo = false
		Sleep.ResetTimer()
		return true
	}
}

export function InitCombo() {
	if (!Base.IsRestrictions(State) || Sleep.Sleeping) {
		return false
	}
	let target = MouseTarget,
		Time = Game.RawGameTime
			
	let Items = new InitItems(Owner),
		Abilities = new InitAbility(Owner)
	let Q = Abilities.Torrent as Ability,
		X = Abilities.MarksSpot as Ability,
		R = Abilities.Ghostship as Ability,
		HEX = Items.Sheeps as Item	
	if (!XMarkPos.IsZero()) {
		ComboInit()
		return false
	}
	if (Base.CanCastSpells(Owner) || target === undefined || target.IsMagicImmune) {
		return false
	}
	if (target !== undefined && !XMarkPos.IsZero()) {
		XMarkPos = new Vector3
	}
	let IsStunned = target.GetBuffByName("modifier_bashed"),
		IsBashed  = target.GetBuffByName("modifier_stunned"),
		hexDebuff = target.GetBuffByName("modifier_sheepstick_debuff")
		
	if (hexDebuff !== undefined && hexDebuff.RemainingTime > 0.3 
		|| IsBashed !== undefined && IsBashed.RemainingTime > DisableStaticTime
		|| IsStunned !== undefined && IsStunned.RemainingTime > DisableStaticTime
	) {
		if (AutoComboMenu.value) {
			AutoCombo = true
		}
	}
	if (ComboTimer < Time) {
		if (BladeMailItem.value && (BladeMailItem.value && target.HasModifier("modifier_item_blade_mail_reflect")) || !Base.Cancel(target)) {
			return false
		}
		if (!target.HasModifier("modifier_kunkka_x_marks_the_spot")) {
			if (ComboKeyItem.is_pressed || AutoCombo) {
				if (Items.Blink !== undefined
					&& СomboItems.IsEnabled(Items.Blink.Name)
					&& !target.IsInRange(Owner, 600)
					&& Items.Blink.CanBeCasted()
				) {
					let castRange = Items.Blink.GetSpecialValue("blink_range") + Owner.CastRangeBonus
					Items.Blink.UseAbility(Owner.NetworkPosition.Extend(target.NetworkPosition, Math.min(castRange, Owner.Distance(target) - BlinkRadius.value) - 1))
					Sleep.Sleep((Items.Tick + SetCastDelay()))
					return false
				}
				if (R !== undefined && Owner.Distance2D(target) > (R.CastRange - 50)) {
					Owner.MoveTo(target.NetworkPosition)
					return false
				}
				if (HEX !== undefined 
					&& HEX.CanBeCasted() && СomboItems.IsEnabled(HEX.Name)
					&& (hexDebuff === undefined || !hexDebuff.IsValid || hexDebuff.RemainingTime <= 0.3)) {
					HEX.UseAbility(target)
					Sleep.Sleep((Items.Tick + SetCastDelay()))
				}
				if (CheckAbility(X, target) 
					&& Q !== undefined && Q.CanBeCasted() 
					&& R !== undefined && R.CanBeCasted()
				) {
					let Predict = target.InFront(600 / 1000 * (target.IsMoving ? target.IdealSpeed : 0))
					ShipCombo = true
					XMarkPos = Predict
					X.UseAbility(target)
					XMarkCastTime = Time + 1
					Sleep.Sleep(Abilities.CastDelay(X) + SetCastDelay())
				}
				if (R === undefined || !R.CanBeCasted() 
					|| Owner.Distance2D(target) >= R.CastRange
				) {
					
					ShipCombo = false
					ComboTimer = Time + 3.08
				}
			}
			if (ComboKeyItem.is_pressed || AutoCombo) {
				if (Q !== undefined && Q.CanBeCasted() || R !== undefined && R.CanBeCasted()) {
					XMode(X, target, Time, true)
					XMarkType = 1
					Sleep.Sleep(Abilities.CastDelay(X) + SetCastDelay())
				}
			} else if (ComboKeyTorrent.is_pressed) {
				if (Q !== undefined && Q.CanBeCasted() || R !== undefined && R.CanBeCasted()) {
					if (X !== undefined && Owner.Distance2D(target) > (X.CastRange - 100)) {
						Owner.MoveTo(target.NetworkPosition)
						return false
					}
					XMode(X, target, Time, false)
					XMarkType = 2
					Sleep.Sleep(Abilities.CastDelay(X) + SetCastDelay())
				}
			}
		}
		else {
			ComboInit()
			return false
		}
	}
	else{
		ComboInit()
		return false
	}
}

export function ComboGameEnded() {
	ShipCombo = false
	XMarkCastTime = 0
	ComboTimer = 0
	XMarkPos = new Vector3
	AutoCombo = false
	DisableStaticTime = 1.6
	Sleep.ResetTimer()
}