import { Ability, ArrayExtensions, Color, Entity, EventsSDK, GameRules, LinearProjectile, Menu, Modifier, ParticlesSDK, RendererSDK, Unit, Vector2, Vector3, DOTAGameUIState_t, GameState, lina_dragon_slave, pudge_meat_hook, windrunner_powershot, grimstroke_dark_artistry, lion_impale, mirana_arrow } from "wrapper/Imports"

const menu = Menu.AddEntry(["Visual", "Skill Alert"]),
	active = menu.AddToggle("Active", true),
	names = menu.AddToggle("Show skill names", false),
	textSize = menu.AddSlider("Timer text size", 17, 10, 30),
	spellIcons = menu.AddNode("Spell Icons"),
	icons = spellIcons.AddToggle("Show spell icons", false),
	size = spellIcons.AddSlider("Size", 30, 3, 100),
	opacity = spellIcons.AddSlider("Opacity", 255, 0, 255),
	arModifiers = [
		"modifier_invoker_sun_strike",
		"modifier_kunkka_torrent_thinker",
		"modifier_lina_light_strike_array",
		"modifier_leshrac_split_earth_thinker",
		false, false, false,
		"modifier_monkey_king_spring_thinker",
	],
	arHeroModifiers = new Map<string, [string, number]>([
		["modifier_spirit_breaker_charge_of_darkness_vision", ["particles/units/heroes/hero_spirit_breaker/spirit_breaker_charge_target_mark.vpcf", 4]],
		["modifier_tusk_snowball_target", ["particles/units/heroes/hero_tusk/tusk_snowball_target.vpcf", 5]],
		["modifier_life_stealer_infest_effect", ["particles/units/heroes/hero_life_stealer/life_stealer_infested_unit_icon.vpcf", 6]],
	]),
	arDurations = [1.7, 1.6, 0.5, 0.35, 0, 0, 0, 1.7],
	arParticles = [
		["particles/units/heroes/hero_invoker/invoker_sun_strike_team.vpcf", ["pos", "rad"]],
		["particles/units/heroes/hero_kunkka/kunkka_spell_torrent_bubbles_bonus.vpcf", ["pos", "rad"]],
		["particles/units/heroes/hero_lina/lina_spell_light_strike_array_ray_team.vpcf", ["pos", "rad"]],
		false, false, false, false,
		["particles/units/heroes/hero_monkey_king/monkey_king_spring_cast.vpcf", ["pos", "rad"]],

	] as [string, string[]][],
	arAbilities = [
		"invoker_sun_strike",
		"kunkka_torrent",
		"lina_light_strike_array",
		"leshrac_split_earth",
		"", "", "",
		"monkey_king_primal_spring",
	],
	// arSounds = [
	// 	"invoker_invo_ability_sunstrike_01",
	// 	"kunkka_kunk_ability_torrent_01",
	// 	"lina_lina_ability_lightstrike_02",
	// 	"leshrac_lesh_ability_split_05",
	// ],
	arNames = new Map<string, string>([
		["invoker_sun_strike", "Sun Strike"],
		["kunkka_torrent", "Torrent"],
		["lina_light_strike_array", "Light Strike Array"],
		["leshrac_split_earth", "Split Earth"],
		["monkey_king_primal_spring", "Primal Spring"],
	])
let arTimers = new Map<Modifier, [number, number, string, Entity]>(),
	thinkers: Unit[] = [],
	thinkers_particles: [/* start time */ number, Entity, Ability, /* arParticles index */ number][] = [],
	particleManager = new ParticlesSDK()

let phaseSpells = [
	lina_dragon_slave,
	pudge_meat_hook,
	mirana_arrow,
	windrunner_powershot,
	grimstroke_dark_artistry,
	lion_impale,
]

EventsSDK.on("ModifierCreated", buff => {
	if (!active.value)
		return

	let ent = buff.Parent!
	let index = arModifiers.indexOf(buff.Name)

	let mod = arHeroModifiers.get(buff.Name)
	if (mod !== undefined)
		particleManager.AddOrUpdate(buff, mod[0], ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, ent)

	if (index === -1)
		return

	let delay = arDurations[index]
	let ability = buff.Ability
	let time = GameRules?.RawGameTime ?? 0
	if (ability !== undefined && arParticles[index])
		thinkers_particles.push([time, ent, ability, index])
	arTimers.set(buff, [time, delay, ability?.Name ?? arAbilities[index], ent])
})
EventsSDK.on("ModifierRemoved", buff => {
	arTimers.delete(buff)
	particleManager.DestroyByKey(buff)
})

