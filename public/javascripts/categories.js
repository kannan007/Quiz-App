$(document).ready(function() {
	var i;
	(function() {
		var userscoresprototype=function(data) {
			this.scores=data.scores;
		};
		var categories=[],currentcategory,userscores;
		var score=0,token,id;
		var controller= {
			getcategories:function() {
				token=localStorage.getItem("token");
				id=localStorage.getItem("id");
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
				    view.render();
				})
				.fail(function(msg){
					console.log("error");
				});
			},
			getquestions:function(category) {
				if (typeof(Storage) !== "undefined") {
		    			// Store
						localStorage.setItem("category", category);
						console.log("getting");
						window.location.href="./test.html"
					} else {
					    alert("localStorage is not supported");
					}
			},
			getuserscores:function() {
				$.ajax({
					method: "GET",
					url:"http://localhost:3000/users/"+id+"/scores",
				})
				.done(function(data) {
					//console.log(data.scores);
					userscores=new userscoresprototype(data);
					view.renderuserscore();
				})
				.fail(function(msg) {
					console.log("error");
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
			init:function() {
				view.init();
				controller.getcategories();
				controller.getuserscores();
			}
		};
		var view= {
			init:function() {
				var self=this;
				this.categorysection=$(".category-section");
				this.selectlang=$("#select-lang");
				this.logout=$(".logout-button");
				this.scorecard=$(".scorecard");
				var selectlang=this.selectlang;
				this.scorepill=$(".score-pill");
				this.testpill=$(".test-pill");
				this.testbutton=$(".take-test-button");
				this.testbutton.on('click',function() {
					currentcategory=selectlang.val();
					if(currentcategory.length>0) {
						controller.getquestions(currentcategory);
					}
					else {
						alert("choose one category");
					}
				});
				this.logout.on('click',function() {
					controller.logout();
				});
				/*selectlang.on('change',function() {
					console.log("triggered");
					currentcategory=selectlang.val();
					if(currentcategory.length>0) {
						controller.getquestions(currentcategory);
					}
				});*/
			},
			render:function() {
				var selectlang=this.selectlang;
				for(i=0;i<categories.length;i++) {
					selectlang.append(`<option>${categories[i]}</option>`);
				}
			},
			renderuserscore:function() {
				var scorecard=this.scorecard;
				var tablesearchheaders="<table class='table search-results-table'><tr><th>Category</td><th>Score</th></tr></table>";
				scorecard.append(tablesearchheaders);
				for(let index of userscores.scores) {
					var tablesearchelements =`<tr><td>${index.category}</td><td>${index.score}</td></tr>`;
					scorecard.find(".search-results-table").append(tablesearchelements);
				}
			}
		}
		controller.init();
	})();
});