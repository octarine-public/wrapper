import {
	Ability, ArrayExtensions,
	Creep, Entity, ExecuteOrder, Game,
	Item, LocalPlayer, TickSleeper, TreeTemp, Unit, Vector3,
} from "wrapper/Imports"

import {
	AutoUseItemsArcane_val,
	AutoUseItemsBloodHP_val,
	AutoUseItemsBloodMP_val,
	AutoUseItemsBluker_val,
	AutoUseItemsCheese_val,
	AutoUseItemsFaerieFire_val,
	AutoUseItemsMG_val,
	AutoUseItemsMidas_CheckBIG,
	AutoUseItemsMidas_range,
	AutoUseItemsMjollnir_val,
	AutoUseItemsPhase_val,
	AutoUseItemsPhaseBootsState,
	AutoUseItemsSouringHP_val,
	AutoUseItemsSouringInvis,
	AutoUseItemsSouringMP_val,
	AutoUseItemsSouringMPUse_val,
	AutoUseItemsSticks_val, AutoUseItemsUrnAlies,
	AutoUseItemsUrnAliesAlliesHP, AutoUseItemsUrnAliesEnemyHP,
	AutoUseItemsUrnEnemy,
	ItemsForUse, State,
} from "./Menu"

import ItemManagerBase from "../../abstract/Base"
import InitItems from "../../abstract/Items"
import { StateBase } from "../../abstract/MenuBase"

let Units: Unit[] = [],
	AllUnitsHero: Unit[] = [],
	AllCreeps: Creep[] = [],
	Trees: TreeTemp[] = [],
	Particle: [number, Vector3?][] = [],
	nextTick = 0,
	changed = true,
	lastStat: Attributes

export function Init() {
	Units = []
	Trees = []
	nextTick = undefined
	lastStat = undefined
	AllCreeps = []
	AllUnitsHero = []
	Particle = []
	changed = true
	TickSleep.ResetTimer()
}

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

let Base = new ItemManagerBase(),
	TickSleep = new TickSleeper()

function GetDelayCast() {
	return 250
}

export function Tick() {
	if (!StateBase.value || TickSleep.Sleeping || !State.value) {
		return false
	}
	// loop-optimizer: FORWARD
	Units.filter(x =>
		x !== undefined
		&& x.IsControllable
		&& (!x.IsIllusion || x.ModifiersBook.HasBuffByName("modifier_arc_warden_tempest_double"))
		&& !x.IsEnemy()
		&& x.IsAlive,
	).some(ent => AutoUseItems(ent))
}

export function ParticleCreate(id: number, handle: bigint, entity: Entity) {
	if (handle === 1954660700683781942n) {
		Particle.push([id])
	}
}

export function ParticleCreateUpdate(id: number, controlPoint: number, position: Vector3) {
	let part = Particle.find(x => x[0] === id)
	if (part !== undefined) {
		Particle.push([id, position])
	}
}

