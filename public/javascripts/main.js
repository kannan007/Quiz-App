$(document).ready(function() {
	(function() {
		var registeredusersprototype=function(name,pwd) {
			this.username=name,
			this.password=pwd
		};
		var loginusersprototype=function(name,pwd) {
			this.username=name,
			this.password=pwd
		};
		var registeredusers;
		var loginusers;
		var controller= {
			init:function() {
				view.init();
			},
			signup:function() {
				$.ajax({
				  method: "POST",
				  url: "http://localhost:3000/users/register",
				  data: { username: registeredusers.username, password: registeredusers.password },
					success: function() {
				  		alert("Registration Successfull please login to continue");
				  		window.href=""
				  	},
				  	error: function(req,msg,res) {
				  		console.log(req);
				  		console.log(msg);
				  		console.log(res);
				  	}
				});
			},
			login:function() {
				$.ajax({
				  method: "POST",
				  url: " http://localhost:3000/users/login",
				  data: { username: loginusers.username, password: loginusers.password }
				})
				.done(function(msg) {
					console.log(msg.id);
					if (typeof(Storage) !== "undefined") {
		    		// Store
					    localStorage.setItem("token", msg.token);
					    localStorage.setItem("id", msg.id);
					    // Retrieve
					    if(loginusers.username==="admin") {
					    	window.location.href="./users.html";
					    }
					    else {
					    	window.location.href = "./categories.html";
					    }
					    console.log("getting");
					} else {
					    alert("localStorage is not supported");
					}
					token=msg.token;
				    console.log(msg);
				})
				.fail(function(msg){
					console.log("error");
				});
			}
		};
		var view= {
			init:function() {
				this.registerbutton=$(".register-users-button");
				this.loginbutton=$(".login-button");
				var username=$("#username");
				var password=$("#pwd");
				var signupusername=$("#signupusername");
				var signuppassword=$("#signuppwd");
				this.registerbutton.on('click',function() {
					registeredusers=new registeredusersprototype(signupusername.val(),signuppassword.val());
					//controller.signup();
				});
				this.loginbutton.on('click',function() {
					loginusers=new loginusersprototype(username.val(),password.val());
					controller.login();
				});
			}
		}
		controller.init();
	})();
});