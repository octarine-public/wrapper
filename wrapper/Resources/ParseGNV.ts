import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { Vector3 } from "../Base/Vector3"
import { GridNavCellFlags } from "../Enums/GridNavCellFlags"
import { GetPositionHeight } from "../Native/WASM"
import { Tree } from "../Objects/Base/Tree"

class CGridNav {
	public readonly Max: Vector2
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

	// NOTE: need optimize UpdateVisibleCellsPosition or move to c++
	public UpdateVisibleCellsPosition(
		position: Vector3,
		visionRange: number,
		flying = false,
		outVisionCells: Vector2[]
	) {
		// Constants for calculations
		const heightFogScale = 128
		const edgeSize = this.EdgeSize // Usually 64

		// World height based on position and fog scale
		const worldHeight = Math.round(GetPositionHeight(position) / heightFogScale)

		// Start position on grid
		const gridStart = this.GetGridPosForPos(position)
		const startGridX = gridStart.x
		const startGridY = gridStart.y

		// Calculate number of rays for vision perimeter
		const perim = 2 * Math.PI
		const numRays = Math.ceil(perim * (visionRange / edgeSize))
		const angleStep = perim / numRays

		// Create a Map to store vision cells
		const visionCellMap = new Map<string, Vector2>()

		// Cast rays in all directions from position
		for (let i = 0; i < numRays; i++) {
			const angle = i * angleStep
			// const delta = Vector3.FromPolarCoordinates(
			// 	visionRange,
			// 	i * angleStep
			// ).AddForThis(position)

			const deltaX = Math.cos(angle) * visionRange
			const deltaY = Math.sin(angle) * visionRange

			const endX = position.x + deltaX
			const endY = position.y + deltaY

			// Calculate end position and corresponding grid position
			const endPosition = new Vector2(endX, endY)
			const gridEnd = this.GetGridPosForPos(endPosition)

			// Check each cell along the line for visibility
			this.Line(startGridX, startGridY, gridEnd.x, gridEnd.y, (x1, y1) => {
				// Check if this cell is already in vision
				const cellKey = `${x1}:${y1}`
				if (visionCellMap.has(cellKey)) {
					return true
				}

				// Calculate the world position from grid position
				const linePos = new Vector2(x1, y1)

				if (!flying) {
					const gridLinePos = linePos.Clone().MultiplyScalarForThis(edgeSize)

					// Get cell flags and calculate line world height
					const flags = this.GetCellFlagsForPos(gridLinePos)

					const lineWorldHeight = Math.floor(
						GetPositionHeight(
							gridLinePos.AddForThis(this.Offset.DivideScalar(2))
						) / heightFogScale
					)

					// Height check and tree existence check
					const checkHeight = lineWorldHeight > worldHeight - 1
					const hasTree = flags.hasBit(GridNavCellFlags.Tree)
					// Determine if the cell is visible
					if ((hasTree && checkHeight) || lineWorldHeight > worldHeight) {
						return false
					}
				}

				visionCellMap.set(cellKey, linePos)
				return true
			})
		}

		// eslint-disable-next-line unused-imports/no-unused-vars
		outVisionCells = Array.from(visionCellMap.values())
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

	// NOTE: need optimize UpdateVisibleCellsPosition or move to c++
	private Line(
		startX: number,
		startY: number,
		endX: number,
		endY: number,
		callback: (x: number, y: number) => boolean
	) {
		const dx = endX - startX
		const dy = endY - startY
		const steps = Math.max(Math.abs(dx), Math.abs(dy))
		const xIncrement = dx / steps
		const yIncrement = dy / steps

		let x = startX
		let y = startY

		for (let i = 0; i <= steps; i++) {
			if (!callback(Math.floor(x), Math.floor(y))) {
				break
			}

			x += xIncrement
			y += yIncrement
		}
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
