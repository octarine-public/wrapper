import Vector3 from "../Base/Vector3"
import { dotaunitorder_t } from "../Enums/dotaunitorder_t"
import EventsSDK from "../Managers/EventsSDK"
import Ability from "../Objects/Base/Ability"
import Entity from "../Objects/Base/Entity"
import TempTree from "../Objects/Base/TempTree"
import Tree from "../Objects/Base/Tree"
import Unit from "../Objects/Base/Unit"
import { arrayRemoveCallback } from "../Utils/ArrayExtensions"
import * as WASM from "./WASM"

export const ORDERS_WITHOUT_SIDE_EFFECTS = [
	dotaunitorder_t.DOTA_UNIT_ORDER_TRAIN_ABILITY,
	dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE,
	dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO,
	dotaunitorder_t.DOTA_UNIT_ORDER_PURCHASE_ITEM,
	dotaunitorder_t.DOTA_UNIT_ORDER_DISASSEMBLE_ITEM,
	dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK,
	dotaunitorder_t.DOTA_UNIT_ORDER_SELL_ITEM,
	dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM,
	dotaunitorder_t.DOTA_UNIT_ORDER_EJECT_ITEM_FROM_STASH,
	dotaunitorder_t.DOTA_UNIT_ORDER_CONTINUE,
	dotaunitorder_t.DOTA_UNIT_ORDER_GLYPH,
	dotaunitorder_t.DOTA_UNIT_ORDER_RADAR,
]

function WillInterruptOrderQueue(order: ExecuteOrder): boolean {
	switch (order.OrderType) {
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_RUNE:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET:
		case dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_STOP:
		case dotaunitorder_t.DOTA_UNIT_ORDER_PATROL:
		case dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM:
		case dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE:
		case dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_POSITION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_CANCELED:
		case dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM:
		case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE:
		case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET:
		case dotaunitorder_t.DOTA_UNIT_ORDER_BUYBACK:
			return true
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET: {
			const abil = order.Ability
			return abil instanceof Ability && (abil.CastPoint > 0 || abil.MaxChannelTime > 0)
		}
		default:
			return false
	}
}

function CanBeIgnored(order: ExecuteOrder): boolean {
	switch (order.OrderType) {
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET:
		case dotaunitorder_t.DOTA_UNIT_ORDER_HOLD_POSITION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_PATROL:
		case dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM:
		case dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE:
		case dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_POSITION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_CANCELED:
		case dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM:
		case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE:
		case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET:
			return true
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION: {
			const issuer = order.Issuers[0],
				abil = order.Ability
			if (issuer === undefined || !(abil instanceof Ability) || abil.IsCastRangeFake)
				return false
			const target = order.Target
			if (typeof target === "number")
				return false
			const target_pos = target !== undefined
				? target.Position
				: order.Position
			return issuer.Distance2D(target_pos) > abil.CastRange
		}
		default:
			return order.Queue
	}
}

