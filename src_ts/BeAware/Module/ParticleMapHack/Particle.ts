import { ArrayExtensions, Color, Entity, Game, Hero, ParticlesSDK, RendererSDK, Unit, Vector2, Vector3, LocalPlayer } from "wrapper/Imports"
import { ucFirst } from "../../abstract/Function"
import {
	ComboBox,
	DrawRGBA,
	PMH_Smoke_snd, Size, State, PMH_RenderStateMouseSmoke,
} from "./Menu"
import { ignoreListCreate, ignoreListCreateUpdate, ignoreListCreateUpdateEnt } from "./DataHandle"

let npc_hero: string = "npc_dota_hero_",
	Particle: Map<number, [bigint, string | Entity, number, Vector3?, Color?, number?, string?]> = new Map(), // TODO Radius for ability
	END_SCROLL = new Map<number, number>(),
	OtherRadius = new Map<Entity, number>(),
	LAST_ID_SCROLL: number,
	Heroes: Hero[] = [],
	Units: Unit[] = [],
	OtherAbility: Entity[] = [],
	_Size = Size.value * 20

function ClassChecking(entity: Entity) {
	return entity !== undefined && (
		entity.m_pBaseEntity instanceof C_DOTA_BaseNPC_Creep_Lane
		|| entity.m_pBaseEntity instanceof C_DOTA_BaseNPC_Creep_Neutral
		|| entity.m_pBaseEntity instanceof C_DOTA_BaseNPC_Tower
		//|| entity.m_pBaseEntity instanceof C_DOTA_Unit_Hero_Wisp
	)
}

function DrawIconWorldHero(position: Vector3, Target: Entity | string, color?: Color, items?: string) {
	let pos_particle = RendererSDK.WorldToScreen(position)
	if (pos_particle === undefined)
		return
	switch (ComboBox.selected_id) {
		case 0:
			RendererSDK.Image
				(
					items === undefined
						? `panorama/images/heroes/icons/${Target}_png.vtex_c`
						: `panorama/images/items/${items}`,
					pos_particle.SubtractScalar(Size.value / 4),
					new Vector2(Size.value / 2, Size.value / 2), color,
				)
			break
		case 1:
			let NameRenderUnit = Target.toString().split("_").splice(3, 3).join(" ")
			RendererSDK.Text(
				ucFirst(NameRenderUnit),
				pos_particle,
				DrawRGBA.Color,
				"Arial",
				Size.value / 4,
			)
			break
		default:
			break
	}
}

export function ParticleCreate(id: number, handle: bigint, path: string, entity: Entity) {
	if (!State.value || !Game.IsInGame || ClassChecking(entity) || ignoreListCreate.includes(handle))
		return
	if (handle === 16169843851719108633n)		// "particles/items2_fx/teleport_start.vpcf"
		LAST_ID_SCROLL = id
	if (handle === 9908905996079864839n) { 		// "particles/items2_fx/teleport_end.vpcf"
		END_SCROLL.set(id, LAST_ID_SCROLL)
		LAST_ID_SCROLL = undefined
	}
	//
	// console.log(handle.toString() + " | " + entity + " | " + path)
	// blink
	// if (handle === 6400371855556675384n) {
	// 	Particle.set(id, [handle, entity, undefined])
	// }

	Particle.set(id, [handle, entity instanceof Hero ? entity : undefined, Game.RawGameTime])
}

function IsEnemyUse(position: Vector3) {
	return Units.some(x => x !== undefined
		&& (x.IsHero || x.IsCourier) && x.IsAlive
		&& x.IsEnemy() && x.Distance2D(position) < 900)
}
function FindAbilitySet(id: number, part: any, position: Vector3, name_ability: string, name_hero: string, color?: Color, Time?: number) {
	let hero = Heroes.find(x => x !== undefined && x.IsEnemy() && !x.IsVisible && x.Name === name_hero)
	if (hero !== undefined) {
		let abil = hero.GetAbilityByName(name_ability)
		if (abil !== undefined && abil.IsValid)
			Particle.set(id, [part[0], hero.Name, part[2], position, color, Time, name_ability])
	}
}

