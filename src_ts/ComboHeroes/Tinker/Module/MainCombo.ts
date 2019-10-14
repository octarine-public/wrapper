import { GameSleeper, Sleeper, Game, Vector3, Utils } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { MouseTarget, MyHero, Heroes,  trees } from "../Listeners"
import { BreakInit } from "./LinkenBreaker";
import { abils, bmcheck, blinkRadius, comboKey, items,blinkM, helpF,blinkV, soulTresh, active } from "../MenuManager"

import InitAbility from "../Extends/Abilities"
import InitItems from "../Extends/Items"
import { TinkerStatus } from "./status";

let Sleep = new GameSleeper()

export function MainCombo() {
	if (!Base.IsRestrictions(active)||Sleep.Sleeping("r"))
	{
		return false
	}
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
	if (Base.Cancel(target) && !MyHero.IsChanneling && !Abilities.r.IsChanneling && !Sleep.Sleeping("r")) {
		TinkerStatus(0)
		if (ItemsInit.Blink !== undefined
			&& blinkV.value
			&& ItemsInit.Blink.CanBeCasted()
			&& !target.IsInRange(MyHero,600)
			) {
				let castRange = ItemsInit.Blink.GetSpecialValue("blink_range") + MyHero.CastRangeBonus
				let qRange = 650+MyHero.CastRangeBonus//q range
				let disToTarget  = MyHero.Distance(target)
				if (blinkM.selected_id==0 && !target.IsInRange(MyHero, 450))//DEF MODE
				{//c&p sky
					ItemsInit.Blink.UseAbility(MyHero.NetworkPosition.Extend(target.NetworkPosition, Math.min(castRange, MyHero.Distance(target) - blinkRadius.value) - 1))
					Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30,"r")
					return true
				}
				else if (blinkM.selected_id==2)//SMART MODE
				{
					if (disToTarget>castRange)//RANGE TOO B1G
					{
						ItemsInit.Blink.UseAbility(MyHero.NetworkPosition.Extend(target.NetworkPosition, castRange - 1))
						Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30,"r")
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
						Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30,"r")
						return true
						
					}
					
				}
				else if (blinkM.selected_id==1)//LASER w CURSOR MODE
				{
					if (disToTarget>castRange)//RANGE TOO B1G
					{
						ItemsInit.Blink.UseAbility(MyHero.NetworkPosition.Extend(target.InFront(30), castRange - 1))
						Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30,`${target.Index + ItemsInit.Blink.Index}`)
						return true
					}
					else 
					{
						let dir:Vector3 =  target.NetworkPosition.Extend(Utils.CursorWorldVec, qRange-target.IdealSpeed*Abilities.r.GetSpecialValue("channel_tooltip"))
						ItemsInit.Blink.UseAbility(dir)
						Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30,`${target.Index + ItemsInit.Blink.Index}`)
						return true
					}

				}
		}
		if (Base.IsLinkensProtected(target)) {
			BreakInit()
			return true
		}
		//soulring
		if (ItemsInit.Soulring !== undefined
			&& ItemsInit.Soulring.CanBeCasted()
			&& (MyHero.HP / MyHero.MaxHP * 100 > soulTresh.value)
		) {
				ItemsInit.Soulring.UseAbility()
				//console.log("soulr: "+Game.RawGameTime + " cd "+ItemsInit.Soulring.Cooldown)
				Sleep.Sleep(ItemsInit.Tick+ GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30, "r")
				return true
		}
		//ghost
		if (ItemsInit.Ghost !== undefined
			&& ItemsInit.Ghost.CanBeCasted()
			&& items.IsEnabled("item_ghost")
			&&!MyHero.IsEthereal
		) {
			ItemsInit.Ghost.UseAbility()
			Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30, "r")
			return true
			
		}
		//LotusOrb
		if (ItemsInit.LotusOrb !== undefined
			&& ItemsInit.LotusOrb.CanBeCasted()
			&& items.IsEnabled("item_lotus_orb")
			&& Heroes.filter(e => e.IsInRange(MyHero, 1050)).length > 0
		) {
			if (helpF) {
				let xxxtentacion = Heroes.filter(hero => !hero.IsEnemy()&&hero.Distance(MyHero) <= 900 + MyHero.CastRangeBonus && hero.IsAlive && !hero.ModifiersBook.HasBuffByName("modifier_item_lotus_orb_active"))[0]
				if (xxxtentacion !== undefined && MyHero.HasModifier("modifier_item_lotus_orb_active")) {
					ItemsInit.LotusOrb.UseAbility(xxxtentacion)
					Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30, "r")
					return true
				}
				else {
					if (!MyHero.HasModifier("modifier_item_lotus_orb_active"))
					{
					ItemsInit.LotusOrb.UseAbility(MyHero)
					Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30,"r")
					return true
					}
				}
			}
			else {
				if (MyHero.HasModifier("modifier_item_lotus_orb_active"))
				{
				ItemsInit.LotusOrb.UseAbility(MyHero)
				Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30, "r")
				return true
				}
			}
		}//greaves
		if (ItemsInit.Greaves !== undefined
			&& ItemsInit.Greaves.CanBeCasted()
			&& items.IsEnabled("item_guardian_greaves")
			
		) {
			ItemsInit.Greaves.UseAbility()
			Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30, "r")
			return true
		
		}//ethereal
		if (ItemsInit.Ethereal !== undefined
			&& ItemsInit.Ethereal.CanBeCasted()
			&& items.IsEnabled("item_ethereal_blade")
			&& MyHero.IsInRange(target, ItemsInit.Ethereal.CastRange)
		) {
			ItemsInit.Ethereal.UseAbility(target)
			//console.log("ethereal: "+Game.RawGameTime + " cd "+ItemsInit.Ethereal.Cooldown)
			Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ 150, "r")
			return true
		}
		//hex
		if (ItemsInit.Sheeps !== undefined
			&& ItemsInit.Sheeps.CanBeCasted()
			&& items.IsEnabled("item_sheepstick")
			&& (!target.IsHexed&&!target.IsStunned
				|| (target.HasModifier("modifier_sheepstick_debuff")
					&& target.ModifiersBook.GetBuffByName("modifier_sheepstick_debuff").RemainingTime <= Abilities.r.CastPoint + Abilities.r.GetSpecialValue("channel_tooltip", Abilities.r.Level) + GetLatency(0) + GetLatency(1)+60))
			&& MyHero.IsInRange(target, ItemsInit.Sheeps.CastRange)		
		) {
			ItemsInit.Sheeps.UseAbility(target)
			//console.log("sheep: "+Game.RawGameTime+ " cd "+ItemsInit.Sheeps.Cooldown)
			Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30, "r")
			return true
		}//nullifier
		if (ItemsInit.Nullifier !== undefined
			&& ItemsInit.Nullifier.CanBeCasted()
			&& items.IsEnabled("item_nullifier")
			&& !target.IsMuted
			&& MyHero.IsInRange(target, ItemsInit.Nullifier.CastRange)
		) {
			ItemsInit.Nullifier.UseAbility(target)
			Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30, "r")
			return true
		}//orchid
		if (ItemsInit.Orchid !== undefined
			&& ItemsInit.Orchid.CanBeCasted()
			&& items.IsEnabled("item_orchid")
			&& !target.IsSilenced
			&& MyHero.IsInRange(target, ItemsInit.Orchid.CastRange)
		) {
			ItemsInit.Orchid.UseAbility(target)
			Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30, "r")
			return true
		}//blood
		if (ItemsInit.Bloodthorn !== undefined
			&& ItemsInit.Bloodthorn.CanBeCasted()
			&& items.IsEnabled("item_bloodthorn")
			&& !target.IsSilenced
			&& MyHero.IsInRange(target, ItemsInit.Bloodthorn.CastRange)
		) {
			ItemsInit.Bloodthorn.UseAbility(target)
			Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30, "r")
			return true

		}//atos
		if (ItemsInit.RodofAtos !== undefined
			&& ItemsInit.RodofAtos.CanBeCasted()
			&& items.IsEnabled("item_rod_of_atos")
			&& MyHero.IsInRange(target, ItemsInit.RodofAtos.CastRange)
		) {
			ItemsInit.RodofAtos.UseAbility(target)
			Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30,"r")
			return true
		}//veil
		if (ItemsInit.Discord !== undefined
			&& ItemsInit.Discord.CanBeCasted()
			&& items.IsEnabled("item_veil_of_discord")
			&& MyHero.IsInRange(target, ItemsInit.Discord.CastRange)
		) {
			ItemsInit.Discord.UseAbility(target.InFront(35))
			Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30, "r")
			return true
		}

		if (Abilities.w !== undefined//rocket
			&& !Abilities.w.IsInAbilityPhase
			&& Abilities.w.CanBeCasted()
			&& abils.IsEnabled("tinker_heat_seeking_missile")
			&& MyHero.Distance2D(target) <= 2500+MyHero.CastRangeBonus
		) {
			Abilities.w.UseAbility()
			//console.log("rocket: "+Game.RawGameTime+ " cd "+Abilities.w.Cooldown)
			Sleep.Sleep(Abilities.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30, "r")
			return true
		}
			//shivas
		if (ItemsInit.Shivas !== undefined
			&& ItemsInit.Shivas.CanBeCasted()
			&& items.IsEnabled("item_shivas_guard")
			&& MyHero.Distance2D(target)<= 800 + MyHero.CastRangeBonus
		) {
			ItemsInit.Shivas.UseAbility()
			Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30, "r")
			return true
		}
		
		if (Abilities.q !== undefined//laser
			&& !Abilities.q.IsInAbilityPhase
			&& Abilities.q.CanBeCasted()
			&& abils.IsEnabled("tinker_laser")
			&& MyHero.Distance2D(target) < 650+MyHero.CastRangeBonus
		) {
			
			Abilities.q.UseAbility(target)
			//console.log("laser: "+Game.RawGameTime+  " cd "+Abilities.q.Cooldown)
			Sleep.Sleep(Abilities.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30 + 450, "r")
			return true
		}
		if (ItemsInit.Dagon !== undefined//dagon
			&& items.IsEnabled("item_dagon_5")
			&& ItemsInit.Dagon.CanBeCasted()
			&& MyHero.Distance2D(target) <= ItemsInit.Dagon.CastRange
			) {
			ItemsInit.Dagon.UseAbility(target)
			//console.log("dagon: "+Game.RawGameTime+ " cd "+ItemsInit.Dagon.CooldownLength)
			Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30, "r")
			return true
		}
		//glimmer
		if (ItemsInit.Glimmer !== undefined
			&& ItemsInit.Glimmer.CanBeCasted()
			&& items.IsEnabled("item_glimmer_cape")
		) {
			
			ItemsInit.Glimmer.UseAbility(MyHero)
			Sleep.Sleep(ItemsInit.Tick+GetLatency(Flow_t.OUT)*1000+ GetLatency(Flow_t.IN)*1000 + 30, "r")
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
			) {
			
			Abilities.r.UseAbility()
			Sleep.Sleep(Abilities.r.GetSpecialValue("channel_tooltip")* 1000+Abilities.r.CastPoint*1000+GetLatency(0)*1000+GetLatency(1)*1000+40, "r")
			//console.log("rearm: "+Game.RawGameTime)
			return true
		}
	}
}