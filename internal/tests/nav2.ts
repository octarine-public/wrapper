// import {
// 	Color,
// 	EventsSDK,
// 	GetPositionHeight,
// 	GridNav,
// 	GridNavCellFlags,
// 	LocalPlayer,
// 	ParticlesSDK,
// 	Rectangle,
// 	Unit,
// 	Vector2,
// 	Vector3,
// 	WorldPolygon
// } from "github.com/octarine-public/wrapper/index"

// // debug
// const GNVParticleManager = new ParticlesSDK()
// function GetRectPolygon(rect: Rectangle): WorldPolygon {
// 	const pos1 = rect.pos1,
// 		pos2 = new Vector2(rect.pos1.x, rect.pos2.y),
// 		pos3 = rect.pos2,
// 		pos4 = new Vector2(rect.pos2.x, rect.pos1.y)
// 	return new WorldPolygon(
// 		Vector3.FromVector2(pos1).SetZ(GetPositionHeight(pos1)),
// 		Vector3.FromVector2(pos2).SetZ(GetPositionHeight(pos2)),
// 		Vector3.FromVector2(pos3).SetZ(GetPositionHeight(pos3)),
// 		Vector3.FromVector2(pos4).SetZ(GetPositionHeight(pos4))
// 	)
// }

// export const NavEntityMeshVision = new (class {
// 	public readonly units: Unit[] = []
// 	public visionCells: Vector2[] = []

// 	protected DebugDrawLine(index: number, start: Vector3, endPosition: Vector3) {
// 		GNVParticleManager.DrawLine(`line_${index}`, LocalPlayer?.Hero!, endPosition, {
// 			Position: start,
// 			Width: 15
// 		})
// 	}

// 	public GetIsVisibleToEnemies(unit: Unit) {
// 		const position = GridNav!.GetGridPosForPos(unit.Position)
// 		return this.visionCells.some(vec => vec.Equals(position))
// 	}

// 	public Draw() {
// 		if (GridNav === undefined || LocalPlayer?.Hero === undefined) {
// 			return
// 		}

// 		for (let index = 0; index < this.visionCells.length; index++) {
// 			const vec = this.visionCells[index]
// 			GetRectPolygon(GridNav.GetRectForGridPos(vec.x, vec.y)).Draw(
// 				"",
// 				LocalPlayer.Hero,
// 				GNVParticleManager,
// 				Color.Red,
// 				15,
// 				15,
// 				false
// 			)
// 		}
// 	}

// 	public Tick() {
// 		if (GridNav === undefined || LocalPlayer?.Hero === undefined) {
// 			return
// 		}

// 		// this.visionCells.clear() // clear cells

// 		for (let index = 0; index < this.units.length; index++) {
// 			const unit = this.units[index]
// 			if (!unit.IsValid || !unit.IsAlive || !unit.IsSpawned) {
// 				continue
// 			}
// 			const position = unit.Position
// 			this.UpdatePosition(position, unit.DayVision, unit.HasFlyingVision)
// 			// this.UpdatePosition(position, unit.DayVision, unit.HasFlyingVision)
// 		}

// 		// for (let index = 0; index < this.AllyUnits.length; index++) {
// 		// 	const unit = this.AllyUnits[index]
// 		// 	unit.cellIsVisibleForEnemies_ = this.GetIsVisibleToEnemies(unit)
// 		// }
// 	}

// 	protected UpdatePosition(position: Vector3, visionRange: number, flying = false) {
// 		const gridNav = GridNav
// 		if (gridNav === undefined) {
// 			return
// 		}

// 		// Constants for calculations
// 		const heightFogScale = 128
// 		const edgeSize = gridNav.EdgeSize // Usually 64

// 		// World height based on position and fog scale
// 		const worldHeight = Math.round(GetPositionHeight(position) / heightFogScale)

// 		// Start position on grid
// 		const gridStart = gridNav.GetGridPosForPos(position)
// 		const startGridX = gridStart.x
// 		const startGridY = gridStart.y

// 		// Calculate number of rays for vision perimeter
// 		const perim = 2 * Math.PI
// 		const numRays = Math.ceil(perim * (visionRange / edgeSize))
// 		const angleStep = perim / numRays

// 		// Create a Map to store vision cells
// 		const visionCellMap = new Map<string, Vector2>()

// 		// Cast rays in all directions from position
// 		for (let i = 0; i < numRays; i++) {
// 			const delta = Vector3.FromPolarCoordinates(
// 				visionRange,
// 				i * angleStep
// 			).AddForThis(position)

// 			// Calculate end position and corresponding grid position
// 			const gridEnd = gridNav.GetGridPosForPos(delta)

// 			// Check each cell along the line for visibility
// 			this.Line(startGridX, startGridY, gridEnd.x, gridEnd.y, (x1, y1) => {
// 				// Check if this cell is already in vision
// 				const cellKey = `${x1}:${y1}`
// 				if (visionCellMap.has(cellKey)) {
// 					return true
// 				}

// 				// Calculate the world position from grid position
// 				const linePos = new Vector2(x1, y1)

// 				if (!flying) {
// 					const gridLinePos = linePos.Clone().MultiplyScalarForThis(edgeSize)

// 					// Get cell flags and calculate line world height
// 					const flags = gridNav.GetCellFlagsForPos(gridLinePos)
// 					const lineWorldHeight = Math.floor(
// 						GetPositionHeight(
// 							gridLinePos.AddForThis(gridNav.Offset.DivideScalar(2))
// 						) / heightFogScale
// 					)

// 					// Height check and tree existence check
// 					const checkHeight = lineWorldHeight > worldHeight - 1
// 					const hasTree = flags.hasBit(GridNavCellFlags.Tree)

// 					// Determine if the cell is visible
// 					if ((hasTree && checkHeight) || lineWorldHeight > worldHeight) {
// 						return false
// 					}
// 				}

// 				visionCellMap.set(cellKey, linePos)
// 				return true
// 			})
// 		}
// 		this.visionCells = Array.from(visionCellMap.values())
// 	}

// 	private Line(
// 		startX: number,
// 		startY: number,
// 		endX: number,
// 		endY: number,
// 		callback: (x: number, y: number) => boolean
// 	) {
// 		const dx = endX - startX
// 		const dy = endY - startY
// 		const steps = Math.max(Math.abs(dx), Math.abs(dy))
// 		const xIncrement = dx / steps
// 		const yIncrement = dy / steps

// 		let x = startX
// 		let y = startY

// 		for (let i = 0; i <= steps; i++) {
// 			if (!callback(Math.floor(x), Math.floor(y))) {
// 				break
// 			}

// 			x += xIncrement
// 			y += yIncrement
// 		}
// 	}
// })()

// EventsSDK.on("Draw", () => NavEntityMeshVision.Draw())

// EventsSDK.on("Tick", () => NavEntityMeshVision.Tick())

// EventsSDK.on("EntityCreated", ent => {
// 	if (!(ent instanceof Unit) || !ent.IsHero) {
// 		return
// 	}
// 	NavEntityMeshVision.units.push(ent)
// })

// EventsSDK.on("EntityDestroyed", ent => {
// 	if (!(ent instanceof Unit)) {
// 		return
// 	}
// 	NavEntityMeshVision.units.remove(ent)
// })
