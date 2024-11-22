import {
	Color,
	EntityManager,
	EventsSDK,
	ParticlesSDK,
	RendererSDK,
	Unit
} from "../wrapper/Imports"

const units = EntityManager.GetEntitiesByClass(Unit)
const pSDK = new ParticlesSDK()

EventsSDK.on("Draw", () => {
	for (const unit of units) {
		if (unit.IsBuilding) {
			continue
		}
		const w2s = RendererSDK.WorldToScreen(unit.Position)
		if (w2s === undefined) {
			continue
		}
		RendererSDK.Text(
			`MoveSpeedBase:${unit.MoveSpeedBase}
			MoveSpeed:${unit.MoveSpeed}
			DayVisionBase:${unit.NetworkedDayVision}
			NightVisionBase:${unit.NetworkedNightVision}
			DayVisionRange:${unit.DayVisionRange}
			NightVisionRange:${unit.NightVisionRange}`,
			w2s
		)
	}
})
EventsSDK.on("PostDataUpdate", dt => {
	if (dt === 0) {
		return
	}
	for (const unit of units) {
		pSDK.DrawCircle(unit.Index + "Day", unit, unit.DayVisionRange, {
			Position: unit.Position
		})
		pSDK.DrawCircle(unit.Index + "Night", unit, unit.NightVisionRange, {
			Position: unit.Position,
			Color: Color.Red
		})
	}
})

EventsSDK.on("GameEnded", () => pSDK.DestroyAll())
EventsSDK.on("GameStarted", () => pSDK.DestroyAll())
