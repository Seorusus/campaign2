$(document).ready(function(e){
    		
			$('.img-check').click(function(e) {
        $('.img-check').not(this).removeClass('check')
    		.siblings('input').prop('checked',false);
    	$(this).addClass('check')
            .siblings('input').prop('checked',true);
    });
			
});