export function ParticleCreateUpdate(id: number, control_point: number, position: Vector3) {
	let part = Particle.get(id)
	if (!State.value || !Game.IsInGame || part === undefined || ignoreListCreateUpdate.includes(part[0]))
		return

	// console.log("ParticleCreateUpdate  | " + position + " | " + control_point + " | " + id)

	/**
	 * Not valid Entity
	 */
	if (control_point === 0) { // # Ability
		// beastmaster_call_bird
		if (part[0] === 1463643803508630076n || part[0] === 8069164713690266618n) {
			FindAbilitySet(id, part, position, "beastmaster_call_of_the_wild_hawk", npc_hero + "beastmaster")
		}
		// brewmaster_thunder_clap
		if (part[0] === 3752518292310259682n) {
			FindAbilitySet(id, part, position, "brewmaster_thunder_clap", npc_hero + "brewmaster")
		}
		// earth_spirit_magnetize
		if (part[0] === 4323854770615447628n) {
			FindAbilitySet(id, part, position, "earth_spirit_magnetize", npc_hero + "earth_spirit")
		}
		// earthshaker_fissure
		if (part[0] === 17861642577092388618n) {
			FindAbilitySet(id, part, position, "earthshaker_fissure", npc_hero + "earthshaker")
		}
		// elder_titan_earth_splitter
		if (part[0] === 13324101320785174829n) {
			FindAbilitySet(id, part, position, "elder_titan_earth_splitter", npc_hero + "elder_titan")
		}
		// elder_titan_echo_stomp_physical
		if (part[0] === 5667977939467904231n) {
			FindAbilitySet(id, part, position, "elder_titan_echo_stomp_physical", npc_hero + "elder_titan")
		}
		// inner fire
		if (part[0] === 6167123975649691624n) {
			FindAbilitySet(id, part, position, "huskar_inner_fire", npc_hero + "huskar")
		}
		// kunkka torrent
		if (part[0] === 90527129446097558n) {
			FindAbilitySet(id, part, position, "kunkka_torrent", npc_hero + "kunkka")
		}
		// mars_gods_rebuke
		if (part[0] === 13426387991622823534n) {
			FindAbilitySet(id, part, position, "mars_gods_rebuke", npc_hero + "mars")
		}
		// mars_arena_of_blood
		if (part[0] === 10751958973454668870n) {
			FindAbilitySet(id, part, position, "mars_arena_of_blood", npc_hero + "mars")
		}
		if (part[0] === 1042958021584336511n || part[0] === 15935050925296326403n) {
			FindAbilitySet(id, part, position, "phoenix_supernova", npc_hero + "phoenix")
		}
		if (part[0] === 10704630012983197169n || part[0] === 1804381298115754254n) {
			FindAbilitySet(id, part, position, "phoenix_fire_spirits", npc_hero + "phoenix")
		}
		// sand storm
		if (part[0] === 10608978942364279765n) {
			FindAbilitySet(id, part, position, "sandking_sand_storm", npc_hero + "sand_king")
		}
		// spirit breaker charge
		if (part[0] === 14347153390066670812n) {
			FindAbilitySet(id, part, position, "spirit_breaker_charge_of_darkness", npc_hero + "spirit_breaker")
		}
		// ravage
		if (part[0] === 2641261068387757532n) {
			FindAbilitySet(id, part, position, "tidehunter_ravage", npc_hero + "tidehunter")
		}
		// tiny avalance
		if (part[0] === 11543882486515702213n) {
			FindAbilitySet(id, part, position, "tiny_avalanche", npc_hero + "tiny")
		}
		// arc sparc
		if (part[0] === 9450757242089892587n) {
			FindAbilitySet(id, part, position, "arc_warden_spark_wraith", npc_hero + "arc_warden")
		}
		// bloodseeker blood rite
		if (part[0] === 6542825430051483889n) {
			FindAbilitySet(id, part, position, "bloodseeker_blood_bath", npc_hero + "bloodseeker")
		}
		// bounty_hunter hadow
		if (part[0] === 6989698579171478207n) {
			FindAbilitySet(id, part, position, "bounty_hunter_wind_walk", npc_hero + "bounty_hunter")
		}
		// void chrone
		if (part[0] === 12395460486751989527n) {
			FindAbilitySet(id, part, position, "faceless_void_chronosphere", npc_hero + "faceless_void")
		}
		// meepo poof
		if (part[0] === 14802028619464558908n) {
			FindAbilitySet(id, part, position, "meepo_poof", npc_hero + "meepo")
		}
		// mirana arrow
		if (part[0] === 9880755592293933483n) {
			FindAbilitySet(id, part, position, "mirana_arrow", npc_hero + "mirana")
		}
		// monkey_king misschef
		if (part[0] === 14739391071850926756n) {
			FindAbilitySet(id, part, position, "monkey_king_mischief", npc_hero + "monkey_king")
		}
		// morph adaptive strike
		if (part[0] === 11323298806625012598n) {
			FindAbilitySet(id, part, position, "morphling_adaptive_strike_agi", npc_hero + "morphling")
		}
		// nyx vendeta
		if (part[0] === 11428460328218524916n) {
			FindAbilitySet(id, part, position, "nyx_assassin_vendetta", npc_hero + "nyx_assassin")
		}
		// pangolier swashbuck
		if (part[0] === 4709630376105796041n) {
			FindAbilitySet(id, part, position, "pangolier_swashbuckle", npc_hero + "pangolier")
		}
		// phantom_assassin blur
		if (part[0] === 9671291843391061224n) {
			FindAbilitySet(id, part, position, "phantom_assassin_blur", npc_hero + "phantom_assassin")
		}
		// riki tricks start | end
		if (part[0] === 2742846163382429517n || part[0] === 3058260807409708966n) {
			FindAbilitySet(id, part, position, "riki_tricks_of_the_trade", npc_hero + "riki")
		}
		// shadow fiend | shadowraze
		if (part[0] === 8605851627288464612n) {
			FindAbilitySet(id, part, position, "nevermore_shadowraze3", npc_hero + "nevermore")
		}
		// venomancer poison nova
		if (part[0] === 7695694018062957479n) {
			//Particle.set(id, [part[0], npc_hero + "venomancer", part[2], position])
			FindAbilitySet(id, part, position, "venomancer_poison_nova", npc_hero + "venomancer")
		}
		// ancient apparition | feet, ice vortex ice blast
		if (part[0] === 3821454011598415742n || part[0] === 615206036419027595n || part[0] === 18399207273936825531n) {
			FindAbilitySet(id, part, position, "ancient_apparition_cold_feet", npc_hero + "ancient_apparition")
			// .... FindAbilitySet
		}
		// batrider
		if (part[0] === 8826413520360267931n) {
			FindAbilitySet(id, part, position, "batrider_flamebreak", npc_hero + "batrider")
		}
		// crystal maiden | nova
		if (part[0] === 16327097855826580626n) {
			FindAbilitySet(id, part, position, "crystal_maiden_crystal_nova", npc_hero + "crystal_maiden")
		}
		// dark sier | vacum, wall
		if (part[0] === 6358407677122692483n || part[0] === 6039488715557449146n) {
			FindAbilitySet(id, part, position, "dark_seer_vacuum", npc_hero + "dark_seer")
		}
		// dark willow
		if (part[0] === 2804537531476109693n || part[0] === 13435245877944439363n || part[0] === 448910324462799275n || part[0] === 9157461782681193972n) {
			FindAbilitySet(id, part, position, "dark_willow_terrorize", npc_hero + "dark_willow")
		}
		// death prophet
		if (part[0] === 3020948711683823655n) {
			FindAbilitySet(id, part, position, "death_prophet_carrion_swarm", npc_hero + "death_prophet")
		}
		// disraptor | kinetic static storm
		if (part[0] === 1289768807188690422n || part[0] === 11667161395290290268n) {
			FindAbilitySet(id, part, position, "disruptor_static_storm", npc_hero + "disruptor")
		}
		// enigma pulse
		if (part[0] === 15271579302562161677n) {
			FindAbilitySet(id, part, position, "enigma_midnight_pulse", npc_hero + "enigma")
		}
		// invoker metior
		if (part[0] === 6544262852176998491n) {
			FindAbilitySet(id, part, position, "invoker_chaos_meteor", npc_hero + "invoker")
		}
		// leshrac split
		if (part[0] === 10977498504300558457n || part[0] === 3807435887289622893n || part[0] === 2957027257057922287n) {
			FindAbilitySet(id, part, position, "leshrac_pulse_nova", npc_hero + "leshrac")
		}
		// lich
		if (part[0] === 17931751641656559282n) {
			FindAbilitySet(id, part, position, "lich_frost_nova", npc_hero + "lich")
		}
		// lina | laguna or strike Array
		if (part[0] === 5326871934185736886n || part[0] === 14136065189915347240n) {
			FindAbilitySet(id, part, position, "lina_light_strike_array", npc_hero + "lina")
		}
		// furion sprout teleport
		if (part[0] === 18101938899273081277n || part[0] === 16375869442840467308n) {
			FindAbilitySet(id, part, position, "furion_teleportation", npc_hero + "furion", new Color(100, 100, 100))
		}
		// obsidian_destroyer | eclipse | astral
		if (part[0] === 11562582309822695519n || part[0] === 12439617424976039911n || part[0] === 14147094464891580395n) {
			FindAbilitySet(id, part, position, "obsidian_destroyer_sanity_eclipse", npc_hero + "obsidian_destroyer")
		}
		// pugna blast
		if (part[0] === 8533375778285123176n || part[0] === 14964695791820827443n) {
			FindAbilitySet(id, part, position, "pugna_nether_blast", npc_hero + "pugna", new Color(255, 255, 255), + 1)
		}
		// with_doctor | maledict
		if (part[0] === 12994327613543406041n) {
			FindAbilitySet(id, part, position, "witch_doctor_maledict", npc_hero + "witch_doctor", new Color(255, 255, 255))
		}
		// smoke
		if (part[0] === 14221266834388661971n && IsEnemyUse(position)) {
			Particle.set(id, [part[0], "Smoke", part[2], position, new Color(255, 17, 0), + 5])
			Game.ExecuteCommand("playvol ui/ping " + PMH_Smoke_snd.value / 1000)
		}
		// dust
		if (part[0] === 2930661440000609946n && IsEnemyUse(position)) {
			Particle.set(id, [part[0], "Dust", part[2], position, new Color(255, 255, 255)])
		}

		// // blink
		// if (part[0] === 6400371855556675384n || part[0] === 10753307352412363396n)
		// 	Particle.set(id, [part[0], "Blink", part[2], position, new Color(255, 255, 255)])
	}
	if (control_point === 1) {
		// furion
		if (part[0] === 8570169123090060667n)
			Particle.set(id, [part[0], npc_hero + "furion", part[2], position])
		// enigma demonic
		if (part[0] === 10009481603386975411n)
			Particle.set(id, [part[0], npc_hero + "enigma", part[2], position])
		// void chrone
		if (part[0] === 15862585917379413836n)
			Particle.set(id, [part[0], npc_hero + "faceless_void", part[2], position])
		// Tusk
		if (part[0] === 11494335841746008496n)
			Particle.set(id, [part[0], npc_hero + "tusk", part[2], position])
		// timber chain
		if (part[0] === 7382801540246882042n)
			Particle.set(id, [part[0], part[1], part[2], position])
		// burrow strike
		if (part[0] === 13866368357606948277n) {
			FindAbilitySet(id, part, position, "sandking_burrowstrike", npc_hero + "sand_king")
		}
		// alchemist_lasthit_coins
		if (part[0] === 9631112814295870874n)
			Particle.set(id, [part[0], npc_hero + "alchemist", part[2], position])
		// phantom_assassin grace
		if (part[0] === 3367216677761242125n)
			Particle.set(id, [part[0], npc_hero + "phantom_assassin", part[2], position])
		// phantom_lancer dopel
		if (part[0] === 7462196558402771530n)
			Particle.set(id, [part[0], npc_hero + "phantom_lancer", part[2], position])
	}
	if (control_point === 2) {
		// shadow demon | catcher
		if (part[0] === 5950705063951953059n)
			Particle.set(id, [part[0], npc_hero + "shadow_demon", part[2], position, new Color(255, 255, 255), +1])
	}
	/**
	 * Valid Entity
	 */
	if (control_point === 0) {
		// viper toxin
		if (part[0] === 7830573181181083183n)
			Particle.set(id, [part[0], part[1], part[2], position])
		// Scroll
		if (part[0] === 9908905996079864839n)
			Particle.set(id, [part[0], "Scroll", part[2], position])
	}

	if (control_point === 1) {// # Ability
		// espirit_rollingboulder | rattletrap_battery_assault
		if (part[0] === 12716414980205333824n || part[0] === 15612669588476236884n)
			Particle.set(id, [part[0], part[1], part[2], position])
	}

	// if (control_point === 5) { // #Items

	// }
}

