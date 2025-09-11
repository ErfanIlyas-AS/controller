function showLoadingButtonMessage( $, status=false, element, message ){
	if( status ){
		$( element ).attr( 'disabled', false ).removeClass( 'disabled' ).html( message );
	}else{
		$( element ).attr( 'disabled', true ).addClass( 'disabled' ).html( '<i class="fas fa-spinner fa-spin me-1"></i> ' + message );
	}
}








//searchNetwork starts here
function searchNetwork( $, searchDomain=null, searchOrderId=null, searchClientEmail=null, searchSaaSID=null, searchSiteId=null ){
	
	var data = { 'user':'superduper', 'key':API_KEY };
	if( searchDomain ){
		data['domain'] = searchDomain;
	}
	
	if( searchClientEmail ){
		data['client-email'] = searchClientEmail;
	}
	
	if( searchOrderId ){
		data['unique-order-id'] = searchOrderId;
	}
	
	if( searchSaaSID ){
		data['client-saas-member-id'] = searchSaaSID;
	}
	
	if( searchSiteId ){
		data['site-id'] = searchSiteId;
	}
	
	
	$.ajax({
		method: 'post',
		url:'//ctrl.'+ROOT_DOMAIN_NAME+API_VERSION+'network/get-site-info/',
		data:data
	}).done(function( results ) {
		
		if( results.status == false ){
			swalWithBootstrapButtons.fire({
			  text: results.errorMsg, icon: 'error', showCancelButton: true, cancelButtonText: 'Dismiss', showConfirmButton: false,
			});
			$( '#mainTopWrapper1div' ).slideDown();
			return false;
		}
		
		
		var searchData = results['data'];
		var searchQuery = $( '#searchQuery' ).val();
		var searchTerm = '';
		
		if( results['search-used'] == 'domain' ){
			searchTerm = 'Domain';
		}else if( results['search-used'] == 'client-email' ){
			searchTerm = 'Client email';
		}else if( results['search-used'] == 'unique-order-id' ){
			searchTerm = 'Order ID';
		}else if( results['search-used'] == 'client-saas-member-id' ){
			searchTerm = 'SaaS ID';
		}else if( results['search-used'] == 'site-id' ){
			searchTerm = 'Site ID';
		}
		
		
		
		
		
		var searchSiteListHtml = '<div class="bg-white p-1 pt-2 mb-3 rounded">';
		searchSiteListHtml += '<div class="row">';
			searchSiteListHtml += '<div class="col-6"><h5 class="m-0">Search term "'+searchTerm+'" and query "'+searchQuery+'" results are:</h5></div>';
			searchSiteListHtml += '<div class="col-6"><a class="float-end btn btn-danger btn-sm rounded-0" id="actionCloseSearchResults" href="#">Close search results</a></div>';
		searchSiteListHtml += '</div>';
		searchSiteListHtml += '<div class="serachSiteListTableInject">';
	
			searchSiteListHtml += '<table class="table table-bordered table-hover table-sm mb-0"><thead class="table-dark"><tr>';
				searchSiteListHtml += '<th scope="col">#</th>';
				searchSiteListHtml += '<th scope="col">Status</th>';
				searchSiteListHtml += '<th scope="col" class="d-none d-lg-table-cell">Order</th>';
				searchSiteListHtml += '<th scope="col">Site-ID</th>';
        searchSiteListHtml += '<th scope="col" class="d-none d-lg-table-cell">DB-ID</th>';
				searchSiteListHtml += '<th scope="col">Domain</th>';
				searchSiteListHtml += '<th scope="col">Client email</th>';
				searchSiteListHtml += '<th scope="col" class="d-none d-lg-table-cell">Restrict</th>';
				//searchSiteListHtml += '<th scope="col" class="d-none d-lg-table-cell">Bandwidth / Unique / Page views</th>';
				//searchSiteListHtml += '<th scope="col" class="d-none d-lg-table-cell">Storage - <small>APP DB (Inodes)</small></th>';
				searchSiteListHtml += '<th scope="col">Actions</th>';
				searchSiteListHtml += '</tr></thead><tbody>';
		
					var searchSiteCounter = 1;
					$.each( searchData, function(index, record) {
						
						searchSiteListHtml += '<tr class="searchNode'+record['node_id']+'site'+record['id']+'" data-node-id="'+record['node_id']+'" data-site-id="'+record['id']+'">';
						searchSiteListHtml += '<th scope="row">'+searchSiteCounter+'</th>';
						//searchSiteListHtml += '<td class="text-center">'+record['node_id']+'</td>';
						searchSiteListHtml += '</tr>';
						
						//function get the site info
						getSiteInfo( $, record['node_id'], record['id'], 'searchNode'+record['node_id']+'site'+record['id'] );
						
						searchSiteCounter++;
					});
		
			searchSiteListHtml += '</tbody></table>';
		
	searchSiteListHtml += '</div>';
	searchSiteListHtml += '</div>';
	$( "#wrapperSearchSiteList" ).html( searchSiteListHtml );
	$( '#wrapperSearchSiteList' ).slideDown();
	$( '#mainTopWrapper1div' ).slideUp();


		
	}).fail(function ( result ){
		
		swalWithBootstrapButtons.fire({
		  text: result.responseJSON.errorMsg, icon: 'error', showCancelButton: true, cancelButtonText: 'Dismiss', showConfirmButton: false,
		});
		$( '#mainTopWrapper1div' ).slideDown();
	
		
	}).always(function(){
		$( '#searchButton' ).removeClass( 'disabled' ).html( 'search' );
	});
}
//searchNetwork ends here







