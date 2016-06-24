<?php
include 'config.php';
$link=mysqli_connect($dbhost,$dbuser,$dbpass,$dbname);
mysqli_select_db($link, "leed_2011"); 


$sql = 'SELECT * FROM ChicagoRecycle ';
$result = mysqli_query($link,$sql);

function xmlentities($text)
  {
    $search = array('&','<','>','"','\'');
    $replace = array('&amp;','&lt;','&gt;','&quot;','&apos;');
    $text = str_replace($search,$replace,$text);
    return $text;
  }
header("Content-type:text/xml;charset=iso-8859-1");
echo'<shapes>';

if($result != 0){   
	
	$num_results = mysqli_num_rows($result);
	for ($i=0;$i<$num_results;$i++){
		$row = mysqli_fetch_array($result);
		$id = $row['ID'];

		$type = $row["TYPE"];
		$name = $row["NAME"];
		$addr = $row["Address"];
		$lat = $row["Lat"];
		$lng = $row["Lng"];
		$phone = $row["Phone"];
		$hrs = $row["Hours"];
		$cbrd = $row["Cardboard"];
		$gp = $row["GlassPlastic"];
		$met = $row["Metal"];

		echo '<pt ID="'. xmlentities(htmlspecialchars($id)) . '" Lat="'.xmlentities(htmlspecialchars($lat)).'" Lng="'.xmlentities(htmlspecialchars($lng)).'" Name="'.xmlentities(htmlspecialchars($name)).'" Type="' . xmlentities(htmlspecialchars($type)) . '" Address="' . xmlentities(htmlspecialchars($addr)) . '" Phone="' . xmlentities(htmlspecialchars($phone)) .'" Hours="' . xmlentities(htmlspecialchars($hrs)) .'" Cardboard="' . xmlentities(htmlspecialchars($cbrd)) .'" GlassPlastic="' . xmlentities(htmlspecialchars($gp)) .'" Metals="' . xmlentities(htmlspecialchars($met)) .'">';		
		
		echo '</pt>';
	}
}
else {
	echo 'Problem with query';
}

echo '</shapes>';

mysqli_close($link);
?>