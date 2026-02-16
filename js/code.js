const urlBase = 'https://lampstackprojectgroup9.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

/* pageLength describes how many entries can be displayed on one page
This is a variable instead of a constant as users may be allowed to modify preferences in a "later version".
*/
let pageLength = 5;
let pages = 1; // how many pages to show
let currentPage = 1; // current viewed page

// JSON contacts contents
let jsonObjectResult = null;

// If the user is modifying an existing contact, modifyId will equal that contact's Id.
// Otherwise, modifyId will be null (adds a new contact with given information)
let modifyId = null;

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";

	let loginBox = document.getElementById("loginName");
	let passwordBox = document.getElementById("loginPassword");
	
	let login = loginBox.value;
	let password = passwordBox.value;
//	var hash = md5( password );

	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );

	
	// validate neither fields are blank
	let fieldsValid = true;
	let errorMessages = [];

	// Validate username (min 8 characters, max 20 characters)
	if (!/^\S/.test(login) || /\\/.test(login) || login.length > 20) {
		loginBox.classList.add("invalidField");
		fieldsValid = false;
        if (login == "") {
			errorMessages.push("Username is required");
		} else if (login.length > 20) {
			errorMessages.push("Username must be 20 characters or less");
		}
	} else {
		loginBox.classList.remove("invalidField");
	}

	// validate password
	if (!/^\S/.test(password) || /\\/.test(password) || password.length > 20) {
		passwordBox.classList.add("invalidField");
		fieldsValid = false;
        if (password == "") {
			errorMessages.push("Password is required");
		} else if (password.length > 20) {
			errorMessages.push("Password must be 20 characters or less");
		}
	} else {
		passwordBox.classList.remove("invalidField");
	}

	// if any fields are blank, do not send data to login
	if (!fieldsValid) {
		document.getElementById("loginResult").innerHTML = errorMessages.join("<br>");
		return;
	}

	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "Incorrect Username or Password.";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}



// redirect to a different page
function redirect(page){
	window.location.href = page;
}


