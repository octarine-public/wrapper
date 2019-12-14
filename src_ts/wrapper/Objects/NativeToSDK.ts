let constructors = Object.create(null)

/* Entities */

import Rune from "../Objects/Base/Rune"
constructors.C_DOTA_Item_Rune = Rune

import Tree from "../Objects/Base/Tree"
constructors.C_DOTA_MapTree = Tree

import TreeTemp from "../Objects/Base/TreeTemp"
constructors.C_DOTA_TempTree = TreeTemp

import WardObserver from "../Objects/Base/WardObserver"
constructors.C_DOTA_TempTree = WardObserver

import WardTrueSight from "../Objects/Base/WardTrueSight"
constructors.C_DOTA_TempTree = WardTrueSight

import Shop from "../Objects/Base/Shop"
constructors.C_DOTA_BaseNPC_Shop = Shop

import Player from "../Objects/Base/Player"
constructors.C_DOTAPlayer = Player

import Courier from "../Objects/Base/Courier"
constructors.C_DOTA_Unit_Courier = Courier

import Meepo from "../Objects/Heroes/Meepo"
constructors.C_DOTA_Unit_Hero_Meepo = Meepo

import Roshan from "../Objects/Units/Roshan"
constructors.C_DOTA_Unit_Roshan = Roshan

/* Items */

import item_abyssal_blade from "./Abilities/Items/item_abyssal_blade"
constructors.C_DOTA_Item_AbyssalBlade = item_abyssal_blade

import item_aeon_disk from "./Abilities/Items/item_aeon_disk"
constructors.C_DOTA_Item_AeonDisk = item_aeon_disk

import item_ancient_janggo from "./Abilities/Items/item_ancient_janggo"
constructors.C_DOTA_Item_Ancient_Janggo = item_ancient_janggo

import item_arcane_boots from "./Abilities/Items/item_arcane_boots"
constructors.C_DOTA_Item_Arcane_Boots = item_arcane_boots

import item_armlet from "./Abilities/Items/item_armlet"
constructors.C_DOTA_Item_Armlet = item_armlet

import item_assault from "./Abilities/Items/item_assault"
constructors.C_DOTA_Item_Assault_Cuirass = item_assault

import item_bfury from "./Abilities/Items/item_bfury"
constructors.CDOTA_Item_Battlefury = item_bfury

import item_black_king_bar from "./Abilities/Items/item_black_king_bar"
constructors.C_DOTA_Item_Black_King_Bar = item_black_king_bar

import item_blade_mail from "./Abilities/Items/item_blade_mail"
constructors.C_DOTA_Item_Blade_Mail = item_blade_mail

import item_bottle from "./Abilities/Items/item_bottle"
constructors.C_DOTA_Item_EmptyBottle = item_bottle

import item_power_treads from "./Abilities/Items/item_power_treads"
constructors.C_DOTA_Item_PowerTreads = item_power_treads

Object.freeze(constructors)
export default constructors
