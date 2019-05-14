import * as Orders from "Orders"
import * as Utils from "Utils"

Events.on("onTick", () => {
	let pl_ent = LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC
	if (pl_ent === undefined || !Utils.IsAlive(pl_ent))
		return
	let mist_coil = Utils.GetAbilityByName(pl_ent, "abaddon_death_coil")
	if (mist_coil === undefined || mist_coil.m_fCooldown !== 0 || mist_coil.m_iLevel === 0)
		return
	let dmg = mist_coil.GetSpecialValue("self_damage")
	{
		let talent = Utils.GetAbilityByName(pl_ent, "special_bonus_unique_abaddon_2")
		if (talent !== undefined && talent.m_iLevel !== 0)
			dmg += talent.GetSpecialValue("value")
	}
	if (Utils.GetHealthAfter(pl_ent, mist_coil.m_fCastPoint, false) > dmg)
		return
	let targets = Utils.orderBy (
		Entities.GetEntitiesInRange(pl_ent.m_vecNetworkOrigin, mist_coil.m_iCastRange)
			.filter(ent => ent instanceof C_DOTA_BaseNPC_Hero || ent instanceof C_DOTA_BaseNPC_Creep),
		ent => Utils.GetRotationTime(pl_ent, ent.m_vecNetworkOrigin)
	)
	if (targets.length !== 0)
		Orders.CastTarget(pl_ent, mist_coil, targets[0] as C_DOTA_BaseNPC, false)
})
