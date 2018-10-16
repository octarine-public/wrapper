/*!
 * Created on Wed Oct 15 2018
 *
 * This file is part of Fusion.
 * Copyright (c) 2018 Fusion
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
/// <reference path="../Fusion-Native2.d.ts" />
import * as Utils from "./Utils";
import * as Orders from "./Orders";
Utils.ensureLoaded();
var config = {
    enabled: false
};
var abils = [
    {
        abilName: "axe_culling_blade",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => {
            var kill_threshold = abil.GetSpecialValue("kill_threshold"), damage = entTo.CalculateDamage(abil.GetSpecialValue("damage"), 2 /* DAMAGE_TYPE_MAGICAL */), hp = Utils.HealthAfter(entTo, abil.m_fCastPoint);
            return hp > kill_threshold ? damage : kill_threshold;
        }
    },
    {
        abilName: "necrolyte_reapers_scythe",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => {
            var DamagePerMissHP = abil.GetSpecialValue("damage_per_health"), delta = Utils.HealthAfter(entTo, 3);
            return entTo.CalculateDamage((entTo.m_iMaxHealth - delta) * DamagePerMissHP, 2 /* DAMAGE_TYPE_MAGICAL */);
        }
    },
    {
        abilName: "zuus_arc_lightning",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */ | 2 /* DOTA_UNIT_TARGET_CREEP */),
        abilDamageF: (abil, entFrom, entTo) => {
            var arc_damage = abil.GetSpecialValue("arc_damage"), talent = entFrom.GetAbilityByName("special_bonus_unique_zeus_2");
            if (talent && talent.m_iLevel > 0)
                arc_damage += talent.GetSpecialValue("value");
            return entTo.CalculateDamage(arc_damage, 2 /* DAMAGE_TYPE_MAGICAL */);
        }
    },
    {
        abilName: "zuus_lightning_bolt",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */)
    },
    {
        abilName: "zuus_thundergods_wrath",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */)
    },
    {
        abilName: "sniper_assassinate",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDelayF: (abil, entFrom, entTo) => entFrom.DistTo(entTo) / abil.GetSpecialValue("projectile_speed"),
        abilDamageF: (abil, entFrom, entTo) => entFrom.m_bHasScepter ? 0 : entTo.CalculateDamage(abil.m_iAbilityDamage, 2 /* DAMAGE_TYPE_MAGICAL */)
    },
    {
        abilName: "visage_soul_assumption",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDelayF: (abil, entFrom, entTo) => entFrom.DistTo(entTo) / abil.GetSpecialValue("bolt_speed"),
        abilDamageF: (abil, entFrom, entTo) => {
            var baseDamage = abil.GetSpecialValue("soul_base_damage"), stackDamage = abil.GetSpecialValue("soul_charge_damage"), talent = entFrom.GetAbilityByName("special_bonus_unique_visage_4");
            if (talent && talent.m_iLevel > 0)
                stackDamage += talent.GetSpecialValue("value");
            var stack_buff = entFrom.GetBuffByName("modifier_visage_soul_assumption"), stack_buff_damage = stack_buff ? stack_buff.m_iStackCount * stackDamage : 0;
            return entTo.CalculateDamage(baseDamage + stack_buff_damage, 2 /* DAMAGE_TYPE_MAGICAL */);
        }
    },
    {
        abilName: "rubick_fade_bolt",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */)
    },
    {
        abilName: "phantom_assassin_stifling_dagger",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */ | 2 /* DOTA_UNIT_TARGET_CREEP */),
        abilDelayF: (abil, entFrom, entTo) => entFrom.DistTo(entTo) / abil.GetSpecialValue("dagger_speed"),
        abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.GetSpecialValue("base_damage") + ((1 + abil.GetSpecialValue("attack_factor") / 100) * Utils.GetDamage(entFrom)), 1 /* DAMAGE_TYPE_PHYSICAL */)
    },
    {
        abilName: "tinker_laser",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => {
            var laser_damage = abil.GetSpecialValue("laser_damage"), talent = entFrom.GetAbilityByName("special_bonus_unique_tinker");
            if (talent && talent.m_iLevel > 0)
                laser_damage += talent.GetSpecialValue("value");
            return entTo.CalculateDamage(laser_damage, 4 /* DAMAGE_TYPE_PURE */);
        }
    },
    {
        abilName: "antimage_mana_void",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.GetSpecialValue("mana_void_damage_per_mana") * (entTo.m_flMaxMana - entTo.m_flMana), 2 /* DAMAGE_TYPE_MAGICAL */)
    },
    {
        abilName: "puck_waning_rift",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilRadiusF: abil => abil.GetSpecialValue("radius") / 2 - 25,
        abilDamageF: (abil, entFrom, entTo) => {
            var damage = abil.GetSpecialValue("damage"), talent = entFrom.GetAbilityByName("special_bonus_unique_puck_4");
            if (talent && talent.m_iLevel > 0)
                damage += talent.GetSpecialValue("value");
            return entTo.CalculateDamage(damage, 2 /* DAMAGE_TYPE_MAGICAL */);
        }
    },
    {
        abilName: "brewmaster_thunder_clap",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilRadiusF: abil => abil.GetSpecialValue("radius") / 2 - 25
    },
    {
        abilName: "obsidian_destroyer_astral_imprisonment",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.GetSpecialValue("damage"), 4 /* DAMAGE_TYPE_PURE */) - Math.min(abil.GetSpecialValue("prison_duration") * entTo.m_flHealthThinkRegen * 30 + 1, entTo.m_iMaxHealth - entTo.m_iHealth)
    },
    {
        abilName: /item_dagon/,
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.GetSpecialValue("damage"), 2 /* DAMAGE_TYPE_MAGICAL */)
    },
    {
        abilName: "bristleback_quill_spray",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */ | 2 /* DOTA_UNIT_TARGET_CREEP */),
        abilRadiusF: abil => abil.GetSpecialValue("radius"),
        abilDelayF: (abil, entFrom, entTo) => entFrom.DistTo(entTo) / abil.GetSpecialValue("projectile_speed"),
        abilDamageF: (abil, entFrom, entTo) => {
            var baseDamage = abil.GetSpecialValue("quill_base_damage"), stackDamage = abil.GetSpecialValue("quill_stack_damage"), max_damage = abil.GetSpecialValue("max_damage"), talent = entFrom.GetAbilityByName("special_bonus_unique_bristleback_2");
            if (talent && talent.m_iLevel > 0)
                stackDamage += talent.GetSpecialValue("value");
            var stack_buff = entTo.GetBuffByName("modifier_bristleback_quill_spray"), stack_buff_damage = stack_buff ? stack_buff.m_iStackCount * stackDamage : 0;
            return entTo.CalculateDamage(Math.min(max_damage, baseDamage + stack_buff_damage), 1 /* DAMAGE_TYPE_PHYSICAL */);
        }
    },
    {
        abilName: "luna_lucent_beam",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => {
            var beam_damage = abil.GetSpecialValue("beam_damage"), talent = entFrom.GetAbilityByName("special_bonus_unique_luna_1");
            if (talent && talent.m_iLevel > 0)
                beam_damage += talent.GetSpecialValue("value");
            return entTo.CalculateDamage(beam_damage, 2 /* DAMAGE_TYPE_MAGICAL */);
        }
    },
    {
        abilName: "alchemist_unstable_concoction",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => {
            var max_damage = abil.GetSpecialValue("max_damage"), talent = entFrom.GetAbilityByName("special_bonus_unique_alchemist_2");
            if (talent && talent.m_iLevel > 0)
                max_damage += talent.GetSpecialValue("value");
            return entTo.CalculateDamage(max_damage, 1 /* DAMAGE_TYPE_PHYSICAL */);
        }
    },
    {
        abilName: "alchemist_unstable_concoction_throw",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => {
            var max_damage = abil.GetSpecialValue("max_damage"), brew_time = abil.GetSpecialValue("brew_time"), brew_explosion = abil.GetSpecialValue("brew_explosion"), min_stun = abil.GetSpecialValue("min_stun"), talent = entFrom.GetAbilityByName("special_bonus_unique_alchemist_2"), modifier_name = "modifier_alchemist_unstable_concoction";
            if (talent && talent.m_iLevel > 0)
                max_damage += talent.GetSpecialValue("value");
            var buffs = entFrom.m_ModifierManager.m_vecBuffs.filter(buff => buff.m_name === modifier_name), buff;
            if (buffs.length > 0)
                buff = buff[0];
            else
                return 0;
            var elapsed = Math.min(buff.m_flDieTime - GameRules.m_fGameTime, brew_time) - min_stun, charged = Math.max(elapsed, 0) / brew_time;
            if (buff.m_flDieTime - GameRules.m_fGameTime > brew_explosion - (abil.m_fCastPoint + 1.5 / 30))
                return 99999999; // we don't need to be self-stunned, ye?
            return entTo.CalculateDamage(charged * max_damage, 1 /* DAMAGE_TYPE_PHYSICAL */);
        }
    },
    {
        abilName: "abaddon_death_coil",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => {
            var target_damage = abil.GetSpecialValue("target_damage"), talent = entFrom.GetAbilityByName("special_bonus_unique_abaddon_2");
            if (talent && talent.m_iLevel > 0)
                target_damage += talent.GetSpecialValue("value");
            return entTo.CalculateDamage(target_damage, 2 /* DAMAGE_TYPE_MAGICAL */);
        }
    },
    {
        abilName: "bounty_hunter_shuriken_toss",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDelayF: (abil, entFrom, entTo) => entFrom.DistTo(entTo) / abil.GetSpecialValue("speed"),
        abilDamageF: (abil, entFrom, entTo) => {
            var damage = abil.GetSpecialValue("bonus_damage"), talent = entFrom.GetAbilityByName("special_bonus_unique_bounty_hunter_2");
            if (talent && talent.m_iLevel > 0)
                damage += talent.GetSpecialValue("value");
            return entTo.CalculateDamage(damage, 2 /* DAMAGE_TYPE_MAGICAL */);
        }
    },
    {
        abilName: "ogre_magi_fireblast",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => {
            var fireblast_damage = abil.GetSpecialValue("fireblast_damage"), talent = entFrom.GetAbilityByName("special_bonus_unique_ogre_magi_2");
            if (talent && talent.m_iLevel > 0)
                fireblast_damage += talent.GetSpecialValue("value");
            return entTo.CalculateDamage(fireblast_damage, 2 /* DAMAGE_TYPE_MAGICAL */);
        }
    },
    {
        abilName: "ogre_magi_unrefined_fireblast",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.GetSpecialValue("fireblast_damage"), 2 /* DAMAGE_TYPE_MAGICAL */)
    },
    {
        abilName: "undying_soul_rip",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.GetSpecialValue("damage_per_unit")
            * Math.min(entTo.m_vecNetworkOrigin.GetEntitiesInRange(abil.GetSpecialValue("radius")).filter(ent => ent.m_bIsDOTANPC
                && (ent.m_bIsCreep
                    || ent.m_bIsHero)
                && !ent.IsEnemy(entFrom)).length, abil.GetSpecialValue("max_units")), 2 /* DAMAGE_TYPE_MAGICAL */)
    },
    {
        abilName: "queenofpain_scream_of_pain",
        abilDelayF: (abil, entFrom, entTo) => entFrom.DistTo(entTo) / abil.GetSpecialValue("projectile_speed"),
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */)
    },
    {
        abilName: "leshrac_lightning_storm",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */)
    },
    {
        abilName: "tusk_walrus_punch",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => {
            var crit_multiplier = abil.GetSpecialValue("crit_multiplier"), talent = entFrom.GetAbilityByName("special_bonus_unique_tusk");
            if (talent && talent.m_iLevel > 0)
                crit_multiplier += talent.GetSpecialValue("value");
            return entTo.CalculateDamage(Utils.GetDamage(entFrom) * crit_multiplier / 100, 1 /* DAMAGE_TYPE_PHYSICAL */);
        }
    },
    {
        abilName: "centaur_double_edge",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => {
            var edge_damage = abil.GetSpecialValue("edge_damage"), talent = entFrom.GetAbilityByName("special_bonus_unique_centaur_4");
            if (talent && talent.m_iLevel > 0)
                edge_damage += talent.GetSpecialValue("value");
            return entTo.CalculateDamage(edge_damage, 2 /* DAMAGE_TYPE_MAGICAL */);
        }
    },
    {
        abilName: "legion_commander_duel",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(Utils.GetDamage(entFrom), 1 /* DAMAGE_TYPE_PHYSICAL */) * 2 - 1
    },
    {
        abilName: "broodmother_spawn_spiderlings",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDelayF: (abil, entFrom, entTo) => entFrom.DistTo(entTo) / abil.GetSpecialValue("projectile_speed"),
        abilDamageF: (abil, entFrom, entTo) => {
            var damage = abil.GetSpecialValue("damage"), talent = entFrom.GetAbilityByName("special_bonus_unique_broodmother_3");
            if (talent && talent.m_iLevel > 0)
                damage += talent.GetSpecialValue("value");
            return entTo.CalculateDamage(damage, 2 /* DAMAGE_TYPE_MAGICAL */);
        }
    },
    {
        abilName: "crystal_maiden_crystal_nova",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => {
            var damage = abil.GetSpecialValue("nova_damage"), talent = entFrom.GetAbilityByName("special_bonus_unique_crystal_maiden_2");
            if (talent && talent.m_iLevel > 0)
                damage += talent.GetSpecialValue("value");
            return entTo.CalculateDamage(damage, 2 /* DAMAGE_TYPE_MAGICAL */);
        }
    },
    {
        abilName: "shadow_shaman_ether_shock",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => {
            var damage = abil.GetSpecialValue("damage"), talent = entFrom.GetAbilityByName("special_bonus_unique_shadow_shaman_3");
            if (talent && talent.m_iLevel > 0)
                damage += talent.GetSpecialValue("value");
            return entTo.CalculateDamage(damage, 2 /* DAMAGE_TYPE_MAGICAL */);
        }
    },
    {
        abilName: "undying_decay",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.GetSpecialValue("decay_damage"), 2 /* DAMAGE_TYPE_MAGICAL */)
    },
    {
        abilName: "oracle_purifying_flames",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */)
    },
    {
        abilName: "lion_impale",
        abilDelayF: (abil, entFrom, entTo) => entFrom.DistTo(entTo) / abil.GetSpecialValue("speed"),
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */)
    },
    {
        abilName: "lion_finger_of_death",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDelayF: abil => abil.GetSpecialValue("damage_delay"),
        abilDamageF: (abil, entFrom, entTo) => {
            var damage = abil.GetSpecialValue("damage" + (entFrom.m_bHasScepter ? "_scepter" : "")), talent = entFrom.GetAbilityByName("special_bonus_unique_lion_3");
            if (talent && talent.m_iLevel > 0)
                damage += talent.GetSpecialValue("value");
            return entTo.CalculateDamage(damage, 2 /* DAMAGE_TYPE_MAGICAL */);
        }
    },
    {
        abilName: "lina_laguna_blade",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDelayF: abil => abil.GetSpecialValue("damage_delay"),
        abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.GetSpecialValue("damage"), entFrom.m_bHasScepter ? 4 /* DAMAGE_TYPE_PURE */ : 2 /* DAMAGE_TYPE_MAGICAL */)
    },
    {
        abilName: "pudge_dismember",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.GetSpecialValue("dismember_damage"), 2 /* DAMAGE_TYPE_MAGICAL */)
    },
    {
        abilName: "lich_frost_nova",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */)
    },
    {
        abilName: "night_stalker_void",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */)
    },
    {
        abilName: "phantom_lancer_spirit_lance",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDelayF: (abil, entFrom, entTo) => entFrom.DistTo(entTo) / abil.GetSpecialValue("lance_speed"),
        abilDamageF: (abil, entFrom, entTo) => {
            var lance_damage = abil.GetSpecialValue("lance_damage"), talent = entFrom.GetAbilityByName("special_bonus_unique_phantom_lancer_2");
            if (talent && talent.m_iLevel > 0)
                lance_damage += talent.GetSpecialValue("value");
            return entTo.CalculateDamage(lance_damage, 2 /* DAMAGE_TYPE_MAGICAL */);
        }
    },
    {
        abilName: "skeleton_king_hellfire_blast",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDelayF: (abil, entFrom, entTo) => entFrom.DistTo(entTo) / abil.GetSpecialValue("blast_speed")
    },
    {
        abilName: "sven_storm_bolt",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDelayF: (abil, entFrom, entTo) => entFrom.DistTo(entTo) / abil.GetSpecialValue("bolt_speed")
    },
    /*{
        abilName: "storm_spirit_ball_lightning",
        targets: BigInt(DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO),
        abilDelayF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => Abilities.GetCastPoint(abil) + entFrom.DistTo(entTo) / abil.GetSpecialValue("ball_lightning_move_speed"),
        abilDamageF: (abil: C_DOTABaseAbility, entFrom: C_DOTA_BaseNPC, entTo: C_DOTA_BaseNPC): number => {
            var dist = entFrom.DistTo(entTo) / 100
            if(entFrom.BuffsNames.indexOf("modifier_storm_spirit_ball_lightning") > -1 || entFrom.m_flMana < Abilities.GetManaCost(abil) + abil.GetSpecialValue("ball_lightning_travel_cost_base") * dist + abil.GetSpecialValue("ball_lightning_travel_cost_percent") / 100 * entFrom.m_flMaxMana * dist)
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
            if(entTo.CalculateDamage(point1.PointDistance(entFrom.AbsOrigin) * Abilities.GetAbilityDamage(abil), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) > entTo.HealthAfter(time * 30))
                point = point1
            else if(entTo.CalculateDamage(point2.PointDistance(entFrom.AbsOrigin) * Abilities.GetAbilityDamage(abil), DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) > entTo.GetHealthAfter(time * 30))
                point = point2
            if(point)
                Orders.CastPosition(entFrom, abil, point, false)
        }
    },*/
    {
        abilName: "furion_wrath_of_nature",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */),
        abilDamageF: (abil, entFrom, entTo) => entTo.CalculateDamage(abil.GetSpecialValue("damage" + (entFrom.m_bHasScepter ? "_scepter" : "")), 2 /* DAMAGE_TYPE_MAGICAL */)
    },
    {
        abilName: "beastmaster_primal_roar",
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */)
    },
    {
        abilName: "sandking_burrowstrike",
        abilDelayF: (abil, entFrom, entTo) => entFrom.DistTo(entTo) / abil.GetSpecialValue("burrow_speed" + (entFrom.m_bHasScepter ? "_scepter" : "")),
        targets: BigInt(1 /* DOTA_UNIT_TARGET_HERO */)
    },
], flag = false, NoTarget = [], possible_targets = [], blink_flag = false;
function GetAvailableAbils() {
    var MyEnt = LocalDOTAPlayer.m_hAssignedHero;
    return abils.filter(abilData => abilData.abilName instanceof RegExp
        || abilData.abilName.startsWith("item_")
        || MyEnt.GetAbilityByName(abilData.abilName) !== undefined);
}
function Cast(abil, entFrom, entTo) {
    var Behavior = abil.m_pAbilityData.m_iAbilityBehavior;
    if (Utils.IsFlagSet(Behavior, BigInt(4 /* DOTA_ABILITY_BEHAVIOR_NO_TARGET */)))
        Orders.CastNoTarget(entFrom, abil, false);
    else if (Utils.IsFlagSet(Behavior, BigInt(8 /* DOTA_ABILITY_BEHAVIOR_UNIT_TARGET */)) || Behavior === BigInt(0))
        Orders.CastTarget(entFrom, abil, entTo, false);
    else if (Utils.IsFlagSet(Behavior, BigInt(16 /* DOTA_ABILITY_BEHAVIOR_POINT */)))
        Orders.CastPosition(entFrom, abil, Utils.VelocityWaypoint(entTo, abil.m_fCastPoint), false);
}
function getDamage(abil, entFrom, entTo) {
    return entTo.CalculateDamage(abil.m_iAbilityDamage || abil.GetSpecialValue("damage"), abil.m_pAbilityData.m_iAbilityDamageType);
}
function OnUpdate() {
    if (!config.enabled || LocalDOTAPlayer === undefined)
        return;
    var MyEnt = LocalDOTAPlayer.m_hAssignedHero; /*,
        selectedHero = /^npc_dota_hero_(.*)$/.exec(MyEnt.UnitName)[1]*/
    if (MyEnt === undefined || MyEnt.m_bIsStunned || !MyEnt.m_bIsAlive || flag || LocalDOTAPlayer.m_hActiveAbility !== undefined /* || (MyEnt.CanBeVisible && selectedHero !== "riki" && selectedHero !== "treant_protector")*/)
        return;
    var availableAbils = GetAvailableAbils().filter(abilData => {
        var abil = abilData.abil;
        if (abil === undefined)
            abilData.abil = abil = abilData.abilName instanceof RegExp ? Utils.GetItemByRegexp(MyEnt, abilData.abilName) : MyEnt.GetAbilityByName(abilData.abilName) || MyEnt.GetItemByName(abilData.abilName);
        return abil !== undefined && abil.m_iLevel !== 0 && !abil.m_bIsHidden && abil.m_fCooldown === 0 && abil.IsManaEnough(MyEnt);
    }), zuus_passive = MyEnt.GetAbilityByName("zuus_static_field"), zuus_talent = MyEnt.GetAbilityByName("special_bonus_unique_zeus"), blink = MyEnt.GetItemByName("item_blink") || MyEnt.GetAbilityByName("antimage_blink"), targets = possible_targets.filter(ent => !ent.m_bIsWaitingToSpawn && ent.m_bIsAlive && NoTarget.indexOf(ent) === -1);
    availableAbils.some(abilData => {
        var abil = abilData.abil, range = abilData.abilRadiusF ? abilData.abilRadiusF(abil) : abil.m_iCastRange;
        if (range > 0)
            range += 75;
        return targets.some(ent => {
            if (Utils.HasLinkenAtTime(ent, abil.m_fCastPoint) ||
                (ent.m_bIsCreep && !Utils.IsFlagSet(abilData.targets, BigInt(2 /* DOTA_UNIT_TARGET_CREEP */))) ||
                (ent.m_bIsHero && !Utils.IsFlagSet(abilData.targets, BigInt(1 /* DOTA_UNIT_TARGET_HERO */))))
                return false;
            var need_blink = false;
            if (range > 0)
                if (MyEnt.DistTo(ent) > range)
                    if (!blink_flag
                        && blink !== undefined
                        && blink.m_fCooldown === 0
                        && ent.m_bIsHero
                        && MyEnt.DistTo(ent) < range + blink.GetSpecialValue("blink_range"))
                        need_blink = true;
                    else
                        return false;
            var damage = (abilData.abilDamageF || getDamage)(abil, MyEnt, ent);
            if (zuus_passive !== undefined && MyEnt.IsInRange(ent, zuus_passive.m_iCastRange))
                damage += (abil.GetSpecialValue("damage_health_pct") + (zuus_talent !== undefined ? zuus_talent.m_iLevel === 0 ? 0 : zuus_talent.GetSpecialValue("value") : 0)) / 100 * ent.m_iMaxHealth;
            if (damage < Utils.HealthAfter(ent, abil.m_fCastPoint))
                return false;
            if ((blink_flag = !(flag = !need_blink))) {
                Orders.CastPosition(MyEnt, blink, ent.m_vecNetworkOrigin.ExtendVector(MyEnt.m_vecNetworkOrigin, range - 100), false);
                setTimeout((blink.m_fCastPoint + 1 / 30) * 1000, () => blink_flag = false);
            }
            else {
                NoTarget.push(ent);
                setTimeout((abilData.abilDelayF ? abilData.abilDelayF(abil, MyEnt, ent) + abil.m_fCastPoint + 2 / 30 : 0) * 1000, () => NoTarget.splice(NoTarget.indexOf(ent), 1));
                if (abilData.abilCastF)
                    abilData.abilCastF(abil, MyEnt, ent);
                else
                    Cast(abil, MyEnt, ent);
                setTimeout((abil.m_fCastPoint + 1 / 30) * 1000, () => flag = false);
            }
            return true;
        });
    });
}
Events.RegisterCallback("onNPCCreated", (npc) => {
    if (LocalDOTAPlayer === undefined)
        return;
    if (npc.IsEnemy(LocalDOTAPlayer)
        && (npc.m_bIsCreep
            || (npc.m_bIsHero
                && !npc.m_bIsIllusion
                && npc.m_hReplicatingOtherHeroModel === undefined)))
        possible_targets.push(npc);
});
Events.RegisterCallback("onEntityDestroyed", (ent) => {
    if (LocalDOTAPlayer === undefined)
        return;
    if (ent.m_bIsDOTANPC
        && ent.IsEnemy(LocalDOTAPlayer)
        && (ent.m_bIsCreep
            || (ent.m_bIsHero
                && !ent.m_bIsIllusion
                && ent.m_hReplicatingOtherHeroModel === undefined)))
        possible_targets.splice(possible_targets.indexOf(ent), 1);
});
Events.RegisterCallback("onGameEnded", () => {
    abils.forEach(abilData => delete abilData.abil);
    possible_targets = [];
});
Events.RegisterCallback("onUpdate", OnUpdate);
Menu.AddEntryEz("AutoSteal", {
    enabled: {
        name: "State:",
        value: config.enabled,
        type: "toggle"
    }
}, (name, value) => config[name] = value);
