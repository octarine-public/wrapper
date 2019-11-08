import { Unit, ParticlesSDK, Vector3, Menu, Ability, ArrayExtensions, Color } from "wrapper/Imports"
import { DrawBase } from "../../Base/DrawBase"
import { Heroes } from "../Listeners"
export default class Draw extends DrawBase {
	constructor(unit?: Unit) {
		super(unit)
	}
	public UpdateConShot(name: string, enemy: Unit, PosShot: Menu.Slider) {
		this.DrawParticle(name, 0, undefined, undefined, (particle: number) => {
			let pos = enemy.Position
			pos.AddScalarZ(PosShot.value)
			ParticlesSDK.SetControlPoint(particle, 0, pos)
			ParticlesSDK.SetControlPoint(particle, 1, pos)
			ParticlesSDK.SetControlPoint(particle, 2, new Vector3(3000))
		}, "particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN)
	}
	public RenderConShot(ability: Ability, PosShot: Menu.Slider, State: Menu.Toggle) {
		let Enemy = ArrayExtensions.orderBy(
			Heroes.filter(
				x => x.IsEnemy()
					&& x.IsAlive && x.IsVisible
					&& x.Distance(this.unit) <= ability.CastRange
			), ent => ent.Distance(this.unit)
		)[0]
		Enemy !== undefined && State.value && ability.IsReady
			? this.UpdateConShot(ability.Name + "_" + this.unit, Enemy, PosShot)
			: this.RemoveParticle(ability.Name + "_" + this.unit)
	}
	public RenderConShotRadius(ability: Ability, Selector: Menu.ImageSelector, State: Menu.Toggle, Colors: Color) {
		ability.CastRange !== 0
			? this.Render(ability, ability.Name, ability.CastRange, Selector, State, Colors)
			: this.RemoveParticle(ability.Name)
	}
}