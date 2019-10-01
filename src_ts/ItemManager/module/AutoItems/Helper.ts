import InitItems from "../../abstract/Items"
import { ArrayExtensions, Creep, Entity, GameSleeper, Item, LocalPlayer, TreeTemp, Unit, Game, Ability, Vector3, Hero } from "wrapper/Imports"

import {
	AutoUseItemsArcane_val, AutoUseItemsBloodHP_val,
	AutoUseItemsBloodMP_val,
	AutoUseItemsCheese_val,
	AutoUseItemsFaerieFire_val,
	AutoUseItemsMG_val,
	AutoUseItemsMidas_CheckBIG,
	AutoUseItemsMidas_range,
	AutoUseItemsMjollnir_val,
	AutoUseItemsPhase_val,
	AutoUseItemsPhaseBootsState,
	AutoUseItemsSticks_val,
	AutoUseItemsUrnAlies,
	AutoUseItemsBluker_val,
	AutoUseItemsUrnAliesAlliesHP, AutoUseItemsUrnAliesEnemyHP,
	AutoUseItemsUrnEnemy, Items,
	ItemsForUse,
	State,
} from "./Menu"

import ItemManagerBase from "../../abstract/Base"
import { StateBase } from "../../abstract/MenuBase"

let Units: Unit[] = [],
	AllUnits: Unit[] = [],
	AllCreeps: Creep[] = [],
	Trees: TreeTemp[] = [],
	Particle: Array<[number, Vector3?]> = [] // TODO Radius for ability

let Buffs = {
	NotHeal: [
		"modifier_fountain_aura_buff",
		"modifier_item_armlet_unholy_strength",
	],
	InvisDebuff: [
		"modifier_bounty_hunter_track",
		"modifier_bloodseeker_thirst_vision",
		"modifier_slardar_amplify_damage",
		"modifier_item_dustofappearance",
		"modifier_truesight",
	],
}

let Base = new ItemManagerBase,
	Sleep = new GameSleeper

function GetDelayCast() {
	return (((Game.Ping / 2) + 30) + 380)
}
export function ParticleCreate(id: number, handle: bigint, entity: Entity) {
	if (handle === 1954660700683781942n) {
		Particle.push([id])
	}
}

export function ParticleCreateUpdate(id: number, controlPoint: number, position: Vector3) {
	let part = Particle.find(x => x[0] === id)
	if (part !== undefined)
		Particle.push([id, position])
}

function SleepCHeck() {
	return Sleep.Sleeping("item_abyssal_blade") || 
	Sleep.Sleeping("item_phase_boots") 			|| 
	Sleep.Sleeping("item_faerie_fire") 			|| 
	Sleep.Sleeping("item_magic_stick") 			|| 
	Sleep.Sleeping("item_magic_wand") 			|| 
	Sleep.Sleeping("item_hand_of_midas") 		|| 
	Sleep.Sleeping("item_arcane_boots") 		|| 
	Sleep.Sleeping("item_mekansm") 				|| 
	Sleep.Sleeping("item_guardian_greaves") 	|| 
	Sleep.Sleeping("item_bottle") 				|| 
	Sleep.Sleeping("item_urn_of_shadows") 		|| 
	Sleep.Sleeping("item_spirit_vessel") 		|| 
	Sleep.Sleeping("item_bloodstone") 			|| 
	Sleep.Sleeping("item_tango") 				|| 
	Sleep.Sleeping("item_tango_single") 		|| 
	Sleep.Sleeping("item_faerie_fire") 			|| 
	Sleep.Sleeping("item_dust") 				|| 
	Sleep.Sleeping("item_buckler") 				|| 
	Sleep.Sleeping("item_cheese") 				|| 
	Sleep.Sleeping("item_mjollnir");
}

function IsValidUnit(unit: Unit) {
	let IgnoreBuffs = unit.Buffs.some(buff => buff.Name === "modifier_smoke_of_deceit")
	return unit !== undefined && unit.IsEnemy && unit.IsAlive && !unit.IsStunned && !unit.IsChanneling
		&& (unit.Name === "npc_dota_hero_riki" || unit.InvisibleLevel <= 0 || IgnoreBuffs)
}

function IsValidItem(Items: Item) {
	return Items !== undefined 
		&& Items.IsReady
		&& ItemsForUse.IsEnabled(Items.Name)
		&& Items.CanBeCasted()
}

