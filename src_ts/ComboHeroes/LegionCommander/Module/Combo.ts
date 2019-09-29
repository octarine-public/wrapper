import { Base } from "../Extends/Helper"
import { BreakInit } from "./LinkenBreaker"

import { GameSleeper, Utils } from "wrapper/Imports"
import { MouseTarget, Owner } from "../Listeners"

import InitAbility from "../Extends/Abilities"
import InitItems from "../Extends/Items"

import { BladeMailItem, ComboKeyItem, State, СomboAbility, СomboItems } from "../Menu"

let Sleep = new GameSleeper

export function InitCombo() {
	if (Sleep.Sleeping("Delay") || !Base.IsRestrictions(State) || !ComboKeyItem.is_pressed)
		return false
	let target = MouseTarget
	if (target === undefined || (BladeMailItem.value && target.HasModifier("modifier_item_blade_mail_reflect"))) {
		Owner.MoveTo(Utils.CursorWorldVec)
		return false
	}
	if (!Owner.IsInvisible) {
		let comboBreaker = Base.AeonDisc(target),
			cancelAdditionally = Base.CancelAdditionally(target),
			blockingAbilities = Base.IsBlockingAbilities(target)

		let hexDebuff = target.GetBuffByName("modifier_sheepstick_debuff"),
			Items = new InitItems(Owner),
			Abilities = new InitAbility(Owner)

		if (Base.Cancel(target) && cancelAdditionally) {
			if (!blockingAbilities) {
				// Abyssal Blade
				if (
					Items.Abyssal !== undefined
					&& СomboItems.IsEnabled(Items.Abyssal.Name)
					&& Items.Abyssal.CanBeCasted()
					&& Owner.Distance2D(target) < Items.Abyssal.CastRange + 60
					&& !comboBreaker
					&& (hexDebuff === undefined || hexDebuff.RemainingTime <= 0.3)
				) {
					Items.Abyssal.UseAbility(target)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}

				// Hex
				if (
					Items.Sheeps !== undefined
					&& СomboItems.IsEnabled(Items.Sheeps.Name)
					&& Items.Sheeps.CanBeCasted()
					&& Owner.Distance2D(target) <= Items.Sheeps.CastRange
					&& !comboBreaker
					&& (hexDebuff === undefined || hexDebuff.RemainingTime <= 0.3)
				) {
					Items.Sheeps.UseAbility(target)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}

				// Orchid
				if (
					Items.Orchid !== undefined
					&& СomboItems.IsEnabled(Items.Orchid.Name)
					&& Items.Orchid.CanBeCasted()
					&& Owner.Distance2D(target) <= Items.Orchid.CastRange
					&& !comboBreaker
				) {
					Items.Orchid.UseAbility(target)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}

				// Bloodthorn
				if (
					Items.Bloodthorn !== undefined
					&& СomboItems.IsEnabled(Items.Bloodthorn.Name)
					&& Items.Bloodthorn.CanBeCasted()
					&& Owner.Distance2D(target) <= Items.Bloodthorn.CastRange
					&& !comboBreaker
				) {
					Items.Bloodthorn.UseAbility(target)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}

				// Nullifier
				if (
					Items.Nullifier !== undefined
					&& СomboItems.IsEnabled(Items.Nullifier.Name)
					&& Items.Nullifier.CanBeCasted()
					&& Owner.Distance2D(target) <= Items.Nullifier.CastRange
					&& !comboBreaker
					&& (hexDebuff === undefined || hexDebuff.RemainingTime <= 0.5)
				) {
					Items.Nullifier.UseAbility(target)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}

				// RodofAtos
				let atosDebuff = target.ModifiersBook.Buffs.some(x => x.Name === "modifier_rod_of_atos_debuff" && x.RemainingTime > 0.5)
				if (
					Items.RodofAtos !== undefined
					&& СomboItems.IsEnabled(Items.RodofAtos.Name)
					&& Items.RodofAtos.CanBeCasted()
					&& Owner.Distance2D(target) <= Items.RodofAtos.CastRange
					&& !atosDebuff
				) {
					Items.RodofAtos.UseAbility(target)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}

				// Discord
				if (
					Items.Discord !== undefined
					&& СomboItems.IsEnabled(Items.Discord.Name)
					&& Items.Discord.CanBeCasted()
					&& Owner.Distance2D(target) <= Items.Discord.CastRange
				) {
					Items.Discord.UseAbility(target.Position)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}

				// Ethereal
				if (
					Items.Ethereal !== undefined
					&& СomboItems.IsEnabled(Items.Ethereal.Name)
					&& Items.Ethereal.CanBeCasted()
					&& Owner.Distance2D(target) <= Items.Ethereal.CastRange
					&& !comboBreaker
				) {
					Items.Ethereal.UseAbility(target)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}

				// Shivas
				if (
					Items.Shivas !== undefined
					&& СomboItems.IsEnabled(Items.Shivas.Name)
					&& Items.Shivas.CanBeCasted()
					&& Owner.Distance2D(target) <= Items.Shivas.CastRange
				) {
					Items.Shivas.UseAbility()
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}

				// Dagon
				if (
					Items.Dagon !== undefined
					&& СomboItems.IsEnabled("item_dagon_5")
					&& !Base.CancelAbilityRealm(target)
					&& Items.Dagon.CanBeCasted()
					&& Owner.Distance2D(target) <= Items.Dagon.CastRange
					&& (
						Items.Ethereal === undefined
						|| (target.IsEthereal && !Items.Ethereal.CanBeCasted())
						|| !СomboItems.IsEnabled(Items.Ethereal.Name)
					)
					&& !comboBreaker
				) {
					Items.Dagon.UseAbility(target)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}

				// Urn
				if (
					Items.UrnOfShadows !== undefined
					&& СomboItems.IsEnabled(Items.UrnOfShadows.Name)
					&& Items.UrnOfShadows.CanBeCasted()
					&& Owner.Distance2D(target) <= Items.UrnOfShadows.CastRange
					&& !comboBreaker
					// TODO UrnOfShadows return modifier Name
					&& !target.ModifiersBook.Buffs.some(x => x.Name === Items.UrnOfShadows.Name)
				) {
					Items.UrnOfShadows.UseAbility(target)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}

				// Vessel
				if (
					Items.SpiritVesel !== undefined
					&& СomboItems.IsEnabled(Items.SpiritVesel.Name)
					&& Items.SpiritVesel.CanBeCasted()
					&& Owner.Distance2D(target) <= Items.SpiritVesel.CastRange
					&& !comboBreaker
					// TODO UrnOfShadows return modifier Name
					&& !target.ModifiersBook.Buffs.some(x => x.Name === Items.SpiritVesel.Name)
				) {
					Items.SpiritVesel.UseAbility(target)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}
				// Medallion
				if (
					Items.Medallion !== undefined
					&& СomboItems.IsEnabled(Items.Medallion.Name)
					&& Items.Medallion.CanBeCasted()
					&& Owner.Distance2D(target) <= Items.Medallion.CastRange
				) {
					Items.Medallion.UseAbility(target)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}
				
				// Solar Crest
				if (
					Items.SolarCrest !== undefined
					&& СomboItems.IsEnabled(Items.SolarCrest.Name)
					&& Items.SolarCrest.CanBeCasted()
					&& Owner.Distance2D(target) <= Items.SolarCrest.CastRange
				) {
					Items.SolarCrest.UseAbility(target)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}
				// Overwhelming Odds
				if (
					Abilities.Overwhelming !== undefined
					&& СomboAbility.IsEnabled(Abilities.Overwhelming.Name)
					&& Abilities.Overwhelming.CanBeCasted()
					&& Owner.Distance2D(target) <= Abilities.Overwhelming.CastRange
					&& !comboBreaker
				) {
					Abilities.Overwhelming.UseAbility(target.VelocityWaypoint(Abilities.Overwhelming.CastPoint))
					Sleep.Sleep(Abilities.CastDelay(Abilities.Overwhelming), "Delay")
					return true
				}

			} // Base.Cancel(target) && cancelAdditionally
		}
		var distance = Owner.Distance2D(target, true),
			blinkReady = Items.Blink !== undefined
				&& СomboItems.IsEnabled(Items.Blink.Name)
				&& Items.Blink.CanBeCasted()

		if (cancelAdditionally) {
			if (!blinkReady || distance <= Items.ItemCastRange(Items.Blink, "blink_range")) {
				// Press The Attack
				if (
					Abilities.PressTheAttack !== undefined
					&& СomboAbility.IsEnabled(Abilities.PressTheAttack.Name)
					&& Abilities.PressTheAttack.CanBeCasted()
					&& !Owner.IsMagicImmune
				) {
					if (Owner.GetTalentValue("special_bonus_unique_legion_commander_5") !== 0)
						Owner.CastPosition(Abilities.PressTheAttack, Owner.Position)
					else
						Abilities.PressTheAttack.UseAbility(Owner)
					Sleep.Sleep(Abilities.CastDelay(Abilities.PressTheAttack), "Delay")
					return true
				}
				// LotusOrb
				let LotusOrbReady = Items.LotusOrb !== undefined
					&& СomboItems.IsEnabled(Items.LotusOrb.Name)
					&& Items.LotusOrb.CanBeCasted()
				if (LotusOrbReady) {
					Items.LotusOrb.UseAbility(Owner)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}
				// Mjollnir
				let mjollnirReady = Items.Mjollnir !== undefined
					&& СomboItems.IsEnabled(Items.Mjollnir.Name)
					&& Items.Mjollnir.CanBeCasted()
				if (mjollnirReady) {
					Items.Mjollnir.UseAbility(Owner)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}
				// Armlet
				let armletReady = Items.Armlet !== undefined
					&& СomboItems.IsEnabled(Items.Armlet.Name)
					&& !Items.Armlet.IsToggled
				if (armletReady) {
					Items.Armlet.UseAbility(Owner, true)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}
				// Blade Mail
				let bladeMailReady = Items.BladMail !== undefined
					&& СomboItems.IsEnabled(Items.BladMail.Name)
					&& Items.BladMail.CanBeCasted()
					&& !comboBreaker
				if (bladeMailReady) {
					Items.BladMail.UseAbility(Owner)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}
				// Satanic
				let satanicReady = Items.Satanic !== undefined
					&& СomboItems.IsEnabled(Items.Satanic.Name)
					&& Items.Satanic.CanBeCasted() && !comboBreaker
				if (satanicReady) {
					Items.Satanic.UseAbility(Owner)
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}
				// Black King Bar
				let blackKingBarReady = Items.BlackKingBar !== undefined
					&& СomboItems.IsEnabled(Items.BlackKingBar.Name)
					&& Items.BlackKingBar.CanBeCasted() && !comboBreaker
				if (blackKingBarReady) {
					Items.BlackKingBar.UseAbility()
					Sleep.Sleep(Items.Tick, "Delay")
					return true
				}
			}
			// Blink
			if (blinkReady && distance > 150) {
				let delay = 0
				if (
					Abilities.Duel !== undefined
					&& СomboAbility.IsEnabled(Abilities.Duel.Name)
					&& Abilities.Duel.CanBeCasted()
				)
					delay += Abilities.Duel.CastPoint
				Items.Blink.UseAbility(target.VelocityWaypoint(delay))
				Sleep.Sleep(Items.Tick, "Delay")
				return true
			}
			if (!blockingAbilities) {
				if (
					Abilities.Duel !== undefined
					&& СomboAbility.IsEnabled(Abilities.Duel.Name)
					&& Abilities.Duel.CanBeCasted()
					&& !comboBreaker
				) {
					Abilities.Duel.UseAbility(target)
					Sleep.Sleep(Abilities.CastDelay(Abilities.Duel), "Delay")
					return true
				}
			} else
				BreakInit()
		}
	}
	if (Owner.CanAttack(target)
		&& !Sleep.Sleeping("Attack")
		&& !Base.CancelAbilityRealm(target))
	{
		Owner.AttackTarget(target)
		Sleep.Sleep(Owner.SecondsPerAttack * 1000, "Attack")
		return true
	}
	return false
}

export function GameEndedCombo() {
	Sleep.FullReset()
}