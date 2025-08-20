import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { GridNavCellFlags } from "../Enums/GridNavCellFlags"
import { TempTree } from "../Objects/Base/TempTree"
import { Tree } from "../Objects/Base/Tree"
import { Unit } from "../Objects/Base/Unit"
import { ViewBinaryStream } from "../Utils/ViewBinaryStream"

class CGridNav {
	public readonly Max: Vector2
	public readonly UnitGridPos = new Map<Unit, Vector2>()
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
	public UpdateUnitState(unit: Unit, deleteUnit: boolean): void {
		if (deleteUnit || unit.HasNoCollision) {
			this.deleteOldFlags(unit)
			return
		}
		const oldGridPos = this.UnitGridPos.get(unit),
			newGridPos = this.GetGridPosForPos(unit.Position),
			state = unit.IsValid && unit.IsAlive && unit.IsVisible && unit.IsSpawned
		if (oldGridPos !== undefined && !oldGridPos.Equals(newGridPos)) {
			this.SetCellFlag(
				oldGridPos.x,
				oldGridPos.y,
				GridNavCellFlags.UnitBlocking,
				false
			)
		} else {
			this.SetCellFlag(
				newGridPos.x,
				newGridPos.y,
				GridNavCellFlags.UnitBlocking,
				state
			)
		}
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
	private deleteOldFlags(unit: Unit): void {
		const oldGridPos = this.UnitGridPos.get(unit)
		if (oldGridPos === undefined) {
			return
		}
		this.SetCellFlag(oldGridPos.x, oldGridPos.y, GridNavCellFlags.UnitBlocking, false)
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