function getAllNodesDB( $, withInfoResource='false' ){
  
  $.ajax({
    
    method: 'post',
		url:'//ctrl.'+ROOT_DOMAIN_NAME+API_VERSION+'network/db-info/',
		data:{'user':'superduper',
			  'key':API_KEY,
			  'with-info-resource':withInfoResource,
			}
  }).done(function( results, textStatus, xhr ) {
    
    
      
    if (xhr.status === 200) {
        
      var counter = 1;
      $.each( results.data, function(index, record) {
      
        var nodeNameDB      = 'DB-'+record['node-db-id'];
        var nodeCpuUsedDB 	= record['resoruces']['dbServerCpuUsed'];
        var nodeCpuTotalDB 	= record['resoruces']['dbServerCpuTotal'];
        
        var nodeMemoryUsedDB 		= record['resoruces']['dbServerMemoryUsed'];
        var nodeMemoryTotalDB 	= record['resoruces']['dbServerMemoryTotal'];
        
        var nodeDiskUsedDB 	= record['resoruces']['dbServerDiskUsed'];
        var nodeDiskTotalDB 	= record['resoruces']['dbServerDiskTotal'];
        
        var nodeBandwidthUsedCombinedDB = record['resoruces']['dbServerBandwidthUsed'];
        
        
        var html = '<tr>';
          html += '<td><span class="badge bg-light">'+counter+'</span></td>';
          html += '<td><span class="badge bg-dark">'+nodeNameDB+'</span></td>';
          
          html += '<td>';
            html += '<span class="badge bg-light">'+record['node-db-public-ipv4']+'</span>';
          html += '</td>';
          
          html += '<td>';
            html += '<span class="badge bg-dark">'+record['node-db-private-ipv4']+'</span>';
          html += '</td>';
          
          html += '<td>';
            html += '<span class="badge bg-info">'+nodeCpuUsedDB+'/'+nodeCpuTotalDB+'</span>';
          html += '</td>';
          
          html += '<td>';
            html += '<span class="badge bg-info">'+nodeMemoryUsedDB+'G/'+nodeMemoryTotalDB+'G</span>';
          html += '</td>';
          
          html += '<td>';
            html += '<span class="badge bg-info">'+nodeDiskUsedDB+'/'+nodeDiskTotalDB+'</span>';
          html += '</td>';
          
          html += '<td class="text-center"><span class="badge bg-light">'+nodeBandwidthUsedCombinedDB+'G</span></td>';
          
          
          html += '<td class="d-flex justify-content-end pe-3">';
            html += '<a class="btn btn-link btn-sm btnRemoveNodeDB" data-node-id="'+nodeNameDB+'"><i class="fas fa-trash text-danger"></i></a>';
          html += '</td>';
          
        html += '</tr>';
        
        
        
        
        
        $( "#injectNodeDataDB" ).append( html );
        
        counter++;
      });
    }else{
      $("#additionalDBServersWrapperInner1").html(
        '<p class="m-0 p-3 text-center">' +
        'No additional database servers found. You can create more database servers depending on your license. ' +
        'For optimal performance, it\'s recommended to host a maximum of 1,000 sites on a single database server. ' +
        'To add more servers, click the button below. ' +
        '<span class="text-danger">Note: Your license allows you to add maximum of '+LICENSE_AS_MAX_DB_NODES+' Database server(s).</span>' +
        '</p>'
      );
    }
		
    
  }).always(function(){
		$('#loadingDivNodeListDB').hide();
	});
  
}//getAllNodesDB





