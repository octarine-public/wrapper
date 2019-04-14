/*!
 * Created on Wed Oct 12 2018
 *
 * This file is part of Fusion.
 * Copyright (c) 2019 Fusion
 *
 * Fusion is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Fusion is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Fusion.  If not, see <http://www.gnu.org/licenses/>.
 */
var rotation_speed = {
		npc_dota_hero_base: 0.5,
		npc_dota_hero_antimage: 0.5,
		npc_dota_hero_axe: 0.6,
		npc_dota_hero_bane: 0.6,
		npc_dota_hero_bloodseeker: 0.5,
		npc_dota_hero_crystal_maiden: 0.5,
		npc_dota_hero_drow_ranger: 0.7,
		npc_dota_hero_earthshaker: 0.9,
		npc_dota_hero_juggernaut: 0.6,
		npc_dota_hero_mirana: 0.5,
		npc_dota_hero_nevermore: 1,
		npc_dota_hero_morphling: 0.6,
		npc_dota_hero_phantom_lancer: 0.6,
		npc_dota_hero_puck: 0.5,
		npc_dota_hero_pudge: 0.7,
		npc_dota_hero_razor: 0.5,
		npc_dota_hero_sand_king: 0.5,
		npc_dota_hero_storm_spirit: 0.8,
		npc_dota_hero_sven: 0.6,
		npc_dota_hero_tiny: 0.5,
		npc_dota_hero_vengefulspirit: 0.6,
		npc_dota_hero_windrunner: 0.8,
		npc_dota_hero_zuus: 0.6,
		npc_dota_hero_kunkka: 0.6,
		npc_dota_hero_lina: 0.5,
		npc_dota_hero_lich: 0.5,
		npc_dota_hero_lion: 0.5,
		npc_dota_hero_shadow_shaman: 0.5,
		npc_dota_hero_slardar: 0.5,
		npc_dota_hero_tidehunter: 0.5,
		npc_dota_hero_witch_doctor: 0.5,
		npc_dota_hero_riki: 0.6,
		npc_dota_hero_enigma: 0.5,
		npc_dota_hero_tinker: 0.6,
		npc_dota_hero_sniper: 0.7,
		npc_dota_hero_necrolyte: 0.5,
		npc_dota_hero_warlock: 0.5,
		npc_dota_hero_beastmaster: 0.5,
		npc_dota_hero_queenofpain: 0.5,
		npc_dota_hero_venomancer: 0.5,
		npc_dota_hero_faceless_void: 1,
		npc_dota_hero_skeleton_king: 0.5,
		npc_dota_hero_death_prophet: 0.5,
		npc_dota_hero_phantom_assassin: 0.6,
		npc_dota_hero_pugna: 0.5,
		npc_dota_hero_templar_assassin: 0.7,
		npc_dota_hero_viper: 0.5,
		npc_dota_hero_luna: 0.6,
		npc_dota_hero_dragon_knight: 0.6,
		npc_dota_hero_dazzle: 0.6,
		npc_dota_hero_rattletrap: 0.6,
		npc_dota_hero_leshrac: 0.5,
		npc_dota_hero_furion: 0.6,
		npc_dota_hero_life_stealer: 1,
		npc_dota_hero_dark_seer: 0.6,
		npc_dota_hero_clinkz: 0.5,
		npc_dota_hero_omniknight: 0.6,
		npc_dota_hero_enchantress: 0.5,
		npc_dota_hero_huskar: 0.5,
		npc_dota_hero_night_stalker: 0.5,
		npc_dota_hero_broodmother: 0.5,
		npc_dota_hero_bounty_hunter: 0.6,
		npc_dota_hero_weaver: 0.5,
		npc_dota_hero_jakiro: 0.5,
		npc_dota_hero_batrider: 1,
		npc_dota_hero_chen: 0.6,
		npc_dota_hero_spectre: 0.5,
		npc_dota_hero_doom_bringer: 0.5,
		npc_dota_hero_ancient_apparition: 0.6,
		npc_dota_hero_ursa: 0.5,
		npc_dota_hero_spirit_breaker: 0.5,
		npc_dota_hero_gyrocopter: 0.6,
		npc_dota_hero_alchemist: 0.6,
		npc_dota_hero_invoker: 0.5,
		npc_dota_hero_silencer: 0.6,
		npc_dota_hero_obsidian_destroyer: 0.5,
		npc_dota_hero_lycan: 0.5,
		npc_dota_hero_brewmaster: 0.6,
		npc_dota_hero_shadow_demon: 0.6,
		npc_dota_hero_lone_druid: 0.5,
		npc_dota_hero_chaos_knight: 0.5,
		npc_dota_hero_meepo: 0.65,
		npc_dota_hero_treant: 0.5,
		npc_dota_hero_ogre_magi: 0.6,
		npc_dota_hero_undying: 0.6,
		npc_dota_hero_rubick: 0.7,
		npc_dota_hero_disruptor: 0.5,
		npc_dota_hero_nyx_assassin: 0.5,
		npc_dota_hero_naga_siren: 0.5,
		npc_dota_hero_keeper_of_the_light: 0.5,
		npc_dota_hero_wisp: 0.7,
		npc_dota_hero_visage: 0.5,
		npc_dota_hero_slark: 0.6,
		npc_dota_hero_medusa: 0.5,
		npc_dota_hero_troll_warlord: 0.5,
		npc_dota_hero_centaur: 0.5,
		npc_dota_hero_magnataur: 0.8,
		npc_dota_hero_shredder: 0.6,
		npc_dota_hero_bristleback: 1,
		npc_dota_hero_tusk: 0.7,
		npc_dota_hero_skywrath_mage: 0.5,
		npc_dota_hero_abaddon: 0.5,
		npc_dota_hero_elder_titan: 0.5,
		npc_dota_hero_legion_commander: 0.5,
		npc_dota_hero_ember_spirit: 0.5,
		npc_dota_hero_earth_spirit: 0.6,
		npc_dota_hero_terrorblade: 0.5,
		npc_dota_hero_phoenix: 1,
		npc_dota_hero_oracle: 0.7,
		npc_dota_hero_techies: 0.5,
		npc_dota_hero_target_dummy: 0.5,
		npc_dota_hero_winter_wyvern: 0.5,
		npc_dota_hero_arc_warden: 0.6,
		npc_dota_hero_abyssal_underlord: 0.6,
		npc_dota_hero_monkey_king: 0.6,
		npc_dota_hero_pangolier: 1,
		npc_dota_hero_dark_willow: 0.7,
		npc_dota_hero_grimstroke: 0.6,
		npc_dota_hero_mars: 0.8,
	},
	projectile_speeds = {
		npc_dota_hero_bane: 900,
		npc_dota_hero_crystal_maiden: 900,
		npc_dota_hero_drow_ranger: 1250,
		npc_dota_hero_mirana: 900,
		npc_dota_hero_nevermore: 1200,
		npc_dota_hero_morphling: 1300,
		npc_dota_hero_puck: 900,
		npc_dota_hero_razor: 2000,
		npc_dota_hero_storm_spirit: 1100,
		npc_dota_hero_vengefulspirit: 1500,
		npc_dota_hero_windrunner: 1250,
		npc_dota_hero_zuus: 1100,
		npc_dota_hero_lina: 1000,
		npc_dota_hero_lich: 900,
		npc_dota_hero_lion: 900,
		npc_dota_hero_shadow_shaman: 900,
		npc_dota_hero_witch_doctor: 1200,
		npc_dota_hero_enigma: 900,
		npc_dota_hero_tinker: 900,
		npc_dota_hero_sniper: 3000,
		npc_dota_hero_necrolyte: 900,
		npc_dota_hero_warlock: 1200,
		npc_dota_hero_queenofpain: 1500,
		npc_dota_hero_venomancer: 900,
		npc_dota_hero_death_prophet: 1000,
		npc_dota_hero_pugna: 900,
		npc_dota_hero_templar_assassin: 900,
		npc_dota_hero_viper: 1200,
		npc_dota_hero_luna: 900,
		npc_dota_hero_dragon_knight: 900,
		npc_dota_hero_dazzle: 1200,
		npc_dota_hero_leshrac: 900,
		npc_dota_hero_furion: 1125,
		npc_dota_hero_clinkz: 900,
		npc_dota_hero_enchantress: 900,
		npc_dota_hero_huskar: 1400,
		npc_dota_hero_weaver: 900,
		npc_dota_hero_jakiro: 1100,
		npc_dota_hero_batrider: 900,
		npc_dota_hero_chen: 1100,
		npc_dota_hero_ancient_apparition: 1250,
		npc_dota_hero_gyrocopter: 3000,
		npc_dota_hero_invoker: 900,
		npc_dota_hero_silencer: 1000,
		npc_dota_hero_obsidian_destroyer: 900,
		npc_dota_hero_shadow_demon: 900,
		npc_dota_hero_lone_druid: 900,
		npc_dota_hero_rubick: 1125,
		npc_dota_hero_disruptor: 1200,
		npc_dota_hero_keeper_of_the_light: 900,
		npc_dota_hero_wisp: 1200,
		npc_dota_hero_visage: 900,
		npc_dota_hero_medusa: 1200,
		npc_dota_hero_troll_warlord: 1200,
		npc_dota_hero_skywrath_mage: 1000,
		npc_dota_hero_terrorblade: 900,
		npc_dota_hero_phoenix: 1100,
		npc_dota_hero_oracle: 900,
		npc_dota_hero_techies: 900,
		npc_dota_hero_target_dummy: 900,
		npc_dota_hero_winter_wyvern: 700,
		npc_dota_hero_arc_warden: 900,
		npc_dota_hero_dark_willow: 1200,
		npc_dota_hero_grimstroke: 900,
	},
	attacks: Array<[number, number, C_DOTA_BaseNPC]> = [],
	CursorWorldVec = new Vector(),
	NPCs: C_DOTA_BaseNPC[] = []

