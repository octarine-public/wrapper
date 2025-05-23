import { Color } from "../Base/Color"
import { QAngle } from "../Base/QAngle"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { DOTA_SHOP_TYPE } from "../Enums/DOTA_SHOP_TYPE"
import { DOTAGameState } from "../Enums/DOTAGameState"
import { DOTAGameUIState } from "../Enums/DOTAGameUIState"
import { DOTAScriptInventorySlot } from "../Enums/DOTAScriptInventorySlot"
import { dotaunitorder_t } from "../Enums/dotaunitorder_t"
import { WorldPolygon } from "../Geometry/WorldPolygon"
import { CLowerHUD } from "../GUI/CLowerHUD"
import { GUIInfo } from "../GUI/GUIInfo"
import { EntityManager } from "../Managers/EntityManager"
import { Events } from "../Managers/Events"
import { EventsSDK } from "../Managers/EventsSDK"
import { InputEventSDK, InputManager, VKeys } from "../Managers/InputManager"
import { MinimapSDK } from "../Managers/MinimapSDK"
import { ParticlesSDK } from "../Managers/ParticleManager"
import { Ability } from "../Objects/Base/Ability"
import { CameraBounds } from "../Objects/Base/CameraBounds"
import { Entity, GameRules, LocalPlayer } from "../Objects/Base/Entity"
import { Item } from "../Objects/Base/Item"
import { TempTree } from "../Objects/Base/TempTree"
import { Tree } from "../Objects/Base/Tree"
import { Unit, Units } from "../Objects/Base/Unit"
import { GetWorldBounds } from "../Objects/Base/WorldLayer"
import { Shop } from "../Objects/Buildings/Shop"
import { GameState } from "../Utils/GameState"
import { CameraSDK } from "./CameraSDK"
import { ConVarsSDK } from "./ConVarsSDK"
import { ExecuteOrder } from "./ExecuteOrder"
import { SetProcessUserCmd } from "./HumanizerGlue"
import { RendererSDK } from "./RendererSDK"
import { UserCmd } from "./UserCmd"
import * as WASM from "./WASM"

class Polygon2D {
	public Points: Vector2[] = []

	constructor(...points: Vector2[]) {
		this.Points = points
	}
	public get Center(): Vector2 {
		return this.Points.reduce(
			(a, b) => a.AddForThis(b),
			new Vector2()
		).DivideScalarForThis(this.Points.length)
	}

	public Draw(color: Color, width = 10): void {
		for (let i = 0; i < this.Points.length; i++) {
			const nextIndex = this.Points.length - 1 === i ? 0 : i + 1
			const point1 = this.Points[i],
				point2 = this.Points[nextIndex]
			if (point1 !== undefined && point2 !== undefined) {
				RendererSDK.Line(point1, point2, color, width)
			}
		}
	}

	public IsInside(point: Vector2): boolean {
		return !this.IsOutside(point)
	}
	public IsOutside(point: Vector2): boolean {
		let isOutside = true
		for (let i = 0; i < this.Points.length; i++) {
			const j = i === 0 ? this.Points.length - 1 : i - 1
			if (
				this.Points[i].y > point.y !== this.Points[j].y > point.y &&
				point.x <
					((this.Points[j].x - this.Points[i].x) *
						(point.y - this.Points[i].y)) /
						(this.Points[j].y - this.Points[i].y) +
						this.Points[i].x
			) {
				isOutside = !isOutside
			}
		}
		return isOutside
	}
}

const latestCursor = new Vector2(),
	cameraPoly = new WorldPolygon(),
	latestCameraPoly = new WorldPolygon(),
	latestCameraGreenZonePolyScreen = new Polygon2D(),
	latestCameraYellowZonePolyScreen = new Polygon2D(),
	latestCameraRedZonePolyScreen = new Polygon2D(),
	latestCameraGreenZonePolyWorld = new WorldPolygon(),
	latestCameraYellowZonePolyWorld = new WorldPolygon(),
	latestCameraRedZonePolyWorld = new WorldPolygon(),
	defaultCameraDist = CameraSDK.DefaultDistance, // default camera distance
	defaultCameraAngles = CameraSDK.DefaultAngles
function UpdateCameraBounds(cameraVec2D: Vector2) {
	const cameraVec = WASM.GetCameraPosition(
		cameraVec2D,
		defaultCameraDist,
		defaultCameraAngles
	)
	latestCameraPoly.Points = RendererSDK.ScreenToWorldFar(
		[new Vector2(1, 1), new Vector2(0, 1), new Vector2(0, 0), new Vector2(1, 0)],
		cameraVec,
		defaultCameraDist
	)
	CameraSDK.Polygon.Points = latestCameraPoly.Points
	cameraPoly.Points = [
		latestCameraPoly.Points[0],
		cameraVec,
		latestCameraPoly.Points[1],
		cameraVec,
		latestCameraPoly.Points[2],
		cameraVec,
		latestCameraPoly.Points[3],
		cameraVec,
		latestCameraPoly.Points[0],
		latestCameraPoly.Points[1],
		latestCameraPoly.Points[2],
		latestCameraPoly.Points[3]
	]
	const screenSize = RendererSDK.WindowSize,
		minimap = GUIInfo.Minimap.Minimap
	const cameraLimitX1 =
			(GUIInfo.HUDFlipped ? minimap.Left : minimap.Right) / screenSize.x,
		cameraLimitX2 = GUIInfo.HUDFlipped ? 0.05 : 0.95
	let cameraLimitYMin = Math.min(
		(GUIInfo.TopBar.RadiantPlayersHeroImages[0].Bottom * 2) / screenSize.y,
		0.1
	)
	let cameraLimitYMax = minimap.Top / screenSize.y,
		cameraLimitXMin = Math.min(cameraLimitX1, cameraLimitX2),
		cameraLimitXMax = Math.max(cameraLimitX1, cameraLimitX2)
	latestCameraRedZonePolyScreen.Points = [
		new Vector2(cameraLimitXMax, cameraLimitYMax),
		new Vector2(cameraLimitXMin, cameraLimitYMax),
		new Vector2(cameraLimitXMin, cameraLimitYMin),
		new Vector2(cameraLimitXMax, cameraLimitYMin)
	]
	const xOffsetMinimap = 1 / 25,
		xOffsetNonMinimap = 1 / 15,
		yOffsetMin = 1 / 8,
		yOffsetMax = 1 / 15
	cameraLimitYMin += yOffsetMin
	cameraLimitYMax -= yOffsetMax
	if (GUIInfo.HUDFlipped) {
		cameraLimitXMin += xOffsetNonMinimap
		cameraLimitXMax -= xOffsetMinimap
	} else {
		cameraLimitXMin += xOffsetMinimap
		cameraLimitXMax -= xOffsetNonMinimap
	}
	latestCameraYellowZonePolyScreen.Points = [
		new Vector2(cameraLimitXMax, cameraLimitYMax),
		new Vector2(cameraLimitXMin, cameraLimitYMax),
		new Vector2(cameraLimitXMin, cameraLimitYMin),
		new Vector2(cameraLimitXMax, cameraLimitYMin)
	]
	const xAvailable = cameraLimitXMax - cameraLimitXMin,
		yAvailable = cameraLimitYMax - cameraLimitYMin
	cameraLimitXMin += xAvailable / 6
	cameraLimitXMax -= xAvailable / 6
	cameraLimitYMin += yAvailable / 6
	cameraLimitYMax -= yAvailable / 6
	latestCameraGreenZonePolyScreen.Points = [
		new Vector2(cameraLimitXMax, cameraLimitYMax),
		new Vector2(cameraLimitXMin, cameraLimitYMax),
		new Vector2(cameraLimitXMin, cameraLimitYMin),
		new Vector2(cameraLimitXMax, cameraLimitYMin)
	]

	latestCameraGreenZonePolyWorld.Points = RendererSDK.ScreenToWorldFar(
		latestCameraGreenZonePolyScreen.Points,
		cameraVec,
		defaultCameraDist
	)
	latestCameraYellowZonePolyWorld.Points = RendererSDK.ScreenToWorldFar(
		latestCameraYellowZonePolyScreen.Points,
		cameraVec,
		defaultCameraDist
	)
	latestCameraRedZonePolyWorld.Points = RendererSDK.ScreenToWorldFar(
		latestCameraRedZonePolyScreen.Points,
		cameraVec,
		defaultCameraDist
	)
}

