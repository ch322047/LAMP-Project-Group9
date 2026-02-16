/*
  This js file contains functions that must remain unique to the contacts(home) page, and would otherwise cause errors
*/

/*
Found how to do this online!
https://stackoverflow.com/questions/7060750/detect-the-enter-key-in-a-text-input-field
*/


// Wait for DOM content to load
window.addEventListener("DOMContentLoaded", (event) => {
	// Detects enter press on search bar. Acts the same as pressing the search button
	document.getElementById("searchText").addEventListener('keyup', function (k) {
		if (k.key === 'Enter' || k.keyCode === 13) { /* keyCode is depricated, allows support for older browsers */
			// call searchContact from code.js
			searchContact();
		}
	});
});
