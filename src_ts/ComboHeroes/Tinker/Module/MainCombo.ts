import { GameSleeper, Sleeper, Game, Vector3, Utils } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { MouseTarget, MyHero, Heroes,  trees } from "../Listeners"
import { BreakInit } from "./LinkenBreaker";
import { etherD, abils, bmcheck, blinkRadius, comboKey, items,blinkM, helpF,blinkV, soulTresh, active,  blinkKey } from "../MenuManager"

import InitAbility from "../Extends/Abilities"
import InitItems from "../Extends/Items"
import { TinkerStatus } from "./status";

let Sleep = new GameSleeper()

export function MainCombo() {
	if (!Base.IsRestrictions(active))
		return false
	if (!comboKey.is_pressed||MouseTarget === undefined)
	{
		TinkerStatus(3)
		return false
	}
	let target = MouseTarget
	if (target === undefined || (bmcheck.value && target.HasModifier("modifier_item_blade_mail_reflect"))) {
		return false
	}
	let ItemsInit = new InitItems(MyHero),
		Abilities = new InitAbility(MyHero)
	if (ItemsInit.EtherealDelay) {
			Sleep.Sleep(ItemsInit.EtherealDelay as number, "EtherealDelay")
		}
	if (!Sleep.Sleeping("r") && !Abilities.r.IsChanneling && Base.Cancel(target)) {
		TinkerStatus(0)
		if (ItemsInit.Blink !== undefined
			&& blinkV.value
			&& ItemsInit.Blink.CanBeCasted()
			&& !Sleep.Sleeping(`${target.Index + ItemsInit.Blink.Index}`)
			&& !target.IsInRange(MyHero,600)
			) {
				let castRange = ItemsInit.Blink.GetSpecialValue("blink_range") + MyHero.CastRangeBonus
				let qRange = 650+MyHero.CastRangeBonus//q range
				let disToTarget  = MyHero.Distance(target)
				if (blinkM.selected_id==0 && !target.IsInRange(MyHero, 450))//DEF MODE
				{//c&p sky
					ItemsInit.Blink.UseAbility(MyHero.NetworkPosition.Extend(target.NetworkPosition, Math.min(castRange, MyHero.Distance(target) - blinkRadius.value) - 1))
					Sleep.Sleep(ItemsInit.Tick,`${target.Index + ItemsInit.Blink.Index}`)
					return true
				}
				else if (blinkM.selected_id==2)//SMART MODE
				{
					if (disToTarget>castRange)//RANGE TOO B1G
					{
						ItemsInit.Blink.UseAbility(MyHero.NetworkPosition.Extend(target.NetworkPosition, castRange - 1))
						Sleep.Sleep(ItemsInit.Tick,`${target.Index + ItemsInit.Blink.Index}`)
						return true
					}
					else
					{
						let dir:Vector3
						let fin:Vector3
						for (let _i = -Math.PI/3; _i < Math.PI/3; _i++) {
							dir = target.InFrontFromAngle(_i, qRange-target.IdealSpeed*Abilities.r.GetSpecialValue("channel_tooltip"))
							if (dir.z>=target.NetworkPosition.z
								&&!trees.some(Tree => Tree.IsInRange(dir, 250) && Tree.IsAlive)
								&&!Heroes.some(e =>e!==target&& e.IsInRange(dir, 450) && e.IsAlive))
								{
								fin = dir
								}
						}
						if (fin!==undefined)
						{
							ItemsInit.Blink.UseAbility(fin)
						}
						else if (target.InFront(qRange-target.IdealSpeed*Abilities.r.GetSpecialValue("channel_tooltip")).z>=target.NetworkPosition.z)
						{
							ItemsInit.Blink.UseAbility(target.InFront(qRange))
						}
						else
						{
							ItemsInit.Blink.UseAbility(target.NetworkPosition)
						}
						Sleep.Sleep(ItemsInit.Tick,`${target.Index + ItemsInit.Blink.Index}`)
						return true
						
					}
					
				}
				else if (blinkM.selected_id==1)//LASER w CURSOR MODE
				{
					if (disToTarget>castRange)//RANGE TOO B1G
					{
						ItemsInit.Blink.UseAbility(MyHero.NetworkPosition.Extend(target.InFront(30), castRange - 1))
						Sleep.Sleep(ItemsInit.Tick,`${target.Index + ItemsInit.Blink.Index}`)
						return true
					}
					else 
					{
						let dir:Vector3 =  target.NetworkPosition.Extend(Utils.CursorWorldVec, qRange-target.IdealSpeed*Abilities.r.GetSpecialValue("channel_tooltip"))
						ItemsInit.Blink.UseAbility(dir)
						Sleep.Sleep(ItemsInit.Tick,`${target.Index + ItemsInit.Blink.Index}`)
						return true
					}

				}
		}
		if (Base.IsLinkensProtected(target)||Base.IsLotusProtected(target)) {
			BreakInit()
			return true
		}
		//soulring
		if (ItemsInit.Soulring !== undefined
			&& ItemsInit.Soulring.CanBeCasted()
			&& (MyHero.HP / MyHero.MaxHP * 100 > soulTresh.value)
			&& !Sleep.Sleeping(`${target.Index + ItemsInit.Soulring.Index}`)
		) {
				ItemsInit.Soulring.UseAbility()
				//console.log("soulr: "+Game.RawGameTime)
				Sleep.Sleep(ItemsInit.Tick, `${target.Index + ItemsInit.Soulring.Index}`)
				return true
		}
		//ghost
		if (ItemsInit.Ghost !== undefined
			&& ItemsInit.Ghost.CanBeCasted()
			&& items.IsEnabled("item_ghost")
			&&!Sleep.Sleeping(`${target.Index + ItemsInit.Ghost.Index}`)
			&&!MyHero.IsEthereal
		) {
			ItemsInit.Ghost.UseAbility()
			Sleep.Sleep(ItemsInit.Tick, `${target.Index + ItemsInit.Ghost.Index}`)
			return true
			
		}
		//LotusOrb
		if (ItemsInit.LotusOrb !== undefined
			&& ItemsInit.LotusOrb.CanBeCasted()
			&& items.IsEnabled("item_lotus_orb")
			&& Heroes.filter(e => e.IsInRange(MyHero, 1050)).length > 0
			&&!Sleep.Sleeping
		) {
			if (helpF) {
				let xxxtentacion = Heroes.filter(hero => !hero.IsEnemy()&&hero.Distance(MyHero) <= 900 + MyHero.CastRangeBonus && hero.IsAlive && !hero.ModifiersBook.HasBuffByName("modifier_item_lotus_orb_active"))[0]
				if (xxxtentacion !== undefined && MyHero.HasModifier("modifier_item_lotus_orb_active")) {
					ItemsInit.LotusOrb.UseAbility(xxxtentacion)
					Sleep.Sleep(ItemsInit.Tick, `${xxxtentacion.Index + ItemsInit.LotusOrb.Index}`)
					return true
				}
				else {
					if (!MyHero.HasModifier("modifier_item_lotus_orb_active"))
					{
					ItemsInit.LotusOrb.UseAbility(MyHero)
					Sleep.Sleep(ItemsInit.Tick, `${target.Index + ItemsInit.LotusOrb.Index}`)
					return true
					}
				}
			}
			else {
				if (MyHero.HasModifier("modifier_item_lotus_orb_active"))
				{
				ItemsInit.LotusOrb.UseAbility(MyHero)
				Sleep.Sleep(ItemsInit.Tick, `${target.Index + ItemsInit.LotusOrb.Index}`)
				return true
				}
			}
		}//greaves
		if (ItemsInit.Greaves !== undefined
			&& ItemsInit.Greaves.CanBeCasted()
			&& items.IsEnabled("item_guardian_greaves")
			&&!Sleep.Sleeping(`${target.Index + ItemsInit.Greaves.Index}`)
			
		) {
			ItemsInit.Greaves.UseAbility()
			Sleep.Sleep(ItemsInit.Tick, `${target.Index + ItemsInit.Greaves.Index}`)
			return true
		
		}//zefir
		if (ItemsInit.Ethereal !== undefined
			&& ItemsInit.Ethereal.CanBeCasted()
			&& items.IsEnabled("item_ethereal_blade")
			&& !Sleep.Sleeping(`${target.Index + ItemsInit.Ethereal.Index}`)
			&& MyHero.IsInRange(target, ItemsInit.Ethereal.CastRange)
		) {
			ItemsInit.Ethereal.UseAbility(target)
			//console.log("ethereal: "+Game.RawGameTime)
			Sleep.Sleep(ItemsInit.Tick, `${target.Index + ItemsInit.Ethereal.Index}`)
			return true
		}
		//hex
		if (ItemsInit.Sheeps !== undefined
			&& ItemsInit.Sheeps.CanBeCasted()
			&& items.IsEnabled("item_sheepstick")
			&& (!target.IsHexed&&!target.IsStunned
				|| (target.HasModifier("modifier_sheepstick_debuff")
					&& target.ModifiersBook.GetBuffByName("modifier_sheepstick_debuff").RemainingTime <= Abilities.r.CastPoint + Abilities.r.GetSpecialValue("channel_tooltip", Abilities.r.Level) + GetLatency(0) + GetLatency(1)))
			&&!Sleep.Sleeping(`${target.Index + ItemsInit.Sheeps.Index}`)
			&& MyHero.IsInRange(target, ItemsInit.Sheeps.CastRange)		
		) {
			ItemsInit.Sheeps.UseAbility(target)
			//console.log("sheep: "+Game.RawGameTime)
			Sleep.Sleep(ItemsInit.Tick, `${target.Index + ItemsInit.Sheeps.Index}`)
			return true
		}//nullifier
		if (ItemsInit.Nullifier !== undefined
			&& ItemsInit.Nullifier.CanBeCasted()
			&& items.IsEnabled("item_nullifier")
			&& !target.IsMuted
			&& !Sleep.Sleeping(`${target.Index + ItemsInit.Nullifier.Index}`)
			&& MyHero.IsInRange(target, ItemsInit.Nullifier.CastRange)
		) {
			ItemsInit.Nullifier.UseAbility(target)
			Sleep.Sleep(ItemsInit.Tick, `${target.Index + ItemsInit.Nullifier.Index}`)
			return true
		}//orchid
		if (ItemsInit.Orchid !== undefined
			&& ItemsInit.Orchid.CanBeCasted()
			&& items.IsEnabled("item_orchid")
			&& !target.IsSilenced
			&& !Sleep.Sleeping(`${target.Index + ItemsInit.Orchid.Index}`)
			&& MyHero.IsInRange(target, ItemsInit.Orchid.CastRange)
		) {
			ItemsInit.Orchid.UseAbility(target)
			Sleep.Sleep(ItemsInit.Tick, `${target.Index + ItemsInit.Orchid.Index}`)
			return true
		}//blood
		if (ItemsInit.Bloodthorn !== undefined
			&& ItemsInit.Bloodthorn.CanBeCasted()
			&& items.IsEnabled("item_bloodthorn")
			&& !target.IsSilenced
			&& !Sleep.Sleeping(`${target.Index + ItemsInit.Bloodthorn.Index}`)
			&& MyHero.IsInRange(target, ItemsInit.Bloodthorn.CastRange)
		) {
			ItemsInit.Bloodthorn.UseAbility(target)
			Sleep.Sleep(ItemsInit.Tick, `${target.Index + ItemsInit.Bloodthorn.Index}`)
			return true

		}//atos
		if (ItemsInit.RodofAtos !== undefined
			&& ItemsInit.RodofAtos.CanBeCasted()
			&& items.IsEnabled("item_rod_of_atos")
			&&!Sleep.Sleeping(`${target.Index + ItemsInit.RodofAtos.Index}`)
			&& MyHero.IsInRange(target, ItemsInit.RodofAtos.CastRange)
		) {
			ItemsInit.RodofAtos.UseAbility(target)
			Sleep.Sleep(ItemsInit.Tick, `${target.Index + ItemsInit.RodofAtos.Index}`)
			return true
		}//veil
		if (ItemsInit.Discord !== undefined
			&& ItemsInit.Discord.CanBeCasted()
			&& items.IsEnabled("item_veil_of_discord")
			&& !Sleep.Sleeping(`${target.Index + ItemsInit.Discord.Index}`)
			&& MyHero.IsInRange(target, ItemsInit.Discord.CastRange)
		) {
			ItemsInit.Discord.UseAbility(target.InFront(35))
			Sleep.Sleep(ItemsInit.Tick, `${target.Index + ItemsInit.Discord.Index}`)
			return true
		}
		if (etherD.value)
		{
			
		}
		if (ItemsInit.Ethereal === undefined 
			|| etherD.value&&(ItemsInit.EtherealDelay||target.IsEthereal) || !etherD.value
			) {
			if (Abilities.w !== undefined//rocket
				&& !Abilities.w.IsInAbilityPhase
				&& Abilities.w.CanBeCasted()
				&& abils.IsEnabled("tinker_heat_seeking_missile")
				&& MyHero.Distance2D(target) <= 2500+MyHero.CastRangeBonus
				&& !Sleep.Sleeping(`${target.Index + Abilities.w.Index}`)
			) {
				Abilities.w.UseAbility()
				//console.log("rocket: "+Game.RawGameTime)
				Sleep.Sleep(Abilities.Tick, `${target.Index + Abilities.w.Index}`)
				return true
			}
				//shivas
			if (ItemsInit.Shivas !== undefined
				&& ItemsInit.Shivas.CanBeCasted()
				&& items.IsEnabled("item_shivas_guard")
				&&!Sleep.Sleeping(`${target.Index + ItemsInit.Shivas.Index}`)
				&& MyHero.Distance2D(target)<= 800 + MyHero.CastRangeBonus
			) {
				ItemsInit.Shivas.UseAbility()
				Sleep.Sleep(ItemsInit.Tick, `${target.Index + ItemsInit.Shivas.Index}`)
				return true
			}
			if (Abilities.q !== undefined//laser
				&& !Abilities.q.IsInAbilityPhase
				&& Abilities.q.CanBeCasted()
				&& abils.IsEnabled("tinker_laser")
				&& MyHero.Distance2D(target) < 650+MyHero.CastRangeBonus
				&& !Sleep.Sleeping(`${target.Index + Abilities.q.Index}`)
			) {
				Abilities.q.UseAbility(target)
				//console.log("laser: "+Game.RawGameTime)
				Sleep.Sleep(Abilities.Tick, `${target.Index + Abilities.q.Index}`)
				return true
			}
			if (ItemsInit.Dagon !== undefined//dagon
				&& items.IsEnabled("item_dagon_5")
				&& ItemsInit.Dagon.CanBeCasted()
				&& MyHero.Distance2D(target) <= ItemsInit.Dagon.CastRange
				&& !Sleep.Sleeping(`${target.Index + ItemsInit.Dagon.Index}`)
				) {
				ItemsInit.Dagon.UseAbility(target)
				//console.log("dagon: "+Game.RawGameTime)
				Sleep.Sleep(ItemsInit.Tick, `${target.Index + ItemsInit.Dagon.Index}`)
				return true
			}
		}
		//glimmer
		if (ItemsInit.Glimmer !== undefined
			&& ItemsInit.Glimmer.CanBeCasted()
			&& items.IsEnabled("item_glimmer_cape")
			&&!Sleep.Sleeping(`${target.Index + ItemsInit.Glimmer.Index}`)
		) {
			ItemsInit.Glimmer.UseAbility(MyHero)
			Sleep.Sleep(ItemsInit.Tick, `${target.Index + ItemsInit.Glimmer.Index}`)
			return true
		}
		if (Abilities.r !== undefined
			&&Abilities.r.CanBeCasted() 
			&& abils.IsEnabled("tinker_rearm") 
			&& ((ItemsInit.Sheeps!==undefined && !ItemsInit.Sheeps.IsReady) 
			|| (ItemsInit.Discord!==undefined && !ItemsInit.Discord.IsReady) 
			|| (ItemsInit.Ethereal!==undefined&&!ItemsInit.Ethereal.IsReady) 
			|| (ItemsInit.Dagon!==undefined&&!ItemsInit.Dagon.IsReady) 
			|| (ItemsInit.Orchid!==undefined && !ItemsInit.Orchid.IsReady) 
			|| (ItemsInit.Bloodthorn!==undefined&&!ItemsInit.Bloodthorn.IsReady) 
			|| (ItemsInit.Shivas!==undefined&& !ItemsInit.Shivas.IsReady) 
			|| (ItemsInit.Nullifier!==undefined&&!ItemsInit.Nullifier.IsReady) 
			|| (Abilities.q!==undefined&&!Abilities.q.IsReady) 
			|| (Abilities.w!==undefined&&!Abilities.w.IsReady))
			&& target.IsAlive
			&& !Sleep.Sleeping("r")
			) {
			Abilities.r.UseAbility()
			//console.log("rearm: "+Game.RawGameTime)
			Sleep.Sleep(Abilities.r.GetSpecialValue("channel_tooltip")* 1000+Abilities.r.CastPoint*1000+45, "r")
			return true
		}
		
		if (MyHero.CanAttack(target)//tut budet orbwalk:)
			&& !Sleep.Sleeping("Attack")
			&& !target.IsEthereal
			&& !ItemsInit.EtherealDelay
			&& !MyHero.IsChanneling
			&& !MyHero.Spells.some(e=>e!==undefined && e.IsInAbilityPhase)
			) {
			MyHero.AttackTarget(target)
			Sleep.Sleep(MyHero.SecondsPerAttack * 1000, "Attack")
			return true
		}
	}
}
