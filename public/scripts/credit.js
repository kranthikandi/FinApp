$(document).on('ready', function () {

    $('#saveCredit').on('click', function () {
        if ($('#creditForm input').hasClass('parsley-error')) {
            return
        }
        var data = {
            name: $('#name').val(),
            date: $("#creDate").val(),
            typeOfAccount: $("#toAccount").val(),
            entityType: $("#entityType").val(),
            note: $("#notes").val(),
            amount: $("#creAmt").val()
        }
        $.ajax({
            url: "cli/newCli",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {

            }
        })
    })

})