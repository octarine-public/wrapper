import { Color, Entity, Game, Hero, LocalPlayer, RendererSDK, Unit, Vector2, Vector3 } from "wrapper/Imports"
import { ucFirst } from "../../abstract/Function"
import { ComboBox, DrawRGBA, PMH_Smoke_snd, Size, State } from "./Menu"

let npc_hero: string = "npc_dota_hero_",
	Particle: Map<number, [bigint, string | Entity, number, Vector3?, Color?, number?]> = new Map(), // TODO Radius for ability
	END_SCROLL = new Map<number, number>(),
	LAST_ID_SCROLL: number,
	ignoreListCreate: Array<bigint> = [
		16411378985643724199n,
		3845203473627057528n,
		2493460162828289005n,
		9081781702343064031n,
		16250734879025969559n,
		1676164312013390125n,
		10795105686913770252n,
		16706021384021574062n,
		3319765426154305425n,
		5244941174913880949n,
		16999430003839366138n,
		10146932630609076181n,
		6194896432063109095n,
		5261289796642637593n,
		6121206817302591590n,
		1395910015532192133n,
		13737405313044748592n,
		13587968156146944372n,
		7315652834289833775n,
		6474080100146051362n,
		9411589899328073635n,
		4639487695481367673n,
		9401153279394287079n,
		11281804850637540807n,
		8975046362064371102n,
		3940118018570288807n,
		8975046362064371102n,
		3717260057587970775n,
		17986169416295743678n,
		17172670307536884918n,
		12143317949272742843n,
		3965532167141887388n,
		11822138159889275084n,
		11576574379184336442n,
		6176380103998265840n,
		10251977501855418809n,
		4337809086382604824n,
		15591984632297613959n,
		16426221189982166438n,
		7217420080506833917n,
		16005396280504064234n,
		8471181176813126689n,
	],
	ignoreListCreateUpdate: Array<bigint> = [
		8654159076113771741n,
		3319765426154305425n,
		7751829135967853782n,
		8942984728089511588n,
		13345813756589668588n,
		204393823251131443n,
		3719375578397730360n,
		16501589714501556266n,
		6224567014058177052n,
		5261289796642637593n,
		6907985077120073095n,
		945443000161015079n,
		6474080100146051362n,
		9411589899328073635n,
		11281804850637540807n,
		11822138159889275084n,
		11576574379184336442n,
		6176380103998265840n,
		15591984632297613959n,
		10251977501855418809n,
		7217420080506833917n,
		16005396280504064234n,
		8471181176813126689n,
	],
	ignoreListCreateUpdateEnt: Array<bigint> = [
		1463643803508630076n,
		8069164713690266618n,
		5690601709983082755n,
		4320979652851470482n,
		3282926860763809157n,
		6474080100146051362n,
		15862585917379413836n,
		11281804850637540807n,
		17986169416295743678n,
		17172670307536884918n,
		12143317949272742843n,
		6176380103998265840n,
		10251977501855418809n,
		9157461782681193972n,
		448910324462799275n,
		15591984632297613959n,
		2831560734339649020n,
		15091348526487023459n,
		7217420080506833917n,
		16005396280504064234n,
		8471181176813126689n,
	]

