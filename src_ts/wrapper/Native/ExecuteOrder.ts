import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import EntityManager from "../Managers/EntityManager"
import Ability from "../Objects/Base/Ability"
import Entity, { LocalPlayer } from "../Objects/Base/Entity"
import Unit from "../Objects/Base/Unit"
import UserCmd from "./UserCmd"
import RendererSDK from "./RendererSDK"
import Events from "../Managers/Events"
import { dotaunitorder_t } from "../Enums/dotaunitorder_t"
import EventsSDK from "../Managers/EventsSDK"
import Tree from "../Objects/Base/Tree"
import Color from "../Base/Color"

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
	public static wait_next_usercmd = false
	public static wait_near_cursor = false
	public static debug_orders = false
	public static debug_draw = false

	public static fromObject(order: {
		orderType: dotaunitorder_t,
		target?: Entity | number,
		position?: Vector3 | Vector2,
		ability?: Ability | number,
		orderIssuer?: PlayerOrderIssuer_t,
		unit?: Unit,
		queue?: boolean,
		showEffects?: boolean,
	}): ExecuteOrder {
		return new ExecuteOrder(
			order.orderType,
			order.target,
			order.position,
			order.ability,
			order.orderIssuer,
			order.unit,
			order.queue,
			order.showEffects,
		)
	}

	public static fromNative(order: CUnitOrder): ExecuteOrder {
		let unit = (EntityManager.GetEntityByNative(order.unit) as Unit) ?? LocalPlayer?.Hero

		return new ExecuteOrder(
			order.order_type,
			order.target !== 0 ? (EntityManager.GetEntityByNative(order.target) ?? order.target) : undefined,
			Vector3.fromIOBuffer(order.position !== undefined),
			(EntityManager.GetEntityByNative(order.ability) as Ability) ?? order.ability,
			order.issuer,
			unit,
			order.queue,
			order.show_effects,
		)
	}

	private m_OrderType: dotaunitorder_t
	private m_Target: Nullable<Entity | number>
	private m_Position: Vector3
	private m_Ability: Nullable<Ability | number>
	private m_OrderIssuer: PlayerOrderIssuer_t
	private m_Unit: Nullable<Unit>
	private m_Queue: boolean
	private m_ShowEffects: boolean

	/**
	 * Orders by native CUnitOrder
	 * @param position default: new Vector3(0,0,0)
	 * @param issuer default: DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY
	 */
	constructor(
		orderType: dotaunitorder_t,
		target: Nullable<Entity | number>,
		position: Vector3 | Vector2 = new Vector3(),
		ability: Nullable<Ability | number>,
		issuer: PlayerOrderIssuer_t = PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY,
		unit: Nullable<Unit>,
		queue: boolean = false,
		showEffects: boolean = false,
	) {
		this.m_OrderType = orderType
		this.m_Target = target
		this.m_Position = position instanceof Vector2 ? position.toVector3() : position
		this.m_Ability = ability
		this.m_OrderIssuer = issuer
		this.m_Unit = unit
		this.m_Queue = queue
		this.m_ShowEffects = showEffects
	}

	get OrderType(): dotaunitorder_t {
		return this.m_OrderType
	}
	get Target(): Nullable<Entity | number> {
		return this.m_Target
	}
	get Position(): Vector3 {
		return this.m_Position
	}
	get Ability(): Nullable<Ability | number> {
		return this.m_Ability
	}
	get OrderIssuer(): PlayerOrderIssuer_t {
		return this.m_OrderIssuer
	}
	get Unit(): Nullable<Unit> {
		return this.m_Unit
	}
	get Queue(): boolean {
		return this.m_Queue
	}
	get ShowEffects(): boolean {
		return this.m_ShowEffects
	}

	/**
	 * pass Position: Vector3 at IOBuffer offset 0
	 */
	public toNative() {
		if (!this.m_Position.IsZero())
			this.m_Position.toIOBuffer()

		const target = this.m_Target,
			ability = this.m_Ability,
			unit = this.m_Unit

		return {
			OrderType: this.m_OrderType,
			Target: target instanceof Entity ? target instanceof Tree ? target.NativeEntity?.m_nBinaryID ?? target.Index : target.Index : target,
			Ability: ability instanceof Ability ? ability.Index : ability,
			OrderIssuer: this.m_OrderIssuer,
			Unit: unit?.Index,
			Queue: this.m_Queue,
			ShowEffects: this.m_ShowEffects,
		}
	}
	/**
	 * Execute order with this fields
	 */
	public Execute(): ExecuteOrder {
		PrepareUnitOrders(this.toNative())
		return this
	}
	public ExecuteQueued(): ExecuteOrder {
		ExecuteOrder.order_queue.push(this)
		return this
	}

	public toJSON(): {
		OrderType: dotaunitorder_t,
		Target: Nullable<Entity | number>,
		Position: Vector3,
		Ability: Nullable<Ability | number>,
		OrderIssuer: PlayerOrderIssuer_t
		Unit: Nullable<Unit>,
		Queue: boolean,
		ShowEffects: boolean,
	} {
		return {
			OrderType: this.m_OrderType,
			Target: this.m_Target,
			Position: this.m_Position,
			Ability: this.m_Ability,
			OrderIssuer: this.m_OrderIssuer,
			Unit: this.m_Unit,
			Queue: this.m_Queue,
			ShowEffects: this.m_ShowEffects,
		}
	}
}

