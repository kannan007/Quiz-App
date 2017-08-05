$(document).ready(function() {
	var prototypedata=function(data) {
		this.username=data.username;
		this.userid=data._id;
		this.scores=data.scores;
		this.createdat=data.createdAt;
	};
	var datas=[],i,j,categories=[],filtercategories=[],searchvalue="";
	var token;
	var controller= {
		getcategories:function() {
			token=localStorage.getItem("token");
			$.ajax({
				method: "GET",
			  	url: " http://localhost:3000/categories",
			  	headers: {
		    		'x-access-token' : token
			  	}
			})
			.done(function(data) {
			    for(var i=0;i<data.length;i++) {
			    	categories.push(data[i]);
			    }
			    view.rendercategories();
			})
			.fail(function(msg){
				console.log("error");
			});
		},
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
		card:function(value) {
			for(let data of datas) {
				if(data.username===value) {
					view.rendercard(data);
				}
			}
		},
		search:function(value) {
			searchvalue=value;
			view.rendersearchresults(searchvalue);
		},
		filter:function() {
			filtercategories=[];
			let i=0;
			$("input[type=checkbox]:checked").each(function() {
				filtercategories[i++]=$(this).val();
			});
			if(filtercategories.length>0) {
				view.renderfilteruserresults();
			}
			else {
				view.renderallusersshow();
			}
		},
		init:function() {
			view.init();
			controller.getusers();
			controller.getcategories();
		}
	};
	var view= {
		init:function() {
			var self=this;
			this.main=$(".users-list");
			this.logout=$(".logout-button");
			this.logout.on('click',function() {
				controller.logout();
			});
			this.search=$("#searchusername");
			this.showusersbutton=$(".show-users-button");
			this.showusersbutton.on("click",function() {
				self.main.find(".users-list-table").show();
				self.main.find(".card-item").remove();
				self.showusersbutton.hide();
			});
			this.showusersbutton.hide();
			this.filtersection=$(".category-filter-section");
			this.search.keyup(function(e) {
				controller.search(self.search.val());
			});
		},
		rendercategories:function() {
			var filtersection=this.filtersection;
			for(let index of categories) {
				var elements =`<label><input type="checkbox" name="categories" value="${index}">${index}</label>`;
				filtersection.append(elements);
			}
			filtersection.find("input[type=checkbox]").on("click",function() {
				controller.filter();
			});
		},
		renderfilteruserresults:function() {
			var main=this.main;
			main.find(".users-list-table .users-row").hide();
			main.find(".users-list-table .users-row").each(function(i,obj) {
				let temp=$(this).find(".user-categories").text();
				temp=temp.split(",");
				for(let index of temp) {
					if(filtercategories.indexOf(index)>-1) {
						$(this).show();
						break;
					}
				}
			});
		},
		renderallusersshow:function() {
			var main=this.main;
			main.find(".users-list-table .users-row").show();
		},
		template:function() {
			var main=this.main;
			for(i=0;i<datas.length;i++) {
				let usercategories=[];
				for(let index of datas[i].scores) {
					if(!(usercategories.indexOf(index.category)>-1)) {
						usercategories.push(index.category);
					}
				}
				var tableelements=`<tr class="users-row">
						<td class='user-title'>${datas[i].username}</td>
						<td>${datas[i].createdat}</td><td class="user-categories">${usercategories}</td>
						<td><button class="btn btn-danger removeusers">Remove</button></td>
					</tr>`;
				main.find(".users-list-table").append(tableelements);
			}
			main.find('.user-title').on('click',function() {
				controller.card($(this).parents(".users-row").find(".user-title").text());
			});
			main.find("button.removeusers").on('click',function() {
				controller.delete($(this).parents(".users-row").find(".user-title").text());
				$(this).parents(".users-row").remove();
			});
		},
		rendercard:function(data) {
			var main=this.main;
			var showusersbutton=this.showusersbutton;
			showusersbutton.show();
			main.find(".users-list-table").hide();
			main.find(".card-item").remove();
			var listitems=`<div class='col-md-5 card-item'><div class='card'><div class='card-title'>${data.username}</div></div></div>`;
			var tablesearchheaders="<table class='table search-results-table'><tr><th>Category</td><th>Score</th></tr></table>";
			main.append(listitems);
			main.find(".card").last().append(tablesearchheaders);
			for(let index of data.scores) {
				var tablesearchelements =`<tr><td>${index.category}</td><td>${index.score}</td></tr>`;
				main.find(".search-results-table").append(tablesearchelements);
			}
			main.find(".card").last().append("<div class='card-footer'><button class='btn btn-danger removecardusers'>Remove</button></div>");
			main.find("button.removecardusers").on('click',function() {
				controller.delete($(this).parents(".card").find(".card-title").text());
				$(this).parents(".card").remove();
			});
		},
		rendersearchresults:function(data) {
			var main=this.main;
			main.find(".users-list-table .users-row").hide();
			main.find(".users-list-table .users-row").each(function(i,obj) {
				let temp=$(this).find(".user-title").text();
				if(temp.indexOf(data)>-1) {
					$(this).show();
				}
			});
		}
	};
	controller.init();
});
