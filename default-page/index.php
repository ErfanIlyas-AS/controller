<?php

//first check for local env var
$envVarsFilePath = '/var/www/env-vars-controller-local.ini';
if( !file_exists($envVarsFilePath) ) {
	
	$envVarsFilePath = '/var/www/env-vars-controller.ini';
	if( !file_exists($envVarsFilePath) ) {
		echo getcwd().' Please setup '.$envVarsFilePath;
		die;
	}
	
}
$evnVars = parse_ini_file( $envVarsFilePath, false, INI_SCANNER_TYPED );

define( 'COMPOSER_AUTOLOAD_FILE_PATH', 		$evnVars['COMPOSER_AUTOLOAD_FILE_PATH'] );
//define databse connection here
define( 'WAAS1_CONTROLLER_DB_HOST', 		$evnVars['WAAS1_CONTROLLER_DB_HOST'] );
define( 'WAAS1_CONTROLLER_DB_NAME', 		$evnVars['WAAS1_CONTROLLER_DB_NAME'] );
define( 'WAAS1_CONTROLLER_DB_USER', 		$evnVars['WAAS1_CONTROLLER_DB_USER'] );
define( 'WAAS1_CONTROLLER_DB_PASSWORD', 	$evnVars['WAAS1_CONTROLLER_DB_PASSWORD'] );


//require composer autoload
chdir( dirname(__FILE__) ); //Change the working directory to the running file path. Just use
require_once( COMPOSER_AUTOLOAD_FILE_PATH );

$db = new Zebra_Database();
$db->debug = false;
$db->resource_path = '/';
$db->connect( WAAS1_CONTROLLER_DB_HOST, WAAS1_CONTROLLER_DB_USER, WAAS1_CONTROLLER_DB_PASSWORD, WAAS1_CONTROLLER_DB_NAME ); //providing port is important now.



$platFormBranding = getPlatFormBranding( $db );



function getPlatFormBranding( $db ){
	
	$returnArray = array();

	
	$db->select( 'value', 'options', 'name = ?', array('PLATFORM_BRAND_LOGO_URL') );
	$result = $db->fetch_assoc();
	$returnArray['PLATFORM_BRAND_LOGO_URL'] = $result['value'];
	
	$db->select( 'value', 'options', 'name = ?', array('PLATFORM_BRAND_LOGO_URL_BLACK') );
	$result = $db->fetch_assoc();
	$returnArray['PLATFORM_BRAND_LOGO_URL_BLACK'] = $result['value'];
	
	$db->select( 'value', 'options', 'name = ?', array('PLATFORM_BRAND_BACKGROUND_COLOR') );
	$result = $db->fetch_assoc();
	$returnArray['PLATFORM_BRAND_BACKGROUND_COLOR'] = $result['value'];
	
	$db->select( 'value', 'options', 'name = ?', array('PLATFORM_BRAND_BACKGROUND_COLOR_BLACK') );
	$result = $db->fetch_assoc();
	$returnArray['PLATFORM_BRAND_BACKGROUND_COLOR_BLACK'] = $result['value'];
	
	$db->select( 'value', 'options', 'name = ?', array('PLATFORM_BRAND_PRIMARY_COLOR') );
	$result = $db->fetch_assoc();
	$returnArray['PLATFORM_BRAND_PRIMARY_COLOR'] = $result['value'];
	
	$db->select( 'value', 'options', 'name = ?', array('PLATFORM_BRAND_PRIMARY_COLOR_BLACK') );
	$result = $db->fetch_assoc();
	$returnArray['PLATFORM_BRAND_PRIMARY_COLOR_BLACK'] = $result['value'];
	
	
	
	$db->select( 'value', 'options', 'name = ?', array('PLATFORM_BRAND_SITE_URL') );
	$result = $db->fetch_assoc();
	$returnArray['PLATFORM_BRAND_SITE_URL'] = $result['value'];
	
	$db->select( 'value', 'options', 'name = ?', array('PLATFORM_BRAND_NAME') );
	$result = $db->fetch_assoc();
	$returnArray['PLATFORM_BRAND_NAME'] = $result['value'];
	


	
	return $returnArray;
}



?>



<!DOCTYPE HTML>
<html lang="en">
<head>
<title><?php echo $platFormBranding['PLATFORM_BRAND_NAME']; ?> Default Page</title>
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta charset="UTF-8">
<link href="styles.css" rel="stylesheet">
<link href="responsive.css" rel="stylesheet">
</head>


<style>
.main-area:after {
	background: <?php echo $platFormBranding['PLATFORM_BRAND_BACKGROUND_COLOR']; ?>;
}
</style>
<body>





<div class="main-area center-text">
	<div class="display-table">
		<div class="display-table-cell">
		<img src="<?php echo $platFormBranding['PLATFORM_BRAND_LOGO_URL']; ?>" style="max-width:50%" />
		<p class="desc">
		This website is either suspended or under construction. If you think this is an error please contact at 
		<a href="<?php echo $platFormBranding['PLATFORM_BRAND_SITE_URL']; ?>" target="_blank">
			<?php echo $platFormBranding['PLATFORM_BRAND_SITE_URL']; ?>
		</a>
		</p>
		</div>
	</div>
</div>










</body>
</html>