/*!
 * Created on Wed Oct 15 2018
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
					damage = entTo.CalculateDamage(abil.GetSpecialValue("damage"), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
					hp = Utils.GetHealthAfter(entTo, abil.m_fCastPoint, false, entFrom)
				return hp > killThreshold ? damage * latest_spellamp : killThreshold
			},
		},
		{
			abilName: "necrolyte_reapers_scythe",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var DamagePerMissHP = abil.GetSpecialValue("damage_per_health"),
					delta = entTo.GetHealthAfter(3)
				return entTo.CalculateDamage((entTo.m_iMaxHealth - delta) * DamagePerMissHP, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "zuus_arc_lightning",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var arcDamage = abil.GetSpecialValue("arc_damage"),
					talent = entFrom.GetAbilityByName("special_bonus_unique_zeus_2")
				if (talent && talent.m_iLevel > 0)
					arcDamage += talent.GetSpecialValue("value")

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
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.DistTo(entTo) / abil.GetSpecialValue("projectile_speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.m_bHasScepter ? 0 : entTo.CalculateDamage(abil.m_iAbilityDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "visage_soul_assumption",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.DistTo(entTo) / abil.GetSpecialValue("bolt_speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var baseDamage = abil.GetSpecialValue("soul_base_damage"),
					stackDamage = abil.GetSpecialValue("soul_charge_damage"),
					talent = entFrom.GetAbilityByName("special_bonus_unique_visage_4")
				if (talent && talent.m_iLevel > 0)
					stackDamage += talent.GetSpecialValue("value")
				var stackBuff = entFrom.GetBuffByName("modifier_visage_soul_assumption"),
					stackBuffDamage = stackBuff ? stackBuff.m_iStackCount * stackDamage : 0
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
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.DistTo(entTo) / abil.GetSpecialValue("dagger_speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entTo.CalculateDamage(abil.GetSpecialValue("base_damage") + ((1 + abil.GetSpecialValue("attack_factor") / 100) * Utils.GetDamage(entFrom)), DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL, entFrom),
		},
		{
			abilName: "tinker_laser",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var laserDamage = abil.GetSpecialValue("laser_damage"),
					talent = entFrom.GetAbilityByName("special_bonus_unique_tinker")
				if (talent && talent.m_iLevel > 0)
					laserDamage += talent.GetSpecialValue("value")

				return entTo.CalculateDamage(laserDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_PURE, entFrom)
			},
		},
		{
			abilName: "antimage_mana_void",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entTo.CalculateDamage(abil.GetSpecialValue("mana_void_damage_per_mana") * (entTo.m_flMaxMana - entTo.m_flMana) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "puck_waning_rift",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilRadiusF: abil => abil.GetSpecialValue("radius") / 2 - 25,
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var damage = abil.GetSpecialValue("damage"),
					talent = entFrom.GetAbilityByName("special_bonus_unique_puck_4")
				if (talent && talent.m_iLevel > 0)
					damage += talent.GetSpecialValue("value")

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
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entTo.CalculateDamage(abil.GetSpecialValue("damage") * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_PURE, entFrom) - Math.min(abil.GetSpecialValue("prison_duration") * entTo.m_flHealthThinkRegen * 30 + 1, entTo.m_iMaxHealth - entTo.m_iHealth),
		},
		{
			abilName: /item_dagon/,
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entTo.CalculateDamage(abil.GetSpecialValue("damage") * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "bristleback_quill_spray",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP),
			abilRadiusF: abil => abil.GetSpecialValue("radius"),
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.DistTo(entTo) / abil.GetSpecialValue("projectile_speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var baseDamage = abil.GetSpecialValue("quill_base_damage"),
					stackDamage = abil.GetSpecialValue("quill_stack_damage"),
					maxDamage = abil.GetSpecialValue("max_damage"),
					talent = entFrom.GetAbilityByName("special_bonus_unique_bristleback_2")
				if (talent && talent.m_iLevel > 0)
					stackDamage += talent.GetSpecialValue("value")
				var stackBuff = entTo.GetBuffByName("modifier_bristleback_quill_spray"),
					stackBuffDamage = stackBuff ? stackBuff.m_iStackCount * stackDamage : 0
				return entTo.CalculateDamage(Math.min(maxDamage, baseDamage + stackBuffDamage) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL, entFrom)
			},
		},
		{
			abilName: "luna_lucent_beam",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var beamDamage = abil.GetSpecialValue("beam_damage"),
					talent = entFrom.GetAbilityByName("special_bonus_unique_luna_1")
				if (talent && talent.m_iLevel > 0)
					beamDamage += talent.GetSpecialValue("value")

				return entTo.CalculateDamage(beamDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "alchemist_unstable_concoction",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var maxDamage = abil.GetSpecialValue("max_damage"),
					talent = entFrom.GetAbilityByName("special_bonus_unique_alchemist_2")
				if (talent && talent.m_iLevel > 0)
					maxDamage += talent.GetSpecialValue("value")

				return entTo.CalculateDamage(maxDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL, entFrom)
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
					talent = entFrom.GetAbilityByName("special_bonus_unique_alchemist_2"),
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

				return entTo.CalculateDamage(charged * maxDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL, entFrom)
			},
		},
		{
			abilName: "abaddon_death_coil",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var targetDamage = abil.GetSpecialValue("target_damage"),
					talent = entFrom.GetAbilityByName("special_bonus_unique_abaddon_2")
				if (talent && talent.m_iLevel > 0)
					targetDamage += talent.GetSpecialValue("value")

				return entTo.CalculateDamage(targetDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "bounty_hunter_shuriken_toss",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.DistTo(entTo) / abil.GetSpecialValue("speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var damage = abil.GetSpecialValue("bonus_damage"),
					talent = entFrom.GetAbilityByName("special_bonus_unique_bounty_hunter_2")
				if (talent && talent.m_iLevel > 0)
					damage += talent.GetSpecialValue("value")

				return entTo.CalculateDamage(damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "ogre_magi_fireblast",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var fireblastDamage = abil.GetSpecialValue("fireblast_damage"),
					talent = entFrom.GetAbilityByName("special_bonus_unique_ogre_magi_2")
				if (talent && talent.m_iLevel > 0)
					fireblastDamage += talent.GetSpecialValue("value")

				return entTo.CalculateDamage(fireblastDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "ogre_magi_unrefined_fireblast",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entTo.CalculateDamage(abil.GetSpecialValue("fireblast_damage") * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "undying_soul_rip",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entTo.CalculateDamage (
				abil.GetSpecialValue("damage_per_unit")
				* Math.min (
					entTo.m_vecNetworkOrigin.GetEntitiesInRange(abil.GetSpecialValue("radius")).filter(ent =>
						ent instanceof C_DOTA_BaseNPC && (ent.m_bIsCreep || ent.m_bIsHero) && !ent.IsEnemy(entFrom),
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
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.DistTo(entTo) / abil.GetSpecialValue("projectile_speed"),
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
					talent = entFrom.GetAbilityByName("special_bonus_unique_tusk")
				if (talent && talent.m_iLevel > 0)
					critMultiplier += talent.GetSpecialValue("value")

				return entTo.CalculateDamageByHand(entFrom) * critMultiplier / 100
			},
		},
		{
			abilName: "centaur_double_edge",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var edgeDamage = abil.GetSpecialValue("edge_damage"),
					talent = entFrom.GetAbilityByName("special_bonus_unique_centaur_4")
				if (talent && talent.m_iLevel > 0)
					edgeDamage += talent.GetSpecialValue("value")

				return entTo.CalculateDamage(edgeDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "legion_commander_duel",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entTo.CalculateDamageByHand(entFrom) * 2 - 1,
		}, /*
		{
			abilName: "legion_commander_overwhelming_odds",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				const ents = entTo.AbsOrigin.GetEntitiesInRange(abil.GetSpecialValue("radius")),
					creeps = ents.filter(ent => ent.IsCreep && ent.IsEnemy),
					heroes = ents.filter(ent => ent.IsHero && ent.IsEnemy)
				return entTo.CalculateDamage((abil.GetSpecialValue("damage") * heroes.length + abil.GetSpecialValue("damage_per_unit") * creeps.length) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			}
		},*/
		{
			abilName: "broodmother_spawn_spiderlings",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.DistTo(entTo) / abil.GetSpecialValue("projectile_speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var damage = abil.GetSpecialValue("damage"),
					talent = entFrom.GetAbilityByName("special_bonus_unique_broodmother_3")
				if (talent && talent.m_iLevel > 0)
					damage += talent.GetSpecialValue("value")

				return entTo.CalculateDamage(damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "crystal_maiden_crystal_nova",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var damage = abil.GetSpecialValue("nova_damage"),
					talent = entFrom.GetAbilityByName("special_bonus_unique_crystal_maiden_2")
				if (talent && talent.m_iLevel > 0)
					damage += talent.GetSpecialValue("value")

				return entTo.CalculateDamage(damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "shadow_shaman_ether_shock",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var damage = abil.GetSpecialValue("damage"),
					talent = entFrom.GetAbilityByName("special_bonus_unique_shadow_shaman_3")
				if (talent && talent.m_iLevel > 0)
					damage += talent.GetSpecialValue("value")

				return entTo.CalculateDamage(damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "undying_decay",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entTo.CalculateDamage(abil.GetSpecialValue("decay_damage") * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "oracle_purifying_flames",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP),
		},
		{
			abilName: "lion_impale",
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.DistTo(entTo) / abil.GetSpecialValue("speed"),
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "lion_finger_of_death",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: abil => abil.GetSpecialValue("damage_delay"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var damage = abil.GetSpecialValue("damage" + (entFrom.m_bHasScepter ? "_scepter" : "")),
					talent = entFrom.GetAbilityByName("special_bonus_unique_lion_3"),
					buff = entFrom.GetBuffByName("modifier_lion_finger_of_death_kill_counter")
				if (talent && talent.m_iLevel > 0)
					damage += talent.GetSpecialValue("value")
				if (buff)
					damage += buff.m_iStackCount * abil.GetSpecialValue("damage_per_kill")

				return entTo.CalculateDamage(damage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "lina_laguna_blade",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: abil => abil.GetSpecialValue("damage_delay"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entTo.CalculateDamage(abil.GetSpecialValue("damage") * latest_spellamp, entFrom.m_bHasScepter ? DAMAGE_TYPES.DAMAGE_TYPE_PURE : DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "pudge_dismember",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entTo.CalculateDamage(abil.GetSpecialValue("dismember_damage") * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
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
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.DistTo(entTo) / abil.GetSpecialValue("lance_speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var lanceDamage = abil.GetSpecialValue("lance_damage"),
					talent = entFrom.GetAbilityByName("special_bonus_unique_phantom_lancer_2")
				if (talent && talent.m_iLevel > 0)
					lanceDamage += talent.GetSpecialValue("value")

				return entTo.CalculateDamage(lanceDamage * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom)
			},
		},
		{
			abilName: "skeleton_king_hellfire_blast",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.DistTo(entTo) / abil.GetSpecialValue("blast_speed"),
		},
		{
			abilName: "sven_storm_bolt",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.DistTo(entTo) / abil.GetSpecialValue("bolt_speed"),
		},
		/*{
			abilName: "storm_spirit_ball_lightning",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => Abilities.GetCastPoint(abil) + entFrom.DistTo(entTo) / abil.GetSpecialValue("ball_lightning_move_speed"),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
				var dist = entFrom.DistTo(entTo) / 100
				if (entFrom.BuffsNames.indexOf("modifier_storm_spirit_ball_lightning") > -1 || entFrom.m_flMana < Abilities.GetManaCost(abil) + abil.GetSpecialValue("ball_lightning_travel_cost_base") * dist + abil.GetSpecialValue("ball_lightning_travel_cost_percent") / 100 * entFrom.m_flMaxMana * dist)
					return 0

				return entTo.CalculateDamage(dist * Abilities.GetAbilityDamage(abil), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL)
			},
			abilCastF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC) => {
				var aoe = abil.GetSpecialValue("ball_lightning_aoe") / 2,
					dist = entFrom.DistTo(entTo),
					time = Abilities.GetCastPoint(abil) + dist / abil.GetSpecialValue("ball_lightning_move_speed"),
					point1 = entTo.VelocityWaypoint(time),
					point2 = Fusion.ExtendVector(point1, entFrom.AbsOrigin, aoe),
					point
				if (entTo.CalculateDamage(point1.PointDistance(entFrom.AbsOrigin) * Abilities.GetAbilityDamage(abil), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) > entTo.HealthAfter(time * 30))
					point = point1
				else if (entTo.CalculateDamage(point2.PointDistance(entFrom.AbsOrigin) * Abilities.GetAbilityDamage(abil), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) > entTo.GetHealthAfter(time * 30))
					point = point2
				if (point)
					Orders.CastPosition(entFrom, abil, point, false)
			}
		},*/
		{
			abilName: "furion_wrath_of_nature",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entTo.CalculateDamage(abil.GetSpecialValue("damage" + (entFrom.m_bHasScepter ? "_scepter" : "")) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
		{
			abilName: "beastmaster_primal_roar",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "sandking_burrowstrike",
			abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entFrom.DistTo(entTo) / abil.GetSpecialValue("burrow_speed" + (entFrom.m_bHasScepter ? "_scepter" : "")),
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
		},
		{
			abilName: "centaur_double_edge",
			targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
			abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => entTo.CalculateDamage((abil.GetSpecialValue("edge_damage") + [0.6,0.8,1,1.2][abil.m_iLevel] * (entFrom as C_DOTA_BaseNPC_Hero).m_flStrengthTotal) * latest_spellamp, DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL, entFrom),
		},
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
		|| MyEnt.GetAbilityByName(abilData.abilName) !== undefined,
	)
}

function getDamage(abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number {
	return entTo.CalculateDamage((abil.m_iAbilityDamage || abil.GetSpecialValue("damage")) * latest_spellamp, abil.m_pAbilityData.m_iAbilityDamageType, entFrom)
}

function OnTick(): void {
	if (!config.enabled || LocalDOTAPlayer === undefined)
		return

	var MyEnt = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC_Hero/*,
		selectedHero = /^npc_dota_hero_(.*)$/.exec(MyEnt.UnitName)[1]*/
	if (MyEnt === undefined || MyEnt.m_bIsStunned || !MyEnt.m_bIsAlive || flag || LocalDOTAPlayer.m_hActiveAbility !== undefined/* || (MyEnt.CanBeVisible && selectedHero !== "riki" && selectedHero !== "treant_protector")*/)
		return
	latest_spellamp = MyEnt.m_fSpellAmplification / 100
	{
		let bs_buff = MyEnt.GetBuffByName("modifier_bloodseeker_bloodrage")
		if (bs_buff !== undefined)
			latest_spellamp *= (bs_buff.m_hAbility as C_DOTABaseAbility).GetSpecialValue("damage_increase_pct") / 100
	}
	var availableAbils = GetAvailableAbils().filter(abilData => {
			var abil = (abilData as any).abil = abilData.abilName instanceof RegExp ? Utils.GetItemByRegexp(MyEnt, abilData.abilName) : MyEnt.GetAbilityByName(abilData.abilName) || MyEnt.GetItemByName(abilData.abilName)
			return abil !== undefined && abil.m_iLevel !== 0 && !abil.m_bIsHidden && abil.m_fCooldown === 0 && abil.IsManaEnough(MyEnt)
		}),
		zuus_passive = MyEnt.GetAbilityByName("zuus_static_field"),
		zuus_talent = MyEnt.GetAbilityByName("special_bonus_unique_zeus"),
		blink = MyEnt.GetItemByName("item_blink") || MyEnt.GetAbilityByName("antimage_blink"),
		targets = possibleTargets.filter(ent =>
			ent.m_bIsValid &&
			ent.m_bIsVisible &&
			!ent.m_bIsWaitingToSpawn &&
			ent.m_bIsAlive &&
			(!ent.m_bIsCreep || config.kill_creeps) &&
			(!ent.m_bIsHero || config.kill_heroes) &&
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
				(ent.m_bIsCreep && !Utils.IsFlagSet(abilData.targets, BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP))) ||
				(ent.m_bIsHero && !Utils.IsFlagSet(abilData.targets, BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO)))
			)
				return false
			var needBlink = false
			if (range > 0)
				if (MyEnt.DistTo2D(ent) > range)
					if (
						!blinkFlag
						&& blink !== undefined
						&& blink.m_fCooldown === 0
						&& ent.m_bIsHero
						&& MyEnt.DistTo2D(ent) < range + blink.GetSpecialValue("blink_range")
					)
						needBlink = true
					else return false
			var damage = (abilData.abilDamageF || getDamage)(abil, MyEnt, ent)
			if (zuus_passive !== undefined)
				damage += (abil.GetSpecialValue("damage_health_pct") + (zuus_talent !== undefined ? zuus_talent.m_iLevel === 0 ? 0 : zuus_talent.GetSpecialValue("value") : 0)) / 100 * ent.m_iMaxHealth
			// console.log(damage, Utils.GetHealthAfter(ent, abil.m_fCastPoint, false, MyEnt))
			if (damage < Utils.GetHealthAfter(ent, abil.m_fCastPoint, false, MyEnt))
				return false

			let ping = GetAvgLatency(Flow_t.IN) + GetAvgLatency(Flow_t.OUT)
			if ((blinkFlag = !(flag = !needBlink))) { // tslint:disable-line:no-conditional-assignment
				Orders.CastPosition(MyEnt, blink, ent.m_vecNetworkOrigin.ExtendVector(MyEnt.m_vecNetworkOrigin, range - 100), false)
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

Events.addListener("onNPCCreated", (npc: C_DOTA_BaseNPC) => {
	if (LocalDOTAPlayer === undefined)
		return
	if (
		npc.IsEnemy(LocalDOTAPlayer)
		&& (
			npc instanceof C_DOTA_BaseNPC_Creep
			|| (
				npc instanceof C_DOTA_BaseNPC_Hero
				&& (npc.m_hReplicatingOtherHeroModel === undefined || (npc instanceof C_DOTA_Unit_Hero_Meepo && npc.m_bIsClone))
			)
		)
	)
		possibleTargets.push(npc)
})
Events.addListener("onEntityDestroyed", ent => {
	if (LocalDOTAPlayer === undefined || !(ent instanceof C_DOTA_BaseNPC))
		return
	Utils.arrayRemove(possibleTargets, ent)
})
Events.addListener("onGameEnded", () => possibleTargets = [])
Events.addListener("onTick", OnTick)

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