function doRegister(){
	//clearing these values and initialzing global variables
	userId = 0;
	firstName = "";
	lastName = "";
	
	//gets the text typed into these fields for the local variables
	let fNameBox = document.getElementById("registerFirstName");
	let lNameBox = document.getElementById("registerLastName");
	let loginBox = document.getElementById("registerUsername");
	let passwordBox = document.getElementById("registerPassword");
    
    //gets the text typed into these fields for the local variables
	let fName = fNameBox.value;
	let lName = lNameBox.value;
	let login = loginBox.value;
	let password = passwordBox.value;
//	var hash = md5( password );
	
	//clears any old login failed messages
	document.getElementById("registerResult").innerHTML = "Registering...";

        // Validate all fields
    let fieldsValid = true;
    let errorMessages = [];

    // Copied logic from login validation.
    // Validate first name only, 1-20 characters
    if (fName == "" || !/^[A-Za-z]{1,20}$/.test(fName) || /\\/.test(fName)) {
        fNameBox.classList.add("invalidField");
        fieldsValid = false;
        if (fName == "") {
			errorMessages.push("First name is required");
		} else if (!/^[A-Za-z]+$/.test(fName)) {
			errorMessages.push("First name must contain only letters");
		} else if (fName.length > 20) {
			errorMessages.push("First name must be 20 characters or less");
		} else if (/\\/.test(fName)) {
			errorMessages.push("No fields may contain a \ charachter");
		}
    } else {
        fNameBox.classList.remove("invalidField");
    }
    
    // Validate last name letters only, 1-20 characters
    if (lName == "" || !/^[A-Za-z]{1,20}$/.test(lName) || /\\/.test(lName)) {
        lNameBox.classList.add("invalidField");
        fieldsValid = false;
        if (lName == "") {
			errorMessages.push("Last name is required");
		} else if (!/^[A-Za-z]+$/.test(lName)) {
			errorMessages.push("Last name must contain only letters");
		} else if (lName.length > 20) {
			errorMessages.push("Last name must be 20 characters or less");
		} else if (/\\/.test(lName)) {
			errorMessages.push("No fields may contain a \ charachter");
		}
    } else {
        lNameBox.classList.remove("invalidField");
    }
    
    // Validate username not empty and max 20 chars
    if (login == "" || login.length > 20 || /\\/.test(login)) {
        loginBox.classList.add("invalidField");
        fieldsValid = false;
        if (login == "" ) {
			errorMessages.push("Username is required");
		} else if (login.length > 20) {
			errorMessages.push("Username must be 20 characters or less");
		} else if (/\\/.test(login)) {
			errorMessages.push("No fields may contain a \ charachter");
		}
    } else {
        loginBox.classList.remove("invalidField");
    }
    
    // Validate password 8 to 20 chars
    if (password.length < 7 || password.length > 20 || /\\/.test(password)) {
        passwordBox.classList.add("invalidField");
        fieldsValid = false;
        if (password.length < 7) {
			errorMessages.push("Password must be at least 7 characters");
		} else if (password.length > 20) {
			errorMessages.push("Password must be 20 characters or less");
		} else if (/\\/.test(password)) {
			errorMessages.push("No fields may contain a \ charachter");
		}
    } else {
        passwordBox.classList.remove("invalidField");
    }
    
    // If any fields are invalid, show error message and return
    if (!fieldsValid) {
        document.getElementById("registerResult").innerHTML = errorMessages.join("<br>");
        return;
    }

	//displays registering message
	document.getElementById("registerResult").innerHTML = "Registering...";

	//create the data to send to the server into a JSON string
	let tmp = {firstName:fName,lastName:lName,login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	//builds the REGISTER URL
	let url = urlBase + '/Register.' + extension;

	//creating the HTTP POST request to the Register.php
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		//Listening for server response
		xhr.onreadystatechange = function() 
		{
			// 4 means request finished, 200 means request was successful
			if (this.readyState == 4)
			{
				if(this.status !=200){
					document.getElementById("registerResult").innerHTML = "Server error: " + this.status;
					return;
				}
				
				//parse server response
				let jsonObject = JSON.parse( this.responseText );
				userId = jsonObject.id;
		
				//checking if register/sign up failed
				if( userId < 1 )
				{		
					document.getElementById("registerResult").innerHTML = jsonObject.error || "Unable to register/sign up";
					return;
				}
                
				//saving user info
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				//saving it to cookies
				saveCookie();
	
				//redirect to next screen
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	//error handling
	catch(err)
	{
		document.getElementById("registerResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = `${firstName} ${lastName}`;
	}
}

// Logout the user and return to the login page
function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}


// addContact will either add a contact with the given information or modify an existing contact to use the given information
// based on the value of modifyId.
function addContact()
{
	// get references to fields
	let fNameBox = document.getElementById("fNameText");
	let lNameBox = document.getElementById("lNameText");
	let phoneBox = document.getElementById("phoneText");
	let emailBox = document.getElementById("emailText");

	// get contents of fields
	let fName = fNameBox.value;
	let lName = lNameBox.value;
	let newPhone = phoneBox.value;
	let newEmail = emailBox.value;
	document.getElementById("contactAddResult").innerHTML = "";

	// validate data before contacting server

	fieldsValid = true;
	
	// validate first name (last name should be optional)
	if (!/^\S/.test(fName) || /\\/.test(fName)) {
		fNameBox.classList.add("invalidField");
		fieldsValid = false;
	} else {
		fNameBox.classList.remove("invalidField");
	}

	// validate last name (must NOT contain a `\`)
	if (/\\/.test(lName)) {
		lNameBox.classList.add("invalidField");
		fieldsValid = false;
	} else {
		lNameBox.classList.remove("invalidField");
	}

	// validate phone
	if (!(/^[0-9]{3}-[0-9]{2,3}-[0-9]{3,4}$/.test(newPhone))) {
		phoneBox.classList.add("invalidField");
		fieldsValid = false;
	} else {
		phoneBox.classList.remove("invalidField");
	}

	// validate email
	if (!(/^[^@\s]+@[^@\s]+\.[^@\s]+$/i.test(newEmail)) || /\\/.test(newEmail)) {
		emailBox.classList.add("invalidField");
		fieldsValid = false;
	} else {
		emailBox.classList.remove("invalidField");
	}

	// if any fields are invalid, do not send!
	if (!fieldsValid) {
		return;
	}
	
	// Determine whether to add or edit based on modifyId
	if (modifyId == null) {
		// Add a new contact
		let tmp = {FirstName:fName,LastName:lName,Phone:newPhone,Email:newEmail,userId:userId};
		let jsonPayload = JSON.stringify( tmp );
	
		let url = urlBase + '/AddContact.' + extension;
		
		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					document.getElementById("contactAddResult").innerHTML = "Contact has been added";
					setTimeout(function() {
						document.getElementById("contactAddResult").innerHTML = "";
					}, 3000);
					searchContact(); // update table
					//updatePage(); // update table
					hideAddContactMenu(); // close menu
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("contactAddResult").innerHTML = err.message;
		}
	} else {
		// Modify an existing contact
		let tmp = {newFirstName:fName,newLastName:lName,newPhone:newPhone,newEmail:newEmail,userId:userId,contactId:modifyId};
		let jsonPayload = JSON.stringify( tmp );

		let url = urlBase + '/UpdateContact.' + extension;
		let xhr = new XMLHttpRequest();
		xhr.open("POST", url, true);
		xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
		try
		{
			xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) 
				{
					document.getElementById("contactAddResult").innerHTML = "Contact has been updated";
					setTimeout(function() {
						document.getElementById("contactAddResult").innerHTML = "";
					}, 3000);
					searchContact(); // update table
					//updatePage(); // update table
					hideAddContactMenu(); // close menu
				}
			};
			xhr.send(jsonPayload);
		}
		catch(err)
		{
			document.getElementById("contactAddResult").innerHTML = err.message;
		}
	}
	
}

