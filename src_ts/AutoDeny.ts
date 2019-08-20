import { GetHealthAfter, GetRotationTime } from "Utils"
import { EntityManager, EventsSDK, LocalPlayer, ArrayExtensions } from "./wrapper/Imports"

EventsSDK.on("Tick", () => {
	let pl_ent = LocalPlayer.Hero
	if (pl_ent === undefined || !pl_ent.IsAlive)
		return
	let mist_coil = pl_ent.AbilitiesBook.GetAbilityByNativeClass(C_DOTA_Ability_Abaddon_DeathCoil)
	if (mist_coil === undefined || !mist_coil.CanBeCasted())
		return
	let dmg = mist_coil.GetSpecialValue("self_damage") + pl_ent.GetTalentClassValue(C_DOTA_Ability_Special_Bonus_Unique_Abaddon_2)
	if (GetHealthAfter(pl_ent.m_pBaseEntity, mist_coil.CastPoint, false) > dmg)
		return
	let targets = ArrayExtensions.orderBy (
		EntityManager.GetEntitiesInRange(pl_ent.Position, mist_coil.CastRange)
			.filter(ent => ent.m_pBaseEntity instanceof C_DOTA_BaseNPC_Hero || ent.m_pBaseEntity instanceof C_DOTA_BaseNPC_Creep),
		ent => GetRotationTime(pl_ent.m_pBaseEntity, ent.Position),
	)
	if (targets.length !== 0)
		pl_ent.CastTarget(mist_coil, targets[0], false)
})
