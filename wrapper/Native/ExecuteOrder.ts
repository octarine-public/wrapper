import AABB from "../Base/AABB"
import Color from "../Base/Color"
import QAngle from "../Base/QAngle"
import Rectangle from "../Base/Rectangle"
import Vector2 from "../Base/Vector2"
import Vector3 from "../Base/Vector3"
import { DOTAGameUIState_t } from "../Enums/DOTAGameUIState_t"
import { dotaunitorder_t } from "../Enums/dotaunitorder_t"
import { DOTA_GameState } from "../Enums/DOTA_GameState"
import { DOTA_SHOP_TYPE } from "../Enums/DOTA_SHOP_TYPE"
import { WorldPolygon } from "../Geometry/WorldPolygon"
import GUIInfo from "../GUI/GUIInfo"
import EntityManager from "../Managers/EntityManager"
import Events from "../Managers/Events"
import EventsSDK from "../Managers/EventsSDK"
import InputManager, { InputEventSDK, VKeys } from "../Managers/InputManager"
import MinimapSDK from "../Managers/MinimapSDK"
import ParticlesSDK from "../Managers/ParticleManager"
import Ability from "../Objects/Base/Ability"
import { CameraBounds } from "../Objects/Base/CameraBounds"
import Entity, { GameRules, LocalPlayer } from "../Objects/Base/Entity"
import Shop from "../Objects/Base/Shop"
import TempTree from "../Objects/Base/TempTree"
import Tree from "../Objects/Base/Tree"
import Unit from "../Objects/Base/Unit"
import { arrayRemoveCallback, orderBy } from "../Utils/ArrayExtensions"
import GameState from "../Utils/GameState"
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

let ctrl_down = false,
	shift_down = false
InputEventSDK.on("KeyDown", key => {
	if (key === VKeys.CONTROL || key === VKeys.LCONTROL || key === VKeys.RCONTROL)
		ctrl_down = true
	if (key === VKeys.SHIFT || key === VKeys.LSHIFT || key === VKeys.RSHIFT)
		shift_down = true
})
InputEventSDK.on("KeyUp", key => {
	if (key === VKeys.CONTROL || key === VKeys.LCONTROL || key === VKeys.RCONTROL)
		ctrl_down = false
	if (key === VKeys.SHIFT || key === VKeys.LSHIFT || key === VKeys.RSHIFT)
		shift_down = false
})

export default class ExecuteOrder {
	public static readonly order_queue: [ExecuteOrder, number][] = []
	public static debug_orders = false
	public static debug_draw = false
	public static disable_humanizer = false
	public static hold_orders = 0
	public static hold_orders_target: Nullable<Vector3 | Entity>
	public static camera_minimap_spaces = 3 // 2 => 5
	public static camera_speed = 8000 // 5000 => 20000
	public static cursor_speed = 8 // ?
	public static cursor_speed_min_accel = 1.5 //?
	public static cursor_speed_max_accel = 4 // ?
	public static prefire_orders = true
	public static received_usercmd_request = false
	public static is_standalone = false
	public static unsafe_mode = false
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

	public static fromNative(): ExecuteOrder {
		const issuers_size = ExecuteOrder.LatestUnitOrder_view.getUint32(26, true)
		let issuers: Unit[] = []
		for (let i = 0; i < issuers_size; i++) {
			const ent_id = ExecuteOrder.LatestUnitOrder_view.getUint32(30 + (i * 4), true)
			const ent = EntityManager.EntityByIndex(ent_id)
			if (ent instanceof Unit)
				issuers.push(ent)
		}
		issuers = [...new Set([...issuers, ...InputManager.SelectedEntities])]

		const target = ExecuteOrder.LatestUnitOrder_view.getUint32(16, true),
			ability = ExecuteOrder.LatestUnitOrder_view.getUint32(20, true),
			order_type = ExecuteOrder.LatestUnitOrder_view.getUint32(0, true) as dotaunitorder_t
		let target_: Entity | number = target,
			ability_: Ability | number = ability
		if (order_type === dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE)
			target_ = EntityManager.AllEntities.find(ent => (
				(ent instanceof Tree || ent instanceof TempTree)
				&& ent.BinaryID === target
			)) ?? target_
		else if (order_type !== dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM)
			target_ = EntityManager.EntityByIndex(target_) ?? target_
		if (order_type !== dotaunitorder_t.DOTA_UNIT_ORDER_PURCHASE_ITEM)
			ability_ = (EntityManager.EntityByIndex(ability_) as Ability) ?? ability_
		switch (order_type) {
			case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET:
			case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION:
			case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET:
			case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE:
			case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE:
			case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO:
			case dotaunitorder_t.DOTA_UNIT_ORDER_TRAIN_ABILITY:
				break
			default:
				if (ctrl_down && ConVars.GetInt("dota_player_multipler_orders") !== 0)
					issuers = [...new Set([...issuers, ...EntityManager.GetEntitiesByClass(Unit).filter(ent => (
						ent.IsControllable
						&& ent.RootOwner === LocalPlayer
						&& ent.IsAlive
						&& !ent.IsEnemy()
						&& ent.ShouldUnifyOrders
					))])]
				break
		}
		return new ExecuteOrder(
			order_type,
			target_,
			new Vector3(
				ExecuteOrder.LatestUnitOrder_view.getFloat32(4, true),
				ExecuteOrder.LatestUnitOrder_view.getFloat32(8, true),
				ExecuteOrder.LatestUnitOrder_view.getFloat32(12, true),
			),
			ability_,
			issuers,
			(ExecuteOrder.LatestUnitOrder_view.getUint8(25) !== 0) || shift_down,
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
		if (ExecuteOrder.disable_humanizer)
			return
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
					(order, i) => (
						i !== 0
						&& (
							order[0].Issuers.every(unit => this.Issuers.includes(unit))
							|| (
								order[0].Issuers.length === 1
								&& this.Issuers.includes(order[0].Issuers[0])
							)
						)
						&& CanBeIgnored(order[0])
					),
				))
					continue
		}
		ExecuteOrder.order_queue.push([this, hrtime()])
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