function getAllNodes( $, ctrl, skipPrimaryNode='true', withInfoResource='false' ){
	
	$.ajax({
		method: 'post',
		url:'//ctrl.'+ROOT_DOMAIN_NAME+API_VERSION+'network/info/',
		data:{'user':'superduper',
			  'key':API_KEY,
			  'skip-primary-node':skipPrimaryNode,
			  'with-info-resource':withInfoResource,
			}
	}).done(function( results ) {
    

		var counter = 1;
		$.each( results.data, function(index, record) {
			
			//store the data in gobal array
			//allNetworkSites[ record['node_id'] ] = record['site_data'];
			
			
			var nodeId = record['node_id'];
			var nodeName = 'ctrl-'+record['node_id'];
			var nodeTotalSites = record['total_sites'];
      
      var appServerPublicIp 	= record['publicip'];
      var appServerPrivateIp 	= record['privateip'];
			
			var appServerCpuUsed 	= record['app_server_cpu_used'];
			var appServerCpuTotal 	= record['app_server_cpu_total'];
			var dbServerCpuUsed 	= record['db_server_cpu_used'];
			var dbServerCpuTotal 	= record['db_server_cpu_total'];
			
			var appServerMemoryUsed 	= record['app_server_ram_used'];
			var appServerMemoryTotal 	= record['app_server_ram_total'];
			var dbServerMemoryUsed 		= record['db_server_ram_used'];
			var dbServerMemoryTotal 	= record['db_server_ram_total'];
			
			
			var appServerDiskUsed 	= record['app_server_disk_used'];
			var appServerDiskTotal 	= record['app_server_disk_total'];
			var dbServerDiskUsed 	= record['db_server_disk_used'];
			var dbServerDiskTotal 	= record['db_server_disk_total'];
			
			var serverBandwidthUsedCombined = record['server_bandwidth_used_combined'];
			var licenseNodeTotalSiteLimit = record['LICENSE_NODE_TOTAL_SITE_LIMIT'];
		  
		  
			var html = '<tr>';
      
      
				html += '<td><span class="badge bg-light">'+counter+'</span></td>';
				//html += '<td><span class="badge bg-light">'+nodeName+'</span></td>';
				
				html += '<td>';
					html += '<span class="badge bg-light">'+appServerCpuUsed+'/'+appServerCpuTotal+'</span> ';
					html += '<span class="badge bg-info">'+dbServerCpuUsed+'/'+dbServerCpuTotal+'</span>';
				html += '</td>';
				
				html += '<td>';
					html += '<span class="badge bg-light">'+appServerMemoryUsed+'G/'+appServerMemoryTotal+'G</span> ';
					html += '<span class="badge bg-info">'+dbServerMemoryUsed+'G/'+dbServerMemoryTotal+'G</span>';
				html += '</td>';
				
				html += '<td>';
					html += '<span class="badge bg-light">'+appServerDiskUsed+'/'+appServerDiskTotal+'</span> ';
					html += '<span class="badge bg-info">'+dbServerDiskUsed+'/'+dbServerDiskTotal+'</span>';
				html += '</td>';

				html += '<td class="text-center"><span class="badge bg-light">'+serverBandwidthUsedCombined+'G</span></td>';

				html += '<td class="text-center"><span class="badge bg-light">'+nodeTotalSites+'/'+licenseNodeTotalSiteLimit+'</span></td>';
				
				html += '<td class="text-center"><span class="badge bg-light">'+record['THIS_CONTROLLER_PROVIDER_NAME']+'</span></td>';
				
				html += '<td class="d-flex justify-content-end pe-3">';
				  html += '<div class="btn-group">';
				    //html += '<a class="btn btn-primary btn-sm btnCreateNewSite" data-node-id="'+nodeId+'">Create new site</a>';
					html += '<a class="btn btn-warning btn-sm dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown">Actions </a>';
					html += '<ul class="dropdown-menu">';
            html += '<li><a class="dropdown-item" target="_blank" href="https://ctrl-'+nodeId+'.'+ROOT_DOMAIN_NAME+'/index.php?task=view-opcache&otp-key='+OTP_KEY+'&otp-token='+OTP_TOKEN+'&opcache-status-php-version=8.3">PHP8.3-Opcache <small><i class="ms-1 fas fa-external-link-alt"></i></small></a></li>';
					  //html += '<li><a class="dropdown-item" target="_blank" href="https://ctrl-'+nodeId+'.'+ROOT_DOMAIN_NAME+'/index.php?task=view-opcache&otp-key='+OTP_KEY+'&otp-token='+OTP_TOKEN+'&opcache-status-php-version=7.4">PHP7.4-Opcache <small><i class="ms-1 fas fa-external-link-alt"></i></small></a></li>';
					  //html += '<li><a class="dropdown-item" target="_blank" href="https://ctrl-'+nodeId+'.'+ROOT_DOMAIN_NAME+'/index.php?task=view-opcache&otp-key='+OTP_KEY+'&otp-token='+OTP_TOKEN+'&opcache-status-php-version=8.1">PHP8.1-Opcache <small><i class="ms-1 fas fa-external-link-alt"></i></small></a></li>';
					  html += '<li><hr class="dropdown-divider"></li>';
            html += '<li><a class="dropdown-item" target="_blank" href="https://ctrl-'+nodeId+'.'+ROOT_DOMAIN_NAME+'/index.php?task=view-phpinfo&otp-key='+OTP_KEY+'&otp-token='+OTP_TOKEN+'&opcache-status-php-version=8.3">PHP8.3-Info <small><i class="ms-1 fas fa-external-link-alt"></i></small></a></li>';
					  //html += '<li><a class="dropdown-item" target="_blank" href="https://ctrl-'+nodeId+'.'+ROOT_DOMAIN_NAME+'/index.php?task=view-phpinfo&otp-key='+OTP_KEY+'&otp-token='+OTP_TOKEN+'&opcache-status-php-version=7.4">PHP7.4-Info <small><i class="ms-1 fas fa-external-link-alt"></i></small></a></li>';
					  //html += '<li><a class="dropdown-item" target="_blank" href="https://ctrl-'+nodeId+'.'+ROOT_DOMAIN_NAME+'/index.php?task=view-phpinfo&otp-key='+OTP_KEY+'&otp-token='+OTP_TOKEN+'&opcache-status-php-version=8.1">PHP8.1-Info <small><i class="ms-1 fas fa-external-link-alt"></i></small></a></li>';

            html += '<li><hr class="dropdown-divider"></li>';
					  html += '<li><a class="dropdown-item actionRefreshStaticPages" target="_blank" href="#">Refresh all Static Pages <small><i class="ms-1 fas fa-rotate"></i></small></a></li>';


					  //html += '<li><hr class="dropdown-divider"></li>';
					  //html += '<li><a class="dropdown-item" target="_blank" href="https://ctrl-'+nodeId+'.'+ROOT_DOMAIN_NAME+'/index.php?task=GIT_FETCH_DEPLOY_FROM_CTRL&otp-key='+OTP_KEY+'&otp-token='+OTP_TOKEN+'">Git Fetch & Deploy <small><i class="ms-1 fas fa-external-link-alt"></i></small></a></li>';
            
					  //html += '<li><hr class="dropdown-divider"></li>';
					  //html += '<li><a class="dropdown-item" target="_blank" href="https://ctrl-'+nodeId+'.'+ROOT_DOMAIN_NAME+'/index.php?task=RELOAD_ALL_SERVICES&otp-key='+OTP_KEY+'&otp-token='+OTP_TOKEN+'">Reload All Services <small><i class="ms-1 fas fa-external-link-alt"></i></small></a></li>';
            
            
					html += '</ul>';
				  html += '</div>';
				html += '</td>';
			html += '</tr>';
      
      
      
      if( record['autoscale_server_created'] ){
        
        /*
        html += '<tr>';
          html += '<td colspan="8" class="text-center">';
            html += '<span class="badge bg-warning">Following Server(s) were automatically created.</span>';
          html += '</td>';
        html += '</tr>';
        */
        
        var autoScaleServerCounter = 1;
        $.each( record['autoscale_server_data'], function(index, record) {
          html += '<tr class="autoScaledServers">';
            
            html += '<td>';
              html += '<span class="badge bg-light">'+autoScaleServerCounter+'</span>';
            html += '</td>';
            
            html += '<td>';
              html += '<span class="badge bg-light">Created: '+record['createdTimeSince']+'</span>';
            html += '</td>';

            html += '<td>';
              html += '<span class="badge bg-light">(primary) '+appServerPublicIp+' <-> (public) '+record['publicip']+'</span>';
            html += '</td>';
            
            html += '<td>';
              html += '<span class="badge bg-light">(primary) '+appServerPrivateIp+' <-> (private) '+record['privateip']+'</span>';
            html += '</td>';
            
            html += '<td>';
              html += '<span class="badge bg-light">(CPU) '+record['appServerCpuUsed']+'/'+record['appServerCpuTotal']+'</span>';
            html += '</td>';
            
            html += '<td colspan="2">';
              html += '<span class="badge bg-light">(RAM) '+record['appServerMemoryUsed']+'G/'+record['appServerMemoryTotal']+'G<span>';
            html += '</td>';
            
            html += '<td class="d-flex justify-content-end pe-3">';
              html += '<a class="btn btn-link btn-sm btnRemoveAutoScaledServer"><i class="fas fa-trash text-danger"></i></a>';
            html += '</td>';
            
            
          html += '</tr>';
          
          autoScaleServerCounter++;
        });

        
        
        
        //html += '<tr><td colspan="8">';
        //html += '<table id="autoScaledServersList" class="table table-bordered table-hover table-sm table-light"><thead><tr>';
        //html += '<th scope="col">#</th>';
        //html += '<th scope="col">Status</th>';
        //html += '<th scope="col" class="d-none d-lg-table-cell">Order-ID</th>';
        //html += '<th scope="col">Site-ID</th>';
        //html += '<th scope="col" class="d-none d-lg-table-cell">DB-ID</th>';
        //html += '<th scope="col">Domain</th>';
        //html += '<th scope="col">Client email</th>';
        //html += '<th scope="col" class="d-none d-lg-table-cell">Restrict-ID</th>';
        //html += '<th scope="col" class="d-none d-lg-table-cell">Bandwidth / Unique / Page views</th>';
        //html += '<th scope="col" class="d-none d-lg-table-cell">Storage - <small>APP DB (Inodes)</small></th>';
        //html += '<th scope="col">Actions</th>';
        //html += '</tr></thead><tbody>';
        
        //$.each( record['autoscale_server_data'], function(index, record) {
        //});
        
        //html += '</tbody></table>';
        //html += '</td></tr>';
        
        
      }else{
        html += '<tr>';
          html += '<td colspan="8" class="text-center">';
          html += '<span class="badge bg-light">No auto scaling server found</span>';
          html += '</td>';
        html += '</tr>';
      }
      
      
      

			$( "#injectNodeData" ).append( html );
			
			
			
			var siteIdList = record['site_data'];
			
			var siteListHtml = '<div class="bg-white p-1 pt-2 mb-3 rounded wrapperSiteList'+nodeName+'">';
				//siteListHtml += '<h5 id="node'+nodeId+'-ctrl-heading">'+nodeName+' site list</h5>';
				siteListHtml += '<div class="nodeSiteListTableInject">';
				
					siteListHtml += '<table data-node-id="'+nodeId+'" data-node-name="'+nodeName+'" id="node'+nodeId+'-SiteListTable" class="table table-bordered table-hover table-sm mb-0"><thead class="table-dark"><tr>';
						siteListHtml += '<th scope="col">#</th>';
						siteListHtml += '<th scope="col">Status</th>';
						siteListHtml += '<th scope="col" class="d-none d-lg-table-cell">Order-ID</th>';
						siteListHtml += '<th scope="col">Site-ID</th>';
            siteListHtml += '<th scope="col" class="d-none d-lg-table-cell">DB-ID</th>';
						siteListHtml += '<th scope="col">Domain</th>';
						siteListHtml += '<th scope="col">Client email</th>';
						siteListHtml += '<th scope="col" class="d-none d-lg-table-cell">Restrict-ID</th>';
						//siteListHtml += '<th scope="col" class="d-none d-lg-table-cell">Bandwidth / Unique / Page views</th>';
						//siteListHtml += '<th scope="col" class="d-none d-lg-table-cell">Storage - <small>APP DB (Inodes)</small></th>';
						siteListHtml += '<th scope="col" class="text-end pe-4">Actions</th>';
					siteListHtml += '</tr></thead><tbody id="node'+nodeId+'-site-list">';
					
					var siteCounter = 1;
					$.each( siteIdList, function(index, record) {
						siteListHtml += '<tr class="node'+nodeId+'site'+record['id']+'" data-node-id="'+nodeId+'" data-site-id="'+record['id']+'">';
							siteListHtml += '<th scope="row">'+siteCounter+'</th>';
							siteListHtml += '</th>';
						siteListHtml += '</tr>';
						
						//function get the site info
						getSiteInfo( $, nodeId, record['id'], 'node'+nodeId+'site'+record['id'] );
						
						siteCounter++;
					});
					
					siteListHtml += '</tbody></table>';
					
					siteListHtml += buildPagination( $, nodeId, record['total_sites'], record['total_pages'], record['current_page'], record['results_per_page'] );
					
				siteListHtml += '</div>';
			siteListHtml += '</div>';
			$( "#wrapperSiteList" ).append( siteListHtml );
			
			counter++;
		});
		
	
		
	}).always(function(){
		$('#loadingDivNodeList').hide();
	});
	

}//getAllNodes




