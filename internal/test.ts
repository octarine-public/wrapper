import {
	axe_culling_blade,
	Creep,
	EntityManager,
	EventsSDK,
	Hero,
	item_dagon,
	LocalPlayer,
	mars_gods_rebuke,
	phantom_assassin_stifling_dagger,
	RendererSDK
} from "../wrapper/Imports"

const heroes = EntityManager.GetEntitiesByClass(Hero)
const creeps = EntityManager.GetEntitiesByClass(Creep)

EventsSDK.on("Draw", () => {
	for (const hero of heroes) {
		const w2s = RendererSDK.WorldToScreen(hero.Position)
		if (w2s === undefined) {
			continue
		}
		const target = [...creeps, ...heroes]
			.filter(x => x.Team !== hero.Team)
			.orderBy(x => LocalPlayer!.Hero!.Distance2D(x))[0]
		if (target === undefined) {
			continue
		}
		const spellAmp = hero.SpellAmp,
			attackDamage = hero.GetAttackDamage(target),
			daggerDamage =
				hero
					.GetAbilityByClass(phantom_assassin_stifling_dagger)
					?.GetDamage(target) ?? 0,
			godsRebuke = hero.GetAbilityByClass(mars_gods_rebuke)?.GetDamage(target) ?? 0,
			dagon = hero.GetItemByClass(item_dagon)?.GetDamage(target) ?? 0,
			cullingBlade =
				hero.GetAbilityByClass(axe_culling_blade)?.GetDamage(target) ?? 0

		RendererSDK.Text(
			`Spell amp:${spellAmp}
			AttackDamage: ${attackDamage}
			Culling blade damage: ${cullingBlade}
			Stifling dagger damage: ${daggerDamage}
			Gods rebuke damage: ${godsRebuke}
			Dagon ${dagon}`,
			w2s
		)
	}
})
