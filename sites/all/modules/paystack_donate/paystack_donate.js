function payWithPaystack(){
	var get_email = document.getElementById('paystack_donate_email');
	var the_email = get_email.value;
	
	var get_amount = document.getElementById('paystack_donate_amount');
	var the_amount = get_amount.value * 100;

	var handler = PaystackPop.setup({
	  key: Drupal.settings.paystack_donate.paystack_key,
	  email: the_email,
	  amount: the_amount,
	  //ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
	  
	  callback: function(response){
		  alert(Drupal.settings.paystack_donate.success_message);
	  },
	  onClose: function(){
		//alert('window closed');
	  }
	});
	handler.openIframe();
};