class Polygon2D {
	public Points: Vector2[] = []

	constructor(...points: Vector2[]) {
		this.Points = points
	}
	public get Center(): Vector2 {
		return this.Points.reduce((a, b) => a.AddForThis(b), new Vector2())
			.DivideScalarForThis(this.Points.length)
	}
	public Add(polygon: Polygon2D | Vector2): void {
		if (polygon instanceof Polygon2D)
			polygon.Points.forEach(point => this.AddPoint(point))
		else
			this.AddPoint(polygon)
	}

	public Draw(
		color: Color,
		width = 10,
	): void {
		for (let i = 0; i < this.Points.length; i++) {
			const nextIndex = this.Points.length - 1 === i ? 0 : i + 1
			const point1 = this.Points[i],
				point2 = this.Points[nextIndex]
			if (point1 !== undefined && point2 !== undefined)
				RendererSDK.Line(point1, point2, color, width)
		}
	}

	public IsInside(point: Vector2): boolean {
		return !this.IsOutside(point)
	}
	public IsOutside(point: Vector2): boolean {
		let is_outside = true
		for (let i = 0; i < this.Points.length; i++) {
			const j = i === 0 ? this.Points.length - 1 : i - 1
			if (
				(this.Points[i].y > point.y) !== (this.Points[j].y > point.y)
				&& point.x < (this.Points[j].x - this.Points[i].x) * (point.y - this.Points[i].y) / (this.Points[j].y - this.Points[i].y) + this.Points[i].x
			)
				is_outside = !is_outside
		}
		return is_outside
	}

	private AddPoint(point: Vector2): void {
		this.Points.push(point)
	}
}

const latest_cursor = new Vector2(),
	latest_camera_poly = new WorldPolygon(),
	debug_camera_poly = new WorldPolygon(),
	latest_camera_green_zone_poly_screen = new Polygon2D(),
	latest_camera_yellow_zone_poly_screen = new Polygon2D(),
	latest_camera_red_zone_poly_screen = new Polygon2D(),
	latest_camera_green_zone_poly_world = new WorldPolygon(),
	latest_camera_yellow_zone_poly_world = new WorldPolygon(),
	latest_camera_red_zone_poly_world = new WorldPolygon(),
	default_camera_dist = 1200, // default camera distance
	default_camera_angles = new QAngle(60, 90, 0)
function UpdateCameraBounds(camera_vec_2d: Vector2) {
	const camera_vec = WASM.GetCameraPosition(camera_vec_2d, default_camera_dist, default_camera_angles)
	latest_camera_poly.Points = RendererSDK.ScreenToWorldFar(
		[
			new Vector2(1, 1),
			new Vector2(0, 1),
			new Vector2(0, 0),
			new Vector2(1, 0),
		],
		camera_vec,
		default_camera_dist,
	)
	debug_camera_poly.Points = [
		latest_camera_poly.Points[0],
		camera_vec,
		latest_camera_poly.Points[1],
		camera_vec,
		latest_camera_poly.Points[2],
		camera_vec,
		latest_camera_poly.Points[3],
		camera_vec,
		latest_camera_poly.Points[0],
		latest_camera_poly.Points[1],
		latest_camera_poly.Points[2],
		latest_camera_poly.Points[3],
	]
	const screen_size = RendererSDK.WindowSize,
		minimap = GUIInfo.Minimap.Minimap
	const camera_limit_x1 = (GUIInfo.HUDFlipped ? minimap.Left : minimap.Right) / screen_size.x,
		camera_limit_x2 = GUIInfo.HUDFlipped ? 0.05 : 0.95
	let camera_limit_y_min = Math.min(
		GUIInfo.TopBar.RadiantPlayersHeroImages[0].Bottom * 2 / screen_size.y,
		0.1,
	)
	let camera_limit_y_max = minimap.Top / screen_size.y,
		camera_limit_x_min = Math.min(camera_limit_x1, camera_limit_x2),
		camera_limit_x_max = Math.max(camera_limit_x1, camera_limit_x2)
	latest_camera_red_zone_poly_screen.Points = [
		new Vector2(camera_limit_x_max, camera_limit_y_max),
		new Vector2(camera_limit_x_min, camera_limit_y_max),
		new Vector2(camera_limit_x_min, camera_limit_y_min),
		new Vector2(camera_limit_x_max, camera_limit_y_min),
	]
	const x_offset_minimap = 1 / 25,
		x_offset_non_minimap = 1 / 15,
		y_offset_min = 1 / 8,
		y_offset_max = 1 / 15
	camera_limit_y_min += y_offset_min
	camera_limit_y_max -= y_offset_max
	if (GUIInfo.HUDFlipped) {
		camera_limit_x_min += x_offset_non_minimap
		camera_limit_x_max -= x_offset_minimap
	} else {
		camera_limit_x_min += x_offset_minimap
		camera_limit_x_max -= x_offset_non_minimap
	}
	latest_camera_yellow_zone_poly_screen.Points = [
		new Vector2(camera_limit_x_max, camera_limit_y_max),
		new Vector2(camera_limit_x_min, camera_limit_y_max),
		new Vector2(camera_limit_x_min, camera_limit_y_min),
		new Vector2(camera_limit_x_max, camera_limit_y_min),
	]
	const x_available = camera_limit_x_max - camera_limit_x_min,
		y_available = camera_limit_y_max - camera_limit_y_min
	camera_limit_x_min += x_available / 6
	camera_limit_x_max -= x_available / 6
	camera_limit_y_min += y_available / 6
	camera_limit_y_max -= y_available / 6
	latest_camera_green_zone_poly_screen.Points = [
		new Vector2(camera_limit_x_max, camera_limit_y_max),
		new Vector2(camera_limit_x_min, camera_limit_y_max),
		new Vector2(camera_limit_x_min, camera_limit_y_min),
		new Vector2(camera_limit_x_max, camera_limit_y_min),
	]

	latest_camera_green_zone_poly_world.Points = RendererSDK.ScreenToWorldFar(
		latest_camera_green_zone_poly_screen.Points.map(point => point),
		camera_vec,
		default_camera_dist,
	)
	latest_camera_yellow_zone_poly_world.Points = RendererSDK.ScreenToWorldFar(
		latest_camera_yellow_zone_poly_screen.Points.map(point => point),
		camera_vec,
		default_camera_dist,
	)
	latest_camera_red_zone_poly_world.Points = RendererSDK.ScreenToWorldFar(
		latest_camera_red_zone_poly_screen.Points.map(point => point),
		camera_vec,
		default_camera_dist,
	)
}

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

