import { EntityManager, EventsSDK, RendererSDK, Unit } from "../wrapper/Imports"

const units = EntityManager.GetEntitiesByClass(Unit)

EventsSDK.on("Draw", () => {
	for (const unit of units) {
		if (unit.IsBuilding || unit.BaseMoveSpeed === 0) {
			continue
		}
		const w2s = RendererSDK.WorldToScreen(unit.Position)
		if (w2s === undefined) {
			continue
		}
		RendererSDK.Text(
			`AS:${unit.AttackSpeed}(${unit.SecondsPerAttack}s)
			MS:${unit.MoveSpeed}`,
			w2s
		)
	}
})