function searchContact()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("contactSearchResult").innerHTML = "";

	let tableHTML = "";

	let tmp = { search: srch, userId: userId };
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/SearchContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState == 4 && this.status == 200)
			{
				jsonObjectResult = JSON.parse(xhr.responseText);

				if (jsonObjectResult.results && jsonObjectResult.results.length > 0)
				{

					pages = Math.ceil(jsonObjectResult.results.length / pageLength); // get amount of pages
					currentPage = 1; // return to page 1


					document.getElementById("contactSearchResult").innerHTML =
						`Found ${jsonObjectResult.results.length} contacts`;
				}
				else
				{
					document.getElementById("contactSearchResult").innerHTML =
						"No matching contacts found";
				}

				updatePage();

			}
		};

		xhr.send(jsonPayload);
	}
	catch (err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}


/* Page Functions
These functions show the current page and manage navigating them
*/
function updatePage() {

	// update page label
	document.getElementById("pageLabel").innerHTML = `Page ${currentPage} of ${pages}`;


	// if no content exists, do not create the table and hide page buttons
	if(!jsonObjectResult.results || jsonObjectResult.results.length == 0) {
		document.getElementById("pagesDiv").hidden = true;
		document.getElementById("contactList").innerHTML = ``;
		return;
	}
	// reveal page buttons if hidden
	document.getElementById("pagesDiv").hidden = false;
	
	// Only display contacts up to pageLength
	let maxDisplay = Math.min(pageLength, jsonObjectResult.results.length);

	// Start table
	tableHTML = `
		<table border="1" cellpadding="5" cellspacing="0">
			<tr>
				<th>First Name</th>
				<th>Last Name</th>
				<th>Phone</th>
				<th>Email</th>
				<th>Edit</th>
				<th>Delete</th>
			</tr>
	`;
	
	// Create the chart
	for (let i = 0; i < maxDisplay; i++)
	{
		let entry = jsonObjectResult.results[i + (currentPage-1)*pageLength];
		if (entry == null) break;

		tableHTML += `
			<tr>
				<td>${entry.FirstName}</td>
				<td>${entry.LastName}</td>
				<td>${entry.Phone}</td>
				<td>${entry.Email}</td>
				<td>
					<button
					type="button"
					class="buttons iconButtons"    
					onclick="editContact(${entry.ContactId},'${entry.FirstName}','${entry.LastName}','${entry.Phone}','${entry.Email}')">
					<img src="images/svg/edit-3.svg" alt="Edit">
					</button>
				</td>
				
				<td>
					<button
					type="button"
					class="buttons iconButtons"    
					onclick="deleteContact(${entry.ContactId})">
					<img src="images/svg/trash-2.svg" alt="Delete">
					</button>
				</td>

			</tr>
		`;
	}

	// End table
	tableHTML += "</table>";

	// Put table on the page
	document.getElementById("contactList").innerHTML = tableHTML;
	
}

