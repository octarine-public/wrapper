 import { Base } from "./Extends/Helper"
 import { active,drawTargetParticle, RedT, GreenT, BlueT, TargetCalculator, EzCalc, ProcastCalc, RocketCounter, panel, statusPosX, statusPosY, blinkKey, blinkPart, bootRange, items} from "./MenuManager"
 import { Color, Game, Hero, ParticlesSDK, RendererSDK, Vector2, Vector3,GameSleeper, Utils } from "wrapper/Imports"
 import { Heroes, MouseTarget, MyHero, creeps, towers } from "./Listeners"
 import { ProcastCounter, EZKill, GetEZKillDamage, GetComboDamage, OnlyRocketCount, Manaonerocket, Manaprocast } from "./Module/Calc"
 import InitAbility from "./Extends/Abilities"
 import InitItems from "./Extends/Items"
 import {TinkerStatusText}  from "./Module/status"
import { AddOrUpdateParticle, RemoveParticle } from "../../UnitBlocker/base/DrawParticle"

let targetParticle: number,
	info:Hero[],
	wts: Vector2,
	blinkParticle: number,
	off_x: number,
	off_y: number
	
export function Draw() {
	if (active.value && MyHero !== undefined && MyHero.Team !== 1 && Game.IsInGame )
	{
		let	ItemsInit = new InitItems(MyHero),
			Abilities = new InitAbility(MyHero)
		if (panel.value)//PANNEL
		{
			let w = RendererSDK.WindowSize.x,
			h = RendererSDK.WindowSize.y
			let TinkerPanelX = w / 100 * statusPosX.value
			let TinkerPanelY = h/ 100* statusPosY.value
			let startX = TinkerPanelX
			let startY = TinkerPanelY
			let width =180
			let height = 112
			RendererSDK.FilledRect(new Vector2(startX, startY), new Vector2(width, height), new Color(0, 0, 0, 125))
			RendererSDK.Line(new Vector2(startX, startY), new Vector2(startX, startY+height),Color.Black)//left
			RendererSDK.Line(new Vector2(startX+1, startY+1), new Vector2(startX+1, startY+height-1),new Color(48,48,48,255))
			RendererSDK.Line(new Vector2(startX+width, startY), new Vector2(startX+width, startY+height),Color.Black)//right
			RendererSDK.Line(new Vector2(startX-1+width, startY+1), new Vector2(startX-1+width, startY+height-1),new Color(48,48,48,255))//right
			RendererSDK.Line(new Vector2(startX, startY+height), new Vector2(startX+width, startY+height),Color.Black)//bottom
			RendererSDK.Line(new Vector2(startX+1, startY+height-1), new Vector2(startX+width-1, startY+height-1),new Color(48,48,48,255))//bottom
			//RendererSDK.OutlinedRect(new Vector2(startX, startY), new Vector2(width, height), new Color(10, 10, 10, 255))
			RendererSDK.Text("tinker status: "+TinkerStatusText(), new Vector2(startX+ 14, startY-7), Color.Yellow, "Verdana", 13, FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
			
			RendererSDK.Line(new Vector2(startX+1, startY+1), new Vector2(startX+13, startY+1),new Color(48,48,48,255))//gray top half
			RendererSDK.Line(new Vector2(startX, startY), new Vector2(startX+13, startY),Color.Black)//black top half
			let a =RendererSDK.GetTextSize("tinker status: "+TinkerStatusText(),"Verdana", 13, FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE).x
			
			RendererSDK.Line(new Vector2(startX+a+14, startY), new Vector2(startX+width, startY),Color.Black)//black top half
			RendererSDK.Line(new Vector2(startX+a+15, startY+1), new Vector2(startX+width, startY+1),new Color(48,48,48,255))//gray top half
			if (TinkerStatusText()=="combo" && MouseTarget !== undefined)
				RendererSDK.Image("panorama/images/heroes/icons/"+MouseTarget.Name+"_png.vtex_c", new Vector2(startX+a+14, startY-7),new Vector2(19, 19), new Color(255, 255, 255, 255))
			for (var _i = 0; _i < 4; _i++) {//lines
				RendererSDK.Line(new Vector2(startX+2,startY+height-2-21*(_i+1)), new Vector2(startX+width-2,startY+height-2-21*(_i+1)),Color.Black)//lines black
				RendererSDK.Line(new Vector2(startX+2,startY+1+height-2-21*(_i+1)), new Vector2(startX+width-2,startY+1+height-2-21*(_i+1)),new Color(48,48,48,255))
				
				
		
			}
			RendererSDK.Line(new Vector2(startX+19+5, startY+height-1),new Vector2(startX+19+5, startY+6), new Color(48,48,48,255) )
			RendererSDK.Line(new Vector2(startX+19+6, startY+height-1),new Vector2(startX+19+6, startY+6), Color.Black )
			RendererSDK.Line(new Vector2(startX+90, startY+height-1),new Vector2(startX+90, startY+6), new Color(48,48,48,255) )
			RendererSDK.Line(new Vector2(startX+91, startY+height-1),new Vector2(startX+91, startY+6), Color.Black )
			//RendererSDK.Line(new Vector2(startX+150, startY+height-1),new Vector2(startX+150, startY+6), new Color(48,48,48,255) )
			//RendererSDK.Line(new Vector2(startX+151, startY+height-1),new Vector2(startX+151, startY+6), Color.Black )
			let x = Heroes.filter(e=>e!==MyHero&&e.IsEnemy)
			x.forEach(hero => {
					RendererSDK.Image("panorama/images/heroes/icons/"+hero.Name+"_png.vtex_c", new Vector2(startX+3,startY+height+1-21*(x.indexOf(hero)+1)),new Vector2(19, 19), new Color(255, 255, 255, 255))
					if (Abilities.r !== undefined && Abilities.r.Level>0)
					{
						RendererSDK.Text("x" + ProcastCounter(hero)+" combo",new Vector2(startX+27,startY+height+3-21*(x.indexOf(hero)+1)) ,(MyHero.Mana+MyHero.ManaRegen*ProcastCounter(hero)*(Abilities.r.GetSpecialValue("channel_tooltip")+Abilities.r.CastPoint+0.1)) / (Manaprocast()) >= ProcastCounter(hero) ?  Color.White:Color.RoyalBlue, "Verdana", 13,FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
						RendererSDK.Text("x" + Math.round(OnlyRocketCount(hero)) + " rkts",new Vector2(startX+94,startY+height+3-21*(x.indexOf(hero)+1)) ,Math.ceil(((MyHero.Mana+MyHero.ManaRegen*OnlyRocketCount(hero)*(Abilities.r.GetSpecialValue("channel_tooltip")+Abilities.r.CastPoint+0.1)) / (Manaonerocket() + Abilities.r.ManaCost))) >= OnlyRocketCount(hero) ? Color.Green : Color.RoyalBlue, "Verdana", 13,FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
						
						if (ItemsInit.Ethereal!==undefined&&ItemsInit.Dagon!==undefined)
						{
							let ezCol:Color
							if (EZKill(hero))
							{
								if (MyHero.Mana>((ItemsInit.Dagon!==undefined)?ItemsInit.Dagon.ManaCost:0) + (ItemsInit.Ethereal!==undefined?ItemsInit.Ethereal.ManaCost:0)+(ItemsInit.Discord!==undefined?ItemsInit.Discord.ManaCost:0))
								{
									ezCol =  Color.Green
								}
								else
								{
									ezCol = Color.RoyalBlue
								}
							}
							else
							{
								ezCol = Color.Red
							}
							RendererSDK.Text(EZKill(hero) ? " EZ":"",new Vector2(startX+3,startY+height+1-21*(x.indexOf(hero)+1)),ezCol,"Verdana", 13,FontFlags_t.DROPSHADOW||FontFlags_t.OUTLINE)
						}
				}
				})
				
			
			
		}
	}
	if (!Base.IsRestrictions(active) || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME) {//particles&&mousetarget
		return false
	}
	if (MyHero === undefined || !MyHero.IsAlive)
	{
		return false
	}
	let	ItemsInit = new InitItems(MyHero),
		Abilities = new InitAbility(MyHero),
		info =  Heroes.filter(npc => npc.IsAlive && npc.IsVisible && npc.IsEnemy()),
		screen_size = RendererSDK.WindowSize,
		ratio = RendererSDK.GetAspectRatio()
	if (drawTargetParticle.value) {
		if (targetParticle === undefined && MouseTarget !== undefined) {
			targetParticle = ParticlesSDK.Create("materials/target.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, MouseTarget)
		}
		if (targetParticle !== undefined) {
			if (MouseTarget === undefined) {
				ParticlesSDK.Destroy(targetParticle, true)
				targetParticle = undefined
			} else {
				ParticlesSDK.SetControlPoint(targetParticle,2, MyHero.Position)
				ParticlesSDK.SetControlPoint(targetParticle,5, new Vector3(RedT.value, GreenT.value, BlueT.value))
				ParticlesSDK.SetControlPoint(targetParticle,6, new Vector3(1))
				ParticlesSDK.SetControlPoint(targetParticle,7, MouseTarget.Position)
			}
		}
	}


	if (ratio==="16x9") {//ratio
		off_x = screen_size.x * -0.027
		off_y = screen_size.y * -0.01715
	} else if (ratio==="16x10") {
		off_x = screen_size.x * -0.03095
		off_y = screen_size.y * -0.01715
	}else if(ratio==="21x9") {
		off_x = screen_size.x * -0.020
		off_y = screen_size.y * -0.01715
	} else {
		off_x = screen_size.x * -0.038
		off_y = screen_size.y * -0.01715
	}

	if (info.length>0 && (TargetCalculator.value||RocketCounter.value)&&Abilities.r.Level>0)//ALL TARGETS DRAW
		{
		info.forEach(hero => {
			if (hero.IsAlive && hero.IsVisible)
			{
			wts = RendererSDK.WorldToScreen(hero.Position.AddScalarZ(hero.HealthBarOffset))
			if (wts!==undefined)
			{
			wts.AddScalarX(off_x).AddScalarY(off_y)
			if (TargetCalculator.value)
				RendererSDK.Text("x" + ProcastCounter(hero), wts.Add(new Vector2(-24, -13)),(MyHero.Mana+MyHero.ManaRegen*ProcastCounter(hero)*(Abilities.r.GetSpecialValue("channel_tooltip")+Abilities.r.CastPoint+0.1)) / (Manaprocast()) >= ProcastCounter(hero) ?  Color.White:Color.RoyalBlue, "Verdana", 14, FontFlags_t.OUTLINE)
			if (RocketCounter.value)
				RendererSDK.Text("          x" + Math.round(OnlyRocketCount(hero)) + " rkts", wts.Add(new Vector2(65,0)),Math.ceil(((MyHero.Mana+MyHero.ManaRegen*OnlyRocketCount(hero)*(Abilities.r.GetSpecialValue("channel_tooltip")+Abilities.r.CastPoint+0.1)) / (Manaonerocket() + Abilities.r.ManaCost))) >= OnlyRocketCount(hero) ? Color.Green : Color.RoyalBlue, "Verdana", 14, FontFlags_t.OUTLINE)
			}
		}
			});
		}
	if (MouseTarget!==undefined &&MouseTarget.IsVisible)//MOUSE TARGET DRAW
	{
		wts = RendererSDK.WorldToScreen(MouseTarget.Position.AddScalarZ(MouseTarget.HealthBarOffset))
		wts.AddScalarX(off_x).AddScalarY(off_y)
		if (EzCalc.value&&ItemsInit.Ethereal!==undefined&&ItemsInit.Dagon!==undefined)
		{
			let ezCol:Color
			if (EZKill(MouseTarget))
			{
				if (MyHero.Mana>((ItemsInit.Dagon!==undefined)?ItemsInit.Dagon.ManaCost:0) + (ItemsInit.Ethereal!==undefined?ItemsInit.Ethereal.ManaCost:0)+(ItemsInit.Discord!==undefined?ItemsInit.Discord.ManaCost:0))
				{
					ezCol =  Color.Green
				}
				else
				{
					ezCol = Color.RoyalBlue
				}
			}
			else
			{
				ezCol = Color.Red
			}
			RendererSDK.Text(EZKill(MouseTarget) ? "e+d "+(GetEZKillDamage(MouseTarget)/MouseTarget.HP*100).toFixed(1)+" % EZ" : "e+d "+(GetEZKillDamage(MouseTarget)/MouseTarget.HP*100).toFixed(1)+" %",wts.Add(new Vector2(0,-50)),ezCol,"Verdana", 14, FontFlags_t.OUTLINE)
		}
		if (ProcastCalc.value)
		{
			let comCol:Color
			let a:String
			if (MouseTarget.HP < (GetComboDamage()))
			{
				if (MyHero.Mana>Manaprocast())
				{
					comCol = Color.Green
				}
				else
				{
					comCol = Color.RoyalBlue
				}
			}
			else
			{
				comCol = Color.Red
			}
			a = ((GetComboDamage())/MouseTarget.HP*100<101)?((GetComboDamage())/MouseTarget.HP*100).toFixed(1)+ "%":"100%kill"
			RendererSDK.Text("com "+a , wts.Add(new Vector2(0,-35)), comCol, "Verdana", 14, FontFlags_t.OUTLINE)
		}
		//if (hitcounter.value)
		//	RendererSDK.Text(HitCount(MouseTarget)+" hits", wts.Add(new Vector2(117,-13)), (HitCount(MouseTarget)<=1)?Color.Green:Color.White, "Verdana", 14, FontFlags_t.OUTLINE)
		

	}
	if (blinkKey.is_pressed && blinkPart)
	{
		AddOrUpdateParticle("blink", MyHero, Utils.CursorWorldVec, 125)
	}
	else
	{
		RemoveParticle("blink", MyHero)
	}
	
	if (bootRange&&MyHero.HasModifier("modifier_teleporting")&&ItemsInit.Tpboot!==undefined)
	{
		let a = creeps.find(e=>e.Team == MyHero.Team && e.HasModifier("modifier_boots_of_travel_incoming"))
		if (a!==undefined)
		{
		AddOrUpdateParticle("tprange", MyHero, a.NetworkPosition, ItemsInit.Blink.GetSpecialValue("blink_range") + MyHero.CastRangeBonus)
		}
	}
	else
	{
		RemoveParticle("tprange", MyHero)
	}

	towers.forEach(e => {
		if (e.HasModifier("modifier_boots_of_travel_incoming"))
		{
			console.log("yes")
		}
	});
	

	
}

