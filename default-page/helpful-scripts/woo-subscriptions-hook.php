<?php
class wpTenant{//wptenant
	
	private $adminEmail = 'info.invokers@gmail.com';
	private $apiUser = 'superduper';
	private $apiKey = '9cc113b3ef2f196867fff38502f9e0c7';
	private $apiBaseDomain = 'waas1.com';
	private $apiVersion = '1';
	
	private $apiUrl;
	

	function __construct(){
		$this->apiUrl = '.'.$this->apiBaseDomain.'/api-v'.$this->apiVersion.'/';
	}


	public static function init(){
		$self = new self();
		add_action( 'woocommerce_subscription_status_updated', array($self, 'wooSubStatusUpdate'), 11, 3 );
	}
	
	
	
	public function wooSubStatusUpdate( $subscription, $new_status, $old_status ){
		
		$orderId = $this->getOrderId( $subscription );
		$apiCheckOrderId = $this->checkOrderId( $orderId );
		
		if( $apiCheckOrderId == false ){
			wp_mail( $this->adminEmail, 'Attention Required.', 'API call Error for the order ID: '.$orderId.' <br /> Manually create the site or update the status to suspend/active. <br /> New status: '.$new_status.' <br /> Old status: '.$old_status );
			return false;
		}
	
		$orderAlreadyExists = $apiCheckOrderId['status'];
		

		if( $new_status == 'active' ){
			
			if( $orderAlreadyExists == false ){
				$response = $this->cloneNewSite( $subscription, $orderId );
			}else{
				$response = $this->changeSiteStatus( $apiCheckOrderId, 'active' );
			}
			
		}elseif( $new_status == 'on-hold' ){
			
			if( $orderAlreadyExists == true ){
				$response = $this->changeSiteStatus( $apiCheckOrderId, 'suspend' );
			}
		}
		
	}
	
	
	
	

	private function getClientEmailAddress( $subscription ){
		
		$subscription_data 	= $subscription->get_data();
		$customerId 		= $subscription_data['customer_id'];
		$customerData 		= get_userdata( $customerId );
		return $customerData->user_email;
		
	}
	
	
	
	private function getOrderId( $subscription ){
		$subscription_data = $subscription->get_data();
		return $subscription_data['parent_id'];
	}
	
	private function getSubscriptionId( $subscription ){
		$subscription_data = $subscription->get_data();
		return $subscription_data['id'];
	}
	
	private function getCustomField( $subscription, $fieldName ){
	  
		$subscription_products = $subscription->get_items();
		foreach( $subscription_products as $product ){

			$productData = $product->get_data();
			$requiredField = get_post_meta( $productData['product_id'], $fieldName, true ); 
			if( $requiredField != ''){
				break; //break from the loop
			}

		}
		return $requiredField;

	}
	
	
	
	private function changeSiteStatus( $apiCheckOrderId, $status ){
		
		$siteData = $apiCheckOrderId['data'][0];
		
		if( $status == 'active' ){
			$statusToSet = 'active';
		}else{
			$statusToSet = 'suspend';
		}
		
		$response = wp_remote_request( 'https://ctrl-'.$siteData['node-id'].$this->apiUrl.'site/status/', array(
				'method'     => 'POST',
				'sslverify' 	=> false,
				'body'        	=> array(
					'user' 			=> 	$this->apiUser,
					'key' 			=> 	$this->apiKey,
					'node-id'		=> 	$siteData['node-id'],
					'site-id'		=>  $siteData['site_id'],
					'status'		=>  $statusToSet,
				)
			)
		);
		
		$returnArray = json_decode( $response['body'], true );
		return $returnArray;
		
	}
	
	
	
	
	
	private function checkOrderId( $orderId ){
		
		$response = wp_remote_request( 'https://ctrl-1'.$this->apiUrl.'network/get-info/', array(
				'method'     => 'POST',
				'sslverify' 	=> false,
				'body'        	=> array(
					'user' 						=> 	$this->apiUser,
					'key' 						=> 	$this->apiKey,
					'unique-order-id'			=> 	$orderId,
				)
			)
		);
		
		if( is_array($response) ){
			$returnArray = json_decode( $response['body'], true );
			return $returnArray;
		}else{
			return false;
		}
		
	}
	
	
	
	
	private function cloneNewSite( $subscription, $orderId ){
		
		$clientEmail 		= $this->getClientEmailAddress( $subscription );
		$cloneSourceNodeId 	= $this->getCustomField( $subscription, 'clone-source-node-id' );
		$cloneSourceSiteId 	= $this->getCustomField( $subscription, 'template_site_id' );
		
		
		//build the node selection logic here
		$nodeToUse = '1';
		
		
		$response = wp_remote_request( 'https://ctrl-'.$nodeToUse.$this->apiUrl.'site/new/', array(
				'method'     => 'POST',
				'sslverify' 	=> false,
				'body'        	=> array(
					'user' 						=> 	$this->apiUser,
					'key' 						=> 	$this->apiKey,
					'node-id'					=>  $nodeToUse,
					'unique-order-id'			=> 	$orderId,
					'client-email'				=>  $clientEmail,
					'clone-source-node-id'		=>  $cloneSourceNodeId,
					'clone-source-site-id'		=>  $cloneSourceSiteId,
				)
			)
		);
		$returnArray = json_decode( $response['body'], true );
		return $returnArray;
	}


}//wptenant
wpTenant::init();