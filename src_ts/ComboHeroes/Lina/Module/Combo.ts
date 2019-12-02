import { Ability, Hero, TickSleeper, Flow_t } from "wrapper/Imports";
import { Base } from "../Extends/Helper";
import { MouseTarget, Owner, initItemsMap, initAbilityMap } from "../Listeners";
import { BladeMailCancel, ComboKeyItem, ModeInvisCombo, State, СomboAbility, СomboItems, StyleCombo } from "../Menu";

let Sleep = new TickSleeper(),
	ComboActived = false

ComboKeyItem.OnRelease(() => ComboActived = !ComboActived);

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
	if (!Base.IsRestrictions(State) || Sleep.Sleeping)
		return
	if ((StyleCombo.selected_id === 1 && !ComboActived) || (StyleCombo.selected_id === 0 && !ComboKeyItem.is_pressed)) {
		return
	}
	let target = MouseTarget
	if (target === undefined || target.IsMagicImmune || !target.IsAlive) {
		return
	}
	if (BladeMailCancel.value && target.HasBuffByName("modifier_item_blade_mail_reflect"))
		return

	let Items = initItemsMap.get(Owner),
		Abilities = initAbilityMap.get(Owner)
	if (Abilities === undefined || Items === undefined)
		return

	let Debuff = target.ModifiersBook.GetAnyBuffByNames(["modifier_sheepstick_debuff", "modifier_stunned"])
	if (Owner.IsInvisible) {
		if (Owner.CanAttack(target)) {
			Owner.AttackTarget(target)
		}
		if (ModeInvisCombo.selected_id === 0) {
			if (IsValidAbility(Abilities.LightStrikeArray, target)) {
				let prediction = target.VelocityWaypoint((Abilities.LightStrikeArray.CastPoint * 2) + GetAvgLatency(Flow_t.OUT))
				Abilities.LightStrikeArray.UseAbility(prediction)
				Sleep.Sleep(Abilities.Tick)
				return
			}
		}
		return
	}
	if (Abilities.LightStrikeArray !== undefined && Owner.Distance2D(target) > Abilities.LightStrikeArray.CastRange) {
		Owner.MoveTo(target.Position)
		Sleep.Sleep(350)
		return
	}
	if (IsValidItems(Items.Discord, target) && !target.IsInvulnerable) {
		Items.Discord.UseAbility(target)
		Sleep.Sleep(Items.Tick)
		return
	}
	if (!target.HasBuffByName("modifier_eul_cyclone")) {
		if (IsValidItems(Items.Cyclone, target)) {
			if (Abilities.LightStrikeArray !== undefined && Abilities.LightStrikeArray.CanBeCasted()) {
				Items.Cyclone.UseAbility(target)
				Sleep.Sleep(Items.Tick)
				return
			}
		}
		if ((Items.Cyclone === undefined || !Items.Cyclone.CanBeCasted())
			&& IsValidAbility(Abilities.LightStrikeArray, target)
		) {
			let prediction = target.VelocityWaypoint((Abilities.LightStrikeArray.CastPoint * 2) + GetAvgLatency(Flow_t.OUT))
			Abilities.LightStrikeArray.UseAbility(prediction)
			Sleep.Sleep(Abilities.Tick)
			return
		}
	}
	if (IsValidItems(Items.Sheeps, target) && !target.IsInvulnerable
		&& (Debuff !== undefined && Debuff.RemainingTime <= 0.3)
	) {
		Items.Sheeps.UseAbility(target)
		Sleep.Sleep(Items.Tick)
		return
	}
	if (Items.BlackKingBar !== undefined && Items.BlackKingBar.IsReady
		&& Items.BlackKingBar.CanBeCasted() && СomboItems.IsEnabled(Items.BlackKingBar.Name)
		&& !target.IsInvulnerable
		&& (Debuff !== undefined && Debuff.RemainingTime <= 0.3)) {
		Items.BlackKingBar.UseAbility(Owner)
		Sleep.Sleep(Items.Tick)
		return
	}
	if (IsValidItems(Items.Ethereal, target) && !target.IsInvulnerable) {
		Items.Ethereal.UseAbility(target)
		Sleep.Sleep(Items.Tick + 450)
		return
	}
	if (
		Items.Dagon !== undefined && Items.Dagon.IsReady
		&& Items.Dagon.CanBeCasted() && СomboItems.IsEnabled("item_dagon_5")
		&& Owner.Distance2D(target) <= Items.Dagon.CastRange && !target.IsInvulnerable) {
		Items.Dagon.UseAbility(target)
		Sleep.Sleep(Items.Tick)
		return
	}
	if (IsValidItems(Items.Bloodthorn, target) && !target.IsInvulnerable) {
		Items.Bloodthorn.UseAbility(target)
		Sleep.Sleep(Items.Tick)
		return
	}
	if (IsValidItems(Items.Orchid, target) && !target.IsInvulnerable) {
		Items.Orchid.UseAbility(target)
		Sleep.Sleep(Items.Tick)
		return
	}
	if (IsValidAbility(Abilities.LagunaBlade, target) && !target.IsInvulnerable) {
		Abilities.LagunaBlade.UseAbility(target)
		Sleep.Sleep(Items.Tick)
		return
	}
	let Prediction = target.VelocityWaypoint((Abilities.DragonSlave.CastPoint * 2) + GetAvgLatency(Flow_t.OUT))
	if (IsValidAbility(Abilities.DragonSlave, target) && !target.IsInvulnerable) {
		Abilities.DragonSlave.UseAbility(Prediction)
		Sleep.Sleep(Items.Tick)
		return
	}
	if (IsValidItems(Items.Shivas, target) && !target.IsInvulnerable) {
		Items.Shivas.UseAbility()
		Sleep.Sleep(Items.Tick)
		return
	}
	return
}

export function ComboGameEnded() {
	Sleep.ResetTimer()
}