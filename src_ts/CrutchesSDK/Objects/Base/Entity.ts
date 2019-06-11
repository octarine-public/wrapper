import { DegreesToRadian } from "../../Utils/Math";
import QAngle from "../../Base/QAngle";
import Vector2 from "../../Base/Vector2";
import Vector3 from "../../Base/Vector3";
import { default as EntityManager, LocalPlayer } from "../../Managers/EntityManager";

/*
m_pEntity.m_flags

1 << 2 is EF_IN_STAGING_LIST
1 << 4 is EF_DELETE_IN_PROGRESS
*/
export default class Entity {
	
	/* ================================ Fields ================================ */
	
	/* protected */ readonly m_pBaseEntity: C_BaseEntity
	protected m_iIndex: number;
	private m_bIsValid: boolean = false;
	
	private m_pEntity: CEntityIdentity
	private m_hOwnerEntity: Entity
	
	/* ================================ BASE ================================ */
	
	constructor(ent?: C_BaseEntity, id: number = -1) {
		this.m_pBaseEntity = ent;
		this.m_iIndex = id;
	}
	
	/* ================ GETTERS ================ */
	get Angles(): QAngle {
		var gameSceneNode = this.m_pBaseEntity.m_pGameSceneNode

		if (gameSceneNode !== undefined)
			return QAngle.fromIOBuffer(gameSceneNode.m_angAbsRotation);
		
		return this.NetworkAngles;
	}
	get CreateTime(): number {
		return this.m_pBaseEntity.m_flCreateTime
	}
	get HP(): number {
		return this.m_pBaseEntity.m_iHealth
	}
	get HPPercent(): number {
		return Math.floor(this.HP / this.MaxHP * 100) || 0;
	}
	get Index(): number {
		return this.m_iIndex;
	}
	get IsAlive(): boolean {
		return this.LifeState === LifeState_t.LIFE_ALIVE // || this.HP === 0
	}
	get IsDormant(): boolean {
		return !this.IsVisible
	}
	get IsDOTANPC(): boolean {
		return this.m_pBaseEntity.m_bIsDOTANPC;
	}
	get IsNPC(): boolean {
		return this.m_pBaseEntity.m_bIsNPC;
	}
	get IsValid(): boolean {
		return this.m_bIsValid;
	}
	set IsValid(value: boolean) {
		this.m_bIsValid = value;
	}
	get IsVisible(): boolean {
		return (this.Flags & (1 << 7)) === 0
	}
	get LifeState(): LifeState_t {
		return this.m_pBaseEntity.m_lifeState
	}
	get MaxHP(): number {
		return this.m_pBaseEntity.m_iMaxHealth
	}
	get Name(): string {
		return this.m_pBaseEntity.m_pEntity.m_name
			|| this.m_pBaseEntity.m_pEntity.m_designerName
			|| "";
	}
	get NetworkAngles(): QAngle {
		return QAngle.fromIOBuffer(this.m_pBaseEntity.m_angNetworkAngles)
	}
	get NetworkPosition(): Vector3 {
		return Vector3.fromIOBuffer(this.m_pBaseEntity.m_vecNetworkOrigin);
	}
	get NetworkRotation(): number {
		return this.m_pBaseEntity.m_angNetworkAngles ? IOBuffer[1] : 0
	}
	get NetworkRotationRad(): number {
		return DegreesToRadian(this.NetworkRotation);
	}
	/**
	 * as Direction
	 */
	get Forward(): Vector3 {
		return Vector3.FromAngle(this.NetworkRotationRad)
			.SetZ(this.m_pBaseEntity.m_vecNetworkOrigin ? IOBuffer[2] : 0);
	}
	get Forward2D(): Vector2 {
		return Vector2.FromAngle(this.NetworkRotationRad)
	}
	get Owner(): Entity {
		return EntityManager.GetEntityByNative(this.m_pBaseEntity.m_hOwnerEntity);
	}
	get Position(): Vector3 {
		var gameSceneNode = this.m_pBaseEntity.m_pGameSceneNode

		if (gameSceneNode !== undefined)
			return Vector3.fromIOBuffer(gameSceneNode.m_vecAbsOrigin);

		return this.NetworkPosition;
	}
	get Rotation(): number {
		var gameSceneNode = this.m_pBaseEntity.m_pGameSceneNode

		if (gameSceneNode !== undefined)
			return gameSceneNode.m_angRotation ? IOBuffer[1] : 0

		return this.NetworkRotation;
	}
	get RotationRad(): number {
		return DegreesToRadian(this.Rotation);
	}
	get Scale(): number {
		var gameSceneNode = this.m_pBaseEntity.m_pGameSceneNode

		if (gameSceneNode === undefined)
			return 1.0

		return gameSceneNode.m_flAbsScale
	}
	/**
	 * Buffs/debuffs are not taken
	 */
	get Speed(): number {
		return this.m_pBaseEntity.m_flSpeed
	}
	get Team(): DOTATeam_t {
		return this.m_pBaseEntity.m_iTeamNum
	}
	get Flags(): number {
		if (this.m_pBaseEntity === undefined)
			return undefined;
		
		if (this.m_pEntity === undefined)
			this.m_pEntity = this.m_pBaseEntity.m_pEntity;
		
		return this.m_pEntity.m_flags;
	}
	set Flags(value: number) {
		if (this.m_pBaseEntity === undefined)
			return;
			
		if (this.m_pEntity === undefined)
			this.m_pEntity = this.m_pBaseEntity.m_pEntity;
			
		this.m_pEntity.m_flags = value;
	}

