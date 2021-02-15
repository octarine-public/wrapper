import Color from "../Base/Color"
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
import Tree from "../Objects/Base/Tree"
import Unit from "../Objects/Base/Unit"
import RendererSDK from "./RendererSDK"
import UserCmd from "./UserCmd"
import { GetPositionHeight } from "./WASM"

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
		position?: Vector3 | Vector2,
		ability?: Ability | number,
		orderIssuer?: PlayerOrderIssuer_t,
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
	public static CastRiverPaint(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_RIVER_PAINT, position, queue, showEffects })
	}
	public static PreGameAdjustItemAssigment(ItemID: number, queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_PREGAME_ADJUST_ITEM_ASSIGNMENT, target: ItemID, queue, showEffects })
	}
	public static Scan(position: Vector3 | Vector2, queue?: boolean, showEffects?: boolean): ExecuteOrder {
		return ExecuteOrder.PrepareOrder({ orderType: dotaunitorder_t.DOTA_UNIT_ORDER_RADAR, position, queue, showEffects })
	}

	public static fromObject(order: {
		orderType: dotaunitorder_t,
		target?: Entity | number,
		position?: Vector3 | Vector2,
		ability?: Ability | number,
		orderIssuer?: PlayerOrderIssuer_t,
		issuers?: Unit[],
		queue?: boolean,
		showEffects?: boolean,
	}): ExecuteOrder {
		return new ExecuteOrder(
			order.orderType,
			order.target,
			order.position,
			order.ability,
			order.orderIssuer,
			order.issuers ?? [],
			order.queue,
			order.showEffects,
		)
	}

	public static fromNative(): ExecuteOrder {
		const issuers_size = ExecuteOrder.LatestUnitOrder_view.getUint32(30, true)
		const issuers: Unit[] = []
		for (let i = 0; i < issuers_size; i++) {
			const ent_id = ExecuteOrder.LatestUnitOrder_view.getUint32(34 + (i * 4), true)
			const ent = EntityManager.EntityByIndex(ent_id) as Unit
			if (ent !== undefined)
				issuers.push(ent)
		}
		if (issuers.length === 0) {
			const hero = LocalPlayer?.Hero
			if (hero !== undefined)
				issuers.push(hero)
		}
		const target = ExecuteOrder.LatestUnitOrder_view.getUint32(20, true),
			ability = ExecuteOrder.LatestUnitOrder_view.getUint32(24, true)
		return new ExecuteOrder(
			ExecuteOrder.LatestUnitOrder_view.getUint32(0, true),
			target !== 0 ? (EntityManager.EntityByIndex(target) ?? target) : undefined,
			new Vector3(
				ExecuteOrder.LatestUnitOrder_view.getFloat32(8, true),
				ExecuteOrder.LatestUnitOrder_view.getFloat32(12, true),
				ExecuteOrder.LatestUnitOrder_view.getFloat32(16, true),
			),
			ability !== 0 ? ((EntityManager.EntityByIndex(ability) as Ability) ?? ability) : undefined,
			ExecuteOrder.LatestUnitOrder_view.getUint32(4, true),
			issuers,
			ExecuteOrder.LatestUnitOrder_view.getUint8(29) !== 0,
			ExecuteOrder.LatestUnitOrder_view.getUint8(28) !== 0,
		)
	}

	private static LatestUnitOrder_view = new DataView(LatestUnitOrder.buffer)

	private m_OrderType: dotaunitorder_t
	private m_Target: Nullable<Entity | number>
	private m_Position: Vector3
	private m_Ability: Nullable<Ability | number>
	private m_OrderIssuer: PlayerOrderIssuer_t
	private m_Issuers: Unit[]
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
		issuers: Unit[],
		queue: boolean = false,
		showEffects: boolean = false,
	) {
		this.m_OrderType = orderType
		this.m_Target = target
		this.m_Position = position instanceof Vector2 ? position.toVector3() : position
		this.m_Ability = ability
		this.m_OrderIssuer = issuer
		this.m_Issuers = issuers
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
	get Issuers(): Unit[] {
		return this.m_Issuers
	}
	get Unit(): Nullable<Unit> {
		return this.m_Issuers[0]
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
		const target = this.m_Target,
			ability = this.m_Ability

		return {
			OrderType: this.m_OrderType,
			Target: target instanceof Entity ? target instanceof Tree ? target.BinaryID : target.Index : target,
			Ability: ability instanceof Ability ? ability.Index : ability,
			OrderIssuer: this.m_OrderIssuer,
			Issuers: this.m_Issuers.map(ent => ent.Index),
			Queue: this.m_Queue,
			ShowEffects: this.m_ShowEffects,
		}
	}
	/**
	 * Execute order with this fields
	 */
	public Execute(): ExecuteOrder {
		this.m_Position.toIOBuffer()
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
		OrderIssuer: PlayerOrderIssuer_t
		Issuers: Unit[],
		Queue: boolean,
		ShowEffects: boolean,
	} {
		return {
			OrderType: this.m_OrderType,
			Target: this.m_Target,
			Position: this.m_Position,
			Ability: this.m_Ability,
			OrderIssuer: this.m_OrderIssuer,
			Issuers: this.m_Issuers,
			Queue: this.m_Queue,
			ShowEffects: this.m_ShowEffects,
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
	cmd.VectorUnderCursor = CursorWorldVec.SetZ(GetPositionHeight(Vector2.FromVector3(CursorWorldVec)))
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

	cmd.WriteBack()
})

const debugParticles = new ParticlesSDK()
function DrawLine(id: number, startVec: Vector2, endVec: Vector2) {
	const hero = LocalPlayer?.Hero
	if (hero === undefined)
		return
	const cam_pos = new Vector2(latest_camera_x, latest_camera_y)
	const point1 = RendererSDK.ScreenToWorldFar(startVec, cam_pos, 1200),
		point2 = RendererSDK.ScreenToWorldFar(endVec, cam_pos, 1200)
	debugParticles.DrawLine(id, hero, point1, {
		Position: point2,
		Width: 40,
		Mode2D: 40,
	})
}

EventsSDK.on("Draw", () => {
	if (!ExecuteOrder.debug_draw || ExecuteOrder.disable_humanizer) {
		debugParticles.DestroyAll()
		return
	}
	DrawLine(1, new Vector2(0, 0), new Vector2(0, 1))
	DrawLine(2, new Vector2(0, 0), new Vector2(1, 0))
	DrawLine(3, new Vector2(1, 1), new Vector2(0, 1))
	DrawLine(4, new Vector2(1, 1), new Vector2(1, 0))

	const cam_pos = new Vector2(latest_camera_x, latest_camera_y)
	const point = RendererSDK.WorldToScreen(RendererSDK.ScreenToWorldFar(latest_cursor, cam_pos, 1200))
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
