/*!
 * Created on Wed Oct 10 2018
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
import { GetItemByRegexp, ensureUtilsLoaded } from "./utils";
ensureUtilsLoaded();
const rmine_trigger_radius = 425, rmine_blow_delay = .25, forcestaff_units = 600;
var config = {
    enabled: true,
    explode_seen_mines: true,
    explode_expiring_mines: false,
    safe_mode: true,
    use_prediction: false,
    auto_stack: true,
    auto_stack_range: 300
}, NoTarget = [], particles = [], rmines = [], heroes = [], techies;
function CreateRange(ent, range) {
    const par = Particles.Create("particles/ui_mouseactions/range_display.vpcf", 1 /* PATTACH_ABSORIGIN_FOLLOW */, ent);
    Particles.SetControlPoint(par, 1, new Vector(range, 0, 0));
    return par;
}
function RemoveMine(rmine) {
    const ar = rmines.filter(([rmine2]) => rmine2 === rmine);
    if (ar.length === 1)
        rmines.splice(rmines.indexOf(ar[0]), 1);
}
function ExplodeMine(rmine) {
    SelectUnit(rmine, false);
    PrepareUnitOrders({
        OrderType: 8 /* DOTA_UNIT_ORDER_CAST_NO_TARGET */,
        Ability: rmine.GetAbilityByName("techies_remote_mines_self_detonate"),
        Unit: rmine,
        Queue: false
    });
    RemoveMine(rmine);
}
function TryDagon(techies, ent, damage = 0, damage_type = 0 /* DAMAGE_TYPE_NONE */) {
    var Dagon = GetItemByRegexp(techies, /item_dagon/), TargetHP = ent.m_iHealth + Math.min(ent.m_flHealthThinkRegen * rmine_blow_delay, ent.m_iMaxHealth - ent.m_iHealth);
    if (Dagon)
        if (Dagon.m_fCooldown === 0 && TargetHP < ent.CalculateDamage(Dagon.GetSpecialValue("damage"), 2 /* DAMAGE_TYPE_MAGICAL */) + ent.CalculateDamage(damage, damage_type) && techies.IsInRange(ent, Dagon.m_iCastRange)) {
            SelectUnit(techies, false);
            PrepareUnitOrders({
                OrderType: 6 /* DOTA_UNIT_ORDER_CAST_TARGET */,
                Ability: Dagon,
                Target: ent,
                Unit: techies,
                Queue: false
            });
            return true;
        }
    return false;
}
function CallMines(techies, ent, callback, explosionCallback) {
    var TargetHP = ent.m_iHealth + Math.min(ent.m_flHealthThinkRegen * rmine_blow_delay, ent.m_iMaxHealth - ent.m_iHealth), cur_time = GameRules.m_fGameTime, RMinesToBlow = [], RMinesDmg = 0;
    rmines.filter(([rmine, dmg, setup_time]) => cur_time > setup_time && callback(techies, ent, rmine)).every(([rmine, dmg]) => {
        RMinesToBlow.push(rmine);
        RMinesDmg += dmg;
        var theres = ent.CalculateDamage(RMinesDmg, 2 /* DAMAGE_TYPE_MAGICAL */);
        //console.log("EzTechiesAuto", `There's ${theres}, needed ${TargetHP} for ${ent.m_iszUnitName}`)
        if (TargetHP < theres) {
            explosionCallback(techies, ent, RMinesToBlow, RMinesDmg);
            return false;
        }
        else
            return !TryDagon(techies, ent, RMinesDmg, 2 /* DAMAGE_TYPE_MAGICAL */);
    });
}
function NeedToTriggerMine(rmine, ent, forcestaff = false) {
    var TriggerRadius = rmine_trigger_radius;
    if (config.safe_mode)
        TriggerRadius -= ent.m_fIdealSpeed * (rmine_blow_delay / 30);
    return config.use_prediction
        ? ent.InFront((ent.m_bIsMoving * rmine_blow_delay) + (forcestaff ? forcestaff_units : 0)).DistTo(rmine.m_vecNetworkOrigin) <= TriggerRadius
        : forcestaff
            ? rmine.m_vecNetworkOrigin.DistTo(ent.InFront(forcestaff_units)) <= TriggerRadius
            : rmine.IsInRange(ent, TriggerRadius);
}
function OnUpdate() {
    if (!config.enabled || techies === undefined || IsPaused())
        return;
    var cur_time = GameRules.m_fGameTime;
    rmines = rmines.filter(([rmine]) => rmine.m_bIsAlive);
    if (config.explode_expiring_mines) {
        const rmineTimeout = 595; // 600 is mine duration
        for (let [mine, dmg, setup_time] of rmines)
            if (cur_time > setup_time + rmineTimeout)
                ExplodeMine(mine);
    }
    if (config.explode_seen_mines)
        for (let [mine, dmg, setup_time, invis_time] of rmines)
            if (mine.m_bIsVisibleForEnemies && cur_time > invis_time)
                ExplodeMine(mine);
    rmines.filter(([rmine]) => rmine.m_iHealth !== rmine.m_iMaxHealth).forEach(([rmine]) => ExplodeMine(rmine));
    heroes.filter(ent => ent.m_bIsAlive
        && ent.m_bIsVisible
        && ent.m_fMagicMultiplier !== 0
        && NoTarget.indexOf(ent) === -1).forEach(ent => {
        var callbackCalled = false;
        CallMines(techies, ent, (techies, ent, rmine) => NeedToTriggerMine(rmine, ent), (techies, ent, RMinesToBlow) => {
            callbackCalled = true;
            RMinesToBlow.forEach(rmine => ExplodeMine(rmine), false);
            NoTarget.push(ent);
            setTimeout((rmine_blow_delay + 0.2) * 1000, () => NoTarget.splice(NoTarget.indexOf(ent), 1));
        });
        var force = techies.GetItemByName("item_force_staff");
        if (!callbackCalled && force !== undefined && techies.m_bIsAlive && force.m_fCooldown === 0
            && techies.IsInRange(ent, force.m_iCastRange))
            CallMines(techies, ent, (techies, ent, rmine) => NeedToTriggerMine(rmine, ent, true), (techies, ent) => {
                SelectUnit(techies, false);
                PrepareUnitOrders({
                    OrderType: 6 /* DOTA_UNIT_ORDER_CAST_TARGET */,
                    Ability: force,
                    Target: ent,
                    Unit: techies,
                    Queue: false
                });
            });
    });
}
function CreateParticleFor(npc) {
    var range = 400; // same for land mines and stasis traps
    switch (npc.m_iszUnitName) {
        case "npc_dota_techies_remote_mine":
            range = rmine_trigger_radius * (config.safe_mode ? 0.85 : 1);
        case "npc_dota_techies_stasis_trap":
        case "npc_dota_techies_land_mine":
            particles[npc.m_iID] = CreateRange(npc, range);
        default:
            break;
    }
}
function RegisterMine(npc) {
    const ar = rmines.filter(([rmine2]) => rmine2 === npc);
    if (ar.length !== 0) {
        console.log(`Tried to register existing mine ${npc.m_iID}`);
        return;
    }
    const Ulti = techies !== undefined ? techies.GetAbilityByName("techies_remote_mines") : undefined;
    rmines.push([
        npc,
        Ulti ?
            Ulti.GetSpecialValue("damage" + (techies.m_bHasScepter ? "_scepter" : ""))
            : 0,
        GameRules.m_fGameTime + (Ulti ? Ulti.m_fCastPoint : 0) + 0.1,
        GameRules.m_fGameTime + (Ulti ? Ulti.GetSpecialValue("activation_time") + Ulti.m_fCastPoint : 0) + 0.2
    ]);
}
Events.RegisterCallback("onUpdate", OnUpdate);
Events.RegisterCallback("onGameStarted", () => {
    var local_ent = LocalDOTAPlayer.m_hAssignedHero;
    if (local_ent.m_iHeroID === 105 /* npc_dota_hero_techies */)
        techies = local_ent;
    Entities.GetAllEntities().filter(ent => ent.m_bIsDOTANPC).forEach(ent => CreateParticleFor(ent));
    heroes = Entities.GetAllEntities().filter(ent => ent.m_bIsDOTANPC
        && ent.IsEnemy(LocalDOTAPlayer)
        && ent.m_bIsHero
        && !ent.m_bIsIllusion
        && ent.m_hReplicatingOtherHeroModel === undefined);
    Entities.GetAllEntities()
        .filter(ent => !ent.IsEnemy(LocalDOTAPlayer)
        && ent.m_bIsDOTANPC
        && ent.m_bIsTechiesRemoteMine)
        .forEach(ent => RegisterMine(ent));
});
Events.RegisterCallback("onGameEnded", () => {
    rmines = [];
    particles.forEach(particle => Particles.Destroy(particle, true));
    particles = [];
    NoTarget = [];
    heroes = [];
    techies = undefined;
});
Events.RegisterCallback("onPrepareUnitOrders", (args) => {
    if (!config.auto_stack)
        return true;
    if (args.order_type !== 5 /* DOTA_UNIT_ORDER_CAST_POSITION */
        || args.position === undefined
        || args.ability === undefined
        || args.ability.m_sAbilityName !== "techies_remote_mines")
        return true;
    var ents = args.position.GetEntitiesInRange(config.auto_stack_range);
    var mine_pos;
    if (ents.some(ent => {
        var is_mine = ent.m_bIsDOTANPC && ent.m_bIsTechiesRemoteMine && ent.m_bIsAlive;
        if (is_mine)
            mine_pos = ent.m_vecNetworkOrigin;
        return is_mine;
    })) {
        if (mine_pos === args.position)
            return true;
        PrepareUnitOrders({
            OrderType: 5 /* DOTA_UNIT_ORDER_CAST_POSITION */,
            Ability: args.ability,
            Unit: args.unit,
            Position: mine_pos,
            Queue: args.queue,
            ShowEffects: true
        });
        return false;
    }
    return true;
});
Events.RegisterCallback("onNPCCreated", (npc) => {
    if (npc.m_bIsHero && npc.IsEnemy(LocalDOTAPlayer)) {
        if (!npc.m_bIsIllusion && npc.m_hReplicatingOtherHeroModel === undefined)
            heroes.push(npc);
        return;
    }
    if (npc.IsEnemy(LocalDOTAPlayer))
        return;
    CreateParticleFor(npc);
    if (npc.m_bIsTechiesRemoteMine)
        RegisterMine(npc);
});
Events.RegisterCallback("onEntityDestroyed", (ent) => {
    if (!ent.m_bIsDOTANPC)
        return;
    let npc = ent;
    if (npc.m_bIsTechiesRemoteMine) {
        let rmine = ent;
        if (particles[rmine.m_iID] !== undefined)
            Particles.Destroy(particles[rmine.m_iID], true);
        RemoveMine(rmine);
    }
    if (npc.m_bIsHero) {
        let hero = ent;
        if (heroes.indexOf(hero) !== -1)
            heroes.splice(heroes.indexOf(hero), 1);
    }
});
Menu.AddEntryEz("EzTechies", {
    enabled: {
        name: "State:",
        value: config.enabled,
        type: "toggle"
    },
    explode_seen_mines: {
        name: "Explode seen mines",
        value: config.explode_seen_mines,
        type: "boolean"
    },
    explode_expiring_mines: {
        name: "Explode expiring mines:",
        value: config.explode_expiring_mines,
        type: "boolean"
    },
    safe_mode: {
        name: "Safe mode",
        hint: "Reduces explosion radius based on hero speed",
        value: config.safe_mode,
        type: "boolean"
    },
    use_prediction: {
        name: "Use prediction",
        hint: "Uses forward prediction of hero moves",
        value: config.use_prediction,
        type: "boolean"
    },
    auto_stack: {
        name: "Autostack mines:",
        hint: "Automatically stacks mines in place",
        value: config.auto_stack,
        type: "boolean"
    },
    auto_stack_range: {
        name: "Autostack range:",
        hint: "Range where autostack will try to find other mines",
        min: 50,
        value: config.auto_stack_range,
        max: 1000,
        type: "slider_float"
    }
}, (name, value) => {
    config[name] = value;
    if (name === "safe_mode") {
        for (let ent_id in particles) {
            Particles.Destroy(particles[ent_id], true);
            CreateParticleFor(Entities.GetByID(parseInt(ent_id)));
        }
    }
});
