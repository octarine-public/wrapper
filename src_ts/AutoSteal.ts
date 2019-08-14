import { Ability, ArrayExtensions, Creep, EntityManager, EventsSDK, Game, Hero, LocalPlayer, Modifier, Unit, Utils } from "wrapper/Imports"

var config: any = {
	enabled: false,
	kill_creeps: true,
	kill_heroes: true,
}

var abils: Array<{
	abilName: string | RegExp
	abil?: Ability
	targets: bigint
	abilRadiusF?: (abil: Ability) => number
	abilDelayF?: (abil: Ability, entFrom: Unit, entTo: Unit) => number
	abilDamageF?: (abil: Ability, entFrom: Unit, entTo: Unit) => number
	abilCastF?: (abil: Ability, entFrom: Unit, entTo: Unit) => void,
}> = [
		{
			abilName: "axe_culling_blade",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var killThreshold = abil.GetSpecialValue("kill_threshold"),
					damage = entTo.CalculateDamage(abil.GetSpecialValue("damage"), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
					hp = GetHealthAfter(entTo,abil.CastPoint)
				return hp > killThreshold ? damage * latest_spellamp : killThreshold
			},
		},
		{
			abilName: "necrolyte_reapers_scythe",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var DamagePerMissHP = abil.GetSpecialValue("damage_per_health"),
					delta = GetHealthAfter(entTo,3)
				return entTo.CalculateDamage((entTo.MaxHP - delta) * DamagePerMissHP, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "zuus_arc_lightning",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var arcDamage = abil.GetSpecialValue("arc_damage")+entFrom.GetTalentValue("special_bonus_unique_zeus_2")

				return entTo.CalculateDamage(arcDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
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
			abilDelayF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entFrom.Distance(entTo) / abil.GetSpecialValue("projectile_speed"),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entFrom.HasScepter ? 0 : entTo.CalculateDamage(abil.AbilityDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "visage_soul_assumption",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entFrom.Distance(entTo) / abil.GetSpecialValue("bolt_speed"),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var baseDamage = abil.GetSpecialValue("soul_base_damage"),
					stackDamage = abil.GetSpecialValue("soul_charge_damage")+entFrom.GetTalentValue("special_bonus_unique_visage_4"),
					stackBuff = entFrom.GetBuffByName("modifier_visage_soul_assumption"),
					stackBuffDamage = stackBuff ? stackBuff.StackCount * stackDamage : 0
				return entTo.CalculateDamage((baseDamage + stackBuffDamage) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "rubick_fade_bolt",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "phantom_assassin_stifling_dagger",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP),
			abilDelayF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entFrom.Distance(entTo) / abil.GetSpecialValue("dagger_speed"),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entTo.CalculateDamage(abil.GetSpecialValue("base_damage"), DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL, entFrom) + ((1 + abil.GetSpecialValue("attack_factor") / 100) * entFrom.AttackDamage(entTo)),
		},
		{
			abilName: "tinker_laser",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var laserDamage = abil.GetSpecialValue("laser_damage")+entFrom.GetTalentValue("special_bonus_unique_tinker")
				return entTo.CalculateDamage(laserDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_PURE, entFrom)
			},
		},
		{
			abilName: "antimage_mana_void",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entTo.CalculateDamage(abil.GetSpecialValue("mana_void_damage_per_mana") * (entTo.MaxMana - entTo.Mana) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "puck_waning_rift",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilRadiusF: abil => abil.GetSpecialValue("radius") / 2 - 25,
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var damage = abil.GetSpecialValue("damage")+entFrom.GetTalentValue("special_bonus_unique_puck_4")

				return entTo.CalculateDamage(damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "brewmaster_thunder_clap",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilRadiusF: abil => abil.GetSpecialValue("radius") / 2 - 25,
		},
		{
			abilName: "obsidian_destroyer_astral_imprisonment",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entTo.CalculateDamage(abil.GetSpecialValue("damage") * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_PURE, entFrom) - Math.min(abil.GetSpecialValue("prison_duration") * entTo.HPRegen * 30 + 1, entTo.MaxHP - entTo.HP),
		},
		{
			abilName: /item_dagon/,
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entTo.CalculateDamage(abil.GetSpecialValue("damage") * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "bristleback_quill_spray",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP),
			abilRadiusF: abil => abil.GetSpecialValue("radius"),
			abilDelayF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entFrom.Distance(entTo) / abil.GetSpecialValue("projectile_speed"),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var baseDamage = abil.GetSpecialValue("quill_base_damage"),
					stackDamage = abil.GetSpecialValue("quill_stack_damage")+entFrom.GetTalentValue("special_bonus_unique_bristleback_2"),
					maxDamage = abil.GetSpecialValue("max_damage"),
					stackBuff = entTo.GetBuffByName("modifier_bristleback_quill_spray"),
					stackBuffDamage = stackBuff ? stackBuff.StackCount * stackDamage : 0
				return entTo.CalculateDamage(Math.min(maxDamage, baseDamage + stackBuffDamage) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL, entFrom)
			},
		},
		{
			abilName: "luna_lucent_beam",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var beamDamage = abil.GetSpecialValue("beam_damage")+entFrom.GetTalentValue("special_bonus_unique_luna_1")

				return entTo.CalculateDamage(beamDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "alchemist_unstable_concoction",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var maxDamage = abil.GetSpecialValue("max_damage")+entFrom.GetTalentValue("special_bonus_unique_alchemist_2")

				return entTo.CalculateDamage(maxDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL, entFrom)
			},
		},
		{
			abilName: "alchemist_unstable_concoction_throw",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var maxDamage = abil.GetSpecialValue("max_damage") + entFrom.GetTalentValue("special_bonus_unique_alchemist_2"),
					brewTime = abil.GetSpecialValue("brew_time"),
					brewExplosion = abil.GetSpecialValue("brew_explosion"),
					minStun = abil.GetSpecialValue("min_stun"),
					modifierName = "modifier_alchemist_unstable_concoction"
				var buffs: Modifier[] = entFrom.Buffs.filter(buff_ => buff_.Name === modifierName),
					buff: Modifier
				if (buffs.length > 0)
					buff = buffs[0]
				else
					return 0
				var elapsed = Math.min(buff.DieTime - Game.GameTime, brewTime) - minStun,
					charged = Math.max(elapsed, 0) / brewTime
				if (buff.DieTime - Game.GameTime > brewExplosion - (abil.CastPoint + 1.5 / 30))
					return 99999999 // we don't need to be self-stunned, ye?

				return entTo.CalculateDamage(charged * maxDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL, entFrom)
			},
		},
		{
			abilName: "abaddon_death_coil",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var targetDamage = abil.GetSpecialValue("target_damage")+entFrom.GetTalentValue("special_bonus_unique_abaddon_2")

				return entTo.CalculateDamage(targetDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "bounty_hunter_shuriken_toss",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entFrom.Distance(entTo) / abil.GetSpecialValue("speed"),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var damage = abil.GetSpecialValue("bonus_damage")+entFrom.GetTalentValue("special_bonus_unique_bounty_hunter_2")

				return entTo.CalculateDamage(damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "ogre_magi_fireblast",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var fireblastDamage = abil.GetSpecialValue("fireblast_damage") + entFrom.GetTalentValue("special_bonus_unique_ogre_magi_2")

				return entTo.CalculateDamage(fireblastDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "ogre_magi_unrefined_fireblast",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entTo.CalculateDamage(abil.GetSpecialValue("fireblast_damage") * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "undying_soul_rip",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entTo.CalculateDamage (
				abil.GetSpecialValue("damage_per_unit")
				* Math.min (
					EntityManager.GetEntitiesInRange(entTo.NetworkPosition,abil.GetSpecialValue("radius"),ent =>
						ent instanceof Unit && (ent.IsCreep || ent.IsHero) && !ent.IsEnemy(entFrom),
					).length,
					abil.GetSpecialValue("max_units"),
				) * latest_spellamp,
				DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
				entFrom,
			),
		},
		{
			abilName: "queenofpain_scream_of_pain",
			abilRadiusF: abil => abil.GetSpecialValue("area_of_effect") / 2 - 25,
			abilDelayF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entFrom.Distance(entTo) / abil.GetSpecialValue("projectile_speed"),
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "leshrac_lightning_storm",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "tusk_walrus_punch",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var critMultiplier = abil.GetSpecialValue("crit_multiplier")+entFrom.GetTalentValue("special_bonus_unique_tusk")

				return entFrom.AttackDamage(entTo) * critMultiplier / 100
			},
		},
		{
			abilName: "centaur_double_edge",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var edgeDamage = abil.GetSpecialValue("edge_damage")+entFrom.GetTalentValue("special_bonus_unique_centaur_4")

				return entTo.CalculateDamage(edgeDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "legion_commander_duel",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entFrom.AttackDamage(entTo) * 2 - 1,
		}, /*
		{
			abilName: "legion_commander_overwhelming_odds",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				const ents = entTo.AbsOrigin.GetEntitiesInRange(abil.GetSpecialValue("radius")),
					creeps = ents.filter(ent => ent.IsCreep && ent.IsEnemy),
					heroes = ents.filter(ent => ent.IsHero && ent.IsEnemy)
				return Utils.CalculateDamage(entTo, (abil.GetSpecialValue("damage") * heroes.length + abil.GetSpecialValue("damage_per_unit") * creeps.length) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			}
		},*/
		{
			abilName: "broodmother_spawn_spiderlings",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entFrom.Distance(entTo) / abil.GetSpecialValue("projectile_speed"),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var damage = abil.GetSpecialValue("damage")+entFrom.GetTalentValue("special_bonus_unique_broodmother_3")

				return entTo.CalculateDamage(damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "crystal_maiden_crystal_nova",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var damage = abil.GetSpecialValue("nova_damage")+entFrom.GetTalentValue("special_bonus_unique_crystal_maiden_2")

				return entTo.CalculateDamage(damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "shadow_shaman_ether_shock",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var damage = abil.GetSpecialValue("damage")+entFrom.GetTalentValue("special_bonus_unique_shadow_shaman_3")

				return entTo.CalculateDamage(damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "undying_decay",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entTo.CalculateDamage(abil.GetSpecialValue("decay_damage") * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "oracle_purifying_flames",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP),
		},
		{
			abilName: "lion_impale",
			abilDelayF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entFrom.Distance(entTo) / abil.GetSpecialValue("speed"),
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "lion_finger_of_death",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: abil => abil.GetSpecialValue("damage_delay"),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var damage = abil.GetSpecialValue("damage" + (entFrom.HasScepter ? "_scepter" : ""))+entFrom.GetTalentValue("special_bonus_unique_lion_3"),
					buff = entFrom.GetBuffByName("modifier_lion_finger_of_death_kill_counter")
				if (buff)
					damage += buff.StackCount * abil.GetSpecialValue("damage_per_kill")

				return entTo.CalculateDamage(damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "lina_laguna_blade",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: abil => abil.GetSpecialValue("damage_delay"),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entTo.CalculateDamage(abil.GetSpecialValue("damage") * latest_spellamp, entFrom.HasScepter ? DAMAGE_TYPES.DAMAGE_TYPE_PURE : DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "pudge_dismember",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entTo.CalculateDamage(abil.GetSpecialValue("dismember_damage") * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
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
			abilDelayF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entFrom.Distance(entTo) / abil.GetSpecialValue("lance_speed"),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				var lanceDamage = abil.GetSpecialValue("lance_damage")+entFrom.GetTalentValue("special_bonus_unique_phantom_lancer_2")

				return entTo.CalculateDamage(lanceDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "skeleton_king_hellfire_blast",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entFrom.Distance(entTo) / abil.GetSpecialValue("blast_speed"),
		},
		{
			abilName: "sven_storm_bolt",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entFrom.Distance(entTo) / abil.GetSpecialValue("bolt_speed"),
		},
		/*{
			abilName: "storm_spirit_ball_lightning",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => Abilities.GetCastPoint(abil) + entFrom.Distance(entTo) / abil.GetSpecialValue("ball_lightning_move_speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
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
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entTo.CalculateDamage(abil.GetSpecialValue("damage" + (entFrom.HasScepter ? "_scepter" : "")) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "beastmaster_primal_roar",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "sandking_burrowstrike",
			abilDelayF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entFrom.Distance(entTo) / abil.GetSpecialValue("burrow_speed" + (entFrom.HasScepter ? "_scepter" : "")),
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "centaur_double_edge",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entTo.CalculateDamage((abil.GetSpecialValue("edge_damage") + [0.6, 0.8, 1, 1.2][abil.Level] * (entFrom as Hero).TotalStrength) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{ // TODO: improved magresist calculation
			abilName: "item_ethereal_blade",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entFrom.Distance(entTo) / abil.GetSpecialValue("projectile_speed"),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entTo.CalculateDamage((abil.GetSpecialValue("blast_damage_base") + abil.GetSpecialValue("blast_agility_multiplier") * (entFrom as Hero).TotalAgility) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "morphling_adaptive_strike_agi",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: Ability, entFrom: Unit, entTo: Unit): number => entFrom.Distance(entTo) / abil.GetSpecialValue("projectile_speed"),
			abilDamageF: (abil: Ability, entFrom: Unit, entTo: Unit): number => {
				const base = abil.GetSpecialValue("damage_base"),
					min_mul = abil.GetSpecialValue("damage_min")
				const mul = abil.GetSpecialValue("damage_max") - min_mul,
					agi = (entFrom as Hero).TotalAgility
				return entTo.CalculateDamage(base + (min_mul + mul * (agi / (entFrom as Hero).TotalStrength)) * agi * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		// TODO: mars_gods_rebuke
	],
	flag: boolean = false,
	NoTarget: Unit[] = [],
	possibleTargets: Unit[] = [],
	blinkFlag: boolean = false,
	latest_spellamp: number = 1

function GetAvailableAbils() {
	var MyEnt = LocalPlayer.Hero
	return abils.filter (
		abilData => abilData.abilName instanceof RegExp
		|| abilData.abilName.startsWith("item_")
			|| MyEnt.GetAbilityByName(abilData.abilName) !== undefined,
	)
}

function getDamage(abil: Ability, entFrom: Unit, entTo: Unit): number {
	return entTo.CalculateDamage((abil.AbilityDamage || abil.GetSpecialValue("damage")) * latest_spellamp, abil.DamageType, entFrom)
}

function OnTick(): void {
	/*// attack sanitizer
	let time = GameRules.GameTime
	// loop-optimizer: KEEP
	attacks = attacks.filter(([end_time, end_time_2, attack_target]) => time - end_time_2 <= Unit.melee_end_time_delta)
	// loop-optimizer: KEEP
	attacks.forEach((data, attacker_id) => data[2] = FindAttackingUnit((EntityManager.EntityByIndex(attacker_id) as Unit)))*/
	if (!config.enabled)
		return

	var MyEnt = LocalPlayer.Hero/*,
		selectedHero = /^npc_dota_hero_(.*)$/.exec(MyEnt.UnitName)[1]*/
	if (MyEnt === undefined || MyEnt.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_STUNNED) || !MyEnt.IsAlive || flag || LocalPlayer.ActiveAbility !== undefined/* || (MyEnt.CanBeVisible && selectedHero !== "riki" && selectedHero !== "treant_protector")*/)
		return
	latest_spellamp = 1 + MyEnt.SpellAmplification
	{
		let bs_buff = MyEnt.GetBuffByName("modifier_bloodseeker_bloodrage")
		if (bs_buff !== undefined)
			latest_spellamp *= bs_buff.Ability.GetSpecialValue("damage_increase_pct") / 100
	}
	var availableAbils = GetAvailableAbils().filter(abilData => {
			var abil = abilData.abil = MyEnt.GetAbilityByName(abilData.abilName) || MyEnt.GetItemByName(abilData.abilName)
			return abil !== undefined && !abil.IsHidden && abil.CanBeCasted()
		}),
		zuus_passive = MyEnt.GetAbilityByName("zuus_static_field"),
		zuus_talent = MyEnt.GetTalentValue("special_bonus_unique_zeus"),
		blink = MyEnt.GetItemByName("item_blink") || MyEnt.GetAbilityByName("antimage_blink"),
		targets = possibleTargets.filter(ent =>
			ent.IsVisible &&
			!ent.IsWaitingToSpawn &&
			ent.IsAlive &&
			(!ent.IsCreep || config.kill_creeps) &&
			(!ent.IsHero || config.kill_heroes) &&
			NoTarget.indexOf(ent) === -1,
		)
	availableAbils.some(abilData => {
		var abil = abilData.abil,
			range = abilData.abilRadiusF ? abilData.abilRadiusF(abil) : abil.CastRange
		if (range > 0)
			range += 75
		return targets.some(ent => {
			if (
				ent.HasLinkenAtTime(abil.CastPoint) ||
				(ent.IsCreep && !Utils.HasMaskBigInt(abilData.targets, BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP))) ||
				(ent.IsHero && !Utils.HasMaskBigInt(abilData.targets, BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO)))
			)
				return false
			var needBlink = false
			if (range > 0)
				if (MyEnt.Distance2D(ent) > range)
					if (
						!blinkFlag
						&& blink !== undefined
						&& blink.Cooldown === 0
						&& ent.IsHero
						&& MyEnt.Distance2D(ent) < range + blink.GetSpecialValue("blink_range")
					)
						needBlink = true
					else return false
			var damage = (abilData.abilDamageF || getDamage)(abil, MyEnt, ent)
			if (zuus_passive !== undefined)
				damage += (abil.GetSpecialValue("damage_health_pct") + zuus_talent) / 100 * ent.HP
			if (damage < GetHealthAfter(ent, abil.CastPoint))
				return false

			let ping = GetAvgLatency(Flow_t.IN) + GetAvgLatency(Flow_t.OUT)
			if ((blinkFlag = !(flag = !needBlink))) { // tslint:disable-line:no-conditional-assignment
				MyEnt.CastPosition(blink, ent.NetworkPosition.Extend(MyEnt.NetworkPosition, range - 100), false)
				setTimeout(() => blinkFlag = false,(blink.CastPoint + ping) * 1000)
			} else {
				NoTarget.push(ent)
				setTimeout (
					() => NoTarget.splice(NoTarget.indexOf(ent), 1),
					((abilData.abilDelayF ? abilData.abilDelayF(abil, MyEnt, ent) + abil.CastPoint : 0) + ping) * 1000,
				)
				if (abilData.abilCastF)
					abilData.abilCastF(abil, MyEnt, ent)
				else
					MyEnt.UseSmartAbility(abil,ent)
				setTimeout (() => flag = false,(abil.CastPoint + ping) * 1000)
			}

			return true
		})
	})
}

EventsSDK.on("EntityCreated", (npc: Unit) => {
	if (LocalPlayer === undefined)
		return
	if (
		npc.IsEnemy()
		&& (
			npc instanceof Creep
			|| (
				npc instanceof Hero && !npc.IsIllusion
			)
		)
	)
		possibleTargets.push(npc)
})
EventsSDK.on("Tick", OnTick)

{
	let root = new Menu_Node("AutoSteal")
	root.entries.push(new Menu_Toggle (
		"State",
		config.enabled,
		node => config.enabled = node.value,
	))
	root.entries.push(new Menu_Boolean (
		"Kill creeps",
		config.kill_creeps,
		node => config.kill_creeps = node.value,
	))
	root.entries.push(new Menu_Boolean (
		"Kill heroes",
		config.kill_heroes,
		node => config.kill_heroes = node.value,
	))
	root.Update()
	Menu.AddEntry(root)
}

/*function FindAttackingUnit(unit: Unit): Unit {
	if (!config.enabled)
		return
	if (unit === undefined)
		return undefined
	let is_default_creep = unit.IsCreep && !unit.IsControllableByAnyPlayer
	return ArrayExtensions.orderBy(EntityManager.AllEntities.filter(npc_ => {
		if (npc_ === unit || !(npc_ instanceof Unit))
			return false
		let npc_pos = npc_.NetworkPosition
		return (
			unit.Distance2D(npc_) <= (unit.AttackRange + unit.HullRadius + npc_.HullRadius) &&
			!unit.IsUnitStateFlagSet(modifierstate.MODIFIER_STATE_INVULNERABLE) &&
			unit.IsInside(npc_pos, npc_.HullRadius) &&
			(unit.IsEnemy(npc_) || (!is_default_creep && npc_.IsDeniable))
		)
	}), ent => unit.GetAngle(ent.NetworkPosition))[0] as Unit
}*/
function GetHealthAfter(unit: Unit, delay: number/*, include_projectiles: boolean = false, attacker?: Unit, melee_time_offset: number = 0*/): number {
	// let cur_time = Game.GameTime,
	let hpafter = unit.HP
	/*// loop-optimizer: KEEP
	attacks.forEach((data, attacker_id) => {
		let attacker_ent = EntityManager.EntityByIndex(attacker_id) as Unit,
			[end_time, end_time_2, attack_target] = data
		if (attacker_ent !== attacker && attack_target === unit) {
			let end_time_delta = end_time - (cur_time + delay + melee_time_offset),
				dmg = attacker_ent.AttackDamage(unit)
			if (end_time_delta <= 0 && end_time_delta >= -Unit.melee_end_time_delta)
				hpafter -= dmg
			let end_time_2_delta = end_time_2 - (cur_time + delay + melee_time_offset)
			if (end_time_2_delta <= 0 && end_time_2_delta >= -Unit.melee_end_time_delta)
				hpafter -= dmg
		}
	})
	if (include_projectiles)
		Projectiles.GetAllTracking().forEach(proj => {
			let source = proj.m_hSource
			if (proj.m_hTarget === this && source !== undefined && proj.m_bIsAttack && !proj.m_bIsEvaded && (proj.m_vecPosition.Distance(proj.m_vecTarget) / proj.m_iSpeed) <= delay)
				hpafter -= this.AttackDamage(source)
		})*/
	return Math.min(hpafter + unit.HPRegen * delay, unit.MaxHP)
}
// let attacks: Array<[number, number, Unit]> = [];
EventsSDK.on("EntityDestroyed",(unit, unit_id) => {
	if (!config.enabled)
		return
	if (unit instanceof Unit)
		ArrayExtensions.arrayRemove(possibleTargets, unit)
	// attacks = attacks.filter((data, attacker_id) => attacker_id !== unit_id && data!==undefined && data[2] !== unit)
})
/*EventsSDK.on("UnitAnimation", (npc, sequenceVariant, playbackrate, castpoint, type, activity) => {
	if (!config.enabled)
		return
	if (activity === 1503 && !npc.HasAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK)) {
		let delay = (1 / npc.AttacksPerSecond) - 0.06
		attacks[npc.Index] = [
			Game.GameTime + delay,
			npc.IsCreep ? Game.GameTime + delay * 2 + 0.06 : Number.MAX_VALUE,
			FindAttackingUnit(npc),
		]
		// console.log(attacks[npc.Index])
		// console.log(attacks[npc.Index][2])
	}
})
EventsSDK.on("UnitAnimationEnd", npc => {
	if (!config.enabled)
		return
	let id = npc.Index,
	found = attacks[id]
	if (found === undefined)
		return
	let [end_time, end_time_2, attack_target] = found
	if (attack_target === undefined || !npc.IsCreep || npc.IsControllableByAnyPlayer || !attack_target.IsValid || !attack_target.IsAlive || !attack_target.IsVisible) {
		delete attacks[id]
		return
	}
	let delay = (1 / npc.AttacksPerSecond) + 0.06
	attacks[id] = [
		Game.GameTime + delay,
		Game.GameTime + delay * 2 - 0.06,
		attack_target,
	]
})*/
EventsSDK.on("GameEnded", () => {
	// attacks = []
	possibleTargets = []
})
