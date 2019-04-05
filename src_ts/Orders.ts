/*!
 * Created on Wed Oct 16 2018
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

var debugAnimations = true
/**
 * @param ent entity that must issue order [can be overriden by orderIssuer]
 * @param vec position
 * @param queue does order needs to be queued? [uses backswing]
 */
export function MoveToPos(ent: C_DOTA_BaseNPC, vec: Vector, queue: boolean = true) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION,
		Unit: ent,
		Position: vec,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
}

/**
 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
 * @param {Vector} vec position
 * @param {bool} queue does order needs to be queued? [uses backswing]
 */
export function MoveToDirection(ent: C_DOTA_BaseNPC, vec: Vector, queue: boolean = true) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION,
		Unit: ent,
		Position: vec,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
}

/**
 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
 * @param {Vector} vec position
 * @param {bool} queue does order needs to be queued? [uses backswing]
 */
export function RotateToPos(ent: C_DOTA_BaseNPC, vec: Vector, queue: boolean = true) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION,
		Unit: ent,
		Position: vec,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
	EntStop(ent, queue)
}

/**
 * @param {Entity | number} ent entity that must issue order
 * @param {Entity | number} target target entity
 * @param {bool} queue does order needs to be queued? [uses backswing]
 */
export function MoveToTarget(ent: C_DOTA_BaseNPC, target: C_DOTA_BaseNPC, queue: boolean = true) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET,
		Unit: ent,
		Target: target,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
}

/**
 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
 * @param {Vector} vec position
 * @param {bool} queue does order needs to be queued? [uses backswing]
 */
export function MoveToAttackPos(ent: C_DOTA_BaseNPC, vec: Vector, queue: boolean = true) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE,
		Unit: ent,
		Position: vec,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
}

/**
 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
 * @param {Entity | number} target target entity
 * @param {bool} queue does order needs to be queued? [uses backswing]
 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
 */
export function AttackTarget(ent: C_DOTA_BaseNPC, target: C_DOTA_BaseNPC, queue: boolean = true) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET,
		Unit: ent,
		Target: target,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
}

/**
 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
 * @param {bool} queue does order needs to be queued? [uses backswing]
 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
 */
export function EntStop(ent: C_DOTA_BaseNPC, queue: boolean = true) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_STOP,
		Unit: ent,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
}

/**
 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
 * @param {Entity | number} target target entity
 * @param {bool} queue does order needs to be queued? [uses backswing]
 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
 */
export function PickupItem(ent: C_DOTA_BaseNPC, target: C_DOTA_BaseNPC, queue: boolean = true) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM,
		Unit: ent,
		Target: target,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
}

/**
 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
 * @param {Entity | number} target target entity
 * @param {bool} queue does order needs to be queued? [uses backswing]
 * @param {PlayerOrderIssuer_t} orderIssuer lookup PlayerOrderIssuer_t enum
 */
export function PickupRune(ent: C_DOTA_BaseNPC, target: C_DOTA_Item_Rune, queue: boolean = true) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE,
		Unit: ent,
		Target: target,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
}

/**
 * @param {Entity | number} ent entity that must issue order
 * @param {Entity | number} target target entity
 * @param {Ability | number} abil ability
 * @param {bool} queue does order needs to be queued? [uses backswing]
 */
export function CastTarget(ent: C_DOTA_BaseNPC, abil: C_DOTABaseAbility, target: C_DOTA_BaseNPC, queue: boolean = true) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
		Unit: ent,
		Target: target,
		Ability: abil,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
}

/**
 * @param {Entity | number} ent entity that must issue order
 * @param {Entity | number} target target entity
 * @param {Ability | number} abil ability
 * @param {bool} queue does order needs to be queued? [uses backswing]
 */
export function CastTargetTree(ent: C_DOTA_BaseNPC, abil: C_DOTABaseAbility, target: C_DOTA_BaseNPC, queue: boolean = true) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE,
		Unit: ent,
		Target: target,
		Ability: abil,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
}

/**
 * @param {Entity | number} ent entity that must issue order
 * @param {Ability | number} abil ability
 * @param {Vector} vec position
 * @param {bool} queue does order needs to be queued? [uses backswing]
 */
export function CastPosition(ent: C_DOTA_BaseNPC, abil: C_DOTABaseAbility, vec: Vector, queue: boolean = true) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
		Unit: ent,
		Position: vec,
		Ability: abil,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
}

/**
 * @param {Entity | number} ent entity that must issue order
 * @param {Ability | number} abil ability
 * @param {bool} queue does order needs to be queued? [uses backswing]
 */
export function CastNoTarget(ent: C_DOTA_BaseNPC, abil: C_DOTABaseAbility, queue: boolean = true) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
		Unit: ent,
		Ability: abil,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
}

/**
 * @param {Entity | number} ent entity that must issue order
 * @param {Ability | number} abil ability
 * @param {bool} queue does order needs to be queued? [uses backswing]
 */
export function ToggleAbil(ent: C_DOTA_BaseNPC, abil: C_DOTABaseAbility, queue: boolean = true) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE,
		Unit: ent,
		Ability: abil,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
}

/**
 * @param {Entity | number} ent entity that must issue order [can be overriden by orderIssuer]
 * @param {Item | number} item item to move
 * @param {number} slot_id target slot ID
 * @param {bool} queue does order needs to be queued? [uses backswing]
 */
/*export function MoveItem(ent: C_DOTA_BaseNPC, item: C_DOTA_Item, slot_id: number, queue: boolean) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM,
		Unit: ent,
		Ability: item,
		TargetIndex: slot_id,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
},*/

/**
 * @param {Entity | number} ent entity that must issue order
 * @param {Entity | number} target target item
 * @param {Vector} vec position
 * @param {bool} queue does order needs to be queued? [uses backswing]
 */
export function DropItem(ent: C_DOTA_BaseNPC, target: C_DOTA_BaseNPC, vec: Vector, queue: boolean) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM,
		Unit: ent,
		Position: vec,
		Ability: target,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
}

	/**
	 * @param {Entity | number} ent entity that must issue order
	 * @param {Entity | number} target target item
	 * @param {bool} queue does order needs to be queued? [uses backswing]
	 */
export function ItemLock(ent: C_DOTA_BaseNPC, target: C_DOTA_BaseNPC, queue: boolean) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK,
		Unit: ent,
		Target: target,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
}

/**
 * @param {Entity | number} ent entity that must issue order
 * @param {number} itemid Item ID [lookup scripts/npc/items.txt]
 */
/*export function PurchaseItem(ent: C_DOTA_BaseNPC, itemid: number) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_PURCHASE_ITEM,
		Unit: ent,
		AbilityIndex: itemid,
		Queue: false,
		ShowEffects: debugAnimations,
	})
}*/