function CanOrderBeSkipped(order: ExecuteOrder): boolean {
	switch (order.OrderType) {
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE: {
			const abil = order.Ability_
			if (abil instanceof Ability && abil.IsDoubleTap(order)) {
				return true
			}
			break
		}
		default:
			break
	}
	switch (order.OrderType) {
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION:
			return Units.some(
				ent =>
					ent.IsGloballyTargetable &&
					order.Position.Distance2D(ent.VisualPosition) < 200
			)
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
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM:
		case dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM:
			return false
		default:
			return true
	}
}

function GetEntityHitBox(ent: Entity, cameraVec: Vector2): Nullable<Polygon2D> {
	const points = ent.BoundingBox.Polygon.Points
	const w2s = points
		.map(point => RendererSDK.WorldToScreenCustom(point, cameraVec))
		.filter(
			point =>
				point !== undefined &&
				point.x >= 0 &&
				point.y >= 0 &&
				point.x <= 1 &&
				point.y <= 1
		)
	if (w2s.length < 2) {
		return undefined
	}
	return new Polygon2D(...(w2s as Vector2[]))
}

function EntityHitBoxesIntersect(
	ents: Entity[],
	cameraVec: Vector3 | Vector2,
	cursorVec: Vector2
): boolean[] {
	if (cameraVec instanceof Vector2) {
		cameraVec = WASM.GetCameraPosition(
			cameraVec,
			defaultCameraDist,
			defaultCameraAngles
		)
	}
	const ray = WASM.GetCursorRay(
		cursorVec,
		RendererSDK.WindowSize,
		defaultCameraAngles,
		-1
	)
	return WASM.BatchCheckRayBox(
		cameraVec,
		ray,
		ents.map(ent => ent.BoundingBox)
	)
}

function GetRectForSlot(hud: CLowerHUD, slot: DOTAScriptInventorySlot): Rectangle {
	const currentSlot: DOTAScriptInventorySlot = Math.min(
		Math.max(slot, DOTAScriptInventorySlot.DOTA_ITEM_SLOT_1),
		DOTAScriptInventorySlot.DOTA_ITEM_NEUTRAL_SLOT
	)
	if (
		currentSlot >= DOTAScriptInventorySlot.DOTA_ITEM_SLOT_1 &&
		currentSlot <= DOTAScriptInventorySlot.DOTA_ITEM_SLOT_6
	) {
		return hud.MainInventorySlots[
			currentSlot - DOTAScriptInventorySlot.DOTA_ITEM_SLOT_1
		]
	} else if (
		currentSlot >= DOTAScriptInventorySlot.DOTA_ITEM_SLOT_7 &&
		currentSlot <= DOTAScriptInventorySlot.DOTA_ITEM_SLOT_9
	) {
		return hud.BackpackSlots[currentSlot - DOTAScriptInventorySlot.DOTA_ITEM_SLOT_7]
	} else if (
		currentSlot >= DOTAScriptInventorySlot.DOTA_STASH_SLOT_1 &&
		currentSlot <= DOTAScriptInventorySlot.DOTA_STASH_SLOT_6
	) {
		return GUIInfo.Shop.StashSlots[
			currentSlot - DOTAScriptInventorySlot.DOTA_STASH_SLOT_1
		]
	} else if (currentSlot === DOTAScriptInventorySlot.DOTA_ITEM_TP_SCROLL) {
		return hud.TPSlot
	} else if (currentSlot === DOTAScriptInventorySlot.DOTA_ITEM_NEUTRAL_SLOT) {
		return hud.NeutralSlot
	}
	throw `Unexpected currentSlot ${currentSlot}`
}

function ComputeTargetPosVector3(
	cameraVec: Vector2,
	currentTime: number,
	pos: Vector3
): Vector3 | Vector2 {
	const yellowZoneReached = yellowZoneOutAt < currentTime - yellowZoneMaxDuration,
		greenZoneReached = greenZoneOutAt < currentTime - greenZoneMaxDuration
	const currentPos = latestUsercmd.MousePosition
	const w2s = RendererSDK.WorldToScreenCustom(pos, cameraVec)
	if (
		w2s === undefined ||
		w2s.x < 0 ||
		w2s.y < 0 ||
		w2s.x > 1 ||
		w2s.y > 1 ||
		((latestCameraRedZonePolyScreen.IsOutside(w2s) ||
			((yellowZoneReached || greenZoneReached) &&
				latestCameraGreenZonePolyScreen.IsOutside(w2s))) &&
			CanMoveCamera(cameraVec, w2s))
	) {
		return pos
	}
	// allow 0.25% error (i.e. 9x5 area or 4x2 error for 1920x1080)
	const min = w2s.SubtractScalar(0.0025).Max(0).Min(1),
		max = w2s.AddScalar(0.0025).Max(0).Min(1)
	if (new Rectangle(min, max).Contains(currentPos)) {
		return currentPos
	}
	return min.AddForThis(max.SubtractForThis(min).MultiplyScalarForThis(Math.random()))
}

function ComputeTargetPosEntity(
	cameraVec: Vector2,
	currentTime: number,
	ent: Entity
): Vector3 | Vector2 {
	const yellowZoneReached = yellowZoneOutAt < currentTime - yellowZoneMaxDuration,
		greenZoneReached = greenZoneOutAt < currentTime - greenZoneMaxDuration
	const currentPos = latestUsercmd.MousePosition

	if (
		EntityHitBoxesIntersect([ent], cameraVec, currentPos)[0] &&
		(latestCameraRedZonePolyScreen.IsInside(currentPos) ||
			!CanMoveCamera(cameraVec, currentPos))
	) {
		return currentPos
	}
	const hitbox = GetEntityHitBox(ent, cameraVec)
	if (
		hitbox === undefined ||
		hitbox.Points.some(
			point =>
				(latestCameraRedZonePolyScreen.IsOutside(point) ||
					((yellowZoneReached || greenZoneReached) &&
						latestCameraGreenZonePolyScreen.IsOutside(point))) &&
				CanMoveCamera(cameraVec, point)
		)
	) {
		return ent.VisualPosition
	}
	// TODO: try to find best spot between other entities' hitboxes, i.e. between creeps
	const center = hitbox.Center,
		min = hitbox.Points.reduce(
			(prev, cur) => prev.Min(cur),
			new Vector2()
		).SubtractForThis(center),
		max = hitbox.Points.reduce(
			(prev, cur) => prev.Max(cur),
			new Vector2()
		).SubtractForThis(center)
	for (let i = 0; i < 1000; i++) {
		const generated = center
			.Add(min.MultiplyScalar(Math.random() / 2))
			.AddForThis(max.MultiplyScalar(Math.random() / 2))
		if (
			EntityHitBoxesIntersect([ent], cameraVec, generated)[0] &&
			(latestCameraRedZonePolyScreen.IsInside(generated) ||
				!CanMoveCamera(cameraVec, generated))
		) {
			return generated
		}
	}
	if (
		latestCameraRedZonePolyScreen.IsOutside(center) &&
		CanMoveCamera(cameraVec, center)
	) {
		return ent.VisualPosition
	}
	return center
}