export function ParticleUpdatedEnt(id: number, ent: Entity, position: Vector3) {
	if (!State.value || !Game.IsInGame || ClassChecking(ent))
		return
	let part = Particle.get(id)
	//console.log("ParticleUpdatedEnt  | " + position + " | " + ent + " | " + id)
	if (part === undefined || ignoreListCreateUpdateEnt.includes(part[0]))
		return
	// ursa
	if (part[0] === 16250734879025969559n && ent.Name === npc_hero + "roshan") {
		Particle.set(id, [part[0], npc_hero + "ursa", part[2], position])
		return
	}
	// dark_willow terroraze
	if (part[0] === 9157461782681193972n || part[0] === 448910324462799275n) {
		FindAbilitySet(id, part, position, "dark_willow_terrorize", npc_hero + "dark_willow")
		return
	}
	// death_prophet siphon
	if (part[0] === 15591984632297613959n) {
		FindAbilitySet(id, part, position, "death_prophet_spirit_siphon", npc_hero + "death_prophet")
		return
	}
	// keeper_of_the_light_will_o_wisp
	if (part[0] === 14579008345438684595n || part[0] === 3167953162413416262n) {
		FindAbilitySet(id, part, position, "keeper_of_the_light_will_o_wisp", npc_hero + "keeper_of_the_light")
		return
	}
	// antimage blink
	if (part[0] === 6662325468141068933n) {
		Particle.set(id, [part[0], ent, part[2], position, new Color(100, 100, 100)])
		return
	}
	// obsidian_destroyer | EQ
	if (part[0] === 14147094464891580395n) {
		Particle.set(id, [part[0], ent, part[2], position])
		return
	}
	// puck | dream coil
	if (part[0] === 5608482983863018919n) {
		FindAbilitySet(id, part, position, "puck_dream_coil", npc_hero + "puck")
		return
	}
	// puck | shift
	if (part[0] === 7547411452476548145n) {
		Particle.set(id, [part[0], ent, part[2], position])
		return
	}
	// Items Scroll
	if (part[0] === 9908905996079864839n) { // "particles/items2_fx/teleport_end.vpcf"
		Particle.set(id, [part[0], ent, part[2], position, new Color(100, 100, 100)])
		let ID_START_SCROLL = END_SCROLL.get(id),
			_part = Particle.get(ID_START_SCROLL)
		if (part[1] === "Scroll")
			Particle.set(ID_START_SCROLL, [_part[0], ent, _part[2], part[3]])
		return
	}
	Particle.set(id, [part[0], ent instanceof Hero ? ent : part[1], part[2], position])
}