function CanOrderBeSkipped(order: ExecuteOrder): boolean {
	switch (order.OrderType) {
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE: {
			const abil = order.Ability
			if (abil instanceof Ability && abil.IsDoubleTap(order))
				return true
			break
		}
		default:
			break
	}
	switch (order.OrderType) {
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION:
			return EntityManager.GetEntitiesByClass(Unit).some(ent => (
				ent.IsGloballyTargetable
				&& order.Position.Distance2D(ent.Position) < 200
			))
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET:
			return order.Target instanceof Entity && order.Target === order.Issuers[0]
		case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE:
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET:
		case dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM:
		case dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE:
		case dotaunitorder_t.DOTA_UNIT_ORDER_RADAR:
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_PATROL:
		case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE:
		case dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM:
			return false
		default:
			return true
	}
}

function GetEntityHitBox(ent: Entity, camera_vec: Vector2): Nullable<Polygon2D> {
	const points = ent.BoundingBox.Polygon.Points
	const w2s = points.map(point => RendererSDK.WorldToScreenCustom(point, camera_vec)).filter(point => (
		point !== undefined
		&& point.x >= 0
		&& point.y >= 0
		&& point.x <= 1
		&& point.y <= 1
	))
	if (w2s.length < 2)
		return undefined
	return new Polygon2D(...w2s as Vector2[])
}

function GetIntersection(fDst1: number, fDst2: number, P1: Vector3, P2: Vector3): Nullable<Vector3> {
	if ((fDst1 * fDst2) >= 0 || fDst1 === fDst2)
		return undefined
	return P1.Add(P2.Subtract(P1).MultiplyScalarForThis(-fDst1 / (fDst2 - fDst1)))
}

function InBox(Hit: Vector3, B1: Vector3, B2: Vector3, Axis: number): boolean {
	return (
		(Axis === 1 && Hit.z > B1.z && Hit.z < B2.z && Hit.y > B1.y && Hit.y < B2.y)
		|| (Axis === 2 && Hit.z > B1.z && Hit.z < B2.z && Hit.x > B1.x && Hit.x < B2.x)
		|| (Axis === 3 && Hit.x > B1.x && Hit.x < B2.x && Hit.y > B1.y && Hit.y < B2.y)
	)
}

function CheckLineBox(hitbox: AABB, L1: Vector3, L2: Vector3): Nullable<Vector3> {
	const B1 = hitbox.Min,
		B2 = hitbox.Max
	if (
		(L2.x < B1.x && L1.x < B1.x)
		|| (L2.x > B2.x && L1.x > B2.x)
		|| (L2.y < B1.y && L1.y < B1.y)
		|| (L2.y > B2.y && L1.y > B2.y)
		|| (L2.z < B1.z && L1.z < B1.z)
		|| (L2.z > B2.z && L1.z > B2.z)
	)
		return undefined
	if (
		L1.x > B1.x && L1.x < B2.x
		&& L1.y > B1.y && L1.y < B2.y
		&& L1.z > B1.z && L1.z < B2.z
	)
		return L1
	let Hit = GetIntersection(L1.x - B1.x, L2.x - B1.x, L1, L2)
	if (Hit !== undefined && InBox(Hit, B1, B2, 1))
		return Hit
	Hit = GetIntersection(L1.y - B1.y, L2.y - B1.y, L1, L2)
	if (Hit !== undefined && InBox(Hit, B1, B2, 2))
		return Hit
	Hit = GetIntersection(L1.z - B1.z, L2.z - B1.z, L1, L2)
	if (Hit !== undefined && InBox(Hit, B1, B2, 3))
		return Hit
	Hit = GetIntersection(L1.x - B2.x, L2.x - B2.x, L1, L2)
	if (Hit !== undefined && InBox(Hit, B1, B2, 1))
		return Hit
	Hit = GetIntersection(L1.y - B2.y, L2.y - B2.y, L1, L2)
	if (Hit !== undefined && InBox(Hit, B1, B2, 2))
		return Hit
	Hit = GetIntersection(L1.z - B2.z, L2.z - B2.z, L1, L2)
	if (Hit !== undefined && InBox(Hit, B1, B2, 3))
		return Hit
	return undefined
}

