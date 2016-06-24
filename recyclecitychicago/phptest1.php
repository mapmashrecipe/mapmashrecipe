<?php
$xmlDoc = new DOMDocument();
$xmlDoc->load("http://data.cmap.illinois.gov/API/REST/XML/json737/Data?geoglevel=CO&datafield=LANDFILL_CAPCTY");

print $xmlDoc->saveXML();
?> 