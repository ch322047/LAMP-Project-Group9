/*
  This js file contains functions that must remain unique to the login page, and would otherwise cause errors
*/

/*
Found how to do this online!
https://stackoverflow.com/questions/7060750/detect-the-enter-key-in-a-text-input-field
*/
// Detects enter press on username field. Sends focus to the password box
document.getElementById("loginName").addEventListener('keyup', function (k) {
	if (k.key === 'Enter' || k.keyCode === 13) { /* keyCode is depricated, allows support for older browsers */
		document.getElementById("loginPassword").focus();
	}
});
// Detects enter press on password field. Acts as pressing the login button
document.getElementById("loginPassword").addEventListener('keyup', function (k) {
	if (k.key === 'Enter' || k.keyCode === 13) { /* keyCode is depricated, allows support for older browsers */
		doLogin();
	}
});
