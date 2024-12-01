jQuery( document ).ready(function( $ ) {
	

	$( 'select#viewGroupId' ).on('change', function( e ) {
		var form = $(this).closest('form');
		form.submit();
	});
	
	
	
	$( '.removeRestrictionOption' ).click(function(e){
		e.preventDefault();
		
		var restrictoinName = $(this).data('restrictionname');
		
		swalWithBootstrapButtons.fire({
		  icon: 'warning',
		  title: 'Are you sure?',
		  text: 'This restriction name/option "'+restrictoinName+'" will be removed from all groups and nodes.',
		  buttonsStyling: false,
		  showCancelButton: true,
		  confirmButtonText: 'Yes, remove it!'
		}).then((result) => {
		  if (result.isConfirmed) {

			swalWithBootstrapButtons.fire({
				title: 'Please wait',
				text: 'Removing restriction name/option: '+restrictoinName,
				icon: 'warning',
				showConfirmButton: false,
				allowOutsideClick: false,
				timerProgressBar: true,
				timer: 100000,
			});
			
			
			$.ajax({
				method: 'get',
				url:'/index.php',
				dataType:'json',
				data:{ 'task':'view-restrictions', 'subTask':'removeRestrictionOption', 'restriction_name':restrictoinName }
			}).done( function(){
				location.reload();
			});
			
		  }
		});




	});
	
	
	
});
