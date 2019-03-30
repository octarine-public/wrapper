//import * as Enums from "./Enums";
import Vector_2 from "./Vector";

/*
	TODO?
	May be callback OnParticleEffectAdded | OnTeamVisibilityChanged change to emits(events)?

*/

export default class Entity {
	ent: C_BaseEntity
	//__proto__ = C_BaseEntity.prototype

	constructor(ent: C_BaseEntity) {
		this.ent = ent;
	}
	
	// Redefine
	
	get IsValid(): boolean {
		return this.ent.m_bIsValid
	}
	
	get IsVisible(): boolean {
		return this.ent.m_bIsVisible;
	}
	get IsAlive(): boolean {
		return this.LifeState === LifeState_t.LIFE_ALIVE;
	}
	get ID(): number {
		return this.ent.m_iID;
	}
	// temporary, while Vector_2 not included to Native code
	get Forward(): Vector_2 {
		//return this.ent.m_vecForward;
		return Vector_2.fromObject(this.ent.m_vecForward);
	}
	/**
	 * @param ent if undefuned => this compare with LocalPlayer
	 */
	IsEnemy(ent?: Entity): boolean {
		return ent === undefined
			? this.Team !== LocalDOTAPlayer.m_iTeamNum
			: this.Team !== ent.Team;
	}

	IsInRange(ent: Vector_2 | Entity, range: number): boolean {
		return this.Distance(ent) <= range;
	}
	
	FindRotationAngle(vec: Vector_2 | Entity): number {

		if (vec instanceof Entity)
			vec = (vec as Entity).Position;

		var thisPos = this.Position,
			angle = Math.abs (
				Math.atan2 (
					(vec as Vector_2).y - thisPos.y,
					(vec as Vector_2).x - thisPos.x,
				) - this.Forward.Angle,
			);

		if (angle > Math.PI)
			angle = Math.abs((Math.PI * 2) - angle);

		return angle;
	}

	// new
	get HP(): number {
		return this.ent.m_iHealth;
	}
	get MaxHP(): number {
		return this.ent.m_iMaxHealth;
	}
	// temporary, while Vector_2 not included to Native code
	get Position(): Vector_2 {
		//return this.ent.m_vecNetworkOrigin;
		return Vector_2.fromObject(this.ent.m_vecNetworkOrigin);
	}
	get Team(): DOTATeam_t {
		return this.ent.m_iTeamNum;
	}
	/**
	 * Buffs/debuffs are not taken
	 */
	get Speed(): number {
		return this.ent.m_flSpeed;
	}
	get CreateTime(): number {
		return this.ent.m_flCreateTime;
	}
	get IsDormant(): boolean {
		return !this.IsVisible;
	}
	get LifeState(): LifeState_t {
		return this.ent.m_lifeState;
	}
	get Owner(): C_BaseEntity {
		return this.ent.m_hOwnerEntity;
	}
	get Scale(): number {
		var gameSceneNode = this.ent.m_pGameSceneNode;
		
		if (gameSceneNode === undefined)
			return 1.0;
			
		return gameSceneNode.m_flAbsScale;
	}
	// get Name(): string {
	// 	return this.ent.m_pEntity.m_name;
	// }
	
	// get Rotation(): Vector_2 {
		
	// }
	// get RotationRad(): Vector_2 {

	// }

	Equals(ent: Entity | Object): boolean {
		
		if (ent === undefined)
			return false;
			
		return this === (ent as Entity);
	}
	
	Distance(ent: Entity | Vector_2): number {
		if (ent instanceof Entity)
			return this.Position.Distance(ent.Position);
			
		return this.Position.Distance(ent as Vector_2);
	}
	Distance2D(ent: Entity | Vector_2): number {
		if (ent instanceof Entity)
			return this.Position.Distance(ent.Position);

		return this.Position.Distance(ent as Vector_2);
	}
	
	Select(toToCurrentSelection: boolean = false): boolean {
		return SelectUnit(this.ent, toToCurrentSelection);
	}
	
	// AddParticleEffect(name: string): CNewParticleEffect {
		
	// }
	
	OnParticleEffectAdded(callbackFn: (id: number, path: string, particleSystemHandle: bigint, attach: ParticleAttachment_t, target?: Entity) => void): void {
		
		Events.addListener("onParticleCreated", (id, path, particleSystemHandle, attach, target) => {
			if (target === this.ent)
				callbackFn(id, path, particleSystemHandle, attach, this);
		});
	}
	
	// OnParticleEffectUpdated(callbackFn: (id: number, control_point: number, vec: Vector) => void): void {

	// 	Events.addListener("onParticleUpdated", (id, control_point, vec) => {
	// 		//if (target.m_iID === this.ID)
	// 			callbackFn.apply(this, arguments);
	// 	});
	// }
	
	OnTeamVisibilityChanged(callbackFn: (npc: C_DOTA_BaseNPC) => void): void {
		
		Events.addListener("onTeamVisibilityChanged", npc => {
			if (npc === this.ent)
				callbackFn(npc);
		});
	}
}