function IsValidUnit(unit: Unit) {
	let IgnoreBuffs = unit.Buffs.some(buff => buff.Name === "modifier_smoke_of_deceit")
	return unit !== undefined && !unit.IsEnemy() && unit.IsAlive
		&& !unit.IsStunned && !unit.IsChanneling && !unit.IsInvulnerable
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
	let Items = new InitItems(unit)
	if (IsValidItem(Items.PhaseBoots)) {
		if (unit.IsMoving || unit.IdealSpeed >= Base.MaxMoveSpeed) {
			let enemy_phase_in_position = AutoUseItemsPhaseBootsState.value
				? AllUnitsHero.some(enemy => enemy !== undefined && enemy.IsVisible && enemy.IsAlive
					&& enemy.IsEnemy(unit)
					&& unit.Distance2D(enemy.NetworkPosition) <= AutoUseItemsPhase_val.value)
				: AutoUseItemsPhaseBootsState.value

			if (!AutoUseItemsPhaseBootsState.value || enemy_phase_in_position) {
				unit.CastNoTarget(Items.PhaseBoots)
				TickSleep.Sleep(GetDelayCast())
				return true
			}
		}
	}

	if (IsValidItem(Items.Mjollnir)) {
		let enemy_mjolnir = AllUnitsHero.some(enemy => enemy !== undefined && enemy.IsAlive && enemy.IsVisible && enemy.IsEnemy(unit)
			&& unit.Distance2D(enemy.NetworkPosition) <= AutoUseItemsMjollnir_val.value)

		if (enemy_mjolnir) {
			unit.CastTarget(Items.Mjollnir, unit)
			TickSleep.Sleep(GetDelayCast())
			return true
		}
	}

	if ((IsValidItem(Items.MagicWand) || IsValidItem(Items.MagicStick))) {
		let item = Items.MagicWand !== undefined
			? Items.MagicWand
			: Items.MagicStick
		if (!unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal))) {
			if (unit.HPPercent < AutoUseItemsSticks_val.value) {
				unit.CastNoTarget(item)
				TickSleep.Sleep(GetDelayCast())
				return true
			}
			if (unit.HPPercent < AutoUseItemsSticks_val.value) {
				unit.CastNoTarget(item)
				TickSleep.Sleep(GetDelayCast())
				return true
			}
		}
	}

	if (IsValidItem(Items.FaerieFire)) {
		if (!unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal))) {
			if (unit.HP < AutoUseItemsFaerieFire_val.value) {
				unit.CastNoTarget(Items.FaerieFire)
				TickSleep.Sleep(GetDelayCast())
				return true
			}
		}
	}

	if (IsValidItem(Items.Cheese)) {
		if (unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal))) {
			if (unit.HPPercent < AutoUseItemsCheese_val.value) {
				unit.CastNoTarget(Items.Cheese)
				TickSleep.Sleep(GetDelayCast())
				return true
			}
		}
	}

	if (IsValidItem(Items.ArcaneBoots)) {
		if (!unit.Buffs.some(buff => Buffs.NotHeal.some(notHeal => buff.Name === notHeal))) {
			if (unit.ManaPercent < AutoUseItemsArcane_val.value) {
				unit.CastNoTarget(Items.ArcaneBoots)
				TickSleep.Sleep(GetDelayCast())
				return true
			}
		}
	}

	if (IsValidItem(Items.Mekansm) || IsValidItem(Items.GuardianGreaves)) {
		let Item = !Items.Mekansm ? Items.GuardianGreaves : Items.Mekansm
		AllUnitsHero.some(allies => {
			if (allies !== undefined) {
				if (!allies.IsEnemy(unit) && unit.IsInRange(allies.NetworkPosition, Item.AOERadius)) {
					if (!unit.Buffs.some(buff => buff.Name === "modifier_item_mekansm_noheal")
						&& (allies.HPPercent <= AutoUseItemsMG_val.value
							&& allies.IsAlive || unit.HPPercent <= AutoUseItemsMG_val.value
							&& unit.IsAlive)
					) {
						Item.UseAbility(unit)
						unit.CastNoTarget(Item)
						TickSleep.Sleep(GetDelayCast())
						return true
					}
				}
			}
		})
	}

	if (IsValidItem(Items.Bottle)) {
		if (Items.Bottle.CurrentCharges === 3) {
			if (unit.Buffs.some(buff => buff.Name === "modifier_fountain_aura_buff")) {
				AllUnitsHero.some(allies => {
					if (allies !== undefined) {
						if (!allies.IsEnemy(unit) && unit.IsInRange(allies.NetworkPosition, Items.Bottle.CastRange)) {
							if (!allies.IsInvulnerable && !unit.Buffs.some(buff => buff.Name === "modifier_bottle_regeneration")
								&& (allies.Mana !== allies.MaxMana || allies.HP !== allies.MaxHP)) {
								unit.CastTarget(Items.Bottle, allies)
								TickSleep.Sleep(GetDelayCast())
								return true
							}
						}
					}
				})
			}
		}
	}

	if (IsValidItem(Items.Bloodstone)) {
		if (unit.HPPercent < AutoUseItemsBloodHP_val.value
			&& unit.ManaPercent > AutoUseItemsBloodMP_val.value) {
			unit.CastNoTarget(Items.Bloodstone)
			TickSleep.Sleep(GetDelayCast())
			return true
		}
	}

	if (IsValidItem(Items.Buckler)) {
		let enemy_bluker = AllUnitsHero.some(enemy => enemy !== undefined && enemy.IsEnemy(unit) && enemy.IsAlive && enemy.IsVisible
			&& unit.Distance2D(enemy.NetworkPosition) <= AutoUseItemsBluker_val.value)
		if (enemy_bluker) {
			unit.CastNoTarget(Items.Buckler)
			TickSleep.Sleep(GetDelayCast())
			return true
		}
	}

	if (IsValidItem(Items.Midas)) {
		if (AutoUseItemsMidas_CheckBIG.value) {
			let Creep = GetAllCreepsForMidas(unit, Items.Midas)
			if (Creep.length > 0) {
				Creep = Creep.sort((a, b) => b.MaxHP - a.MaxHP) // less MaxHP => first
				if (unit.Distance2D(Creep[0].Position) <= ((Items.Midas.CastRange + unit.CastRangeBonus) + 100) && unit.CanAttack(Creep[0])) {
					unit.CastTarget(Items.Midas, Creep[0])
					TickSleep.Sleep(GetDelayCast())
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
			LocalPlayer.Hero.CastTarget(Item, LocalPlayer.Hero)
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
				if (e[0] && e[1] !== undefined && unit.Distance2D(e[1]) <= Items.Dust.CastRange)
					return e[0]
				return setTimeout(() => Particle = [], 3000)
			})
			let IsVisible = AllUnitsHero.some(enemy => enemy !== undefined && unit.IsEnemy(enemy)
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
				&& !AllUnitsHero.some(allies => allies !== undefined && !unit.IsEnemy(enemy) && allies.IsAlive && allies.GetItemByName("item_gem")
					&& allies.Distance2D(enemy.Position) < 800))

			if (IsVisible) {
				unit.CastNoTarget(Items.Dust)
				TickSleep.Sleep(GetDelayCast())
				return true
			}
		}
	}

	if (IsValidItem(Items.Tango) || IsValidItem(Items.TangoSingle)) {
		let Tango = !Items.Tango ? Items.TangoSingle : Items.Tango,
			tr = Trees.find(x => x.IsInRange(unit, Tango.CastRange))
		if (tr !== undefined) {
			unit.CastTargetTree(Tango, tr)
			TickSleep.Sleep(GetDelayCast())
			return true
		}
	}

	if (IsValidItem(Items.Abyssal)) {
		// loop-optimizer: FORWARD
		AllUnitsHero.filter(enemy => enemy !== undefined && enemy.IsEnemy(unit) && enemy.IsValid && enemy.IsAlive).some(x => {
			if (!x.IsInRange(unit, Items.Abyssal.CastRange))
				return false
			unit.CastTarget(Items.Abyssal, x)
			TickSleep.Sleep(GetDelayCast())
			return true
		})
	}

	if (lastStat !== undefined && Game.RawGameTime >= nextTick) {
		if (Items.PowerTreads !== undefined
			&& ItemsForUse.IsEnabled(Items.PowerTreads.Name)) {
			if (Items.ActiveAttribute !== lastStat && !changed) {
				unit.CastNoTarget(Items.PowerTreads)
				nextTick = nextTick + 0.15 + GetAvgLatency(Flow_t.OUT)
				TickSleep.Sleep(GetDelayCast())
			}
			if (Items.ActiveAttribute === lastStat) {
				lastStat = undefined
				changed = true
			}
			return true
		}
	}
}

