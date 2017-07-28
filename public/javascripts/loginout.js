$(document).ready(function() {
	var prototypedata=function(data) {
		this.username=data.username;
		this.userid=data._id;
		this.scores=data.scores;
		this.createdat=data.createdAt;
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
					var id=datas[i].userid;
					datas.splice(i,1);
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
		modal:function(value) {
			for(let data of datas) {
				if(data.username===value) {
					view.rendermodal(data);
				}
			}
		},
		search:function(value) {
			for(let data of datas) {
				if(data.username===value) {
					view.rendersearchresults(data);
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
			this.logout=$(".logout-button");
			this.logout.on('click',function() {
				controller.logout();
			});
			this.modaltitle=$(".modal-title");
			this.modalbody=$(".modal-body");
			this.search=$("#searchusername");
			this.search.keypress(function(e) {
				if (!e) e = window.event;
    			var keyCode = e.keyCode || e.which;
    			if(keyCode===13) {
    				if($("#searchusername").val().length>0) {
    					controller.search($("#searchusername").val());
    				}
    				else {
    					alert("Enter Something to search");
    				}
    			}
			});
		},
		template:function() {
			var main=this.main;
			var tableheaders="<table class='table users-list-table'><tr><th>Name</td><th>Registered At</th><th></th></tr></table>";
			main.append(tableheaders);
			for(i=0;i<datas.length;i++) {
				var tableelements=`<tr class="users-row">
				<td class='user-title' data-toggle="modal" data-target="#scoreModal">${datas[i].username}</td>
				<td>${datas[i].createdat}</td><td><button class="btn btn-danger removeusers">Remove</button></td></tr>`;
				main.find(".users-list-table").append(tableelements);
			}
			main.find('.user-title').on('click',function() {
				controller.modal($(this).parents(".users-row").find(".user-title").text());
			});
			main.find("button").on('click',function() {
				controller.delete($(this).parents(".users-row").find(".user-title").text());
				$(this).parents(".users-row").remove();
			});
		},
		rendermodal:function(data) {
			var modaltitle=this.modaltitle;
			var modalbody=this.modalbody;
			modaltitle.text(data.username);
			modalbody.empty();
			var tablescoreheaders="<table class='table scores-list-table'><tr><th>Category</td><th>Score</th></tr></table>";
			modalbody.append(tablescoreheaders);
			for(let index of data.scores) {
				var tablemodalelements =`<tr><td>${index.category}</td><td>${index.score}</td></tr>`;
				modalbody.find('.scores-list-table').append(tablemodalelements);
			}
		},
		rendersearchresults:function(data) {
			var main=this.main;
			main.find(".users-list-table").hide();
			var listitems=`<div class='col-md-3 card-item'><div class='card'><div class='card-title'>${data.username}</div></div></div>`;
			var tablesearchheaders="<table class='table search-results-table'><tr><th>Category</td><th>Score</th></tr></table>";
			main.append(listitems);
			main.find(".card").last().append(tablesearchheaders);
			for(let index of data.scores) {
				var tablesearchelements =`<tr><td>${index.category}</td><td>${index.score}</td></tr>`;
				main.find(".search-results-table").append(tablesearchelements);
			}
			main.find(".card").last().append("<div class='card-footer'><button class='btn btn-danger'>Remove</button></div>")
		}
	};
	controller.init();
});