let initializedMousePosition = false,
	standaloneMovingTo: Nullable<Vector3>

function ComputeTargetPos(
	cameraVec: Vector2,
	currentTime: number
): [Vector3 | Vector2, boolean, boolean] {
	const yellowZoneReached = yellowZoneOutAt < currentTime - yellowZoneMaxDuration,
		greenZoneReached = greenZoneOutAt < currentTime - greenZoneMaxDuration
	const currentPos = latestUsercmd.MousePosition
	if (lastOrderTarget instanceof Entity) {
		return [
			ComputeTargetPosEntity(cameraVec, currentTime, lastOrderTarget),
			true,
			false
		]
	} else if (lastOrderTarget instanceof Vector3) {
		return [
			ComputeTargetPosVector3(cameraVec, currentTime, lastOrderTarget),
			true,
			false
		]
	} else if (typeof lastOrderTarget === "object") {
		if (lastOrderTarget.finishedSrc) {
			if (lastOrderTarget.dst instanceof Vector3) {
				return [
					ComputeTargetPosVector3(cameraVec, currentTime, lastOrderTarget.dst),
					true,
					false
				]
			}
			if (lastOrderTarget.dst instanceof Entity) {
				return [
					ComputeTargetPosEntity(cameraVec, currentTime, lastOrderTarget.dst),
					true,
					false
				]
			}
		}
		const hud = GUIInfo.GetLowerHUDForUnit(lastOrderTarget.unit)
		let currentRect = GetRectForSlot(
			hud,
			lastOrderTarget.finishedSrc
				? (lastOrderTarget.dst as DOTAScriptInventorySlot)
				: lastOrderTarget.src
		)
		if (ExecuteOrder.DebugDraw) {
			RendererSDK.FilledRect(currentRect.pos1, currentRect.Size)
		}
		if (currentRect.Contains(currentPos.Multiply(RendererSDK.WindowSize))) {
			if (!lastOrderTarget.finishedSrc) {
				lastOrderTarget.finishedSrc = true
				if (lastOrderTarget.dst instanceof Vector3) {
					return [
						ComputeTargetPosVector3(
							cameraVec,
							currentTime,
							lastOrderTarget.dst
						),
						true,
						false
					]
				}
				if (lastOrderTarget.dst instanceof Entity) {
					return [
						ComputeTargetPosEntity(
							cameraVec,
							currentTime,
							lastOrderTarget.dst
						),
						true,
						false
					]
				}
				currentRect = GetRectForSlot(hud, lastOrderTarget.dst)
			} else {
				return [currentPos, true, true]
			}
		}
		return [
			currentRect.pos1
				.Add(
					currentRect.Size.MultiplyScalarForThis(
						lastOrderTarget.finishedSrc
							? lastOrderTarget.dstRng
							: lastOrderTarget.srcRng
					)
				)
				.DivideForThis(RendererSDK.WindowSize),
			lastOrderTarget.finishedSrc,
			!lastOrderTarget.finishedSrc || typeof lastOrderTarget.dst === "number"
		]
	}
	{
		if (ExecuteOrder.IsStandalone) {
			const w2s = latestUsercmd.MousePosition
			if (
				(latestCameraRedZonePolyScreen.IsOutside(w2s) ||
					((yellowZoneReached || greenZoneReached) &&
						latestCameraGreenZonePolyScreen.IsOutside(w2s))) &&
				CanMoveCamera(cameraVec, w2s)
			) {
				if (standaloneMovingTo === undefined) {
					standaloneMovingTo = latestUsercmd.VectorUnderCursor.Clone()
				}
				return [standaloneMovingTo, true, true]
			}
			standaloneMovingTo = undefined
			return [w2s, true, true]
		}
		latestUsercmd.ScoreboardOpened = InputManager.IsScoreboardOpen
		const localHero = LocalPlayer?.Hero
		if (InputManager.IsShopOpen && localHero !== undefined) {
			switch (
				(
					EntityManager.AllEntities.find(
						ent => ent.IsShop && ent.Distance2D(localHero) < 720
					) as Shop
				)?.ShopType
			) {
				case DOTA_SHOP_TYPE.DOTA_SHOP_SECRET:
					latestUsercmd.ShopMask = 12
					break
				default:
					latestUsercmd.ShopMask = 13
					break
			}
		}
		const cursorPos = InputManager.CursorOnScreen,
			gameState = GameRules?.GameState ?? DOTAGameState.DOTA_GAMERULES_STATE_INIT,
			selectedEnt = InputManager.SelectedUnit
		if (
			gameState < DOTAGameState.DOTA_GAMERULES_STATE_PRE_GAME ||
			gameState === DOTAGameState.DOTA_GAMERULES_STATE_POST_GAME ||
			GUIInfo.Minimap.Minimap.Contains(cursorPos) ||
			GUIInfo.Shop.Sticky2Rows.Contains(cursorPos) ||
			GUIInfo.Shop.Quickbuy2Rows.Contains(cursorPos) ||
			GUIInfo.Shop.ClearQuickBuy2Rows.Contains(cursorPos) ||
			GUIInfo.Shop.CourierGold.Contains(cursorPos) ||
			(InputManager.IsScoreboardOpen &&
				GUIInfo.Scoreboard.Background.Contains(currentPos)) ||
			(InputManager.IsShopOpen &&
				(GUIInfo.OpenShopLarge.Header.Contains(cursorPos) ||
					GUIInfo.OpenShopLarge.ItemCombines.Contains(cursorPos) ||
					GUIInfo.OpenShopLarge.Items.Contains(cursorPos) ||
					GUIInfo.OpenShopLarge.PinnedItems.Contains(cursorPos) ||
					GUIInfo.OpenShopLarge.GuideFlyout.Contains(cursorPos))) ||
			((InputManager.IsShopOpen ||
				(selectedEnt?.Inventory?.Stash?.length ?? 0) !== 0) &&
				(GUIInfo.Shop.Stash.Contains(cursorPos) ||
					GUIInfo.Shop.StashGrabAll.Contains(cursorPos)))
		) {
			return [cursorPos.Divide(RendererSDK.WindowSize), true, true]
		}
		const hud = GUIInfo.GetLowerHUDForUnit(selectedEnt)
		if (
			hud.InventoryContainer.Contains(cursorPos) ||
			hud.NeutralAndTPContainer.Contains(cursorPos) ||
			hud.XP.Contains(cursorPos)
		) {
			return [cursorPos.Divide(RendererSDK.WindowSize), true, true]
		}
		const pos = InputManager.CursorOnWorld
		if (pos.IsValid && pos.z >= -1024) {
			const w2s = RendererSDK.WorldToScreenCustom(pos, cameraVec)
			if (
				w2s === undefined ||
				w2s.x < 0 ||
				w2s.y < 0 ||
				w2s.x > 1 ||
				w2s.y > 1 ||
				((latestCameraRedZonePolyScreen.IsOutside(w2s) ||
					((yellowZoneReached || greenZoneReached) &&
						latestCameraGreenZonePolyScreen.IsOutside(w2s))) &&
					CanMoveCamera(cameraVec, w2s))
			) {
				return [pos.Clone(), true, true]
			}
			return [w2s, true, true]
		}
		return [cursorPos.Divide(RendererSDK.WindowSize), true, true]
	}
}

