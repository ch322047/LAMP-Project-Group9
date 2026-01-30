
<?php

 	/*
    AI Assistance Disclosure
    This project was developed with assistance from generative AI tools:
    - **Tool**: ChatGPT 5.2
    - **Date**: January 26, 2026
    - **Scope**: Modify code to work with hashed passwords
    - **Use**: Helped me figure out how the code needs to be modified to verify hashed passwords

    All AI-generated code was reviewed, tested, and modified to meet 
    assignment requirements. Final implementation reflects my understanding 
    of the concepts.
    */

	/*ini_set('display_errors', 1);
	ini_set('display_startup_errors', 1);
	error_reporting(E_ALL);*/

	//read JSON and turn into array
	$inData = getRequestInfo();
	
	//pull fields from array or empty sring
	$login = $inData["login"] ?? "";
	$password = $inData["password"] ?? "";

	//connect to database and check if failed
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
		exit();
	}
	else
	{
		//prepare sql query and check if failed
		$stmt = $conn->prepare("SELECT UserId,FirstName,LastName, Password FROM Users WHERE Login=?");
		if (!$stmt)
		{
			returnWithError($conn->error);
			exit();
		}

		//bind actual values to placeholders
		$stmt->bind_param("s", $login);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($id, $firstName, $lastName, $hash);

		//verify password and return info if login exists, else return error
		if($stmt->fetch())
		{
			if( password_verify($password, $hash))
			{
				returnWithInfo($firstName, $lastName, $id);
				exit();
			}
			else
			{
				returnWithError("Invalid");
				exit();
			}
		}
		else
		{
			returnWithError("Invalid");
		}

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		//convert JSON to php array
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