function EntityHitBoxIntersects(
	ent: Entity,
	camera_vec_2d: Vector2,
	cursor_vec: Vector2,
	max_dist = 1e6,
): boolean {
	const camera_vec = WASM.GetCameraPosition(
		camera_vec_2d,
		default_camera_dist,
		default_camera_angles,
	)
	const target = camera_vec.Add(WASM.GetCursorRay(
		cursor_vec,
		RendererSDK.WindowSize,
		camera_vec,
		default_camera_dist,
		default_camera_angles,
		-1,
	).MultiplyScalarForThis(max_dist))
	return CheckLineBox(ent.BoundingBox, camera_vec, target) !== undefined
}

function ComputeTargetPos(camera_vec: Vector2, current_time: number): Vector3 | Vector2 {
	const yellow_zone_reached = yellow_zone_out_at < current_time - yellow_zone_max_duration,
		green_zone_reached = green_zone_out_at < current_time - green_zone_max_duration
	const current_pos = latest_usercmd.MousePosition
	if (last_order_target instanceof Entity) {
		if (
			EntityHitBoxIntersects(last_order_target, camera_vec, current_pos)
			&& !latest_camera_red_zone_poly_screen.IsOutside(current_pos)
		)
			return current_pos
		const hitbox = GetEntityHitBox(last_order_target, camera_vec)
		if (hitbox === undefined || hitbox.Points.some(point => (
			latest_camera_red_zone_poly_screen.IsOutside(point)
			|| (
				(yellow_zone_reached || green_zone_reached)
				&& latest_camera_green_zone_poly_screen.IsOutside(point)
			)
		)))
			return last_order_target.Position
		// TODO: try to find best spot between other entities' hitboxes, i.e. between creeps
		const center = hitbox.Center,
			min = hitbox.Points.reduce((prev, cur) => prev.Min(cur), new Vector2()).SubtractForThis(center),
			max = hitbox.Points.reduce((prev, cur) => prev.Max(cur), new Vector2()).SubtractForThis(center)
		for (let i = 0; i < 1000; i++) {
			const generated = center
				.Add(min.MultiplyScalar(Math.random() / 2))
				.AddForThis(max.MultiplyScalar(Math.random() / 2))
			if (
				EntityHitBoxIntersects(last_order_target, camera_vec, generated)
				&& !latest_camera_red_zone_poly_screen.IsOutside(generated)
			)
				return generated
		}
		if (latest_camera_red_zone_poly_screen.IsOutside(center))
			return last_order_target.Position
		return center
	} else if (last_order_target instanceof Vector3) {
		const w2s = RendererSDK.WorldToScreenCustom(last_order_target, camera_vec)
		if (
			w2s === undefined
			|| w2s.x < 0
			|| w2s.y < 0
			|| w2s.x > 1
			|| w2s.y > 1
			|| latest_camera_red_zone_poly_screen.IsOutside(w2s)
			|| (
				(yellow_zone_reached || green_zone_reached)
				&& latest_camera_green_zone_poly_screen.IsOutside(w2s)
			)
		)
			return last_order_target
		// allow 0.5% error (i.e. 19x10 for 1920x1080)
		const min = w2s.SubtractScalar(0.005).Max(0).Min(1),
			max = w2s.AddScalar(0.005).Max(0).Min(1)
		if (new Rectangle(min, max).Contains(current_pos)) {
			if (latest_camera_red_zone_poly_screen.IsOutside(current_pos))
				return last_order_target
			return current_pos
		}
		const ret = min.AddForThis(max.SubtractForThis(min).MultiplyScalarForThis(Math.random()))
		if (latest_camera_red_zone_poly_screen.IsOutside(ret))
			return last_order_target
		return ret
	} else {
		if (ExecuteOrder.is_standalone) {
			if (latest_usercmd.MousePosition.IsZero())
				return new Vector2(0.5 + Math.random() / 2 - 0.25, 0.5 + Math.random() / 2 - 0.25)
			return latest_usercmd.MousePosition
		}
		latest_usercmd.ScoreboardOpened = InputManager.IsScoreboardOpen
		const local_hero = LocalPlayer?.Hero
		if (InputManager.IsShopOpen && local_hero !== undefined)
			switch ((EntityManager.AllEntities.find(ent => (
				ent.IsShop
				&& ent.Distance(local_hero) < 720
			)) as Shop)?.ShopType) {
				case DOTA_SHOP_TYPE.DOTA_SHOP_SECRET:
					latest_usercmd.ShopMask = 12
					break
				default:
					latest_usercmd.ShopMask = 13
					break
			}
		const cursor_pos = InputManager.CursorOnScreen,
			game_state = GameRules?.GameState ?? DOTA_GameState.DOTA_GAMERULES_STATE_INIT,
			selected_ent = InputManager.SelectedUnit
		if (
			game_state < DOTA_GameState.DOTA_GAMERULES_STATE_PRE_GAME
			|| game_state === DOTA_GameState.DOTA_GAMERULES_STATE_POST_GAME
			|| GUIInfo.Minimap.Minimap.Contains(cursor_pos)
			|| GUIInfo.Shop.Sticky_2Rows.Contains(cursor_pos)
			|| GUIInfo.Shop.Quickbuy_2Rows.Contains(cursor_pos)
			|| GUIInfo.Shop.ClearQuickBuy_2Rows.Contains(cursor_pos)
			|| GUIInfo.Shop.CourierGold.Contains(cursor_pos)
			|| (InputManager.IsScoreboardOpen && GUIInfo.Scoreboard.Background.Contains(current_pos))
			|| (InputManager.IsShopOpen && (
				GUIInfo.OpenShopLarge.Header.Contains(cursor_pos)
				|| GUIInfo.OpenShopLarge.ItemCombines.Contains(cursor_pos)
				|| GUIInfo.OpenShopLarge.Items.Contains(cursor_pos)
				|| GUIInfo.OpenShopLarge.PinnedItems.Contains(cursor_pos)
				|| GUIInfo.OpenShopLarge.GuideFlyout.Contains(cursor_pos)
			))
			|| (
				(
					InputManager.IsShopOpen
					|| (selected_ent?.Inventory?.Stash?.length ?? 0) !== 0
				) && (
					GUIInfo.Shop.Stash.Contains(cursor_pos)
					|| GUIInfo.Shop.StashGrabAll.Contains(cursor_pos)
				)
			)
		)
			return cursor_pos.Divide(RendererSDK.WindowSize)
		const hud = GUIInfo.GetLowerHUDForUnit(selected_ent)
		if (
			hud !== undefined
			&& (
				hud.InventoryContainer.Contains(cursor_pos)
				|| hud.NeutralAndTPContainer.Contains(cursor_pos)
				|| hud.XP.Contains(cursor_pos)
			)
		)
			return cursor_pos.Divide(RendererSDK.WindowSize)
		const pos = InputManager.CursorOnWorld
		if (pos.IsValid && pos.z > -1000) {
			const w2s = RendererSDK.WorldToScreenCustom(pos, camera_vec)
			if (
				w2s === undefined
				|| w2s.x < 0
				|| w2s.y < 0
				|| w2s.x > 1
				|| w2s.y > 1
				|| latest_camera_red_zone_poly_screen.IsOutside(w2s)
				|| (
					(yellow_zone_reached || green_zone_reached)
					&& latest_camera_green_zone_poly_screen.IsOutside(w2s)
				)
			)
				return pos.Clone()
			return w2s
		} else
			return cursor_pos.Divide(RendererSDK.WindowSize)
	}
}