let currentOrder: Nullable<[ExecuteOrder, number, boolean, boolean]>
let lastOrderTarget: Nullable<
	| Vector3
	| Entity
	| {
			unit: Unit
			src: DOTAScriptInventorySlot
			dst: DOTAScriptInventorySlot | Vector3 | Entity
			finishedSrc: boolean
			srcRng: number
			dstRng: number
	  }
>

function ProcessOrderQueue(currentTime: number) {
	let order = ExecuteOrder.orderQueue[0] as Nullable<
		[ExecuteOrder, number, boolean, boolean]
	>
	while (order !== undefined && CanOrderBeSkipped(order[0])) {
		if (ExecuteOrder.DebugOrders) {
			console.log(
				`Executing order ${order[0].OrderType} after ${currentTime - order[1]}ms`
			)
		}
		order[0].Execute()
		order[3] = true
		ExecuteOrder.orderQueue.splice(0, 1)
		currentOrder = undefined
		order = ExecuteOrder.orderQueue[0] as Nullable<
			[ExecuteOrder, number, boolean, boolean]
		>
	}
	if (order === undefined || currentOrder === order) {
		return order
	}
	currentOrder = order
	if (ExecuteOrder.PrefireOrders) {
		if (ExecuteOrder.DebugOrders) {
			console.log(
				`Prefiring order ${order[0].OrderType} after ${
					currentTime - order[1]
				}ms at ${GameState.RawGameTime}`
			)
		}
		order[0].Execute()
		order[3] = true
	}
	switch (order[0].OrderType) {
		case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_DIRECTION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_POSITION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_PATROL:
		case dotaunitorder_t.DOTA_UNIT_ORDER_RADAR:
		case dotaunitorder_t.DOTA_UNIT_ORDER_VECTOR_TARGET_POSITION:
			lastOrderTarget = order[0].Position
			break
		case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE:
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_TO_TARGET:
		case dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_ITEM:
		case dotaunitorder_t.DOTA_UNIT_ORDER_PICKUP_RUNE:
			lastOrderTarget =
				order[0].Target instanceof Entity ? order[0].Target : undefined
			break
		case dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM:
			lastOrderTarget =
				order[0].Ability_ instanceof Item &&
				order[0].Ability_.Owner instanceof Unit &&
				order[0].Target instanceof Entity
					? {
							unit: order[0].Ability_.Owner,
							src: order[0].Ability_.Owner.TotalItems.indexOf(
								order[0].Ability_
							),
							dst: order[0].Target,
							finishedSrc: false,
							srcRng: Math.random(),
							dstRng: Math.random()
						}
					: undefined
			break
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM:
			lastOrderTarget =
				order[0].Ability_ instanceof Item &&
				order[0].Ability_.Owner instanceof Unit &&
				typeof order[0].Target === "number"
					? {
							unit: order[0].Ability_.Owner,
							src: order[0].Ability_.Owner.TotalItems.indexOf(
								order[0].Ability_
							),
							dst: order[0].Target,
							finishedSrc: false,
							srcRng: Math.random(),
							dstRng: Math.random()
						}
					: undefined
			break
		case dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM:
			lastOrderTarget =
				order[0].Ability_ instanceof Item &&
				order[0].Ability_.Owner instanceof Unit
					? {
							unit: order[0].Ability_.Owner,
							src: order[0].Ability_.Owner.TotalItems.indexOf(
								order[0].Ability_
							),
							dst: order[0].Position,
							finishedSrc: false,
							srcRng: Math.random(),
							dstRng: Math.random()
						}
					: undefined
			break
		default:
			lastOrderTarget = undefined
			break
	}
	return order
}

const cameraMoveLingerDuration = 100,
	orderLingerDuration = 115,
	orderLingerDurationMinimap = 250,
	cameraMoveSeedExpiry = 300,
	yellowZoneMaxDuration = 700,
	greenZoneMaxDuration = yellowZoneMaxDuration * 2,
	cameraDirection = new Vector2(),
	debugCursor = new Vector3(),
	worldBounds = GetWorldBounds()
let lastOrderFinish = 0,
	lastOrderUsedMinimap = false,
	latestCameraX = 0,
	latestCameraY = 0,
	cameraMoveEnd = 0,
	wereMovingCamera = false,
	latestUsercmd = new UserCmd(),
	lastcameraMoveSeed = 0,
	yellowZoneOutAt = 0,
	greenZoneOutAt = 0,
	cursorAtMinimapAt = 0,
	cursorEnteredMinimapAt = 0

function CanMoveCamera(cameraVec: Vector2, targetPos: Vector2): boolean {
	if (latestCameraRedZonePolyScreen.IsInside(targetPos)) {
		return true
	}
	const boundsMin =
		CameraBounds?.BoundsMin ??
		(worldBounds !== undefined ? worldBounds[0] : undefined)
	const boundsMax =
		CameraBounds?.BoundsMax ??
		(worldBounds !== undefined ? worldBounds[1] : undefined)
	if (boundsMin === undefined || boundsMax === undefined) {
		return true
	}
	if (targetPos.x < 0.5) {
		if (
			Math.abs(cameraVec.x - boundsMin.x) < 1 || // left
			cameraVec.x < boundsMin.x
		) {
			return false
		}
	} else if (
		Math.abs(cameraVec.x - boundsMax.x) < 1 || // right
		cameraVec.x > boundsMax.x
	) {
		return false
	}
	if (targetPos.y < 0.5) {
		if (
			Math.abs(cameraVec.y - boundsMax.y) < 1 || // top
			cameraVec.y > boundsMax.y
		) {
			return false
		}
	} else if (
		Math.abs(cameraVec.y - boundsMin.y) < 1 || // bot
		cameraVec.y < boundsMin.y
	) {
		return false
	}
	return true
}

