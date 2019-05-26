import { EventsSDK, Entity, Unit, Vector3, EntityManager, Utils } from "../CrutchesSDK/Imports";

//import * as Utils from "Utils"

export default () => {
	var treant_eyes: Unit[] = [],
		pars: number[] = []

	EventsSDK.on("onEntityCreated", (ent: Entity, id) => {
		if (ent instanceof Unit && ent.m_pBaseEntity instanceof C_DOTA_NPC_Treant_EyesInTheForest) {
			treant_eyes.push(ent)
			var par = Particles.Create("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, ent.m_pBaseEntity)
			new Vector3(100, 0, 0).toIOBuffer();
			Particles.SetControlPoint(par, 1);
			pars[id] = par
		}
	})
	EventsSDK.on("onEntityDestroyed", (ent, id) => {
		
		if (Utils.arrayRemove(treant_eyes, ent))
			delete pars[id];
	})

	EventsSDK.on("onTick", () => {
		var local_team_flag = 1 << EntityManager.LocalPlayer.Team;
		// loop-optimizer: KEEP
		treant_eyes.forEach((ent, i) => {
			let pEntity = ent.m_pBaseEntity.m_pEntity;
			
			if (ent.IsAlive) {
				ent.IsVisibleForTeamMask |= local_team_flag
				// |= 1 << 2 is EF_IN_STAGING_LIST
				// |= 1 << 4 is EF_DELETE_IN_PROGRESS
				// 1 << 5 is EF_NODRAW
				// &= ~(1 << 7) is trigger
				// 1 << 9 is EF_NODRAW???
				
				pEntity.m_flags &= ~(1 << 7)
				pEntity.m_flags |= 1 << 3
			} else {
				pEntity.m_flags |= 1 << 7
				pEntity.m_flags &= ~(1 << 3)
				treant_eyes.splice(i, 1)
				Particles.Destroy(pars[ent.Index], true)
				delete pars[ent.Index]
			}
		})
	})

	EventsSDK.on("onGameEnded", () => {
		treant_eyes = []
		// loop-optimizer: POSSIBLE_UNDEFINED
		pars.forEach(par => Particles.Destroy(par, true))
		pars = []
	})
}
