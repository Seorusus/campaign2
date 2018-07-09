(function($) {
    var amount = 0;
    var aText = "";
    var email = 'info@campaigndotng.org';
	Drupal.behaviors.donate = {
        attach: function(context) {
            $('#other').change(function() {
                $('#other-next').show();
            });
            $('#other').focus(function() {
                if ($('#other').val() == "Other amount") {
                    $('#other').val("");
                }
            }).blur(function() {
                if ($('#other').val() == "") {
                    $('#other').val("Other amount");
                }
            });
			
        },
        setAmount: function(a, dom, text) {
			var $this = $(this),
			$all = $('.selectAmt');

        $all.not($this).toggleClass('active', false).toggleClass('default', true);
        $this.toggleClass('active', true).toggleClass('default', false);
            //$('.selectAmt span').removeClass("selected");
            aText = text;
            if (a != 0) {
                amount = a;
                $('#other').val('Other amount');
                $(dom).addClass("selected");
            } else {
                amount = $('#other').val();
            }
			aText = amount;
			while (/(\d+)(\d{3})/.test(aText.toString())){
				aText = aText.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
			}
			$('#amount2').text(aText);
        },
        showStep1: function() {
			$('#stepno').text("1");
            $('.step2').hide();
            $('.step1').show();
			$('.step1error').hide();
            $('.step3').hide();
        },
        showStep2: function() {		
			if(amount<= 0){
				$('.step1error').show();
				return;
			}
			$('#stepno').text("2");
			$('.step1').hide();
			$('.step2').show();
			$('.step2error').hide();
			$('.step3').hide();
			
        },
        showStep3: function() {
			var get_email = document.getElementById('donate_email');
			var the_email = get_email.value;
			var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
			if(!email_regex.test(the_email)){
				$('.step2error').show();
				return;
			}
			$('#stepno').text("3");
            $('.step3').show();
            $('.step2').hide();
            $('.step1').hide();
			$('#amount3').text(aText);
        },
        toggleShare: function() {

            $("#brilio_facebook").attr('href', 'https://www.facebook.com/sharer/sharer.php?u=' + location.href);
            $("#brilio_gplus").attr('href', 'https://plus.google.com/share?url=' + location.href);
            $("#brilio_twitter").attr('href', 'https://twitter.com/home?status=' + location.href);
            $("#brilio_linkedin").attr('href', 'https://www.linkedin.com/shareArticle?mini=&truetitle=&summary=&source=&url=' + location.href);
            $(".share-links").toggle("slow", function() {
                if ($(this).is(':visible')) {
                    $('.share-button').text("- SHARE");
                } else {
                    $('.share-button').text("+ SHARE");
                }
            });

        },
        completeDonation: function() {
			// Call PHP Function That Does The Following
			// Takes Amount, Email Address, Payment Method
			// Saves it in Database Table
			// Returns Unique Code that will be sent to PayStack/PayPal
            var uds = parseInt(amount * Drupal.settings.usd_to_nga);
            if ($('input[name=donate_radio]:checked').val() == "pp") {
                var url = "https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=" + Drupal.settings.ppemail + "&lc=US&item_name=Campaign donation&amount=" + uds + "%2e00&currency_code=USD&no_note=0&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHostedGuest";
                location.href = url;
            } 
			if ($('input[name=donate_radio]:checked').val() == "ps") {
				var get_email = document.getElementById('donate_email');
				var the_email = get_email.value;
				var paystack_key = "pk_live_5322e575c2d18cfefac6b665c602f606ccebfad3";
				var the_amount = amount * 100;

				var handler = PaystackPop.setup({
				  key: paystack_key,
				  email: the_email,
				  amount: the_amount,
				  //ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference. Please replace with a reference you generated. Or remove the line entirely so our API will generate one for you
				  
				  callback: function(response){
					  alert("Thank you for your donation");
				  },
				  onClose: function(){
					//alert('window closed');
				  }
				});
				handler.openIframe();
            }		
			if ($('input[name=donate_radio]:checked').val() == 'bank') {
				$('.stepBank').show();
				$('.step3').hide();
                $.post("/cell/join",
                        {ajaxFct: "sendDonateMail", smail: the_email, sbody: $(".stepBank").html()},
                function(resp) {
                    setInterval(function() {
                        // $('.step').hide();
                        $('.stepBank').show();
                    });
                    if (resp.status == "success") {
                    } else {
                        alert("An error has occured. Please try again")
                    }
                }, 'json');
            }
        },
        virtualCell: function(sid) {
            $.post("/cell/join", {ajaxFct: "virtualCell", sid: sid}, function(resp) {
                if (resp.status == "success") {
                    Drupal.behaviors.donate.showFinalScreen(resp.info.first_name + " " + resp.info.last_name, resp.cell.title);
                } else {
                    alert('An error has occured. Plese try again');
                }
            }, 'json');
        },
        physicalCell: function(sid) {
            $.post("/cell/join", {ajaxFct: "physicalCell", sid: sid}, function(resp) {
                if (resp.status == "success") {
                    var respCells = '<div class="cell-container-title">Here are a list of cells in the location you specified?</div>';
                    respCells += '<div class="cells">';
                    $.each(resp.cells, function(k, v) {
                        respCells += '<div class="pcell"><div class="cellName">' + v.title + '</div><a href="javascript:;" onclick = "Drupal.behaviors.donate.joinCell(' + v.nid + ',' + sid + ')">Join</a></div>';
                    });
                    respCells += '<a href="javascript:;" class="cell" onclick="Drupal.behaviors.donate.showCreateCell(' + sid + ')">Create a cell</a>';
                    $("#cells-container").html(respCells);
                    respCells += '</div>';
                } else {
                    alert('An error has occured. Plese try again');
                }
            }, 'json');
        }, newCell: function(sid) {
            $.post("/cell/join", {ajaxFct: "joinCell", sid: sid, cellName: $("#newCell").val()}, function(resp) {
                if (resp.status == "success") {
                    Drupal.behaviors.donate.showFinalScreen(resp.info.first_name + " " + resp.info.last_name, resp.cell.title);
                } else {
                    alert('An error has occured. Plese try again');
                }
            }, 'json');
        }, joinCell: function(nid, sid) {
            $.post("/cell/join", {ajaxFct: "joinCell", sid: sid, nid: nid}, function(resp) {
                if (resp.status == "success") {
                    Drupal.behaviors.donate.showFinalScreen(resp.info.first_name + " " + resp.info.last_name, resp.cell.title);
                } else {
                    alert('An error has occured. Plese try again');
                }
            }, 'json');
        }, showCreateCell: function(sid) {
            var create = '<div class="cell-container-title">Create your own cell?</div>';
            create += '<div class="cells">';
            create += '<div class="icell"><label for="newCell">Cell Name:</label><input type="text" class="inputCell" name="newCell" id="newCell"/></div>';
            create += '<a href="javascript:;" class="cell" onclick = "Drupal.behaviors.donate.newCell(' + sid + ')">Create</a></div>';
            create += '</div>'
            $("#cells-container").html(create);
        }, showFinalScreen: function(name, cname) {
            var refferals = Drupal.behaviors.donate.getRefferalsNumber();
            var html = '<div class="cell-container-title centered">Invite people to join Campaign.ng today</div>';
            html += '<div class="cells">';
            html += '<div class="volcell"><strong>Volunteer:</strong> ' + name + ' </div>';
            html += '<div class="volcell"><strong>Cell:</strong>' + cname + ' </div>';
            html += '<a class="cell-blue" href=""><span id="social-fb"></span><span style="float:left">Share on facebook</span></a>';
            html += '<a class="cell-blue" href=""><span id="social-tweet"></span><span style="float:left">Share on twitter</span></a>';
            html += '<div class="centered"><span class="cmp-text">Current Member Position </span><span class="cmp">' + refferals + '</span></div>';
            var refferalsLeft = 50 - refferals;
            html += '<div class="pane-borderd centered"><span style="float:left">Invite ' + refferalsLeft + ' more people to become &nbsp;</span> <span class="green"> ambasador</span></div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            $("#cells-container").html(html);
        }, getRefferalsNumber: function() {
            var refs = 0
            return refs;
        }
    };
})(jQuery);