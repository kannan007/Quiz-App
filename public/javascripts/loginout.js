var getusers=function() {
	var token=localStorage.getItem("token");
	$.ajax({
	  method: "GET",
	  url: " http://localhost:3000/users",
	  headers: {
    	'x-access-token' : token
	  }
	})
	.done(function(data) {
		var main=$(".users-list");
		main.text("Users List");
		for(var i=0;i<data.length;i++) {
			/*Object.keys(data[i]).forEach(function(key) {
    			console.log(data[i].username);
    			//main.append("<li>"+data[i].username+"</li>")
			});*/
			main.append("<li>"+data[i].username+"</li>");
		}
	});
	$(".logout").click(function() {
		$.ajax({
		  method: "GET",
		  url: " http://localhost:3000/users/logout",
		})
		.done(function(msg) {
			localStorage.removeItem("token");
		    alert("Succesfully Logged out");
		    window.location.href = "/";
		    console.log(msg);
		});
	});
};