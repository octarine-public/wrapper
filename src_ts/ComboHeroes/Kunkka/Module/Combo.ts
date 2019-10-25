import { GameSleeper, Utils, Game, Vector3, Ability, Hero, Item, Entity } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { Owner, MouseTarget } from "../Listeners"

import InitItems from "../Extends/Items"
import InitAbility from "../Extends/Abilities"
import {
	State, ComboKeyItem, BlinkRadius, //HarassModeCombo, 
	СomboItems, AutoComboMenu, СomboAbility, ComboKeyTorrent, BladeMailItem } from "../Menu"

// import { BreakInit } from "./LinkenBreaker"
export let ShipCombo: boolean = false
export let XMarkCastTime: number = 0
export let ComboTimer: number = 0
export let XMarkPos: Vector3 = new Vector3

let Sleep: GameSleeper = new GameSleeper, 
	AutoCombo: boolean = false,
	DisableStaticTime = 1.6

function CheckAbility(ability: Ability | Item, target: Hero): boolean {
	return ability !== undefined 
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

export function InitCombo() {
	if (!Base.IsRestrictions(State)) {
		return false
	}
	if (Sleep.Sleeping("Delay")) {
		return false
	}
	let target = MouseTarget,
		Time = Game.RawGameTime
	if (Base.CanCastSpells(Owner) || target === undefined || target.IsMagicImmune) {
		return false
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
	let Items = new InitItems(Owner),
		Abilities = new InitAbility(Owner)
		
	let Q = Abilities.Torrent as Ability,
		X = Abilities.MarksSpot as Ability,
		R = Abilities.Ghostship as Ability,
		RX = Abilities.Return as Ability,
		RF = Items.Refresher as Item,
		RFS = Items.RefresherShard as Item,
		SHG = Items.Shivas as Item,
		HEX = Items.Sheeps as Item
		
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
					Sleep.Sleep(Items.Tick, "Delay")
					return false
				}
				if (HEX !== undefined 
					&& HEX.CanBeCasted() && СomboItems.IsEnabled(HEX.Name)
					&& (hexDebuff === undefined || !hexDebuff.IsValid || hexDebuff.RemainingTime <= 0.3)) {
					HEX.UseAbility(target)
					Sleep.Sleep(Abilities.Tick, "Delay")
				}
				if (CheckAbility(X, target) && Q !== undefined && Q.CanBeCasted() || R !== undefined && R.CanBeCasted()) {
					ShipCombo = true
					let Predict = target.InFront(600 / 1000 * (target.IsMoving ? target.IdealSpeed : 0))
					XMarkPos = Predict
					X.UseAbility(target)
					XMarkCastTime = Time + 1
					Sleep.Sleep(Abilities.Tick, "Delay")
				}
				if (R === undefined || !R.CanBeCasted() || Owner.Distance2D(target) >= R.CastRange) {
					ShipCombo = false
					ComboTimer = Time + 3.08
				}
				return false
			}
			if (ComboKeyItem.is_pressed || AutoCombo) {
				if (Q !== undefined && Q.CanBeCasted() || R !== undefined && R.CanBeCasted()) {
					XMode(X, target, Time, true)
					Sleep.Sleep(Abilities.Tick, "Delay")
				}
				return false
			} else if (ComboKeyTorrent.is_pressed) {
				if (Q !== undefined && Q.CanBeCasted() || R !== undefined && R.CanBeCasted()) {
					XMode(X, target, Time, false)
					Sleep.Sleep(Abilities.Tick, "Delay")
				}
			}
		}
		else {	
			if (ShipCombo) {
				if (CheckAbility(R, target)){
					R.UseAbility(XMarkPos)
					ComboTimer = Time + 3.08
					Sleep.Sleep(Abilities.Tick, "Delay")
				}
			}
			return false
		}
	}
	else{
		if (XMarkPos.LengthSqr === 0) {
			return false
		}
		if (ComboTimer - Time <= 2.05) {
			if (CheckAbility(Q, target)) {
				Q.UseAbility(XMarkPos)
				Sleep.Sleep(Abilities.Tick, "Delay")
			}
		}
		if (ComboTimer - Time <= 0.55) {
			if (SHG !== undefined && SHG.CanBeCasted() && СomboItems.IsEnabled(SHG.Name)) {
				Owner.CastNoTarget(SHG)
				Sleep.Sleep(Abilities.Tick, "Delay")
			}
			if (RFS !== undefined && RFS.CanBeCasted() && СomboItems.IsEnabled(RFS.Name)) {
				Owner.CastNoTarget(RFS)
				Sleep.Sleep(Abilities.Tick, "Delay")
			}
			if (RF !== undefined && RF.CanBeCasted() && СomboItems.IsEnabled(RF.Name)) {
				Owner.CastNoTarget(RF)
				Sleep.Sleep(Abilities.Tick, "Delay")
			}
			if (RX !== undefined && !RX.IsHidden) {
				Owner.CastNoTarget(RX)
				Sleep.Sleep(Abilities.Tick, "Delay")
			}
		}
		if (ComboTimer - Time <= 0.1) {
			XMarkPos = new Vector3
			ShipCombo = false
			AutoCombo = false
		}
	}
}