export function GetEntitiesInRange(vec: Vector, range: number, onlyEnemies: boolean = false, findInvuln: boolean = false): C_DOTA_BaseNPC[] {
	var localplayer = LocalDOTAPlayer
	return orderBy (
		vec.GetEntitiesInRange(range).filter(ent =>
			ent instanceof C_DOTA_BaseNPC
			&& (!onlyEnemies || ent.IsEnemy(localplayer))
			&& ent.m_bIsAlive
			&& !(!findInvuln && ent.m_bIsInvulnerable),
		),
		(ent: C_BaseEntity) => vec.DistTo(ent.m_vecNetworkOrigin),
	) as C_DOTA_BaseNPC[]
}

export function GetItemByRegexp(ent: C_DOTA_BaseNPC, regex: RegExp): C_DOTA_Item {
	var found
	for (let i = 0; i < 6; i++) {
		const item = ent.GetItemInSlot(i)
		if (item === undefined)
			continue
		const name = item.m_pAbilityData.m_pszAbilityName
		if (name !== undefined && regex.test(name))
			return item
	}
	return undefined as any
}

export function GetItem(ent: C_DOTA_BaseNPC, name: string | RegExp): C_DOTA_Item {
	return name instanceof RegExp ? GetItemByRegexp(ent, name) : ent.GetItemByName(name)
}

