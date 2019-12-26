
import { ArrayExtensions, Creep, EventsSDK, Game, Hero, LocalPlayer, Menu as MenuSDK, RendererSDK, Unit, Utils, DOTAGameUIState_t, Vector2, Color, FontFlags_t } from "../wrapper/Imports"

const Menu = MenuSDK.AddEntry(["Utility", "Auto LastHit"])
const hotkey = Menu.AddKeybind("Hotkey")
const hotkey_style = Menu.AddSwitcher("Key Style", ["Hold key", "Turn on / Turn off"])
const creep_hp_offset = Menu.AddSlider("Creep HP offset", 15, -15)
const melee_time_offset = Menu.AddSliderFloat("Melee attack time offset", -0.2, -0.2)
const delay_multiplier = Menu.AddSliderFloat("Melee attack time offset", -2.5, -2.5)


const draw = Menu.AddNode("Drawing")
const glow_enabled = draw.AddToggle("Glow mode", true)
const glow_finder_range = draw.AddSlider("Glow finder range", 0, 0, 1500)
const glow_only = draw.AddToggle("Glow only", false)
const draw_text = draw.AddNode("Text")
const draw_status = draw_text.AddToggle("Status text")
const draw_size = draw_text.AddSlider("Text size", 18, 12, 60)
const draw_statusX = draw_text.AddSlider("Position X", 8, 0, 100)
const draw_statusY = draw_text.AddSlider("Position Y", 2, 0, 100)
const mode = Menu.AddSwitcher("Mode", [
	"None",
	"Lasthit",
	"Deny",
	"Both",
])
hotkey.OnRelease(() => Key = !Key)

enum AutoLH_Mode {
	LASTHIT = 1,
	DENY,
	BOTH,
}
let Key = false
let block_orders = false
let glow_ents: Creep[] = []
let glow_ents_old: Creep[] = []
let attackable_ents: Creep[] = []

let HasAttackCapability = (ent: Unit, flag?: DOTAUnitAttackCapability_t) => {
	let attackCap = ent.m_pBaseEntity.m_iAttackCapabilities
	if (flag !== undefined)
		return (attackCap & flag) === flag
	return (attackCap & (
		DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_MELEE_ATTACK |
		DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK)
	) === flag
}

function GetProjectileDelay(source: Unit, target: Unit) {
	if (!HasAttackCapability(source, DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK))
		return 0
	let proj_speed = source instanceof Unit ? source.AttackProjectileSpeed !== 0 ? source.AttackProjectileSpeed : 0 : 900
	if (proj_speed === undefined)
		return 0
	return (source.Position.Distance(target.Position) - source.HullRadius - target.HullRadius) / proj_speed
}

function EnoughDamage(sender: Hero, target: Unit): boolean {
	let delay = sender.SecondsPerAttack + GetProjectileDelay(sender, target) + sender.GetRotationTime(target.Position) / 1000
	return target.CalculateDamageByHand(sender) > Utils.GetHealthAfter(target, delay, true, false, sender, melee_time_offset.value) - creep_hp_offset.value
}
function RenderIcon(position_unit: Vector2, path_icon: string) {
	RendererSDK.Image(
		path_icon,
		position_unit.SubtractScalar(23 / 4).Clone().AddScalarY(-50).AddScalarX(-10),
		new Vector2(42 / 2, 42 / 2), Color.Green
	)
}
EventsSDK.on("Draw", () => {
	if ((hotkey_style.selected_id === 1 && !Key) || (hotkey_style.selected_id === 0 && !hotkey.is_pressed) || !Game.IsInGame) {
		return
	}
	if (Key) {
		if (Game.UIState === DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME && draw_status.value) {
			let wSize = RendererSDK.WindowSize,
				pos = new Vector2(
					wSize.x / 100 * draw_statusX.value,
					wSize.y / 100 * draw_statusY.value,
				)
			RendererSDK.Text(
				"Auto LastHit enabled",
				pos,
				Color.White,
				"Verdana",
				draw_size.value,
				FontFlags_t.ANTIALIAS,
			)
		}
	} else {
		glow_ents_old = glow_ents
		glow_ents = []
	}
	glow_ents_old.filter(ent => ent.IsValid && !glow_ents.includes(ent)).forEach(ent => {
		ent.m_pBaseEntity.m_bSuppressGlow = true
		ent.m_pBaseEntity.m_Glow.m_bGlowing = false
		ent.m_pBaseEntity.m_Glow.m_iGlowType = 0
	})
	glow_ents.filter(ent => ent.IsValid).forEach(ent => {
		let position_unit = RendererSDK.WorldToScreen(ent.Position.AddScalarZ(ent.HealthBarOffset))
		if (position_unit !== undefined)
			RenderIcon(position_unit, `panorama/images/icon_star_png.vtex_c`)
		ent.m_pBaseEntity.m_bSuppressGlow = false
		ent.m_pBaseEntity.m_Glow.m_bFlashing = false
		ent.m_pBaseEntity.m_Glow.m_bGlowing = true
		ent.m_pBaseEntity.m_Glow.m_iGlowType = 1
		IOBuffer[0] = 255
		IOBuffer[1] = IOBuffer[2] = 0
		ent.m_pBaseEntity.m_Glow.m_glowColorOverride = true
	})
	glow_ents_old = glow_ents
})

