
<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

    /*
    AI Assistance Disclosure
    This project was developed with assistance from generative AI tools:
    - **Tool**: ChatGPT 5.2
    - **Date**: January 24, 2026
    - **Scope**: Debugging and explanations
    - **Use**: Helped me figure out why my code was not working, helped me understand logical errors 
    and provided lines of code to fix them, found typos

    All AI-generated code was reviewed, tested, and modified to meet 
    assignment requirements. Final implementation reflects my understanding 
    of the concepts.
    */

    /*ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);*/

	//read JSON and turn it into php array	
	$inData = getRequestInfo();

	//pull fields out of array or assign empty string
	$firstName = $inData["firstName"] ?? "";
	$lastName = $inData["lastName"] ?? "";
    $login = $inData["login"] ?? "";
    $password = $inData["password"] ?? "";

	//connect to mysql
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 

	if( $conn->connect_error ) //throw error if database not connected
	{
		returnWithError( $conn->connect_error );
        exit();
	}
	else
	{
        //input validation
        if($firstName === "" || $lastName === "" || $login === "" || $password === "")
        {
            returnWithError("Missing fields");
            $conn->close();
            exit();
        }

        //add new user
        $hash = password_hash($password, PASSWORD_DEFAULT);

		//prepare insert statement with placeholders
        $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?,?,?, ?)");
        if(!$stmt) //check if prepare failed
        {
            returnWithError($conn->error);
            $conn->close();
            exit();
        }

		//bind actual values with placeholders
        $stmt->bind_param("ssss", $firstName, $lastName, $login, $hash);
        
        if($stmt->execute()) //execute insert
        {
            $newId = $conn->insert_id; //get the new user id
            returnInfo($firstName, $lastName, $newId); //return JSON

        }else
		{
			//if execute failed, return error
            returnWithError($stmt->error);
            exit();

        }
		
        $stmt->close();
        $conn->close();
	}
	
	function getRequestInfo()
	{
		//reads raw JSON from the http and turns it into an array
		return json_decode(file_get_contents('php://input'), true);
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultAsJson( $retValue );
	}

	function sendResultAsJson($obj)
    {
		//sends JSON with correct header
        header("Content-type: application/json");
        echo $obj;
    }

    function returnInfo($firstName, $lastName, $id)
    {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
        sendResultAsJson($retValue);
    }
	
?>
