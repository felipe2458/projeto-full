$(function(){
    const name = $('#name');
    const password = $('#password');
    const password_confirm = $('#password-confirm');

    function focusInput(input){
        const labelID = input.attr('id') + '-label';
        const label = $('#' + labelID);

        if(input.val().trim().length > 0){
            label.addClass('focus-input');
        }else{
            label.removeClass('focus-input');
            input.val('');
        }
    }

    $(name).focus(function(){
        focusInput($(this));
    }).blur(function(){
        focusInput($(this));
    });

    $(password).focus(function(){
        focusInput($(this));
    }).blur(function(){
        focusInput($(this));
    });

    $(password_confirm).focus(function(){
        focusInput($(this));
    }).blur(function(){
        focusInput($(this));
    });
});