EventsSDK.on("Draw", () => {
	if (!active.value || GameState.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return
	thinkers.forEach(ent => {
		let owner = (ent.Buffs[0]?.Caster as Nullable<Unit>) ?? (ent.Owner as Nullable<Unit>)
		if (owner === undefined || !owner.IsEnemy()) {
			particleManager.DestroyByKey(`Thinker${ent.Index}`)
			return
		}

		let rad = 0
		switch (owner.Name) {
			case "npc_dota_hero_invoker":
				rad = ReturnAOERadius(owner, "invoker_sun_strike")
				break
			case "npc_dota_hero_kunkka":
				rad = ReturnAOERadius(owner, "kunkka_torrent")
				break
			case "npc_dota_hero_lina":
				rad = ReturnAOERadius(owner, "lina_light_strike_array")
				break
			case "npc_dota_hero_leshrac":
				rad = ReturnAOERadius(owner, "leshrac_split_earth")
				break
			case "npc_dota_hero_enigma":
				rad = ReturnAOERadius(owner, "enigma_black_hole")
				break
			case "npc_dota_hero_arc_warden":
				rad = ReturnAOERadius(owner, "arc_warden_spark_wraith")
				break
			case "npc_dota_hero_alchemist":
				rad = ReturnAOERadius(owner, "alchemist_acid_spray")
				break
			case "npc_dota_hero_abyssal_underlord":
				rad = ReturnAOERadius(owner, "abyssal_underlord_pit_of_malice")
				break
		}
		if (rad === 0) {
			particleManager.DestroyByKey(`Thinker${ent.Index}`)
			return
		}
		particleManager.DrawCircle(`Thinker${ent.Index}`, ent, rad, {
			Color: Color.Green
		})
	})
	thinkers_particles.forEach(([, ent, abil, index]) => {
		let [path, cp_list] = arParticles[index],
			rad = abil.AOERadius
		particleManager.CheckChangedRange(`Custom${ent.Index}`, rad)
		particleManager.AddOrUpdate(
			`Custom${ent.Index}`,
			path,
			ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
			ent,
			...(cp_list.map((val, i) => {
				switch (val) {
					case "pos":
						return [i, ent.Position]
					case "rad":
						return [i, new Vector3(rad, rad, rad)]
					default:
						return [i, new Vector3()]
				}
			}) as [number, Vector3][])
		)
	})
	// loop-optimizer: KEEP
	arTimers.forEach((val, buff) => {
		let time = GameRules?.RawGameTime ?? 0
		let rend = val[0] - time + val[1]
		if (rend <= 0) {
			arTimers.delete(buff)
			return
		}
		let vector = RendererSDK.WorldToScreen(val[3].Position)
		if (!vector)
			return
		if (names.value) {
			RendererSDK.Text(arNames.get(val[2])!, vector, Color.White, "Calibri", new Vector2(textSize.value, 200))
			vector.AddScalarY(-size.value)
		}
		if (icons.value) {
			RendererSDK.Image(`panorama/images/spellicons/${val[2]}_png.vtex_c`, vector, new Vector2(size.value, size.value), new Color(255, 255, 255, opacity.value))
			vector.AddScalarY(-30)
		}
		RendererSDK.Text(rend.toFixed(2), vector, Color.White, "Calibri", new Vector2(textSize.value, 200))
	})
})

function DrawDirectional(v1: Vector3, v2: Vector3, key: string) {
	particleManager.AddOrUpdate(
		`Directional1${key}`,
		"particles/ui_mouseactions/range_finder_directional.vpcf",
		ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
		undefined,
		[0, v1],
		[2, v2]
	)
	particleManager.AddOrUpdate(
		`Directional2${key}`,
		"particles/ui_mouseactions/range_finder_directional_b.vpcf",
		ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
		undefined,
		[1, v1],
		[2, v2]
	)
	particleManager.AddOrUpdate(
		`Directional3${key}`,
		"particles/ui_mouseactions/range_finder_directional_c.vpcf",
		ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
		undefined,
		[0, v1],
		[2, v2]
	)
}

function DestroyDirectional(key: string) {
	particleManager.DestroyByKey(`Directional1${key}`)
	particleManager.DestroyByKey(`Directional2${key}`)
	particleManager.DestroyByKey(`Directional3${key}`)
}

function ReturnAOERadius(owner: Unit, name_ability: string): number {
	return owner.GetAbilityByName(name_ability)?.AOERadius ?? 0
}

let abils_list: Ability[] = []
function OnEntityNameChanged(ent: Entity) {
	if (ent instanceof Ability && phaseSpells.some(class_ => ent instanceof class_) && !abils_list.includes(ent))
		abils_list.push(ent)
	if (ent instanceof Unit && ent.Name === "npc_dota_thinker")
		thinkers.push(ent)
}

EventsSDK.on("EntityCreated", OnEntityNameChanged)
EventsSDK.on("EntityNameChanged", OnEntityNameChanged)

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Ability)
		ArrayExtensions.arrayRemove(abils_list, ent)
	if (ent instanceof Unit)
		ArrayExtensions.arrayRemove(thinkers, ent)
})

