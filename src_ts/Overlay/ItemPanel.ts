import {
	ArrayExtensions, Color, EventsSDK, Game,
	Hero, Input, Item, LocalPlayer, Meepo, Menu as MenuSDK,
	Rectangle, RendererSDK, Vector2, VMouseKeys,
} from "wrapper/Imports";

// ["Visual", "Overlay", "Item Panel"]
const Menu = MenuSDK.AddEntry(["Visual", "Item Panel"]);
const menuEnable = Menu.AddToggle("Enable");

const panelSettings = Menu.AddNode("Settings Panel");
const panelLevel = Menu.AddToggle("Level Heroes", true);
const panelTP = Menu.AddToggle("Show Teleport", true);
const panelItems = Menu.AddNode("Items");
const panelAllies = Menu.AddToggle("Show Allies");

// style
const panelSettingsKey = panelSettings.AddKeybind("Toggle Key")//.SetTooltip(`Show/hide ${Menu.name}`)
const panelSettingsSize = panelSettings.AddSlider("Size", 30, 20, 50)
const panelSettingsFlow = panelSettings.AddSwitcher("Style", ["Horizontal", "Vertical"]);
const panelSettingsOutline = panelSettings.AddToggle("Outline", true);
const panelSettingsOpacity = panelSettings.AddSlider("Opacity", 60, 5, 100);
const panelSettingsPosition = panelSettings.AddVector2("Position", new Vector2(0, 60));
const panelSettingsTurnTouch = panelSettingsPosition.node.AddToggle("Touch panel", true);
const panelSettingsGapIcon = panelSettings.AddSlider("Gap between Icons", 1, 0, 10);
const panelSettingsSpectator = panelSettings.AddToggle("Turn on when spectating");

// Items
const panelItemsEnable = panelItems.AddToggle("Enable", true);
const panelItemsCD = panelItems.AddToggle("Show Cooldown", true);
const panelItemsCharges = panelItems.AddToggle("Show Charges", true);
const panelItemsBackpack = panelItems.AddToggle("Show Backpack");

let heroes: Hero[] = [];
let toggledByKey = true;
let isDraggingPanel = true;

const mouseOnPanel = new Vector2();
const onTouchPanel = new Vector2();
const heroIconSize = new Vector2();
const itemIconSize = new Vector2();

const colorPanel = Color.White;
const colorOnTouchPanel = Color.Black;
const colorDarkGrayPanel = Color.BlackGray;
const colorLightGrayPanels = Color.LightGray;
const colorGrayPanels = Color.Gray;

let pathToHeroIcon = "panorama/images/heroes/";
let pathToItemIcon = "panorama/images/items/";

const GetPathToHeroIcon = (name: string) => `${pathToHeroIcon}${name}_png.vtex_c`;
const GetPathToItemIcon = (name: string | undefined) => {
	if (name !== undefined) {
		return `${pathToItemIcon}${name && !name.includes("recipe_")
			? name.replace("item_", "")
			: "recipe"}_png.vtex_c`;
	}
	return `${pathToItemIcon}emptyitembg_png.vtex_c`
}

const IsHorizontal = () => panelSettingsFlow.selected_id === 0;

panelSettingsKey.OnRelease(() => toggledByKey = !toggledByKey);
panelSettingsSize.OnValue(ChangeStylePanel);
panelSettingsFlow.OnValue(ChangeStylePanel);
panelSettingsOpacity.OnValue(ChangeColor);

function ChangeColor() {
	const opacityPercToPx = 255 / 100 * panelSettingsOpacity.value;

	colorPanel.SetA(opacityPercToPx);
	colorOnTouchPanel.SetA(opacityPercToPx);
	colorDarkGrayPanel.SetA(opacityPercToPx);
	colorLightGrayPanels.SetA(opacityPercToPx);
	colorGrayPanels.SetA(opacityPercToPx);
}
function ChangeStylePanel() {
	pathToHeroIcon = `panorama/images/heroes/${!IsHorizontal() ? "icons/" : ""}`;

	heroIconSize.SetVector(panelSettingsSize.value
		* (IsHorizontal() ? 1.83 : 1.31),
		(IsHorizontal() ? panelSettingsSize.value : panelSettingsSize.value * 1.31)).RoundForThis();

	itemIconSize.SetVector(panelSettingsSize.value * 1.31,
		panelSettingsSize.value).RoundForThis();

	onTouchPanel.SetVector(
		IsHorizontal() ? (panelSettingsSize.value / 3.5) : panelSettingsSize.value * 1.31,
		IsHorizontal() ? panelSettingsSize.value : (panelSettingsSize.value / 3.5)).RoundForThis();
}

function CooldownRound(time: number) {
	if (time <= 0)
		return;

	if (time > 0)
		time = Math.round(time * 10) / 10;

	if (time > 1)
		time = Math.floor(time);

	return time.toString();
}

