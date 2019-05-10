import * as Orders from "Orders"
import * as Utils from "Utils"
import { Combo, EComboAction } from "wrapper/Combo"

var combo = new Combo(),
	config = {
		hotkey: 0,
	},
	executing = false

function Invoke(abil_name: string) {
	combo.addDelay(caster => Utils.GetAbilityByName(caster, "invoker_invoke").m_fCooldown !== 0 ? -1 : 30, {
		castCondition: (abil, caster, ent) => Utils.GetAbilityByName(caster, abil_name).m_bHidden,
	})
	combo.addAbility("invoker_invoke", EComboAction.NO_TARGET, {
		castCondition: (abil, caster, ent) => {
			return Utils.GetAbilityByName(caster, abil_name).m_bHidden
		},
	})
	combo.addDelay(caster => {
		// console.log(`${abil_name}: ${caster.GetAbilityByName(abil_name).m_bHidden}`)
		return Utils.GetAbilityByName(caster, abil_name).m_bHidden ? -1 : 30
	})
}

// TODO: add support to not cast excessive spheres
function PrepareSpheres(str: string, abil_name?: string) {
	for (let i of str) {
		switch (i) {
			case "q":
			case "Q":
				combo.addAbility("invoker_quas", EComboAction.NO_TARGET, {
					castCondition: (abil, caster, ent) => abil_name === undefined || Utils.GetAbilityByName(caster, abil_name).m_bHidden,
				})
				break
			case "w":
			case "W":
				combo.addAbility("invoker_wex", EComboAction.NO_TARGET, {
					castCondition: (abil, caster, ent) => abil_name === undefined || Utils.GetAbilityByName(caster, abil_name).m_bHidden,
				})
				break
			case "e":
			case "E":
				combo.addAbility("invoker_exort", EComboAction.NO_TARGET, {
					castCondition: (abil, caster, ent) => abil_name === undefined || Utils.GetAbilityByName(caster, abil_name).m_bHidden,
				})
				break
			default:
				throw new Error("Unknown key: " + i)
		}
		combo.addDelay(30)
	}
}

PrepareSpheres("eee", "invoker_sun_strike")
Invoke("invoker_sun_strike")
PrepareSpheres("eew", "invoker_chaos_meteor")
Invoke("invoker_chaos_meteor")
PrepareSpheres("qwe", "invoker_deafening_blast")
combo.addAbility("item_veil_of_discord", EComboAction.CURSOR_ENEMY)
combo.addAbility("item_cyclone", EComboAction.CURSOR_ENEMY)
combo.addDelay(30)
combo.addDelay((caster, target) => {
	let eul_buff = Utils.GetBuffByName(target, "modifier_eul_cyclone")
	if (eul_buff === undefined) return -1
	return (eul_buff.m_flDieTime - GameRules.m_fGameTime - Utils.GetAbilityByName(caster, "invoker_sun_strike").GetSpecialValue("delay")) * 1000 + 30
})
combo.addAbility("invoker_sun_strike", EComboAction.CURSOR_ENEMY)
combo.addDelay((caster, target) => {
	let eul_buff = Utils.GetBuffByName(target, "modifier_eul_cyclone")
	if (eul_buff === undefined) return -1
	return (eul_buff.m_flDieTime - GameRules.m_fGameTime - Utils.GetAbilityByName(caster, "invoker_chaos_meteor").GetSpecialValue("land_time")) * 1000 + 30
})
combo.addAbility("custom_cast", EComboAction.CURSOR_ENEMY, {
	custom_cast: (caster, target) => {
		let meteor = Utils.GetAbilityByName(caster, "invoker_chaos_meteor"),
			dist = caster.m_vecNetworkOrigin.Distance2D(target.m_vecNetworkOrigin),
			pos = target.m_vecNetworkOrigin.Extend(caster.m_vecNetworkOrigin, Math.min(dist - 2, meteor.GetSpecialValue("area_of_effect")))
		combo.vars.meteor_cast_position = pos
		Orders.CastPosition(caster, meteor, pos, false)
		return meteor.m_fCastPoint * 1000 + 30
	},
})
Invoke("invoker_deafening_blast")
PrepareSpheres("qqq", "invoker_cold_snap")
combo.addDelay((caster, target) => {
	let eul_buff = Utils.GetBuffByName(target, "modifier_eul_cyclone")
	if (eul_buff === undefined) return -1
	let travel_time = combo.vars.travel_time = combo.vars.travel_time || caster.m_vecNetworkOrigin.Distance2D(target.m_vecNetworkOrigin) / Utils.GetAbilityByName(caster, "invoker_deafening_blast").GetSpecialValue("travel_speed")
	return (eul_buff.m_flDieTime - GameRules.m_fGameTime > travel_time) ? -1 : 0
})
combo.addAbility("invoker_deafening_blast", EComboAction.CURSOR_ENEMY)
combo.addDelay((caster, target) => Utils.GetBuffByName(target, "modifier_eul_cyclone") !== undefined ? -1 : 0)
combo.addAbility(/item_(orchid|bloodthorn)/, EComboAction.CURSOR_ENEMY)
combo.addAbility("item_ethereal_blade", EComboAction.CURSOR_ENEMY)
combo.addAbility(/item_dagon/, EComboAction.CURSOR_ENEMY)
combo.addAbility(/item_(urn_of_shadows|spirit_vessel)/, EComboAction.CURSOR_ENEMY)
Invoke("invoker_cold_snap")
combo.addAbility("invoker_cold_snap", EComboAction.CURSOR_ENEMY)
PrepareSpheres("eee") // just for damage
/*PrepareSpheres("eeq", "invoker_forge_spirit")
combo.addAbility("invoker_cold_snap", EComboAction.CURSOR_ENEMY)
Invoke("invoker_forge_spirit")
PrepareSpheres("wwe", "invoker_alacrity")
combo.addAbility("invoker_forge_spirit", EComboAction.NO_TARGET)
Invoke("invoker_alacrity")
PrepareSpheres("eee") // just for damage
combo.addAbility("invoker_alacrity", EComboAction.SELF)*/

Events.on("onWndProc", (message_type, wParam) => {
	if (executing || !IsInGame() || parseInt(wParam as any) !== config.hotkey)
		return true
	if (message_type === 0x100) { // WM_KEYDOWN
		executing = true
		combo.execute(LocalDOTAPlayer.m_hAssignedHero as C_DOTA_BaseNPC, () => executing = false)
		return false
	}
	return true
})

{
	let root = new Menu_Node("Invoker Combo")
	root.entries.push(new Menu_Keybind (
		"Hotkey",
		config.hotkey,
		node => config.hotkey = node.value,
	))
	root.Update()
	Menu.AddEntry(root)
}
