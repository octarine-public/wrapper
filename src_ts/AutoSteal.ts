import { Ability, BitsExtensions, Creep, EntityManager, EventsSDK, GameRules, GameSleeper, Hero, LocalPlayer, Menu, Unit, TickSleeper, ProjectileManager, GameState } from "wrapper/Imports"

function GetHealthAfter(unit: Unit, delay: number, allow_overflow = false, include_projectiles: boolean = false, attacker?: Unit, melee_time_offset: number = 0): number {
	let hpafter = unit.HP/*,
		cur_time = Game.RawGameTime
	attacks.forEach(([end_time, end_time_2, attack_target], attacker_ent) => {
		if (attacker_ent !== attacker && attack_target === unit) {
			let end_time_delta = end_time - (cur_time + delay + melee_time_offset),
				dmg = attacker_ent.AttackDamage(unit)
			if (end_time_delta <= 0 && end_time_delta >= -melee_end_time_delta)
				hpafter -= dmg
			let end_time_2_delta = end_time_2 - (cur_time + delay + melee_time_offset)
			if (end_time_2_delta <= 0 && end_time_2_delta >= -melee_end_time_delta)
				hpafter -= dmg
		}
	})*/
	if (include_projectiles)
		ProjectileManager.AllTrackingProjectiles.forEach(proj => {
			let source = proj.Source
			if (
				proj.Target === unit
				&& source instanceof Unit
				&& proj.IsAttack
				&& !proj.IsDodged
				&& (proj.Position.Distance(proj.TargetLoc) / proj.Speed) <= delay
			)
				hpafter -= unit.AttackDamage(source)
		})
	hpafter += unit.HPRegen * delay
	return Math.max(allow_overflow ? hpafter : Math.min(hpafter, unit.MaxHP), 0)
}

let root = Menu.AddEntry(["Utility", "AutoSteal"]),
	state = root.AddToggle("State", false),
	kill_creeps = root.AddToggle("Kill creeps", false),
	kill_heroes = root.AddToggle("Kill heroes", true)

