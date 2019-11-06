import { Entity, RendererSDK, Vector2, Vector3 } from "wrapper/Imports"
import { DrawRGBA, Size, State } from "./Menu"

let allTechiesMines: Array<[Array<[Vector3, number]>, Vector3, string]> = [], // positions+particle_ids, center, stack-name
	waiting_explode: Array<[number, string]> = [],
	waiting_spawn: Array<[number, string]> = []

export function EntityDestroyed(ent: Entity) {
	let mine_name_ = /^npc_dota_(techies_remote_mine|techies_stasis_trap)$/.exec(ent.Name)
	if (mine_name_ === null)
		return
	let mine_name = mine_name_[1]
	allTechiesMines.some((obj, j) => {
		if (obj[2] !== mine_name)
			return false
		let mines = obj[0]
		return mines.some(([vec], k) => {
			if (vec.Distance(ent.NetworkPosition) > 10)
				return false
			if (mines.length !== 1) {
				mines.splice(k, 1)
				obj[1] = Vector3.GetCenter(mines.map(([vec_]) => vec_))
			} else
				allTechiesMines.splice(j, 1)
			return true
		})
	})
}

export function LifeStateChanged(ent: Entity) {
	if (ent.IsAlive)
		return
	EntityDestroyed(ent)
}

export function ParticleCreated(id: number, target: Entity, path: string) {
	if (!State.value)
		return
	let mine_name: any
	if ((mine_name = /^particles\/units\/heroes\/hero_techies\/(techies_remote_mine|techies_stasis_trap)_plant.vpcf$/.exec(path)) !== null) {
		if (mine_name !== "particles/units/heroes/hero_techies/techies_stasis_trap_plant.vpcf" && (target === undefined || target.IsEnemy()))
			waiting_spawn.push([id, mine_name[1]])
	} else if ((mine_name = /^particles\/units\/heroes\/hero_techies\/(techies_remote_mine|techies_stasis_trap)(s_detonate|_explode).vpcf$/.exec(path)) !== null)
		waiting_explode.push([id, mine_name[1]])
}
export function ParticleUpdated(id: number, control_point: number, position: Vector3) {
	if (!State.value)
		return
	if (control_point === 1) {
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
				mines.push([position, id])
				obj[1] = Vector3.GetCenter(mines.map(([vec]) => vec))
				return true
			}))
				allTechiesMines.push([[[position, id]], position, mine_name])
			waiting_spawn.splice(i, 1)
			return true
		})
	}
	if (control_point === 0) {
		waiting_explode.some(([particle_id, mine_name], i) => {
			if (particle_id !== id)
				return false
			let is_stasis = mine_name === "techies_stasis_trap"
			allTechiesMines.some((obj, j) => {
				if (obj[2] !== mine_name)
					return false
				let mines = obj[0],
					found = false
				// loop-optimizer: KEEP
				mines.some(([vec], k) => {
					if (vec.Distance(position) > (is_stasis ? 450 : 10))
						return false
					if (mines.length !== 1) {
						mines.splice(k, 1)
						obj[1] = Vector3.GetCenter(mines.map(([vec_]) => vec_))
					} else
						allTechiesMines.splice(j, 1)
					found = true
					return !is_stasis
				})
				return found
			})
			waiting_explode.splice(i, 1)
			return true
		})
	}
}
export function ParticleUpdatedEnt(id: number, control_point: number, attach: ParticleAttachment_t, position: Vector3) {
	if (!State.value)
		return
	if (control_point !== 0 || attach !== ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
		return false
	waiting_explode.some(([particle_id, mine_name], i) => {
		if (particle_id !== id)
			return false
		allTechiesMines.some(obj => {
			if (obj[2] !== mine_name)
				return false
			let mines = obj[0]
			return mines.some((vec, j) => {
				if (vec[0].Distance(position) !== 0)
					return false
				mines.splice(j, 1)
				obj[1] = Vector3.GetCenter(mines.map(([vec_]) => vec_))
				return true
			})
		})
		waiting_explode.splice(i, 1)
		return true
	})
}
export function ParticleDestroyed(id: number) {
	allTechiesMines.some(([positions], i) => positions.some(([pos, particle_id], pos_id) => {
		if (id !== particle_id)
			return false
		if (positions.length !== 1) {
			positions.splice(pos_id, 1)
			allTechiesMines[i][1] = Vector3.GetCenter(allTechiesMines[i][0].map(([vec]) => vec))
		} else
			allTechiesMines.splice(i, 1)
		return true
	}))
}
export function OnDraw() {
	if (!State.value || allTechiesMines.length <= 0)
		return
	allTechiesMines.forEach(([allMines, pos, name]) => {
		let wts = RendererSDK.WorldToScreen(pos)
		if (wts !== undefined && name !== undefined) {
			RendererSDK.Image(`~/other/npc_dota_${name}.png`, wts.SubtractScalarX(64 / 4).SubtractScalarY(87 / 4), new Vector2(64 / 2, 87 / 2))
			RendererSDK.Text (
				"x" + allMines.length,
				wts.AddScalarX(Size.value / 4),
				DrawRGBA.Color,
				"Arial",
				Size.value,
			)
		}
	})
}

export function Init() {
	allTechiesMines = []
	waiting_explode = []
	waiting_spawn = []
}
