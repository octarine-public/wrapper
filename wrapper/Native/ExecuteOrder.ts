import Color from "../Base/Color"
import QAngle from "../Base/QAngle"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import { dotaunitorder_t } from "../Enums/dotaunitorder_t"
import EntityManager from "../Managers/EntityManager"
import Events from "../Managers/Events"
import EventsSDK from "../Managers/EventsSDK"
import InputManager from "../Managers/InputManager"
import ParticlesSDK from "../Managers/ParticleManager"
import Ability from "../Objects/Base/Ability"
import Entity, { LocalPlayer } from "../Objects/Base/Entity"
import TempTree from "../Objects/Base/TempTree"
import Tree from "../Objects/Base/Tree"
import Unit from "../Objects/Base/Unit"
import RendererSDK from "./RendererSDK"
import UserCmd from "./UserCmd"
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

export default class ExecuteOrder {
	public static order_queue: ExecuteOrder[] = []
	public static wait_near_cursor = false
	public static queue_user_orders = false
	public static debug_orders = false
	public static debug_draw = false
	public static disable_humanizer = false
	public static PrepareOrder(order: {
		orderType: dotaunitorder_t,
		target?: Entity | number,
		position?: Vector3,
		ability?: Ability | number,
		issuers?: Unit[],
		queue?: boolean,
		showEffects?: boolean,
	}): ExecuteOrder {
		return ExecuteOrder.fromObject(order).ExecuteQueued()
	}
	public static Buyback(queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_BUYBACK, queue, showEffects })
	}
	public static Glyph(queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_GLYPH, queue, showEffects })
	}
	public static CastRiverPaint(position: Vector3, queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_RIVER_PAINT, position, queue, showEffects })
	}
	public static PreGameAdjustItemAssigment(ItemID: number, queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PREGAME_ADJUST_ITEM_ASSIGNMENT, target: ItemID, queue, showEffects })
	}
	public static Scan(position: Vector3, queue?: boolean, showEffects?: boolean): ExecuteOrder {
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

	public static fromNative(): ExecuteOrder {
		const issuers_size = ExecuteOrder.LatestUnitOrder_view.getUint32(26, true)
		const issuers: Unit[] = []
		for (let i = 0; i < issuers_size; i++) {
			const ent_id = ExecuteOrder.LatestUnitOrder_view.getUint32(30 + (i * 4), true)
			const ent = EntityManager.EntityByIndex(ent_id)
			if (ent instanceof Unit)
				issuers.push(ent)
		}
		if (issuers.length === 0) {
			const hero = LocalPlayer?.Hero
			if (hero !== undefined)
				issuers.push(hero)
		}
		const target = ExecuteOrder.LatestUnitOrder_view.getUint32(16, true),
			ability = ExecuteOrder.LatestUnitOrder_view.getUint32(20, true),
			order_type = ExecuteOrder.LatestUnitOrder_view.getUint32(0, true) as dotaunitorder_t
		let target_: Entity | number = target,
			ability_: Entity | number = target
		if (order_type !== dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM)
			target_ = EntityManager.EntityByIndex(target_) ?? target_
		if (order_type !== dotaunitorder_t.DOTA_UNIT_ORDER_PURCHASE_ITEM)
			ability_ = EntityManager.EntityByIndex(ability_) ?? ability_
		return new ExecuteOrder(
			order_type,
			target !== 0 ? (EntityManager.EntityByIndex(target) ?? target) : undefined,
			new Vector3(
				ExecuteOrder.LatestUnitOrder_view.getFloat32(4, true),
				ExecuteOrder.LatestUnitOrder_view.getFloat32(8, true),
				ExecuteOrder.LatestUnitOrder_view.getFloat32(12, true),
			),
			ability !== 0 ? ((EntityManager.EntityByIndex(ability) as Ability) ?? ability) : undefined,
			issuers,
			ExecuteOrder.LatestUnitOrder_view.getUint8(25) !== 0,
			ExecuteOrder.LatestUnitOrder_view.getUint8(24) !== 0,
		)
	}

	private static LatestUnitOrder_view = new DataView(LatestUnitOrder.buffer)

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
	) { }

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
	public Execute(): ExecuteOrder {
		this.Position.toIOBuffer()
		PrepareUnitOrders(this.toNative())
		return this
	}
	public ExecuteQueued(): ExecuteOrder {
		if (!ExecuteOrder.disable_humanizer)
			ExecuteOrder.order_queue.push(this)
		else if (
			// TODO: remove that whitelist once humanizer becomes stable
			this.OrderType === dotaunitorder_t.DOTA_UNIT_ORDER_PING_ABILITY
			|| this.OrderType === dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET
		)
			this.Execute()
		return this
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

const last_order_click = new Vector3(),
	latest_cursor = new Vector2()
let last_order_click_update = 0,
	latest_camera_x = 0,
	latest_camera_y = 0,
	current_order: Nullable<ExecuteOrder>
Events.on("Update", () => {
	const cmd = new UserCmd()
	InputManager.CursorOnWorld = cmd.VectorUnderCursor
	if (ExecuteOrder.disable_humanizer)
		return
	let order = ExecuteOrder.order_queue[0] as Nullable<ExecuteOrder>
	if (order !== undefined && order !== current_order) {
		current_order = order
		switch (order.OrderType) {
			case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE:
			case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION:
			case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION:
			case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION:
			case dotaunitorder_t.DOTA_UNIT_ORDER_PATROL:
			case dotaunitorder_t.DOTA_UNIT_ORDER_RADAR:
			case dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_POSITION:
				last_order_click.CopyFrom(order.Position)
				last_order_click_update = hrtime()
				break
			case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET:
			case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET:
			case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE:
			case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET:
			case dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM:
			case dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE:
				if (order.Target instanceof Entity)
					last_order_click.CopyFrom(order.Target.Position)
				else if (order.Position !== undefined)
					last_order_click.CopyFrom(order.Position)
				else
					last_order_click.toZero()
				last_order_click_update = hrtime()
				break
			default:
				if (ExecuteOrder.debug_orders)
					console.log("Executing order " + order.OrderType)
				order.Execute()
				ExecuteOrder.order_queue.splice(0, 1)
				order = undefined
				current_order = undefined
				break
		}
	}
	const mult = Math.max(Math.abs(Math.sin(hrtime() - last_order_click_update)), 0.05)
	let CursorWorldVec = cmd.VectorUnderCursor
	if (last_order_click_update + 450 >= hrtime()) {
		const dist = last_order_click.Distance(CursorWorldVec)
		if (dist > 50)
			last_order_click.Extend(CursorWorldVec, Math.min(dist, 200 * mult)).CopyTo(last_order_click)
		else
			CursorWorldVec.CopyTo(last_order_click)
		CursorWorldVec = last_order_click
		cmd.CameraPosition.x = latest_camera_x
		cmd.CameraPosition.y = latest_camera_y
	}
	cmd.VectorUnderCursor = CursorWorldVec.SetZ(WASM.GetPositionHeight(Vector2.FromVector3(CursorWorldVec)))
	if (order !== undefined && (!ExecuteOrder.wait_near_cursor || cmd.VectorUnderCursor.Distance(last_order_click) <= 200)) {
		order.Execute()
		if (ExecuteOrder.debug_orders)
			console.log("Executing order " + order.OrderType + " after " + (hrtime() - last_order_click_update) + "ms")
		ExecuteOrder.order_queue.splice(0, 1)
	}
	const default_camera_dist = 1200 // default camera distance
	const max_cursor_dist = 1400 // maximum allowed distance between camera center and cursor
	const camera_vec = cmd.CameraPosition.toVector3()
	if (camera_vec.Clone().AddScalarY(default_camera_dist / 2).Distance2D(CursorWorldVec) <= max_cursor_dist) {
		camera_vec
			.AddScalarY(default_camera_dist / 2)
			.Extend(
				CursorWorldVec,
				Math.min(
					camera_vec.Distance(CursorWorldVec),
					150 * (last_order_click_update + 450 >= hrtime() ? mult : 1),
				),
			)
			.SubtractScalarY(default_camera_dist / 2)
			.CopyTo(camera_vec)
	} else
		CursorWorldVec.Clone().SubtractScalarY(default_camera_dist / 2).CopyTo(camera_vec)
	latest_camera_x = cmd.CameraPosition.x = camera_vec.x
	latest_camera_y = cmd.CameraPosition.y = camera_vec.y

	const cur_pos = RendererSDK.WorldToScreenCustom(CursorWorldVec, Vector2.FromVector3(camera_vec))
	if (cur_pos !== undefined) {
		cmd.MouseX = cur_pos.x
		cmd.MouseY = cur_pos.y
	}
	latest_cursor.x = cmd.MouseX
	latest_cursor.y = cmd.MouseY

	cmd.ViewAngles.x = 60
	cmd.ViewAngles.y = 90
	cmd.ViewAngles.z = 0

	cmd.WriteBack()
})

const debugParticles = new ParticlesSDK()
function DrawCameraBorderLine(cameraPos: Vector3, startVec: Vector2, endVec: Vector2) {
	const hero = LocalPlayer?.Hero
	if (hero === undefined)
		return
	const cam_pos = new Vector2(latest_camera_x, latest_camera_y)
	const point1 = RendererSDK.ScreenToWorldFar(startVec, cam_pos, 1200),
		point2 = RendererSDK.ScreenToWorldFar(endVec, cam_pos, 1200)
	debugParticles.DrawLine(startVec.toString() + endVec.toString(), hero, point1, {
		Position: point2,
		Width: 40,
		Mode2D: 40,
	})
	debugParticles.DrawLine(startVec.toString(), hero, point1, {
		Position: cameraPos,
		Width: 40,
		Mode2D: 40,
	})
	debugParticles.DrawLine(endVec.toString(), hero, point2, {
		Position: cameraPos,
		Width: 40,
		Mode2D: 40,
	})
}

EventsSDK.on("Draw", () => {
	if (!ExecuteOrder.debug_draw || ExecuteOrder.disable_humanizer) {
		debugParticles.DestroyAll()
		return
	}
	const cameraPos = WASM.GetCameraPosition(
		new Vector2(latest_camera_x, latest_camera_y),
		1200,
		new QAngle(60, 90, 0),
	)
	DrawCameraBorderLine(cameraPos, new Vector2(0, 0), new Vector2(0, 1))
	DrawCameraBorderLine(cameraPos, new Vector2(0, 0), new Vector2(1, 0))
	DrawCameraBorderLine(cameraPos, new Vector2(1, 1), new Vector2(0, 1))
	DrawCameraBorderLine(cameraPos, new Vector2(1, 1), new Vector2(1, 0))

	const point = RendererSDK.WorldToScreen(RendererSDK.ScreenToWorldFar(latest_cursor, cameraPos, 1200))
	if (point !== undefined)
		RendererSDK.FilledRect(point.Subtract(new Vector2(5, 5)), new Vector2(10, 10), Color.Fuchsia)
})

//EventsSDK.on("GameEnded", () => ExecuteOrder.order_queue = [])
Events.on("PrepareUnitOrders", () => {
	const orders = ExecuteOrder.fromNative()
	if (orders === undefined)
		return true

	const ret = EventsSDK.emit("PrepareUnitOrders", true, orders)
	if (!ret)
		return false
	if (ExecuteOrder.queue_user_orders) {
		orders.ExecuteQueued()
		return false
	}
	return true
})
