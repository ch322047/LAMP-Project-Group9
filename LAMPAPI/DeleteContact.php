<?php
    $inData = getRequestInfo();
    
    $contact = $inData["ContactId"];
    $userId = $inData["OwnerId"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331"); 
    if($conn->connect_error)
    {
        returnWithError( $conn->connect_error);
    }
    else
    {
       $stmt = $conn->prepare("DELETE FROM Contacts WHERE OwnerId = ? AND ContactId = ?");
        $stmt->bind_param("ii", $userId, $contact);
        $stmt->execute();
        $stmt->close();
        $conn->close();
        sendResultInfoAsJson('{"success":true}');
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