function AutoUseItems(unit: Unit) {
	if (!IsValidUnit(unit)) {
		return false
	}
	let Items = new InitItems(unit),
		DelayCast = GetDelayCast()
	
	if (IsValidItem(Items.PhaseBoots)) {
		if (unit.IsMoving || unit.IdealSpeed >= Base.MaxMoveSpeed) {
			let enemy_phase_in_position = AutoUseItemsPhaseBootsState.value
				? AllUnits.some(enemy => enemy.IsVisible && enemy.IsAlive
					&& enemy.IsEnemy(unit)
					&& unit.Distance2D(enemy.NetworkPosition) <= AutoUseItemsPhase_val.value)
				: AutoUseItemsPhaseBootsState.value

			if (!AutoUseItemsPhaseBootsState.value || enemy_phase_in_position) {
				Items.PhaseBoots.UseAbility(unit)
				Sleep.Sleep(DelayCast, Items.PhaseBoots.Name)
				return true
			}
		}
	}

	if (IsValidItem(Items.Mjollnir)) {
		let enemy_mjolnir = AllUnits.some(enemy => enemy.IsVisible && enemy.IsEnemy(unit)
			&& unit.Distance2D(enemy.NetworkPosition) <= AutoUseItemsMjollnir_val.value)

		if (enemy_mjolnir) {
			Items.Mjollnir.UseAbility(unit)
			Sleep.Sleep(DelayCast, Items.Mjollnir.Name)
			return true
		}
	}

	if ((IsValidItem(Items.MagicWand) || IsValidItem(Items.MagicStick))) {
		if (!unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal))) {
			if (unit.HPPercent < AutoUseItemsSticks_val.value) {
				Items.MagicStick.UseAbility(unit)
				Sleep.Sleep(DelayCast, Items.MagicStick.Name)
				return true
			}
			if (unit.HPPercent < AutoUseItemsSticks_val.value) {
				Items.MagicWand.UseAbility(unit)
				Sleep.Sleep(DelayCast, Items.MagicWand.Name)
				return true
			}
		}
	}

	if (IsValidItem(Items.FaerieFire)) {
		if (!unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal))) {
			if (unit.HP < AutoUseItemsFaerieFire_val.value) {
				Items.FaerieFire.UseAbility(unit)
				Sleep.Sleep(DelayCast, Items.FaerieFire.Name)
				return true
			}
		}
	}

	if (IsValidItem(Items.Cheese)) {
		if (unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal))) {
			if (unit.HPPercent < AutoUseItemsCheese_val.value) {
				Items.Cheese.UseAbility(unit)
				Sleep.Sleep(DelayCast, Items.Cheese.Name)
				return true
			}
		}
	}

	if (IsValidItem(Items.ArcaneBoots)) {
		if (!Sleep.Sleeping(Items.ArcaneBoots.Index)
			&& !unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal))) {
			if (unit.HPPercent < AutoUseItemsArcane_val.value) {
				Items.ArcaneBoots.UseAbility(unit)
				Sleep.Sleep(DelayCast, Items.ArcaneBoots.Name)
				return true
			}
		}
	}

	if (IsValidItem(Items.Mekansm) || IsValidItem(Items.GuardianGreaves)) {
		let Item = !Items.Mekansm ? Items.GuardianGreaves : Items.Mekansm
		AllUnits.some(allies => {
			if (!allies.IsEnemy(unit) && unit.IsInRange(allies.NetworkPosition, Item.AOERadius)) {
				if (!unit.Buffs.some(buff => buff.Name === "modifier_item_mekansm_noheal")
					&& (allies.HPPercent <= AutoUseItemsMG_val.value
						&& allies.IsAlive || unit.HPPercent <= AutoUseItemsMG_val.value
						&& unit.IsAlive)
				) {
					Item.UseAbility(unit)
					Sleep.Sleep(DelayCast, Item.Name)
					return true
				}
			}
		})
	}

	if (IsValidItem(Items.Bottle)) {
		if (Items.Bottle.CurrentCharges === 3) {
			if (unit.Buffs.some(buff => buff.Name === "modifier_fountain_aura_buff")) {
				AllUnits.some(allies => {
					if (!allies.IsEnemy(unit) && unit.IsInRange(allies.NetworkPosition, Items.Bottle.CastRange)) {
						if (!allies.IsInvulnerable && !unit.Buffs.some(buff => buff.Name === "modifier_bottle_regeneration")
							&& (allies.Mana !== allies.MaxMana || allies.HP !== allies.MaxHP)) {
							unit.CastTarget(Items.Bottle, allies)
							Sleep.Sleep(DelayCast, Items.Bottle.Name)
							return true
						}
					}
				})
			}
		}
	}

	if (IsValidItem(Items.Bloodstone)) {
		if (unit.HPPercent < AutoUseItemsBloodHP_val.value
			&& unit.ManaPercent > AutoUseItemsBloodMP_val.value) {
			Items.Bloodstone.UseAbility(unit)
			Sleep.Sleep(DelayCast, Items.Bloodstone.Name)
			return true
		}
	}

	if (IsValidItem(Items.Buckler)) {
		let enemy_bluker = AllUnits.some(enemy => enemy.IsEnemy(unit) && enemy.IsAlive && enemy.IsVisible
			&& unit.Distance2D(enemy.NetworkPosition) <= AutoUseItemsBluker_val.value)
		if (enemy_bluker) {
			Items.Buckler.UseAbility(unit)
			Sleep.Sleep(DelayCast, Items.Buckler.Name)
			return true
		}
	}

	if (IsValidItem(Items.Midas)) {
		if (AutoUseItemsMidas_CheckBIG.value) {
			let Creep = GetAllCreepsForMidas(unit, Items.Midas)
			if (Creep.length > 0) {
				Creep = ArrayExtensions.Sorter(Creep, "MaxHP", true)
				if (unit.Distance2D(Creep[0].Position) <= ((Items.Midas.CastRange + unit.CastRangeBonus) + 100) && unit.CanAttack(Creep[0])) {
					Items.Midas.UseAbility(Creep[0])
					Sleep.Sleep(DelayCast, Items.Midas.Name)
					return true
				}
			}
		} else {
			GetAllCreepsForMidas(unit, Items.Midas)
		}
	}

	if (IsValidItem(Items.UrnOfShadows) || IsValidItem(Items.SpiritVesel)) {
		let Item = Items.UrnOfShadows !== undefined
			? Items.UrnOfShadows
			: Items.SpiritVesel

		if (CheckUnitForUrn(LocalPlayer.Hero, AutoUseItemsUrnAliesAlliesHP.value)
			&& unit.Index === LocalPlayer.Hero.Index
			&& !unit.IsIllusion
			&& LocalPlayer.Hero !== unit
			&& !LocalPlayer.Hero.Buffs.some(x =>
				x.Name === "modifier_item_urn_heal"
				|| x.Name === "modifier_item_spirit_vessel_heal")
		) {
			Item.UseAbility(LocalPlayer.Hero)
			return true
		}
		if (AutoUseItemsUrnAlies.value) {
			UnitCheckForAlliesEnemy(unit, Item, false)
			return true
		}
		if (AutoUseItemsUrnEnemy.value) {
			UnitCheckForAlliesEnemy(unit, Item)
			return true
		}
	}

	if (IsValidItem(Items.Dust)) {
		if (!Items.Gem) {		
			let glimer_cape = Particle.find(e => {
				if(e[0] && e[1] !== undefined && unit.Distance2D(e[1]) <= Items.Dust.CastRange)
					return e[0]
				return setTimeout(() => Particle = [], 3000)
			})
			let IsVisible = AllUnits.some(enemy => unit.IsEnemy(enemy)
					&& enemy.IsAlive
					&& unit.IsInRange(enemy.NetworkPosition, Items.Dust.CastRange)
					&& !enemy.ModifiersBook.HasAnyBuffByNames(Buffs.InvisDebuff)
					&& 
					(
						enemy.IsInvisible 
						|| enemy.InvisibleLevel > 0 
						|| glimer_cape !== undefined
						|| unit.ModifiersBook.HasBuffByName("modifier_invoker_ghost_walk_enemy")
					)
					&& !AllUnits.some(allies => !unit.IsEnemy(enemy) && allies.GetItemByName("item_gem")
					&& allies.Distance2D(enemy.Position) < 800))
		
			if (IsVisible) {
				unit.CastNoTarget(Items.Dust)
				Sleep.Sleep(DelayCast, Items.Dust.Name)
				return true
			}
		}
	}

	if (IsValidItem(Items.Tango)) {
		let tr = Trees.find(x => x.IsInRange(unit, Items.Tango.CastRange))
		if (tr !== undefined) {
			unit.CastTargetTree(Items.Tango, tr, false, true)
			Sleep.Sleep(DelayCast, Items.Tango.Name)
			return true
		}
	}

	if (IsValidItem(Items.Abyssal)) {
		AllUnits.filter(enemy => enemy.IsEnemy(unit) && enemy.IsValid && enemy.IsAlive).some(x => {
			if (!x.IsInRange(unit, Items.Abyssal.CastRange))
				return false
			Items.Abyssal.UseAbility(x)
			Sleep.Sleep(DelayCast, Items.Abyssal.Name)
			return true
		})
	}

	return false
}

