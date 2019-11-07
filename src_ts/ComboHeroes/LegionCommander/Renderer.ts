
import { Base } from "./Extends/Helper"
import { LocalPlayer } from "wrapper/Imports"
import { Owner, initItemsMap, initAbilityMap, initDrawBaseMap, MouseTarget } from "./Listeners"

import {
	State,
	Radius,
	BlinkRadiusItemColor,
	DrawTargetItem,
	DuelRadiusItemColor,
	OverwhelmingOddsRadiusColor,
	PressTheAttackRadiusItemColor,
} from "./Menu"

export function Draw() {
	if (LocalPlayer === undefined || LocalPlayer.IsSpectator) {
		return
	}
	
	let Particle = initDrawBaseMap.get(Owner),
		Items = initItemsMap.get(Owner),
		Abilities = initAbilityMap.get(Owner)
	
	if (Items === undefined || Abilities === undefined || Particle === undefined) {
		return
	}
	DrawTargetItem.value
		? Particle.UpdateLineDot("target_lock", Base, State, MouseTarget)
		: Particle.RemoveParticle("target_lock")
	
	Abilities.Overwhelming !== undefined && Abilities.Overwhelming.Level !== 0 
	&& Radius.IsEnabled(Abilities.Overwhelming.Name) && Owner.IsAlive && State.value
		? Particle.UpdateCircle(Abilities.Overwhelming.Name, Abilities.Overwhelming.CastRange, OverwhelmingOddsRadiusColor.Color)
		: Particle.RemoveParticle("legion_commander_overwhelming_odds")
		
	Abilities.PressTheAttack !== undefined && Abilities.PressTheAttack.Level !== 0 
	&& Radius.IsEnabled(Abilities.PressTheAttack.Name) && Owner.IsAlive && State.value
		? Particle.UpdateCircle(Abilities.PressTheAttack.Name, Abilities.PressTheAttack.CastRange, PressTheAttackRadiusItemColor.Color)
		: Particle.RemoveParticle("legion_commander_press_the_attack")
		
	Abilities.Duel !== undefined && Abilities.Duel.Level !== 0 
	&& Radius.IsEnabled(Abilities.Duel.Name) && Owner.IsAlive && State.value
		? Particle.UpdateCircle(Abilities.Duel.Name, Abilities.Duel.CastRange, DuelRadiusItemColor.Color)
		: Particle.RemoveParticle("legion_commander_duel")
		
	Items.Blink !== undefined && Radius.IsEnabled(Items.Blink.Name) && Owner.IsAlive && State.value
		? Particle.UpdateCircle(Items.Blink.Name, Items.ItemCastRange(Items.Blink, "blink_range"), BlinkRadiusItemColor.Color)
		: Particle.RemoveParticle("item_blink")

}
