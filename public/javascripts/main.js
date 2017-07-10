$(document).ready(function() {
	$(".register-users-button").click(function() {
		var username=$("#username").val();
		var password=$("#pwd").val();
		$.ajax({
		  method: "POST",
		  url: " http://localhost:3000/users/register",
		  data: { username: username, password: password }
		})
		.done(function(msg) {
		    alert("Succesfully registered");
		});
	});
	$(".login-button").click(function() {
		var username=$("#username").val();
		var password=$("#pwd").val();
		$.ajax({
		  method: "POST",
		  url: " http://localhost:3000/users/login",
		  data: { username: username, password: password }
		})
		.done(function(msg) {
			if (typeof(Storage) !== "undefined") {
    		// Store
			    localStorage.setItem("token", msg.token);
			    // Retrieve
			    console.log(localStorage.getItem("token"));
			    window.location.href = "./users.html";
			    console.log("getting");
			} else {
			    alert("localStorage is not supported");
			}
			token=msg.token;
		    console.log(msg);
		});
	});
});