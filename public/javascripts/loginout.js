$(document).ready(function() {
	var prototypedata=function(data) {
		this.username=data.username;
		this.userid=data._id;
		this.scores=data.scores;
	};
	var datas=[],i,j;
	var token;
	var controller= {
		getusers:function() {
			token=localStorage.getItem("token");
			$.ajax({
				method: "GET",
				url: " http://localhost:3000/users",
				headers: {
			    	'x-access-token' : token
				}
			})
			.done(function(data) {
				for(i=0;i<data.length;i++) {
					/*Object.keys(data[i]).forEach(function(key) {
		    			console.log(data[i].username);
		    			//main.append("<li>"+data[i].username+"</li>")
					});*/
					datas.push(new prototypedata(data[i]));
				}
				view.template();
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
			});
		},
		delete:function(value) {
			for(i=0;i<datas.length;i++) {
				if(datas[i].username===value) {
					console.log(datas[i].userid);
					var id=datas[i].userid;
					datas.splice(i,1);
					console.log(datas);
					$.ajax({
					  method: "DELETE",
					  url: "http://localhost:3000/users/"+id+"",
					  headers: {
				    	'x-access-token' : token
					  },
					  success: function(data) {
					  	console.log(data);
					  },
					  error: function(req,msg,res) {
					  	console.log(req);
					  	console.log(msg);
					  	console.log(res);
					  }
					});
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
			//main.text("List of Users who have registered");
			for(i=0;i<datas.length;i++) {
				var listitems="<div class='col-md-3 card-item'><div class='card'><div class='card-title'>"+ datas[i].username + "</div></div></div>";
				var tableheaders="<table class='table'><tr><th>Category</td><th>Score</th></tr></table>";
				main.append(listitems);
				main.find(".card").last().append(tableheaders);
				for(j=0;j<datas[i].scores.length;j++) {
					//console.log(datas[i].scores[j]);
					var tableelements ="<tr><td>"+datas[i].scores[j].category+"</td><td>"+datas[i].scores[j].score+"</td></tr>";
					main.find("table").last().append(tableelements);
				}
				main.find(".card").last().append("<div class='card-footer'><button class='btn btn-default'>Remove</button></div>")
			}
			main.find("button").on('click',function() {
				console.log($(this).parents(".card-item").find('.card-title').text());
				$(this).parentsUntil(".card-item").remove();
				controller.delete($(this).parents(".card-item").find(".card-title").text());
			});
		}
	};
	controller.init();
});
