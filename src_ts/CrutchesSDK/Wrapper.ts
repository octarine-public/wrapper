import Entity from "CrutchesSDK/Extensions/Entity"
//import * as Enums from "CrutchesSDK/Extensions/Enums"
import Unit from "CrutchesSDK/Extensions/Unit"
import Vector_2 from "CrutchesSDK/Extensions/Vector"
import * as EntityManager from "CrutchesSDK/Managers/EntityManager"
//import * as MenuManager from "CrutchesSDK/Menu/MenuManager";
//import * as ParticleManager from "CrutchesSDK/Managers/ParticlesManager"

// //export * from "CrutchesSDK/Extensions/Enums";


export { Entity, /*Enums,*/  Vector_2 } // Extensions
export { EntityManager/*, ParticleManager*/ } // Managers

export * from "CrutchesSDK/Menu/MenuManager";









/*
	TO DO:

	- wrapper:
		C_DOTA_UnitInventory 	-> Inventory
		CDOTA_ModifierManager 	-> Modifiers
	
	- check:
		C_DOTA_BaseNPC:
			m_flManaThinkRegen | m_flManaRegen 		-> ManaRegen 
			m_flHealthThinkRegen | m_flHealthRegen 	-> HPRegen 
		
			C_DOTA_Unit_Hero_Meepo 		-> m_bIsIllusion
		C_DOTAPlayer: 
			m_flCameraZoomAmount
			
			
			
	TO DO Native:

	- QAngle - add AsVector
	- remove EffectiveInvisibilityLevel
	- move Vector to Native API
	- reverse:
		Global:
			UnSelectUnit
		
		C_DOTA_BaseNPC | Unit
			BaseArmor
			BaseHealthRegeneration
			BaseManaRegeneration
	
			
*/