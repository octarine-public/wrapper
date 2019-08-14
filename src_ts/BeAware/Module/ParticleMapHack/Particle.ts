import { Vector3, RendererSDK, Entity, Game, Color, Vector2, Unit } from "wrapper/Imports";
import { State, DrawRGBA, Size, ComboBox } from "./Menu"
import { ucFirst } from "../../abstract/Function"
const fullColor = new Color(255,255,255)
let Particle: Map<number,[BigInt?, Entity?, number?, Vector3?]> = new Map(),
	lastTeleport = undefined,
	teleport2hero = new Map<number,number>()
function ClassChecking(entity: Entity) {
	if (entity === undefined)
		return false;
	return entity.m_pBaseEntity instanceof C_DOTA_BaseNPC_Creep_Lane
		|| entity.m_pBaseEntity instanceof C_DOTA_BaseNPC_Creep_Neutral
		|| entity.m_pBaseEntity instanceof C_DOTA_BaseNPC_Tower
		|| entity.m_pBaseEntity instanceof C_DOTA_Unit_Hero_Wisp
}
export function ParticleCreate(id: number, handle: BigInt, entity: Entity){
	if (!State.value || !Game.IsInGame || ClassChecking(entity))
		return;
	if (handle === 6662325468141068933n)
		return;
	if(handle === 16169843851719108633n){
		lastTeleport = id
	}
	if(handle === 9908905996079864839n){
		teleport2hero.set(id,lastTeleport)
		lastTeleport = undefined
	}
	Particle.set(id,[handle, entity, Game.RawGameTime + 10]);
}
export function ParticleCreateUpdate(id: number, control_point: number, position: Vector3){
	if (!State.value || !Game.IsInGame)
		return;
	if (control_point === 0 || control_point === 1) {
		let part = Particle.get(id)
		if(part[0] === 14221266834388661971n && !position.Equals(new Vector3(1200,1,1200)))
			SendToConsole('play ui/ping')
		Particle.set(id,[part[0], part[1], part[2], position])
	}
}
export function ParticleUpdatedEnt(id: number, ent: Entity, position: Vector3){
	if (!State.value || !Game.IsInGame || ClassChecking(ent))
		return;
	let Ent = ent as Unit
	let part = Particle.get(id)
	if(part[0] === 9908905996079864839n){
		let partf = teleport2hero.get(id),
			partar = Particle.get(partf)
		Particle.set(partf,[partar[0], Ent, partar[2], part[3]])
	}
	Particle.set(id,[part[0], Ent, part[2], position])
}
export function OnDraw() {
	if (Particle.size <= 0 || !Game.IsInGame)
		return;
	// loop-optimizer: KEEP
	Particle.forEach(([handle, target, Time, position], i) => {
		
		/*|| handle === 16411378985643724199n || handle === 1676164312013390125n */ //Target undefined............ facepalm
		
		if (position === undefined || Time <= Game.RawGameTime /*|| handle === 16411378985643724199n || handle === 1676164312013390125n */) {
			Particle.delete(i)
			return
		}
		// if(handle == 16169843851719108633n)
			// console.log(position.toString())
		if (target === undefined) {
			if(handle !== 16169843851719108633n && handle !== 14221266834388661971n) {
				
				RendererSDK.DrawMiniMapIcon("minimap_creep", position, 500, DrawRGBA.Color)
				
			} else if (handle === 14221266834388661971n && !position.Equals(new Vector3(1200,1,1200))) {
				
				RendererSDK.DrawMiniMapIcon("minimap_ping", position, 700, DrawRGBA.Color)
			}
			return;
		} 
		else {
			if (!target.IsEnemy() || target.IsVisible || position.Length < 10)
				return;
			let Name = target.Name;
			if (Name === undefined)
				return;
			let color = fullColor
			if(handle == 9908905996079864839n){
				color = new Color(100,100,100)
			}
			RendererSDK.DrawMiniMapIcon(`minimap_heroicon_${Name}`, position, Size.value * 12, color)
			let pos_particle = RendererSDK.WorldToScreen(position);
			if (pos_particle === undefined)
				return
			switch (ComboBox.selected_id) {
				case 0:
					RendererSDK.Image(
						`panorama/images/heroes/icons/${target.Name}_png.vtex_c`,
						pos_particle.SubtractScalar(Size.value / 4),
						new Vector2(Size.value / 2, Size.value / 2)
					)
					break
				case 1:
					let NameRenderUnit = Name.split("_").splice(3, 3).join(' ');
					RendererSDK.Text(
						ucFirst(NameRenderUnit),
						pos_particle,
						new Color(
							DrawRGBA.R.value,
							DrawRGBA.G.value,
							DrawRGBA.B.value,
							DrawRGBA.A.value
						),
						"Arial",
						Size.value / 4
					)
					break
			}
		}
	})
}
export function ParticleDestroyed(id: number) {
	if(teleport2hero.has(id))
		teleport2hero.delete(id)
	Particle.delete(id)
}
export function GameEnded() {
	Particle = new Map();
	teleport2hero = new Map();
}