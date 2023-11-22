// import { ArrayExtensions, Menu } from "../../wrapper/Imports"

// class Test {}
// const arr = [...new Array(100_000)].fill(new Test())
// const arr2 = [...new Array(100_000)].fill(new Test())

// const menu = Menu.AddEntry("Test")

// menu.SortNodes = false

// const key = menu.AddKeybind("ArrayExtensions.arrayRemove")
// const key2 = menu.AddKeybind("Array.prototype.remove")

// key.OnRelease(() => {
// 	let count = 0
// 	const start = hrtime()
// 	for (let index = arr.length - 1; index > -1; index--) {
// 		const element = arr[index]
// 		ArrayExtensions.arrayRemove(arr, element)
// 		count++
// 	}
// 	console.log(`
// 		Use: [ArrayExtensions.arrayRemove]
// 		Time: ${hrtime() - start} ms,
// 		Removed: ${count}k elements
// 	`)
// })

// key2.OnRelease(() => {
// 	let count = 0
// 	const start = hrtime()
// 	for (let index = arr2.length - 1; index > -1; index--) {
// 		const element = arr2[index]
// 		const id = arr2.indexOf(element)
// 		if (id !== -1) {
// 			arr2.splice(id, 1)
// 			count++
// 		}
// 	}
// 	console.log(`
// 		Use: [indexOf + splice]
// 		Time: ${hrtime() - start} ms,
// 		Removed: ${count}k elements
// 	`)
// })
