import { Game, MenuManager, EventsSDK, Entity, RendererSDK, Debug, Vector2, Unit, Color, EntityManager, Hero, Modifier, ArrayExtensions, Utils, Vector3, Ability, Item } from 'wrapper/Imports';
let { MenuFactory } = MenuManager
const menu = MenuFactory("Custom Ranges"),
    active = menu.AddToggle("Active")
let rangesArray = []