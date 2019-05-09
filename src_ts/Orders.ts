import * as Utils from "Utils"

var debugAnimations = false
/**
 * @param ent entity that must issue order [can be overriden by orderIssuer]
 * @param vec position
 * @param queue does order needs to be queued? [uses backswing]
 */
export function MoveToPos(ent: C_DOTA_BaseNPC, vec: Vector3, queue: boolean = true) {
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
 * @param {Vector3} vec position
 * @param {bool} queue does order needs to be queued? [uses backswing]
 */
export function MoveToDirection(ent: C_DOTA_BaseNPC, vec: Vector3, queue: boolean = true) {
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
 * @param {Vector3} vec position
 * @param {bool} queue does order needs to be queued? [uses backswing]
 */
export function RotateToPos(ent: C_DOTA_BaseNPC, vec: Vector3, queue: boolean = true) {
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
 * @param {Vector3} vec position
 * @param {bool} queue does order needs to be queued? [uses backswing]
 */
export function MoveToAttackPos(ent: C_DOTA_BaseNPC, vec: Vector3, queue: boolean = true) {
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
export function PickupItem(ent: C_DOTA_BaseNPC, target: C_DOTA_Item_Physical, queue: boolean = true) {
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
export function CastTargetTree(ent: C_DOTA_BaseNPC, abil: C_DOTABaseAbility, target: C_DOTA_BaseNPC | number, queue: boolean = true) {
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
 * @param {Vector3} vec position
 * @param {bool} queue does order needs to be queued? [uses backswing]
 */
export function CastPosition(ent: C_DOTA_BaseNPC, abil: C_DOTABaseAbility, vec: Vector3, queue: boolean = true) {
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
export function MoveItem(ent: C_DOTA_BaseNPC, item: C_DOTA_Item, slot_id: number, queue: boolean) {
	PrepareUnitOrders({
		OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM,
		Unit: ent,
		Ability: item,
		Target: slot_id,
		Queue: queue,
		ShowEffects: debugAnimations,
	})
}

/**
 * @param {Entity | number} ent entity that must issue order
 * @param {Entity | number} target target item
 * @param {Vector3} vec position
 * @param {bool} queue does order needs to be queued? [uses backswing]
 */
export function DropItem(ent: C_DOTA_BaseNPC, target: C_DOTA_BaseNPC, vec: Vector3, queue: boolean) {
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

export function SmartCast(caster: C_DOTA_BaseNPC, abil: C_DOTABaseAbility, target?: C_DOTA_BaseNPC): void {
	var Behavior = abil.m_pAbilityData.m_iAbilityBehavior
	if (Utils.IsFlagSet(Behavior, BigInt(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET)))
		CastNoTarget(caster, abil, false)
	else if (Utils.IsFlagSet(Behavior, BigInt(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET)) || Behavior === BigInt(0))
		CastTarget(caster, abil, target, false)
	else if (Utils.IsFlagSet(Behavior, BigInt(DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT)))
		CastPosition(caster, abil, Utils.VelocityWaypoint(target, abil.m_fCastPoint), false)
}