let last_order_target: Nullable<Vector3 | Entity>,
	current_order: Nullable<[ExecuteOrder, number]>
function ProcessOrderQueue(current_time: number): Nullable<[ExecuteOrder, number]> {
	let order = ExecuteOrder.order_queue[0] as Nullable<[ExecuteOrder, number]>
	while (order !== undefined && CanOrderBeSkipped(order[0])) {
		if (ExecuteOrder.debug_orders)
			console.log(`Executing order ${order[0].OrderType} after ${current_time - order[1]}ms`)
		order[0].Execute()
		ExecuteOrder.order_queue.splice(0, 1)
		current_order = undefined
		order = ExecuteOrder.order_queue[0] as Nullable<[ExecuteOrder, number]>
	}
	if (order !== undefined && current_order !== order) {
		current_order = order
		if (ExecuteOrder.prefire_orders) {
			if (ExecuteOrder.debug_orders)
				console.log(`Prefiring order ${order[0].OrderType} after ${current_time - order[1]}ms at ${GameState.RawGameTime}`)
			order[0].Execute()
		}
		switch (order[0].OrderType) {
			case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE:
			case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION:
			case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION:
			case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION:
			case dotaunitorder_t.DOTA_UNIT_ORDER_PATROL:
			case dotaunitorder_t.DOTA_UNIT_ORDER_RADAR:
			case dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_POSITION:
				last_order_target = order[0].Position
				break
			case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET:
			case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET:
			case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE:
			case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET:
			case dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM:
			case dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE:
			case dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM:
				last_order_target = order[0].Target instanceof Entity
					? order[0].Target
					: order[0].Position
				break
			default:
				last_order_target = undefined
				break
		}
	}
	return order
}

const camera_move_linger_duration = 100,
	order_linger_duration = 150,
	camera_move_seed_expiry = 300,
	usercmd_cache_delay = 10,
	yellow_zone_max_duration = 700,
	camera_limit_max_duration = 300,
	green_zone_max_duration = yellow_zone_max_duration * 2,
	camera_direction = new Vector2(),
	debug_cursor = new Vector3(),
	usercmd_cache: UserCmd[] = []
let last_order_finish = 0,
	latest_camera_x = 0,
	latest_camera_y = 0,
	camera_move_end = 0,
	were_moving_camera = false,
	latest_update = 0,
	usercmd_cache_last_wrote = 0,
	latest_usercmd = new UserCmd(),
	last_camera_move_seed = 0,
	yellow_zone_out_at = 0,
	green_zone_out_at = 0,
	camera_limited_at = 0
