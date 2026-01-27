
<?php

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

	$inData = getRequestInfo();
	
	$firstName = $inData["firstName"] ?? "";
	$lastName = $inData["lastName"] ?? "";
    $login = $inData["login"] ?? "";
    $password = $inData["password"] ?? "";

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

        $stmt = $conn->prepare("INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?,?,?, ?)");
        if(!$stmt)
        {
            returnWithError($conn->error);
            $conn->close();
            exit();
        }
        
        $stmt->bind_param("ssss", $firstName, $lastName, $login, $hash);
        
        if($stmt->execute())
        {
            $newId = $conn->insert_id;
            returnInfo($firstName, $lastName, $newId);

        }else{
            returnWithError($stmt->error);
            exit();

        }
		
        $stmt->close();
        $conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultAsJson( $retValue );
	}

	function sendResultAsJson($obj)
    {
        header("Content-type: application/json");
        echo $obj;
    }

    function returnInfo($firstName, $lastName, $id)
    {
        $retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
        sendResultAsJson($retValue);
    }
	
?>
