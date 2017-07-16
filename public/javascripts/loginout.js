$(document).ready(function() {
	var prototypedata=function(data) {
		this.username=data.username;
		this.userid=data._id;
	};
	var datas=[];
	var controller= {
		getusers:function() {
			var token=localStorage.getItem("token");
			$.ajax({
			  method: "GET",
			  url: " http://localhost:3000/users",
			  headers: {
		    	'x-access-token' : token
			  }
			})
			.done(function(data) {
				console.log(data);
				for(var i=0;i<data.length;i++) {
					/*Object.keys(data[i]).forEach(function(key) {
		    			console.log(data[i].username);
		    			//main.append("<li>"+data[i].username+"</li>")
					});*/
					datas.push(new prototypedata(data[i]));
					view.template();
					//main.append("<li>"+data[i].username+"</li>");
				}
			});
		},
		logout:function() {
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
		},
		delete:function(value) {
			console.log(value);
			var text=value.replace("Remove","");
			console.log(text);
			for(var i=0;i<datas.length;i++) {
				if(datas[i].username===text) {
					console.log(datas[i].userid);
					var id=datas[i].userid;
					$.ajax({
					  method: "DELETE",
					  url: "http://localhost:3000/users/"+id+"",
					  success: function(data) {
					  	console.log(data);
					  },
					  error: function(req,msg,res) {
					  	console.log(req);
					  	console.log(msg);
					  	console.log(res);
					  }
					})
				}
			}
		},
		init:function() {
			view.init();
			controller.getusers();
		}
	};
	var view= {
		init:function() {
			this.main=$(".users-list");
			this.logout=$(".logout");
			this.logout.on('click',function() {
				controller.logout();
			});
		},
		template:function() {
			var main=this.main;
			main.text("Users List");
			for(var i=0;i<datas.length;i++) {
				var listitems="<li>"+datas[i].username +"<button class='btn btn-defualt'>Remove</button></li>"
				main.append(listitems);
			}
			main.find("li").on('click',function() {
				controller.delete($(this).text());
				//console.log($(this).text());
				//$(this).remove();
			});
		}
	};
	controller.init();
});
