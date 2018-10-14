/*!
 * Created on Wed Oct 12 2018
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
import { orderBy, ensureUtilsLoaded } from "./utils";
ensureUtilsLoaded();
var config = {
    block_sensitivity: 500,
    block_delay: 0.01
}, last_time = Number.MIN_SAFE_INTEGER, lane_creeps = [], towers = [], enabled = false;
Events.RegisterCallback("onPrepareUnitOrders", (args) => !args.from_script && enabled
    ? args.order_type !== 1 /* DOTA_UNIT_ORDER_MOVE_TO_POSITION */
        && args.order_type !== 28 /* DOTA_UNIT_ORDER_MOVE_TO_DIRECTION */
    : true);
Events.RegisterCallback("onUpdate", () => {
    if (!enabled || GameRules.m_fGameTime < last_time + config.block_delay)
        return;
    last_time = GameRules.m_fGameTime;
    var MyEnt = LocalDOTAPlayer.m_hAssignedHero;
    if (MyEnt === undefined || !MyEnt.m_bIsAlive || IsPaused())
        return;
    lane_creeps = lane_creeps.filter(creep => creep.m_bIsWaitingToSpawn || creep.m_bIsAlive);
    towers = towers.filter(tower => tower.m_bIsAlive);
    var creeps = lane_creeps.filter(creep => !creep.m_bIsWaitingToSpawn && MyEnt.IsInRange(creep, 500));
    if (creeps.length === 0)
        return;
    var creepsMovePositionSum = creeps.map(creep => creep.InFront(300)).map(vec => [vec.x, vec.z, vec.y]).reduce((sum, vec) => sum ? [sum[0] + vec[0], sum[1] + vec[1], sum[2] + vec[2]] : vec), creepsMovePosition = new Vector(creepsMovePositionSum[0] / creeps.length, creepsMovePositionSum[1] / creeps.length, creepsMovePositionSum[2] / creeps.length), tower = towers.filter(ent => MyEnt.IsInRange(ent, 120)), need_select = false; //LocalDOTAPlayer.m_nSelectedUnits[0] !== MyEnt
    if (tower.length > 0 && tower[0].m_iszUnitName === "npc_dota_badguys_tower2_mid") {
        if (need_select)
            SelectUnit(MyEnt, false);
        PrepareUnitOrders({
            OrderType: 1 /* DOTA_UNIT_ORDER_MOVE_TO_POSITION */,
            Position: creepsMovePosition,
            Unit: MyEnt,
            Queue: false
        });
        return;
    }
    var flag = true;
    orderBy(creeps, creep => creep.DistTo(MyEnt)).every(creep => {
        if (!creep.m_bIsMoving && !creep.IsInRange(MyEnt, 50))
            return true;
        var creepDistance = creepsMovePosition.DistTo(creep.m_vecNetworkOrigin) + 50, heroDistance = creepsMovePosition.DistTo(MyEnt.m_vecNetworkOrigin), creepAngle = creep.FindRotationAngle(MyEnt.m_vecNetworkOrigin);
        if (creepDistance < heroDistance && creepAngle > 2 || creepAngle > 2.5)
            return true;
        var moveDistance = config.block_sensitivity / MyEnt.m_fIdealSpeed * 100;
        if (MyEnt.m_fIdealSpeed - creep.m_fIdealSpeed > 50)
            moveDistance -= (MyEnt.m_fIdealSpeed - creep.m_fIdealSpeed) / 2;
        var movePosition = creep.InFront(Math.max(moveDistance, moveDistance * creepAngle));
        if (movePosition.DistTo(creepsMovePosition) - 50 > heroDistance)
            return true;
        if (creepAngle < 0.2 && MyEnt.m_bIsMoving)
            return true;
        if (need_select)
            SelectUnit(MyEnt, false);
        PrepareUnitOrders({
            OrderType: 1 /* DOTA_UNIT_ORDER_MOVE_TO_POSITION */,
            Position: movePosition,
            Unit: MyEnt,
            Queue: false
        });
        flag = false;
        return false;
    });
    if (!flag)
        return;
    if (MyEnt.m_bIsMoving) {
        if (need_select)
            SelectUnit(MyEnt, false);
        PrepareUnitOrders({
            OrderType: 21 /* DOTA_UNIT_ORDER_STOP */,
            Unit: MyEnt,
            Queue: false
        });
    }
    else if (MyEnt.FindRotationAngle(creepsMovePosition) > 1.5) {
        if (need_select)
            SelectUnit(MyEnt, false);
        PrepareUnitOrders({
            OrderType: 1 /* DOTA_UNIT_ORDER_MOVE_TO_POSITION */,
            Position: MyEnt.m_vecNetworkOrigin.ExtendVector(creepsMovePosition, 10),
            Unit: MyEnt,
            Queue: false
        });
    }
});
Events.RegisterCallback("onNPCCreated", (npc) => {
    if (npc.m_bIsLaneCreep && !npc.IsEnemy(LocalDOTAPlayer))
        lane_creeps.push(npc);
    if (npc.m_bIsTower)
        towers.push(npc);
});
Events.RegisterCallback("onEntityDestroyed", (ent) => {
    if (!ent.m_bIsDOTANPC)
        return;
    if (ent.m_bIsLaneCreep && !ent.IsEnemy(LocalDOTAPlayer))
        lane_creeps.splice(lane_creeps.indexOf(ent), 1);
    if (ent.m_bIsTower)
        towers.splice(towers.indexOf(ent), 1);
});
Events.RegisterCallback("onWndProc", (message_type, wParam, l_param) => {
    if (wParam === undefined || String.fromCharCode(parseInt(wParam)) !== "N")
        return;
    if (message_type === 0x100) // WM_KEYDOWN
        enabled = true;
    else if (message_type === 0x0101) // WM_KEYUP
        enabled = false;
});
Menu.AddEntryEz("CreepBlock", {
    block_sensitivity: {
        name: "Block sensitivity:",
        hint: "Bigger value will result in smaller block, but with higher success rate",
        min: 500,
        value: config.block_sensitivity,
        max: 700,
        type: "slider_float"
    },
    block_delay: {
        name: "Delay between orders",
        min: 0.01,
        value: config.block_delay,
        max: 1,
        type: "slider_float"
    }
}, (name, value) => config[name] = value);
