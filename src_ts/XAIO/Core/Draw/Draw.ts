import { XAIOEvents } from "../Events/Events"
import { Unit, LocalPlayer, Menu, ParticlesSDK, Vector3, Color, Ability, EventsSDK, Particle, ArrayExtensions, Item, Hero, RendererSDK, Vector2 } from "wrapper/Imports"

export let XAIOparKey: Map<Unit, Particle[]> = new Map()

export default class XAIOParticle {

	constructor(public unit?: Unit) { }

	private get IsOwnerValid(): boolean {
		return LocalPlayer !== undefined
			&& LocalPlayer.Hero !== undefined
			&& !LocalPlayer.IsSpectator
			&& this.unit !== undefined
	}

	public DrawCircle(
		abil: string,
		patern_name: string,
		range_radius: number = 0,
		selector?: Nullable<Menu.ImageSelector>,
		colors: Color = Color.White,
		renderStyle: number = 0,
		width: number = 10,
		infrontUnit: Vector3 = new Vector3
	) {
		if (!this.IsOwnerValid || !this.unit!.IsAlive || (selector !== undefined && !selector.IsEnabled(abil))) {
			this.RemoveParticle(patern_name)
			return
		}

		return this.RenderCircle(patern_name, range_radius, width, renderStyle, colors, infrontUnit)
	}

	public RenderCircle(
		name: string,
		range: number = 0,
		width: number = 10,
		renderStyle: number = 0,
		Colors: Color = Color.White,
		infrontUnit: Vector3 = new Vector3
	) {
		if (!this.IsOwnerValid)
			return
		return ParticlesSDK.DrawCircle(name + "_" + this.unit, this.unit!, range, {
			Width: width,
			Color: Colors,
			Position: infrontUnit.IsZero ? this.unit : infrontUnit,
			RenderStyle: renderStyle,
		})
	}

	public RenderAbilityItems(
		class_abilityItems: Constructor<Ability>[],
		RadiusesSelector: Menu.ImageSelector,
		XAIORangeRadiusesStyle: Menu.Switcher,
		changeColor: (abil: Ability, defColor: Color) => Color
	) {
		if (!this.IsOwnerValid)
			return

		class_abilityItems.forEach(class_name => {
			let abil = this.unit!.GetAbilityByClass(class_name) ?? this.unit!.GetItemByClass(class_name as Constructor<Item>)

			let nameAbil = class_name.name

			if (abil === undefined) {
				this.RemoveParticle(this.unit + nameAbil)
				return
			}

			let Radius = abil.CastRange

			if (Radius <= 0)
				Radius = abil.AOERadius

			if (Radius <= 0 || Radius === Number.MAX_SAFE_INTEGER)
				return

			let par = this.DrawCircle(
				nameAbil,
				this.unit + nameAbil,
				Radius,
				RadiusesSelector,
				changeColor(abil, Color.Red),
				XAIORangeRadiusesStyle.selected_id
			)

			if (par === undefined)
				return

			this.addPartToUnit(par!)
		})
	}

	public DrawAttackRange(stateDraw: Menu.Toggle, color: Color, swither: Menu.Switcher): Nullable<Particle> {
		if (!this.IsOwnerValid)
			return
		if (!this.unit!.IsAlive || !stateDraw.value) {
			this.RemoveParticle("attack_range")
			return
		}
		return this.DrawCircle("attack_range", "attack_range", this.unit!.AttackRange, undefined, color, swither.selected_id)
	}

	public RenderLineTarget(stateDraw: Menu.Toggle, enemy: Nullable<Unit>, color: Color) {
		if (!this.IsOwnerValid)
			return
		if (!stateDraw.value || !this.unit!.IsAlive || enemy === undefined) {
			ParticlesSDK.Remove(this.unit + "_target")
			return
		}
		return ParticlesSDK.DrawLineToTarget(this.unit + "_target", this.unit!, enemy, color)
	}

	public RenderConShot(State: Menu.Toggle, ability: Ability, PosShot: Menu.Slider, Units: Unit[]) {
		if (!this.IsOwnerValid)
			return
		let Enemy: Unit = ArrayExtensions.orderBy(Units.filter(
			x => x.IsEnemy() && x.IsVisible
				&& x.IsHero && x.IsAlive && x.Distance(this.unit!) <= (ability.CastRange === Number.MAX_SAFE_INTEGER ? 3000 : ability.CastRange)
		), ent => ent.Distance(this.unit!))[0]

		if (Enemy === undefined || !this.unit!.IsAlive || !State.value || !Enemy.IsVisible || !ability.CanBeCasted())
			return this.RemoveParticle(ability.Name + ability.Index)

		return this.CreateConShot(ability.Name + ability.Index, Enemy, PosShot)
	}

