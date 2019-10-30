import { Hero, Unit, LocalPlayer, Game, Menu, ParticlesSDK, Vector3 } from "wrapper/Imports"
export let EnemyParticle: number
export default class DrawTarget {
	public owner: Hero | Unit
	public target: Hero | Unit
	constructor(owner?: Hero | Unit, target?: Hero | Unit) {
		this.owner = owner
		this.target = target
	}
	public DrawTarget(Base: any, State: Menu.Toggle): void {
		if (LocalPlayer === undefined) {
			return
		}
		if (!Base.IsRestrictions(State) || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME || LocalPlayer.IsSpectator) {
			return
		}
		if (this.owner === undefined || !this.owner.IsAlive) {
			return
		}
		if (EnemyParticle === undefined && this.target !== undefined) {
			EnemyParticle = ParticlesSDK.Create("particles/ui_mouseactions/range_finder_tower_aoe.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.target)
		}
		if (EnemyParticle !== undefined) {
			if (this.target === undefined) {
				ParticlesSDK.Destroy(EnemyParticle, true)
				EnemyParticle = undefined
			} else {
				ParticlesSDK.SetControlPoint(EnemyParticle, 2, this.owner.Position)
				ParticlesSDK.SetControlPoint(EnemyParticle, 6, new Vector3(1))
				ParticlesSDK.SetControlPoint(EnemyParticle, 7, this.target.Position)
			}
		}
	}
	public ResetEnemyParticle() {
		if (EnemyParticle !== undefined) {
			ParticlesSDK.Destroy(EnemyParticle, true)
			EnemyParticle = undefined
		}
	}
}