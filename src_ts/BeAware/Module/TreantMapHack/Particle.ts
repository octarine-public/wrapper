import { ArrayExtensions, Entity, LocalPlayer, Unit, Vector3 } from "wrapper/Imports"
import { State } from "./Menu"

var treant_eyes: Unit[] = [], pars: number[] = []
export function Destroy(ent: Entity, id: number) {
	if (ArrayExtensions.arrayRemove(treant_eyes, ent))
		delete pars[id]
}
export function Create(ent: Entity, id: number) {
	if (!State.value)
		return
	if (ent instanceof Unit && ent.m_pBaseEntity instanceof C_DOTA_NPC_Treant_EyesInTheForest) {
		treant_eyes.push(ent)
		var par = Particles.Create("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent.m_pBaseEntity)
		new Vector3(100, 0, 0).toIOBuffer()
		Particles.SetControlPoint(par, 1)
		pars[id] = par
	}
}
export function Tick(): boolean {
	if (!State.value)
		return
	var local_team_flag = 1 << LocalPlayer.Team
	if (treant_eyes === undefined)
		return false
	// loop-optimizer: KEEP
	treant_eyes.forEach((ent, i) => {
		if (ent === undefined || i === undefined)
			return false
		if (ent.IsAlive) {
			ent.IsVisibleForTeamMask |= local_team_flag
			// |= 1 << 2 is EF_IN_STAGING_LIST
			// |= 1 << 4 is EF_DELETE_IN_PROGRESS
			// 1 << 5 is EF_NODRAW
			// &= ~(1 << 7) is trigger
			// 1 << 9 is EF_NODRAW???
			ent.Flags &= ~(1 << 7)
			ent.Flags |= 1 << 3
			return true
		} else {
			ent.Flags |= 1 << 7
			ent.Flags &= ~(1 << 3)
			treant_eyes.splice(i, 1)
			Particles.Destroy(pars[ent.Index], true)
			delete pars[ent.Index]
			return true
		}
	})
	return false
}
export function GameEnded() {
	if (!State.value)
		return
	treant_eyes = []
	// loop-optimizer: POSSIBLE_UNDEFINED
	pars.forEach(par => Particles.Destroy(par, true))
	pars = []
}