function MoveCameraByScreen(target_pos: Vector3, current_time: number): Vector2 {
	const dist_right_bot = target_pos.DistanceSqr2D(latest_camera_green_zone_poly_world.Points[0]),
		dist_left_bot = target_pos.DistanceSqr2D(latest_camera_green_zone_poly_world.Points[1]),
		dist_left_top = target_pos.DistanceSqr2D(latest_camera_green_zone_poly_world.Points[2]),
		dist_right_top = target_pos.DistanceSqr2D(latest_camera_green_zone_poly_world.Points[3]),
		dist_center_bot = target_pos.DistanceSqr2D(
			latest_camera_green_zone_poly_world.Points[0]
				.Add(latest_camera_green_zone_poly_world.Points[1])
				.DivideScalarForThis(2),
		),
		dist_center_left = target_pos.DistanceSqr2D(
			latest_camera_green_zone_poly_world.Points[1]
				.Add(latest_camera_green_zone_poly_world.Points[2])
				.DivideScalarForThis(2),
		),
		dist_center_top = target_pos.DistanceSqr2D(
			latest_camera_green_zone_poly_world.Points[2]
				.Add(latest_camera_green_zone_poly_world.Points[3])
				.DivideScalarForThis(2),
		),
		dist_center_right = target_pos.DistanceSqr2D(
			latest_camera_green_zone_poly_world.Points[0]
				.Add(latest_camera_green_zone_poly_world.Points[3])
				.DivideScalarForThis(2),
		)
	const ret = latest_usercmd.MousePosition.Clone()
	const min_corner_dist = Math.min(
		dist_right_bot,
		dist_left_bot,
		dist_left_top,
		dist_right_top,
	)
	const min_center_dist = Math.min(
		dist_center_bot,
		dist_center_left,
		dist_center_top,
		dist_center_right,
	)
	if (min_corner_dist < min_center_dist) {
		if (min_corner_dist === dist_right_bot) {
			camera_direction.x = 1
			camera_direction.y = 1
		} else if (min_corner_dist === dist_left_bot) {
			camera_direction.x = 0
			camera_direction.y = 1
		} else if (min_corner_dist === dist_left_top) {
			camera_direction.x = 0
			camera_direction.y = 0
		} else if (min_corner_dist === dist_right_top) {
			camera_direction.x = 1
			camera_direction.y = 0
		}
	} else {
		if (min_center_dist === dist_center_bot) {
			camera_direction.x = 0.5
			camera_direction.y = 1
		} else if (min_center_dist === dist_center_left) {
			camera_direction.x = 0
			camera_direction.y = 0.5
		} else if (min_center_dist === dist_center_top) {
			camera_direction.x = 0.5
			camera_direction.y = 0
		} else if (min_center_dist === dist_center_right) {
			camera_direction.x = 1
			camera_direction.y = 0.5
		}
	}
	if (last_camera_move_seed < current_time - camera_move_seed_expiry)
		last_camera_move_seed = current_time
	ret.x = camera_direction.x === 0.5
		? Math.min(0.9, Math.max(0.1, ret.x + Math.cos(last_camera_move_seed) * 0.1))
		: camera_direction.x
	ret.y = camera_direction.y === 0.5
		? Math.min(0.9, Math.max(0.1, ret.y + Math.sin(last_camera_move_seed) * 0.1))
		: camera_direction.y
	return ret
}

function MoveCamera(
	camera_vec: Vector2,
	target_pos: Vector3,
	current_time: number,
): [Vector2, boolean] {
	if (target_pos.Distance2D(camera_vec) > 1500) {
		const nearest = orderBy(EntityManager.GetEntitiesByClass(Unit).filter(ent => (
			ent.IsControllable
			&& ent.RootOwner === LocalPlayer
			&& ent.IsAlive
			&& !ent.IsEnemy()
		)), ent => ent.Distance(target_pos))[0]
		if (nearest !== undefined && nearest.Distance(target_pos) < 1000) {
			const eye_vector = WASM.GetEyeVector(default_camera_angles)
			const lookatpos = nearest.Position.Clone()
				.SubtractScalarX(eye_vector.x * default_camera_dist)
				.SubtractScalarY(eye_vector.y * default_camera_dist)
			camera_vec.x = lookatpos.x
			camera_vec.y = lookatpos.y
			return [latest_usercmd.MousePosition, false]
		}
	}
	if (latest_camera_poly.Center.Distance(target_pos) > ExecuteOrder.camera_minimap_spaces * default_camera_dist)
		return [MinimapSDK.WorldToMinimap(target_pos).DivideForThis(RendererSDK.WindowSize), true]
	return [MoveCameraByScreen(target_pos, current_time), false]
}

