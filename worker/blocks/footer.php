<?php
if(!defined('DIRECTACCESS'))   die('Direct access not permitted'); //add this to every file included.

$filterOptionsArray = array(
  'PLATFORM_BRAND_NAME', 'PLATFORM_BRAND_SITE_URL', 'PLATFORM_BRAND_LOGO_URL',
);
$brandOptions = getMainWpControllerDetails( $filterOptionsArray );
?>


<footer class="footer">
	<div class="container-fluid pe-5 ps-5 text-end">
		<span class="text-muted me-5">Powered by <a href="<?php echo $brandOptions['PLATFORM_BRAND_SITE_URL']; ?>" target="_blank"><?php echo $brandOptions['PLATFORM_BRAND_NAME']; ?></a></span>
	</div>
</footer>
