const urlBase = 'https://lampstackprojectgroup9.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

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

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}

function addContact()
{
	let fName = document.getElementById("fNameText").value;
	let lName = document.getElementById("lNameText").value;
	let newPhone = document.getElementById("phoneText").value;
	let newEmail = document.getElementById("emailText").value;
	document.getElementById("contactAddResult").innerHTML = "";

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
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("contactAddResult").innerHTML = err.message;
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
								<th>Delete</th>
								<th>Edit</th>
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
    								class="buttons"    
									onclick="deleteContact(${entry.ContactId})">
									Delete Contact
  									</button>
								</td>

								<td>
  									<button
									type="button"
    								class="buttons"    
									onclick="editContact(${entry.ContactId})">
									Edit Contact
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
