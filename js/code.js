const urlBase = 'https://lampstackprojectgroup9.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

// If the user is modifying an existing contact, modifyId will equal that contact's Id.
// Otherwise, modifyId will be null (adds a new contact with given information)
let modifyId = null;

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
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
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
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

function registerRedirect(){
	window.location.href = "registerPage.html";
}

function redirect(page){
	window.location.href = page;
}

function doRegister(){
	//clearing these values and initialzing global variables
	userId = 0;
	firstName = "";
	lastName = "";
	
	//gets the text typed into these fields for the local variables
	let fName = document.getElementById("registerFirstName").value;
	let lName = document.getElementById("registerLastName").value;
	let login = document.getElementById("registerUsername").value;
	let password = document.getElementById("registerPassword").value;
//	var hash = md5( password );
	
	//clears any old login failed messages
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
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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
	if (fName == "") {
		fNameBox.classList.add("invalidField");
		fieldsValid = false;
	} else {
		fNameBox.classList.remove("invalidField");
	}

	// validate phone
	if (!(/^[0-9]{3}-[0-9]{2,3}-[0-9]{3,4}$/.test(newPhone))) {
		phoneBox.classList.add("invalidField");
		fieldsValid = false;
	} else {
		phoneBox.classList.remove("invalidField");
	}

	// validate email
	if (!(/^[^@\s]+@[^@\s]+\.[^@\s]+$/i.test(newEmail))) {
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
					searchContact(); // update table
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
					searchContact(); // update table
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
				let jsonObject = JSON.parse(xhr.responseText);

				if (jsonObject.results && jsonObject.results.length > 0)
				{
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

					for (let i = 0; i < jsonObject.results.length; i++)
					{
						let entry = jsonObject.results[i];

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

					document.getElementById("contactSearchResult").innerHTML =
						"Contact(s) have been retrieved";
				}
				else
				{
					document.getElementById("contactSearchResult").innerHTML =
						"No matching contacts found";
				}

				// Put table on the page
				document.getElementsByTagName("p")[0].innerHTML = tableHTML;
			}
		};

		xhr.send(jsonPayload);
	}
	catch (err)
	{
		document.getElementById("contactSearchResult").innerHTML = err.message;
	}
}

// Edit a contact, called from the edit button next to each entry
// This function will NOT edit a contact, it will simply fill in the add contact fields with the contact's information.
// UpdateContact.php will instead be called from addContact, if "modifyId" is not null.
function editContact(ContactId, FirstName, LastName, Phone, Email){

	// show contact menu
	revealAddContactMenu();
	
	// set modifyId to ContactId of the selected contact
	modifyId = ContactId;
	
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
	document.getElementById("contactFieldsBox").hidden=false;
	
	// set modifyId to null
	modifyId = null;

	// wipe fields
	document.getElementById("fNameText").value = "";
	document.getElementById("lNameText").value = "";
	document.getElementById("phoneText").value = "";
	document.getElementById("emailText").value = "";
}

// hide the contactFieldsBox
function hideAddContactMenu() {
	document.getElementById("contactFieldsBox").hidden=true;
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