var abils: {
	abilName: string | RegExp
	abil?: Ability
	targets: bigint
	abilRadiusF?: (abil: Ability) => number
	abilDelayF?: (abil: Ability, entFrom: Unit, entTo: Unit) => number
	abilDamageF?: (abil: Ability, entFrom: Unit, entTo: Unit) => number
	abilCastF?: (abil: Ability, entFrom: Unit, entTo: Unit) => void,
}[] = [
		{
			abilName: "axe_culling_blade",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil, entFrom, entTo) => {
				var killThreshold = abil.GetSpecialValue("kill_threshold"),
					hp = GetHealthAfter(entTo, abil.CastPoint)
				return hp > killThreshold
					? entTo.CalculateDamage(abil.AbilityDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
					: killThreshold
			},
		},
		{
			abilName: "necrolyte_reapers_scythe",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil, entFrom, entTo) => {
				var DamagePerMissHP = abil.GetSpecialValue("damage_per_health"),
					delta = GetHealthAfter(entTo, 3)
				return entTo.CalculateDamage((entTo.MaxHP - delta) * DamagePerMissHP, abil.DamageType, entFrom)
			},
		},
		{
			abilName: "zuus_arc_lightning",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP),
		},
		{
			abilName: "zuus_lightning_bolt",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "zuus_thundergods_wrath",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "sniper_assassinate",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil, entFrom, entTo) => entFrom.Distance(entTo) / abil.Speed,
		},
		{
			abilName: "visage_soul_assumption",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil, entFrom, entTo) => entFrom.Distance(entTo) / abil.Speed,
			abilDamageF: (abil, entFrom, entTo) => {
				var baseDamage = abil.GetSpecialValue("soul_base_damage"),
					stackDamage = abil.GetSpecialValue("soul_charge_damage"),
					stackBuff = entFrom.GetBuffByName("modifier_visage_soul_assumption"),
					stackBuffDamage = stackBuff ? stackBuff.StackCount * stackDamage : 0
				return entTo.CalculateDamage((baseDamage + stackBuffDamage) * latest_spellamp, abil.DamageType, entFrom)
			},
		},
		{
			abilName: "rubick_fade_bolt",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "phantom_assassin_stifling_dagger",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP),
			abilDelayF: (abil, entFrom, entTo) => entFrom.Distance(entTo) / abil.GetSpecialValue("dagger_speed"),
			abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.GetSpecialValue("base_damage"), abil.DamageType, entFrom) + ((1 + abil.GetSpecialValue("attack_factor") / 100) * entFrom.AttackDamage(entTo)),
		},
		{
			abilName: "tinker_laser",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.AbilityDamage, abil.DamageType, entFrom),
		},
		{
			abilName: "antimage_mana_void",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.GetSpecialValue("mana_void_damage_per_mana") * (entTo.MaxMana - entTo.Mana) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "puck_waning_rift",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilRadiusF: abil => abil.AOERadius / 2 - 25,
		},
		{
			abilName: "brewmaster_thunder_clap",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilRadiusF: abil => abil.AOERadius / 2 - 25,
		},
		{
			abilName: "obsidian_destroyer_astral_imprisonment",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.AbilityDamage * latest_spellamp, abil.DamageType, entFrom) - Math.min(abil.GetSpecialValue("prison_duration") * entTo.HPRegen * 30 + 1, entTo.MaxHP - entTo.HP),
		},
		{
			abilName: /item_dagon/,
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "bristleback_quill_spray",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP),
			abilRadiusF: abil => abil.AOERadius,
			abilDelayF: (abil, entFrom, entTo) => entFrom.Distance(entTo) / abil.Speed,
			abilDamageF: (abil, entFrom, entTo) => {
				var baseDamage = abil.GetSpecialValue("quill_base_damage"),
					stackDamage = abil.GetSpecialValue("quill_stack_damage"),
					maxDamage = abil.GetSpecialValue("max_damage"),
					stackBuff = entTo.GetBuffByName("modifier_bristleback_quill_spray"),
					stackBuffDamage = stackBuff ? stackBuff.StackCount * stackDamage : 0
				return entTo.CalculateDamage(Math.min(maxDamage, baseDamage + stackBuffDamage) * latest_spellamp, abil.DamageType, entFrom)
			},
		},
		{
			abilName: "luna_lucent_beam",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "alchemist_unstable_concoction",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.GetSpecialValue("max_damage") * latest_spellamp, abil.DamageType, entFrom),
		},
		{
			abilName: "alchemist_unstable_concoction_throw",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil, entFrom, entTo) => {
				let CastPoint = abil.CastPoint
				abil = entFrom.GetAbilityByName("alchemist_unstable_concoction")!
				var maxDamage = abil.GetSpecialValue("max_damage"),
					brew_time = abil.GetSpecialValue("brew_time"),
					brew_explosion = abil.GetSpecialValue("brew_explosion"),
					minStun = abil.GetSpecialValue("min_stun")

				var buff = entFrom.GetBuffByName("modifier_alchemist_unstable_concoction")
				if (buff === undefined)
					return 0

				let remaining_time = buff.CreationTime + brew_explosion - GameRules!.RawGameTime - (entFrom.GetRotationTime(entTo.Position) / 1000)
				if (remaining_time <= CastPoint * 2)
					return 99999999 // we don't need to be self-stunned, ye?

				var elapsed = Math.min(brew_explosion - remaining_time, brew_time) - minStun,
					charged = Math.max(elapsed, 0) / brew_time
				return entTo.CalculateDamage(charged * maxDamage * latest_spellamp, abil.DamageType, entFrom)
			},
		},
		{
			abilName: "abaddon_death_coil",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.GetSpecialValue("target_damage") * latest_spellamp, abil.DamageType, entFrom),
		},
		{
			abilName: "bounty_hunter_shuriken_toss",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil, entFrom, entTo) => entFrom.Distance(entTo) / abil.GetSpecialValue("speed"),
			abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.GetSpecialValue("bonus_damage") * latest_spellamp, abil.DamageType, entFrom),
		},
		{
			abilName: "ogre_magi_fireblast",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "ogre_magi_unrefined_fireblast",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "undying_soul_rip",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(
				abil.GetSpecialValue("damage_per_unit")
				* Math.min(
					EntityManager.GetEntitiesByClasses<Unit>([Creep, Hero]).filter(unit =>
						!unit.IsEnemy(entFrom)
						&& unit.IsInRange(entTo, abil.AOERadius)
					).length,
					abil.GetSpecialValue("max_units"),
				) * latest_spellamp,
				abil.DamageType,
				entFrom,
			),
		},
		{
			abilName: "queenofpain_scream_of_pain",
			abilRadiusF: abil => abil.AOERadius / 2 - 25,
			abilDelayF: (abil, entFrom, entTo) => entFrom.Distance(entTo) / abil.Speed,
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "leshrac_lightning_storm",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "tusk_walrus_punch",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil, entFrom, entTo) => entFrom.AttackDamage(entTo) * abil.GetSpecialValue("crit_multiplier") / 100,
		},
		{
			abilName: "centaur_double_edge",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil, entFrom, entTo) => {
				let edgeDamage = abil.GetSpecialValue("edge_damage") + (abil.GetSpecialValue("strength_damage") / 100 * entFrom.TotalStrength)
				return entTo.CalculateDamage(edgeDamage * latest_spellamp, abil.DamageType, entFrom)
			},
		},
		{
			abilName: "legion_commander_duel",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil, entFrom, entTo) => entFrom.AttackDamage(entTo) * 2 - 1,
		}, /*
		{
			abilName: "legion_commander_overwhelming_odds",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC) => {
				let creeps = EntityManager.GetEntitiesByClass(Creep, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY),
					heroes = EntityManager.GetEntitiesByClass(Hero, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY)
				return Utils.CalculateDamage(entTo, (abil.AbilityDamage * heroes.length + abil.GetSpecialValue("damage_per_unit") * creeps.length) * latest_spellamp, abil.DamageType)
			}
		},*/
		{
			abilName: "broodmother_spawn_spiderlings",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil, entFrom, entTo) => entFrom.Distance(entTo) / abil.Speed,
		},
		{
			abilName: "crystal_maiden_crystal_nova",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "shadow_shaman_ether_shock",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "undying_decay",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "oracle_purifying_flames",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP),
		},
		{
			abilName: "lion_impale",
			abilDelayF: (abil, entFrom, entTo) => entFrom.Distance(entTo) / abil.GetSpecialValue("speed"),
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "lion_finger_of_death",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: abil => abil.GetSpecialValue("damage_delay"),
			abilDamageF: (abil, entFrom, entTo) => {
				var damage = abil.GetSpecialValue("damage" + (entFrom.HasScepter ? "_scepter" : "")),
					buff = entFrom.GetBuffByName("modifier_lion_finger_of_death_kill_counter")
				if (buff !== undefined)
					damage += buff.StackCount * abil.GetSpecialValue("damage_per_kill")

				return entTo.CalculateDamage(damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "lina_laguna_blade",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: abil => abil.GetSpecialValue("damage_delay"),
			abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.AbilityDamage * latest_spellamp, entFrom.HasScepter ? DAMAGE_TYPES.DAMAGE_TYPE_PURE : DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "pudge_dismember",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.GetSpecialValue("dismember_damage") * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "lich_frost_nova",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "night_stalker_void",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "phantom_lancer_spirit_lance",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil, entFrom, entTo) => entFrom.Distance(entTo) / abil.Speed,
		},
		{
			abilName: "skeleton_king_hellfire_blast",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil, entFrom, entTo) => entFrom.Distance(entTo) / abil.Speed,
		},
		{
			abilName: "sven_storm_bolt",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil, entFrom, entTo) => entFrom.Distance(entTo) / abil.Speed,
		},
		/*{
			abilName: "storm_spirit_ball_lightning",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC) => Abilities.GetCastPoint(abil) + entFrom.Distance(entTo) / abil.GetSpecialValue("ball_lightning_move_speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC) => {
				var dist = entFrom.Distance(entTo) / 100
				if (entFrom.BuffsNames.indexOf("modifier_storm_spirit_ball_lightning") > -1 || entFrom.m_flMana < Abilities.GetManaCost(abil) + abil.GetSpecialValue("ball_lightning_travel_cost_base") * dist + abil.GetSpecialValue("ball_lightning_travel_cost_percent") / 100 * entFrom.m_flMaxMana * dist)
					return 0

				return Utils.CalculateDamage(entTo, dist * Abilities.GetAbilityDamage(abil), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			},
			abilCastF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC) => {
				var aoe = abil.GetSpecialValue("ball_lightning_aoe") / 2,
					dist = entFrom.Distance(entTo),
					time = Abilities.GetCastPoint(abil) + dist / abil.GetSpecialValue("ball_lightning_move_speed"),
					point1 = entTo.VelocityWaypoint(time),
					point2 = Fusion.Extend(point1, entFrom.AbsOrigin, aoe),
					point
				if (Utils.CalculateDamage(entTo, point1.PointDistance(entFrom.AbsOrigin) * Abilities.GetAbilityDamage(abil), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) > Utils.GetHealthAfter(entTo, time * 30))
					point = point1
				else if (Utils.CalculateDamage(entTo, point2.PointDistance(entFrom.AbsOrigin) * Abilities.GetAbilityDamage(abil), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) > Utils.GetHealthAfter(entTo, time * 30))
					point = point2
				if (point)
					Orders.CastPosition(entFrom, abil, point, false)
			}
		},*/
		{
			abilName: "furion_wrath_of_nature",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.GetSpecialValue("damage" + (entFrom.HasScepter ? "_scepter" : "")) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "beastmaster_primal_roar",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "sandking_burrowstrike",
			abilDelayF: (abil, entFrom, entTo) => entFrom.Distance(entTo) / abil.GetSpecialValue("burrow_speed" + (entFrom.HasScepter ? "_scepter" : "")),
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{ // TODO: improved magresist calculation
			abilName: "item_ethereal_blade",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil, entFrom, entTo) => entFrom.Distance(entTo) / abil.Speed,
		},
		{
			abilName: "morphling_adaptive_strike_agi",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil, entFrom, entTo) => entFrom.Distance(entTo) / abil.Speed,
			abilDamageF: (abil, entFrom, entTo) => {
				const base = abil.GetSpecialValue("damage_base"),
					min_mul = abil.GetSpecialValue("damage_min")
				const mul = abil.GetSpecialValue("damage_max") - min_mul,
					agi = entFrom.TotalAgility
				return entTo.CalculateDamage(base + (min_mul + mul * (agi / entFrom.TotalStrength)) * agi * latest_spellamp, abil.DamageType, entFrom)
			},
		},
		// TODO: mars_gods_rebuke
	],
	scriptSleeper = new TickSleeper(),
	blinkSleeper = new TickSleeper(),
	latest_spellamp: number = 1,
	sleeper = new GameSleeper()

