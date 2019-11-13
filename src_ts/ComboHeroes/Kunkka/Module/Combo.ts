import { Ability, Game, Hero, Item, TickSleeper, Vector3 } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { MouseTarget, Owner, initAbilityMap, initItemsMap } from "../Listeners"
import {
	AutoComboMenu, BladeMailItem, BlinkRadius, //HarassModeCombo,
	ComboKeyItem, ComboKeyTorrent, State, СomboAbility, СomboItems,
} from "../Menu"

// import { BreakInit } from "./LinkenBreaker"
export let ShipCombo = false
export let XMarkCastTime = 0
export let ComboTimer = 0
export let XMarkPos = new Vector3()
export let XMarkType = 0

let Sleep = new TickSleeper(),
	AutoCombo = false,
	DisableStaticTime = 1.6

function CheckAbility(ability: Ability | Item, target: Hero | Vector3): boolean {
	return ability !== undefined && ability.IsReady
		&& ability.CanBeCasted() && СomboAbility.IsEnabled(ability.Name)
		&& Owner.Distance2D(target) <= ability.CastRange
}

// function SetAutoAttackMode(set: number) {
// 	Game.ExecuteCommand("dota_player_units_auto_attack_mode " + set)
// }

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
	let Items = initItemsMap.get(Owner),
		Abilities = initAbilityMap.get(Owner)
	if (Abilities === undefined || Items === undefined)
		return

	let Time = Game.RawGameTime,
		Q = Abilities.Torrent,
		X = Abilities.MarksSpot,
		R = Abilities.Ghostship,
		RX = Abilities.Return,
		RF = Items.Refresher,
		RFS = Items.RefresherShard,
		SHG = Items.Shivas
	if (!XMarkPos.IsZero() && RX !== undefined && RX.IsHidden && X !== undefined && !X.IsInAbilityPhase) {
		XMarkPos = new Vector3()
		return
	}
	if (ShipCombo && CheckAbility(R, XMarkPos)) {
		if (Owner.Distance2D(XMarkPos) > (R.CastRange - 50)) {
			Owner.MoveTo(XMarkPos)
			Sleep.Sleep(SetCastDelay())
			return
		}
		// if (ConVars.GetInt("dota_player_units_auto_attack_mode") === 1) {
		// 	SetAutoAttackMode(0)
		// }
		R.UseAbility(XMarkPos)
		ComboTimer = Time + 3.08
		Sleep.Sleep(Abilities.CastDelay(R))
	}
	if (ComboTimer - Time <= 0.65) { // after Ghostship 
		if (XMarkPos.LengthSqr === 0 || X.CanBeCasted())
			return
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
		XMarkPos = new Vector3()
		ShipCombo = false
		AutoCombo = false
		Sleep.ResetTimer()
		// if (ConVars.GetString("dota_player_units_auto_attack_mode") === "0") {
		// 	SetAutoAttackMode(1)
		// }
		return
	}
}

export function InitCombo() {
	if (!Base.IsRestrictions(State) || Sleep.Sleeping)
		return

	let target = MouseTarget,
		Time = Game.RawGameTime
	let Items = initItemsMap.get(Owner),
		Abilities = initAbilityMap.get(Owner)
	if (Abilities === undefined || Items === undefined)
		return

	let Q = Abilities.Torrent as Ability,
		X = Abilities.MarksSpot as Ability,
		R = Abilities.Ghostship as Ability,
		HEX = Items.Sheeps as Item
	if (!XMarkPos.IsZero()) {
		ComboInit()
		return
	}
	if (Base.CanCastSpells(Owner) || target === undefined || target.IsMagicImmune)
		return

	if (target !== undefined && !XMarkPos.IsZero())
		XMarkPos = new Vector3()
	let IsStunned = target.GetBuffByName("modifier_bashed"),
		IsBashed = target.GetBuffByName("modifier_stunned"),
		hexDebuff = target.GetBuffByName("modifier_sheepstick_debuff")

	if (hexDebuff !== undefined && hexDebuff.RemainingTime > 0.3
		|| IsBashed !== undefined && IsBashed.RemainingTime > DisableStaticTime
		|| IsStunned !== undefined && IsStunned.RemainingTime > DisableStaticTime
	)
		if (AutoComboMenu.value)
			AutoCombo = true
	if (ComboTimer < Time) {
		if (BladeMailItem.value && (BladeMailItem.value && target.HasModifier("modifier_item_blade_mail_reflect")) || !Base.Cancel(target))
			return
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
					return
				}
				if (R !== undefined && Owner.Distance2D(target) > (R.CastRange - 50)) {
					Owner.MoveTo(target.NetworkPosition)
					Sleep.Sleep(SetCastDelay())
					return
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
					// if (ConVars.GetString("dota_player_units_auto_attack_mode") === "1") {
					// 	SetAutoAttackMode(0)
					// }
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
					if (X !== undefined && Owner.Distance2D(target) > (X.CastRange - 50)) {
						Owner.MoveTo(target.NetworkPosition)
						Sleep.Sleep(SetCastDelay())
						return
					}
					XMode(X, target, Time, false)
					XMarkType = 2
					Sleep.Sleep(Abilities.CastDelay(X) + SetCastDelay())
				}
			}
		} else {
			ComboInit()
			return
		}
	} else {
		ComboInit()
		return
	}
}

export function ComboGameEnded() {
	ShipCombo = false
	XMarkCastTime = 0
	ComboTimer = 0
	XMarkPos = new Vector3()
	AutoCombo = false
	DisableStaticTime = 1.6
	Sleep.ResetTimer()
	// if (ConVars.GetInt("dota_player_units_auto_attack_mode") === 0) {
	// 	SetAutoAttackMode(1)
	// }
}