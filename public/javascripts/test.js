$(document).ready(function() {
	var i;
	(function() {
		var prototypequestions=function(data) {
			this.category=data.category,
			this.question=data.question,
			this.options=data.options,
			this.correctanswer=data.correctanswer
		};
		var fullquestions=[];
		var categories=[];
		var selectedanswers=[];
		var score=0;
		var token;
		var controller= {
			getquestions:function(tokencategory) {
				//token=localStorage.getItem("token");
				$.ajax({
				  method: "GET",
				  url: " http://localhost:3000/questions",
				  headers: {
			    	'x-access-token' : token,
			    	'category-token' : tokencategory
				  }
				})
				.done(function(data) {
				    for(var i=0;i<data.length;i++) {
				    	fullquestions.push(new prototypequestions(data[i]));
				    }
				    view.renderquestions();
				})
				.fail(function(msg){
					console.log("error");
				});
			},
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
				    console.log(categories);
				    view.render();
				})
				.fail(function(msg){
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
			submitanswers:function() {
				score=0;
				if(selectedanswers.length===fullquestions.length) {
					for(i=0;i<fullquestions.length;i++) {
						//console.log("selectedanswer"+ selectedanswers[i] + " correctanswer " + fullquestions[i].correctanswer);
						if(selectedanswers[i]===fullquestions[i].correctanswer) {
							score++;
						}
					}
					console.log(score);
				}
				else {
					alert("Choose answers for all");
				}
			},
			selectedanswer:function(index) {
				selectedanswers[index]=$('input[name=optradio'+index+']:checked').val();
			},
			init:function() {
				view.init();
				controller.getcategories();
			}
		};
		var view= {
			init:function() {
				this.selectlang=$("#select-lang");
				this.questionsection=$(".questions-section");
				this.submitanswers=$(".submit-answers");
				this.logout=$(".logout-button");
				this.submitanswers.hide();
				this.logout.on('click',function() {
					controller.logout();
				});
				this.submitanswers.on('click',function() {
					controller.submitanswers();
				});
				var selectlang=this.selectlang;
				selectlang.on('click',function() {
					fullquestions.splice(0,fullquestions.length);
					selectedanswers.splice(0,selectedanswers.length);
					controller.getquestions(selectlang.val());
				});
			},
			render:function() {
				var selectlang=this.selectlang;
				for(i=0;i<categories.length;i++) {
					selectlang.append("<option>"+categories[i]+"</option>");
				}
			},
			renderquestions:function() {
				var questionsection=this.questionsection;
				questionsection.empty();
				this.submitanswers.show();
				for(i=0;i<fullquestions.length;i++) {
					questionsection.append("<div class='questionndoptions'><h5 class='questiontag'>"+fullquestions[i].question+"</h5></div>");
					for(var j=0;j<fullquestions[i].options.length;j++) {
						var options="<div class='radio'><label><input type='radio' questionno="+i+" name='optradio"+i+
						"' value='"+fullquestions[i].options[j]+"'>"+fullquestions[i].options[j]+"</label></div>";
						questionsection.children('.questionndoptions').last().append(options);
					}
				}
				var radio=$("input[type=radio]");
				questionsection.find(radio).on('click',function() {
					controller.selectedanswer($(this).attr("questionno"));
					$(this).attr("checked","checked");
				});
			}
		}
		controller.init();
	})();
});