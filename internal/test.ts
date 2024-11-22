import { EntityManager, EventsSDK, RendererSDK, Unit } from "../wrapper/Imports"

const units = EntityManager.GetEntitiesByClass(Unit)

EventsSDK.on("Draw", () => {
	for (const unit of units) {
		if (unit.IsBuilding || unit.MoveSpeedBase === 0) {
			continue
		}
		const w2s = RendererSDK.WorldToScreen(unit.Position)
		if (w2s === undefined) {
			continue
		}
		RendererSDK.Text(
			`MoveSpeedBase:${unit.MoveSpeedBase}
			MoveSpeed:${unit.MoveSpeed}
			AttackRange:${unit.GetAttackRange(undefined, 0, false)}`,
			w2s
		)
	}
})