function CheckUnitForUrn(Unit: Unit, MaxHP: number) {
	return Unit.IsAlive && Unit.HP <= MaxHP && !Unit.IsInvulnerable
		&& !Unit.ModifiersBook.GetAnyBuffByNames(Buffs.NotHeal)
}

function GetAllCreepsForMidas(Unit: Unit, Item: Item): Creep[] {
	return AllCreeps.filter(Creep => {
		if (Creep !== undefined
			&& Unit.CanAttack(Creep)
			&& !Creep.IsMagicImmune
			&& Creep.IsEnemy
			&& !Creep.IsAncient
			&& Creep.IsValid
			&& Creep.IsAlive
			&& !Creep.IsControllable
			&& Creep.IsVisible
			&& Creep.Team !== Unit.Team
			&& Unit.Distance2D(Creep.Position) <= (Item.CastRange + Unit.CastRangeBonus) + 100) {
			if (!AutoUseItemsMidas_CheckBIG.value) {
				if (AutoUseItemsMidas_range.value) {
					if (!Creep.IsMelee) {
						Item.UseAbility(Creep)
						Sleep.Sleep(GetDelayCast(), Item.Name)
						return true
					}
				} else {
					Item.UseAbility(Creep)
					Sleep.Sleep(GetDelayCast(), Item.Name)
					return true
				}
				return false
			}
			return AutoUseItemsMidas_range.value ? !Creep.IsMelee : true
		}
		return false
	})
}