function MoveCameraByScreen(
	cameraVec: Vector2,
	targetPos: Vector3,
	currentTime: number
): Vector2 {
	const distRightBot = targetPos.DistanceSqr2D(
			latestCameraGreenZonePolyWorld.Points[0]
		),
		distLeftBot = targetPos.DistanceSqr2D(latestCameraGreenZonePolyWorld.Points[1]),
		distLeftTop = targetPos.DistanceSqr2D(latestCameraGreenZonePolyWorld.Points[2]),
		distRightTop = targetPos.DistanceSqr2D(latestCameraGreenZonePolyWorld.Points[3]),
		distCenterBot = targetPos.DistanceSqr2D(
			latestCameraGreenZonePolyWorld.Points[0]
				.Add(latestCameraGreenZonePolyWorld.Points[1])
				.DivideScalarForThis(2)
		),
		distCenterLeft = targetPos.DistanceSqr2D(
			latestCameraGreenZonePolyWorld.Points[1]
				.Add(latestCameraGreenZonePolyWorld.Points[2])
				.DivideScalarForThis(2)
		),
		distCenterTop = targetPos.DistanceSqr2D(
			latestCameraGreenZonePolyWorld.Points[2]
				.Add(latestCameraGreenZonePolyWorld.Points[3])
				.DivideScalarForThis(2)
		),
		distCenterRight = targetPos.DistanceSqr2D(
			latestCameraGreenZonePolyWorld.Points[0]
				.Add(latestCameraGreenZonePolyWorld.Points[3])
				.DivideScalarForThis(2)
		)
	const minCornerDist = Math.min(distRightBot, distLeftBot, distLeftTop, distRightTop)
	const minCenterDist = Math.min(
		distCenterBot,
		distCenterLeft,
		distCenterTop,
		distCenterRight
	)
	if (minCornerDist < minCenterDist) {
		if (minCornerDist === distRightBot) {
			cameraDirection.x = 1
			cameraDirection.y = 1
		} else if (minCornerDist === distLeftBot) {
			cameraDirection.x = 0
			cameraDirection.y = 1
		} else if (minCornerDist === distLeftTop) {
			cameraDirection.x = 0
			cameraDirection.y = 0
		} else if (minCornerDist === distRightTop) {
			cameraDirection.x = 1
			cameraDirection.y = 0
		}
	} else if (minCenterDist === distCenterBot) {
		cameraDirection.x = 0.5
		cameraDirection.y = 1
	} else if (minCenterDist === distCenterLeft) {
		cameraDirection.x = 0
		cameraDirection.y = 0.5
	} else if (minCenterDist === distCenterTop) {
		cameraDirection.x = 0.5
		cameraDirection.y = 0
	} else if (minCenterDist === distCenterRight) {
		cameraDirection.x = 1
		cameraDirection.y = 0.5
	}

	if (lastcameraMoveSeed < currentTime - cameraMoveSeedExpiry) {
		lastcameraMoveSeed = currentTime
	}
	if (!CanMoveCamera(cameraVec, cameraDirection)) {
		return new Vector2().Invalidate()
	}
	return new Vector2(
		cameraDirection.x === 0.5
			? Math.min(
					0.9,
					Math.max(0.1, 0.5 + Math.cos(lastcameraMoveSeed) ** 3 * 0.2 - 0.1)
				)
			: cameraDirection.x,
		cameraDirection.y === 0.5
			? Math.min(
					0.9,
					Math.max(0.1, 0.5 + Math.sin(lastcameraMoveSeed) ** 3 * 0.2 - 0.1)
				)
			: cameraDirection.y
	)
}

const shortUnitSwitchDelay = 300
let lastUnitSwitch = 0

function MoveCamera(
	cameraVec: Vector2,
	targetPos: Vector3,
	currentTime: number
): [Vector2, boolean] {
	const eyeVector = WASM.GetEyeVector(defaultCameraAngles)
	const lookatpos = cameraVec
		.Clone()
		.AddScalarX(eyeVector.x * defaultCameraDist)
		.AddScalarY(eyeVector.y * defaultCameraDist)
	const lookatposDist = targetPos.Distance2D(lookatpos)
	if (
		lookatposDist > defaultCameraDist ||
		currentTime - lastUnitSwitch > shortUnitSwitchDelay
	) {
		const nearest = Units.filter(
			ent =>
				ent.IsControllable &&
				ent.RootOwner === LocalPlayer &&
				(ent.IsAlive || ent === LocalPlayer?.Hero) &&
				!ent.IsEnemy()
		).orderBy(ent => ent.DistanceSqr2D(targetPos))[0]

		if (nearest !== undefined) {
			const nearestDist = targetPos.Distance2D(nearest.VisualPosition)
			if (nearestDist < lookatposDist) {
				const newCameraVec = Vector2.FromVector3(
					nearest.VisualPosition.Clone()
						.SubtractScalarX(eyeVector.x * defaultCameraDist)
						.SubtractScalarY(eyeVector.y * defaultCameraDist)
				)
				UpdateCameraBounds(newCameraVec)
				const [targetPosNew] = ComputeTargetPos(newCameraVec, currentTime)
				if (
					targetPosNew instanceof Vector2 ||
					targetPosNew.Distance2D(nearest.VisualPosition) < defaultCameraDist
				) {
					cameraVec.CopyFrom(newCameraVec)
					lastUnitSwitch = currentTime
					return [latestUsercmd.MousePosition.Clone(), false]
				}
				UpdateCameraBounds(cameraVec)
			}
		}
	}
	if (lookatposDist > ExecuteOrder.cameraMinimapSpaces * defaultCameraDist) {
		const minimapTarget = MinimapSDK.WorldToMinimap(targetPos).DivideForThis(
			RendererSDK.WindowSize
		)
		if (
			minimapTarget.x <= 1 &&
			minimapTarget.x >= 0 &&
			minimapTarget.y <= 1 &&
			minimapTarget.y >= 0
		) {
			return [minimapTarget, true]
		}
	}
	return [MoveCameraByScreen(cameraVec, targetPos, currentTime), false]
}

function getParams(): [number, number][] {
	const paramsCount = 5 + Math.round(Math.random() * 3) // [5,8]
	const res: [number, number][] = []
	for (let i = 0; i < paramsCount; i++) {
		const amplitudeRcp = 1 / (0.5 + Math.random()) // [1/1.5, 1/0.5]
		const offset = Math.random() * Math.PI * 2 - Math.PI // offset [-180deg,180deg]
		res.push([amplitudeRcp, offset])
	}
	return res
}

function applyParams(
	params: [number, number][],
	currentTime: number,
	trigFunc: (x: number) => number
): number {
	const sum = params.reduce(
		(prev, [amplitude, offset]) =>
			prev + trigFunc(currentTime * amplitude + offset) ** 2,
		0.5
	)
	return sum / params.length
}

let paramsX = getParams(),
	paramsY = getParams()

function ApplyParams(vec: Vector2, currentTime: number): void {
	const xFactor = applyParams(paramsX, currentTime, Math.cos)
	const yFactor = applyParams(paramsY, currentTime, Math.sin)
	vec.MultiplyScalarX(xFactor).MultiplyScalarY(yFactor)
}

