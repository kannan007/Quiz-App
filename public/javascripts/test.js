$(document).ready(function() {
	var i;
	(function() {
		var prototypequestions=function(data) {
			this.category=data.category,
			this.question=data.question,
			this.options=data.options,
			this.correctanswer=data.correctanswer
		};
		var fullquestions=[],selectedanswers=[],currentcategory,unansweredquestions=[];
		var score=0,token,id;
		var controller= {
			getquestions:function() {
				token=localStorage.getItem("token");
				currentcategory=localStorage.getItem("category");
				$.ajax({
					method: "GET",
				  	url: " http://localhost:3000/questions",
				  	headers: {
			    		'x-access-token' : token,
			    		'category-token' : currentcategory
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
				id=localStorage.getItem("id");
				score=0;
				console.log(selectedanswers.length);
				if(selectedanswers.length===fullquestions.length) {
					for(i=0;i<fullquestions.length;i++) {
						//console.log("selectedanswer"+ selectedanswers[i] + " correctanswer " + fullquestions[i].correctanswer);
						if(selectedanswers[i].selectedanswer===fullquestions[i].correctanswer) {
							score++;
						}
					}
					/*$.ajax({
						method: "POST",
						url: "http://localhost:3000/users/"+id+"/scores",
						data: {category: currentcategory, score: score},
						headers: {
				    		'x-access-token' : token
					  	},
					  	success: function(data) {
					  		window.location.href = "./categories.html";
					  	},
					  	error: function(req,msg,res) {
					  		console.log(req);
					  		console.log(msg);
					  		console.log(res);
					  	}
					});*/
				}
				else {
					unansweredquestions=[];
					console.log(fullquestions.length);
					for(let i=0;i<fullquestions.length;i++) {
						console.log(fullquestions[i]);
						console.log(selectedanswers[i]);
						if(!(selectedanswers[i])) {
							unansweredquestions.push(i+1);
						}
						//console.log(selectedanswers[i].selectedanswer.length);
						//if(selectedanswers[i])
					}
					console.log(unansweredquestions);
				}
			},
			selectedanswer:function(index) {
				//console.log($('input[name=optradio'+index+']:checked').val());
				let temp={"questionno":index,"selectedanswer":""}
				selectedanswers.push(temp);
				//selectedanswers[index]=$('input[name=optradio'+index+']:checked').val();
				Object.keys(selectedanswers).forEach(function(key) {
					if(selectedanswers[key].questionno==index) {
						selectedanswers[key].selectedanswer=$('input[name=optradio'+index+']:checked').val();
					}
				});
			},
			init:function() {
				view.init();
				controller.getquestions();
			}
		};
		var view= {
			init:function() {
				var self=this;
				this.questionsection=$(".questions-section");
				this.paginationsection=$(".pagination-section")
				this.logout=$(".logout-button");
				this.submitanswers=$(".submit-answers");
				this.scorecard=$(".scorecard");
				var selectlang=this.selectlang;
				this.logout.on('click',function() {
					controller.logout();
				});
				this.submitanswers.on('click',function() {
					controller.submitanswers(currentcategory);
				});
			},
			renderquestions:function() {
				var questionsection=this.questionsection;
				var paginationsection=this.paginationsection;
				questionsection.empty();
				this.submitanswers.show();
				for(i=0;i<fullquestions.length;i++) {
					paginationsection.append(`<ul class="pagination"><li>${i+1}</li></ul>`);
					questionsection.append(`<div class='questionndoptions'><h5 class='questiontag'>${fullquestions[i].question}</h5></div>`);
					for(var j=0;j<fullquestions[i].options.length;j++) {
						var options=`<div class='radio'><label><input type='radio' questionno=${i} name='optradio${i}'
						value='${fullquestions[i].options[j]}'>${fullquestions[i].options[j]}</label></div>`;
						questionsection.children('.questionndoptions').last().append(options);
					}
				}
				questionsection.children().first().addClass('visible');
				paginationsection.find("ul li").on('click',function() {
					$("li").removeClass('background-color');
					$(this).addClass('background-color');
					questionsection.children().removeClass('visible');
					questionsection.children().eq($(this).text()-1).addClass('visible');
				});
				var radio=$("input[type=radio]");
				questionsection.find(radio).on('click',function() {
					controller.selectedanswer($(this).attr("questionno"));
					$(this).attr("checked","checked");
				});
			},
		}
		controller.init();
	})();
});