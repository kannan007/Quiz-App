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
				  url: " http://localhost:3000/users/register",
				  data: { username: registeredusers.username, password: registeredusers.password }
				})
				.done(function(msg) {
				    alert("Succesfully registered");
				    window.location.href="./login.html";
				})
				.fail(function(msg){
					console.log("error");
				});
			},
			login:function() {
				$.ajax({
				  method: "POST",
				  url: " http://localhost:3000/users/login",
				  data: { username: loginusers.username, password: loginusers.password }
				})
				.done(function(msg) {
					if (typeof(Storage) !== "undefined") {
		    		// Store
					    localStorage.setItem("token", msg.token);
					    // Retrieve
					    console.log(localStorage.getItem("token"));
					    if(loginusers.username==="admin") {
					    	window.location.href="./users.html";
					    }
					    else {
					    	window.location.href = "./test.html";
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
				this.registerbutton.on('click',function() {
					registeredusers=new registeredusersprototype(username.val(),password.val());
					controller.signup();
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