let last_order_click = new Vector3(),
	last_order_click_update = 0,
	latest_camera_x = 0,
	latest_camera_y = 0,
	execute_current = false,
	current_order: Nullable<ExecuteOrder>,
	latest_cursor = new Vector2()
Events.after("Update", (cmd_: CUserCmd) => {
	let cmd = new UserCmd(cmd_),
		order: Nullable<ExecuteOrder> = ExecuteOrder.order_queue[0]
	if (execute_current) {
		order!.Execute()
		if (ExecuteOrder.debug_orders)
			console.log("Executing order " + order!.OrderType + " after " + (hrtime() - last_order_click_update) + "ms")
		ExecuteOrder.order_queue.splice(0, 1)
		execute_current = false
		order = ExecuteOrder.order_queue[0]
	}
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
				if (order.Target instanceof C_BaseEntity) {
					let ent = EntityManager.GetEntityByNative(order.Target)
					if (ent !== undefined)
						last_order_click.CopyFrom(ent.Position)
				} else if (order.Target instanceof Entity)
					last_order_click.CopyFrom(order.Target.Position)
				else if (order.Position !== undefined)
					last_order_click.CopyFrom(order.Position)
				else
					last_order_click.toZero()
				last_order_click_update = hrtime()
				break
			default:
				order.Execute()
				ExecuteOrder.order_queue.splice(0, 1)
				order = undefined
				current_order = undefined
				break
		}
	}
	let CursorWorldVec = cmd.VectorUnderCursor,
		mult = Math.sin(hrtime() - last_order_click_update)
	if (last_order_click_update + 450 >= hrtime()) {
		CursorWorldVec = last_order_click.Extend(CursorWorldVec, Math.min(last_order_click.Distance(CursorWorldVec), 200 * mult)).CopyTo(last_order_click)
		cmd.CameraX = latest_camera_x
		cmd.CameraY = latest_camera_y
	}
	cmd.VectorUnderCursor = CursorWorldVec.SetZ(RendererSDK.GetPositionHeight(CursorWorldVec.toVector2()))
	if (order !== undefined && (!ExecuteOrder.wait_near_cursor || cmd.VectorUnderCursor.Distance(last_order_click) <= 100)) {
		if (!ExecuteOrder.wait_next_usercmd) {
			order.Execute()
			if (ExecuteOrder.debug_orders)
				console.log("Executing order " + order.OrderType + " after " + (hrtime() - last_order_click_update) + "ms")
			ExecuteOrder.order_queue.splice(0, 1)
		}
		execute_current = ExecuteOrder.wait_next_usercmd
	}
	let camera_vec = new Vector3(cmd.CameraX, cmd.CameraY)
	camera_vec = camera_vec.Clone().AddScalarY(1200 / 2).Distance2D(CursorWorldVec) > 1400
		? CursorWorldVec.Clone().SubtractScalarY(1200 / 2)
		: camera_vec = camera_vec.AddScalarY(1200 / 2).Extend(CursorWorldVec, Math.min(camera_vec.Distance(CursorWorldVec), 150 * (last_order_click_update + 450 >= hrtime() ? mult : 1))).SubtractScalarY(1200 / 2)
	latest_camera_x = cmd.CameraX = camera_vec.x
	latest_camera_y = cmd.CameraY = camera_vec.y

	let cur_pos = RendererSDK.WorldToScreenCustom(CursorWorldVec, camera_vec.toVector2())
	if (cur_pos !== undefined) {
		cmd.MouseX = cur_pos.x
		cmd.MouseY = cur_pos.y
	}
	latest_cursor.x = cmd.MouseX
	latest_cursor.y = cmd.MouseY
})

function DrawLine(startVec: Vector2, endVec: Vector2) {
	const cam_pos = new Vector2(latest_camera_x, latest_camera_y)
	let point1 = RendererSDK.WorldToScreen(RendererSDK.ScreenToWorldFar(startVec, cam_pos, 1200)),
		point2 = RendererSDK.WorldToScreen(RendererSDK.ScreenToWorldFar(endVec, cam_pos, 1200))
	if (point1 === undefined || point2 === undefined)
		return
	RendererSDK.Line(point1, point2, Color.Red)
}

Events.on("Draw", () => {
	if (!ExecuteOrder.debug_draw)
		return
	DrawLine(new Vector2(0, 0), new Vector2(0, 1))
	DrawLine(new Vector2(0, 0), new Vector2(1, 0))
	DrawLine(new Vector2(1, 1), new Vector2(0, 1))
	DrawLine(new Vector2(1, 1), new Vector2(1, 0))

	const cam_pos = new Vector2(latest_camera_x, latest_camera_y)
	let point = RendererSDK.WorldToScreen(RendererSDK.ScreenToWorldFar(latest_cursor, cam_pos, 1200))
	if (point !== undefined)
		RendererSDK.FilledRect(point.Subtract(new Vector2(5, 5)), new Vector2(10, 10), Color.Fuchsia)
})

//EventsSDK.on("GameEnded", () => ExecuteOrder.order_queue = [])
Events.on("PrepareUnitOrders", order => {
	const ordersSDK = ExecuteOrder.fromNative(order)
	if (ordersSDK === undefined)
		return true

	return EventsSDK.emit("PrepareUnitOrders", true, ordersSDK)
})
