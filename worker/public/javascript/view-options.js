jQuery( document ).ready(function( $ ) {
	
	$( '#updateOptionsForm' ).submit(function(e){
		
		
		var updatePassword = $( '#updatePassword' ).val() ;
		
		if( updatePassword.length < 8 ){
			swalWithBootstrapButtons.fire({
				title: 'Weak Password',
				text: 'Password should be atleast 8 characters long.',
				icon: 'error',
				showConfirmButton: true,
				allowOutsideClick: false,
				timerProgressBar: true,
				timer: 100000,
			});
			return false;
		}
		
		
		
		
		if( !updatePassword.match( /^[A-Za-z0-9]+$/ )  ){
			swalWithBootstrapButtons.fire({
				title: 'Password Issue',
				text: 'Please use Letters and Numbers only. Password should be alphanumeric only.',
				icon: 'error',
				showConfirmButton: true,
				allowOutsideClick: false,
				timerProgressBar: true,
				timer: 100000,
			});
			return false;
		}
			
		
		
		
		if( !updatePassword.match( /([0-9])/ ) || !updatePassword.match( /([a-zA-Z])/ ) ){
			swalWithBootstrapButtons.fire({
				title: 'Weak Password',
				text: 'Password should have both alpha numeric characters!',
				icon: 'error',
				showConfirmButton: true,
				allowOutsideClick: false,
				timerProgressBar: true,
				timer: 100000,
			});
			return false;
		}
		
			
		return true;
	});
	
	
});