function DrawItem(item: Item, position: Vector2, isBackPack = false) {

	const isHorizontal = IsHorizontal();

	isHorizontal
		? position.AddScalarX(panelSettingsGapIcon.value)
		: position.AddScalarY(panelSettingsGapIcon.value);

	let itemCoolDown: string;

	if (panelItemsCD.value) {
		itemCoolDown = CooldownRound(item.CooldownTimeRemaining);
	}

	const colorItem = isBackPack
		? (itemCoolDown ? colorGrayPanels : colorLightGrayPanels)
		: (itemCoolDown ? colorGrayPanels : colorPanel)

	RendererSDK.Image(
		GetPathToItemIcon(item.Name),
		position, itemIconSize, colorItem);

	if (panelSettingsOutline.value)
		RendererSDK.OutlinedRect(position, itemIconSize, isBackPack ? colorDarkGrayPanel : colorGrayPanels);

	if (panelItemsCharges.value) {

		const charges = item.ShouldDisplayCharges
			? item.CurrentCharges.toString()
			: item.Level > 1 ? item.Level.toString() : "";

		const sizeOfCharges = RendererSDK.GetTextSize(charges, undefined,
			panelSettingsSize.value / 1.8);

		const posOfCharges = position.Clone();

		posOfCharges.AddScalarY(itemIconSize.y - sizeOfCharges.y)
			.AddScalarX(itemIconSize.x - sizeOfCharges.x - 2);

		RendererSDK.Text(charges, posOfCharges,
			colorPanel, undefined, panelSettingsSize.value / 1.8);
	}

	DrawCoolDown(position, itemCoolDown);

	isHorizontal
		? position.AddScalarX(itemIconSize.x + panelSettingsGapIcon.value)
		: position.AddScalarY(itemIconSize.y + panelSettingsGapIcon.value);
}

function DrawCoolDown(position: Vector2, itemCoolDown: string, isTP = false) {
	if (itemCoolDown === undefined)
		return;

	const sizeOfCD = RendererSDK.GetTextSize(
		itemCoolDown, undefined, panelSettingsSize.value / (isTP ? 1.6 : 1.4));

	const posOfCharges = position.Clone();

	posOfCharges.AddScalarX((itemIconSize.x / 2) - (sizeOfCD.x / 2));

	if (isTP) {
		posOfCharges.SubtractScalarX(sizeOfCD.x / 2)
	}

	RendererSDK.Text(itemCoolDown.toString(), posOfCharges,
		colorPanel, undefined, new Vector2(panelSettingsSize.value / (isTP ? 1.6 : 1.4), 700));
}

EventsSDK.on("EntityCreated", ent => {
	if (ent instanceof Hero && !ent.IsIllusion &&
		(!(ent instanceof Meepo) || (ent.WhichMeepo === 0))) {
		heroes.push(ent);
	}
});

EventsSDK.on("EntityDestroyed", ent => {
	if (ent instanceof Hero) {
		ArrayExtensions.arrayRemove(heroes, ent);
	}
});

EventsSDK.on("GameEnded", () => {
	heroes = [];
});