function CheckUnitForUrn(Unit: Unit, MaxHP: number) {
	return Unit.IsAlive && Unit.HP <= MaxHP && !Unit.IsInvulnerable
		&& !Unit.ModifiersBook.GetAnyBuffByNames(Buffs.NotHeal)
}

function GetAllCreepsForMidas(Unit: Unit, Item: Item): Creep[] {
	// loop-optimizer: FORWARD
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
						Unit.CastTarget(Item, Creep)
						TickSleep.Sleep(GetDelayCast())
						return true
					}
				} else {
					Unit.CastTarget(Item, Creep)
					TickSleep.Sleep(GetDelayCast())
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
	// loop-optimizer: FORWARD
	AllUnitsHero.map(enemy => {
		if (enemy !== undefined) {
			let target = IsEnemy ? enemy : unit
			if (unit.IsInRange(target.NetworkPosition, Item.CastRange)) {
				if (CheckUnitForUrn(target, IsEnemy ? AutoUseItemsUrnAliesEnemyHP.value : AutoUseItemsUrnAliesAlliesHP.value) && !enemy.IsIllusion
					&& !target.ModifiersBook.GetAnyBuffByNames(["modifier_item_urn_heal", "modifier_item_spirit_vessel_heal"])
				) {
					unit.CastTarget(Item, target)
					TickSleep.Sleep(GetDelayCast())
					return true
				}
			}
		}
	})
}

export function EntityCreate(x: Entity) {
	if (x instanceof Creep && x.IsCreep && !x.IsAncient) {
		AllCreeps.push(x)
	}
	if (x instanceof Unit) {
		Units.push(x)
	}
	if (x instanceof Unit && x.IsHero) {
		AllUnitsHero.push(x)
	}
	if (x instanceof TreeTemp) {
		Trees.push(x)
	}
}

export function EntityDestroy(Entity: Entity) {
	if (Entity instanceof TreeTemp) {
		ArrayExtensions.arrayRemove(Trees, Entity)
	}
	if (Entity instanceof Creep) {
		ArrayExtensions.arrayRemove(AllCreeps, Entity)
	}
	if (Entity instanceof Unit) {
		ArrayExtensions.arrayRemove(Units, Entity)
		ArrayExtensions.arrayRemove(AllUnitsHero, Entity)
	}
}