function buildPagination( $, nodeId, total_sites, total_pages, current_page, results_per_page ){
	var html = '';
	html += '<div id="node'+nodeId+'-pagination" class="row divData mt-3" data-node-id="'+nodeId+'" data-page-current="'+current_page+'" data-max-page-results="'+results_per_page+'">';
	
		html += '<div class="col-sm-12 col-md-5 align-self-center">';
			html += '<strong>'+total_sites+' total sites</strong> - Listing page '+current_page+' of '+total_pages+'';
		html += '</div>';
		
		html += '<div class="col-sm-12 col-md-7">';
			html += '<ul class="pagination m-0">';
				
				//previous page
				if( current_page == 1 ){
					html += '<li class="page-item disabled">';
						html += '<a class="page-link actionRunPager rounded-0" data-show-page="'+current_page+'" href="#">Previous</a>';
					html += '</li>';
				}else{
					html += '<li class="page-item">';
						html += '<a class="page-link actionRunPager rounded-0" data-show-page="'+(current_page-1)+'" href="#">Previous</a>';
					html += '</li>';
				}
				
				
				for (let i = 0; i < total_pages; i++) {
					
					if( current_page == (i+1) ){
						html += '<li class="page-item active">';
							html += '<a class="page-link actionRunPager" data-show-page="'+(i+1)+'" href="#">'+(i+1)+'</a>';
						html += '</li>';
					}else{
						html += '<li class="page-item">';
							html += '<a class="page-link actionRunPager" data-show-page="'+(i+1)+'" href="#">'+(i+1)+'</a>';
						html += '</li>';
					}
	
				}
				
				
				
				//next page
				if( current_page >= total_pages ){
					html += '<li class="page-item disabled">';
						html += '<a class="page-link actionRunPager rounded-0" data-show-page="'+current_page+'" href="#">Next</a>';
					html += '</li>';
				}else{
					html += '<li class="page-item">';
						html += '<a class="page-link actionRunPager rounded-0" data-show-page="'+(current_page+1)+'" href="#">Next</a>';
					html += '</li>';
				}
				
				
			html += '</ul>';
		html += '</div>';
	
	html += '</div>';
	return html;
}