// polyfills for old core
globalThis.GetSelectedEntities = globalThis.GetSelectedEntities ?? (() => 0)
globalThis.GetQueryUnit = globalThis.GetQueryUnit ?? (() => 0)
function ProcessUserCmd(): void {
	const current_time = hrtime()
	const dt = Math.min(current_time - latest_update, 100) / 1000
	latest_update = current_time
	if (RendererSDK.WindowSize.IsZero())
		return
	latest_usercmd.SpectatorStatsCategoryID = 0
	latest_usercmd.SpectatorStatsSortMethod = 0
	latest_usercmd.MousePosition.CopyFrom(InputManager.CursorOnScreen.DivideForThis(RendererSDK.WindowSize))
	InputManager.IsShopOpen = IsShopOpen()
	InputManager.IsScoreboardOpen = ConVars.GetInt("dota_spectator_stats_panel") === 1
	const num_selected = GetSelectedEntities()
	InputManager.SelectedEntities.splice(0)
	for (let i = 0; i < num_selected; i++) {
		const ent = EntityManager.EntityByIndex(IOBufferView.getUint32(i * 4, true))
		if (ent !== undefined)
			InputManager.SelectedEntities.push(ent as Unit)
	}
	if (InputManager.SelectedEntities.length === 0) {
		const ent = LocalPlayer?.Hero
		if (ent !== undefined)
			InputManager.SelectedEntities.push(ent)
	}
	InputManager.QueryUnit = EntityManager.EntityByIndex(GetQueryUnit()) as Nullable<Unit>
	InputManager.SelectedUnit = ConVars.GetInt("dota_hud_new_query_panel") === 0
		? InputManager.QueryUnit ?? InputManager.SelectedEntities[0]
		: InputManager.SelectedEntities[0] ?? InputManager.QueryUnit
	InputManager.CursorOnWorld = RendererSDK.ScreenToWorldFar(
		[latest_usercmd.MousePosition],
		Camera.Position ? Vector3.fromIOBuffer() : new Vector3(),
		Camera.Distance,
		Camera.Angles ? QAngle.fromIOBuffer() : new QAngle(),
		RendererSDK.WindowSize,
		Camera.FoV,
	)[0]
	if (ExecuteOrder.disable_humanizer)
		return
	latest_usercmd.ShopMask = 15
	let order = ProcessOrderQueue(current_time)
	if (order !== undefined)
		switch (order[0].OrderType) {
			case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE:
			case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET:
				latest_usercmd.ClickBehaviors = 2
				break
			case dotaunitorder_t.DOTA_UNIT_ORDER_PATROL:
				latest_usercmd.ClickBehaviors = 8
				break
			case dotaunitorder_t.DOTA_UNIT_ORDER_RADAR:
				latest_usercmd.ClickBehaviors = 11
				break
			default:
				latest_usercmd.ClickBehaviors = 0
				break
		}
	latest_usercmd.CameraPosition.x = latest_camera_x
	latest_usercmd.CameraPosition.y = latest_camera_y
	latest_usercmd.MousePosition.CopyFrom(latest_cursor)
	const camera_vec = latest_usercmd.CameraPosition
	UpdateCameraBounds(latest_usercmd.CameraPosition)
	if (ExecuteOrder.hold_orders > 0 && ExecuteOrder.hold_orders_target !== undefined && last_order_target === undefined)
		last_order_target = ExecuteOrder.hold_orders_target instanceof Vector3
			? ExecuteOrder.hold_orders_target.Clone().SetZ(WASM.GetPositionHeight(ExecuteOrder.hold_orders_target))
			: ExecuteOrder.hold_orders_target
	if (last_order_target instanceof Entity && (!last_order_target.IsValid || !last_order_target.IsVisible)) {
		try {
			if (ExecuteOrder.debug_orders)
				console.log(`Skipping order due to invalid entity after ${current_time - ExecuteOrder.order_queue[0][1]}ms`)
		} catch (e) {
			console.error(e)
		}
		last_order_finish = current_time
		ExecuteOrder.order_queue.splice(0, 1)
		last_order_target = undefined
		order = ProcessOrderQueue(current_time)
	}
	let target_pos = ComputeTargetPos(camera_vec, current_time)
	let interacting_with_minimap = false
	if (target_pos instanceof Vector3) {
		const [target_pos_, interacting_with_minimap_] = MoveCamera(camera_vec, target_pos, current_time)
		target_pos = target_pos_
		interacting_with_minimap = interacting_with_minimap_
	}
	{ // move cursor
		// TODO: use curves
		const dist = latest_usercmd.MousePosition.Distance(target_pos)
		const extend = Math.min(
			Math.max(
				dist,
				1,
			) * ExecuteOrder.cursor_speed_min_accel,
			ExecuteOrder.cursor_speed_max_accel,
		) * ExecuteOrder.cursor_speed * dt
		if (extend < dist) {
			// Vector3#Extend with sin/cos
			latest_usercmd.MousePosition
				.GetDirectionTo(target_pos)
				.MultiplyScalarForThis(extend)
				.MultiplyScalarX(Math.abs(Math.cos(current_time)))
				.MultiplyScalarY(Math.abs(Math.sin(current_time)))
				.AddForThis(latest_usercmd.MousePosition)
				.CopyTo(latest_usercmd.MousePosition)
		} else
			latest_usercmd.MousePosition.CopyFrom(target_pos)
	}
	let order_suits = (
		latest_usercmd.MousePosition.Equals(target_pos)
		&& latest_camera_red_zone_poly_screen.IsInside(target_pos)
	)
	if (interacting_with_minimap && latest_usercmd.MousePosition.Equals(target_pos)) { // move camera via minimap
		const eye_vector = WASM.GetEyeVector(default_camera_angles)
		const lookatpos = MinimapSDK.MinimapToWorld(latest_usercmd.MousePosition.Multiply(RendererSDK.WindowSize))
			.SubtractScalarX(eye_vector.x * default_camera_dist)
			.SubtractScalarY(eye_vector.y * default_camera_dist)
		camera_vec.x = lookatpos.x
		camera_vec.y = lookatpos.y
		order_suits = true
	}
	let moving_camera = false
	{ // move camera via screen bounds
		const threshold = 0.008 * RendererSDK.WindowSize.y / RendererSDK.WindowSize.x
		const extend_dist = ExecuteOrder.camera_speed * dt
		if (latest_usercmd.MousePosition.x <= threshold) {
			camera_vec.x -= extend_dist
			moving_camera = true
		} else if (latest_usercmd.MousePosition.x >= 1 - threshold) {
			camera_vec.x += extend_dist
			moving_camera = true
		}
		if (latest_usercmd.MousePosition.y <= threshold) {
			camera_vec.y += extend_dist
			moving_camera = true
		} else if (latest_usercmd.MousePosition.y >= 1 - threshold) {
			camera_vec.y -= extend_dist
			moving_camera = true
		}
		if (!moving_camera && were_moving_camera)
			camera_move_end = current_time
		if (camera_move_end > current_time - camera_move_linger_duration) {
			camera_vec.x += extend_dist * (camera_direction.x - 0.5)
			camera_vec.y -= extend_dist * (camera_direction.y - 0.5)
		}
		were_moving_camera = moving_camera
	}
	if (
		moving_camera
		|| latest_camera_yellow_zone_poly_screen.IsInside(latest_usercmd.MousePosition)
	)
		yellow_zone_out_at = current_time
	if (
		moving_camera
		|| latest_camera_green_zone_poly_screen.IsInside(latest_usercmd.MousePosition)
	)
		green_zone_out_at = current_time
	let camera_limited = false
	{
		const bounds_ent = CameraBounds
		if (bounds_ent !== undefined) {
			const old_x = camera_vec.x,
				old_y = camera_vec.y
			camera_vec.x = Math.min(
				Math.max(camera_vec.x, bounds_ent.BoundsMin.x),
				bounds_ent.BoundsMax.x,
			)
			camera_vec.y = Math.min(
				Math.max(camera_vec.y, bounds_ent.BoundsMin.y),
				bounds_ent.BoundsMax.y,
			)
			camera_limited = camera_vec.x !== old_x || camera_vec.y !== old_y
			if (camera_limited) {
				if (camera_limited_at === 0)
					camera_limited_at = current_time
			} else
				camera_limited_at = 0
		} else
			camera_limited_at = 0
		UpdateCameraBounds(camera_vec)
		target_pos = ComputeTargetPos(camera_vec, current_time)
	}
	let execute_order = camera_limited_at !== 0 && (current_time - camera_limited_at) > camera_limit_max_duration
	if (target_pos instanceof Vector2) {
		order_suits = order_suits || (
			latest_usercmd.MousePosition.Equals(target_pos)
			&& latest_camera_red_zone_poly_screen.IsInside(target_pos)
		)
		execute_order = execute_order || (!moving_camera && order_suits)
	}
	if (execute_order && order !== undefined) {
		if (!ExecuteOrder.prefire_orders)
			order[0].Execute()
		if (ExecuteOrder.debug_orders)
			console.log(`Finished order ${order[0].OrderType} after ${current_time - order[1]}ms at ${GameState.RawGameTime}`)
		last_order_finish = current_time
		ExecuteOrder.order_queue.splice(0, 1)
		order = ProcessOrderQueue(current_time)
	}
	if (order === undefined && last_order_finish < current_time - order_linger_duration)
		last_order_target = undefined
	latest_camera_x = latest_usercmd.CameraPosition.x = camera_vec.x
	latest_camera_y = latest_usercmd.CameraPosition.y = camera_vec.y

	latest_cursor.CopyFrom(latest_usercmd.MousePosition)
	latest_usercmd.MousePosition
		.MultiplyForThis(RendererSDK.WindowSize)
		.RoundForThis()
		.DivideForThis(RendererSDK.WindowSize)
	latest_usercmd.VectorUnderCursor.CopyFrom(debug_cursor.CopyFrom(RendererSDK.ScreenToWorldFar(
		[latest_cursor],
		camera_vec,
		default_camera_dist,
	)[0]))
	const units_nearby = orderBy(
		EntityManager.GetEntitiesByClass(Unit).filter(ent => (
			ent.IsVisible
			&& ent.IsSpawned
			&& EntityHitBoxIntersects(ent, camera_vec, latest_usercmd.MousePosition)
		)),
		ent => ent.Distance(latest_usercmd.VectorUnderCursor),
	)
	latest_usercmd.WeaponSelect = (
		(order !== undefined || ExecuteOrder.hold_orders > 0)
		&& last_order_target instanceof Unit
		&& units_nearby.includes(last_order_target)
	) ? last_order_target : units_nearby[0]

	if (usercmd_cache_last_wrote < current_time - usercmd_cache_delay) {
		usercmd_cache.push(latest_usercmd.Clone())
		usercmd_cache_last_wrote = current_time
	}
}
EventsSDK.on("Draw", ProcessUserCmd)
Events.on("RequestUserCmd", () => {
	ExecuteOrder.received_usercmd_request = true
	ProcessUserCmd()
	if (ExecuteOrder.disable_humanizer)
		return
	usercmd_cache.forEach(usercmd => {
		usercmd.WriteBack()
		WriteUserCmd()
	})
	if (usercmd_cache.length === 0) {
		latest_usercmd.WriteBack()
		WriteUserCmd()
	}
	usercmd_cache.splice(0)
	usercmd_cache_last_wrote = 0
})