function UnitCheckForAlliesEnemy(unit: Unit, Item: Item, IsEnemy: boolean = true) {
	AllUnits.map(enemy => {
		let target = IsEnemy ? enemy : unit
		if (unit.IsInRange(target.NetworkPosition, Item.CastRange)) {
			if (CheckUnitForUrn(target, IsEnemy ? AutoUseItemsUrnAliesEnemyHP.value : AutoUseItemsUrnAliesAlliesHP.value) && !enemy.IsIllusion
				&& !target.ModifiersBook.GetAnyBuffByNames(["modifier_item_urn_heal", "modifier_item_spirit_vessel_heal"])
			) {
				unit.CastTarget(Item, target)
				Sleep.Sleep(GetDelayCast(), "Delay")
				return true
			}
		}
	})
}

export function Tick() {
	if (!StateBase.value || !State.value || SleepCHeck() || !Game.IsInGame || Game.IsPaused) {
		return false
	}
	if(!Units.some(x => x !== undefined 
		&& x.IsControllable && !x.IsEnemy()
		&& !x.IsIllusion && x.IsAlive && AutoUseItems(x)))
		return false
}

export function GameEnded() {
	Units = []
	Trees = []
	AllUnits = []
	Sleep.FullReset()
}

export function EntityCreate(Entity: Entity) {
	if (Entity instanceof Creep && Entity.IsCreep && !Entity.IsAncient) {
		AllCreeps.push(Entity)
	}
	if (Entity instanceof Unit && (Entity.IsControllable || Entity.IsHero)) {
		Units.push(Entity)
	}
	if (Entity instanceof Unit && Entity.IsHero) {
		AllUnits.push(Entity)
	}
	if (Entity instanceof TreeTemp) {
		Trees.push(Entity)
	}
}

export function EntityDestroy(Entity: Entity) {
	if (Entity instanceof TreeTemp) {
		if (Trees !== undefined && Trees.length > 0) {
			ArrayExtensions.arrayRemove(Trees, Entity)
		}
	}
	if (Entity instanceof Creep) {
		if (AllCreeps !== undefined && AllCreeps.length > 0) {
			ArrayExtensions.arrayRemove(AllCreeps, Entity)
		}
	}
	if (Entity instanceof Unit) {
		if (Units !== undefined && Units.length > 0) {
			ArrayExtensions.arrayRemove(Units, Entity)
		}
		if (AllUnits !== undefined && AllUnits.length > 0) {
			ArrayExtensions.arrayRemove(AllUnits, Entity)
		}
	}
}
