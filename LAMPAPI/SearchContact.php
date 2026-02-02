<?php
	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	// Establish connection to database
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if( $conn->connect_error ) // Connection failed
	{
		returnWithError("Search Failed! Failed to connect to MySQL: " . $conn->connect_error);
	}
	else
	{
		// Setup a query to return all rows with FirstName or LastName for a given OwnerId
		$stmt = $conn->prepare("select * from Contacts where (FirstName like ? OR LastName like ?) and OwnerId = ?");
		$searchText = "%" . $inData["search"] . "%";
		$stmt->bind_param("ssi", $searchText, $searchText, $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();

		// Traverse the rows of results, saving each row and incrementing $searchCount appropriately
		while($row = $result->fetch_assoc())
		{
			// Put a comma in between search results (rows)
			if($searchCount > 0)
			{
				$searchResults .= ",";
			}
			
			$searchCount++;
			
			$searchResults .= '{"FirstName" : "' . $row["FirstName"].'", 
								"LastName" : "' . $row["LastName"].'", 
								"Phone" : "' . $row["Phone"].'", 
								"Email" : "' . $row["Email"].'"
								"ContactId" : "' .$row["ContactId"].'}';
		}
		
		if($searchCount == 0) // No search results
		{
			returnWithError("No Records Found");
		}
		else
		{
			returnWithInfo($searchResults);
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson($retValue);
	}
	
	function returnWithInfo($searchResults)
	{
		$retValue = '{"results": [' . $searchResults . '], "error": ""}';
		sendResultInfoAsJson($retValue);
	}
?>