import { Color } from "../Base/Color"
import { Rectangle } from "../Base/Rectangle"
import { Vector2 } from "../Base/Vector2"
import { RendererSDK } from "../Native/RendererSDK"
import { ScaleHeight, ScaleWidth } from "./Helpers"

export class CLowerHUD {
	public readonly LeftFlare = new Rectangle()
	public readonly Portrait = new Rectangle()
	public readonly XP = new Rectangle()
	public readonly TalentTree = new Rectangle()
	public readonly RootInnateDisplay = new Rectangle()
	public readonly AbilitiesContainer = new Rectangle()
	public readonly AbilitiesRects: Rectangle[] = []
	public readonly AghsStatusContainer = new Rectangle()
	public readonly InventoryContainer = new Rectangle()
	public readonly MainInventorySlots: Rectangle[] = []
	public readonly BackpackSlots: Rectangle[] = []
	public readonly NeutralAndTPContainer = new Rectangle()
	public readonly NeutralSlot = new Rectangle()
	public readonly TPSlot = new Rectangle()
	public readonly RightFlare = new Rectangle()
	public readonly HealthManaContainer = new Rectangle()

	constructor(
		screenSize: Vector2,
		isHero: boolean,
		abilitiesCount: number,
		hudFlip: boolean
	) {
		this.LeftFlare.Width = ScaleWidth(52, screenSize)
		this.LeftFlare.Height = ScaleHeight(138, screenSize)
		this.LeftFlare.x = 0
		this.LeftFlare.y = screenSize.y - this.LeftFlare.Height

		this.Portrait.Width = ScaleWidth(159, screenSize)
		this.Portrait.Height = ScaleHeight(145, screenSize)
		this.Portrait.x = ScaleWidth(52, screenSize)
		this.Portrait.y = screenSize.y - this.Portrait.Height

		this.XP.Width = ScaleWidth(48, screenSize)
		this.XP.Height = ScaleHeight(48, screenSize)
		this.XP.x = ScaleWidth(6, screenSize)
		this.XP.y = screenSize.y - this.XP.Height

		this.AbilitiesContainer.Width = ScaleWidth(321, screenSize)
		this.AbilitiesContainer.Height =
			ScaleHeight(104, screenSize) + ScaleHeight(25, screenSize)
		this.AbilitiesContainer.x = ScaleWidth(219, screenSize)
		this.AbilitiesContainer.y =
			screenSize.y - this.AbilitiesContainer.Height - ScaleHeight(50, screenSize)

		if (isHero) {
			this.TalentTree.Width = ScaleWidth(62, screenSize)
			this.TalentTree.Height = ScaleHeight(62, screenSize)
		}
		this.TalentTree.x = this.AbilitiesContainer.x
		this.TalentTree.y =
			this.AbilitiesContainer.pos2.y -
			this.TalentTree.Height -
			ScaleHeight(26, screenSize)
		const TalentTreeMargin = isHero ? ScaleWidth(4, screenSize) : 0

		if (isHero) {
			this.RootInnateDisplay.Width = ScaleWidth(40, screenSize)
			this.RootInnateDisplay.Height = ScaleHeight(64, screenSize)
		}
		this.RootInnateDisplay.x =
			this.TalentTree.pos2.x + TalentTreeMargin - ScaleWidth(6, screenSize)
		this.RootInnateDisplay.y =
			this.AbilitiesContainer.pos2.y -
			this.RootInnateDisplay.Height -
			ScaleHeight(24, screenSize)

		if (isHero) {
			this.AghsStatusContainer.Width =
				ScaleWidth(62, screenSize) - ScaleWidth(4, screenSize)
			this.AghsStatusContainer.Height = ScaleHeight(62, screenSize)
		}
		this.AghsStatusContainer.x = ScaleHeight(-6, screenSize)
		this.AghsStatusContainer.y =
			this.AbilitiesContainer.pos2.y -
			this.AghsStatusContainer.Height -
			ScaleHeight(24, screenSize)
		let aghsStatusContainerStart = this.RootInnateDisplay.pos2.x
		const AbilitiesContainerMargin = ScaleWidth(2, screenSize)
		const extendedAbilities = abilitiesCount >= 5
		const AbilitySize = extendedAbilities ? 58 : 64,
			AbilityMarginBottom1 = extendedAbilities ? 24 : 25,
			AbilityMarginBottom2 = extendedAbilities ? 8 : 0
		for (let i = 0; i < abilitiesCount; i++) {
			const AbilityRect = new Rectangle()
			AbilityRect.Width = ScaleWidth(AbilitySize, screenSize)
			AbilityRect.Height = ScaleHeight(AbilitySize, screenSize)
			AbilityRect.x =
				i === 0
					? this.RootInnateDisplay.pos2.x - AbilitiesContainerMargin
					: this.AbilitiesRects[i - 1].pos2.x
			AbilityRect.y =
				this.AbilitiesContainer.pos2.y -
				AbilityRect.Height -
				ScaleHeight(AbilityMarginBottom1, screenSize) -
				ScaleHeight(AbilityMarginBottom2, screenSize)
			this.AbilitiesRects.push(AbilityRect)
			aghsStatusContainerStart = AbilityRect.pos2.x - AbilitiesContainerMargin
		}
		this.AghsStatusContainer.x += aghsStatusContainerStart
		this.AbilitiesContainer.pos2.x = Math.max(
			this.AbilitiesContainer.pos2.x,
			this.AghsStatusContainer.pos2.x
		)

		let maxX = this.AbilitiesContainer.pos2.x + ScaleWidth(302, screenSize)

		this.InventoryContainer.Width = ScaleWidth(202, screenSize)
		this.InventoryContainer.Height = ScaleHeight(145, screenSize)
		this.InventoryContainer.x =
			maxX - this.InventoryContainer.Width - ScaleWidth(93, screenSize)
		this.InventoryContainer.y = screenSize.y - this.InventoryContainer.Height
		maxX = Math.max(maxX, this.InventoryContainer.pos2.x + ScaleWidth(93, screenSize))

		const MaininventoryItemWidth = ScaleWidth(60, screenSize),
			MainInventoryItemHeight = ScaleHeight(45, screenSize),
			MainInventoryItemMarginHorizontal = ScaleWidth(3, screenSize),
			MainInventoryItemMarginVertical = ScaleHeight(2, screenSize)
		const MaininventoryX = this.InventoryContainer.x + ScaleWidth(3, screenSize)
		const MainInventoryRow1Container = new Rectangle()
		MainInventoryRow1Container.Width = ScaleWidth(200, screenSize)
		MainInventoryRow1Container.Height = ScaleWidth(50, screenSize)
		MainInventoryRow1Container.x = MaininventoryX
		MainInventoryRow1Container.y =
			this.InventoryContainer.y + ScaleHeight(6, screenSize)
		for (let i = 0; i < 3; i++) {
			const ItemRect = new Rectangle()
			ItemRect.Width = MaininventoryItemWidth
			ItemRect.Height = MainInventoryItemHeight
			ItemRect.x = MainInventoryRow1Container.x + MainInventoryItemMarginHorizontal
			ItemRect.y = MainInventoryRow1Container.y + MainInventoryItemMarginVertical
			MainInventoryRow1Container.x +=
				ItemRect.Width + MainInventoryItemMarginHorizontal * 2
			this.MainInventorySlots.push(ItemRect)
		}

		const MainInventoryRow2Container = new Rectangle()
		MainInventoryRow2Container.Width = MainInventoryRow1Container.Width
		MainInventoryRow2Container.Height = MainInventoryRow1Container.Height
		MainInventoryRow2Container.x = MaininventoryX
		MainInventoryRow2Container.y =
			MainInventoryRow1Container.pos2.y - ScaleHeight(2, screenSize)
		for (let i = 0; i < 3; i++) {
			const ItemRect = new Rectangle()
			ItemRect.Width = MaininventoryItemWidth
			ItemRect.Height = MainInventoryItemHeight
			ItemRect.x = MainInventoryRow2Container.x + MainInventoryItemMarginHorizontal
			ItemRect.y = MainInventoryRow2Container.y + MainInventoryItemMarginVertical
			MainInventoryRow2Container.x +=
				ItemRect.Width + MainInventoryItemMarginHorizontal * 2
			this.MainInventorySlots.push(ItemRect)
		}

		const BackpackItemWidth = ScaleWidth(60, screenSize)
		const BackpackContainer = new Rectangle()
		BackpackContainer.Height = ScaleWidth(34, screenSize)
		BackpackContainer.x = this.InventoryContainer.x + ScaleWidth(6, screenSize)
		BackpackContainer.y = this.InventoryContainer.y + ScaleHeight(104, screenSize)
		for (let i = 0; i < 3; i++) {
			const ItemRect = new Rectangle()
			ItemRect.Width = BackpackItemWidth
			ItemRect.Height = BackpackContainer.Height
			ItemRect.x =
				BackpackContainer.x +
				ScaleWidth(3, screenSize) -
				ScaleWidth(4, screenSize)
			ItemRect.y = BackpackContainer.y
			BackpackContainer.x += ItemRect.Width + ScaleWidth(3, screenSize) * 2
			this.BackpackSlots.push(ItemRect)
		}

		this.RightFlare.Width = ScaleWidth(92, screenSize)
		this.RightFlare.Height = ScaleHeight(138, screenSize)
		this.RightFlare.x = maxX - ScaleWidth(1, screenSize) - this.RightFlare.Width
		this.RightFlare.y = screenSize.y - this.RightFlare.Height

		const NeutralAndTPWidth = ScaleWidth(48, screenSize),
			NeutralAndTPHeight = ScaleHeight(48, screenSize)
		this.NeutralAndTPContainer.Width = NeutralAndTPWidth
		this.NeutralAndTPContainer.Height = ScaleHeight(128, screenSize)
		this.NeutralAndTPContainer.x =
			maxX - ScaleWidth(44, screenSize) - this.NeutralAndTPContainer.Width
		this.NeutralAndTPContainer.y = screenSize.y - this.NeutralAndTPContainer.Height

		const NeutralAndTPPaddingWidth = ScaleWidth(2, screenSize),
			NeutralAndTPPaddingHeight = ScaleHeight(2, screenSize)
		const NeutralAndTPWidthPadded = NeutralAndTPWidth - NeutralAndTPPaddingWidth * 2,
			NeutralAndTPHeightPadded = NeutralAndTPHeight - NeutralAndTPPaddingHeight * 2
		const BaseNeutralAndTPHeight =
			screenSize.y - NeutralAndTPHeight + NeutralAndTPPaddingHeight
		this.TPSlot.Width = NeutralAndTPWidthPadded
		this.TPSlot.Height = NeutralAndTPHeightPadded
		this.TPSlot.x = this.NeutralAndTPContainer.x + NeutralAndTPPaddingWidth
		this.TPSlot.y = BaseNeutralAndTPHeight - ScaleHeight(9, screenSize)

		this.NeutralSlot.Width = NeutralAndTPWidthPadded
		this.NeutralSlot.Height = NeutralAndTPHeightPadded
		this.NeutralSlot.x = this.TPSlot.x
		this.NeutralSlot.y = BaseNeutralAndTPHeight - ScaleHeight(62, screenSize)

		this.HealthManaContainer.Height = ScaleHeight(26, screenSize) * 2
		this.HealthManaContainer.x = ScaleWidth(223, screenSize)
		this.HealthManaContainer.Width =
			maxX -
			ScaleWidth(40, screenSize) -
			ScaleWidth(266, screenSize) -
			this.HealthManaContainer.x
		this.HealthManaContainer.y =
			screenSize.y - ScaleHeight(8, screenSize) - this.HealthManaContainer.Height

		this.CenterEverything(screenSize, maxX, hudFlip)
	}

