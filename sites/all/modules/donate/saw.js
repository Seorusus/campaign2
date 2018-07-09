/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
$ =jQuery;
$(document).ready(function() {
    $('#edit-field-state-und').change(function() {
        var state = $('#edit-field-state-und').val();
        $.each($('#edit-field-area-und option'), function(k, v) {
            if ($(v).val() != '') {
                $(v).hide();
                if ($(v).val().indexOf(state) > -1)
                    $(v).show();
            }
        });
    });
    $('#edit-field-area-und').change(function() {
        area = $('#edit-field-area-und').val();
        $.each($('#edit-field-ward-und option'), function(k, v) {
            if ($(v).val() != '') {
                $(v).hide();
                if ($(v).val().indexOf(area) > -1)
                    $(v).show();
            }
        });
    });
});