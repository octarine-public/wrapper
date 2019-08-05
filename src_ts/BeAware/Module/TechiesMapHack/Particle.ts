import { RendererSDK, Vector3, Entity } from "wrapper/Imports"
import { State, Size, DrawRGBA } from "./Menu"
let allTechiesMines: Array < [Vector3[], Vector3, string] > =[], // positions, center, stack-name
	waiting_explode: Array < [number, string] > =[],
	waiting_spawn: Array < [number, string] > =[]

export function CalculateCenter(vecs: Vector3[]): Vector3 {
	return Vector3.GetCenter(vecs)
}
export function ParticleCreated(id: number, target: Entity, path: string) {
	if (!State.value)
		return;
	let mine_name
	if ((mine_name = /^particles\/units\/heroes\/hero_techies\/(techies_remote_mine|techies_stasis_trap)_plant.vpcf$/.exec(path)) !== null) {
		if (target === undefined || !target.IsEnemy())
			return
		waiting_spawn.push([id, mine_name[1]])
	} else if ((mine_name = /^particles\/units\/heroes\/hero_techies\/(techies_remote_mine|techies_stasis_trap)(s_detonate|_explode).vpcf$/.exec(path)) !== null)
		waiting_explode.push([id, mine_name[1]])
}
export function ParticleUpdated(id: number, control_point: number, position: Vector3){
	if (!State.value)
		return;
	if (control_point === 1){
		waiting_spawn.some(([particle_id, mine_name], i) => {
			if (particle_id !== id)
				return false
			if (!allTechiesMines.some(obj => {
				if (obj[2] !== mine_name)
					return false
				let center = obj[1],
					mines = obj[0]
				if (center.Distance(position) > 100)
					return false
				mines.push(position)
				obj[1] = CalculateCenter(mines)
				return true
			}))
				allTechiesMines.push([[position], position, mine_name])
			waiting_spawn.splice(i, 1)
			return true
		})
	}
	if (control_point === 0){
		waiting_explode.some(([particle_id, mine_name], i) => {
			if (particle_id !== id)
				return false
			allTechiesMines.some((obj, i) => {
				if (obj[2] !== mine_name)
					return false
				let mines = obj[0]
				return mines.some((vec, j) => {
					if (vec.Distance(position) > 10)
						return false
					if (mines.length !== 1) {
						mines.splice(j, 1)
						obj[1] = CalculateCenter(mines)
					} else
						allTechiesMines.splice(i, 1)
					return true
				})
			})
			waiting_explode.splice(i, 1)
			return true
		})
	}
}
export function ParticleUpdatedEnt(id: number, control_point: number, attach: ParticleAttachment_t, position: Vector3){
	if (!State.value)
		return;
	if (control_point !== 0 || attach !== ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
		return false
	waiting_explode.some(([particle_id, mine_name], i) => {
		if (particle_id !== id)
			return false
		allTechiesMines.some(obj => {
			if (obj[2] !== mine_name)
				return false
			let mines = obj[0]
			return mines.some((vec, i) => {
				if (vec.Distance(position) !== 0)
					return false
				mines.splice(i, 1)
				obj[1] = CalculateCenter(mines)
				return true
			})
		})
		waiting_explode.splice(i, 1)
		return true
	})
}
export function OnDraw() {
	if (!State.value || allTechiesMines.length <= 0)
		return;
	allTechiesMines.forEach(([allMines, pos, name]) => {
		let wts = RendererSDK.WorldToScreen(pos)
		if (wts !== undefined || name !== undefined) {
			Renderer.Image(`~/other/npc_dota_${name}.png`, wts.x - 64 / 4, wts.y - 87 / 4, 64 / 2, 87 / 2)
			Renderer.Text(wts.x + (Size.value / 4), wts.y, "x" + allMines.length,
				DrawRGBA.R.value, DrawRGBA.G.value, DrawRGBA.B.value, DrawRGBA.A.value, "Arial", Size.value)
		}
	})
}
export function GameEnded(){
	allTechiesMines = []
	waiting_explode = []
	waiting_spawn = []
}