	public DebugDraw(): void {
		RendererSDK.FilledRect(
			this.LeftFlare.pos1,
			this.LeftFlare.Size,
			Color.Gray.SetA(128)
		)
		RendererSDK.FilledRect(this.XP.pos1, this.XP.Size, Color.Yellow.SetA(128))
		RendererSDK.FilledRect(
			this.Portrait.pos1,
			this.Portrait.Size,
			Color.Green.SetA(128)
		)
		RendererSDK.FilledRect(
			this.AbilitiesContainer.pos1,
			this.AbilitiesContainer.Size,
			Color.RoyalBlue.SetA(128)
		)
		RendererSDK.FilledRect(
			this.TalentTree.pos1,
			this.TalentTree.Size,
			Color.Red.SetA(128)
		)
		RendererSDK.FilledRect(
			this.RootInnateDisplay.pos1,
			this.RootInnateDisplay.Size,
			Color.Aqua.SetA(128)
		)
		this.AbilitiesRects.forEach(rect =>
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Fuchsia.SetA(128))
		)
		RendererSDK.FilledRect(
			this.AghsStatusContainer.pos1,
			this.AghsStatusContainer.Size,
			Color.Blue.SetA(128)
		)
		RendererSDK.FilledRect(
			this.InventoryContainer.pos1,
			this.InventoryContainer.Size,
			Color.Orange.SetA(128)
		)
		this.MainInventorySlots.forEach(rect =>
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Fuchsia.SetA(128))
		)
		this.BackpackSlots.forEach(rect =>
			RendererSDK.FilledRect(rect.pos1, rect.Size, Color.Fuchsia.SetA(128))
		)
		RendererSDK.FilledRect(
			this.NeutralAndTPContainer.pos1,
			this.NeutralAndTPContainer.Size,
			Color.White.SetA(128)
		)
		RendererSDK.FilledRect(
			this.RightFlare.pos1,
			this.RightFlare.Size,
			Color.Gray.SetA(128)
		)
		RendererSDK.FilledRect(
			this.TPSlot.pos1,
			this.TPSlot.Size,
			Color.Fuchsia.SetA(128)
		)
		RendererSDK.FilledRect(
			this.NeutralSlot.pos1,
			this.NeutralSlot.Size,
			Color.Fuchsia.SetA(128)
		)
		RendererSDK.FilledRect(
			this.HealthManaContainer.pos1,
			this.HealthManaContainer.Size,
			Color.Aqua.SetA(128)
		)
	}

	private CenterEverything(screenSize: Vector2, maxX: number, hudFlip: boolean): void {
		let baseX = Math.floor((screenSize.x - maxX) / 2)
		if (hudFlip) {
			baseX++
		}
		this.LeftFlare.x += baseX
		this.Portrait.x += baseX
		this.XP.x += baseX
		this.RootInnateDisplay.x += baseX
		this.TalentTree.x += baseX
		this.AbilitiesRects.forEach(rect => (rect.x += baseX))
		this.AghsStatusContainer.x += baseX
		this.InventoryContainer.x += baseX
		this.MainInventorySlots.forEach(rect => (rect.x += baseX))
		this.BackpackSlots.forEach(rect => (rect.x += baseX))
		this.NeutralAndTPContainer.x += baseX
		this.NeutralSlot.x += baseX
		this.TPSlot.x += baseX
		this.RightFlare.x += baseX
		this.HealthManaContainer.x += baseX
		this.AbilitiesContainer.x += baseX
	}
}
