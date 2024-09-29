$(function(){
    const name = $('#name');
    const password = $('#password');
    const password_confirm = $('#password-confirm');
    const root = $(':root');
    let enviUser = false;
    let enviPass = false;
    let enviPassConfirm = false;

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

    const validateForm = {
        username: function(){
            const nameVal = name.val().trim();
            const errorMsg = $('.erro-msg');

            if(nameVal.length === 0){
                root.css('--box-shadow-color-input_one', '#8f8f8f');
                errorMsg.eq(0).text('');
                enviUser = false;
            }else if(nameVal.length > 0 && nameVal.length < 10){
                errorMsg.eq(0).text('O nome tem que ter entre 10 e 100 caracteres.');
                root.css('--box-shadow-color-input_one', '#a10000');
            }else if(nameVal.length > 100 ){
                errorMsg.eq(0).text('O nome tem que ter entre 10 e 100 caracteres.');
                root.css('--box-shadow-color-input_one', '#a10000');
            }else if(nameVal.length < 100 && nameVal.length > 10){
                name.removeClass('error-input');
                errorMsg.eq(0).text('');
                root.css('--box-shadow-color-input_one', '#00e000');
                enviUser = true;
            }
        },
        password: function(){},
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

    $(name).on('input' ,function(){
        validateForm.username();
    });

    const action = $('input[name="action"]');

    action.click(function(e){
        if(enviUser && enviPass && enviPassConfirm){
            return true;
        }else{
            e.preventDefault();
            return false;
        }
    });
});