function DrawIconAbilityHero(position: Vector3, name: string) {
	let pos_ent = RendererSDK.WorldToScreen(position)
	if (pos_ent === undefined)
		return
	RendererSDK.Image("panorama/images/spellicons/" + name + "_png.vtex_c",
		pos_ent.SubtractScalar(44 / 4),
		new Vector2(44 / 2, 44 / 2),
	)
}

function CreateAbilityRadius(ent: Entity, radius: number) {
	var par = ParticlesSDK.Create("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent)
	ParticlesSDK.SetControlPoint(par, 1, new Vector3(radius, 0, 0))
	OtherRadius.set(ent, par)
}

function DrawingOtherAbility(x: Entity, name: string, ability_name: string, radius?: number) {
	if (x.Name.includes(name)) {
		if (!OtherRadius.has(x)) {
			CreateAbilityRadius(x, radius)
		}
		if (!x.IsVisible) {
			DrawIconAbilityHero(x.Position, ability_name)
		}
	}
}

function RenderTeleportMap(handle: bigint, position: Vector3) {
	if (handle !== 16169843851719108633n)
		return
	let minus = --_Size * 2
	minus >= Size.value * 20
		? RendererSDK.DrawMiniMapIcon("minimap_ping_teleporting", position, minus, new Color(0, 200, 0))
		: RendererSDK.DrawMiniMapIcon("minimap_ping_teleporting", position, Size.value * 20, new Color(0, 200, 0))
}

export function OnDraw() {
	if (!Game.IsInGame)
		return

	// loop-optimizer: KEEP
	OtherAbility.forEach(x => {
		if (x === undefined) {
			return
		}
		if (x.IsEnemy()) {
			DrawingOtherAbility(x, "nether_ward", "pugna_nether_ward", 1600)
			DrawingOtherAbility(x, "psionic_trap", "templar_assassin_trap", 400)
		}
	})

	if (Particle === undefined || Particle.size <= 0 || !State.value)
		return
	// loop-optimizer: KEEP
	Particle.forEach(([handle, target, Time, position, color, delete_time, ability_string], i) => {
		// particle mapHack
		if (delete_time === undefined)
			delete_time = + 3 // def time for del.
		// console.log("Position: " + position + " | Color: " + color)
		if (position === undefined || Time + delete_time <= Game.RawGameTime) {
			Particle.delete(i)
			return
		}
		let Target = target as Unit
		if (Target === undefined || Target.Name === undefined) {
			if (target === "Smoke") {
				RendererSDK.DrawMiniMapIcon("minimap_ping_shop", position, Size.value * 20, color)
				DrawIconWorldHero(position, Target, new Color(255, 255, 255), "smoke_of_deceit_png.vtex_c")
				if (LocalPlayer !== undefined && PMH_RenderStateMouseSmoke.value) {
					RendererSDK.TextAroundMouse("Enemy used smoke, distance from you (" + Math.round(LocalPlayer.Hero.Distance2D(position)) + ") units", false, new Color(255, 255, 0, 155), "Calibri", new Vector2(18))
				}
			} else if (target === "Dust") {
				RendererSDK.DrawMiniMapIcon("minimap_ping_shop", position, Size.value * 14, color)
				DrawIconWorldHero(position, Target, new Color(255, 255, 255), "dust_png.vtex_c")
			} else {
				if (target === undefined)
					return
				RendererSDK.DrawMiniMapIcon(`minimap_heroicon_${target}`, position, Size.value * 12, color)
				if (ability_string !== undefined) {
					let add_pos = position.Clone().AddScalarY(-80)
					DrawIconAbilityHero(add_pos, ability_string)
				}
				DrawIconWorldHero(position, Target, color)
			}
		} else if (Target !== undefined && Target.IsEnemy() && target !== "Smoke" && !Target.IsVisible) {
			RendererSDK.DrawMiniMapIcon(`minimap_heroicon_${Target.Name}`, position, Size.value * 12, color)
			if (handle === 9908905996079864839n) {
				RendererSDK.DrawMiniMapIcon("minimap_ping_teleporting", position, Size.value * 20, color)
			}
			RenderTeleportMap(handle, position)
			DrawIconWorldHero(position, Target, color)
		} else if (Target !== undefined && Target.IsEnemy()
			&& target !== "Smoke" && (handle === 9908905996079864839n || handle === 16169843851719108633n)
		) {
			RendererSDK.DrawMiniMapIcon(`minimap_heroicon_${Target.Name}`, position, Size.value * 12, color)
			if (handle === 9908905996079864839n) {
				RendererSDK.DrawMiniMapIcon("minimap_ping_teleporting", position, _Size, color)
			}
			RenderTeleportMap(handle, position)
			if (ability_string !== undefined) {
				let add_pos = position.Clone().AddScalarY(-80)
				DrawIconAbilityHero(add_pos, ability_string)
			}
			DrawIconWorldHero(position, Target, color)
			if (handle !== 16169843851719108633n && handle !== 9908905996079864839n) {
				return
			}
			let BuffDieTime = Target.GetBuffByName("modifier_teleporting"),
				screen_pos = RendererSDK.WorldToScreen(position)
			if (BuffDieTime === undefined || screen_pos !== undefined)
				return
			RendererSDK.Text((-(Game.RawGameTime - BuffDieTime.DieTime)).toFixed(1).toString(), screen_pos, new Color(255, 255, 255), "Consoles", Size.value / 3)
		}
	})

}

export function ParticleDestroyed(id: number) {
	if (END_SCROLL.has(id)) {
		END_SCROLL.delete(id)
		_Size = Size.value * 20
	}
	if (Particle.has(id)) {
		Particle.delete(id)
	}
}

export function EntityCreated(x: Entity) {
	if (x instanceof Hero)
		Heroes.push(x)
	if (x instanceof Unit)
		Units.push(x)
	if (x instanceof Entity) {
		if (x.Name === undefined)
			return
		if (x.Name.includes("npc_dota_pugna_nether_ward_") || x.Name.includes("npc_dota_templar_assassin_psionic_trap"))
			OtherAbility.push(x)
	}
}

export function EntityDestroyed(x: Entity) {
	if (x instanceof Hero)
		ArrayExtensions.arrayRemove(Heroes, x)
	if (x instanceof Unit)
		ArrayExtensions.arrayRemove(Units, x)
	if (x instanceof Entity)
		ArrayExtensions.arrayRemove(OtherAbility, x)
}

export function Init() {
	Heroes = []
	Units = []
	OtherAbility = []
	Particle.clear()
	END_SCROLL.clear()
	LAST_ID_SCROLL = undefined
	_Size = Size.value * 20
}