function newSiteFormSubmit( $ ){
	
	showLoadingButtonMessage( $, false, '#newSiteButtonSubmit', 'working....' );
	
	//var newSiteNode = $( '#newSiteNode' ).val();
  var newSiteDB = $( '#newSiteDB' ).val();
	var newSiteEmail = $( '#newSiteEmail' ).val();
	var newSiteSubdomain = $( '#newSiteSubdomain' ).val();
	
	var paramteres = { 'user':'superduper', 'key':API_KEY, 'client-email':newSiteEmail, 'node-db-id':newSiteDB };
	
	//optional paramaters:
	var newSiteSubdomain = $( '#newSiteSubdomain' ).val();
	if( newSiteSubdomain !== '' ){
		paramteres['subdomain'] = newSiteSubdomain;
	}
	
  /*
	var newSiteCloneSourceNode = $( '#newSiteCloneSourceNode' ).val();
	if( newSiteCloneSourceNode !== '' ){
		paramteres['clone-source-node-id'] = newSiteCloneSourceNode;
	}
  */
	
	var newSiteCloneSourceSiteId = $( '#newSiteCloneSourceSiteId_wrapper' ).find( '[name=newSiteCloneSourceSiteId]' ).val();
	if( newSiteCloneSourceSiteId !== '' ){
    paramteres['clone-source-node-id'] = '1';
		paramteres['clone-source-site-id'] = newSiteCloneSourceSiteId;
	}
  
  
  var donotUseGitMainBranch = $( '#donotUseGitMainBranch' ).val();
	if( donotUseGitMainBranch == '1' ){
		paramteres['clone-dont-use-git-main-branch'] = '1';
	}else{
    paramteres['clone-dont-use-git-main-branch'] = '0';
  }
	
	var newSiteWpVer = $( '#newSiteWpVer' ).val();
	if( newSiteWpVer !== '' ){
		paramteres['wp-version'] = newSiteWpVer;
	}
	
	var newSitePhpVer = $( '#newSitePhpVer' ).val();
	if( newSitePhpVer !== '' ){
		paramteres['php-version'] = newSitePhpVer;
	}
	
	var newSiteRestrictionGroupId = $( '#newSiteRestrictionGroupId' ).val();
	if( newSiteRestrictionGroupId !== '' ){
		paramteres['restrictions-group'] = newSiteRestrictionGroupId;
	}
	
	var newSiteUniqueOrderId = $( '#newSiteUniqueOrderId' ).val();
	if( newSiteUniqueOrderId !== '' ){
		paramteres['unique-order-id'] = newSiteUniqueOrderId;
	}
	
	var newSiteSaasMemberId = $( '#newSiteSaasMemberId' ).val();
	if( newSiteSaasMemberId !== '' ){
		paramteres['client-saas-member-id'] = newSiteSaasMemberId;
	}
	
	
	//try to get injectable form
	var allInputInjectFields = $('.inputInjectField');
	$.each( allInputInjectFields, function(index, element){
		var currentElementVal = $(element).val();
		var currentElementName = $(element).attr('name');
		if( currentElementVal !== '' ){
			paramteres[currentElementName] = currentElementVal;
		}
	});
	
	
	
	$.ajax({
		method: 'post',
		url:'//ctrl.'+ROOT_DOMAIN_NAME+API_VERSION+'site/new/',
		data:paramteres,
		dataType : 'json'
	}).always(function (){
		showLoadingButtonMessage( $, true, '#newSiteButtonSubmit', 'Create new site' );
		
	}).fail(function ( result ){
		
		swalWithBootstrapButtons.fire({
		  text: result.responseJSON.errorMsg, icon: 'error', showCancelButton: true, cancelButtonText: 'Dismiss', showConfirmButton: false,
		});
	
		
	}).done(function( result ){
		
		if( result.status == false ){
			swalWithBootstrapButtons.fire({
			  text: result.responseJSON.errorMsg, icon: 'error', showCancelButton: true, cancelButtonText: 'Dismiss', showConfirmButton: false,
			});
			return false;
		}
		
		swalWithBootstrapButtons.fire({
		  title: 'Successfully Queued',
		  text: 'Setting up your wordpress site. This window will refresh automatically.',
		  icon: 'success', 
			showConfirmButton: false,
      allowOutsideClick: false,
			timerProgressBar: true,
			timer: 5000,
			willClose: () => {
					// This function will execute when the timer runs out and the modal is about to close
					window.location.reload(); // Refreshes the current page
			}
		});
		
	});
	
	
		
}