const debugParticles = new ParticlesSDK()
EventsSDK.on("Draw", () => {
	if (
		!ExecuteOrder.debug_draw
		|| ExecuteOrder.disable_humanizer
		|| GameState.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME
	) {
		debugParticles.DestroyAll()
		return
	}
	const hero = LocalPlayer?.Hero
	if (hero !== undefined) {
		debug_camera_poly.Draw("1", hero, debugParticles, Color.Aqua, 40, 40, false)
		latest_camera_green_zone_poly_world.Draw("2", hero, debugParticles, Color.Green, 40, 40, false)
		latest_camera_yellow_zone_poly_world.Draw("3", hero, debugParticles, Color.Yellow, 40, 40, false)
		latest_camera_red_zone_poly_world.Draw("4", hero, debugParticles, Color.Red, 40, 40, false)
	}

	const debug_point = RendererSDK.WorldToScreen(debug_cursor)
	if (debug_point !== undefined)
		RendererSDK.FilledRect(debug_point.Subtract(new Vector2(5, 5)), new Vector2(10, 10), Color.Fuchsia)
})

Events.on("PrepareUnitOrders", async () => {
	if (GameRules?.IsPaused)
		return true
	const order = ExecuteOrder.fromNative()
	if (order === undefined)
		return true

	const ret = await EventsSDK.emit("PrepareUnitOrders", true, order)
	if (!ret)
		return false
	if (!ExecuteOrder.disable_humanizer) {
		order.ExecuteQueued()
		if (latest_usercmd !== undefined)
			ProcessUserCmd()
		return false
	}
	return true
})

function ClearHumanizerState() {
	ExecuteOrder.order_queue.splice(0)
	last_order_finish = 0
	latest_camera_x = 0
	latest_camera_y = 0
	current_order = undefined
	debug_cursor.toZero()
	latest_update = 0
	latest_usercmd = new UserCmd()
	camera_move_end = 0
	camera_direction.toZero()
	usercmd_cache.splice(0)
	usercmd_cache_last_wrote = 0
	yellow_zone_out_at = 0
	green_zone_out_at = 0
	camera_limited_at = 0
	InputManager.IsShopOpen = false
	InputManager.IsScoreboardOpen = false
	InputManager.SelectedEntities.splice(0)
}

Events.on("NewConnection", ClearHumanizerState)
EventsSDK.on("GameEnded", ClearHumanizerState)
