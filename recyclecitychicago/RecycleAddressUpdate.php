<?php
define("MAPS_HOST", "maps.google.com");
include 'config.php';
$link=mysqli_connect($dbhost,$dbuser,$dbpass,$dbname);
mysqli_select_db($link, "leed_2011"); 

// Select all the rows in the markers table
$query = "SELECT *
FROM ChicagoRecycle";

$result = mysqli_query($link,$query);
if (!$result) {
  die("Invalid query: " . mysql_error());
}

// Initialize delay in geocode speed
$delay = 0;
$base_url = "http://" . MAPS_HOST . "/maps/geo?output=xml";

// Iterate through the rows, geocoding each address
$num_results = mysqli_num_rows($result);
for ($i=0;$i<$num_results;$i++){

  $geocode_pending = true;
  $row = mysqli_fetch_array($result);
  while ($geocode_pending) {
    $address = $row["FullAddr"];
    $id = $row["ID"];
    $request_url = $base_url . "&q=" . urlencode($address);
    $xml = simplexml_load_file($request_url) or die("url not loading");

    $status = $xml->Response->Status->code;
    if (strcmp($status, "200") == 0) {
      // Successful geocode
      $geocode_pending = false;
      $coordinates = $xml->Response->Placemark->Point->coordinates;
      $coordinatesSplit = split(",", $coordinates);
      // Format: Longitude, Latitude, Altitude
      $lat = $coordinatesSplit[1];
      $lng = $coordinatesSplit[0];

	    $lat = mysqli_real_escape_string($link, $lat);
        $lng = mysqli_real_escape_string($link, $lng);
        $id = mysqli_real_escape_string($link, $id);
			 
      $query = "UPDATE ChicagoRecycle SET Lat = '". $lat . "', Lng = '" . $lng . "' WHERE ID = '" . $id . "' ";

      $update_result = mysqli_query($link, $query);
      if (!$update_result) {
        die("Invalid query: " . mysqli_error($link));
      }
    } else if (strcmp($status, "620") == 0) {
      // sent geocodes too fast
      $delay += 100000;
    } else {
      // failure to geocode
      $geocode_pending = false;
      echo "ID " . $id . " failed. " . $status . "\n";
    }
    usleep($delay);
  }
}
?>
