// Utils
import * as Utils from "./Utils/Utils";
import * as MathSDK from "./Utils/Math";
import * as Debug from "./Utils/Debug";

export { Utils, MathSDK, Debug }

// base
export { default as Vector2 } from "./Base/Vector2";
export { default as Vector3 } from "./Base/Vector3";
export { default as QAngle } from "./Base/QAngle";
export { default as Color } from "./Base/Color";

// Native
export { default as RendererSDK } from "./Native/Renderer";
export { default as ExecuteOrder, ORDERS_WITHOUT_SIDE_EFFECTS } from "./Native/ExecuteOrder";

// Menu
import * as MenuManager from "./Menu/MenuManager";

export { MenuManager }

// Helpers
export { Sleeper, GameSleeper } from "./Helpers/Sleeper";

// Managers
export { default as EntityManager, LocalPlayer, Game, PlayerResource } from "./Managers/EntityManager";

export { default as ModifierManager } from "./Managers/ModifierManager";
export { default as EventsSDK } from "./Managers/Events";

// Objects
import Entity from "./Objects/Base/Entity";
import Unit from "./Objects/Base/Unit";
import Hero from "./Objects/Base/Hero";
import Player from "./Objects/Base/Player";
import Courier from "./Objects/Base/Courier";
import Creep from "./Objects/Base/Creep";
import Meepo from "./Objects/Heroes/Meepo";

import Ability from "./Objects/Base/Ability";
import Item from "./Objects/Base/Item";
import {
	default as Modifier,
	TRUESIGHT_MODIFIERS,
	SCEPTER_MODIFIERS,
	BLOCKING_DAMAGE_MODIFIERS,
	REFLECTING_DAMAGE_MODIFIERS
} from "./Objects/Base/Modifier";

import PhysicalItem from "./Objects/Base/PhysicalItem";
import Rune from "./Objects/Base/Rune";
import Tree from "./Objects/Base/Tree";

import Building from "./Objects/Base/Building";
import Tower from "./Objects/Base/Tower";
import Shop from "./Objects/Base/Shop";

export { 
	Entity, Unit, Hero, Player, 
	Ability, Item, Modifier, 
	Courier, Creep, Meepo, 
	PhysicalItem, Rune, Tree, 
	Building, Tower, Shop
}


/*
	TODO:

	- wrapper:
		C_DOTA_DataNonSpectator -> DataNonSpectator
		C_DOTA_UnitInventory 	-> Inventory
		CDOTA_ModifierManager 	-> Modifiers

	- check:
		C_DOTA_BaseNPC:
			m_flManaThinkRegen | m_flManaRegen 		-> ManaRegen
			m_flHealthThinkRegen | m_flHealthRegen 	-> HPRegen

			C_DOTA_Unit_Hero_Meepo 		-> m_bIsIllusion
		C_DOTAPlayer:
			m_flCameraZoomAmount

	TODO Native:

	- add AbilitySlot (index in slots)
	- particle list as entity list
	- particle destroyed
	- QAngle - add AsVector3
	- reverse:
		Global:
			UnSelectUnit

		C_DOTA_BaseNPC | Unit
			BaseArmor
			BaseHealthRegeneration
			BaseManaRegeneration
	- check painttravarse - streamer mode

*/
