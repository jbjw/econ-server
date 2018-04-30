//

"use strict"

var myList = document.querySelector('ul');

var myRequest = new Request('products.json');

fetch(myRequest)
	.then(function(response) { return response.json(); })
	.then(function(data) {
		for (var i = 0; i < data.products.length; i++) {
			myList.appendChild(listItem)
		}
	})