export function UseMouseItemTarget(args: ExecuteOrder) {
	if (!StateBase.value || !State.value || TickSleep.Sleeping) {
		return true
	}
	let unit = args.Unit as Unit,
		target = args.Target as Unit

	if (target === undefined || unit === undefined) {
		return true
	}
	if (!target.IsBuilding) {
		switch (args.OrderType) {
			case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET:
				if (!target.IsEnemy()) {
					return true
				}
				let Items = new InitItems(unit),
					_Item = Items.SolarCrest === undefined
						? Items.Medallion
						: Items.SolarCrest
				// console.log(unit.Buffs.map(e => e.Name))
				if (IsValidItem(Items.SolarCrest) || IsValidItem(Items.Medallion)
					&& unit.IsInRange(target, _Item.CastRange)
					&& !target.IsMagicImmune) {
					unit.CastTarget(_Item, target)
					TickSleep.Sleep(GetDelayCast())
				}
				if (target.IsHero && IsValidItem(Items.Janggo)
					&& unit.IsInRange(target, Items.Janggo.CastRange / 2)
					&& !unit.HasModifier("modifier_item_ancient_janggo_active")
				) {
					unit.CastNoTarget(Items.Janggo)
					TickSleep.Sleep(GetDelayCast())
				}
				if (target.IsHero && !target.IsMagicImmune
					&& IsValidItem(Items.DiffusalBlade)
					&& unit.IsInRange(target, Items.DiffusalBlade.CastRange)
					&& !target.HasModifier("modifier_item_diffusal_blade_slow")
				) {
					let hex_debuff = target.GetBuffByName("modifier_sheepstick_debuff")
					if ((hex_debuff === undefined || !hex_debuff.IsValid
						|| hex_debuff.RemainingTime <= 0.3)) {
						unit.CastTarget(Items.DiffusalBlade, target)
						TickSleep.Sleep(GetDelayCast())
					}
				}
				break;
		}
	}
}

export function OnExecuteOrder(args: ExecuteOrder): boolean {
	if (!StateBase.value || !State.value) {
		return true
	}
	let unit = args.Unit as Unit
	if (unit === undefined) {
		return true
	}
	let Items = new InitItems(unit)
	let ability = args.Ability as Ability
	if (args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION
		&& args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET
		&& args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE
		&& args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET
		&& args.OrderType !== dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE) {
		return true
	}
	if (!UseSoulRing(unit, Items, ability, args) || !UsePowerTreads(args, ability, unit, Items)) {
		return false
	}
	return true
}

function UseSoulRing(Me: Unit, Items: InitItems, ability: Ability, args: ExecuteOrder): boolean {
	if (!IsValidItem(Items.SoulRing)) {
		return true
	}
	if (Me.HPPercent < AutoUseItemsSouringHP_val.value || Me.ManaPercent > AutoUseItemsSouringMP_val.value
		|| (Me.IsInvisible && !Me.CanUseAbilitiesInInvisibility && !AutoUseItemsSouringInvis.value)
	) {
		return true
	}
	if (ability.ManaCost <= AutoUseItemsSouringMPUse_val.value) {
		return true
	}
	Me.CastNoTarget(Items.SoulRing)
	let Delay = ability.CastPoint <= 0
		? GetDelayCast()
		: (ability.CastPoint * 1000) + GetDelayCast()
	TickSleep.Sleep(Delay)
	if (TickSleep.Sleeping) {
		args.Execute()
		return false
	}
	return true
}

function UsePowerTreads(args: ExecuteOrder, ability: Ability, unit: Unit, Items: InitItems): boolean {
	if (ability.ManaCost < 1 || unit.IsInvisible || TickSleep.Sleeping) {
		return true
	}
	if (ability.Name === "item_manta"
		|| ability.Name === "item_invis_sword"
		|| ability.Name === "item_silver_edge"
		|| ability.Name === "ember_spirit_sleight_of_fist"
		|| ability.Name === "morphling_adaptive_strike_agi"
	) {
		return true
	}
	if (Items.PowerTreads !== undefined
		&& ItemsForUse.IsEnabled(Items.PowerTreads.Name)) {
		if (unit.IsStunned || unit.IsHexed || unit.IsInvulnerable) {
			return true
		}
		if (changed) {
			lastStat = Items.ActiveAttribute
		}
		if (Items.ActiveAttribute === 0) {
			unit.CastNoTarget(Items.PowerTreads)
			TickSleep.Sleep(GetDelayCast())
		} else if (Items.ActiveAttribute === 2) {
			unit.CastNoTarget(Items.PowerTreads)
			unit.CastNoTarget(Items.PowerTreads)
			TickSleep.Sleep(GetDelayCast())
		}
		changed = false
		nextTick = ((Game.RawGameTime + ability.CastPoint) + (0.45 + GetAvgLatency(Flow_t.OUT)))
	}
	TickSleep.Sleep(nextTick)
	if (TickSleep.Sleeping) {
		args.Execute()
		return false
	}
	return true
}
