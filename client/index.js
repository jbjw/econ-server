//

"use strict"

// var myList = document.querySelector("ul")



fetch("http://localhost:5000/all")
	.then(function (response) {
		return response.json()
	})
	.then(function (data) {
		document.body.textContent = JSON.stringify(data)
		// for (var i = 0; i < data.products.length; i++) {
		// 	myList.appendChild(listItem)
		// }
	})
