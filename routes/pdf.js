var express = require('express');
var router = express.Router();
var moment = require('moment');
var currencyFormatter = require('currency-formatter');
const PDFDocument = require('pdfkit');
const stripeClient = require('stripe')('sk_test_omgwGDw0Fa12ZRHGlCll3Y6D');




const pdf = require('pdfjs');
var fs = require('fs');


//let font1 = '../../public/fonts/avenir_black.ttf';
//const myFont = new pdf.Font(fs.readFileSync(font1));
//console.log(myFont);
router.get("/:custID/:invoiceID/:productID", function (request, response) {
    let invoiceID = request.params.invoiceID
    let custID = request.params.custID
    let productID = request.params.productID
    let filename = 'invr_' + encodeURIComponent(invoiceID) + '.pdf';
    let invoice = null;
    let customer = null;
    Promise.all([
        stripeClient.invoices.retrieve(invoiceID),
        stripeClient.customers.retrieve(custID),
        stripeClient.products.retrieve(productID)

    ]).then((res) => {
        let invoice = res[0];
        let customer = res[1];
        let product = res[2];
        let line = invoice.lines.data[0];
        let plan = invoice.lines.data[0].plan;
        response.setHeader('Content-disposition', 'inline; filename="' + invoiceID + '"')
        response.setHeader('Content-type', 'application/pdf')
        //const content = filename;
        //const doc = new PDFDocument();


// available variables: pdf, fonts, logo, lorem

        var doc = new pdf.Document({

            padding: '52'
        })

        doc.text('M3DICINE Pty Ltd',);
        doc.pipe(response)
        doc.end()

        /* let font1= 'fonts/avenir_black.ttf';
         let font2= './fonts/avenir_book.ttf';
         doc.registerFont('Heading Font', font1);
         doc.font(font1);*/


        /*  doc.fontSize(20).fillColor('#333160').text('M3DICINE Pty Ltd', 50, 60, {align: 'left'});
          doc.fontSize(18).fillColor('#8498ac').text('Receipt', 450, 60, {align: 'right'})

          doc.fontSize(10);
          doc.fillColor('#333160').text('Paid to', 50, 110, {align: 'left'});
          doc.text('Paid by', 200, 110);
          doc.text('Receipt Number', 350, 110);
          doc.text(invoice.receipt_number, 400, 110, {align: 'right'});


          doc.lineGap(5).fillColor('#8498ac').text('M3DICINE Pty Ltd \n1389 Beenleigh Road\nKuraby QLD 4112\nAustralia\n' +
              '+61 7 5541 0034 \nnayyar@m3dicine.com', 50, 130, {align: 'left'})
          doc.text(customer.description, 200, 130) //name of the customer
          doc.text('Invoice Number', 350, 130)
          doc.text(invoice.number, 400, 130, {align: 'right'}) //invoice number
          doc.text('Date Paid', 350, 150)
          doc.text(moment.unix(invoice.date).format('MMMM D, YYYY'), 400, 150, {align: 'right'})

          doc.moveDown();
          doc.moveDown();
          doc.moveDown();
          doc.moveDown();
          doc.moveDown();

          var formattedMoney = currencyFormatter.format(invoice.amount_paid, {code: invoice.currency.toUpperCase()});
          doc.fontSize(24).fillColor('#333160').text(`${formattedMoney} paid on ${moment.unix(invoice.date).format('MMMM D, YYYY')}`, 50)

          doc.moveDown();
          doc.fontSize(12);
          doc.text('Description', 60, 300, {align: 'left'});
          doc.text('Qty', 300, 300);
          doc.text('Unit price', 390, 300);
          doc.text('Amount', 400, 300, {align: 'right'});

          doc.moveTo(50, 320).lineTo(550, 320).lineWidth(2).strokeColor('#8498ac').stroke();
          doc.fillColor('#8498ac').text(`${moment.unix(line.period.start).format('MMM D')} - ${moment.unix(line.period.end).format('MMM D YYYY')}`, 60, 340)


          var unitPrice = currencyFormatter.format(plan.amount/100, {code:plan.currency.toUpperCase()})
          var amountPriceLine = currencyFormatter.format(line.amount/100, {code:line.currency.toUpperCase()})
          doc.fillColor('#333160').text(`${product.name} (per ${product.unit_label})`, 60, 380)
          doc.text(`${line.quantity}`, 300, 380)
          doc.text(`${unitPrice}`, 390, 380)
          doc.text(`${amountPriceLine}`, 400,380, {align:'right'})

          doc.moveTo(50, 410).lineTo(550, 410).lineWidth(2).stroke();

          var subTotal = currencyFormatter.format(invoice.subtotal/100, {code:invoice.currency.toUpperCase()})
          var total = currencyFormatter.format(invoice.total/100, {code:invoice.currency.toUpperCase()})
          var appliedBalance = currencyFormatter.format((invoice.starting_balance-invoice.ending_balance)/100, {code:invoice.currency.toUpperCase()})
          var amountPaid = currencyFormatter.format((invoice.amount_paid)/100, {code:invoice.currency.toUpperCase()})
          doc.fillColor('#8498ac').text('Subtotal', 390, 430);
          doc.text('Total', 390, 460);
          doc.text('Applied Balance', 390, 490);
          doc.fillColor('#333160').text(`${subTotal}`, 400, 430, {align:'right'});
          doc.text(`${total}`, 400,460, {align:'right'});
          doc.text(`${appliedBalance}`, 400,490, {align:'right'});

          doc.moveTo(320, 520).lineTo(550, 520).lineWidth(2).stroke();

          doc.text('Amount Paid', 390,530);
          doc.text(`${amountPaid}`, 400, 530, {align:'right'});


          doc.moveTo(50, 650).lineTo(550, 650).lineWidth(2).stroke();
          doc.fontSize(10).text('Questions? Contact M3DICINE Pty Ltd at nayyar@m3dicine.com or call at +61 7 5541 0034.', 50, 660)
          doc.text(`${invoice.receipt_number}`, 400,660,{align:'right'})

          doc.pipe(response)
          doc.end()*/
    });
})
module.exports = router;