function getSiteInfo( $, ctrl, siteId, trClass=false, selectIdElement=false ){
	
	paramters = { 'user':'superduper', 'key':API_KEY, 'site-id':siteId };
	
	if( selectIdElement == '#injectFormBuilderWrapper' ){
		paramters['with-injection-placeholders'] = 'true';
	}
	
	return $.ajax({
		method: 'post',
		url:'//ctrl.'+ROOT_DOMAIN_NAME+API_VERSION+'site/get-auto-site/',
		data:paramters
	}).done(function( results ) {
    
    
		var firstRecord = results.data[0];
		var encKey = 'n/a';
		encKey = md5( firstRecord['ssh_password']+firstRecord['id'] );
		
		if( trClass ){
			
			if( firstRecord['status'] == '1' ){
				$( '.'+trClass ).append( '<td><a class="btn btn-link p-0 actionDeactivateSite text-decoration-none" href="#">Active <span class="text-dark"><small><i class="fas fa-check-square"></i></small></span></a></td>' );
			}else if( firstRecord['status'] == '222' ){
				$( '.'+trClass ).append( '<td>Marked For Removal <span class="text-danger"><small><i class="fas fa-times-circle"></i></small></span></td>' );
			}else if( firstRecord['status'] == '199' ){
				$( '.'+trClass ).append( '<td>Marked For Cloning <span class="text-danger"><small><i class="fas fa-paste"></i></small></span></td>' );
			}else{
				$( '.'+trClass ).append( '<td><a class="btn btn-link p-0 actionActivateSite">Deactivated <span class="text-danger"><small><i class="fas fa-times-circle"></i></small></span></a></td>' );
			}
			
			//$( '.'+trClass ).append( '<td class="text-center">'+firstRecord['progress_completed']+'</td>' );
			
			
			if( firstRecord['unique_order_id'] == null ){
				$( '.'+trClass ).append( '<td class="d-none d-lg-table-cell">&nbsp;</td>' );
			}else{
				$( '.'+trClass ).append( '<td class="d-none d-lg-table-cell">'+firstRecord['unique_order_id']+'</td>' );
			}
			

			
			$( '.'+trClass ).append( '<td>'+firstRecord['id']+'</td>' );
      $( '.'+trClass ).append( '<td class="text-center d-none d-lg-table-cell">'+firstRecord['node_db_id']+'</td>' );
			
			$( '.'+trClass ).append( '<td><a class="btn btn-link p-0 text-decoration-none" href="https://'+firstRecord['domain']+'/" target="_blank">'+firstRecord['domain']+' <small class="text-dark"><i class="fas fa-external-link-alt"></i></small></a> | <a class="text-decoration-none" href="https://'+firstRecord['domain']+'/wp-admin/" target="_blank"><small class="text-dark"><i class="fas fa-columns"></i></small></a></td>' );
			
			$( '.'+trClass ).append( '<td>'+firstRecord['client_email']+'</td>' );
			//$( '.'+trClass ).append( '<td class="text-center">'+firstRecord['wp_version']+'</td>' );
			//$( '.'+trClass ).append( '<td class="text-center">'+firstRecord['php_version']+'</td>' );
			$( '.'+trClass ).append( '<td class="text-center d-none d-lg-table-cell">'+firstRecord['restrictions_group']+'</td>' );
			
			//$( '.'+trClass ).append( '<td class="d-none d-lg-table-cell"><small>'+firstRecord['TOTAL_BANDWIDTH_MB']+'MB / '+firstRecord['TOTAL_UNIQUE_VISITORS']+' Unique / '+firstRecord['TOTAL_PAGE_VIEWS']+' Page views</small></td>' );
			//$( '.'+trClass ).append( '<td class="d-none d-lg-table-cell"><small><i class="fas fa-hdd"></i> '+firstRecord['WAAS1_TOTAL_APP_SIZE_MB']+'MB <i class="fas fa-database"></i> '+firstRecord['WAAS1_TOTAL_DB_SIZE_MB']+'MB ('+firstRecord['WAAS1_TOTAL_APP_INODES']+')</small></td>' );
			
			
			
			if( (firstRecord['status'] == '222') || (firstRecord['status'] == '199') ){
      }else{
				var html = '<td class="text-end">';
				
				html += '<div class="btn-group me-3">';
				
					html += '<a class="btn btn-outline-dark btn-sm actionLoginAsUser" href="#"><i class="fas fa-key"></i></a>';
					html += '<a class="btn btn-outline-dark btn-sm actionUpdateSite" href="#"><i class="fas fa-edit"></i></a>';
          html += '<a class="btn btn-outline-dark btn-sm actionCheckCFStatus" href="#"><i class="fa-brands fa-cloudflare"></i></a>';
          
					html += '<a class="btn btn-dark btn-sm dropdown-toggle dropdown-toggle-split" data-bs-toggle="dropdown"></a>';
						html += '<div class="dropdown-menu">';
							html += '<a class="dropdown-item" href="//ctrl-'+ctrl+'.'+ROOT_DOMAIN_NAME+'/?task=view_php_error_log&site-id='+firstRecord['id']+'&key='+encKey+'&log=wp-errors" target="_blank">View Log - Error</a>';
							//html += '<a class="dropdown-item" href="//ctrl-'+ctrl+'.'+ROOT_DOMAIN_NAME+'/?task=view_php_error_log&site-id='+firstRecord['id']+'&key='+encKey+'&log=php-slow" target="_blank">View Log - Slow</a>';
							//html += '<hr class="dropdown-divider">';
							//html += '<a class="dropdown-item actionBackupRestore" href="#">Backup/Restore</a>';
							//html += '<hr class="dropdown-divider">';
							//html += '<a class="dropdown-item actionRecreateUsers" href="#">Recreate Users</a>';
							//html += '<hr class="dropdown-divider">';
							//html += '<a class="dropdown-item actionDisableThemePlugins" href="#">Disable Theme/Plugins</a>';
						html += '</div>';
				
				html += '</div>';
				
				
				html += '<a class="btn btn-link btn-sm actionDeleteSite" href="#"><i class="fas fa-trash text-danger"></i></i></a>';
				html += '</td>';
			}
			$( '.'+trClass ).append( html );
			
			
			
		}
		
		
		
		if(selectIdElement == '#newSiteCloneSourceSiteId' ){
			$(selectIdElement).append( 
				'<option value="'+firstRecord['id']+'">' +firstRecord['domain']+ ' - (Site ID - ' +firstRecord['id']+ ')</option>' 
			);
		}
		
		
		
		if(selectIdElement == '#injectFormBuilderWrapper' ){//if #injectFormBuilderWrapper starts
			
			if( typeof firstRecord['injection-placeholders'] === 'object' ) {
				
				$('#injectFormBuilderWrapper').slideDown();
				
				var injectHtml = '<p class="text-center">Injectable placeholders found on: <strong>'+firstRecord['domain']+'</strong></p>';
				$.each( firstRecord['injection-placeholders'], function(index, record) {
					injectHtml += '<div class="col-4 mb-3">';
					injectHtml += '<input type="text" class="form-control inputInjectField" id="'+record+'" name="'+record+'" placeholder="'+record+'">';
					injectHtml += '</div>';
				});
				$('#dumpInjectHtmlHere').html( injectHtml );
			
			}else{
				$('#injectFormBuilderWrapper').slideUp();
				$('#dumpInjectHtmlHere').html( '&nbsp;' );
			}
			
			
			
		}//if #injectFormBuilderWrapper ends
		
		
	}).always(function(){
		$( '#cloneSourceSiteIdSpinnerIcon' ).hide();
	});
	

}









