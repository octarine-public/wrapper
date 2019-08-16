import { Color, EntityManager, EventsSDK, Game, Hero, MenuManager, Modifier, RendererSDK, Unit, Vector2, Vector3 } from "wrapper/Imports"
let { MenuFactory } = MenuManager
const menu = MenuFactory("Skill Alert"),
	active = menu.AddToggle("Active", true),
	names = menu.AddCheckBox("Show skill names", false),
	show = menu.AddListBox("Alert Skills", ["Sun Strike", "Torrent", "Light Strike Array", "Split Earth", "Charge of Darkness", "Snowball", "Infest", "Primal Spring"], [true, true, true, true, true, true, true, true]),
	textSize = menu.AddSlider("Timer text size", 17, 10, 30),
	spellIcons = menu.AddTree("Spell Icons"),
	icons = spellIcons.AddCheckBox("Show spell icons", false),
	size = spellIcons.AddSlider("Size", 30, 3, 100),
	opacity = spellIcons.AddSlider("Opacity", 255, 0, 255),
	chat = menu.AddTree("Send to chat"),
	// pick = chat.AddCheckBox("Pick on position"),
	chatActive = chat.AddCheckBox("Chat say", false),
	chatRangeCheck = chat.AddSlider("Range Check", 1300, 200, 5000),
	chatShow = chat.AddListBox("Chat Alert Skills", show.values, [true, true, true, true, true, true, true, true]),
	arModifiers = [
		"modifier_invoker_sun_strike",
		"modifier_kunkka_torrent_thinker",
		"modifier_lina_light_strike_array",
		"modifier_leshrac_split_earth_thinker",
		false, false, false,
		"modifier_monkey_king_spring_thinker",
	],
	arHeroModifiers = {
		modifier_spirit_breaker_charge_of_darkness_vision: [true, true, "particles/units/heroes/hero_spirit_breaker/spirit_breaker_charge_target_mark.vpcf", 4],
		modifier_tusk_snowball_target: [true, true, "particles/units/heroes/hero_tusk/tusk_snowball_target.vpcf", 5],
		modifier_life_stealer_infest_effect: [false, false, "particles/units/heroes/hero_life_stealer/life_stealer_infested_unit_icon.vpcf", 6],
	},
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

	] as Array<[string, string[]]>,
	arAbilities = [
		"invoker_sun_strike",
		"kunkka_torrent",
		"lina_light_strike_array",
		"leshrac_split_earth",
		"", "", "",
		"monkey_king_primal_spring",
	],
	arSounds = [
		"invoker_invo_ability_sunstrike_01",
		"kunkka_kunk_ability_torrent_01",
		"lina_lina_ability_lightstrike_02",
		"leshrac_lesh_ability_split_05",
	],
	arSpecialValues = [
		"area_of_effect",
		"radius",
		"light_strike_array_aoe",
		"radius",
		"", "", "",
		"impact_radius",
	],
	talent: any[] = [false, C_DOTA_Ability_Special_Bonus_Unique_Kunkka],
	arMessages = [
		"SunStrike near ",
		"Torrent near ",
		"Light Strike Array near ",
		"Split Earth near ",
		"Spirit Breaker charged on ",
		"Tusk snowballed on ",
		"LifeStealer sit in ",
		"Primal Spring near ",
	],
	arNames = {
		invoker_sun_strike: "Sun Strike",
		kunkka_torrent: "Torrent",
		lina_light_strike_array: "Light Strike Array",
		leshrac_split_earth: "Split Earth",
		monkey_king_primal_spring: "Primal Spring",
	}
let arTimers = new Map<Modifier, [number, number, string, Vector3]>(),
	arHeroMods = new Map<Modifier, number>()

