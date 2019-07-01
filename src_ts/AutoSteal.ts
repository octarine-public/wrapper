import * as Orders from "Orders"
import * as Utils from "Utils"

var config: any = {
	enabled: false,
	kill_creeps: true,
	kill_heroes: true,
}

var abils: Array<{
	abilName: string | RegExp
	targets: bigint
	abilRadiusF?: (abil: C_DOTABaseAbility) => number
	abilDelayF?: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC) => number
	abilDamageF?: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC) => number
	abilCastF?: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC) => void,
}> = [
		{
			abilName: "axe_culling_blade",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var killThreshold = abil.GetSpecialValue("kill_threshold"),
					damage = Utils.CalculateDamage(entTo, abil.GetSpecialValue("damage"), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
					hp = Utils.GetHealthAfter(entTo, abil.m_fCastPoint, false, entFrom)
				return hp > killThreshold ? damage * latest_spellamp : killThreshold
			},
		},
		{
			abilName: "necrolyte_reapers_scythe",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var DamagePerMissHP = abil.GetSpecialValue("damage_per_health"),
					delta = Utils.GetHealthAfter(entTo, 3)
				return Utils.CalculateDamage(entTo, (entTo.m_iMaxHealth - delta) * DamagePerMissHP, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "zuus_arc_lightning",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var arcDamage = abil.GetSpecialValue("arc_damage"),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_zeus_2")
				if (talent && talent.m_iLevel > 0)
					arcDamage += talent.GetSpecialValue("value")

				return Utils.CalculateDamage(entTo, arcDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
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
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.m_vecNetworkOrigin.Distance(entTo.m_vecNetworkOrigin) / abil.GetSpecialValue("projectile_speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => Utils.HasScepter(entFrom) ? 0 : Utils.CalculateDamage(entTo, abil.m_iAbilityDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "visage_soul_assumption",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.m_vecNetworkOrigin.Distance(entTo.m_vecNetworkOrigin) / abil.GetSpecialValue("bolt_speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var baseDamage = abil.GetSpecialValue("soul_base_damage"),
					stackDamage = abil.GetSpecialValue("soul_charge_damage"),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_visage_4")
				if (talent && talent.m_iLevel > 0)
					stackDamage += talent.GetSpecialValue("value")
				var stackBuff = Utils.GetBuffByName(entFrom, "modifier_visage_soul_assumption"),
					stackBuffDamage = stackBuff ? stackBuff.m_iStackCount * stackDamage : 0
				return Utils.CalculateDamage(entTo, (baseDamage + stackBuffDamage) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "rubick_fade_bolt",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "phantom_assassin_stifling_dagger",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP),
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.m_vecNetworkOrigin.Distance(entTo.m_vecNetworkOrigin) / abil.GetSpecialValue("dagger_speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => Utils.CalculateDamage(entTo, abil.GetSpecialValue("base_damage"), DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL, entFrom) + ((1 + abil.GetSpecialValue("attack_factor") / 100) * Utils.CalculateDamageByHand(entTo, entFrom)),
		},
		{
			abilName: "tinker_laser",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var laserDamage = abil.GetSpecialValue("laser_damage"),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_tinker")
				if (talent && talent.m_iLevel > 0)
					laserDamage += talent.GetSpecialValue("value")

				return Utils.CalculateDamage(entTo, laserDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_PURE, entFrom)
			},
		},
		{
			abilName: "antimage_mana_void",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => Utils.CalculateDamage(entTo, abil.GetSpecialValue("mana_void_damage_per_mana") * (entTo.m_flMaxMana - entTo.m_flMana) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "puck_waning_rift",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilRadiusF: abil => abil.GetSpecialValue("radius") / 2 - 25,
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var damage = abil.GetSpecialValue("damage"),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_puck_4")
				if (talent && talent.m_iLevel > 0)
					damage += talent.GetSpecialValue("value")

				return Utils.CalculateDamage(entTo, damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
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
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => Utils.CalculateDamage(entTo, abil.GetSpecialValue("damage") * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_PURE, entFrom) - Math.min(abil.GetSpecialValue("prison_duration") * entTo.m_flHealthThinkRegen * 30 + 1, entTo.m_iMaxHealth - entTo.m_iHealth),
		},
		{
			abilName: /item_dagon/,
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => Utils.CalculateDamage(entTo, abil.GetSpecialValue("damage") * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "bristleback_quill_spray",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP),
			abilRadiusF: abil => abil.GetSpecialValue("radius"),
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.m_vecNetworkOrigin.Distance(entTo.m_vecNetworkOrigin) / abil.GetSpecialValue("projectile_speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var baseDamage = abil.GetSpecialValue("quill_base_damage"),
					stackDamage = abil.GetSpecialValue("quill_stack_damage"),
					maxDamage = abil.GetSpecialValue("max_damage"),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_bristleback_2")
				if (talent && talent.m_iLevel > 0)
					stackDamage += talent.GetSpecialValue("value")
				var stackBuff = Utils.GetBuffByName(entTo, "modifier_bristleback_quill_spray"),
					stackBuffDamage = stackBuff ? stackBuff.m_iStackCount * stackDamage : 0
				return Utils.CalculateDamage(entTo, Math.min(maxDamage, baseDamage + stackBuffDamage) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL, entFrom)
			},
		},
		{
			abilName: "luna_lucent_beam",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var beamDamage = abil.GetSpecialValue("beam_damage"),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_luna_1")
				if (talent && talent.m_iLevel > 0)
					beamDamage += talent.GetSpecialValue("value")

				return Utils.CalculateDamage(entTo, beamDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "alchemist_unstable_concoction",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var maxDamage = abil.GetSpecialValue("max_damage"),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_alchemist_2")
				if (talent && talent.m_iLevel > 0)
					maxDamage += talent.GetSpecialValue("value")

				return Utils.CalculateDamage(entTo, maxDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL, entFrom)
			},
		},
		{
			abilName: "alchemist_unstable_concoction_throw",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var maxDamage = abil.GetSpecialValue("max_damage"),
					brewTime = abil.GetSpecialValue("brew_time"),
					brewExplosion = abil.GetSpecialValue("brew_explosion"),
					minStun = abil.GetSpecialValue("min_stun"),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_alchemist_2"),
					modifierName = "modifier_alchemist_unstable_concoction"
				if (talent && talent.m_iLevel > 0)
					maxDamage += talent.GetSpecialValue("value")
				var buffs: CDOTA_Buff[] = entFrom.m_ModifierManager.m_vecBuffs.filter(buff_ => buff_.m_name === modifierName),
					buff: CDOTA_Buff
				if (buffs.length > 0)
					buff = buffs[0]
				else
					return 0
				var elapsed = Math.min(buff.m_flDieTime - GameRules.m_fGameTime, brewTime) - minStun,
					charged = Math.max(elapsed, 0) / brewTime
				if (buff.m_flDieTime - GameRules.m_fGameTime > brewExplosion - (abil.m_fCastPoint + 1.5 / 30))
					return 99999999 // we don't need to be self-stunned, ye?

				return Utils.CalculateDamage(entTo, charged * maxDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL, entFrom)
			},
		},
		{
			abilName: "abaddon_death_coil",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var targetDamage = abil.GetSpecialValue("target_damage"),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_abaddon_2")
				if (talent && talent.m_iLevel > 0)
					targetDamage += talent.GetSpecialValue("value")

				return Utils.CalculateDamage(entTo, targetDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "bounty_hunter_shuriken_toss",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.m_vecNetworkOrigin.Distance(entTo.m_vecNetworkOrigin) / abil.GetSpecialValue("speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var damage = abil.GetSpecialValue("bonus_damage"),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_bounty_hunter_2")
				if (talent && talent.m_iLevel > 0)
					damage += talent.GetSpecialValue("value")

				return Utils.CalculateDamage(entTo, damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "ogre_magi_fireblast",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var fireblastDamage = abil.GetSpecialValue("fireblast_damage"),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_ogre_magi_2")
				if (talent && talent.m_iLevel > 0)
					fireblastDamage += talent.GetSpecialValue("value")

				return Utils.CalculateDamage(entTo, fireblastDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "ogre_magi_unrefined_fireblast",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => Utils.CalculateDamage(entTo, abil.GetSpecialValue("fireblast_damage") * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "undying_soul_rip",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => Utils.CalculateDamage (
				entTo,
				abil.GetSpecialValue("damage_per_unit")
				* Math.min (
					entTo.m_vecNetworkOrigin.GetEntitiesInRange(abil.GetSpecialValue("radius")).filter(ent =>
						ent instanceof C_DOTA_BaseNPC && (Utils.IsCreep(ent) || Utils.IsHero(ent)) && !Utils.IsEnemy(ent, entFrom),
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
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.m_vecNetworkOrigin.Distance(entTo.m_vecNetworkOrigin) / abil.GetSpecialValue("projectile_speed"),
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "leshrac_lightning_storm",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "tusk_walrus_punch",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var critMultiplier = abil.GetSpecialValue("crit_multiplier"),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_tusk")
				if (talent && talent.m_iLevel > 0)
					critMultiplier += talent.GetSpecialValue("value")

				return Utils.CalculateDamageByHand(entTo, entFrom) * critMultiplier / 100
			},
		},
		{
			abilName: "centaur_double_edge",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var edgeDamage = abil.GetSpecialValue("edge_damage"),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_centaur_4")
				if (talent && talent.m_iLevel > 0)
					edgeDamage += talent.GetSpecialValue("value")

				return Utils.CalculateDamage(entTo, edgeDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "legion_commander_duel",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => Utils.CalculateDamageByHand(entTo, entFrom) * 2 - 1,
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
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.m_vecNetworkOrigin.Distance(entTo.m_vecNetworkOrigin) / abil.GetSpecialValue("projectile_speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var damage = abil.GetSpecialValue("damage"),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_broodmother_3")
				if (talent && talent.m_iLevel > 0)
					damage += talent.GetSpecialValue("value")

				return Utils.CalculateDamage(entTo, damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "crystal_maiden_crystal_nova",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var damage = abil.GetSpecialValue("nova_damage"),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_crystal_maiden_2")
				if (talent && talent.m_iLevel > 0)
					damage += talent.GetSpecialValue("value")

				return Utils.CalculateDamage(entTo, damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "shadow_shaman_ether_shock",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var damage = abil.GetSpecialValue("damage"),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_shadow_shaman_3")
				if (talent && talent.m_iLevel > 0)
					damage += talent.GetSpecialValue("value")

				return Utils.CalculateDamage(entTo, damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "undying_decay",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => Utils.CalculateDamage(entTo, abil.GetSpecialValue("decay_damage") * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "oracle_purifying_flames",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP),
		},
		{
			abilName: "lion_impale",
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.m_vecNetworkOrigin.Distance(entTo.m_vecNetworkOrigin) / abil.GetSpecialValue("speed"),
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "lion_finger_of_death",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: abil => abil.GetSpecialValue("damage_delay"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var damage = abil.GetSpecialValue("damage" + (Utils.HasScepter(entFrom) ? "_scepter" : "")),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_lion_3"),
					buff = Utils.GetBuffByName(entFrom, "modifier_lion_finger_of_death_kill_counter")
				if (talent && talent.m_iLevel > 0)
					damage += talent.GetSpecialValue("value")
				if (buff)
					damage += buff.m_iStackCount * abil.GetSpecialValue("damage_per_kill")

				return Utils.CalculateDamage(entTo, damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "lina_laguna_blade",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: abil => abil.GetSpecialValue("damage_delay"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => Utils.CalculateDamage(entTo, abil.GetSpecialValue("damage") * latest_spellamp, Utils.HasScepter(entFrom) ? DAMAGE_TYPES.DAMAGE_TYPE_PURE : DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "pudge_dismember",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => Utils.CalculateDamage(entTo, abil.GetSpecialValue("dismember_damage") * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
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
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.m_vecNetworkOrigin.Distance(entTo.m_vecNetworkOrigin) / abil.GetSpecialValue("lance_speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var lanceDamage = abil.GetSpecialValue("lance_damage"),
					talent = Utils.GetAbilityByName(entFrom, "special_bonus_unique_phantom_lancer_2")
				if (talent && talent.m_iLevel > 0)
					lanceDamage += talent.GetSpecialValue("value")

				return Utils.CalculateDamage(entTo, lanceDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "skeleton_king_hellfire_blast",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.m_vecNetworkOrigin.Distance(entTo.m_vecNetworkOrigin) / abil.GetSpecialValue("blast_speed"),
		},
		{
			abilName: "sven_storm_bolt",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.m_vecNetworkOrigin.Distance(entTo.m_vecNetworkOrigin) / abil.GetSpecialValue("bolt_speed"),
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
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => Utils.CalculateDamage(entTo, abil.GetSpecialValue("damage" + (Utils.HasScepter(entFrom) ? "_scepter" : "")) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "beastmaster_primal_roar",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "sandking_burrowstrike",
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.m_vecNetworkOrigin.Distance(entTo.m_vecNetworkOrigin) / abil.GetSpecialValue("burrow_speed" + (Utils.HasScepter(entFrom) ? "_scepter" : "")),
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "centaur_double_edge",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => Utils.CalculateDamage(entTo, (abil.GetSpecialValue("edge_damage") + [0.6, 0.8, 1, 1.2][abil.m_iLevel] * (entFrom as C_DOTA_BaseNPC_Hero).m_flStrengthTotal) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{ // TODO: improved magresist calculation
			abilName: "item_ethereal_blade",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.m_vecNetworkOrigin.Distance(entTo.m_vecNetworkOrigin) / abil.GetSpecialValue("projectile_speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => Utils.CalculateDamage(entTo, (abil.GetSpecialValue("blast_damage_base") + abil.GetSpecialValue("blast_agility_multiplier") * (entFrom as C_DOTA_BaseNPC_Hero).m_flAgilityTotal) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "morphling_adaptive_strike_agi",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.m_vecNetworkOrigin.Distance(entTo.m_vecNetworkOrigin) / abil.GetSpecialValue("projectile_speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				const base = abil.GetSpecialValue("damage_base"),
					min_mul = abil.GetSpecialValue("damage_min")
				const mul = abil.GetSpecialValue("damage_max") - min_mul,
					agi = (entFrom as C_DOTA_BaseNPC_Hero).m_flAgilityTotal
				return Utils.CalculateDamage(entTo, base + (min_mul + mul * (agi / (entFrom as C_DOTA_BaseNPC_Hero).m_flStrengthTotal)) * agi * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		}
		// TODO: mars_gods_rebuke
	],
	flag: boolean = false,
	NoTarget: C_DOTA_BaseNPC[] = [],
	possibleTargets: C_DOTA_BaseNPC[] = [],
	blinkFlag: boolean = false,
	latest_spellamp: number = 1

function GetAvailableAbils() {
	var MyEnt = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC_Hero
	return abils.filter (
		abilData => abilData.abilName instanceof RegExp
		|| abilData.abilName.startsWith("item_")
			|| Utils.GetAbilityByName(MyEnt, abilData.abilName) !== undefined,
	)
}

function getDamage(abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number {
	return Utils.CalculateDamage(entTo, (abil.m_iAbilityDamage || abil.GetSpecialValue("damage")) * latest_spellamp, abil.m_pAbilityData.m_iAbilityDamageType, entFrom)
}

function OnTick(): void {
	if (!config.enabled)
		return

	var MyEnt = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC_Hero/*,
		selectedHero = /^npc_dota_hero_(.*)$/.exec(MyEnt.UnitName)[1]*/
	if (MyEnt === undefined || Utils.IsUnitStateFlagSet(MyEnt, modifierstate.MODIFIER_STATE_STUNNED) || !Utils.IsAlive(MyEnt) || flag || LocalDOTAPlayer.m_hActiveAbility !== undefined/* || (MyEnt.CanBeVisible && selectedHero !== "riki" && selectedHero !== "treant_protector")*/)
		return
	latest_spellamp = Utils.SpellAmplification(MyEnt) / 100
	{
		let bs_buff = Utils.GetBuffByName(MyEnt, "modifier_bloodseeker_bloodrage")
		if (bs_buff !== undefined)
			latest_spellamp *= (bs_buff.m_hAbility as C_DOTABaseAbility).GetSpecialValue("damage_increase_pct") / 100
	}
	var availableAbils = GetAvailableAbils().filter(abilData => {
			var abil = (abilData as any).abil = abilData.abilName instanceof RegExp ? Utils.GetItemByRegexp(MyEnt, abilData.abilName) : Utils.GetAbilityByName(MyEnt, abilData.abilName) || Utils.GetItemByName(MyEnt, abilData.abilName)
			return abil !== undefined && abil.m_iLevel !== 0 && !abil.m_bHidden && abil.m_fCooldown === 0 && Utils.IsManaEnough(MyEnt, abil)
		}),
		zuus_passive = Utils.GetAbilityByName(MyEnt, "zuus_static_field"),
		zuus_talent = Utils.GetAbilityByName(MyEnt, "special_bonus_unique_zeus"),
		blink = Utils.GetItemByName(MyEnt, "item_blink") || Utils.GetAbilityByName(MyEnt, "antimage_blink"),
		targets = possibleTargets.filter(ent =>
			Utils.IsVisible(ent) &&
			!ent.m_bIsWaitingToSpawn &&
			Utils.IsAlive(ent) &&
			(!Utils.IsCreep(ent) || config.kill_creeps) &&
			(!Utils.IsHero(ent) || config.kill_heroes) &&
			NoTarget.indexOf(ent as C_DOTA_BaseNPC) === -1,
		)
	availableAbils.some(abilData => {
		var abil = (abilData as any).abil as C_DOTABaseAbility, // hack for tsc, always isn't undefined (has !== undefined check in filter)
			range = abilData.abilRadiusF ? abilData.abilRadiusF(abil) : Utils.GetCastRange(MyEnt, abil)
		if (range > 0)
			range += 75
		return targets.some(ent => {
			if (
				Utils.HasLinkenAtTime(ent, abil.m_fCastPoint) ||
				(Utils.IsCreep(ent) && !Utils.IsFlagSet(abilData.targets, BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP))) ||
				(Utils.IsHero(ent) && !Utils.IsFlagSet(abilData.targets, BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO)))
			)
				return false
			var needBlink = false
			if (range > 0)
				if (MyEnt.m_vecNetworkOrigin.Distance2D(ent.m_vecNetworkOrigin) > range)
					if (
						!blinkFlag
						&& blink !== undefined
						&& blink.m_fCooldown === 0
						&& Utils.IsHero(ent)
						&& MyEnt.m_vecNetworkOrigin.Distance2D(ent.m_vecNetworkOrigin) < range + blink.GetSpecialValue("blink_range")
					)
						needBlink = true
					else return false
			var damage = (abilData.abilDamageF || getDamage)(abil, MyEnt, ent)
			if (zuus_passive !== undefined)
				damage += (abil.GetSpecialValue("damage_health_pct") + (zuus_talent !== undefined ? zuus_talent.m_iLevel === 0 ? 0 : zuus_talent.GetSpecialValue("value") : 0)) / 100 * ent.m_iMaxHealth
			// console.log(damage, Utils.GetHealthAfter(ent, abil.m_fCastPoint, false, MyEnt), latest_spellamp)
			if (damage < Utils.GetHealthAfter(ent, abil.m_fCastPoint, false, MyEnt))
				return false

			let ping = GetAvgLatency(Flow_t.IN) + GetAvgLatency(Flow_t.OUT)
			if ((blinkFlag = !(flag = !needBlink))) { // tslint:disable-line:no-conditional-assignment
				Orders.CastPosition(MyEnt, blink, ent.m_vecNetworkOrigin.Extend(MyEnt.m_vecNetworkOrigin, range - 100), false)
				setTimeout((blink.m_fCastPoint + ping) * 1000, () => blinkFlag = false)
			} else {
				NoTarget.push(ent)
				setTimeout(((abilData.abilDelayF ? abilData.abilDelayF(abil, MyEnt, ent) + abil.m_fCastPoint : 0) + ping) * 1000, () =>
					NoTarget.splice(NoTarget.indexOf(ent), 1),
				)
				if (abilData.abilCastF)
					abilData.abilCastF(abil, MyEnt, ent)
				else
					Orders.SmartCast(MyEnt, abil, ent)
				setTimeout ((abil.m_fCastPoint + ping) * 1000, () => flag = false)
			}

			return true
		})
	})
}

Events.on("NPCCreated", (npc: C_DOTA_BaseNPC) => {
	if (LocalDOTAPlayer === undefined)
		return
	if (
		Utils.IsEnemy(npc, LocalDOTAPlayer)
		&& (
			npc instanceof C_DOTA_BaseNPC_Creep
			|| (
				npc instanceof C_DOTA_BaseNPC_Hero
				&& (npc.m_hReplicatingOtherHeroModel === undefined || (npc instanceof C_DOTA_Unit_Hero_Meepo && npc.m_bIsIllusion))
			)
		)
	)
		possibleTargets.push(npc)
})
Events.on("EntityDestroyed", ent => {
	if (ent instanceof C_DOTA_BaseNPC)
		Utils.arrayRemove(possibleTargets, ent)
})
Events.on("GameEnded", () => possibleTargets = [])
Events.on("Tick", OnTick)

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
