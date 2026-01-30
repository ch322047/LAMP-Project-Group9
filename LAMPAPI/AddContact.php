<?php
   
    $inData = getRequestInfo();
    
    if ($inData === null) {
        returnWithError("Invalid JSON or missing Content-Type: application/json");
        exit();
    }


    $userId = $inData["userId"] ?? $inData["OwnerId"] ?? null;

    
    if ($userId === null) {
        returnWithError('Missing required field: userId (or OwnerId). Sent keys: ' . implode(", ", array_keys($inData)));
        exit();
    }

    $FirstName = $inData["FirstName"] ?? "";
    $LastName = $inData["LastName"] ?? "";
    $Email = $inData["Email"] ?? "";
    $Phone = $inData["Phone"] ?? "";

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 
    if($conn->connect_error)
    {
        returnWithError( $conn->connect_error);
        exit();
    }
    else
    {
        $stmt = $conn->prepare("INSERT into Contacts (OwnerId, FirstName, LastName, Phone, Email) VALUES(?,?, ?, ?, ?)"); 
        $stmt->bind_param("issss",$userId, $FirstName, $LastName, $Phone, $Email);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        sendResultInfoAsJson('{"error":"","message":"Contact added"}');

    }

    function getRequestInfo()
    {
        return json_decode(file_get_contents('php://input'), true);
    }

   function sendResultInfoAsJson ( $obj )
   {
        header('Content-type: application/json');
        echo $obj;
   } 

   function returnWithError( $err )
   {
        $retValue = '{"error":"' . $err . '"}';
        sendResultInfoAsJson( $retValue );
   }

?>