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
		var loadingquestions=[];
		var registeredusers;
		var loginusers;
		var controller= {
			getquestions:function() {
				var token=localStorage.getItem("token");
				$.ajax({
				  method: "GET",
				  url: " http://localhost:3000/test",
				  headers: {
			    	'x-access-token' : token
				  }
				})
				.done(function(data) {
				    for(var i=0;i<data.length;i++) {
				    	fullquestions.push(data[i]);
				    }
				    view.render();
				})
				.fail(function(msg){
					console.log("error");
				});
			},
			loadquestions:function(category) {
				//loadingquestions.splice(0,loadingquestions.length);
				for(i=0;i<fullquestions.length;i++) {
					//loadingquestions.splice(0,loadingquestions.length);
					if(fullquestions[i].category==category) {
						loadingquestions.push(fullquestions[i]);
					}
				}
				view.renderquestions();
			},
			init:function() {
				view.init();
				controller.getquestions();
			}
		};
		var view= {
			init:function() {
				this.selectlang=$("#select-lang");
				this.questionsection=$(".questions-section");
				var selectlang=this.selectlang;
				selectlang.on('click',function() {
					loadingquestions.splice(0,loadingquestions.length);
					controller.loadquestions(selectlang.val())
				});
			},
			render:function() {
				var selectlang=this.selectlang;
				for(i=0;i<fullquestions.length;i++) {
					selectlang.append("<option>"+fullquestions[i].category+"</option>");
				}
			},
			renderquestions:function() {
				console.log(loadingquestions);
				var questionsection=this.questionsection;
				questionsection.empty();
				for(i=0;i<loadingquestions.length;i++) {
					questionsection.append("<h5 class='question'>"+loadingquestions[i].question+"</h5>");
					for(var j=0;j<loadingquestions[i].options.length;j++) {
						var options="<div class='radio'><label><input type='radio' name='optradio"+j+"' value='"+loadingquestions[i].options[j]+"'>"+loadingquestions[i].options[j]+"</label></div>";
						questionsection.children('.question').last().append(options);
					}
				}
			}
		}
		controller.init();
	})();
});