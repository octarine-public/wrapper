/*
	TODO?
	Maybe change callback OnParticleEffectAdded | OnTeamVisibilityChanged to emits(events)?
*/

export default class Entity {
	m_pBaseEntity: C_BaseEntity

	constructor(ent: C_BaseEntity) {
		this.m_pBaseEntity = ent
	}

	// Redefine

	get IsValid(): boolean {
		return this.m_pBaseEntity.m_bIsValid
	}

	get IsVisible(): boolean {
		let ent = this.m_pBaseEntity.m_pEntity
		return ent !== undefined && (ent.m_flags & (1 << 7)) === 0
	}
	get IsAlive(): boolean {
		return this.LifeState === LifeState_t.LIFE_ALIVE
	}
	/* get ID(): number {
		return this.m_pBaseEntity.m_iID
	} */
	get Forward(): Vector3 {
		return this.m_pBaseEntity.m_vecForward
	}
	IsInRange(ent: Vector3 | Entity, range: number): boolean {
		return this.Distance(ent) <= range
	}
	/**
	 * @param ent if undefuned => this compare with LocalPlayer
	 */
	IsEnemy(ent?: Entity): boolean {
		if (ent !== undefined)
			return this.Team !== ent.Team

		let lp = LocalDOTAPlayer

		return lp === undefined || lp.m_iTeamNum !== this.Team
	}
	InFront(distance: number): Vector3 {
		return this.Position.Rotation(this.Forward, distance)
	}
	FindRotationAngle(vec: Vector3 | Entity): number {
		if (vec instanceof Entity)
			vec = vec.Position

		let thisPos = this.Position
		let angle = Math.abs (
				Math.atan2 (
					vec.y - thisPos.y,
					vec.x - thisPos.x,
				) - this.Forward.Angle,
			)

		if (angle > Math.PI)
			angle = Math.abs((Math.PI * 2) - angle)

		return angle
	}

	// new
	get HP(): number {
		return this.m_pBaseEntity.m_iHealth
	}
	get MaxHP(): number {
		return this.m_pBaseEntity.m_iMaxHealth
	}
	get Position(): Vector3 {
		return this.m_pBaseEntity.m_vecNetworkOrigin
	}
	get Team(): DOTATeam_t {
		return this.m_pBaseEntity.m_iTeamNum
	}
	/**
	 * Buffs/debuffs are not taken
	 */
	get Speed(): number {
		return this.m_pBaseEntity.m_flSpeed
	}
	get CreateTime(): number {
		return this.m_pBaseEntity.m_flCreateTime
	}
	get IsDormant(): boolean {
		return !this.IsVisible
	}
	get LifeState(): LifeState_t {
		return this.m_pBaseEntity.m_lifeState
	}
	/**
	 * need getting from entitymanager
	 */
	get Owner(): Entity {
		return new Entity(this.m_pBaseEntity.m_hOwnerEntity)
	}
	get Scale(): number {
		var gameSceneNode = this.m_pBaseEntity.m_pGameSceneNode

		if (gameSceneNode === undefined)
			return 1.0

		return gameSceneNode.m_flAbsScale
	}
	// get Name(): string {
	// 	return this.ent.m_pEntity.m_name;
	// }
	// get Rotation(): Vector3 {

	// }

	// get RotationRad(): Vector3 {

	// }

	Equals(ent: Entity | object): boolean {
		if (ent === undefined)
			return false

		return this === (ent as Entity)
	}

	Distance(vec: Entity | Vector3): number {
		if (vec instanceof Entity)
			vec = vec.Position
		return this.Position.Distance(vec)
	}
	Distance2D(vec: Entity | Vector3): number {
		if (vec instanceof Entity)
			vec = vec.Position
		return this.Position.Distance2D(vec)
	}
	DistanceSquared(vec: Entity | Vector3) {
		if (vec instanceof Entity)
			vec = vec.Position
		return this.Position.DistanceSqr(vec)
	}
	FromPolarAngle(delta: number) {
		return Vector3.FromAngle(this.Forward.Angle + delta)
	}
	InFrontFromAngle(delta: number, distance: number) {
		return this.Position.Add(
			this.FromPolarAngle(delta).MultiplyScalar(distance),
		)
	}
	AngleBetweenFaces(front: Vector3) {
		return this.Forward.AngleBetweenFaces(front)
	}

	Select(bAddToGroup: boolean = false): boolean {
		return SelectUnit(this.m_pBaseEntity, bAddToGroup)
	}

	// AddParticleEffect(name: string): CNewParticleEffect {

	// }

	OnParticleEffectAdded(callbackFn: (id: number, path: string, particleSystemHandle: bigint, attach: ParticleAttachment_t, target?: Entity) => void): void {
		Events.on("onParticleCreated", (id, path, particleSystemHandle, attach, target) => {
			if (target === this.m_pBaseEntity)
				callbackFn(id, path, particleSystemHandle, attach, this)
		})
	}

	// OnParticleEffectUpdated(callbackFn: (id: number, control_point: number, vec: Vector3) => void): void {
	// 	Events.on("onParticleUpdated", (id, control_point, vec) => {
	// 		//if (target.m_iID === this.ID)
	// 			callbackFn.apply(this, arguments);
	// 	});
	// }

	OnTeamVisibilityChanged(callbackFn: (npc: C_DOTA_BaseNPC) => void): void {
		Events.on("onTeamVisibilityChanged", npc => {
			if (npc === this.m_pBaseEntity)
				callbackFn(npc)
		})
	}
}