function activeOrDeactiveSite( $, ctrl, siteId, action ){
	
	paramters = { 'user':'superduper', 'key':API_KEY, 'node-id':ctrl, 'site-id':siteId, 'status':action };
	
	return $.ajax({
		method: 'post',
		url:'//ctrl-'+ctrl+'.'+ROOT_DOMAIN_NAME+API_VERSION+'site/status/',
		data:paramters
	});
	
}




function getNodeInfo($, ctrl, maxPageResults='100', showPage='1' ){
	paramters = { 'user':'superduper', 'key':API_KEY, 'node-id':ctrl, 'max-results':maxPageResults, 'show-page':showPage };
	return $.ajax({
		method: 'post',
		url:'//ctrl-'+ctrl+'.'+ROOT_DOMAIN_NAME+API_VERSION+'node/info/',
		data:paramters
	});
}


function getCFStatus( $, siteId ){
  
  paramters = { 'user':'superduper', 'key':API_KEY, 'site-id':siteId, 'with-cf-name-servers':true };
  return $.ajax({
		method: 'post',
		url:'//ctrl.'+ROOT_DOMAIN_NAME+API_VERSION+'site/get-auto-site/',
		data:paramters
	});
  
}



function postRefreshStaticPages( $ ){
  
  paramters = { 'user':'superduper', 'key':API_KEY };
  return $.ajax({
		method: 'post',
		url:'//ctrl.'+ROOT_DOMAIN_NAME+API_VERSION+'network/refresh-static-pages/',
		data:paramters
	});
  
}


