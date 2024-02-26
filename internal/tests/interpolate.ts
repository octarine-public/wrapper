// import {
// 	Color,
// 	EntityManager,
// 	EventsSDK,
// 	GameState,
// 	GridNav,
// 	Hero,
// 	MathSDK,
// 	RendererSDK,
// 	Vector2,
// 	Vector3
// } from "../../wrapper/Imports"

// function Interpolate(
// 	startPosition: Vector3,
// 	endPosition: Vector3,
// 	tickDuration: number,
// 	currentTime: number
// ) {
// 	currentTime = MathSDK.Clamp(currentTime, 0, tickDuration)
// 	const progress = currentTime / tickDuration
// 	return startPosition.Lerp(endPosition, progress)
// }

// const positions = new Map<Hero, Vector3>()
// const heroes = EntityManager.GetEntitiesByClass(Hero)
// EventsSDK.on("Tick", dt => {
// 	if (GridNav === undefined) {
// 		return
// 	}

// 	const currentTime = GameState.RawGameTime

// 	for (let index = heroes.length - 1; index > -1; index--) {
// 		const hero = heroes[index]
// 		if (!hero.IsVisible || !hero.IsAlive) {
//			positions.delete(hero)
// 			continue
// 		}

// 		const getPos = positions.get(hero)
// 		const interpolate = Interpolate(
// 			hero.Position,
// 			hero.IsMoving ? hero.InFront(GridNav.EdgeSize / 2) : hero.Position,
// 			dt,
// 			currentTime
// 		)
// 		if (getPos === undefined) {
// 			positions.set(hero, interpolate)
// 			continue
// 		}
// 		getPos.CopyFrom(interpolate)
// 	}
// })

// EventsSDK.on("Draw", () => {
// 	positions.forEach(position => {
// 		const w2s = RendererSDK.WorldToScreen(position)
// 		if (w2s === undefined) {
// 			return
// 		}
// 		const size = new Vector2(24, 24)
// 		RendererSDK.FilledRect(w2s.Subtract(size.DivideScalar(2)), size, Color.Red)
// 	})
// })
