EMOAPP.Belief = function(){
	var id = "Belief";
	var that = this;

	//get utilities
	var util = new EMOAPP.Util();
	var PosSentence = util.PosSentence;

	//grab dependent components
	var componentLinks = [];
	var dependentComponents = ["Intention","WilliamDesire"];
	
	this.linkComponent = function(id,compo){
		componentLinks[id] = compo;
	}

	this.getDependents = function(){
		return dependentComponents;
	}

	//categories of beliefs
	var aboutSelf = [];
	var aboutOther = [];
	var general = [];

	var recentBelief;

	this.newBelief = function(obj){
		//make sure the sentence is declarative
		var intent = componentLinks["Intention"].getIntent(obj.sentence);
		var check = util.largestValueInObject(intent.values).key;

		if(check != "isDeclar") { 
			console.log("no new beliefs: not declarative")
			return 
		}

		/*~~create belief structure from obj~~*/
		var belief = {};
		var svo = util.identifySVO(new PosSentence(obj.sentence).specialSentence);
		//find verb
		belief.verb = svo.v[0].word;
		//find the assertion
		belief.assertion = (function(){
			var string = "";

			for(var i = 0; i < svo.o.length; i += 1){
				string += svo.o[i].word;
				string += " ";
			}

			return string.removeStopWords()

		}())
		//find belief
		belief.subject = (function(){
			var string = "";

			for(var i = 0; i < svo.s.length; i += 1){
				string += svo.s[i].word;
				string += " ";
			}

			return string.removeStopWords()

		}())
		//see if the word 'not' is in the object
		belief.affirmative = (function(){
			for(var i=0; i<svo.o.length; i += 1){
				if(svo.o[i].word == "not"){
					return false;
				}
			}
			return true;
		}());
		//a sentiment analyisi shoudl be passed in through 'obj' param
		belief.sentiment = obj.sentiment || 0;

		//find the category of the belief
		var _self = obj.self || true;
		var subj = svo.s[0].word;
		var obj = svo.o[0].word;
		
		if((subj.toLowerCase() == "i") || (obj.toLowerCase() == "me") || (obj.toLowerCase() == "mine")) {
			belief.subject = "other";
			aboutOther.push(belief); 
		} else if((subj.toLowerCase() == "you") || (obj.toLowerCase() == "you") || 
				(obj.toLowerCase() == "yours") || (obj.toLowerCase() == "your")) {
			belief.subject = "self";
			aboutSelf.push(belief);
		} else {
			general.push(belief);
		}
		
		recentBelief = belief;
		return belief;

		//TO DO -> PUT IN THE CATEGORY FINDING
		//find similar belief in category
			//and increment magnitude
		//otherwise add the belief to category
	}

	this.update = function(obj){
		recentBelief = undefined;
		that.newBelief(obj);
	}

	this.getAppraisalVariables = function(){
		var modification = [];
		if(recentBelief==undefined){
			return []
		}
		
		//did i learn something about myself
		if(recentBelief.subject == "self"){
			var mod0 = {};
			mod0.id = "surprise";
			mod0.val = 0.6;
			mod0.rep = "Learned something about myself."

			modification.push(mod0);

			var mod1 = {};
			//was is good
			if(recentBelief.sentiment > 0.05){
				mod1.id = "happiness";
				mod1.val = 1 * recentBelief.sentiment;
				mod1.rep = "Learned that I " + recentBelief.verb + " " + recentBelief.assertion + ".";

				modification.push(mod1);
			} else if(recentBelief.sentiment < -0.05){ //or bad
				mod1.id = "sadness"
				mod1.val = -1 * recentBelief.sentiment;
				mod1.rep = "Learned that I " + recentBelief.verb + " " + recentBelief.assertion + ".";
				modification.push(mod1);
			}
		//did i learn something about the other		
		} else if(recentBelief.subject == "other") { 
			var mod0 = {};
			mod0.id = "surprise";
			mod0.val = 0.3;
			mod0.rep = "Learned something about you."

			modification.push(mod0);

			//good
			if(recentBelief.sentiment > 0.05){
				var mod1 = {};
				mod1.id = "happiness";
				mod1.val = 0.7 * recentBelief.sentiment;
				mod1.rep = "Learned that you " + recentBelief.verb + " " + recentBelief.assertion + ".";

				modification.push(mod1)
			} else if(recentBelief.sentiment < -0.05) { //or bad
				var mod1 = {};
				mod1.id = "fear";
				mod1.val = -0.7 * recentBelief.sentiment;
				mod1.rep = "Learned that you " + recentBelief.verb + " " + recentBelief.assertion + ".";

				modification.push(mod1)
			}
		//did i learn new general knowlegde
		} else if (recentBelief.subject) {
			var mod0 = {};
			mod0.id = "surprise";
			mod0.val = 0.5;
			mod0.rep = "Learned that " + recentBelief.subject.toLowerCase(); + " " + recentBelief.verb + " " + recentBelief.assertion + ".";

			//if the subject is desired and... 
			var desiredSubject = componentLinks["WilliamDesire"].getDesireByParam(recentBelief.subject);

			if(desiredSubject){
				if(desiredSubject.direction == 1){ // if desire is positive
					console.log(recentBelief.sentiment);
					if(recentBelief.sentiment > 0.2){ //and belief was positive
						//create happiness
						modification.push({
							id : "happiness",
							val : 1.2 * desiredSubject.magnitude,
							rep : "I was told " + desiredSubject.param + " is good, and I desire " + desiredSubject.param
						})
						//strengthen desire
						desiredSubject.modifyMagnitude(.10);
					} else if(recentBelief.sentiment < -0.2){
						//create anger if desire is immutable
						if(!desiredSubject.mutable){
							modification.push({
								id : "anger",
								val : 0.9,
								rep : "I was told " + desiredSubject.pram + " is bad and I know that's not true."
							})
							
						} else { //or sadness is desire if mutable
							modification.push({
								id : "sadness",
								val : 1.2 * desiredSubject.magnitude,
								rep : "I was told " + desiredSubject.param + " is bad, but I hope it's not true."
							})
						
						//weaken desire
						desiredSubject.modifyMagnitude(-.10)
						}
					}

				} else if(desiredSubject.direction == -1){ // if desire is negative (fear)
					if(recentBelief.sentiment > 0.2){ //and belief was positive
						if(desiredSubject.mutable){ //is desired subject immutable
							//create happiness
							modification.push({
								id : "surprise",
								val : 1.2 * desiredSubject.magnitude,
								rep : "I was told " + desiredSubject.param + " is good, but I thought it was bad."
							})
							//strengthen desire
							desiredSubject.modifyMagnitude(-.10);
						} else {
							modification.push({
								id : "anger",
								val : 0.9,
								rep : "I was told " + desiredSubject.param + " is good, but I know " + desiredSubject.param + " is bad."
							})
						}
					} else if(recentBelief.sentiment < -0.2){
						//create anger if desire is immutable
						modification.push({
							id : "fear",
							val : 1.2 * desiredSubject.magnitude,
							rep : "I was told " + desiredSubject.param + " is bad, confirming my fears."
						})
						
						//weaken desire
						desiredSubject.modifyMagnitude(.10)
					}
				}
			}
		}

		console.log("~~~Beliefs~~~")
		console.log(aboutSelf);
		console.log(aboutOther);
		console.log(general);
		return modification
	}

	this.getNumberOfAssertions = function(subject){
		if(!word) return

		var sum = 0;

		for (var i = 0; i < general.length; i++) {
			var sub = general[i].subject.toLowerCase();
			
			if(sub.indexOf(subject.toLowerCase()) != -1){
				sum += 1;
			}
		};

		return sum;
	}

	this.getBeliefs = function(){
		return {aboutSelf : aboutSelf, aboutOther : aboutOther, general : general}
	}

	this.getId = function(){
		return id
	}
}