function getSiteJson( $, ctrl, siteId ){
	
	paramters = { 'user':'superduper', 'key':API_KEY, 'node-id':ctrl, 'site-id':siteId };
	
	return $.ajax({
		method: 'post',
		url:'//ctrl-'+ctrl+'.'+ROOT_DOMAIN_NAME+API_VERSION+'site/get-auto-site/',
		data:paramters
	});
	
}


function getSiteBackups( $, ctrl, siteId ){
	
	paramters = { 'user':'superduper', 'key':API_KEY, 'node-id':ctrl, 'site-id':siteId };
	
	return $.ajax({
		method: 'post',
		url:'//ctrl-'+ctrl+'.'+ROOT_DOMAIN_NAME+API_VERSION+'site/backups-list/',
		data:paramters
	});
	
}

function takeSiteBackup( $, ctrl, siteId ){
	
	paramters = { 'user':'superduper', 'key':API_KEY, 'node-id':ctrl, 'site-id':siteId };
	
	return $.ajax({
		method: 'post',
		url:'//ctrl-'+ctrl+'.'+ROOT_DOMAIN_NAME+API_VERSION+'site/backups-now/',
		data:paramters
	});
	
}


function restoreSiteBackup( $, ctrl, siteId, nonce ){
	paramters = { 'user':'superduper', 'key':API_KEY, 'node-id':ctrl, 'site-id':siteId, 'nonce':nonce };
	
	return $.ajax({
		method: 'post',
		url:'//ctrl-'+ctrl+'.'+ROOT_DOMAIN_NAME+API_VERSION+'site/backups-restore/',
		data:paramters
	});
}


function getSiteWithUserData( $, ctrl, siteId ){
	
	paramters = { 'user':'superduper', 'key':API_KEY, 'node-id':ctrl, 'site-id':siteId, 'with-users-list':'true', 'with-users-list-role-filter':'administrator' };
	
	return $.ajax({
		method: 'post',
		url:'//ctrl-'+ctrl+'.'+ROOT_DOMAIN_NAME+API_VERSION+'site/get-auto-site/',
		data:paramters
	});
	
}




function getSiteUserLoginLink( $, ctrl, siteId, userData ){
	
	paramters = { 'user':'superduper', 'key':API_KEY, 'node-id':ctrl, 'site-id':siteId, 'with-one-time-login':userData };
	
	return $.ajax({
		method: 'post',
		url:'//ctrl-'+ctrl+'.'+ROOT_DOMAIN_NAME+API_VERSION+'site/get-auto-site/',
		data:paramters
	});
	
}


function removeSite( $, ctrl, siteId ){
	
	paramters = { 'user':'superduper', 'key':API_KEY, 'node-id':ctrl, 'site-id':siteId };
	
	return $.ajax({
		method: 'post',
		url:'//ctrl-'+ctrl+'.'+ROOT_DOMAIN_NAME+API_VERSION+'site/remove/',
		data:paramters
	});
	
	
}



function disableThemePlugins( $, ctrl, siteId ){
	
	paramters = { 'user':'superduper', 'key':API_KEY, 'node-id':ctrl, 'site-id':siteId };
	
	return $.ajax({
		method: 'post',
		url:'//ctrl-'+ctrl+'.'+ROOT_DOMAIN_NAME+API_VERSION+'site/disable-theme-plugins/',
		data:paramters
	});
	
	
}



function recreateUsers( $, ctrl, siteId ){
	
	paramters = { 'user':'superduper', 'key':API_KEY, 'node-id':ctrl, 'site-id':siteId };
	
	return $.ajax({
		method: 'post',
		url:'//ctrl-'+ctrl+'.'+ROOT_DOMAIN_NAME+API_VERSION+'site/recreate-users/',
		data:paramters
	});
	
	
}




jQuery( document ).ready(function( $ ){
	
	$( 'body' ).on("click", '.clickToCopy', function( e ) {
		
		e.preventDefault();
		
		var $temp = $( '<input>' );
		$( this ).append( $temp );
		$temp.val( $(this).text() ).select();

		document.execCommand( 'copy' );
		$temp.remove();

	});
	
});