import { connect } from 'tls';

// importing modules

var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors');
var bodyparser = require('body-parser');
var path = require('path');

var app = express();

const route = require('./routes/route');
const employee = require('./routes/employee');
const customer = require('./routes/customer');
const driver = require('./routes/ICdriver');
const fleet = require('./routes/fleet_router');
const job = require('./routes/jobs');
const dispatch = require('./routes/dispatch');
const appJob = require('./routes/appJob')
const svcc = require('./routes/svcc_route');
const user = require('./routes/user');
const ftbill = require('./routes/ftbill');
const inv = require('./routes/invoiceRoute');
const dashboard = require('./routes/dashboard');
const cont = require('./routes/contactRoutes')
const msg = require('./routes/messges')
const email = require('./routes/emails')
const client = require('./routes/clientRoute')

//connect to mongodb
mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://meega:a12341234@ds139138.mlab.com:39138/etrucking_dev', {
//  useMongoClient: true,
//  connectTimeoutMS: 1000
// });
// mongo cluster 
//mongodb+srv://sunnytrans:History12@cluster0-lglvi.azure.mongodb.net/etrucking?retryWrites=true&w=majority
//mongodb+srv://kranthi:KiU7Jr6xCmwYsqlz@demodata.qubcd.azure.mongodb.net/etrucking?retryWrites=true&w=majority
// mongodb://localhost:20202/etrucking
//mongodb://13.57.178.66:20202/etrucking
//Kevin Demo 
//mongodb+srv://kranthi:WcVQaoA1Htvqrj7E@etrucking-demo-kevin.6apho.mongodb.net/<dbname>?retryWrites=true&w=majority
con()
function con() {
    mongoose.connect('mongodb://52.8.237.158:52634/etrucking', {
        useNewUrlParser: true,
        connectTimeoutMS: 1000
    })
}

//on connection 
mongoose.connection.on('connection', () => {
    useMongoClient: true
    console.log('connected to mongodb @ 20202')
});

mongoose.connection.on('error', (err) => {
    useMongoClient: true
    if (err) {
        console.log('error occured ' + err)
        con()
    }
});

//port number

const port = process.env.PORT || 55;

//middleware - cors
app.use(cors());
/* 
var redirectToHTTPS = require('express-http-to-https').redirectToHTTPS

// Don't redirect if the hostname is `localhost:port` or the route is `/insecure`
app.use(redirectToHTTPS([/localhost:(\d{4})/], [/\/insecure/], 301));
 */

//middleware - body-parser
app.use(bodyparser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', route);
app.use('/emp', employee);
app.use('/cust', customer);
app.use('/dri', driver);
app.use('/fle', fleet);
app.use('/job', job);
app.use('/svcc', svcc);
app.use('/disp', dispatch);
app.use('/appJob', appJob);
app.use('/user', user);
app.use('/ftb', ftbill);
app.use('/inv', inv);
app.use('/dash', dashboard)
app.use('/contact', cont)
app.use('/msg', msg)
app.use('/email', email)
app.use('/cli', client)

//testing server
app.get('/', (req, res) => {
    res.send('testinggggg');
})

app.listen(port, () => {
    console.log('server started at : ' + port)
})
