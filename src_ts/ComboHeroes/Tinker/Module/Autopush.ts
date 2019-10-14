import { Ability, ArrayExtensions, Color, EventsSDK, Game, Hero, Item, Menu, ParticlesSDK, RendererSDK, Utils, Vector2, Vector3, GameSleeper, Creep, Tree, Entity, Team, Tower, Building } from "wrapper/Imports"
import { Base } from "../Extends/Helper"
import { MyHero, Heroes, creeps,trees, savespots, fountain,radiantSpot, radiantCast, direSpot,direCast, MouseTarget, radj, towers } from "../Listeners"
import { marshKey, comboKey, TinkerPushCreeps, autoMarsh,TinkerPushEnemies,TinkerPushAllies ,TinkerPushSave ,TinkerPushDef  ,TinkerPushJungle , active, spamKey, autoKey, smartRegen } from "../MenuManager"
import { TinkerStatus } from "./status";
import InitItems from "../Extends/Items"
import InitAbility from "../Extends/Abilities"
let sleeper = new GameSleeper();
let latency:number,
	ported:boolean,
	marched: number,
	TinkerPusher:boolean,
	lastTick:number,
	TinkerJungleFarmPos: Vector3[],
	TinkerJungle:boolean,
	moved:boolean = false,
	dropped:boolean = false,
	slots:number[] = [0,0,0,0,0,0]
