import {
	EntityManager,
	EventsSDK,
	Hero,
	item_dagon,
	RendererSDK
} from "../wrapper/Imports"

EventsSDK.on("Draw", () => {
	const target = EntityManager.GetEntitiesByClass(Hero).find(x => x.IsEnemy())
	if (target === undefined) {
		return
	}
	for (const hero of EntityManager.GetEntitiesByClass(Hero)) {
		if (target === hero || hero.IsEnemy() || !hero.IsVisible) {
			continue
		}
		const screenPosition = RendererSDK.WorldToScreen(hero.Position)
		if (screenPosition === undefined) {
			continue
		}
		const spell = hero.GetItemByClass(item_dagon)?.GetDamage(target)
		const attackDamage = hero.GetAttackDamage(target)
		if (spell === undefined) {
			continue
		}
		RendererSDK.Text(`${spell} | ${attackDamage}`, screenPosition)
	}
})