// move back a page
function pagePrev() {
	if (currentPage <= 1) return; // do not move out of bounds

	// decrement current page
	currentPage--;
	
	// update the page
	updatePage();
}

// move forwards a page
function pageNext() {
	if (currentPage >= pages) return; // do not move out of bounds

	// increment the page
	currentPage++;
	
	// update the page
	updatePage();
}


// Edit a contact, called from the edit button next to each entry
// This function will NOT edit a contact, it will simply fill in the add contact fields with the contact's information.
// UpdateContact.php will instead be called from addContact, if "modifyId" is not null.
function editContact(ContactId, FirstName, LastName, Phone, Email){

	// show contact menu
	revealAddContactMenu();
	
	// set modifyId to ContactId of the selected contact
	modifyId = ContactId;

	// Change submit button text
	document.getElementById("submitContactButton").innerHTML = "Submit Changes";
	
	// Fill in the contact fields with the existing contact information
	document.getElementById("fNameText").value = FirstName;
	document.getElementById("lNameText").value = LastName;
	document.getElementById("phoneText").value = Phone;
	document.getElementById("emailText").value = Email;
}

// Open menu to add a new contact
// This is NOT the same as addContact, which actually adds the new contact.
// This function wipes the fields clear and brings up the menu
function revealAddContactMenu() {

	// reveal
	document.getElementById("windowBG").hidden=false;

	// remove main page from focus path
	document.getElementById("accessUIDiv").setAttribute("inert","");
	document.getElementById("loggedInDiv").setAttribute("inert","");

	// set focus to first field in the window (first name box)
	document.getElementById("fNameText").focus();
	
	// set modifyId to null
	modifyId = null;

	// Change submit button text
	document.getElementById("submitContactButton").innerHTML = "Add Contact";

	// wipe fields
	document.getElementById("fNameText").value = "";
	document.getElementById("lNameText").value = "";
	document.getElementById("phoneText").value = "";
	document.getElementById("emailText").value = "";
}

// hide the contactFieldsBox
function hideAddContactMenu() {
	document.getElementById("windowBG").hidden=true;

	// add main page to focus path
	document.getElementById("accessUIDiv").removeAttribute("inert");
	document.getElementById("loggedInDiv").removeAttribute("inert");

	// set focus to search bar
	document.getElementById("searchText").focus();

	// clear invalid field classes
	document.getElementById("fNameText").classList.remove("invalidField");
	document.getElementById("lNameText").classList.remove("invalidField");
	document.getElementById("phoneText").classList.remove("invalidField");
	document.getElementById("emailText").classList.remove("invalidField");
	
}


// Delete a contact, called from the delete button next to each entry
function deleteContact(ContactId){

	if (!confirm("Are you sure you want to delete this contact?"))
		return;

	let tmp = {ContactId:ContactId, OwnerId:userId};
	let jsonPayload = JSON.stringify(tmp);

	let url = urlBase + '/DeleteContact.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

	try
	{
		xhr.onreadystatechange = function()
		{
			if (this.readyState !== 4)
				return;
				
		 	if (this.status == 200)
			{
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.success === true)
				{
					//updatePage();
					searchContact();
				}
				else
				{
					alert("Delete failed");
				}
				
			}
			else
			{
				alert("Error deleting contact");
			}
		};

		xhr.send(jsonPayload);
	}
	catch (err)
	{
		document.getElementById("deleteContact").innerHTML = err.message;
	}
	
}