function GetAvailableAbils() {
	var MyEnt = LocalPlayer!.Hero
	return abils.filter(
		abilData => abilData.abilName instanceof RegExp
			|| abilData.abilName.startsWith("item_")
			|| MyEnt?.GetAbilityByName(abilData.abilName) !== undefined,
	)
}

function getDamage(abil: Ability, entFrom: Unit, entTo: Unit): number {
	return entTo.CalculateDamage(abil.AbilityDamage * latest_spellamp, abil.DamageType, entFrom)
}

function filter_func(unit: Unit): boolean {
	return (
		unit.IsEnemy()
		&& unit.IsVisible
		&& !unit.IsWaitingToSpawn
		&& unit.IsAlive
		&& !sleeper.Sleeping(unit)
	)
}

EventsSDK.on("Tick", () => {
	if (!state.value)
		return

	const MyEnt = LocalPlayer!.Hero/*,
		selectedHero = /^npc_dota_hero_(.*)$/.exec(MyEnt.UnitName)[1]*/
	if (MyEnt === undefined || MyEnt.IsStunned || !MyEnt.IsAlive || scriptSleeper.Sleeping || MyEnt.IsChanneling /* || (MyEnt.CanBeVisible && selectedHero !== "riki" && selectedHero !== "treant_protector")*/)
		return
	latest_spellamp = 1 + MyEnt.SpellAmplification
	{
		let bs_buff = MyEnt.GetBuffByName("modifier_bloodseeker_bloodrage")
		if (bs_buff !== undefined)
			latest_spellamp *= (bs_buff.Ability?.GetSpecialValue("damage_increase_pct") ?? 100) / 100
	}
	var availableAbils = GetAvailableAbils().filter(abilData => {
		var abil = abilData.abil = MyEnt.GetAbilityByName(abilData.abilName) || MyEnt.GetItemByName(abilData.abilName)
		return abil !== undefined && !abil.IsHidden && abil.CanBeCasted()
	}),
		zuus_passive = MyEnt.GetAbilityByName("zuus_static_field"),
		blink = MyEnt.GetItemByName("item_blink") || MyEnt.GetAbilityByName("antimage_blink"),
		targets: Unit[] = []
	if (kill_creeps.value)
		targets.push(...EntityManager.GetEntitiesByClass(Creep).filter(filter_func))
	if (kill_heroes.value)
		targets.push(...EntityManager.GetEntitiesByClass(Hero).filter(hero => !hero.IsIllusion && filter_func(hero)))
	availableAbils.some(abilData => {
		var abil = abilData?.abil,
			range = abilData.abilRadiusF ? abilData.abilRadiusF(abil!) : abil!.CastRange
		if (range > 0)
			range += 75
		return targets.some(ent => {
			if (
				ent.HasLinkenAtTime(abil!.CastPoint) ||
				(ent instanceof Creep && !BitsExtensions.HasMaskBigInt(abilData.targets, BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP))) ||
				(ent instanceof Hero && !BitsExtensions.HasMaskBigInt(abilData.targets, BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO)))
			)
				return false
			var needBlink = false
			if (range > 0)
				if (MyEnt.Distance2D(ent) > range)
					if (
						!blinkSleeper.Sleeping
						&& blink !== undefined
						&& blink.Cooldown === 0
						&& ent instanceof Hero
						&& MyEnt.Distance2D(ent) < range + blink.GetSpecialValue("blink_range")
					)
						needBlink = true
					else return false
			var damage = (abilData.abilDamageF || getDamage)(abil!, MyEnt, ent)
			if (zuus_passive !== undefined)
				damage += zuus_passive.GetSpecialValue("damage_health_pct") / 100 * ent.HP
			if (damage < GetHealthAfter(ent, abil!.CastPoint))
				return false

			let ping = GameState.Ping / 1000
			if (needBlink) {
				MyEnt.CastPosition(blink!, ent.Position.Extend(MyEnt.Position, range - 100), false)
				blinkSleeper.Sleep((blink!.CastPoint + ping) * 1000)
			} else {
				sleeper.Sleep(((abilData.abilDelayF ? abilData.abilDelayF(abil!, MyEnt, ent) + abil!.CastPoint : 0) + ping) * 1000, ent)
				if (abilData.abilCastF)
					abilData.abilCastF(abil!, MyEnt, ent)
				else
					MyEnt.UseSmartAbility(abil!, ent)
				scriptSleeper.Sleep((abil!.CastPoint + ping) * 1000)
			}

			return true
		})
	})
})