	private CreateConShot(name: string, enemy: Unit, PosShot: Menu.Slider) {
		return ParticlesSDK.AddOrUpdate(
			name + "_" + this.unit,
			"particles/units/heroes/hero_skywrath_mage/skywrath_mage_concussive_shot.vpcf",
			ParticleAttachment_t.PATTACH_CUSTOMORIGIN, enemy,
			0, enemy.Position.AddScalarZ(PosShot.value),
			1, enemy.Position.AddScalarZ(PosShot.value),
			2, new Vector3(3000)
		)
	}

	public removePartsAllByName() {
		// loop-optimizer: KEEP
		XAIOparKey.forEach(key => {
			key.forEach(x => x.Destroy(true))
		})
	}

	public readonly addPartToUnit = (par: Particle) => {
		if (!this.IsOwnerValid)
			return

		let particles = XAIOparKey.get(this.unit!)

		if (particles === undefined) {
			particles = [par]
		}
		else {
			if (particles.includes(par))
				return
			particles.push(par)
		}

		XAIOparKey.set(this.unit!, particles)
	}

	public RemoveParticle(name: string) {
		if (!this.IsOwnerValid || name === undefined)
			return
		ParticlesSDK.Remove(name + "_" + this.unit)
	}

	// TODO: in dev

	public RenderDamage(owner: Unit, Units: Unit[], filter_class: Constructor<Ability>[]) {
		const colorBar = Color.Green

		let off_x: number,
			off_y: number,
			bar_w: number,
			bar_h: number,
			screen_size = RendererSDK.WindowSize,
			ratio = RendererSDK.GetAspectRatio()
		{ // 
			if (ratio === "16x9") {
				off_x = screen_size.x * -0.0270
				off_y = screen_size.y * -0.02215
				bar_w = screen_size.x * 0.053
				bar_h = screen_size.y * 0.005
			} else if (ratio === "16x10") {
				off_x = screen_size.x * -0.02950
				off_y = screen_size.y * -0.02315
				bar_w = screen_size.x * 0.0583
				bar_h = screen_size.y * 0.0047
			} else if (ratio === "21x9") {
				off_x = screen_size.x * -0.020
				off_y = screen_size.y * -0.01715
				bar_w = screen_size.x * 0.039
				bar_h = screen_size.y * 0.007
			} else {
				off_x = screen_size.x * -0.038
				off_y = screen_size.y * -0.01715
				bar_w = screen_size.x * 0.075
				bar_h = screen_size.y * 0.0067
			}
		}
		Units.forEach(hero => {
			if (!(hero instanceof Hero) || !hero.IsEnemy() || !hero.IsAlive || !hero.IsVisible || hero.IsIllusion)
				return

			let TotalDamage = filter_class.map(class_name => {
				let ability = owner.GetAbilityByClass(class_name) ?? owner.GetItemByClass(class_name as Constructor<Item>)
				if (ability === undefined || ability.IsPassive || !ability.CanBeCasted() || ability.AbilityDamage <= 0)
					return
				return ability
			}).map(ability => hero.CalculateDamage((ability?.AbilityDamage || ability?.GetSpecialValue("damage")) ?? 0, ability?.DamageType ?? 0, hero))
				.reduce((prev, curr) => prev + curr)


			let wts = RendererSDK.WorldToScreen(hero.Position.AddScalarZ(hero.HealthBarOffset))
			if (wts === undefined)
				return

			wts.AddScalarX(off_x).AddScalarY(off_y)
			let SizeSteal = TotalDamage / hero.HP

			if (SizeSteal === 0)
				return

			let sizeBarX = 0

			if (SizeSteal < 1) {
				colorBar.SetColor(74, 177, 48)
				SizeSteal = TotalDamage / hero.MaxHP
				sizeBarX += bar_w * SizeSteal
			} else {
				colorBar.SetColor(0, 255, 0)
				sizeBarX += hero.HP / hero.MaxHP * bar_w
			}
			sizeBarX = Math.min(sizeBarX, bar_w)

			RendererSDK.FilledRect(wts, new Vector2(sizeBarX, bar_h), colorBar)
		})
	}


}

XAIOEvents.on("removeControllable", (unit) => {
	if (!unit.IsHero)
		return
	// loop-optimizer: KEEP
	XAIOparKey.get(unit)?.forEach(x => x.Destroy(true))
})

EventsSDK.on("GameEnded", () => {
	XAIOparKey.clear()
})