export function Push(){
	if (!Base.IsRestrictions(active) || comboKey.is_pressed||spamKey.is_pressed||marshKey.is_pressed)
		return false
	let items =  new InitItems(MyHero),
		abils = new InitAbility(MyHero)
	if (items.TravelBoot == undefined)
			return	false
	latency = GetLatency(0)+GetLatency(1)+0.1
	if (autoKey.is_pressed && !sleeper.Sleeping("button"))
	{
		TinkerPusher = !TinkerPusher
		sleeper.Sleep(110,"button")
	}
	if (TinkerPusher)
	{
		////console.log("all neutrals" + creeps.filter(e=>e.Team == Team.Neutral&&!e.IsLaneCreep).length)
		////console.log("alive "+creeps.filter(e=>e.Team == Team.Neutral&&!e.IsLaneCreep && e.IsAlive).length)
		////console.log("!waiting to spawn" + creeps.filter(e=>e.Team == Team.Neutral&&!e.IsLaneCreep && !e.IsWaitingToSpawn).length)
		////console.log("spawned "+creeps.filter(e=>e.Team == Team.Neutral&&!e.IsLaneCreep && e.IsSpawned).length)
		////console.log("lifestate dead: "+creeps.filter(e=>e.Team == Team.Neutral&&!e.IsLaneCreep && e.LifeState==LifeState_t.LIFE_DEAD).length +  "lifestate respawning: "+creeps.filter(e=>e.Team == Team.Neutral&&!e.IsLaneCreep && e.LifeState==LifeState_t.LIFE_RESPAWNING).length + "lifestate dying: "+creeps.filter(e=>e.Team == Team.Neutral&&!e.IsLaneCreep && e.LifeState==LifeState_t.LIFE_DYING).length)
		let e = abils.e,
			r = abils.r,
			hex = items.Sheeps,
			eblade = items.Ethereal,
			orchid = items.Orchid,
			blood = items.Bloodthorn,
			bottle = items.Bottle,
			soulring = items.Soulring,
			blink = items.Blink,
			TravelBoots = items.TravelBoot,
			sitems:String[] = ["item_aether_lens","item_sheepstick","item_dagon_5","item_dagon","item_dagon_2","item_dagon_3","item_dagon_4","item_shivas_guard","item_bloodthorn","item_orchid","item_rod_of_atos"]
		TinkerStatus(2)
		function checkForTrees(vec: Vector3, range: number)
		{
			return trees.filter(Tree => Tree.IsInRange(vec, range) && Tree.IsAlive).length;
		}
		function amionf(){
			if (MyHero.IsInRange(fountain, 1010)) return true
			return false
		}
		function TinkerGetJunglePos()
		{
			//console.log("TinkerGetJunglePos")
			
			if  (!e || !r)  return 
			let marchCount = 3
			if (MyHero.GetTalentValue("special_bonus_spell_amplify_10")||MyHero.GetItemByName(/item_kaya/)!== undefined)
				marchCount = 2
			let neededMana = r.ManaCost * (marchCount - 1) + e.ManaCost * marchCount - (soulring?(marchCount * 150):0)
			if ( MyHero.MaxMana < neededMana) 
			{	
				//console.log("mana return")
				return 
			}
			if (TinkerJungleFarmPos == undefined || TinkerJungleFarmPos[0]== undefined ||TinkerJungleFarmPos[1]== undefined)
			{
				if (MyHero.Team == 2)
				{
					for (let _s = 0; _s <5;_s++)
					{
						if (creeps.filter(e=>!e.IsWaitingToSpawn&&e.LifeState !== LifeState_t.LIFE_DEAD &&  e.Team == Team.Neutral&&e.IsInRange(radiantSpot[_s], radj[0][_s])).length>=3)
						{
							TinkerJungleFarmPos = [radiantSpot[_s],radiantCast[_s] ]
							return
						}
					}
					return 
				}	
				else
				{
					for (let _s = 0; _s <5;_s++)
					{
						if (creeps.filter(e=>!e.IsWaitingToSpawn&&e.LifeState !== LifeState_t.LIFE_DEAD &&  e.Team == Team.Neutral&&e.IsInRange(direSpot[_s], radj[1][_s])).length>=3 )
						{
							TinkerJungleFarmPos = [direSpot[_s],direCast[_s] ]
							return
						}
					}
					return
				}	
			}
		}
		function TinkerJungleFarm()
		{
			//console.log("tjunglefarm")
			if (TinkerJungleFarmPos == undefined || TinkerJungleFarmPos.length == 0) return
			let movePos = TinkerJungleFarmPos[0]
			let castPos = TinkerJungleFarmPos[1]
			let marchCount = 3
			//	if NPC.HasAbility(myHero, "special_bonus_unique_tinker_2") && Ability.GetLevel(NPC.GetAbility(myHero, "special_bonus_unique_tinker_2")) > 0 
			//		marchCount = 2
				

			if (!MyHero.IsInRange(movePos,35))
			{
				if (blink && blink.CanBeCasted()&&!sleeper.Sleeping("blpush") && (MyHero.NetworkPosition.Distance2D(movePos) > 500 ))
				{
					if (MyHero.NetworkPosition.Distance2D(movePos) > 1190 )
					{
						let blinkPos = MyHero.NetworkPosition.Add((movePos.Subtract(MyHero.NetworkPosition)).Normalize().ScaleTo(1190))
						if (checkForTrees(blinkPos, 150)<1)
						{
							if (blink.IsReady) MyHero.CastPosition(blink, blinkPos)
							lastTick = Game.RawGameTime + 0.02 + latency
							MyHero.HoldPosition(MyHero.NetworkPosition,true)
							//console.log("cast blink, 1177, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
							sleeper.Sleep(119,"blpush")
							return
						}
					}	
					else
					{
						if (blink.IsReady) MyHero.CastPosition(blink, movePos)
						MyHero.HoldPosition(MyHero.NetworkPosition,true)
						lastTick = Game.RawGameTime + 0.02 + latency
						//console.log("cast blink, 1187, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
						return
					}
					
				}
				MyHero.MoveTo(movePos)
			}
			if (!MyHero.IsMoving && MyHero.IsInRange(movePos,35))
			{
				if (marched < marchCount)
				{
					if (e.CanBeCasted()&& e.IsReady&&!sleeper.Sleeping("epush")) 
					{
						MyHero.CastPosition(e, castPos)
						marched = marched + 1
						lastTick = Game.RawGameTime + 0.75 + latency
						//console.log("cast e, 1200, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
						sleeper.Sleep(770+latency,"epush")
						return
					}
					else
					{
						if (r.CanBeCasted()) 
						{
							MyHero.CastNoTarget(r)
							lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + r.CastPoint + latency
							//console.log("cast r, 1210, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
							return
						}
						else
						{
							if (TravelBoots.CanBeCasted()&&TravelBoots.IsReady) 
								MyHero.CastPosition(TravelBoots, fountain)
								lastTick = Game.RawGameTime + 3.05 + latency
								marched = 0
								TinkerJungle = false
								TinkerJungleFarmPos = []
								//console.log("cast boot after jungle, 1218, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
								return
						}
					}
							
				}		
					
				else
				{
					if (TravelBoots.CanBeCasted()&&TravelBoots.IsReady) 
					{
						MyHero.CastPosition(TravelBoots, fountain)
						lastTick = Game.RawGameTime + 3.05 + latency
						marched = 0
						TinkerJungle = false
						TinkerJungleFarmPos = []
						//console.log("cast boot after jungle, 1235, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
						return
					}
					else
					{
						if (r.CanBeCasted()) 
						{
							MyHero.CastNoTarget(r)
							lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + r.CastPoint + latency
							//console.log("cast r, 1248, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
							return
						}
					}
				}		
			}		
			return	
		}
		function TinkerFarmGetSaveSpot(ent ,target)
		{
			if (!target)  return 
			if (!blink)  return 
			let targetPos = target.NetworkPosition
			// loop-optimizer: KEEP
			return savespots.find(spot=>checkForTrees(spot, 251)>=2
									&& ent.IsInRange(spot,1125+ent.CastRangeBonus)
									&&targetPos.IsInRange(spot,1125+ent.CastRangeBonus)
								)
		}
		function TinkerFarmAmISave() { 
			if (Heroes.some(enemy=>enemy.IsAlive && enemy != MouseTarget && MyHero.IsInRange(enemy, 200))) return false
			if(savespots.some(e=>MyHero.IsInRange(e,75) || checkForTrees(MyHero.NetworkPosition, 250)>=4)) return true
			return false
		}
		 function TinkerPortGetCreepCount(target, range:number) {
			if (!target) return 0
			return creeps.filter(e=>e.IsAlive&&e.IsEnemy()&&!e.IsWaitingToSpawn&&e.IsInRange(target, range)&&e.HPPercent>35).length
		}
		function TinkerPort()
		{
			let targetCreep:Creep = undefined
			let targetTower:Building = undefined
			// loop-optimizer: KEEP
			let blyat = creeps.filter(
				e=>e.IsAlive
				&&!e.IsEnemy()																//friendly creeps
				&&!e.IsWaitingToSpawn														//that are spawned
				&&!e.IsInRange(MyHero, 3000)												//and not near hero
				&&e.HPPercent>60															//and ok hp
				&&creeps.some(f=>!f.IsEnemy()&&f.IsInRange(e, 600))							//and not alone
				&&creeps.filter(g=>g.IsAlive
								&&g.IsEnemy()
								&&!g.IsWaitingToSpawn
								&&g.IsInRange(e, 1100)
								&&e.HPPercent>55).length>TinkerPushCreeps.value//and have enemy creeps nearby
				&&Heroes.filter(eh=>eh.IsAlive&&eh.IsEnemy()&&eh.IsInRange(e, 1100)).length<=TinkerPushEnemies.value
				&&Heroes.filter(fh=>fh.IsAlive&&!fh.IsEnemy()&&fh.IsInRange(e, 1100)).length<=TinkerPushAllies.value)
			let a = ArrayExtensions.orderBy(blyat, creep=>TinkerPortGetCreepCount(creep,1100))[0]
				if (TinkerPushSave)
						{
							if (blink == undefined)
							{
								targetCreep = a
							}
							else
							{
								if (TinkerFarmGetSaveSpot(a, a) !== undefined)
								{
										targetCreep = a
								}
							}
						}
						else
						{
									targetCreep = a
						}
			if (targetCreep !== undefined )
			{
				return targetCreep.NetworkPosition	
			}
			else
			{
				let blyat = towers.filter(e=>e.IsAlive
										 && e.Team == MyHero.Team
										 &&!e.IsInRange(MyHero, 3000)
										 &&e.HPPercent>7
										 &&creeps.some(f=>!f.IsEnemy()&&f.IsInRange(e, 1100+600))							//and not alone
				&&creeps.filter(g=>g.IsAlive
								&&g.IsEnemy()
								&&!g.IsWaitingToSpawn
								&&g.IsInRange(e, 1100+600)
								&&e.HPPercent>55).length>TinkerPushCreeps.value//and have enemy creeps nearby
				&&Heroes.filter(eh=>eh.IsAlive&&eh.IsEnemy()&&eh.IsInRange(e, 1100+600)).length<=TinkerPushEnemies.value
				&&Heroes.filter(fh=>fh.IsAlive&&!fh.IsEnemy()&&fh.IsInRange(e, 1100+600)).length<=TinkerPushAllies.value)
				let a = ArrayExtensions.orderBy(blyat, e=>TinkerPortGetCreepCount(e,600+1100))[0]
				if (TinkerPushSave)
						{
							if (blink == undefined)
							{
								targetTower = a
							}
							else
							{
								if (TinkerFarmGetSaveSpot(a, a) !== undefined)
								{
									targetTower = a
								}
							}
						}
						else
						{
							targetTower = a
						}
			}
			if (targetTower!==undefined)
			{
				return targetTower.NetworkPosition
			}
			return
		}
		function TinkerPush()
		{
			if (MyHero.IsChanneling||MyHero.HasModifier("modifier_tinker_rearm")||sleeper.Sleeping("blpush")||sleeper.Sleeping("epush")||sleeper.Sleeping("srpush")||r.IsInAbilityPhase||e.IsInAbilityPhase||!e||e.Level<1)
			{
				return 
			}
			if (Game.RawGameTime < lastTick+0.029)//NOT TIME YET
			{
				return 
			}
			else//CANCEL ANY MANUAL MOVES!
			{
				if (MyHero.IsMoving && TinkerJungle == false)
				{
					MyHero.HoldPosition(MyHero.NetworkPosition, false)
				}
			}
			if (TinkerPushDef)//tinkerPushDef - menu autodisabler
			{
				let a = Heroes.filter(hero=>hero.IsAlive&&hero.IsEnemy()&&hero.IsInRange(MyHero,750))
				let target = ArrayExtensions.orderBy(a,ent => ent.Distance(MyHero))[0]
				if (target !== undefined) 
				{
					if (hex && hex.CanBeCasted())
					{
						MyHero.CastTarget(hex, target)
						lastTick = Game.RawGameTime + 0.05 + latency
						return
					}
					if (eblade && eblade.CanBeCasted()&& !target.IsHexed)
					{
						MyHero.CastTarget(eblade, target)
						lastTick = Game.RawGameTime + 0.05 + latency
						return
					}
					if (blood && blood.CanBeCasted()&& !target.IsHexed)
					{
						MyHero.CastTarget(blood, target)
						lastTick = Game.RawGameTime + 0.05 + latency
						return
					}
					if (orchid && orchid.CanBeCasted()&& !target.IsHexed)
					{
						MyHero.CastTarget(orchid, target)
						lastTick = Game.RawGameTime + 0.05 + latency
						return
					}
					if (blink && blink.CanBeCasted()&&!sleeper.Sleeping("blpush"))
					{
						let saveSpot = TinkerFarmGetSaveSpot(MyHero, MyHero)
						if (saveSpot !== undefined && MyHero.Distance2D(saveSpot) > 375)
						{
							if (blink.IsReady) MyHero.CastPosition(blink, saveSpot)
							lastTick = Game.RawGameTime + 0.05 + latency
							//console.log("cast blink, 1314, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
							sleeper.Sleep(119,"blpush")
							return
						}
						else
						{
							if (blink.IsReady) MyHero.CastPosition(blink, (MyHero.NetworkPosition.Add(fountain.Subtract(MyHero.NetworkPosition))).Normalize().ScaleTo(1150))
							lastTick = Game.RawGameTime + 0.05 + latency
							//console.log("cast blink, 1321, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
							sleeper.Sleep(119,"blpush")
							return
						}
					}
				}
			}
			if (MyHero.HasModifier("modifier_fountain_aura_buff") && amionf())// onfountain: regen
			{
				if (smartRegen.value&& MyHero.ManaPercent<80 && !moved)	
				{
					if (MyHero.Inventory.HasFreeSlotsBackpack||MyHero.Inventory.HasFreeSlotsStash)
					{
							for (var _i = 0; _i < 6; _i++) {
								let it = MyHero.Inventory.GetItem(_i)
								if (it!==undefined &&sitems.includes(it.Name) )
								{
									slots[it.Name] = _i
									it.MoveItem(MyHero.Inventory.FreeSlotsBackpack.concat(MyHero.Inventory.FreeSlotsStash)[_i])
									moved = true
								}
							}
						lastTick = Game.RawGameTime + 0.05 + latency
					}
					return
				}
					if (bottle && bottle.CurrentCharges>0&&!MyHero.HasModifier("modifier_bottle_regeneration"))
				{
						MyHero.CastNoTarget(bottle)
						lastTick = Game.RawGameTime + 0.1 + latency
						//console.log("cast bottle, 1330, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
						return	
				}		

				if (!e.IsReady || !TravelBoots.IsReady) //on fountain: rearm
				{
					if (r.CanBeCasted())
						MyHero.CastNoTarget(r)
						lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + r.CastPoint + latency
						//console.log("cast r, 1334, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
						return
				}	
				
				if (MyHero.ManaPercent >80 )//naregenilis
				{
					if (smartRegen.value && moved){
						for (var _i = 6; _i < 15; _i++) {
							let it = MyHero.Inventory.GetItem(_i)
							if (it!==undefined &&sitems.includes(it.Name) )
							{
								it.MoveItem(slots[it.Name])
								lastTick = Game.RawGameTime + 0.05 + latency
								
							}
						}
						moved = false
					return
					}
					
					if (ported)//tp fail
					{
						
						ported = false
						TinkerJungleFarmPos = []
						TinkerJungle = false
						//console.log("return 1372, rawgt: "+Game.RawGameTime)
						return
					}
				}	
			}	
			if  (!ported )//TP TO PUSH WAS NOT CASTED YET
			{
				if (amionf())//FOUNTAIN:+INITIAL TP
				{
					if (MyHero.ManaPercent > 80 )//ENOUGH MANA FOR PUSHING
					{	
						if (smartRegen.value && moved){
						for (var _i = 6; _i < 15; _i++) {
							let it = MyHero.Inventory.GetItem(_i)
							if (it!==undefined &&sitems.includes(it.Name) )
							{
								it.MoveItem(slots[it.Name])
								lastTick = Game.RawGameTime + 0.05 + latency
								
							}
						}
						moved = false
					return
					}
						let a =TinkerPort()//CREEP
						if (a != undefined)
						{
							if (TravelBoots.CanBeCasted()&&TravelBoots.IsReady) 
							{
								MyHero.CastPosition(TravelBoots, a)
								lastTick = Game.RawGameTime + 3.05 + latency
								//console.log("cast boot, 1365, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
								ported = true
								marched = 0
								return
							}
						}	
						else
						{
							if (TinkerPushJungle.value)
							{
								TinkerGetJunglePos()//JUNGLE
								if (TinkerJungleFarmPos!=undefined && TinkerJungleFarmPos[0]!=undefined && TinkerJungleFarmPos[1]!=undefined)
								{
									if (TravelBoots.CanBeCasted()&&TravelBoots.IsReady) 
									{
										MyHero.CastPosition(TravelBoots, TinkerJungleFarmPos[0])
										lastTick = Game.RawGameTime + 3.05 + latency
										//console.log("cast boot to jngle, 1382, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
										ported = true
										TinkerJungle = true
										marched = 0
										return
									}
								}
							}
						}
					}
					else
					if (smartRegen.value&& MyHero.Mana/MyHero.MaxMana<0.8)	//SMART REGEN BACK
					{
						if (MyHero.Inventory.HasFreeSlotsBackpack||MyHero.Inventory.HasFreeSlotsStash)
						{
								for (var _i = 0; _i < 6; _i++) {
									let it = MyHero.Inventory.GetItem(_i)
									if (it!==undefined &&sitems.includes(it.Name) )
									{
										//console.log(it.Name+" "+_i)
										slots[it.Name] = _i
										it.MoveItem(MyHero.Inventory.FreeSlotsBackpack.concat(MyHero.Inventory.FreeSlotsStash)[_i])
										//console.log("move "+ it.Name+" slot:"+slots[it.Name])
										lastTick = Game.RawGameTime + 0.05 + latency
										moved = true
										
									}
								}
							
						}
						return
					}	
				}	
				else
				{
					if (MyHero.ManaPercent >51)//ENOUGH MANA FOR PUSHING
					{
						let a = TinkerPort()
						if (a !== undefined) 
						{
							if (TravelBoots.CanBeCasted()&&TravelBoots.IsReady)
							{
								if (blink.IsReady||blink == undefined)
								{
								MyHero.CastPosition(TravelBoots, a)
								lastTick = Game.RawGameTime + 3.05 + latency
								//console.log("cast boot, 1402, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
								ported = true
								marched = 0
								return
								}
								else
								{
									if (r.CanBeCasted()) 
									{
										MyHero.CastNoTarget(r)
										lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + r.CastPoint + latency
										//console.log("FUCKITcast r, 1410, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
										return
									}	
								}
							}
								
						}	
						else
						{
							if (TinkerPushJungle.value)
							{
								TinkerGetJunglePos()
								if (TinkerJungleFarmPos != undefined  && TinkerJungleFarmPos[0]!=undefined && TinkerJungleFarmPos[1]!=undefined)
								{
									if (TravelBoots.CanBeCasted()&&TravelBoots.IsReady) 
									{
										MyHero.CastPosition(TravelBoots, TinkerJungleFarmPos[0])
										lastTick = Game.RawGameTime + 3.05 + latency
										//console.log("cast boot to jngle, 1418, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
										ported = true
										TinkerJungle = true
										marched = 0
										return
									}
								}
							}
						}				
					}	
					else//GO REGEN
					{
						if (TravelBoots.CanBeCasted()&&TravelBoots.IsReady)
						{
							MyHero.CastPosition(TravelBoots, fountain)
							lastTick = Game.RawGameTime + 3.05 + latency
							//console.log("cast boot, 1433, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
							ported = false
							marched = 0
							TinkerJungle = false
							return
						}
						else
						{
							if (r.CanBeCasted()) 
							{
								MyHero.CastNoTarget(r)
								lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + r.CastPoint + latency
								//console.log("cast r, 1437, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
								return
							}
						}
					}	
				}	
			}
			if (soulring&& soulring.CanBeCasted()&&!sleeper.Sleeping("srpush")) //SOULRING USAGE
			{
					if (!amionf())
					{
						if(soulring.IsReady) MyHero.CastNoTarget(soulring)
						lastTick = Game.RawGameTime + latency
						//console.log("cast sr, 1440, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
						return
					}
					else
					{
						if (MyHero.ManaPercent > 65 )
						{
							MyHero.CastNoTarget(soulring,true)
							lastTick = Game.RawGameTime + latency
							//console.log("cast sr, 1450, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
							return
						}
					}
			}
			if (bottle && bottle.CurrentCharges>0&&!MyHero.HasModifier("modifier_bottle_regeneration"))//BOTTLE USAGE
			{
				if (MyHero.HPPercent < 85 || MyHero.ManaPercent < 80 )
				{
					MyHero.CastNoTarget(bottle)
					lastTick = Game.RawGameTime + latency
					//console.log("cast bottle, 1475, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
					return
				}
			}
			let targetCreep:Creep = undefined
			let ecre = creeps.filter(Creep => Creep.IsLaneCreep&&Creep.IsEnemy()&&Creep.IsInRange(MyHero, 1550+MyHero.CastRangeBonus))
			for (let unit of ecre)
			{
				if (unit.IsVisible && TinkerPortGetCreepCount(unit, 700) >= 2 && unit.IsInRange(MyHero, 1550+MyHero.CastRangeBonus))
				{
						targetCreep = unit
						break
				}
			}
			if (TinkerJungle)//JUNGLE CALL IF WE TP'D TO JUNGLE ALREADY
			{
				TinkerJungleFarm()
			}
			else
			{
				if (targetCreep !== undefined)  // WE HAVE A TARGET FOR MARSH OF THE MAChINES
				{
					if (blink && blink.CanBeCasted() && (!TinkerFarmAmISave()||MyHero.IsVisibleForEnemies)	&& !sleeper.Sleeping("blpush"))	{
							let saveSpot = TinkerFarmGetSaveSpot(MyHero, targetCreep)//targetCreep)
							if (saveSpot !== undefined && !MyHero.IsInRange(saveSpot, 199,true)) 
							{
								if (blink.IsReady) MyHero.CastPosition(blink, saveSpot, true)
								lastTick = Game.RawGameTime + 0.02 + latency
								//console.log("cast blink, 1514, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
								sleeper.Sleep(119,"blpush")
								return false
								
							}
					}	
					if (marched <= autoMarsh.value) //WE DIDNT MARSH ENOUGH YET
					{
						if (e.CanBeCasted()&&!sleeper.Sleeping("epush"))
						{ 
							MyHero.CastPosition(e, MyHero.NetworkPosition.Add((targetCreep.NetworkPosition.Subtract(MyHero.NetworkPosition)).Normalize().ScaleTo(e.CastRange - 10)))
							lastTick = Game.RawGameTime + 0.75 + latency
							marched = marched + 1
							//console.log("cast e, 1525, gametime: "+Game.RawGameTime+" lastTick: "+lastTick +" marched " + marched)
							sleeper.Sleep(770+latency,"epush")
							return
						}
						else
						{
							if (r.CanBeCasted()) 
							{
								MyHero.CastNoTarget(r)
								lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + r.CastPoint + latency
								//console.log("cast r, 1535, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
								return
							}
							else
							{
								if (TravelBoots.CanBeCasted()) //NO MANA GO HOME
								{
									MyHero.CastPosition(TravelBoots, fountain)
									lastTick = Game.RawGameTime + 3.05 + latency
									//console.log("cast e, 1544, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
									marched = 0
									return
								}
							}	
						}	
					}	
					else//WE MARSHED FOR 9 TIMES
					{
						if (MyHero.ManaPercent < 40) //NO MANA LEFT > GO HOMe
						{
							if (TravelBoots.CanBeCasted()&&TravelBoots.IsReady) 
							{
								if (blink && blink.IsReady && !TinkerFarmAmISave() && !sleeper.Sleeping("blpush"))
								{
									let saveSpot = TinkerFarmGetSaveSpot(MyHero, MyHero)
									if (saveSpot !== undefined && !MyHero.IsInRange(saveSpot, 199,true)) 
									{
										if (blink.IsReady) MyHero.CastPosition(blink, saveSpot)
										lastTick = Game.RawGameTime + 0.02 + latency
										//console.log("cast blink, 1607, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
										sleeper.Sleep(119,"blpush")
										return
									}
									else
									{
										if (blink.IsReady) MyHero.CastPosition(blink, MyHero.NetworkPosition.Add((fountain.Subtract(MyHero.NetworkPosition)).Normalize().ScaleTo(1150)))
										lastTick = Game.RawGameTime + 0.02 + latency
										//console.log("cast blink, 1614, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
										sleeper.Sleep(119,"blpush")
										return
									}
								}	
								
								MyHero.CastPosition(TravelBoots, fountain)
								lastTick = Game.RawGameTime + 3.05 + latency
								//console.log("cast boot, 1621, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
								marched = 0
								return
							}
							else
							{
								if (r.CanBeCasted()) 
								{
									MyHero.CastNoTarget(r)
									lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + r.CastPoint + latency
									//console.log("cast r, 1631, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
									return
								}
							}
								
						}	
						else//WE HAVE SOME MORE MANA, WHAT DO WE DO?
						{
							if (TinkerPort() !== undefined) //ESLI EST KRIP4IK (ZALUPA)
							{
								if (TravelBoots.CanBeCasted()&&TravelBoots.IsReady) 
								{
									if (blink && blink.CanBeCasted() && !TinkerFarmAmISave() &&!sleeper.Sleeping("blpush")) 
									{
										let saveSpot = TinkerFarmGetSaveSpot(MyHero, MyHero)
										if (saveSpot !== undefined && !MyHero.IsInRange(saveSpot, 199,true)) 
										{
											if (blink.IsReady) MyHero.CastPosition(blink, saveSpot)
											lastTick = Game.RawGameTime + 0.02 + latency
											//console.log("USELESS??cast blink, 1650, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
											sleeper.Sleep(119,"blpush")
											return
										}
										else
										{
											if (blink.IsReady) MyHero.CastPosition(blink, MyHero.NetworkPosition.Add((fountain.Subtract(MyHero.NetworkPosition)).Normalize().ScaleTo(1150)))
											lastTick = Game.RawGameTime + 0.02 + latency
											//console.log("USELESS??cast blink, 1657, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
											sleeper.Sleep(119,"blpush")
											return
										}
									}
									if (blink && blink.IsReady)//TIPA BLINK REDI ZNA$IT SOSY XYU?????
									{
										ported = false
										marched = 0
										return
									}
									else
									{
										MyHero.CastPosition(TravelBoots, fountain)
										lastTick = Game.RawGameTime + 3.05 + latency
										//console.log("USELESS??cast boot, 1671, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
										marched = 0
										return
									}
								}		
								else
								{
									if (r.CanBeCasted()) 
									{
										MyHero.CastNoTarget(r)
										lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + r.CastPoint + latency
										//console.log("USELESS??cast r, 1682, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
										return
									}
								}	
							}
							else//GO HOME
							{
								if (TravelBoots.CanBeCasted()&&TravelBoots.IsReady) 
								{
									if (blink && blink.CanBeCasted() && !TinkerFarmAmISave() &&!sleeper.Sleeping("blpush")) 
									{
										let saveSpot = TinkerFarmGetSaveSpot(MyHero, MyHero)
										if (saveSpot !== undefined && !MyHero.IsInRange(saveSpot, 199,true)) 
										{
											if (blink.IsReady) MyHero.CastPosition(blink, saveSpot)
											//MyHero.HoldPosition(MyHero.NetworkPosition, true)
											lastTick = Game.RawGameTime + 0.02 + latency
											//console.log("cast blink, 1698, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
											sleeper.Sleep(119,"blpush")
											return
										}
										else
										{
											if (blink.IsReady) MyHero.CastPosition(blink, MyHero.NetworkPosition.Add((fountain.Subtract(MyHero.NetworkPosition)).Normalize().ScaleTo(1150)))
											//MyHero.HoldPosition(MyHero.NetworkPosition, true)
											lastTick = Game.RawGameTime + 0.02 + latency
											//console.log("cast blink, 1707, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
											sleeper.Sleep(119,"blpush")
											return
										}
									}
									MyHero.CastPosition(TravelBoots, fountain)
									lastTick = Game.RawGameTime + 3.05 + latency
									//console.log("cast boot, 1711, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
									marched = 0
									return
								}
								else
								{
									if (r.CanBeCasted())
									{ 
										MyHero.CastNoTarget(r)
										lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + r.CastPoint + latency
										//console.log("cast r, 1721, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
										return
									}
								}
							}			
						}
					}						
				}	
				else//NET TARGETOV FOR MARSH
				{
					if (!amionf())//CHEKAT TOLKO KOGDA ULeTELI 
					{
						if (MyHero.ManaPercent<45) //KON4iLAS MP
						{
							if (ported)//ESLi NAJUMALI TP, MARSHILI I NET TARGETA DLYA MARSHEY + MP ==>GO HOME
								{
									if (TravelBoots.CanBeCasted()&&TravelBoots.IsReady) 
									{
										if (blink && blink.CanBeCasted() && !TinkerFarmAmISave() &&!sleeper.Sleeping("blpush")) 
										{
											let saveSpot = TinkerFarmGetSaveSpot(MyHero, MyHero)
											if (saveSpot !== undefined && !MyHero.IsInRange(saveSpot, 199,true)) 
											{
												if (blink.IsReady) MyHero.CastPosition(blink, saveSpot)
												//MyHero.HoldPosition(MyHero.NetworkPosition, true)
												lastTick = Game.RawGameTime + 0.02 + latency
												//console.log("cast blink, 1790, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
												sleeper.Sleep(119,"blpush")
												return
											}
											// else
											// {
											// 	if (blink.IsReady) MyHero.CastPosition(blink, MyHero.NetworkPosition.Add((fountain.Subtract(MyHero.NetworkPosition)).Normalize().ScaleTo(1150)))
											// 	//MyHero.HoldPosition(MyHero.NetworkPosition, true)
											// 	lastTick = Game.RawGameTime + 0.02 + latency
											// 	//console.log("cast blink, 1797, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
											// 	sleeper.Sleep(119,"blpush")
											// 	return
											// }
										}
										MyHero.CastPosition(TravelBoots, fountain)
										lastTick = Game.RawGameTime + 3.05 + latency
										//console.log("cast boot, 1805, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
										marched = 0
										return
									}
									else
									{
										if (r.CanBeCasted()) 
										{
											MyHero.CastNoTarget(r)
											lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + r.CastPoint + latency
											//console.log("cast r, 1811, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
											return
										}
									}
										
							}	
						}	
						else//ESHE EST MP
						{
							if (TinkerPort() !== undefined) //EST ESHE KRIp4IK
								{
									if (TravelBoots.IsReady&& TravelBoots.CanBeCasted()) 
									{
										if (blink && blink.CanBeCasted() && !TinkerFarmAmISave() &&!sleeper.Sleeping("blpush")) 	{
											let saveSpot = TinkerFarmGetSaveSpot(MyHero, MyHero)
											if (saveSpot !== undefined && !MyHero.IsInRange(saveSpot, 199,true)) 
											{
												lastTick = Game.RawGameTime + 0.02 + latency
												if (blink.IsReady) MyHero.CastPosition(blink, saveSpot)
												//console.log("cast blink, 1833, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
												sleeper.Sleep(119,"blpush")
												return
											}
											// else
											// {
											// 	if (blink.IsReady) MyHero.CastPosition(blink, MyHero.NetworkPosition.Add((fountain.Subtract(MyHero.NetworkPosition)).Normalize().ScaleTo(1150)))
											// 	lastTick = Game.RawGameTime + 0.02 + latency
											// 	//console.log("cast blink, 1840, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
											// 	sleeper.Sleep(119,"blpush")
											// 	return
											// }
										}
										if (blink)// && blink.IsReady)
										{ 
											ported = false
											marched = 0
											//console.log("return 1875, rawgt: "+Game.RawGameTime)
											return
										}
										else
										{
											MyHero.CastPosition(TravelBoots, fountain)
											lastTick = Game.RawGameTime + 3.05 + latency
											//console.log("cast boot, 1854, gametime: "+Game.RawGameTime+" lastTick: "+lastTick+" marched: "+ marched)
											marched = 0
											return
										}
								}		
								else
								{
									if (blink && blink.CanBeCasted() && (!TinkerFarmAmISave()||MyHero.IsVisibleForEnemies) &&!sleeper.Sleeping("blpush")) 	{
										let saveSpot = TinkerFarmGetSaveSpot(MyHero, MyHero)
										if (saveSpot !== undefined && !MyHero.IsInRange(saveSpot, 199,true)) 
										{
											lastTick = Game.RawGameTime + 0.02 + latency
											if (blink.IsReady) MyHero.CastPosition(blink, saveSpot)
											//console.log("cast blink, 1833, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
											sleeper.Sleep(119,"blpush")
											return
										}
										// else
										// {
										// 	if (blink.IsReady) MyHero.CastPosition(blink, MyHero.NetworkPosition.Add((fountain.Subtract(MyHero.NetworkPosition)).Normalize().ScaleTo(1150)))
										// 	lastTick = Game.RawGameTime + 0.02 + latency
										// 	//console.log("cast blink, 1840, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
										// 	sleeper.Sleep(119,"blpush")
										// 	return
										// }
									}
									if (r.CanBeCasted()) 
									{
										MyHero.CastNoTarget(r)
										lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + r.CastPoint + latency
										//console.log("cast r, 1865, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
										return
									}
								}	
							}	
							else//NET - GO NOME
							{
								if (ported)//NET - SAVE TP HOME
								{
									if (TravelBoots.CanBeCasted()&&TravelBoots.IsReady) 
										{
											if (blink && blink.CanBeCasted() && !TinkerFarmAmISave() &&!sleeper.Sleeping("blpush")) 
											{
												let saveSpot = TinkerFarmGetSaveSpot(MyHero, MyHero)
												if (saveSpot !== undefined && !MyHero.IsInRange(saveSpot, 199,true)) 
												{
													if (blink.IsReady) MyHero.CastPosition(blink, saveSpot)
													lastTick = Game.RawGameTime + 0.02 + latency
													//console.log("cast blink, 1883, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
													sleeper.Sleep(119,"blpush")
													return
												}
												// else
												// {
												// 	if (blink.IsReady) MyHero.CastPosition(blink, MyHero.NetworkPosition.Add((fountain.Subtract(MyHero.NetworkPosition)).Normalize().ScaleTo(1150)))
												// 	lastTick = Game.RawGameTime + 0.02 + latency
												// 	//console.log("cast blink, 1890, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
												// 	sleeper.Sleep(119,"blpush")
												// 	return
												// }
												
											}
											MyHero.CastPosition(TravelBoots, fountain)
											lastTick = Game.RawGameTime + 3.05 + latency
											//console.log("cast boot, 1897, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
											marched = 0
											return
									}
									else
									{
										if (blink && blink.CanBeCasted() && !TinkerFarmAmISave() &&!sleeper.Sleeping("blpush")) 
											{
												let saveSpot = TinkerFarmGetSaveSpot(MyHero, MyHero)
												if (saveSpot !== undefined && MyHero.Distance2D(saveSpot)>175) 
												{
													if (blink.IsReady) MyHero.CastPosition(blink, saveSpot)
													lastTick = Game.RawGameTime + 0.02 + latency
													//console.log("cast blink, 1904, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
													sleeper.Sleep(119,"blpush")
													return
												}
												else
												{
													if (blink.IsReady) MyHero.CastPosition(blink, MyHero.NetworkPosition.Add((fountain.Subtract(MyHero.NetworkPosition)).Normalize().ScaleTo(1150)))
													lastTick = Game.RawGameTime + 0.02 + latency
													//console.log("cast blink, 1905, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
													sleeper.Sleep(119,"blpush")
													return
												}
												
										}
										if (r.CanBeCasted()) 
											{
												MyHero.CastNoTarget(r)
												lastTick = Game.RawGameTime + r.GetSpecialValue("channel_tooltip") + r.CastPoint + latency
												//console.log("cast r, 1907, gametime: "+Game.RawGameTime+" lastTick: "+lastTick)
												return
										}
									}
								}
							}
						}
					}									
				}	
			return
			}
		}
		TinkerPush()
	}
	else if (TinkerStatus() == 2)
	{
		TinkerStatus(0)
		return false
	}
}