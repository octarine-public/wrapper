import { Base } from "./Extends/Helper"
import {
	Radius,
	BlinkRadiusItemColor,
	AttackRangeRadius,
	RadiusColorAttackRange,
	DrawingtargetStateShot,
	AutoComboDisableWhen, AutoComboState, AutoDisableState, ComboKey,
	ComboStartWith, ConShotPoaitionPosShot, DrawingtargetState,
	SmartArcaneAutoBoltState, State, TextItem,
	TextSize, TextXItem, TextYItem,
	ArcaneBoltRadiusColor,
	MysticFlareRadiusColor,
	AncientSealRadiusColor,
	ConcussiveShotRadiusColor,
	StyleCombo
} from "./Menu"
import { Color, Game, LocalPlayer, RendererSDK, Vector2, FontFlags_t, DOTAGameUIState_t } from "wrapper/Imports"
import { MouseTarget, MyHero, initDrawMap, initItemsMap, initAbilityMap } from "./Listeners"
import { ComboActived } from "./Module/Combo"

export function Draw() {
	if (!Base.IsRestrictions(State) || LocalPlayer === undefined || LocalPlayer.IsSpectator || MyHero === undefined)
		return

	let Particle = initDrawMap.get(MyHero),
		Items = initItemsMap.get(MyHero),
		Abilities = initAbilityMap.get(MyHero)

	if (Items === undefined || Abilities === undefined || Particle === undefined)
		return

	Particle.RenderLineTarget(Base, DrawingtargetState, State, MouseTarget)
	Particle.RenderAttackRange(State, AttackRangeRadius, MyHero.AttackRange, RadiusColorAttackRange.Color)
	Particle.RenderConShot(Abilities.ConcussiveShot, ConShotPoaitionPosShot, DrawingtargetStateShot)
	Particle.Render(Abilities.ArcaneBolt, Abilities.ArcaneBolt.Name, Abilities.ArcaneBolt.CastRange, Radius, State, ArcaneBoltRadiusColor.Color)
	Particle.Render(Abilities.AncientSeal, Abilities.AncientSeal.Name, Abilities.AncientSeal.CastRange, Radius, State, AncientSealRadiusColor.Color)
	Particle.Render(Abilities.MysticFlare, Abilities.MysticFlare.Name, Abilities.MysticFlare.CastRange, Radius, State, MysticFlareRadiusColor.Color)
	Particle.Render(Items.Blink, "item_blink", Items.Blink && Items.Blink.AOERadius + MyHero.CastRangeBonus, Radius, State, BlinkRadiusItemColor.Color)
	Particle.RenderConShotRadius(Abilities.ConcussiveShot, Radius, State, ConcussiveShotRadiusColor.Color)

	if (Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME || !TextItem.value)
		return

	let Combo = (StyleCombo.selected_id === 1 && ComboActived) || (StyleCombo.selected_id === 0 && ComboKey.is_pressed),
		autoArcaneBolt = !Combo && SmartArcaneAutoBoltState.value,
		AutoCombo = AutoComboState.value && (!AutoComboDisableWhen.value || !Combo),
		AutoDisable = !Combo && AutoDisableState.value

	let wSize = RendererSDK.WindowSize,
		text: [string, boolean, boolean][] = [
			["Combo: ", Combo, true],
			["Auto Bolt: ", autoArcaneBolt, true],
			["Start Mute: ", ComboStartWith.value, false],
			["Auto Combo: ", AutoCombo, true],
			["Auto Disable: ", AutoDisable, true],
		]

	let i = 0
	// loop-optimizer: KEEP
	text.forEach(([name, value, render_disabled]) => {
		if (!render_disabled && !value)
			return
		let pos = new Vector2(
			wSize.x / 100 * TextXItem.value,
			wSize.y / 100 * TextYItem.value + (i * TextSize.value),
		)
		RendererSDK.Text(
			name,
			pos,
			new Color(255, 255, 255, 255),
			"Consoles",
			TextSize.value,
			FontFlags_t.ANTIALIAS,
		)
		RendererSDK.Text(
			value ? "ON" : "OFF",
			pos.AddScalarX(RendererSDK.GetTextSize(name, "Consoles", TextSize.value, FontFlags_t.ANTIALIAS).x),
			new Color(value ? 0 : 255, value ? 255 : 0, 0, 255),
			"Consoles",
			TextSize.value,
			FontFlags_t.ANTIALIAS,
		)
		i++
	})
}