export function GetAbilityByRegexp(ent: C_DOTA_BaseNPC, regex: RegExp): C_DOTABaseAbility {
	var found
	for (let i = 0; i < 24; i++) {
		const abil = ent.GetAbility(i)
		if (abil === undefined)
			continue
		const name = abil.m_pAbilityData.m_pszAbilityName
		if (name !== undefined && regex.test(name))
			return abil
	}
	return undefined as any
}

export function GetAbility(ent: C_DOTA_BaseNPC, name: string | RegExp): C_DOTABaseAbility {
	return name instanceof RegExp ? GetAbilityByRegexp(ent, name) : ent.GetAbilityByName(name)
}

export function orderBy<T>(ar: T[], cb: (obj: T) => any): T[] {
	return ar.sort((a, b) => cb(a) - cb(b))
}

export function GetDamage(ent: C_DOTA_BaseNPC): number { return ent.m_iDamageMin + ent.m_iDamageBonus }

export function VelocityWaypoint(ent: C_DOTA_BaseNPC, time: number, movespeed: number = ent.m_bIsMoving ? ent.m_fIdealSpeed : 0): Vector {
	return ent.InFront(movespeed * time)
}

export function HasLinkenAtTime(ent: C_DOTA_BaseNPC, time: number = 0): boolean {
	if (!ent.m_bIsHero)
		return false
	const sphere = ent.GetItemByName("item_sphere")

	return (
		sphere !== undefined &&
		sphere.m_fCooldown - time <= 0
	) || (
		ent.GetBuffByName("modifier_item_sphere_target") !== undefined
		&& ent.GetBuffByName("modifier_item_sphere_target").m_flDieTime - GameRules.m_fGameTime - time <= 0
	)
}

