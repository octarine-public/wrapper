import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { GridNavCellFlags } from "../Enums/GridNavCellFlags"
import { Tree } from "../Objects/Base/Tree"

class CGridNav {
	public readonly Max: Vector2
	private readonly EdgeSizeRcp: number
	constructor(
		public readonly EdgeSize: number,
		public readonly Offset: Vector2,
		public readonly Size: Vector2,
		public readonly Min: Vector2,
		private readonly CellFlags: Uint8Array
	) {
		this.EdgeSizeRcp = 1 / this.EdgeSize
		this.Max = this.Min.Add(this.Size).SubtractScalarForThis(1)
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
		return pos.MultiplyScalarForThis(this.EdgeSizeRcp).RoundForThis()
	}
	public GetRectForGridPos(gridPosX: number, gridPosY: number): Rectangle {
		const pos1 = new Vector2(gridPosX, gridPosY)
			.RoundForThis()
			.MultiplyScalarForThis(this.EdgeSize)
		return new Rectangle(pos1, pos1.AddScalar(this.EdgeSize))
	}

	public UpdateTreeState(tree: Tree): void {
		const gridPos = this.GetGridPosForPos(tree.Position)
		const isAlive = tree.IsValid && tree.IsAlive
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
}
export let GridNav: Nullable<CGridNav>

export function ParseGNV(stream: ReadableBinaryStream): void {
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
