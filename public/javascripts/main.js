$(document).ready(function() {
	$(".get-users-button").click(function() {
		$.ajax({
		  method: "GET",
		  url: " http://localhost:3000/users"
		})
		.done(function(msg) {
		    console.log(msg);
		    template(msg);
		});
	});
	var template=function(data) {
		var main=$(".users-list");
		main.text("Users List");
		for(var i=0;i<data.length;i++) {
			/*Object.keys(data[i]).forEach(function(key) {
    			console.log(data[i].username);
    			//main.append("<li>"+data[i].username+"</li>")
			});*/
			main.append("<li>"+data[i].username+"</li>");
		}
	};
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
});