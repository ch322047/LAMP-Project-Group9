<?php
	$inData = getRequestInfo();
	
	// Exit and return with error if userId wasn't sent
	if(!$inData["userId"])
	{
		returnWithError("Update Failed! Missing userId.");
		exit;
	}
	
	// Exit and return with error if at least 1 of the following contact info is missing
	if(!$inData["newFirstName"] || !$inData["newLastName"] || !$inData["newPhone"] || !$inData["newEmail"] || !$inData["contactId"])
	{
		returnWithError("Update Failed! Missing contact information.");
		exit;
	}

	// Establish connection to database
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if($conn->connect_error) // Connection failed
	{
		returnWithError("Update Failed! Failed to connect to MySQL: " . $conn->connect_error);
	}
	else
	{
		// Setup a query to get all rows in Contacts where OwnerId and ContactId are on the same row
		$stmt = $conn->prepare("select * from Contacts where OwnerId = ? and ContactId = ?");
		$stmt->bind_param("ii", $inData["userId"], $inData["contactId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
		
		// If OwnerId and ContactId not on same row for any row, then exit and return with error
		if(!$result->fetch_assoc())
		{
			returnWithError("Update Failed! Invalid userId / contactId combination.");
			$stmt->close();
			$conn->close();
			exit;
		}
		
		// Done with last query
		$stmt->close();
		
		// Set up a new query to update Contacts
		$stmt = $conn->prepare("update Contacts set FirstName = ?, LastName = ?, Phone = ?, Email = ? where (OwnerId = ? and ContactId = ?)");
		$stmt->bind_param("ssssii", $inData["newFirstName"], $inData["newLastName"], $inData["newPhone"], $inData["newEmail"], $inData["userId"], $inData["contactId"]);
		
		if(!$stmt->execute()) // If execute() fails
		{
			returnWithError("Update Failed!");
		}
		else
		{
			returnWithSuccess();
		}

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson($obj)
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError($err)
	{
		$retValue = '{"error": "' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
	
	function returnWithSuccess()
	{
		$retValue = '{"error": ""}';
		sendResultInfoAsJson($retValue);
	}
?>