EventsSDK.on("Tick", () => {
	if ((hotkey_style.selected_id === 1 && !Key) || (hotkey_style.selected_id === 0 && !hotkey.is_pressed)) {
		return
	}
	let pl_ent = LocalPlayer!.Hero
	if (pl_ent === undefined || !pl_ent.IsAlive)
		return
	let attack_range = pl_ent.AttackRange * (pl_ent.HasAttackCapability(DOTAUnitAttackCapability_t.DOTA_UNIT_CAP_RANGED_ATTACK) ? 1 : 1.5) + pl_ent.HullRadius,
		max_range = Math.max(attack_range, glow_finder_range.value)
	// loop-optimizer: FORWARD
	let filtered = ArrayExtensions.orderBy((attackable_ents.filter(ent => {
		if (!ent.IsAlive || !ent.IsVisible)
			return false
		let use_enemy = mode.selected_id === AutoLH_Mode.LASTHIT || mode.selected_id === AutoLH_Mode.BOTH,
			use_ally = mode.selected_id === AutoLH_Mode.DENY || mode.selected_id === AutoLH_Mode.BOTH
		if (use_enemy && ent.IsEnemy(pl_ent))
			return true
		if (use_ally && !ent.IsEnemy(pl_ent) && ent.IsDeniable)
			return true
		return false
	}).map(ent => [ent, ent.Position.Distance2D(pl_ent!.Position)]) as Array<[Creep, number]>).filter(([ent, dist]) => dist <= max_range).filter(([ent, dist]) => EnoughDamage(pl_ent!, ent)), ([creep]) => creep.HP)
	glow_ents = (glow_enabled.value && glow_finder_range.value !== 0 ? filtered.filter(([ent, dist]) => dist <= glow_finder_range.value) : filtered).map(a => a[0])
	if (!glow_only.value && !block_orders) {
		let ent_pair = filtered.filter(([ent, dist]) => dist <= (attack_range + ent.HullRadius))[0]
		if (ent_pair === undefined)
			return
		let ent = ent_pair[0]
		pl_ent.AttackTarget(ent, false)
		block_orders = true
		let done = false
		let data = setInterval(in_data => {
			if (!ent.IsValid || !ent.IsAlive) {
				block_orders = false
				done = true
				in_data.Destroy()
			}
		}, 30)
		setTimeout(() => {
			if (!done) {
				data.Destroy()
				block_orders = false
				done = true
			}
		}, pl_ent.SecondsPerAttack * 1000 - (pl_ent.AttackPoint * delay_multiplier.value))
	}
})
EventsSDK.on("EntityCreated", npc => {
	if (npc instanceof Creep)
		attackable_ents.push(npc)
})
EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Creep)
		ArrayExtensions.arrayRemove(attackable_ents, ent)
})
EventsSDK.on("PrepareUnitOrders", order => (hotkey.is_pressed || Key) && !glow_only.value ? Utils.OrdersWithoutSideEffects.includes(order.OrderType) || !block_orders : true)
EventsSDK.on("GameEnded", () => glow_ents = glow_ents_old = [])