export function SelectGroup(group: C_BaseEntity[], first: boolean = false): void {
	group.filter(ent => ent !== undefined).forEach(ent => {
		SelectUnit(ent, !first)
		first = false
	})
}

export function IsFlagSet(base: bigint, flag: bigint) {
	return (base & flag) > 0
}

export function GetProjectileDelay(source: C_DOTA_BaseNPC, target: C_DOTA_BaseNPC) {
	if (!source.m_bIsRangedAttacker)
		return 0
	let proj_speed = source instanceof C_DOTA_BaseNPC_Hero ? projectile_speeds[source.m_iszUnitName] : 900
	if (proj_speed === undefined)
		return 0
	return (source.m_vecNetworkOrigin.DistTo(target.m_vecNetworkOrigin) - source.m_flHullRadius - target.m_flHullRadius) / proj_speed
}

export function IsInside(npc: C_DOTA_BaseNPC, vec: Vector, radius: number): boolean {
	const direction = npc.m_vecForward,
		npc_pos = npc.m_vecNetworkOrigin
	const npc_pos_x = npc_pos.x, npc_pos_y = npc_pos.y, npc_pos_z = npc_pos.z,
		vec_x = vec.x, vec_y = vec.y, vec_z = vec.z,
		direction_x = direction.x, direction_y = direction.y, direction_z = direction.z,
		radius_sqr = radius ** 2
	for (let i = Math.floor(vec.DistTo(npc_pos) / radius) + 1; i--; )
		// if (npc_pos.DistTo(new Vector(vec.x - direction.x * i * radius, vec.y - direction.y * i * radius, vec.z - direction.z * i * radius)) <= radius)
		// optimized version, as V8 unable to optimize any native code by inlining
		if ((((vec_x - direction_x * i * radius - npc_pos_x) ** 2) + ((vec_y - direction_y * i * radius - npc_pos_y) ** 2) + ((vec_z - direction_z * i * radius - npc_pos_z) ** 2)) <= radius_sqr)
			return true
	return false
}

export function GetHealthAfter(ent: C_DOTA_BaseNPC, delay: number, include_projectiles: boolean = false, attacker?: C_DOTA_BaseNPC, melee_time_offset: number = 0): number {
	let cur_time = GameRules.m_fGameTime,
		hpafter = ent.m_iHealth
	// loop-optimizer: KEEP
	attacks.forEach((data, attacker_id) => {
		let attacker_it = Entities.GetByID(attacker_id) as C_DOTA_BaseNPC,
			[end_time, end_time_2, attack_target] = data
		if (attacker_it !== attacker && attack_target === ent) {
			if ((end_time <= cur_time + delay + melee_time_offset)) {
				let dmg = ent.CalculateDamageByHand(attacker_it)
				hpafter -= dmg
				if ((end_time_2 <= cur_time + delay + melee_time_offset))
					hpafter -= dmg
			}
		}
	})
	if (include_projectiles)
		Projectiles.GetAllTracking().forEach(proj => {
			let source = proj.m_hSource
			if (proj.m_hTarget === ent && source !== undefined && proj.m_bIsAttack && !proj.m_bIsEvaded && (proj.m_vecPosition.DistTo(proj.m_vecTarget) / proj.m_iSpeed) <= delay)
				hpafter -= ent.CalculateDamageByHand(source)
		})
	return Math.min(hpafter + ent.m_flHealthThinkRegen * delay, ent.m_iMaxHealth)
}

export function FindAttackingUnit(npc: C_DOTA_BaseNPC): C_DOTA_BaseNPC {
	if (npc === undefined)
		return undefined
	let pos = npc.m_vecNetworkOrigin,
		is_default_creep = npc.m_bIsCreep && !npc.m_bIsControllableByAnyPlayer
	return orderBy(NPCs.filter(npc_ =>
		npc_ !== npc &&
		npc_.m_vecNetworkOrigin.DistTo(pos) <= (npc.m_fAttackRange + npc.m_flHullRadius + npc_.m_flHullRadius) &&
		!npc_.m_bIsInvulnerable &&
		IsInside(npc, npc_.m_vecNetworkOrigin, npc_.m_flHullRadius) &&
		(npc.IsEnemy(npc_) || (!is_default_creep && npc_.m_bIsDeniable)),
	), ent => GetAngle(npc, ent.m_vecNetworkOrigin))[0] as C_DOTA_BaseNPC
}

