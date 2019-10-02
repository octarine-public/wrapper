import { GameSleeper } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import {  MyHero, Heroes } from "../Listeners"
import { comboKey, items, active, ezKill } from "../MenuManager"
import InitAbility from "../Extends/Abilities"
import InitItems from "../Extends/Items"
import { TinkerStatus } from "./status";
import { ManaFactDamage, OneHitLeft, EZKill } from "./Calc";
let Sleep = new GameSleeper()
export function AutoSteal(){
	if (!Base.IsRestrictions(active) || comboKey.is_pressed || TinkerStatus()==2||!ezKill.value)
		return false
	let ItemsInit = new InitItems(MyHero),
		Abilities = new InitAbility(MyHero),
		latest_spellamp = (1 + MyHero.SpellAmplification)
	let en = Heroes.filter(x =>x!==MyHero&&x.IsEnemy&& x.IsVisible && x.IsAlive && !x.IsMagicImmune)
	en.forEach(e => {
		if (MyHero.Mana >= ManaFactDamage(e)
		&& (!Base.CanReflectDamage(e) || MyHero.IsMagicImmune)
		&& !e.HasModifier("modifier_abaddon_borrowed_time_damage_redirect")
		&& !e.HasModifier("modifier_obsidian_destroyer_astral_imprisonment_prison")
		&& !e.HasModifier("modifier_puck_phase_shift")
		&& !e.HasModifier("modifier_eul_cyclone")
		&& !e.HasModifier("modifier_dazzle_shallow_grave")
		&& !e.HasModifier("modifier_brewmaster_storm_cyclone")
		&& !e.HasModifier("modifier_shadow_demon_disruption")
		&& !e.HasModifier("modifier_tusk_snowball_movement")
		&& !MyHero.HasModifier("modifier_pugna_nether_ward_aura")
		&& !MyHero.IsSilenced
		&& !MyHero.IsHexed
		&& !MyHero.HasModifier("modifier_doom_bringer_doom")
		&& !MyHero.HasModifier("modifier_riki_smoke_screen")
		&& !MyHero.HasModifier("modifier_disruptor_static_storm"))
	{
		if (!Sleep.Sleeping("autosteal") && !MyHero.IsChanneling)
		{
			let EzkillCheck = EZKill(e);
			let magicimune = (!e.IsMagicImmune && !e.HasModifier("modifier_eul_cyclone"))
			if (!MyHero.IsChanneling
				&& MyHero.CanAttack(e)
				&& !MyHero.Spells.some(x=>x!==undefined&&x.IsInAbilityPhase)
				&& OneHitLeft(e)
				&& e.NetworkPosition.Distance2D(MyHero.NetworkPosition) <= MyHero.AttackRange + 50)
			{
				MyHero.AttackTarget(e)
				return false
			}
			if (EzkillCheck)
			{
				//zefir
				if (ItemsInit.Ethereal !== undefined
					&& ItemsInit.Ethereal.CanBeCasted()
					&& items.IsEnabled("item_ethereal_blade")
					&& !Sleep.Sleeping(`${e.Index + ItemsInit.Ethereal.Index}`)
					&& MyHero.IsInRange(e, ItemsInit.Ethereal.CastRange)
				) {
					ItemsInit.Ethereal.UseAbility(e)
					Sleep.Sleep(ItemsInit.Tick, `${e.Index + ItemsInit.Ethereal.Index}`)
					return false
				}
				if (ItemsInit.Dagon !== undefined//dagon
					&& items.IsEnabled("item_dagon_5")
					&& ItemsInit.Dagon.CanBeCasted()
					&& MyHero.Distance2D(e) <= ItemsInit.Dagon.CastRange
					&& !Sleep.Sleeping(`${e.Index + ItemsInit.Dagon.Index}`)
					) {
					ItemsInit.Dagon.UseAbility(e)
					Sleep.Sleep(ItemsInit.Tick, `${e.Index + ItemsInit.Dagon.Index}`)
					return false
				}
				Sleep.Sleep(150, "autosteal")
			}
			
		}
	}
})	
}