export default class ExecuteOrder {
	public static readonly order_queue: [ExecuteOrder, number, boolean][] = []
	public static debug_orders = false
	public static debug_draw = false
	public static hold_orders = 0
	public static hold_orders_target: Nullable<Vector3 | Entity>
	public static camera_minimap_spaces = 3 // 2 => 5
	public static camera_speed = 8000 // 5000 => 20000
	public static cursor_speed = 6 // ?
	public static cursor_speed_min_accel = 1 //?
	public static cursor_speed_max_accel = 2 // ?
	public static prefire_orders = true
	public static is_standalone = false
	public static unsafe_mode = false
	public static get disable_humanizer() {
		return this.disable_humanizer_
	}
	public static set disable_humanizer(new_val: boolean) {
		if (this.disable_humanizer_ === new_val)
			return
		this.disable_humanizer_ = new_val
		ToggleRequestUserCmd(!this.disable_humanizer_)
		EventsSDK.emit("HumanizerStateChanged", false)
	}
	public static PrepareOrder(order: {
		orderType: dotaunitorder_t,
		target?: Entity | number,
		position?: Vector3,
		ability?: Ability | number,
		issuers?: Unit[],
		queue?: boolean,
		showEffects?: boolean,
	}): void {
		ExecuteOrder.fromObject(order).ExecuteQueued()
	}
	public static Buyback(queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_BUYBACK, queue, showEffects })
	}
	public static Glyph(queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_GLYPH, queue, showEffects })
	}
	public static CastRiverPaint(position: Vector3, queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_RIVER_PAINT, position, queue, showEffects })
	}
	public static PreGameAdjustItemAssigment(ItemID: number, queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PREGAME_ADJUST_ITEM_ASSIGNMENT, target: ItemID, queue, showEffects })
	}
	public static Scan(position: Vector3, queue?: boolean, showEffects?: boolean): void {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_RADAR, position, queue, showEffects })
	}

	public static fromObject(order: {
		orderType: dotaunitorder_t,
		target?: Entity | number,
		position?: Vector3,
		ability?: Ability | number,
		issuers?: Unit[],
		queue?: boolean,
		showEffects?: boolean,
	}): ExecuteOrder {
		return new ExecuteOrder(
			order.orderType,
			order.target,
			order.position,
			order.ability,
			order.issuers ?? [],
			order.queue,
			order.showEffects,
		)
	}

	private static disable_humanizer_ = false

	/**
	 * Orders by native CUnitOrder
	 * @param position default: new Vector3(0,0,0)
	 * @param issuer default: DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY
	 */
	constructor(
		public readonly OrderType: dotaunitorder_t,
		public readonly Target: Nullable<Entity | number>,
		public readonly Position: Vector3 = new Vector3(),
		// tslint:disable-next-line: no-shadowed-variable
		public readonly Ability: Nullable<Ability | number>,
		public readonly Issuers: Unit[],
		public readonly Queue: boolean = false,
		public readonly ShowEffects: boolean = false,
		public IsPlayerInput: boolean = true,
	) {
		this.Position = this.Position.Clone()
	}

	/**
	 * pass Position: Vector3 at IOBuffer offset 0
	 */
	public toNative() {
		const target = this.Target,
			ability = this.Ability

		return {
			OrderType: this.OrderType,
			Target: target instanceof Entity
				? target instanceof Tree || target instanceof TempTree
					? target.BinaryID
					: target.Index
				: target,
			Ability: ability instanceof Ability ? ability.Index : ability,
			Issuers: this.Issuers.map(ent => ent.Index),
			Queue: this.Queue,
			ShowEffects: this.ShowEffects,
		}
	}
	/**
	 * Execute order with this fields
	 */
	public Execute(): void {
		this.Position.toIOBuffer()
		PrepareUnitOrders(this.toNative())
	}
	public ExecuteQueued(): void {
		if (ExecuteOrder.unsafe_mode) {
			this.Execute()
			return
		}
		if (ExecuteOrder.disable_humanizer) {
			if (this.OrderType === dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET)
				this.Execute()
			return
		}
		let set_z = false
		switch (this.OrderType) {
			case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE:
			case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION:
			case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION:
			case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION:
			case dotaunitorder_t.DOTA_UNIT_ORDER_PATROL:
			case dotaunitorder_t.DOTA_UNIT_ORDER_RADAR:
			case dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_POSITION:
				set_z = true
				break
			case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET:
			case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET:
			case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE:
			case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET:
			case dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM:
			case dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE:
			case dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM:
				if (!(this.Target instanceof Entity))
					set_z = true
				break
			default:
				break
		}
		if (set_z) {
			this.Position.SetZ(WASM.GetPositionHeight(this.Position))
			const height_map = WASM.HeightMap
			if (this.Position.z < -1024 || (height_map !== undefined && !height_map.Contains(this.Position)))
				return
		}
		if (!this.Queue) {
			if (!WillInterruptOrderQueue(this)) {
				this.Execute()
				return
			} else
				while (arrayRemoveCallback(
					ExecuteOrder.order_queue,
					([order], i) => (
						i !== 0
						&& (
							order.Issuers.every(unit => this.Issuers.includes(unit))
							|| (
								order.Issuers.length === 1
								&& this.Issuers.includes(order.Issuers[0])
							)
						)
						&& CanBeIgnored(order)
					),
				))
					continue
		}
		ExecuteOrder.order_queue.push([this, hrtime(), false])
	}

	public toJSON(): {
		OrderType: dotaunitorder_t,
		Target: Nullable<Entity | number>,
		Position: Vector3,
		Ability: Nullable<Ability | number>,
		Issuers: Unit[],
		Queue: boolean,
		ShowEffects: boolean,
	} {
		return {
			OrderType: this.OrderType,
			Target: this.Target,
			Position: this.Position,
			Ability: this.Ability,
			Issuers: this.Issuers,
			Queue: this.Queue,
			ShowEffects: this.ShowEffects,
		}
	}
}
