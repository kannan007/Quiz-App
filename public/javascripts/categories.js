$(document).ready(function() {
	(function() {
		var userscoresprototype=function(data) {
			this.scores=data.scores;
		};
		var categories=[],currentcategory,userscores,sortresults=[],temp,filtercategories=[],i=0,usercategories=[];
		var score=0,token,id;
		var controller= {
			getcategories:function() {
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
				token=localStorage.getItem("token");
				id=localStorage.getItem("id");
				$.ajax({
					method: "GET",
					url:"http://localhost:3000/users/"+id+"/scores",
				})
				.done(function(data) {
					//console.log(data.scores);
					userscores=new userscoresprototype(data);
					sortresults=userscores.scores;
					view.renderuserscore();
					view.renderusercategories();
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
			descendingsort:function() {
				for(i=0;i<sortresults.length;i++) {
					for(j=i+1;j<sortresults.length;j++) {
						if(sortresults[i].score<sortresults[j].score) {
							temp=sortresults[i];
							sortresults[i]=sortresults[j];
							sortresults[j]=temp;
						}
					}
				}
				view.renderusersortscore();
			},
			ascendingsort:function() {
				for(i=0;i<sortresults.length;i++) {
					for(j=i+1;j<sortresults.length;j++) {
						if(sortresults[i].score>sortresults[j].score) {
							temp=sortresults[i];
							sortresults[i]=sortresults[j];
							sortresults[j]=temp;
						}
					}
				}
				view.renderusersortscore();
			},
			filter:function() {
				filtercategories=[];
				let i=0;
				$("input[type=checkbox]:checked").each(function() {
					filtercategories[i++]=$(this).val();
				});
				view.renderfilterscore();
			},
			init:function() {
				view.init();
				controller.getuserscores();
				controller.getcategories();
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
				this.filtersection=$(".category-filter-section");
				this.ascendingsort=$(".sort-ascending");
				this.descendingsort=$(".sort-descending");
				this.descendingsort.on("click",function() {
					controller.descendingsort();
				});
				this.ascendingsort.on("click",function() {
					controller.ascendingsort();
				});
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
			},
			render:function() {
				console.log(usercategories);
				for(i=0;i<categories.length;i++) {
					for(j=0;j<usercategories.length;j++) {
						if(!(categories[i].indexOf(usercategories[j])<0)) {
							console.log(categories[i]);
							categories.splice(i,1);
						}
					}
				}
				var selectlang=this.selectlang;
				for(i=0;i<categories.length;i++) {
					selectlang.append(`<option>${categories[i]}</option>`);
				}
			},
			renderusercategories:function() {
				let filtersection=this.filtersection;
				for(let index of usercategories) {
					var elements =`<label><input type="checkbox" name="categories" value="${index}">${index}</label>`;
					filtersection.append(elements);
				}
				filtersection.find("input[type=checkbox]").on("click",function() {
					controller.filter();
				});
			},
			renderuserscore:function() {
				let scorecard=this.scorecard;
				usercategories=[];
				for(let index of userscores.scores) {
					if(usercategories.indexOf(index.category)<0) {
						usercategories.push(index.category);
					}
					var tablesearchelements =`<tr class="data-elements"><td class="category">${index.category}</td><td class="score">${index.score}</td></tr>`;
					scorecard.find(".search-results-table").append(tablesearchelements);
				}
			},
			renderusersortscore:function() {
				let scorecard=this.scorecard;
				scorecard.find(".search-results-table td").remove();
				for(let index of sortresults) {
					var tablesearchelements =`<tr class="data-elements"><td class="category">${index.category}</td><td class="score">${index.score}</td></tr>`;
					scorecard.find(".search-results-table").append(tablesearchelements);
				}
			},
			renderfilterscore:function() {
				let scorecard=this.scorecard;
				//scorecard.find(".search-results-table .data-elements").hide();
				if(filtercategories.length>0) {
					scorecard.find(".search-results-table .data-elements").hide();
					scorecard.find(".search-results-table .data-elements").each(function(i,obj) {
						let temp=$(this).find(".category").text();
						//console.log("Temp "+ temp);
						//console.log("Index value "+filtercategories.indexOf(temp));
						if(filtercategories.indexOf(temp)>-1) {
							$(this).show();
						}
					});
				}
				else {
					scorecard.find(".search-results-table .data-elements").show();
				}
			}
		}
		controller.init();
	})();
});