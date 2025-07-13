import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { GridNavCellFlags } from "../Enums/GridNavCellFlags"
import { GetPositionHeight } from "../Native/WASM"
import { TempTree } from "../Objects/Base/TempTree"
import { Tree } from "../Objects/Base/Tree"
import { Unit } from "../Objects/Base/Unit"
import { ViewBinaryStream } from "../Utils/ViewBinaryStream"

class CGridNav {
	public readonly Max: Vector2
	public readonly UnitGridPos = new Map<Unit, Vector2>()
	public readonly UnitGridVisiblePos = new Map<Unit, Vector2>()
	private readonly edgeSizeRcp: number

	constructor(
		public readonly EdgeSize: number,
		public readonly Offset: Vector2,
		public readonly Size: Vector2,
		public readonly Min: Vector2,
		private readonly CellFlags: Uint8Array
	) {
		this.edgeSizeRcp = 1 / this.EdgeSize
		this.Max = this.Min.Add(this.Size).SubtractScalarForThis(1)
	}
	public IsInWorld(position: Vector3, buffer: number = 0.5 * this.EdgeSize): boolean {
		const half = this.EdgeSize * 0.5
		const minX = this.Min.x * this.EdgeSize + this.Offset.x - half + buffer,
			minY = this.Min.y * this.EdgeSize + this.Offset.y - half + buffer
		const maxX = this.Max.x * this.EdgeSize + this.Offset.x + half - buffer,
			maxY = this.Max.y * this.EdgeSize + this.Offset.y + half - buffer
		return position.IsUnderRectangle(minX, minY, maxX - minX, maxY - minY)
	}
	public IsTraversable(position: Vector3): boolean {
		const half = 0.5 * this.EdgeSize
		const gridX = Math.floor((position.x - this.Offset.x + half) * this.edgeSizeRcp)
		const gridY = Math.floor((position.y - this.Offset.y + half) * this.edgeSizeRcp)
		if (gridX < this.Min.x || gridX > this.Max.x) {
			return false
		}
		if (gridY < this.Min.y || gridY > this.Max.y) {
			return false
		}
		const flags = this.GetCellFlagsForGridPos(gridX, gridY)
		return (
			flags.hasBit(GridNavCellFlags.Walkable) &&
			!flags.hasBit(GridNavCellFlags.Tree) &&
			!flags.hasBit(GridNavCellFlags.UnitBlocking) &&
			!flags.hasBit(GridNavCellFlags.MovementBlocker) &&
			!flags.hasBit(GridNavCellFlags.InteractionBlocker)
		)
	}
	public GetCellFlagsForPos(pos: Vector3 | Vector2): number {
		return this.CellFlags[this.GetCellIndexForPos(pos)] ?? 0
	}
	public GetCellFlagsForGridPos(gridPosX: number, gridPosY: number): number {
		return this.CellFlags[this.GetCellIndexForGridPos(gridPosX, gridPosY)] ?? 0
	}
	public GetGridPosForPos(pos: Vector3 | Vector2): Vector2 {
		pos =
			pos instanceof Vector3
				? Vector2.FromVector3(pos).SubtractForThis(this.Offset)
				: pos.Subtract(this.Offset)
		return pos.MultiplyScalarForThis(this.edgeSizeRcp).RoundForThis()
	}
	public GetRectForGridPos(gridPosX: number, gridPosY: number): Rectangle {
		const pos1 = new Vector2(gridPosX, gridPosY)
			.RoundForThis()
			.MultiplyScalarForThis(this.EdgeSize)
		return new Rectangle(pos1, pos1.AddScalar(this.EdgeSize))
	}
	// TODO: optimize?
	public UpdateUnitState(unit: Unit, deleteUnit: boolean): void {
		if (unit.IsBuilding) {
			return
		}
		const oldGridPos = this.UnitGridPos.get(unit),
			newGridPos = this.GetGridPosForPos(unit.Position)
		if (deleteUnit || unit.HasNoCollision) {
			this.deleteOldFlags(oldGridPos, newGridPos)
			return
		}
		const state = unit.IsValid && unit.IsAlive && unit.IsVisible && unit.IsSpawned
		this.deleteOldFlags(oldGridPos, newGridPos)
		this.SetCellFlag(newGridPos.x, newGridPos.y, GridNavCellFlags.UnitBlocking, state)
		if (state) {
			this.UnitGridPos.set(unit, newGridPos)
			return
		}
		this.UnitGridPos.delete(unit)
	}
	public UpdateTreeState(tree: Tree | TempTree): void {
		const gridPos = this.GetGridPosForPos(tree.Position)
		const isAlive = tree.IsValid && tree.IsAlive
		if (tree.IsTempTree) {
			this.SetCellFlag(gridPos.x, gridPos.y, GridNavCellFlags.Tree, isAlive)
			return
		}
		// basically tree takes 128x128, on default gridnav of 64x64 it takes 2x2 cells,
		// and tree is located in right bottom one
		this.SetCellFlag(gridPos.x - 0, gridPos.y - 0, GridNavCellFlags.Tree, isAlive)
		this.SetCellFlag(gridPos.x - 1, gridPos.y - 0, GridNavCellFlags.Tree, isAlive)
		this.SetCellFlag(gridPos.x - 0, gridPos.y - 1, GridNavCellFlags.Tree, isAlive)
		this.SetCellFlag(gridPos.x - 1, gridPos.y - 1, GridNavCellFlags.Tree, isAlive)
	}
	// TODO: optimize
	public UpdateVisionState(unit: Unit, deleteUnit: boolean): void {
		if (unit.IsBuilding || !unit.IsEnemy()) {
			return
		}
		const oldGridPos = this.UnitGridVisiblePos.get(unit)
		const newGridPos = this.GetGridPosForPos(unit.Position)
		const visionRange = unit.VisionRange

		if (oldGridPos && (!oldGridPos.Equals(newGridPos) || deleteUnit)) {
			this.updateVisionForArea(oldGridPos, visionRange, false)
		}
		const canUpdateVision =
			unit.IsValid &&
			unit.IsAlive &&
			unit.IsSpawned &&
			(!unit.IsEnemy() || (unit.IsEnemy() && unit.IsVisible))

		if (deleteUnit || !canUpdateVision) {
			this.UnitGridVisiblePos.delete(unit)
			return
		}
		this.updateVisionForArea(newGridPos, visionRange, true)
		this.UnitGridVisiblePos.set(unit, newGridPos)
	}
	// TODO: optimize
	private updateVisionForArea(center: Vector2, radius: number, state: boolean): void {
		const cellsInRange = Math.ceil(radius * this.edgeSizeRcp)
		for (let dx = -cellsInRange; dx <= cellsInRange; dx++) {
			for (let dy = -cellsInRange; dy <= cellsInRange; dy++) {
				if (dx * dx + dy * dy > cellsInRange * cellsInRange) {
					continue
				}
				const targetX = center.x + dx
				const targetY = center.y + dy
				if (this.hasLineOfSight(center.x, center.y, targetX, targetY)) {
					this.SetCellFlag(
						targetX,
						targetY,
						GridNavCellFlags.VisibleCell,
						state
					)
				}
			}
		}
	}
	private SetCellFlag(
		gridPosX: number,
		gridPosY: number,
		flag: GridNavCellFlags,
		state: boolean
	): void {
		const cellID = this.GetCellIndexForGridPos(gridPosX, gridPosY)
		if (this.CellFlags.byteLength <= cellID) {
			return
		}
		if (state) {
			this.CellFlags[cellID] |= 1 << flag
		} else {
			this.CellFlags[cellID] &= ~(1 << flag)
		}
	}
	private GetCellIndexForGridPos(gridPosX: number, gridPosY: number): number {
		return this.Size.x * (gridPosY - this.Min.y) + (gridPosX - this.Min.x)
	}
	private GetCellIndexForPos(pos: Vector3 | Vector2): number {
		const gridPos = this.GetGridPosForPos(pos)
		return this.GetCellIndexForGridPos(gridPos.x, gridPos.y)
	}
	private deleteOldFlags(oldGridPos: Nullable<Vector2>, newGridPos: Vector2): void {
		if (oldGridPos !== undefined && !oldGridPos.Equals(newGridPos)) {
			this.SetCellFlag(
				oldGridPos.x,
				oldGridPos.y,
				GridNavCellFlags.UnitBlocking,
				false
			)
		}
	}
	// TODO: optimize
	private hasLineOfSight(x0: number, y0: number, x1: number, y1: number): boolean {
		const dx = Math.abs(x1 - x0)
		const dy = Math.abs(y1 - y0)
		const sx = x0 < x1 ? 1 : -1
		const sy = y0 < y1 ? 1 : -1
		let err = dx - dy

		let x = x0
		let y = y0
		const startHeight = GetPositionHeight(this.gridToWorld(x0, y0))
		let blockedByHighground = false

		while (!(x === x1 && y === y1)) {
			const worldPos = this.gridToWorld(x, y)
			const flags = this.GetCellFlagsForGridPos(x, y)
			const cellHeight = GetPositionHeight(worldPos)
			if (!(x === x0 && y === y0)) {
				if (flags.hasBit(GridNavCellFlags.Tree)) {
					return false
				}
			}
			if (!blockedByHighground && cellHeight > startHeight) {
				blockedByHighground = true
			} else if (blockedByHighground) {
				return false
			}
			if (
				(blockedByHighground || cellHeight > startHeight) &&
				(flags.hasBit(GridNavCellFlags.InteractionBlocker) ||
					flags.hasBit(GridNavCellFlags.MovementBlocker))
			) {
				blockedByHighground = true
				return false
			}
			const e2 = 2 * err
			if (e2 > -dy) {
				err -= dy
				x += sx
			}
			if (e2 < dx) {
				err += dx
				y += sy
			}
		}
		return true
	}
	private gridToWorld(gridX: number, gridY: number): Vector2 {
		return new Vector2(
			gridX * this.EdgeSize + this.Offset.x,
			gridY * this.EdgeSize + this.Offset.y
		)
	}
}
export let GridNav: Nullable<CGridNav>

export function ParseGNV(stream: ViewBinaryStream): void {
	try {
		{
			const magic = stream.ReadUint32()
			if (magic !== 0xfadebead) {
				// gnv magic
				throw `Invalid GNV magic: 0x${magic.toString(16)}`
			}
		}
		const edgeSize = stream.ReadFloat32(),
			offsetX = stream.ReadFloat32(),
			offsetY = stream.ReadFloat32(),
			width = stream.ReadInt32(),
			height = stream.ReadInt32(),
			minX = stream.ReadInt32(),
			minY = stream.ReadInt32()
		GridNav = new CGridNav(
			edgeSize,
			new Vector2(offsetX, offsetY),
			new Vector2(width, height),
			new Vector2(minX, minY),
			stream.ReadSlice(width * height)
		)
	} catch (e) {
		console.error("Error in GridNav init", e)
		GridNav = undefined
	}
}

export function ResetGNV(): void {
	GridNav = undefined
}