function ProcessUserCmdInternal(currentTime: number, dt: number): void {
	if (ExecuteOrder.DisableHumanizer) {
		return
	}
	latestUsercmd.ShopMask = 15
	let order = ProcessOrderQueue(currentTime)
	latestUsercmd.CameraPosition.x = latestCameraX
	latestUsercmd.CameraPosition.y = latestCameraY
	latestUsercmd.MousePosition.CopyFrom(latestCursor)
	const cameraVec = latestUsercmd.CameraPosition
	UpdateCameraBounds(latestUsercmd.CameraPosition)
	if (
		ExecuteOrder.HoldOrders > 0 &&
		ExecuteOrder.HoldOrdersTarget !== undefined &&
		lastOrderTarget === undefined
	) {
		lastOrderTarget =
			ExecuteOrder.HoldOrdersTarget instanceof Vector3
				? ExecuteOrder.HoldOrdersTarget.Clone().SetZ(
						WASM.GetPositionHeight(ExecuteOrder.HoldOrdersTarget)
					)
				: ExecuteOrder.HoldOrdersTarget
	}
	if (
		(order === undefined || !order[3]) &&
		((lastOrderTarget instanceof Entity &&
			(!lastOrderTarget.IsValid || !lastOrderTarget.IsVisible)) ||
			(lastOrderTarget !== undefined &&
				!(
					lastOrderTarget instanceof Entity ||
					lastOrderTarget instanceof Vector3
				) &&
				(!lastOrderTarget.unit.IsValid || !lastOrderTarget.unit.IsVisible)))
	) {
		if (ExecuteOrder.DebugOrders) {
			console.log(
				`Skipping order due to invalid entity after ${
					currentTime - (order !== undefined ? order[1] : 0)
				}ms`
			)
		}
		lastOrderTarget = undefined
		if (order !== undefined) {
			lastOrderFinish = currentTime
			ExecuteOrder.orderQueue.splice(0, 1)
			order = ProcessOrderQueue(currentTime)
		}
	}
	let [targetPos, canFinishNow, isUIOrder] = ComputeTargetPos(cameraVec, currentTime)
	let interactingWithMinimap = false
	if (targetPos instanceof Vector3) {
		let ar = MoveCamera(cameraVec, targetPos, currentTime)
		if (
			ar[1] &&
			lastOrderUsedMinimap &&
			lastOrderFinish > currentTime - orderLingerDurationMinimap
		) {
			order = undefined
			const targetPosAr = ComputeTargetPos(cameraVec, currentTime)
			targetPos = targetPosAr[0]
			canFinishNow = targetPosAr[1]
			isUIOrder = targetPosAr[2]
			if (targetPos instanceof Vector3) {
				ar = MoveCamera(cameraVec, targetPos, currentTime)
			}
		}
		targetPos = ar[0]
		interactingWithMinimap = ar[1]
		if (interactingWithMinimap && order !== undefined) {
			order[2] = true
		}
	}
	if (order !== undefined) {
		switch (order[0].OrderType) {
			case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_MOVE:
			case dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET:
				latestUsercmd.ClickBehaviors = 2
				break
			case dotaunitorder_t.DOTA_UNIT_ORDER_PATROL:
				latestUsercmd.ClickBehaviors = 8
				break
			case dotaunitorder_t.DOTA_UNIT_ORDER_RADAR:
				latestUsercmd.ClickBehaviors = 11
				break
			default:
				latestUsercmd.ClickBehaviors = 0
				break
		}
	}
	let cursorAtTarget = false
	if (targetPos.IsValid) {
		// move cursor
		const dist = latestUsercmd.MousePosition.Distance(targetPos),
			cursorSpeed = ExecuteOrder.cursorSpeed, // 6
			minAccel = ExecuteOrder.cursorSpeedMinAccel, // 1
			maxAccel = ExecuteOrder.cursorSpeedMaxAccel // 2
		const extend =
			minAccel +
			Math.min(Math.sqrt(dist), 1) * (maxAccel - minAccel) * cursorSpeed * dt
		const dir = latestUsercmd.MousePosition.GetDirectionTo(
			targetPos
		).MultiplyScalarForThis(Math.min(extend, dist))
		ApplyParams(dir, currentTime)
		latestUsercmd.MousePosition.AddForThis(dir)
		cursorAtTarget = dist < (isUIOrder ? 0.0005 : 0.0025)
	}
	const orderSuits =
		!targetPos.IsValid ||
		(cursorAtTarget &&
			(isUIOrder ||
				latestCameraRedZonePolyScreen.IsInside(targetPos) ||
				!CanMoveCamera(cameraVec, targetPos)))
	if (order !== undefined) {
		interactingWithMinimap ||=
			order[2] && currentTime - cursorAtMinimapAt < orderLingerDuration
	}
	// move camera via minimap
	if (interactingWithMinimap) {
		if (cursorEnteredMinimapAt === 0 && GUIInfo.Minimap.Minimap.Contains(targetPos)) {
			cursorEnteredMinimapAt = currentTime
		}
		if (
			currentTime - cursorEnteredMinimapAt >
				ConVarsSDK.GetFloat("dota_minimap_misclick_time", 0.2) &&
			cursorAtTarget
		) {
			const eyeVector = WASM.GetEyeVector(defaultCameraAngles)
			const lookatpos = MinimapSDK.MinimapToWorld(
				latestUsercmd.MousePosition.Multiply(RendererSDK.WindowSize)
			)
				.SubtractScalarX(eyeVector.x * defaultCameraDist)
				.SubtractScalarY(eyeVector.y * defaultCameraDist)
			cameraVec.x = lookatpos.x
			cameraVec.y = lookatpos.y
			if (cursorAtMinimapAt === 0) {
				cursorAtMinimapAt = currentTime
			}
		}
	} else {
		cursorAtMinimapAt = 0
		cursorEnteredMinimapAt = 0
	}
	let movingCamera = false,
		movedX = false,
		movedY = false
	const canMoveCamera = CanMoveCamera(cameraVec, latestUsercmd.MousePosition)
	{
		// move camera via screen bounds
		const threshold = (0.008 * RendererSDK.WindowSize.y) / RendererSDK.WindowSize.x
		const extendDist = ExecuteOrder.cameraSpeed * dt
		if (canMoveCamera) {
			if (latestUsercmd.MousePosition.x <= threshold) {
				cameraVec.x -= extendDist
				movedX = true
				movingCamera = true
			} else if (latestUsercmd.MousePosition.x >= 1 - threshold) {
				cameraVec.x += extendDist
				movedX = true
				movingCamera = true
			}
			if (latestUsercmd.MousePosition.y <= threshold) {
				cameraVec.y += extendDist
				movedY = true
				movingCamera = true
			} else if (latestUsercmd.MousePosition.y >= 1 - threshold) {
				cameraVec.y -= extendDist
				movedY = true
				movingCamera = true
			}
		}
		if (!movingCamera && wereMovingCamera) {
			cameraMoveEnd = currentTime
		}
		if (cameraMoveEnd > currentTime - cameraMoveLingerDuration) {
			cameraVec.x += extendDist * (cameraDirection.x - 0.5)
			cameraVec.y -= extendDist * (cameraDirection.y - 0.5)
			if (cameraDirection.x !== 0.5) {
				movedX = true
			}
			if (cameraDirection.y !== 0.5) {
				movedY = true
			}
		}
		wereMovingCamera = movingCamera
	}
	if (
		movingCamera ||
		latestCameraYellowZonePolyScreen.IsInside(latestUsercmd.MousePosition)
	) {
		yellowZoneOutAt = currentTime
	}
	if (
		movingCamera ||
		latestCameraGreenZonePolyScreen.IsInside(latestUsercmd.MousePosition)
	) {
		greenZoneOutAt = currentTime
	}
	let cameraLimitedX = false,
		cameraLimitedY = false
	{
		const boundsMin =
			CameraBounds?.BoundsMin ??
			(worldBounds !== undefined ? worldBounds[0] : undefined)
		const boundsMax =
			CameraBounds?.BoundsMax ??
			(worldBounds !== undefined ? worldBounds[1] : undefined)
		if (boundsMin !== undefined && boundsMax !== undefined) {
			const oldX = cameraVec.x,
				oldY = cameraVec.y
			cameraVec.x = Math.min(Math.max(cameraVec.x, boundsMin.x), boundsMax.x)
			cameraVec.y = Math.min(Math.max(cameraVec.y, boundsMin.y), boundsMax.y)
			cameraLimitedX = Math.abs(cameraVec.x - oldX) > 0.01
			cameraLimitedY = Math.abs(cameraVec.y - oldY) > 0.01
		}
		UpdateCameraBounds(cameraVec)
		{
			const ar = ComputeTargetPos(cameraVec, currentTime)
			targetPos = ar[0]
			canFinishNow = ar[1]
			isUIOrder = ar[2]
		}
		if (targetPos instanceof Vector3) {
			let ar = MoveCamera(cameraVec, targetPos, currentTime)
			if (
				ar[1] &&
				lastOrderUsedMinimap &&
				lastOrderFinish > currentTime - orderLingerDurationMinimap
			) {
				order = undefined
				const targetPosAr = ComputeTargetPos(cameraVec, currentTime)
				targetPos = targetPosAr[0]
				canFinishNow = targetPosAr[1]
				isUIOrder = targetPosAr[2]
				if (targetPos instanceof Vector3) {
					ar = MoveCamera(cameraVec, targetPos, currentTime)
				}
			}
			targetPos = ar[0]
			interactingWithMinimap = ar[1]
			if (interactingWithMinimap && order !== undefined) {
				order[2] = true
			}
		}
	}
	const cameraLimited =
		!canMoveCamera ||
		(movingCamera && cameraLimitedX === movedX && cameraLimitedY === movedY)
	if (
		(!movingCamera && !interactingWithMinimap) ||
		cameraLimited ||
		!targetPos.IsValid
	) {
		let executeOrder = cameraLimited || !targetPos.IsValid
		if (targetPos instanceof Vector2) {
			executeOrder ||=
				orderSuits ||
				(cursorAtTarget &&
					(isUIOrder || latestCameraRedZonePolyScreen.IsInside(targetPos)))
		}
		if ((canFinishNow || !targetPos.IsValid) && executeOrder && order !== undefined) {
			if (!ExecuteOrder.PrefireOrders) {
				order[0].Execute()
				order[3] = true
			}
			if (ExecuteOrder.DebugOrders) {
				console.log(
					`Finished order ${order[0].OrderType} after ${
						currentTime - order[1]
					}ms at ${GameState.RawGameTime}`
				)
			}
			lastOrderFinish = currentTime
			lastOrderUsedMinimap = order[2]
			ExecuteOrder.orderQueue.splice(0, 1)
		}
	}
	if (
		order === undefined &&
		lastOrderFinish <
			currentTime -
				(lastOrderUsedMinimap ? orderLingerDurationMinimap : orderLingerDuration)
	) {
		lastOrderTarget = undefined
	}
	latestCameraX = latestUsercmd.CameraPosition.x = cameraVec.x
	latestCameraY = latestUsercmd.CameraPosition.y = cameraVec.y

	latestCursor.CopyFrom(latestUsercmd.MousePosition)

	latestUsercmd.MousePosition.MultiplyForThis(RendererSDK.WindowSize)
		.RoundForThis()
		.DivideForThis(RendererSDK.WindowSize)
	const screenToWorldPosition = RendererSDK.ScreenToWorldFar(
		[latestCursor],
		cameraVec,
		defaultCameraDist
	)[0]
	latestUsercmd.VectorUnderCursor.CopyFrom(debugCursor.CopyFrom(screenToWorldPosition))
	const units = Units.filter(ent => ent.IsVisible && ent.IsSpawned)
	const intersectedUnitsMask = EntityHitBoxesIntersect(
		units,
		cameraVec,
		latestUsercmd.MousePosition
	)
	const intersectedUnits = units.filter((_, i) => intersectedUnitsMask[i])
	latestUsercmd.WeaponSelect =
		(order !== undefined || ExecuteOrder.HoldOrders > 0) &&
		lastOrderTarget instanceof Unit &&
		intersectedUnits.includes(lastOrderTarget)
			? lastOrderTarget
			: intersectedUnits.orderBy(ent =>
					latestUsercmd.VectorUnderCursor.DistanceSqr(ent.VisualPosition)
				)[0]

	// console.log(latestUsercmd.MousePosition, latestUsercmd.VectorUnderCursor)
	latestUsercmd.Write()
	WriteUserCmd()
}

