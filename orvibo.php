<?php
	define('SWITCH_CACHE', __DIR__.'/switches.json');

	require('./orvfms/orvfms.php');

	$cmd = $argv[1];

	function getSwitches($refresh = false) {
		if ($refresh || !file_exists(SWITCH_CACHE)) {
			$switches = initS20Data();
			file_put_contents(SWITCH_CACHE, json_encode($switches));
		} else {
			$switches = json_decode(file_get_contents(SWITCH_CACHE), $assoc = true);
		}
		return $switches;
	}

	switch ($cmd) {
		case 'list':
			echo json_encode(getSwitches());
		break;
		case 'on':
			$switchId = $argv[2];
			$switches = getSwitches();
			actionAndCheck($switchId, 1, $switches);
		break;
		case 'off':
			$switchId = $argv[2];
			$switches = getSwitches();
			actionAndCheck($switchId, 0, $switches);
		break;
	}
?>
