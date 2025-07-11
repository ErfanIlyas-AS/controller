<?php
if(!defined('DIRECTACCESS'))   die('Direct access not permitted'); //add this to every file included.

$filterOptionsArray = array(
  'PLATFORM_BRAND_NAME', 'PLATFORM_BRAND_SITE_URL', 'PLATFORM_BRAND_LOGO_URL',
);
$brandOptions = getMainWpControllerDetails( $filterOptionsArray );
?>



<nav class="navbar navbar-expand-lg navbar-light bg-light px-3 py-1 justify-content-between">

	<a class="navbar-brand" href="/index.php">
		<img src="<?php echo $brandOptions['PLATFORM_BRAND_LOGO_URL']?>" class="d-inline-block me-1" width="200" />
	</a>
	
	
	<button class="navbar-toggler p-0 border-0" type="button" id="navbarSideCollapse" aria-label="Toggle navigation">
	  <span class="navbar-toggler-icon"></span>
	</button>
	
	
	<div class="collapse navbar-collapse" id="navbarsExampleDefault">

		<form id="actionSearchNetwork" class="form">
			<div class="input-group">
				<select id="searchType" class="form-select" required="required">
					<option value="domain" selected>Domain</option>
					<option value="client-email">Client email</option>
					<option value="unique-order-id">Order ID</option>
					<option value="site-id">Site ID</option>
					<option value="client-saas-member-id">SaaS member ID</option>
				</select>
				<input id="searchQuery" class="input-group form-control form-control-sm" type="search" placeholder="Query" required="required">
				<button class="btn btn-primary" type="submit" id="searchButton">Search</button>
			</div>
		</form>
		
		
		<ul class="navbar-nav mr-auto ms-2">
			<li class="nav-item">
				<a class="btn btn-md btn-outline-primary <?php echo ( $currentPage == 'view-options' ) ? 'active':''; ?>" href="/index.php?task=view-options" target="_blank">Options</a>
			</li>
		</ul>

	</div>
	
	
	<form class="form-inline">
		<a class="btn btn-sm btn-outline-primary" href="/filegator/" target="_blank">WP Object Store <small><i class="ms-1 fas fa-external-link-alt"></i></small></a>
	</form>
	<form class="form-inline">
		<a class="btn btn-sm btn-outline-primary ms-2" href="/login.php">Logout <small><i class="ms-1 fas fa-sign-out-alt"></i></small></a>
	</form>
	
	
</nav>