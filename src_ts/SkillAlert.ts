import { Ability, ArrayExtensions, Color, Entity, EventsSDK, Game, LinearProjectile, Menu, Modifier, ParticlesSDK, RendererSDK, Unit, Vector2, Vector3, DOTAGameUIState_t } from "wrapper/Imports"

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
	arSpecialDuration = [
		"delay",
		"delay",
		"light_strike_array_delay_time",
		"delay",
	],
	arParticles = [
		["particles/units/heroes/hero_invoker/invoker_sun_strike_team.vpcf", ["pos", "rad"]],
		["particles/units/heroes/hero_kunkka/kunkka_spell_torrent_bubbles.vpcf", ["pos"]],
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
	arSpecialValues = [
		"area_of_effect",
		"radius",
		"light_strike_array_aoe",
		"radius",
		"", "", "",
		"impact_radius",
	],
	talent: any[] = [false, "special_bonus_unique_kunkka"],
	arNames = new Map<string, string>([
		["invoker_sun_strike", "Sun Strike"],
		["kunkka_torrent", "Torrent"],
		["lina_light_strike_array", "Light Strike Array"],
		["leshrac_split_earth", "Split Earth"],
		["monkey_king_primal_spring", "Primal Spring"],
	])
let arTimers = new Map<Modifier, [number, number, string, Entity]>(),
	arHeroMods = new Map<Modifier, number>()

let phaseSpells = [
	"lina_dragon_slave",
	"pudge_meat_hook",
	"mirana_arrow",
	"windrunner_powershot",
	"grimstroke_dark_artistry",
	"lion_impale",
]

let remove_list: [number, number][] = []
EventsSDK.on("ModifierCreated", buff => {
	if (!active.value)
		return

	let ent = buff.Parent!
	let index = arModifiers.indexOf(buff.Name)
	if (index !== -1) {
		let radius = 175,
			delay = arDurations[index]
		let ability = buff.Ability
		if (ability !== undefined) {
			if (arSpecialValues[index])
				radius = ability.GetSpecialValue(arSpecialValues[index])
			if (arSpecialDuration[index])
				delay = ability.GetSpecialValue(arSpecialDuration[index])
			else if (ability.ChannelStartTime)
				delay = ability.ChannelStartTime
			let talent_class = talent[index]
			if (talent_class !== undefined && talent_class !== false)
				radius += ability.Owner!.GetTalentValue(talent_class)
		}
		let abPart = -1
		if (arParticles[index]) {
			abPart = ParticlesSDK.Create(arParticles[index][0], ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent)
			arParticles[index][1].forEach((val, i) => {
				let pos: Vector3
				switch (val) {
					case "pos":
						pos = ent.Position
						break
					case "rad":
						pos = new Vector3(radius, radius, radius)
						break
					default:
						pos = new Vector3()
						break
				}
				ParticlesSDK.SetControlPoint(abPart, i, pos)
			})
		}
		arTimers.set(buff, [Game.GameTime, delay, ability?.Name ?? arAbilities[index], ent])
		if (abPart !== -1)
			remove_list.push([Game.RawGameTime + delay, abPart])
	}

	let mod = arHeroModifiers.get(buff.Name)
	if (mod !== undefined)
		arHeroMods.set(buff, ParticlesSDK.Create(mod[0], ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, ent))
})
EventsSDK.on("ModifierRemoved", buff => {
	arTimers.delete(buff)
	let part = arHeroMods.get(buff)
	if (part !== undefined) {
		arHeroMods.delete(buff)
		ParticlesSDK.Destroy(part)
	}
})

EventsSDK.on("Draw", () => {
	if (!active.value || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return
	// loop-optimizer: KEEP
	arTimers.forEach((val, buff) => {
		let rend = val[0] - Game.GameTime + val[1]
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

let direct_part_list = new Map<any, [number, number, number]>()
function DrawDirectional(v1: Vector3, v2: Vector3, key: any) {
	let part_table = direct_part_list.get(key)

	if (part_table === undefined) {
		let index1 = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_directional.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN)
		let index2 = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_directional_b.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN)
		let index3 = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_directional_c.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN)

		ParticlesSDK.SetControlPoint(index1, 2, v2)
		ParticlesSDK.SetControlPoint(index2, 2, v2)
		ParticlesSDK.SetControlPoint(index3, 2, v2)

		part_table = [index1, index2, index3]
		direct_part_list.set(key, part_table)
	}

	ParticlesSDK.SetControlPoint(part_table[0], 0, v1)
	ParticlesSDK.SetControlPoint(part_table[1], 1, v1)
	ParticlesSDK.SetControlPoint(part_table[2], 0, v1)

	ParticlesSDK.SetControlPoint(part_table[0], 2, v2)
	ParticlesSDK.SetControlPoint(part_table[1], 2, v2)
	ParticlesSDK.SetControlPoint(part_table[2], 2, v2)
}

function DestroyDirectional(key: any) {
	let part_table = direct_part_list.get(key)
	if (part_table === undefined)
		return
	ParticlesSDK.Destroy(part_table[0])
	ParticlesSDK.Destroy(part_table[1])
	ParticlesSDK.Destroy(part_table[2])
	direct_part_list.delete(key)
}

let circle_part_list = new Map<Entity, [number]>()
function DrawParticleCirclePos(pos: Vector3, radius: number, ent: Entity) {
	let part_table = circle_part_list.get(ent)
	if (part_table === undefined) {
		let index1 = ParticlesSDK.Create("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN)
		ParticlesSDK.SetControlPoint(index1, 1, new Vector3(radius))
		part_table = [index1]
		circle_part_list.set(ent, part_table)
	}

	ParticlesSDK.SetControlPoint(part_table[0], 0, pos)
}

function DestroyCircle(ent: Entity) {
	let part_table = circle_part_list.get(ent)
	if (part_table !== undefined) {
		ParticlesSDK.Destroy(part_table[0])
		circle_part_list.delete(ent)
	}
}

function ReturnAOERadius(owner: Unit, name_ability: string): number {
	return owner.GetAbilityByName(name_ability)?.AOERadius ?? 0
}

function OnEntityNameChanged(ent: Entity) {
	if (!(ent instanceof Unit) || ent.Name !== "npc_dota_thinker" || circle_part_list.has(ent))
		return
	let owner = ent.Owner as Nullable<Unit>
	if (owner === undefined) {
		let buff = (ent as Unit).Buffs[0]
		if (buff === undefined)
			return
		owner = buff.Parent
	}

	if (owner === undefined || !owner.IsEnemy())
		return

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
	if (rad !== 0)
		DrawParticleCirclePos(ent.Position, rad, ent)
}

let abils_list: Ability[] = []
EventsSDK.on("EntityCreated", ent => {
	if (ent instanceof Ability)
		abils_list.push(ent)

	OnEntityNameChanged(ent)
})
EventsSDK.on("EntityNameChanged", OnEntityNameChanged)

EventsSDK.on("EntityDestroyed", ent => {
	if (!active.value)
		return
	if (ent instanceof Ability)
		ArrayExtensions.arrayRemove(abils_list, ent)
	if (ent.Name === "npc_dota_thinker")
		DestroyCircle(ent)
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
	DestroyDirectional(proj)
	ArrayExtensions.arrayRemove(line_table, proj)
})

let particles_table = new Map<number, [/* path */string, /* start */Vector3, /* end */Vector3, /* start game time */number, /* speed */number]>()
EventsSDK.on("ParticleCreated", (id, path) => {
	if (path === "particles/units/heroes/hero_pudge/pudge_meathook.vpcf")
		particles_table.set(id, [path, new Vector3().Invalidate(), new Vector3().Invalidate(), Game.RawGameTime, 1450 /* hook_speed */])
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
				DestroyDirectional(id)
				particles_table.delete(id)
			}
			break
		default:
			break
	}
})

EventsSDK.on("ParticleDestroyed", id => particles_table.delete(id))

EventsSDK.on("Tick", () => {
	remove_list.filter(([time]) => time < Game.RawGameTime).forEach(ar => {
		ArrayExtensions.arrayRemove(remove_list, ar)
		ParticlesSDK.Destroy(ar[1])
	})
	if (!active.value)
		return

	// loop-optimizer: KEEP
	particles_table.forEach((part, i) => {
		let end_pos = part[2]
		let start_pos = part[1]
		if (part[0] === "particles/units/heroes/hero_pudge/pudge_meathook.vpcf" && part[1].IsValid && part[2].IsValid) {
			let calc_pos = start_pos.Extend(end_pos, (Game.RawGameTime - part[3]) * part[4])

			DrawDirectional(start_pos, calc_pos, i)

			if (start_pos.Distance2D(calc_pos) > start_pos.Distance2D(end_pos)) {
				DestroyDirectional(i)
				particles_table.delete(i)
			}
		}
	})

	// loop-optimizer: KEEP
	line_table.forEach(proj => {
		DrawDirectional(
			proj.Position,
			proj.TargetLoc,
			proj,
		)
	})

	// loop-optimizer: FORWARD
	abils_list.forEach(abil => {
		if (!abil.IsEnemy())
			return
		// loop-optimizer: FORWARD
		phaseSpells.forEach(spell => {
			if (spell === abil.Name) {
				let owner = abil.Owner!

				if (abil.IsInAbilityPhase || (owner.IsChanneling && spell === "windrunner_powershot"))
					DrawDirectional(
						owner.Position,
						owner.InFront(abil.CastRange),
						abil,
					)
				else
					DestroyDirectional(abil)
			}
		})
	})
})

EventsSDK.on("GameEnded", () => {
	line_table = []
	abils_list = []
	arTimers.clear()
	arHeroMods.clear()
	particles_table.clear()
	circle_part_list.clear()
	direct_part_list.clear()
})
