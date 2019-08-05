import { Vector3, RendererSDK, Entity, Game } from "wrapper/Imports";
import { State, DrawRGBA, Size, ComboBox } from "./Menu"
import { ucFirst } from "../../abstract/Function"

let Particle: Array<[number, BigInt?, Entity?, number?, Vector3?]> = [];
function ClassChecking(entity: Entity) {
	return entity.m_pBaseEntity instanceof C_DOTA_BaseNPC_Creep_Lane
		|| entity.m_pBaseEntity instanceof C_DOTA_BaseNPC_Creep_Neutral
		|| entity.m_pBaseEntity instanceof C_DOTA_BaseNPC_Tower
		|| entity.m_pBaseEntity instanceof C_DOTA_Unit_Hero_Wisp
}
export function ParticleCreate(id: number, handle: BigInt, entity: Entity){
	if (!State.value || (entity !== undefined && (!entity.IsEnemy() || entity.IsVisible || ClassChecking(entity)))) /// ......
		return;
	if (handle === 6662325468141068933n) // antimage_blink_start
		return;
	//antimage_blink_start
	//Debug.ClassDump(entity)
	Particle.push([id, handle, entity, Game.RawGameTime + 1]);
}
export function ParticleCreateUpdate(id: number, control_point: number, position: Vector3){
	if (!State.value)
		return;
	if (control_point === 0 || control_point === 1) {
		Particle.some(([particle_id, handle, entity, Time]) => {
			if (particle_id !== id)
				return false;
			Particle.push([particle_id, handle, entity, Time, position])
			return true
		})
	}
}
export function ParticleUpdatedEnt(id: number, ent: Entity, position: Vector3){
	if (!State.value)
		return;
	Particle.some(([particle_id, handle, target, Time], i) => {
		let Ent = ent as Entity
		if (particle_id !== id && (target !== undefined && (!target.IsEnemy() || target.IsVisible)))
			return false;
		Particle.push([particle_id, handle, Ent, Time, position])
		return true
	})
}
export function OnDraw() {
	if (Particle.length <= 0)
		return;
	Particle.forEach(([particle_id, handle, target, Time, position], i) => {
		if (position === undefined || Time <= Game.RawGameTime)
			return Particle.splice(i, 1)
		let pos_particle = RendererSDK.WorldToScreen(position);
		if (pos_particle === undefined || target === undefined || target.IsVisible)
			return;
		let Name = target.Name;
		if (Name === undefined)
			return;
		switch (ComboBox.selected_id) {
			case 0: 
				Renderer.Image(`panorama/images/heroes/icons/${target.Name}_png.vtex_c`, 
					pos_particle.x - Size.value / 4, pos_particle.y - Size.value / 4, Size.value / 2, Size.value / 2);
			 break;
			case 1:
				let NameRenderUnit = Name.split("_").splice(3, 3).join(' ');
				Renderer.Text(pos_particle.x, pos_particle.y, ucFirst(NameRenderUnit),
					DrawRGBA.R.value, DrawRGBA.G.value, DrawRGBA.B.value, DrawRGBA.A.value, "Arial", Size.value / 4)
			break;
		}
	})
}
export function GameEnded() {
	Particle = [];
}