EventsSDK.on("BuffAdded", (ent, buff) => {
	if (!active.value)
		return
	if (ent.Name === "npc_dota_thinker") {
		if (!ent.IsEnemy())
			return
		let index = arModifiers.indexOf(buff.Name)
		if (index !== -1) {
			if (!show.selected_flags[index])
				return
			let radius = 175,
			delay = arDurations[index]
			if (ent.Owner instanceof Unit) {
				let ability = ent.Owner.GetAbilityByName(arAbilities[index])
				if (ability !== undefined) {
					if (arSpecialValues[index])
						radius = ability.GetSpecialValue(arSpecialValues[index])
					if (arSpecialDuration[index])
						delay = ability.GetSpecialValue(arSpecialDuration[index])
					else if (ability.ChannelStartTime)
						delay = ability.ChannelStartTime
					let talent_class = talent[index]
					if (talent_class !== undefined && talent_class !== false)
						radius += ent.Owner.GetTalentClassValue(talent_class)
				}
			}
			let abPart
			if (arParticles[index]) {
				abPart = Particles.Create(arParticles[index][0], ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent.m_pBaseEntity)
				arParticles[index][1].forEach((val, i) => {
					switch (val) {
						case "pos":
							ent.Position.toIOBuffer()
							break
						case "rad":
							new Vector3(radius, radius, radius).toIOBuffer()
							break
						default:
							break
					}
					Particles.SetControlPoint(abPart, i)
				})
			}
			const part = Particles.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent.m_pBaseEntity)
			ent.Position.toIOBuffer()
			Particles.SetControlPoint(part, 0)
			ent.Position.toIOBuffer()
			Particles.SetControlPoint(part, 2)
			new Vector3(radius, 0, 0).toIOBuffer()
			Particles.SetControlPoint(part, 3)
			new Vector3(255, 255, 255).toIOBuffer()
			Particles.SetControlPoint(part, 4)
			arTimers.set(buff, [Game.GameTime, delay, arAbilities[index], ent.Position.Clone()])
			if (chatActive.value && chatShow.selected_flags[index] && arMessages[index]) {
				let heroes = EntityManager.GetEntitiesInRange(ent.Position, chatRangeCheck.value, ent => ent instanceof Hero && !ent.IsEnemy()),
					names = [],
					string = ""
				heroes.forEach(hero => names.push(hero.Name.substring(14) + ` in ${Math.floor(hero.Distance2D(ent))} range`))
				string = names.join(", ")
				if (!string)
					string = "no one, lul"
				SendToConsole(`say_team ${arMessages[index] + string}`)
			}
			setTimeout(() => {
				Particles.Destroy(part, false)
				if (abPart)
					Particles.Destroy(abPart, false)
			}, delay * 1000)
		}
	}
	let mod = arHeroModifiers[buff.Name]
	if (mod) {
		if (!show.selected_flags[mod[3]])
			return
		if (mod[0] && !ent.IsHero)
			return
		if (mod[1] && ent.IsEnemy())
			return
		const part = Particles.Create(mod[2], ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, ent.m_pBaseEntity)
		arHeroMods.set(buff, part)
		if (chatActive.value && chatShow.selected_flags[mod[3]] && arMessages[mod[3]]) {
			SendToConsole(`say_team ${arMessages[mod[3]] + ent.Name.substring(9)}`)
		}
	}
})
EventsSDK.on("BuffRemoved", (ent, buff) => {
	arTimers.delete(buff)
	if (arHeroMods.has(buff)) {
		let part = arHeroMods.get(buff)
		arHeroMods.delete(buff)
		Particles.Destroy(part, false)
	}
})
EventsSDK.on("Tick", () => {
	if (!active.value)
		return
	if (arHeroMods.size > 0) {
		// loop-optimizer: KEEP
		arHeroMods.forEach((part, buff) => {
			if (buff.RemainingTime === null) {
				arHeroMods.delete(buff)
				Particles.Destroy(part, false)
			}
		})
	}
})
EventsSDK.on("Draw", () => {
	if (!active.value)
		return
	let delArray = []
	// loop-optimizer: KEEP
	arTimers.forEach((val, buff) => {
		let rend = val[0] - Game.GameTime + val[1]
		if (rend <= 0) {
			delArray.push(buff)
			return
		}
		let vector = RendererSDK.WorldToScreen(val[3])
		if (!vector)
			return
		if (names.value) {
			RendererSDK.Text(arNames[val[2]], vector, Color.White, "Calibri", new Vector2(textSize.value, 200))
			vector.AddScalarY(-size.value)
		}
		if (icons.value) {
			RendererSDK.Image(`panorama/images/spellicons/${val[2]}_png.vtex_c`, vector, new Vector2(size.value, size.value), new Color(255, 255, 255, opacity.value))
			vector.AddScalarY(-30)
		}
		RendererSDK.Text(rend.toFixed(2), vector, Color.White, "Calibri", new Vector2(textSize.value, 200))
	})
	delArray.forEach(buff => arTimers.delete(buff))
})
