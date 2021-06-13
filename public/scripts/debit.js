$(document).on('ready', function () {

    $('#search').on('click', function () {
        findCli()
    })
    function findCli() {
        if ($('#name').val() == '' || $('#entityType').val() == '' || $('#toAccount').val() == '') {
            alert('enter all fields')
            return
        }
        var data = {
            name: $('#name').val(),
            entityType: $('#entityType').val(),
            toAccount: $('#toAccount').val()
        }
        $.ajax({
            url: "cli/thisCli",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                console.log(result)
                var x = 0
                for (var i = 0; i < result.length; i++) {
                    x = x + result[i].amount
                }
                x = x.toString();
                var lastThree = x.substring(x.length - 3);
                var otherNumbers = x.substring(0, x.length - 3);
                if (otherNumbers != '')
                    lastThree = ',' + lastThree;
                var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
                $('#creSum').empty()
                $('#creSum').text(res)
                $('#cliInfo').show()
            }
        })
    }
    $('#postDebit').on('click', function () {
        var amt = $('#debitAmt').val() * -1
        var data = {
            name: $('#name').val(),
            entityType: $('#entityType').val(),
            typeOfAccount: $('#toAccount').val(),
            amount: amt,
            date: new Date()
        }
        $.ajax({
            url: "cli/postDebit",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                findCli()
                $('#debitAmt').val('')
            }
        })
    })
    $('#stmtSearch').on('click', function () {
        var data = {
            name: $('#name').val(),
            entityType: $('#entityType').val(),
            toAccount: $('#toAccount').val()
        }
        $.ajax({
            url: "cli/thisCli",
            data: JSON.stringify(data),
            type: 'post',
            dataType: 'json',
            contentType: 'application/json',
            beforeSend: function (xhr) {
                $.blockUI({ message: '<h1><i class="fa fa-spinner fa-spin"></i></h1>' });
            },
            success: function (result) {
                $.unblockUI();
                var tdata = '<thead><tr><td>Name : ' + $('#name').val() + '</td><td> Type of Account : ' + $('#toAccount').val() + '</td><td>Entity Type : ' + $('#entityType').val() + '</td></tr></thead>'
                var tot = 0
                for (var i = 0; i < result.length; i++) {
                    tot = tot + result[i].amount
                    var x = result[i].amount, neg = false
                    if (x < 0) {
                        neg = true
                    }
                    x = x.toString();
                    var lastThree = x.substring(x.length - 3);
                    var otherNumbers = x.substring(0, x.length - 3);
                    if (otherNumbers != '')
                        lastThree = ',' + lastThree;
                    var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
                    if (!neg) {
                        res = '<span class = "text-success"> ₹' + res + '</span>'
                    } else {
                        res = '<span class = "text-danger"> ₹' + res + '</span>'
                    }
                    tdata = tdata + '<tr><td colspan="2">' + moment(result[i].date).format('DD/MM/YYYY') + '</td><td> ' + res + '</td></tr>'
                }
                tot = tot.toString();
                var lastThree = tot.substring(tot.length - 3);
                var otherNumbers = tot.substring(0, tot.length - 3);
                if (otherNumbers != '')
                    lastThree = ',' + lastThree;
                var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
                tdata = tdata + '<tfoot><tr><td></td><td></td><td "> Total : <span class = "text-success">₹ ' + res + '</span></td></tr></tfoot>'
                $('#stmtTab').empty()
                $('#stmtTab').append(tdata)
            }
        })
    })

    $('#stmtExcel').on('click', function () {
        tableToExcel('stmtTab', $('#name').val(), $('#name').val())
    })
    function tableToExcel(table, name, filename) {
        let uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><title></title><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>',
            base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }, format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }

        if (!table.nodeType) table = document.getElementById(table)
        var ctx = { worksheet: name || 'Worksheet', table: table.innerHTML }

        var link = document.createElement('a');
        link.download = filename;
        link.href = uri + base64(format(template, ctx));
        link.click();
    }
    $('#stmtPdf').on('click', function () {
        createPDF()
    })
    function createPDF() {
        var sTable = document.getElementById('pdfTab').innerHTML;

        var style = "<style>";
        style = style + "table {width: 100%;font: 17px Calibri;}";
        style = style + "table, th, td {border: solid 1px #DDD; border-collapse: collapse;";
        style = style + "padding: 2px 3px;text-align: center;}";
        style = style + "</style>";

        // CREATE A WINDOW OBJECT.
        var win = window.open('', '', 'height=700,width=700');

        win.document.write('<html><head>');
        win.document.write('<title>Statement</title>');   // <title> FOR PDF HEADER.
        win.document.write(style);          // ADD STYLE INSIDE THE HEAD TAG.
        win.document.write('</head>');
        win.document.write('<body>');
        win.document.write(sTable);         // THE TABLE CONTENTS INSIDE THE BODY TAG.
        win.document.write('</body></html>');

        win.document.close(); 	// CLOSE THE CURRENT WINDOW.

        win.print();    // PRINT THE CONTENTS.
    }

})