function ClassChecking(entity: Entity) {
	return entity !== undefined && (
		entity.m_pBaseEntity instanceof C_DOTA_BaseNPC_Creep_Lane
		|| entity.m_pBaseEntity instanceof C_DOTA_BaseNPC_Creep_Neutral
		|| entity.m_pBaseEntity instanceof C_DOTA_BaseNPC_Tower
		|| entity.m_pBaseEntity instanceof C_DOTA_Unit_Hero_Wisp
	)
}
function DrawIconWorldHero(position: Vector3, Target: Entity | string, color?: Color, items?: string) {
	let pos_particle = RendererSDK.WorldToScreen(position)
	if (pos_particle === undefined)
		return
	switch (ComboBox.selected_id) {
		case 0:
			RendererSDK.Image(
				items === undefined
					? `panorama/images/heroes/icons/${Target}_png.vtex_c`
					: `panorama/images/items/${items}`
				,
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
export function ParticleCreate(id: number, handle: bigint, entity: Entity) {
	if (!State.value || !Game.IsInGame || ClassChecking(entity) || ignoreListCreate.includes(handle))
		return
	if (handle === 16169843851719108633n) 		// "particles/items2_fx/teleport_start.vpcf"
		LAST_ID_SCROLL = id
	if (handle === 9908905996079864839n) { 		// "particles/items2_fx/teleport_end.vpcf"
		END_SCROLL.set(id, LAST_ID_SCROLL)
		LAST_ID_SCROLL = undefined
	}
	//
	// console.log(handle.toString() + " | " + entity)
	// blink
	// if (handle === 6400371855556675384n) {
	// 	Particle.set(id, [handle, entity, undefined])
	// }

	Particle.set(id, [handle, entity instanceof Hero ? entity : undefined, Game.RawGameTime])
}
export function ParticleCreateUpdate(id: number, control_point: number, position: Vector3) {
	let part = Particle.get(id)
	if (!State.value || !Game.IsInGame || part === undefined || ignoreListCreateUpdate.includes(part[0]))
		return

	// console.log("ParticleCreateUpdate  | " + position + " | " + control_point + " | " + id)

	/**
	 * Not valid Entity
	 **/
	if (control_point === 0) { // # Ability

		// beastmaster_call_bird
		if (part[0] === 1463643803508630076n || part[0] === 8069164713690266618n)
			Particle.set(id, [part[0], npc_hero + "beastmaster", part[2], position])
		// brewmaster_thunder_clap
		if (part[0] === 3752518292310259682n)
			Particle.set(id, [part[0], npc_hero + "brewmaster", part[2], position])
		// espirit_stone_explosion
		if (part[0] === 4323854770615447628n)
			Particle.set(id, [part[0], npc_hero + "earth_spirit", part[2], position])
		// earthshaker_fissure
		if (part[0] === 17861642577092388618n)
			Particle.set(id, [part[0], npc_hero + "earthshaker", part[2], position])
		// elder_titan_earth_splitter
		if (part[0] === 13324101320785174829n)
			Particle.set(id, [part[0], npc_hero + "elder_titan", part[2], position])
		// elder_titan_echo_stomp_physical
		if (part[0] === 5667977939467904231n)
			Particle.set(id, [part[0], npc_hero + "elder_titan", part[2], position])
		// inner fire
		if (part[0] === 6167123975649691624n)
			Particle.set(id, [part[0], npc_hero + "huskar", part[2], position])
		// kunkka torrent
		if (part[0] === 90527129446097558n)
			Particle.set(id, [part[0], npc_hero + "kunkka", part[2], position])
		// ghost
		if (part[0] === 2339675573930106922n)
			Particle.set(id, [part[0], npc_hero + "kunkka", part[2], position])
		// life stealer infest
		if (part[0] === 11870561462387758523n)
			Particle.set(id, [part[0], npc_hero + "life_stealer", part[2], position])
		// rebuke
		if (part[0] === 13426387991622823534n || part[0] === 10751958973454668870n)
			Particle.set(id, [part[0], npc_hero + "mars", part[2], position])
		// super nova, icarus, spirits, sunray
		if (part[0] === 1042958021584336511n || part[0] === 15935050925296326403n || part[0] === 10704630012983197169n || part[0] === 1804381298115754254n)
			Particle.set(id, [part[0], npc_hero + "phoenix", part[2], position])
		// sand storm
		if (part[0] === 10608978942364279765n)
			Particle.set(id, [part[0], npc_hero + "sand_king", part[2], position])
		// spirit breaker charge
		if (part[0] === 14347153390066670812n)
			Particle.set(id, [part[0], npc_hero + "spirit_breaker", part[2], position])
		// ravage
		if (part[0] === 2641261068387757532n)
			Particle.set(id, [part[0], npc_hero + "tidehunter", part[2], position])
		// tiny avalance
		if (part[0] === 11543882486515702213n)
			Particle.set(id, [part[0], npc_hero + "tiny", part[2], position])
		// arc sparc
		if (part[0] === 9450757242089892587n)
			Particle.set(id, [part[0], npc_hero + "arc_warden", part[2], position])
		// bloodseeker blood rite
		if (part[0] === 6542825430051483889n)
			Particle.set(id, [part[0], npc_hero + "bloodseeker", part[2], position])
		// bounty_hunter hadow
		if (part[0] === 6989698579171478207n)
			Particle.set(id, [part[0], npc_hero + "bounty_hunter", part[2], position])
		// void chrone
		if (part[0] === 12395460486751989527n)
			Particle.set(id, [part[0], npc_hero + "faceless_void", part[2], position])
		// meepo poof
		if (part[0] === 14802028619464558908n)
			Particle.set(id, [part[0], npc_hero + "meepo", part[2], position])
		// mirana arrow
		if (part[0] === 9880755592293933483n)
			Particle.set(id, [part[0], npc_hero + "mirana", part[2], position])
		// monkey_king misschef
		if (part[0] === 14739391071850926756n)
			Particle.set(id, [part[0], npc_hero + "monkey_king", part[2], position])
		// morph adaptive strike
		if (part[0] === 11323298806625012598n)
			Particle.set(id, [part[0], npc_hero + "morphling", part[2], position])
		// nyx vendeta
		if (part[0] === 11428460328218524916n)
			Particle.set(id, [part[0], npc_hero + "nyx_assassin", part[2], position])
		// pangolier swashbuck
		if (part[0] === 4709630376105796041n)
			Particle.set(id, [part[0], npc_hero + "pangolier", part[2], position])
		// phantom_assassin blur
		if (part[0] === 9671291843391061224n)
			Particle.set(id, [part[0], npc_hero + "phantom_assassin", part[2], position])
		// riki blink strike
		if (part[0] === 5475669274736737409n)
			Particle.set(id, [part[0], npc_hero + "riki", part[2], position])
		// riki tricks start | end
		if (part[0] === 2742846163382429517n || part[0] === 3058260807409708966n)
			Particle.set(id, [part[0], npc_hero + "riki", part[2], position])
		// shadow fiend | shadowraze
		if (part[0] === 8605851627288464612n)
			Particle.set(id, [part[0], npc_hero + "nevermore", part[2], position])
		// venomancer poison nova
		if (part[0] === 7695694018062957479n)
			Particle.set(id, [part[0], npc_hero + "venomancer", part[2], position])
		// ancient apparition | feet, ice vortex ice blast
		if (part[0] === 3821454011598415742n || part[0] === 615206036419027595n || part[0] === 18399207273936825531n)
			Particle.set(id, [part[0], npc_hero + "ancient_apparition", part[2], position])
		// batrider
		if (part[0] === 8826413520360267931n)
			Particle.set(id, [part[0], npc_hero + "batrider", part[2], position])
		// crystal maiden | nova
		if (part[0] === 16327097855826580626n)
			Particle.set(id, [part[0], npc_hero + "crystal_maiden", part[2], position])
		// dark sier | vacum, wall
		if (part[0] === 6358407677122692483n || part[0] === 6039488715557449146n)
			Particle.set(id, [part[0], npc_hero + "dark_seer", part[2], position])
		// dark willow
		if (part[0] === 2804537531476109693n || part[0] === 13435245877944439363n || part[0] === 448910324462799275n || part[0] === 9157461782681193972n)
			Particle.set(id, [part[0], npc_hero + "dark_willow", part[2], position])
		// death prophet
		if (part[0] === 3020948711683823655n)
			Particle.set(id, [part[0], npc_hero + "death_prophet", part[2], position])
		// disraptor | kinetic static storm
		if (part[0] === 1289768807188690422n || part[0] === 11667161395290290268n)
			Particle.set(id, [part[0], npc_hero + "disruptor", part[2], position])
		// enigma pulse
		if (part[0] === 15271579302562161677n)
			Particle.set(id, [part[0], npc_hero + "enigma", part[2], position])
		// invoker metior
		if (part[0] === 6544262852176998491n)
			Particle.set(id, [part[0], npc_hero + "invoker", part[2], position, new Color(255, 255, 255)])
		// leshrac split
		if (part[0] === 10977498504300558457n || part[0] === 3807435887289622893n || part[0] === 2957027257057922287n)
			Particle.set(id, [part[0], npc_hero + "leshrac", part[2], position])
		// lich
		if (part[0] === 17931751641656559282n)
			Particle.set(id, [part[0], npc_hero + "lich", part[2], position])
		// lina | laguna or strike Array
		if (part[0] === 5326871934185736886n || part[0] === 14136065189915347240n)
			Particle.set(id, [part[0], npc_hero + "lina", part[2], position])
		// furion sprout teleport
		if (part[0] === 18101938899273081277n || part[0] === 16375869442840467308n)
			Particle.set(id, [part[0], part[1], part[2], position, new Color(100, 100, 100)])
		// obsidian_destroyer | eclipse | astral
		if (part[0] === 11562582309822695519n || part[0] === 12439617424976039911n || part[0] === 14147094464891580395n)
			Particle.set(id, [part[0], npc_hero + "obsidian_destroyer", part[2], position])
		// pugna blast
		if (part[0] === 8533375778285123176n || part[0] === 14964695791820827443n)
			Particle.set(id, [part[0], npc_hero + "pugna", part[2], position, new Color(255, 255, 255), +1])
		// with_doctor | maledict
		if (part[0] === 12994327613543406041n)
			Particle.set(id, [part[0], npc_hero + "witch_doctor", part[2], position, new Color(255, 255, 255)])
		// smoke
		if (part[0] === 14221266834388661971n) {
			Particle.set(id, [part[0], "Smoke", part[2], position, new Color(255, 17, 0)])
			SendToConsole("playvol ui/ping " + PMH_Smoke_snd.value / 100)
		}
		// dust
		if (part[0] === 2930661440000609946n)
			Particle.set(id, [part[0], "Dust", part[2], position, new Color(255, 255, 255)])

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
		if (part[0] === 13866368357606948277n)
			Particle.set(id, [part[0], npc_hero + "sand_king", part[2], position])
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
	 **/
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
	// console.log("ParticleUpdatedEnt  | " + position + " | " + ent + " | " + id)

	if (part === undefined || ignoreListCreateUpdateEnt.includes(part[0]))
		return
	// ursa
	if (part[0] === 16250734879025969559n && ent.Name === npc_hero + "roshan") {
		Particle.set(id, [part[0], npc_hero + "ursa", part[2], position])
		return
	}
	// dark_willow terroraze
	if (part[0] === 9157461782681193972n || part[0] === 448910324462799275n) {
		Particle.set(id, [part[0], npc_hero + "dark_willow", part[2], position])
		return
	}
	// death_prophet siphon
	if (part[0] === 15591984632297613959n) {
		Particle.set(id, [part[0], npc_hero + "death_prophet", part[2], position])
		return
	}
	// death_prophet siphon
	if (part[0] === 14579008345438684595n || part[0] === 3167953162413416262n) {
		Particle.set(id, [part[0], npc_hero + "keeper_of_the_light", part[2], position])
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
		Particle.set(id, [part[0], npc_hero + "puck", part[2], position])
		return
	}
	// puck | shift
	if (part[0] === 7547411452476548145n) {
		Particle.set(id, [part[0], ent.Name, part[2], position])
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

export function OnDraw() {
	if (Particle === undefined || Particle.size <= 0 || !Game.IsInGame)
		return
	// loop-optimizer: KEEP
	Particle.forEach(([handle, target, Time, position, color, delete_time], i) => {
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
				RendererSDK.DrawMiniMapIcon("minimap_ping_shop", position, Size.value * 14, color)
				DrawIconWorldHero(position, Target, new Color(255, 255, 255), "smoke_of_deceit_png.vtex_c")
			} else if (target === "Dust") {
				RendererSDK.DrawMiniMapIcon("minimap_ping_shop", position, Size.value * 14, color)
				DrawIconWorldHero(position, Target, new Color(255, 255, 255), "dust_png.vtex_c")
			} else {
				if (target === undefined)
					return
				RendererSDK.DrawMiniMapIcon(`minimap_heroicon_${target}`, position, Size.value * 12, color)
				DrawIconWorldHero(position, Target, color)
			}
		} else if (Target !== undefined && Target.IsEnemy() && target !== "Smoke" && !Target.IsVisible) {
			RendererSDK.DrawMiniMapIcon(`minimap_heroicon_${Target.Name}`, position, Size.value * 12, color)
			DrawIconWorldHero(position, Target, color)
		} else if (Target !== undefined && Target.IsEnemy() && target !== "Smoke" && (handle === 9908905996079864839n || handle === 16169843851719108633n)) {
			RendererSDK.DrawMiniMapIcon(`minimap_heroicon_${Target.Name}`, position, Size.value * 12, color)
			DrawIconWorldHero(position, Target, color)

			if (handle === 16169843851719108633n) {
				let screen_pos = RendererSDK.WorldToScreen(position)

				if (screen_pos !== undefined) {
					RendererSDK.Text((Game.RawGameTime - Time).toFixed(1).toString(), screen_pos)
				}
			}
		}
	})
}
export function ParticleDestroyed(id: number) {
	// console.log(id + " - ID Deleted ================== ")
	if (END_SCROLL.has(id))
		END_SCROLL.delete(id)
	if (Particle.has(id))
		Particle.delete(id)
}
export function GameEnded() {
	Particle = new Map()
	END_SCROLL = new Map()
}