let line_table: LinearProjectile[] = []

EventsSDK.on("LinearProjectileCreated", proj => {
	if (
		(proj.Source instanceof Entity && !proj.Source.IsEnemy())
		|| proj.ParticlePath === "particles/units/heroes/hero_tinker/tinker_machine.vpcf"
		|| proj.ParticlePath === "particles/units/heroes/hero_weaver/weaver_swarm_projectile.vpcf"
	)
		return

	line_table.push(proj)
})

EventsSDK.on("LinearProjectileDestroyed", proj => {
	DestroyDirectional(`Linear${proj.ID}`)
	ArrayExtensions.arrayRemove(line_table, proj)
})

let particles_table = new Map<number, [/* path */string, /* start */Vector3, /* end */Vector3, /* start game time */number, /* speed */number]>()
EventsSDK.on("ParticleCreated", (id, path) => {
	if (path === "particles/units/heroes/hero_pudge/pudge_meathook.vpcf")
		particles_table.set(id, [path, new Vector3().Invalidate(), new Vector3().Invalidate(), GameRules?.RawGameTime ?? 0, 1450 /* hook_speed */])
})

EventsSDK.on("ParticleUpdated", (id, controlPoint, position) => {
	let part = particles_table.get(id)
	if (part === undefined)
		return
	switch (part[0]) {
		case "particles/units/heroes/hero_pudge/pudge_meathook.vpcf":
			if (controlPoint === 1)
				part[2] = position
			break
		default:
			break
	}
})

EventsSDK.on("ParticleUpdatedEnt", (id, controlPoint, ent, attach, attachment, fallbackPosition) => {
	let part = particles_table.get(id)
	if (part === undefined)
		return
	switch (part[0]) {
		case "particles/units/heroes/hero_pudge/pudge_meathook.vpcf":
			if (controlPoint === 0)
				part[1] = fallbackPosition
			else if (controlPoint === 1) {
				DestroyDirectional(`Hook${id}`)
				particles_table.delete(id)
			}
			break
		default:
			break
	}
})

EventsSDK.on("ParticleDestroyed", id => particles_table.delete(id))

EventsSDK.on("Tick", () => {
	thinkers_particles.filter(([time, ent, abil]) => time + abil.ActivationDelay < GameRules!.RawGameTime || !ent.IsValid).forEach(ar => {
		ArrayExtensions.arrayRemove(thinkers_particles, ar)
		particleManager.DestroyByKey(`Custom${ar[1].Index}`)
	})
	if (!active.value)
		return

	// loop-optimizer: KEEP
	particles_table.forEach((part, i) => {
		let end_pos = part[2]
		let start_pos = part[1]
		if (part[0] === "particles/units/heroes/hero_pudge/pudge_meathook.vpcf" && part[1].IsValid && part[2].IsValid) {
			let calc_pos = start_pos.Extend(end_pos, (GameRules!.RawGameTime - part[3]) * part[4])

			DrawDirectional(start_pos, calc_pos, `Hook${i}`)

			if (start_pos.Distance2D(calc_pos) > start_pos.Distance2D(end_pos)) {
				DestroyDirectional(`Hook${i}`)
				particles_table.delete(i)
			}
		}
	})

	// loop-optimizer: KEEP
	line_table.forEach(proj => {
		DrawDirectional(
			proj.Position,
			proj.TargetLoc,
			`Linear${proj.ID}`,
		)
	})

	// loop-optimizer: FORWARD
	abils_list.forEach(abil => {
		let owner = abil.Owner
		if (owner === undefined || !owner.IsEnemy())
			return

		if (abil.IsInAbilityPhase || (owner.IsChanneling && abil.Name === "windrunner_powershot"))
			DrawDirectional(
				owner.Position,
				owner.InFront(abil.CastRange),
				`Abil${abil.Index}`,
			)
		else
			DestroyDirectional(`Abil${abil.Index}`)
	})
})

EventsSDK.on("GameEnded", () => {
	line_table = []
	abils_list = []
	arTimers.clear()
	particles_table.clear()
})