export function GetAngle(npc: C_DOTA_BaseNPC, vec: Vector): number {
	let npc_pos = npc.m_vecNetworkOrigin,
		angle = Math.abs(Math.atan2(npc_pos.y - vec.y, npc_pos.x - vec.x) - npc.m_vecForward.Angle)
	if (angle > Math.PI)
		angle = Math.abs((Math.PI * 2) - angle)
	return angle
}

let turn_rad = Math.PI - 0.25
export function GetRotationTime(npc: C_DOTA_BaseNPC, vec: Vector): number {
	let ang = GetAngle(npc, vec)
	if (ang > turn_rad) // <= (360-45)deg
		return 0
	return 30 * ang / rotation_speed[npc.m_iszUnitName]
}

export function GetOrdersWithoutSideEffects() {
	return [
		dotaunitorder_t.DOTA_UNIT_ORDER_TRAIN_ABILITY,
		dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE,
		dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO,
		dotaunitorder_t.DOTA_UNIT_ORDER_PURCHASE_ITEM,
		dotaunitorder_t.DOTA_UNIT_ORDER_DISASSEMBLE_ITEM,
		dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK,
		dotaunitorder_t.DOTA_UNIT_ORDER_SELL_ITEM,
		dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM,
		dotaunitorder_t.DOTA_UNIT_ORDER_EJECT_ITEM_FROM_STASH,
		dotaunitorder_t.DOTA_UNIT_ORDER_CONTINUE, // Announce?
		dotaunitorder_t.DOTA_UNIT_ORDER_GLYPH,
		dotaunitorder_t.DOTA_UNIT_ORDER_RADAR,
	]
}

export function GetCursorWorldVec() {
	return CursorWorldVec
}

Events.addListener("onSendMove", cmd => cmd.vec_under_cursor.CopyTo(CursorWorldVec))

Events.addListener("onEntityCreated", ent => {
	if (ent instanceof C_DOTA_BaseNPC)
		NPCs.push(ent)
})

Events.addListener("onEntityDestroyed", ent => {
	const id = NPCs.indexOf(ent as C_DOTA_BaseNPC)
	if (id !== -1)
		NPCs.splice(id, 1)
	let ent_id = ent.m_iID
	// loop-optimizer: KEEP
	attacks = attacks.filter((data, attacker_id) => attacker_id !== ent_id && data[2] !== ent)
})

Events.addListener("onUnitAnimation", (npc, sequenceVariant, playbackrate, castpoint, type, activity) => {
	if (activity === 1503 && !npc.m_bIsRangedAttacker) {
		let delay = (1 / npc.m_fAttacksPerSecond) - 0.06
		attacks[npc.m_iID] = [
			GameRules.m_fGameTime + delay,
			npc.m_bIsCreep ? GameRules.m_fGameTime + delay * 2 + 0.06 : Number.MAX_VALUE,
			FindAttackingUnit(npc),
		]
	}
})

Events.addListener("onUnitAnimationEnd", npc => {
	let id = npc.m_iID
	let found = attacks[id]
	if (found === undefined)
		return
	let [end_time, end_time_2, attack_target] = found
	if (attack_target === undefined || !npc.m_bIsCreep || npc.m_bIsControllableByAnyPlayer || !attack_target.m_bIsValid || !attack_target.m_bIsAlive || !attack_target.m_bIsVisible) {
		delete attacks[id]
		return
	}
	let delay = (1 / npc.m_fAttacksPerSecond) + 0.06
	attacks[id] = [
		GameRules.m_fGameTime + delay,
		GameRules.m_fGameTime + delay * 2 - 0.06,
		attack_target,
	]
})

Events.addListener("onGameEnded", () => {
	attacks = []
	NPCs = []
})

Events.addListener("onTick", () => {
	// attack sanitizer
	// loop-optimizer: KEEP
	attacks.forEach((data, attacker_id) => data[2] = FindAttackingUnit(Entities.GetByID(attacker_id) as C_DOTA_BaseNPC))

	// NPC event
	for (let i = 0, end = NPCs.length; i < end; i++) {
		let npc = NPCs[i]
		if (!npc.m_bIsValid) {
			NPCs.splice(i++, 1)
			end--
		}
		else if (npc.m_iszUnitName !== undefined) {
			Events.emit("onNPCCreated", npc)
			NPCs.splice(i++, 1)
			end--
		}
	}
})
