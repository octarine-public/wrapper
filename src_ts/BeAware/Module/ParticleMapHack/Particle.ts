import { Color, Entity, Game, Hero, RendererSDK, Vector2, Vector3, Unit } from "wrapper/Imports"
import { ucFirst } from "../../abstract/Function"
import { ComboBox, DrawRGBA, IconLifetime, Size, State } from "./Menu"

const fullColor = new Color(255, 255, 255)
let Particle: Map<number, [bigint, Entity, number, Vector3?]> = new Map(),
	teleport_end2start = new Map<number, number>(),
	lastTeleport: number,
	ignore_list: Array<bigint> = [
		6662325468141068933n, 	// "particles/units/heroes/hero_antimage/antimage_blink_start.vpcf"
		16411378985643724199n, 	// "particles/world_environmental_fx/dire_creep_spawn.vpcf", dire camp spawn
		3845203473627057528n,	// "particles/world_environmental_fx/radiant_creep_spawn.vpcf", radiant camp spawn
		2493460162828289005n,	// tower dire
		9081781702343064031n,	// barak dire
		16250734879025969559n,	// barak dire hero
		1676164312013390125n,	// tower raddiant
		10795105686913770252n,	// barak raddiant hero
		//10753307352412363396n
	]
	
function ClassChecking(entity: Entity) {
	return entity !== undefined && (
		   entity.m_pBaseEntity instanceof C_DOTA_BaseNPC_Creep_Lane
		|| entity.m_pBaseEntity instanceof C_DOTA_BaseNPC_Creep_Neutral
		|| entity.m_pBaseEntity instanceof C_DOTA_BaseNPC_Tower
		|| entity.m_pBaseEntity instanceof C_DOTA_Unit_Hero_Wisp
	)
}
export function ParticleCreate(id: number, handle: bigint, entity: Entity) {
	if (!State.value || !Game.IsInGame || ClassChecking(entity) || ignore_list.includes(handle))
		return
	if (handle === 16169843851719108633n) 		// "particles/items2_fx/teleport_start.vpcf"
		lastTeleport = id
	if (handle === 9908905996079864839n) { 		// "particles/items2_fx/teleport_end.vpcf"
		teleport_end2start.set(id, lastTeleport)
		lastTeleport = undefined
	}
	//console.log(handle.toString())
	//console.log("ParticleCreate | " + id)
	//console.log(entity instanceof Hero ? entity : undefined)
	Particle.set(id, [handle, entity instanceof Hero ? entity : undefined, Game.RawGameTime + IconLifetime.value])
}
export function ParticleCreateUpdate(id: number, control_point: number, position: Vector3) {
	if (!State.value || !Game.IsInGame)
		return
	if (control_point === 0 || control_point === 1) {
		let part = Particle.get(id)
		//console.log("ParticleCreateUpdate | " + id)
		if (part === undefined || part[0] === 14560529784942794097n/** naga rip tide  */ || part[0] === 6400371855556675384n)
			return
		if (part[0] === 14221266834388661971n && !position.Equals(new Vector3(1200, 1, 1200))) // "particles/items2_fx/smoke_of_deceit.vpcf"
			SendToConsole("playvol ui/ping 0.1")
		if (position.Length < 10)
			return
		Particle.set(id, [part[0], part[1], part[2], position])
	}
}
export function ParticleUpdatedEnt(id: number, ent: Entity, position: Vector3) {
	//console.log("ParticleUpdatedEnt  | " + position)
	if (!State.value || !Game.IsInGame || ClassChecking(ent))
		return
	let part = Particle.get(id)
	if (part === undefined)
		return
	if (part[0] === 9908905996079864839n) { // "particles/items2_fx/teleport_end.vpcf"
		let start_id = teleport_end2start.get(id),
			part_ = Particle.get(start_id)
		Particle.set(start_id, [part_[0], ent, part_[2], part[3]])
	}
	Particle.set(id, [part[0], ent instanceof Hero ? ent : part[1], part[2], position])
}
export function OnDraw() {
	if (Particle.size <= 0 || !Game.IsInGame)
		return
	// loop-optimizer: KEEP
	Particle.forEach(([handle, target, Time, position], i) => {
		if (position === undefined || position.Length < 10 || Time <= Game.RawGameTime) {
			Particle.delete(i)
			return
		}
		if (target === undefined) {
			if (handle !== 16169843851719108633n && handle !== 14221266834388661971n) // "particles/items2_fx/teleport_start.vpcf", "particles/items2_fx/smoke_of_deceit.vpcf"
				RendererSDK.DrawMiniMapIcon("minimap_creep", position, 500, DrawRGBA.Color)
			else if (handle === 14221266834388661971n && !position.Equals(new Vector3(1200, 1, 1200))) // "particles/items2_fx/smoke_of_deceit.vpcf"
				RendererSDK.DrawMiniMapIcon("minimap_ping", position, 700, DrawRGBA.Color)
		} else if (target.IsEnemy() && (!target.IsVisible || handle === 16169843851719108633n || handle === 9908905996079864839n)) {
			let Name = target.Name, color = fullColor
			if (handle === 9908905996079864839n) // "particles/items2_fx/teleport_end.vpcf"
				color = new Color(100, 100, 100)
			if (position.z <= 1 && handle !== 9908905996079864839n) // sven
				return
			RendererSDK.DrawMiniMapIcon(`minimap_heroicon_${Name}`, position, Size.value * 12, color)
			let pos_particle = RendererSDK.WorldToScreen(position)
			if (pos_particle === undefined || pos_particle.Length < 10)
				return

			switch (ComboBox.selected_id) {
				case 0:
					RendererSDK.Image(
						`panorama/images/heroes/icons/${target.Name}_png.vtex_c`,
						pos_particle.SubtractScalar(Size.value / 4),
						new Vector2(Size.value / 2, Size.value / 2),
					)
					break
				case 1:
					let NameRenderUnit = Name.split("_").splice(3, 3).join(" ")
					RendererSDK.Text(
						ucFirst(NameRenderUnit),
						pos_particle,
						new Color(
							DrawRGBA.R.value,
							DrawRGBA.G.value,
							DrawRGBA.B.value,
							DrawRGBA.A.value,
						),
						"Arial",
						Size.value / 4,
					)
					break
				default:
					break
			}
		}
	})
}
export function ParticleDestroyed(id: number) {
	if (teleport_end2start.has(id))
		teleport_end2start.delete(id)
}
export function GameEnded() {
	Particle = new Map()
	teleport_end2start = new Map()
}
