var jsforce = require('jsforce');

// Salesforce OAuth2 client information
var conn = new jsforce.Connection({
  oauth2 : {
    // you can change loginUrl to connect to sandbox or prerelease env.
    loginUrl : 'https://test.salesforce.com',
    clientId: process.env.Consumer_Key,
    clientSecret:  process.env.Consumer_Secret,
    redirectUri: process.env.Callback_URL,
  }
});
//all the routes for our application
module.exports = function(app, passport,db,pgp) {
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });
    //app.get('/api', './routes/api.js');
    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
        console.log(req.user);
    });
    app.get('/neworder', isLoggedIn, function(req, res) {
        res.render('neworder.ejs', {
            user : req.user // get the user out of session and pass to template
        });
        console.log(req.user);
    });
    // =====================================
    // FACEBOOK ROUTES =====================
    // =====================================
    // route for facebook authentication and login
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));


// =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    app.get('/api/contracts', function(req, res) {
        if(req.hasOwnProperty('user')){
            var loginUser = req.user;
            var results = [];
            console.log(loginUser);
		db.query("SELECT * FROM salesforce.contract WHERE accountid ='"+loginUser.accountid+"'", [])
		    .then(function (data) {
		        return res.json(data);
		    })
		    .catch(function (err) {
		        console.log("ERROR:", err); // print the error;
		        return res.status(500).json({ success: false,error : err});
		    })
		    .finally(function () {
		        // If we do not close the connection pool when exiting the application,
		        // it may take 30 seconds (poolIdleTimeout) before the process terminates,
		        // waiting for the connection to expire in the pool.
		
		        // But if you normally just kill the process, then it doesn't matter.
		
		        pgp.end(); // for immediate app exit, closing the connection pool.
		
		        // See also:
		        // https://github.com/vitaly-t/pg-promise#library-de-initialization
		    });

        }else{
            return res.status(500).json({ success: false});
        }
    });
    app.get('/api/products/:pbId', function(req, res) {
         var pbId = req.params.pbId;
        if(req.hasOwnProperty('user')){
        
            var loginUser = req.user;
            var results = [];
            console.log(loginUser);
		db.query("SELECT * FROM salesforce.product2 INNER JOIN salesforce.pricebookentry ON salesforce.product2.sfid = salesforce.pricebookentry.product2id WHERE salesforce.pricebookentry.pricebook2id ='"+pbId+"'", true)
		    .then(function (data) {
		        return res.json(data);
		    })
		    .catch(function (err) {
		        console.log("ERROR:", err); // print the error;
		        return res.status(500).json({ success: false,error : err});
		    })
		    .finally(function () {
		        // If we do not close the connection pool when exiting the application,
		        // it may take 30 seconds (poolIdleTimeout) before the process terminates,
		        // waiting for the connection to expire in the pool.
		
		        // But if you normally just kill the process, then it doesn't matter.
		
		        pgp.end(); // for immediate app exit, closing the connection pool.
		
		        // See also:
		        // https://github.com/vitaly-t/pg-promise#library-de-initialization
		    });

        }else{
            return res.status(500).json({ success: false});
        }
    });
    
	app.post('/api/orderitem', function(req, res) {
    	if(req.hasOwnProperty('user')){
            var loginUser = req.user;
            var results = [];
            var data =req.body;
			var order = data.order;
			var orderItems = data.orderItems;
			order.AccountId = loginUser.accountId;
			conn.login('rkosalairama@csc.com.retaildev', '$KS726kosaluWE4MMx6gIh9GUVY22Xv7YcQn', function(err, userInfo) {
			  if (err) { return console.error(err); }
			  // Now you can get the access token and instance URL information.
			  // Save them to establish connection next time.
			  console.log(conn.accessToken);
			  console.log(conn.instanceUrl);
			  // logged in user property
			  console.log("User ID: " + userInfo.id);
			  console.log("Org ID: " + userInfo.organizationId);
			  // Single record creation
			  console.log("Order Id"+order);
				conn.sobject("Order").create(order, function(err, ret) {
				  if (err || !ret.success) { return console.error(err, ret); }
				  console.log("Created record id : " + ret.id);
				  // Multiple records creation
				  for(var i=0;i<orderItems.length;i++){
					  orderItems[i].orderId = ret.id;
				  }
					conn.sobject("OrderItem").create(orderItems,
					function(err, rets) {
					  if (err) { return console.error(err); }
					  for (var i=0; i < rets.length; i++) {
						if (rets[i].success) {
						  console.log("Created record id : " + rets[i].id);
						}
					  }
					  // ...
					});
				});
			});
        }else{
            return res.status(500).json({ success: false});
        }
    		
    });
    app.get('/api/order', function(req, res) {
        
        if(req.hasOwnProperty('user')){
        
            var loginUser = req.user;
            var results = [];
            console.log(loginUser);
		db.query("SELECT * FROM salesforce.order INNER JOIN salesforce.orderitem ON salesforce.order.sfid = salesforce.orderitem.orderid INNER JOIN salesforce.pricebookentry ON salesforce.orderitem.pricebookentryid = salesforce.pricebookentry.sfid WHERE accountid ='"+loginUser.accountid+"';", [])
		    .then(function (data) {
		        return res.json(data);
		    })
		    .catch(function (err) {
		        console.log("ERROR:", err); // print the error;
		        return res.status(500).json({ success: false,error : err});
		    })
		    .finally(function () {
		        // If we do not close the connection pool when exiting the application,
		        // it may take 30 seconds (poolIdleTimeout) before the process terminates,
		        // waiting for the connection to expire in the pool.
		
		        // But if you normally just kill the process, then it doesn't matter.
		
		        pgp.end(); // for immediate app exit, closing the connection pool.
		
		        // See also:
		        // https://github.com/vitaly-t/pg-promise#library-de-initialization
		    });

        }else{
            return res.status(500).json({ success: false});
        }
    });
    app.get('/api/pricebook', function(req, res) {
        if(req.hasOwnProperty('user')){
        
            var loginUser = req.user;
            var results = [];
            db.query("SELECT * FROM salesforce.Pricebook2", [])
	    .then(function (data) {
	        return res.json(data);
	    })
	    .catch(function (err) {
	        console.log("ERROR:", err); // print the error;
	        return res.status(500).json({ success: false,error : err});
	    })
	    .finally(function () {
	        // If we do not close the connection pool when exiting the application,
	        // it may take 30 seconds (poolIdleTimeout) before the process terminates,
	        // waiting for the connection to expire in the pool.
	
	        // But if you normally just kill the process, then it doesn't matter.
	
	        pgp.end(); // for immediate app exit, closing the connection pool.
	
	        // See also:
	        // https://github.com/vitaly-t/pg-promise#library-de-initialization
	    });
        }else{
            return res.status(500).json({ success: false});
        }
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated()) {
        console.log('isLoggedin');
        return next();
    }
    console.log('is not logged in');

    // if they aren't redirect them to the home page
    res.redirect('/');
}