let lastUpdate = 0
function ProcessUserCmd(force = false): void {
	const currentTime = hrtime()
	if (lastUpdate === 0) {
		lastUpdate = currentTime
	}
	if (currentTime - lastUpdate > 100) {
		lastUpdate = currentTime - 100
	}
	if (RendererSDK.WindowSize.IsZero()) {
		return
	}
	latestUsercmd.Pawn = LocalPlayer?.Pawn
	latestUsercmd.SpectatorStatsCategoryID = 0
	latestUsercmd.SpectatorStatsSortMethod = 0
	latestUsercmd.TickCount = GameState.CurrentServerTick
	if (ExecuteOrder.IsStandalone) {
		if (!initializedMousePosition) {
			latestUsercmd.MousePosition.x = 0.1 + Math.random() / 2
			latestUsercmd.MousePosition.y = 0.1 + Math.random() / 2
			initializedMousePosition = true
		}
	} else {
		latestUsercmd.MousePosition.CopyFrom(
			InputManager.CursorOnScreen.DivideForThis(RendererSDK.WindowSize)
		)
	}
	InputManager.IsShopOpen = IsShopOpen()
	InputManager.IsScoreboardOpen =
		ConVarsSDK.GetInt("dota_spectator_stats_panel", 0) === 1
	const numSelected = GetSelectedEntities()
	InputManager.SelectedEntities.clear()
	for (let i = 0; i < numSelected; i++) {
		const ent = EntityManager.EntityByIndex<Unit>(IOBufferView.getUint32(i * 4, true))
		if (ent !== undefined) {
			InputManager.SelectedEntities.push(ent)
		}
	}
	if (InputManager.SelectedEntities.length === 0) {
		const ent = LocalPlayer?.Hero
		if (ent !== undefined) {
			InputManager.SelectedEntities.push(ent)
		}
	}

	InputManager.QueryUnit = EntityManager.EntityByIndex<Unit>(GetQueryUnit())

	if (InputManager.QueryUnit === undefined) {
		InputManager.QueryUnit = EntityManager.EntityByIndex<Unit>(
			GetQueryUnit() & EntityManager.INDEX_MASK
		)
	}

	InputManager.SelectedUnit = !ConVarsSDK.GetBoolean("dota_hud_new_query_panel", false)
		? (InputManager.QueryUnit ?? InputManager.SelectedEntities[0])
		: (InputManager.SelectedEntities[0] ?? InputManager.QueryUnit)

	InputManager.CursorOnWorld = RendererSDK.ScreenToWorldFar(
		[latestUsercmd.MousePosition],
		Camera.Position ? Vector3.fromIOBuffer() : new Vector3(),
		RendererSDK.CameraDistance,
		Camera.Angles ? QAngle.fromIOBuffer() : new QAngle(),
		RendererSDK.WindowSize,
		Camera.FoV
	)[0]
	const dt = currentTime - lastUpdate,
		processUserCmdWindow = 1000 / 60
	for (let i = 0; i <= dt; i += processUserCmdWindow) {
		if (dt - i >= processUserCmdWindow || force) {
			const curDt = Math.min(dt - i, processUserCmdWindow)
			ProcessUserCmdInternal(currentTime + i, curDt / 1000)
			lastUpdate += curDt
		}
	}
}
SetProcessUserCmd(() => ProcessUserCmd(true))
EventsSDK.on("Draw", ProcessUserCmd)
Events.on("RequestUserCmd", () => {
	if (!ExecuteOrder.DisableHumanizer) {
		ProcessUserCmd(true)
	}
})