EventsSDK.on("Draw", () => {

	if (!menuEnable.value || !toggledByKey || !Game.IsInGame || Game.UIState !== DOTAGameUIState_t.DOTA_GAME_UI_DOTA_INGAME)
		return;

	if (LocalPlayer === undefined || (!panelSettingsSpectator.value && LocalPlayer.IsSpectator))
		return;

	const mousePos = Input.CursorOnScreen;
	const windowSize = RendererSDK.WindowSize;
	const positionPanel = windowSize.DivideScalar(100)
		.MultiplyForThis(panelSettingsPosition.Vector);

	const isHorizontal = IsHorizontal();

	const filteredHeroes = heroes.filter(hero => panelAllies.value || hero.IsEnemy());

	{ // Touch Panel

		if (panelSettingsTurnTouch.value) {

			const lastPosTouchRect = positionPanel.Clone();

			isHorizontal
				? lastPosTouchRect.AddScalarX(onTouchPanel.x)
				: lastPosTouchRect.AddScalarY(onTouchPanel.y)

			filteredHeroes.forEach(() => isHorizontal
				? lastPosTouchRect.AddScalarY(onTouchPanel.y + panelSettingsGapIcon.value * 2)
				: lastPosTouchRect.AddScalarX(onTouchPanel.x + panelSettingsGapIcon.value * 2));

			const OnTouchRect = new Rectangle(positionPanel, lastPosTouchRect);

			const sizeOfTouchRect = lastPosTouchRect.Subtract(positionPanel);

			RendererSDK.FilledRect(positionPanel, sizeOfTouchRect, colorOnTouchPanel)

			if (OnTouchRect.Contains(mousePos) && Input.IsMouseKeyDown(VMouseKeys.MK_LBUTTON)) {

				if (!isDraggingPanel) {
					mouseOnPanel.CopyFrom(mousePos.Subtract(positionPanel));
				}

				isDraggingPanel = true;
			}
			else if (isDraggingPanel && !Input.IsMouseKeyDown(VMouseKeys.MK_LBUTTON)) {
				MenuSDK.MenuManager.UpdateConfig();
				isDraggingPanel = false;
			}

			if (isDraggingPanel) {
				positionPanel.CopyFrom(mousePos.Subtract(mouseOnPanel));

				// clamp between 0 and (WindowSize - max size of panel)
				positionPanel.CopyFrom(positionPanel.Max(new Vector2()).Min(windowSize.Subtract(sizeOfTouchRect)));

				// save position to menu
				panelSettingsPosition.Vector = positionPanel.Divide(windowSize).MultiplyScalarForThis(100).Round(1);
			}

			isHorizontal
				? positionPanel.AddScalarX(onTouchPanel.x + panelSettingsGapIcon.value)
				: positionPanel.AddScalarY(onTouchPanel.y + panelSettingsGapIcon.value);
		}
	}

	filteredHeroes.forEach(hero => {

		// gap for first hero. idk, need or not..
		isHorizontal
			? positionPanel.AddScalarY(panelSettingsGapIcon.value)
			: positionPanel.AddScalarX(panelSettingsGapIcon.value);

		const posPanelOnLine = positionPanel.Clone();

		RendererSDK.Image(GetPathToHeroIcon(hero.Name),
			posPanelOnLine, heroIconSize, colorPanel);

		if (panelSettingsOutline.value) {
			RendererSDK.OutlinedRect(posPanelOnLine, heroIconSize, colorGrayPanels);
		}

		isHorizontal
			? posPanelOnLine.AddScalarX(heroIconSize.x)
			: posPanelOnLine.AddScalarY(heroIconSize.y);

		if (panelLevel.value) {

			const sizeOfLevel = RendererSDK.GetTextSize(
				hero.Level.toString(), undefined, panelSettingsSize.value / 1.8);

			const posOfLevel = positionPanel.Clone();

			if (isHorizontal) {

				posOfLevel.AddScalarY(heroIconSize.y - sizeOfLevel.y)
					.AddScalarX(panelSettingsSize.value / 5);
			} else {
				posOfLevel.SubtractScalarY(panelSettingsSize.value / 10)
					.AddScalarX(2);
			}

			RendererSDK.Text(hero.Level.toString(), posOfLevel,
				colorPanel, undefined, panelSettingsSize.value / 1.8);
		}

		if (panelItemsEnable.value) {

			const posPanelOnItems = posPanelOnLine.Clone();

			// loop-optimizer: FORWARD
			hero.Items.forEach(item => DrawItem(item, posPanelOnItems));

			if (panelItemsBackpack.value) {

				RendererSDK.FilledRect(posPanelOnItems, onTouchPanel, colorOnTouchPanel)

				isHorizontal
					? posPanelOnItems.AddScalarX(onTouchPanel.x)
					: posPanelOnItems.AddScalarY(onTouchPanel.y);

				// loop-optimizer: FORWARD
				hero.Inventory.Backpack.forEach(item => DrawItem(item, posPanelOnItems, true));
			}
		}

		if (panelTP.value) {

			let tpScroll = hero.Inventory.GetItem(15);

			const posOfTP = posPanelOnLine.Clone();

			const sizeOfTP = itemIconSize.DivideScalar(isHorizontal ? 1.6 : 1.5);

			if (isHorizontal) {

				const offset = sizeOfTP.x / 1.5;

				posOfTP.AddScalarY(itemIconSize.y - sizeOfTP.y)
					.SubtractScalarX(offset);

				posPanelOnLine.x = posOfTP.x + offset;
			} else {

				const offset = itemIconSize.y / 2.5;

				posOfTP.SubtractScalarY(offset)
					.AddScalarX(itemIconSize.x - sizeOfTP.x);

				posPanelOnLine.y = posOfTP.y + offset;
			}

			let itemCoolDown: string;

			if (tpScroll !== undefined && panelItemsCD.value) {
				itemCoolDown = CooldownRound(tpScroll.CooldownTimeRemaining);
			}

			const colorTP = itemCoolDown ? colorLightGrayPanels : colorPanel

			// change to Circle Image
			RendererSDK.Image(
				GetPathToItemIcon(tpScroll && tpScroll.Name),
				posOfTP, sizeOfTP, colorTP.Clone().SetA(Math.min(colorTP.a + 50, 255)));

			if (tpScroll) {
				DrawCoolDown(posOfTP, itemCoolDown, true);
			}
		}

		isHorizontal
			? positionPanel.AddScalarY(heroIconSize.y + panelSettingsGapIcon.value)
			: positionPanel.AddScalarX(heroIconSize.x + panelSettingsGapIcon.value);
	});
});