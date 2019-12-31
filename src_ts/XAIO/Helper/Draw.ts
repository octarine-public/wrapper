import { Unit, LocalPlayer, Menu, ParticlesSDK, Vector3, Color, Hero, Ability } from "wrapper/Imports"

let circleParticles = new Map<string, number>()
let lineDotParticles = new Map<string, number>()
let circleParticlesTempRange = new Map<number, number>()

export class Draw {
	constructor(public unit: Unit) { }

	private get IsOwnerValid(): boolean {
		return LocalPlayer !== undefined && !LocalPlayer.IsSpectator && this.unit !== undefined
	}

	public Render(
		Items: Ability,
		name: string,
		Range: number,
		Selector: Menu.ImageSelector,
		State: Menu.Toggle,
		Colors?: Color,
		InfrontUnit?: Vector3
	) {
		Items && Selector.IsEnabled(name) && this.unit.IsAlive && State.value
			? this.DrawParticle(name, Range, Colors, InfrontUnit)
			: this.RemoveParticle(name)
	}
	/**
	 * Line particle at your hero to Unit enemy
	 * @param Base | Base Class Helper
	 * @param Drawing | Toogle
	 * @param State | Toogle
	 * @param target | target enemy
	 */
	public RenderLineTarget(Base: any, Drawing: Menu.Toggle, State: Menu.Toggle, target: Hero) {
		return Drawing.value ? this.UpdateLineDot("catch_target", Base, State, target) : this.RemoveParticle("catch_target")
	}
	/**
	 * Attack Range Unit
	 * @param State | Turn off/on Toogle Base
	 * @param Drawing | Turn off/on Toggle
	 * @param Range | Radius
	 * @param Colors | Color default 255, 255, 0
	 */
	public RenderAttackRange(State: Menu.Toggle, Drawing: Menu.Toggle, Range: number, Colors: Color = Color.Yellow) {
		return this.unit.IsAlive && State.value && Drawing.value
			? this.DrawParticle("AttackRange_" + this.unit.Index, Range + this.unit.HullRadius, Colors)
			: this.RemoveParticle("AttackRange_" + this.unit.Index)
	}
	/**
	 * Particle Circle AOE Radius on Unit
	 * @param name | Name string for destroyer
	 * @param range | AOE Radius
	 * @param Colors | undefined | Color default 255, 255, 255
	 * @param InfrontUnit | undefined | InfrontUnit
	 * @param callback | Function Custom SetControlPoint and Create, return particleid from DrawBase class
	 * @example
	 * UpdateCircle("item_blink", 1200, new Color(255, 255, 255))
	 * @example
	 * UpdateCircle("item_blink", 1200, new Color(255, 255, 255), unit.Infront(200),
	 * (parricle) => {
	 * 		ParticlesSDK.SetControlPoint(particle, 1, new Vector3(Colors.r, Colors.g, Colors.b))
	 * })
	 */
	public DrawParticle(
		name: string,
		range: number,
		Colors: Color = Color.White,
		InfrontUnit?: Vector3,
		callback?: (par_id: number) => void,
		path: string = "particles/ui_mouseactions/drag_selected_ring.vpcf",
		attach: ParticleAttachment_t = ParticleAttachment_t.PATTACH_ABSORIGIN,
		unit?: Unit
	) {
		if (!this.IsOwnerValid)
			return

		let particle = circleParticles.get(name)
		if (particle === undefined) {

			particle = !callback
				? ParticlesSDK.Create(path, attach, this.unit)
				: ParticlesSDK.Create(path, attach, unit)

			if (particle === undefined)
				return

			circleParticles.set(name, particle)
			circleParticlesTempRange.set(range, particle)
		}

		if (!circleParticlesTempRange.has(range)) {
			this.RemoveParticle(name)
			circleParticlesTempRange.clear()
			return
		}
		if (name !== undefined) {
			if (callback === undefined) {
				ParticlesSDK.SetControlPoint(particle, 1, new Vector3(Colors.r, Colors.g, Colors.b))
				ParticlesSDK.SetControlPoint(particle, 2, new Vector3(range * 1.114, 255, 0))
				ParticlesSDK.SetControlPoint(particle, 0, InfrontUnit === undefined ? this.unit.Position : InfrontUnit)
			} else {
				callback(particle)
			}
		}
	}
	/**
	 * Particle Destroy
	 * @param name | Name particle string for destroyer
	 * @example RemoveParticle("item_blink")
	 */
	public RemoveParticle(name: string) {
		if (!this.IsOwnerValid)
			return

		let particle = circleParticles.get(name)
		if (particle !== undefined) {
			ParticlesSDK.Destroy(particle, true)
			circleParticles.delete(name)
		}
		let _particle = lineDotParticles.get(name)
		if (_particle !== undefined) {
			ParticlesSDK.Destroy(_particle, true)
			lineDotParticles.delete(name)
		}

	}

	private UpdateLineDot(name: string, Base: any, State: Menu.Toggle, target: Hero) {
		if (!this.IsOwnerValid)
			return

		let particle = lineDotParticles.get(name)
		if (particle === undefined && target !== undefined) {
			particle = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, target)
			ParticlesSDK.SetControlPoint(particle, 6, new Vector3(1))
			lineDotParticles.set(name, particle)
		}

		if (lineDotParticles.has(name)) {
			if (target !== undefined && this.unit.IsAlive && Base.IsRestrictions(State)) {
				if (particle === undefined)
					return
				ParticlesSDK.SetControlPoint(particle, 2, this.unit.Position)
				ParticlesSDK.SetControlPoint(particle, 7, target.Position)

			} else this.RemoveParticle(name)
		}
	}
}

EventsSDK.on("GameEnded", () => {
	circleParticles.clear()
	lineDotParticles.clear()
	circleParticlesTempRange.clear()
})