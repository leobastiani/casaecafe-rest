$(document).ready(function() {
    // hide the errors field
    $('#alert').hide();
    
    $('.tabs').tabs({
        swipeable: true,
    });

    // navigation on footer
    $('#navigation li a').click(function(e) {
        // remove #, first letter
        var href = $(this).attr('href').slice(1);
        // select this table
        $('.tabs').tabs('select_tab', href);

        // stop link propagation
        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    // make a text so pretty
    // example: 'hello_world' to 'Hello World'
    var pretty = function(text) {
        var res = text.replace(/_(\w?)/gm, function (all, letter) {
            return ' '+letter.toUpperCase();
        });
        // uppercase on the first letter
        res = res[0].toUpperCase() + res.slice(1);
        return res;
    };

    // formatter and currency makes a number
    // currency format like
    // R$ 99,99
    var formatter = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
    });

    var currency = function (n) {
        return formatter.format(n);
    };

    // string to number
    var toNumber = function (n) {
        return parseFloat(n.replace(',', '.'));
    }

    // all number passed in arguments
    // must be valid to return true
    var validNumbers = function () {
        for(var i=0; i<arguments.length; i++) {
            if(isNaN(arguments[i])) {
                return false;
            }
        }
        return true;
    }


    // updating plans
    $.getJSON('/plans', function(plans, textStatus) {
        plans.forEach(function (plan, index) {
            // setting plans table
            var tr = $('<tr>');
            tr.append('<td>'+pretty(plan.product)+'</td>');
            tr.append('<td>'+currency(plan.price)+'</td>');
            tr.append('<td>'+plan.description+'<a class="secondary-content"><i class="material-icons">send</i></a></td>');

            $('#plans tbody').append(tr);


            // updating select from payments
            $('#product').append('<option value="'+plan.product+'">'+pretty(plan.product)+'</option>')
        });

        // i need to do that, its on materialize documentation
        $('select').material_select();

        // click funciton on plans table
        // export information to payments
        $('#plans tr').each(function(index, tr) {
            $(tr).click(function(event) {
                $('#product').parent().find('ul li').eq(index).click();
                $('.tabs').tabs('select_tab', 'tab-payment');
            });
        });

        /**
         * Some of changes on payment fields
         * must change other payment field
         *
         * but, if i implement .change()
         * ill get a infinity loop of changing
         *
         * so i implemented focusout
         */
        
        /**
         * All payments fields has a .change()
         * cause materialize dont change their colors
         * if i just do .val()
         */

        // on change product
        // i have to change price, product_price and discount
        $('#product').change(function(event) {
            // product name
            var product = $(this).val();
            // a plan that reference it
            var plan = plans.find(function (plan) {
                return plan.product == product;
            });
            if(!plan) {
                return ;
            }

            // change product price
            $('#product_price').val(plan.price).change().focusout();
        });

        // changing product_price
        $('#product_price').focusout(function(event) {
            if($('#discount').val() == '') {
                $('#discount').val('0').change();
            }

            var discount = toNumber($('#discount').val());
            var product_price = toNumber($('#product_price').val());

            if(validNumbers(discount, product_price)) {
                var price = (1 - discount / 100) * product_price;
                $('#price').val(price.toFixed(2)).change();
            }
        });

        // changing price
        $('#price').focusout(function(event) {
            var product_price = toNumber($('#product_price').val());
            var price = toNumber($('#price').val());

            if(validNumbers(product_price, price)) {
                var discount = Math.round((product_price - price) / product_price * 100);
                $('#discount').val(discount).change();
            }
        });

        // changing discount is equal of change
        // product price
        $('#discount').focusout(function(event) {
            $('#product_price').focusout();
        });


        // now button change payment_date
        $('#now').click(function(event) {
            var date = new Date();
            var y = (date.getFullYear());
            var m = ('0'+(date.getMonth()+1)).slice(-2);
            var d = ('0'+date.getDate()).slice(-2);
            var hr = ('0'+date.getHours()).slice(-2);
            var min = ('0'+date.getMinutes()).slice(-2);
            var sec = ('0'+date.getSeconds()).slice(-2);

            // example
            // 2017-10-10 04:04:04
            var res = y+'-'+m+'-'+d+' '+hr+':'+min+':'+sec;

            $('#payment_date').val(res).change();
        });


        /**
         * Send a new payment
         * in a POST and JSON form
         */
        $('#payment').submit(function(e) {
            // lets post this data
            // all inputs have a name
            var inputs = $('#payment *[name]');
            var data = {};
            inputs.each(function(index, input) {
                data[$(this).attr('name')] = $(this).val();
            });
            // variable data filled

            // if that post didn't work
            var postError = function (message) {
                // if a got an error
                $('#alert').removeClass('green-text').addClass('red-text');
                // show that message and dont disappear
                $('#alert-message').text(message);
                $('#alert').show();
            }

            $.post('/payments', data, function(data, textStatus, xhr) {
                if(data.error) {
                    postError(data.message)
                } else {
                    $('#alert').addClass('green-text').removeClass('red-text');
                    $('#alert-message').text('Hey, it works!');
                    // disappear after 2 seconds
                    $('#alert').delay(2000).fadeOut('slow');
                    $('#alert').show();
                }
            }).fail(function () {
                postError('Connection failed :(');
            });

            e.preventDefault();
            e.stopPropagation();
            return false;
        });
    }).fail(function () {
        // i couldnt get /plans
        alert('Something went wrong.');
        // reload the page
        window.location.reload();
    });

});