const debugParticles = new ParticlesSDK()
EventsSDK.on("Draw", () => {
	if (
		!ExecuteOrder.DebugDraw ||
		ExecuteOrder.DisableHumanizer ||
		GameState.UIState !== DOTAGameUIState.DOTA_GAME_UI_DOTA_INGAME
	) {
		debugParticles.DestroyAll()
		return
	}
	const hero = LocalPlayer?.Hero
	if (hero !== undefined) {
		cameraPoly.Draw("1", hero, debugParticles, Color.Aqua, 40, 40, false)
		latestCameraGreenZonePolyWorld.Draw(
			"2",
			hero,
			debugParticles,
			Color.Green,
			40,
			40,
			false
		)
		latestCameraYellowZonePolyWorld.Draw(
			"3",
			hero,
			debugParticles,
			Color.Yellow,
			40,
			40,
			false
		)
		latestCameraRedZonePolyWorld.Draw(
			"4",
			hero,
			debugParticles,
			Color.Red,
			40,
			40,
			false
		)
	}

	const windowSize = RendererSDK.WindowSize,
		debugPoint = RendererSDK.WorldToScreen(debugCursor)
	if (debugPoint !== undefined) {
		RendererSDK.Image(
			"resource/cursor/source/cursor_default.png",
			debugPoint,
			-1,
			new Vector2(
				GUIInfo.ScaleWidth(28, windowSize),
				GUIInfo.ScaleHeight(28, windowSize)
			)
		)
	}
})

let ctrlDown = false,
	shiftDown = false
InputEventSDK.on("KeyDown", key => {
	if (key === VKeys.CONTROL || key === VKeys.LCONTROL || key === VKeys.RCONTROL) {
		ctrlDown = true
	}
	if (key === VKeys.SHIFT || key === VKeys.LSHIFT || key === VKeys.RSHIFT) {
		shiftDown = true
	}
})
InputEventSDK.on("KeyUp", key => {
	if (key === VKeys.CONTROL || key === VKeys.LCONTROL || key === VKeys.RCONTROL) {
		ctrlDown = false
	}
	if (key === VKeys.SHIFT || key === VKeys.LSHIFT || key === VKeys.RSHIFT) {
		shiftDown = false
	}
})
const latestUnitOrderView = new DataView(LatestUnitOrder.buffer)
function deserializeOrder(): ExecuteOrder {
	const issuersSize = latestUnitOrderView.getUint32(26, true)
	let issuers: Unit[] = []
	for (let i = 0; i < issuersSize; i++) {
		const entID = latestUnitOrderView.getUint32(30 + i * 4, true)
		const ent = EntityManager.EntityByIndex(entID)
		if (ent instanceof Unit) {
			issuers.push(ent)
		}
	}
	issuers = [...new Set([...issuers, ...InputManager.SelectedEntities])]

	const target = latestUnitOrderView.getUint32(16, true),
		ability = latestUnitOrderView.getUint32(20, true),
		orderType = latestUnitOrderView.getUint32(0, true) as dotaunitorder_t
	let target_: Entity | number = target,
		ability_: Ability | number = ability
	if (orderType === dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE) {
		target_ =
			EntityManager.AllEntities.find(
				ent =>
					(ent instanceof Tree || ent instanceof TempTree) &&
					ent.BinaryID === target
			) ?? target_
	} else if (orderType !== dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM) {
		target_ = EntityManager.EntityByIndex(target_) ?? target_
	}
	if (orderType !== dotaunitorder_t.DOTA_UNIT_ORDER_PURCHASE_ITEM) {
		ability_ = EntityManager.EntityByIndex<Ability>(ability_) ?? ability_
	}
	switch (orderType) {
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET_TREE:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO:
		case dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_ALT:
		case dotaunitorder_t.DOTA_UNIT_ORDER_TRAIN_ABILITY:
		case dotaunitorder_t.DOTA_UNIT_ORDER_PURCHASE_ITEM:
		case dotaunitorder_t.DOTA_UNIT_ORDER_SELL_ITEM:
		case dotaunitorder_t.DOTA_UNIT_ORDER_SET_ITEM_COMBINE_LOCK:
		case dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM:
		case dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM:
		case dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM:
			break
		default:
			if (
				ctrlDown &&
				ConVarsSDK.GetBoolean("dota_player_multipler_orders", false)
			) {
				issuers = [
					...new Set([
						...issuers,
						...Units.filter(
							ent =>
								ent.IsControllable &&
								ent.RootOwner === LocalPlayer &&
								ent.IsAlive &&
								!ent.IsEnemy() &&
								ent.ShouldUnifyOrders
						)
					])
				]
			}
			break
	}
	return new ExecuteOrder(
		orderType,
		target_,
		new Vector3(
			latestUnitOrderView.getFloat32(4, true),
			latestUnitOrderView.getFloat32(8, true),
			latestUnitOrderView.getFloat32(12, true)
		),
		ability_,
		issuers,
		latestUnitOrderView.getUint8(25) !== 0 || shiftDown,
		latestUnitOrderView.getUint8(24) !== 0
	)
}

Events.on("PrepareUnitOrders", () => {
	const order = deserializeOrder()
	if (order === undefined) {
		return true
	}
	const ret = EventsSDK.emit("PrepareUnitOrders", true, order)
	if (!ret) {
		return false
	}
	if (!ExecuteOrder.DisableHumanizer) {
		order.ExecuteQueued()
		return false
	}
	return true
})

Events.on("DebuggerPrepareUnitOrders", (isUserInput, wasCancelled) => {
	const order = deserializeOrder()
	if (order !== undefined) {
		EventsSDK.emit(
			"DebuggerPrepareUnitOrders",
			true,
			order,
			isUserInput,
			wasCancelled
		)
	}
})

function ClearHumanizerState() {
	ExecuteOrder.orderQueue.clear()
	ExecuteOrder.lastMove = undefined
	ExecuteOrder.HoldOrders = 0
	ExecuteOrder.HoldOrdersTarget = undefined
	lastOrderFinish = 0
	latestCameraX = 0
	latestCameraY = 0
	currentOrder = undefined
	lastOrderTarget = undefined
	debugCursor.toZero()
	lastUpdate = 0
	latestUsercmd = new UserCmd()
	cameraMoveEnd = 0
	cameraDirection.toZero()
	yellowZoneOutAt = 0
	greenZoneOutAt = 0
	cursorAtMinimapAt = 0
	cursorEnteredMinimapAt = 0
	lastUnitSwitch = 0
	initializedMousePosition = false
	InputManager.IsShopOpen = false
	InputManager.IsScoreboardOpen = false
	InputManager.SelectedEntities.clear()
	InputManager.CursorOnWorld = new Vector3()
	paramsX = getParams()
	paramsY = getParams()
	CameraSDK.Polygon.Points.clear()
}

function RestartHumanizerState() {
	ExecuteOrder.orderQueue.clear()
	ExecuteOrder.lastMove = undefined
	ExecuteOrder.HoldOrders = 0
	ExecuteOrder.HoldOrdersTarget = undefined
	CameraSDK.Polygon.Points.clear()
	lastOrderTarget = undefined
	lastOrderFinish = 0
	latestCameraX = 0
	latestCameraY = 0
	currentOrder = undefined
	debugCursor.toZero()
	lastUpdate = 0
	latestUsercmd = new UserCmd()
	cameraMoveEnd = 0
	cameraDirection.toZero()
	yellowZoneOutAt = 0
	greenZoneOutAt = 0
	cursorAtMinimapAt = 0
	cursorEnteredMinimapAt = 0
	lastUnitSwitch = 0
	initializedMousePosition = false
	paramsX = getParams()
	paramsY = getParams()
}

Events.on("NewConnection", ClearHumanizerState)
EventsSDK.on("GameEnded", ClearHumanizerState)
EventsSDK.on("HumanizerStateChanged", () => {
	if (ExecuteOrder.DisableHumanizer) {
		RestartHumanizerState()
	}
})
