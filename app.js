var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pdfRouter = require('./routes/pdf');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);


const pdf = require('pdfjs');
var fs = require('fs');

var moment = require('moment');
var currencyFormatter = require('currency-formatter');
const PDFDocument = require('pdfkit');
const stripeClient = require('stripe')('sk_test_omgwGDw0Fa12ZRHGlCll3Y6D');

const myFont = new pdf.Font(fs.readFileSync('./public/fonts/avenir_black.ttf'));
app.get("/pdf/receipt/:custID/:invoiceID/:productID", function (request, response) {
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

        var doc = new pdf.Document({
            font:myFont
        })

        var header = doc.header().table({ widths: [null] });
        const row = header.row();
        row.cell('cell1')
       /* header.cell().text({ textAlign: 'right' })
            .add('A Portable Document Format (PDF) generation library targeting both the server- and client-side.')
            .add('https://github.com/rkusa/pdfjs', {
                link: 'https://github.com/rkusa/pdfjs',
                underline: true,
                color: 0x569cd6
            });*/

        const text1 = doc.text({fontSize:32})
        text1.add('Some text')
        doc.pipe(response)
        doc.end();
    });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