	/* ================ METHODS ================ */

	toString(): string {
		return this.Name;
	}
	
	/* ================================ EXTENSIONS ================================ */
	
	/* ================ METHODS ================ */
	
	/**
	 */
	Distance(vec: Vector3 | Entity): number {
		if (vec instanceof Vector3)
			return this.NetworkPosition.Distance(vec)

		return this.NetworkPosition.Distance(vec.NetworkPosition)
	}
	/**
	 */
	Distance2D(vec: Vector3 | Vector2 | Entity): number {
		if (vec instanceof Vector3 || vec instanceof Vector2)
			return this.NetworkPosition.Distance2D(vec)
			
		return this.NetworkPosition.Distance2D(vec.NetworkPosition)
	}
	/**
	 */
	DistanceSquared(vec: Vector3 | Entity): number {
		if (vec instanceof Vector3)
			return this.NetworkPosition.DistanceSqr(vec)
			
		return this.NetworkPosition.DistanceSqr(vec.NetworkPosition)
	}
	/**
	 */
	DistanceSquared2D(vec: Vector3 | Vector2 | Entity): number {
		if (vec instanceof Vector3 || vec instanceof Vector2)
			return this.NetworkPosition.DistanceSqr2D(vec)

		return this.NetworkPosition.DistanceSqr2D(vec.NetworkPosition)
	}
	AngleBetweenFaces(front: Vector3): number {
		return this.Forward.AngleBetweenFaces(front)
	}
	InFront(distance: number): Vector3 {
		return this.Position.Rotation(this.Forward, distance)
	}
	FindRotationAngle(vec: Vector3 | Entity): number {
		if (vec instanceof Entity)
			vec = vec.Position

		let thisPos = this.Position
		let angle = Math.abs(
			Math.atan2(
				vec.y - thisPos.y,
				vec.x - thisPos.x,
			) - this.NetworkRotationRad,
		)

		if (angle > Math.PI)
			angle = Math.abs((Math.PI * 2) - angle)

		return angle
	}
	/**
	 * faster (Distance <= range)
	 */
	IsInRange(ent: Vector3 | Vector2 | Entity, range: number): boolean {
		return this.DistanceSquared2D(ent) < range ** 2
	}
	/**
	 * @param ent if undefined => this compare with LocalPlayer
	 */
	IsEnemy(ent: Entity = LocalPlayer): boolean {
		return ent === undefined || ent.Team !== this.Team
	}
	/**
	 * @param ent Any Entity. If undefined => this compare with LocalPlayer
	 */
	IsAlly(ent: Entity = LocalPlayer): boolean {
		return ent !== undefined && ent.Team === this.Team
	}
	
	Select(bAddToGroup: boolean = false): boolean {
		return SelectUnit(this.m_pBaseEntity, bAddToGroup)
	}
}