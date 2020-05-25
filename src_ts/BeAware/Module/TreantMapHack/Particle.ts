import { ArrayExtensions, Entity, LocalPlayer, ParticlesSDK, Unit, Vector3 } from "wrapper/Imports"
import { State } from "./Menu"

var treant_eyes: Unit[] = [], pars = new Map<Entity, number>()
export function Destroy(ent: Entity) {
	if (ArrayExtensions.arrayRemove(treant_eyes, ent))
		pars.delete(ent)
}
export function Create(ent: Entity) {
	if (ent instanceof Unit && ent.ClassName === "CDOTA_NPC_Treant_EyesInTheForest") {
		treant_eyes.push(ent)
		if (!State.value)
			return
		var par = ParticlesSDK.Create("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent)
		ParticlesSDK.SetControlPoint(par, 1, new Vector3(100, 0, 0))
		pars.set(ent, par)
	}
}
export function Tick() {
	if (!State.value)
		return
	var local_team_flag = 1 << LocalPlayer!.Team
	treant_eyes.forEach((ent, i) => {
		let native_ent = ent.NativeEntity
		if (native_ent === undefined)
			return
		let m_pEntity = native_ent.m_pEntity
		if (m_pEntity === undefined)
			return
		if (ent.IsAlive) {
			native_ent.m_iTaggedAsVisibleByTeam |= local_team_flag
			// |= 1 << 2 is EF_IN_STAGING_LIST
			// |= 1 << 4 is EF_DELETE_IN_PROGRESS
			// 1 << 5 is EF_NODRAW
			// &= ~(1 << 7) is trigger
			// 1 << 9 is EF_NODRAW???
			m_pEntity.m_flags &= ~(1 << 7)
			m_pEntity.m_flags |= 1 << 3
		} else {
			m_pEntity.m_flags |= 1 << 7
			m_pEntity.m_flags &= ~(1 << 3)
			treant_eyes.splice(i, 1)
			let par = pars.get(ent)
			if (par !== undefined) {
				ParticlesSDK.Destroy(par, true)
				pars.delete(ent)
			}
		}
	})
}
export function Init() {
	treant_eyes = []
	pars.forEach(par => ParticlesSDK.Destroy(par, true))
	pars.clear()
}
