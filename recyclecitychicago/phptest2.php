<?php
$xmlDoc = new DOMDocument();
$xmlDoc->load("http://www.jihoonson.com/CApps/RecycleAddressData2.php");

print $xmlDoc->saveXML();
?> 