import {
	EntityManager,
	EventsSDK,
	Hero,
	LocalPlayer,
	RendererSDK
} from "../wrapper/Imports"

const targets = EntityManager.GetEntitiesByClass(Hero)
EventsSDK.on("Draw", () => {
	const hero = LocalPlayer?.Hero
	if (hero === undefined) {
		return
	}
	const target = targets
		.filter(x => x.Team !== hero.Team && x !== hero && x.IsVisible && x.IsAlive)
		.orderBy(x => x.Distance2D(hero.Position) < 1000)[0]
	if (target === undefined) {
		return
	}

	const w2s = RendererSDK.WorldToScreen(hero.Position)
	if (w2s === undefined) {
		return
	}

	const damage = hero.GetAttackDamage(target)

	RendererSDK.Text(`${damage} ${target.Name}`, w2s)
})
