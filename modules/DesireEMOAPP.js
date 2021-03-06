WilliamDesire = function(){
	var that = this;

	//grab Utilities

	//grab dependent components
	var componentLinks = [];
	var dependentComponents = ["Belief"];
	
	this.linkComponent = function(id,compo){
		componentLinks[id] = compo;
	}

	this.getDependents = function(){
		return dependentComponents;
	}

	//categories of desires
	var desires = [];

	var desireTiggers = [
		"good","great","greatest","positive","joy",
		"awesome","dope","cool","fun","beautiful",
		"exciting","intresting","pretty","sexy","phenomenal"
	];

	var fearTriggers = [
		"gross","nasty","bad","worse","worst",
		"weird","dangerous","danger","kill", "",
		"ugly","disgusting","","",""
	];

	var pFearTriggers = [];
	var pDesireTriggers = [];

	var isTrigger = function(assertion,desire){
		var tigger = (desire ? desireTiggers : fearTriggers);

		for (var i = 0; i < trigger.length; i++) {
			var t = trigger[i];

			if(assertion.indexOf(t) != -1){
				return true
			}
		};
	}

	var isDesire = function(subject){
		for (var i = 0; i < desires.length; i++) {
			var d = desires[i];

			if(subject.indexOf(d) != -1){
				return true
			}
		};
	}

	//update
	var ctx = window;

	this.setContext = function(newCtx){
		ctx = newCtx;
	}

	var DesireStruct = function(obj){
		this.context = obj.context;
		this.value = obj.value;
		this.lastValue = obj.value;
		this.valueIsMethod = obj.valueIsMethod || true;
		this.param = obj.param || undefined;
		this.hasGoal : obj.hasGoal || false;
		this.goal : obj.goal || null;
		this.direction : obj.direction || null;
		}
	}

	this.newDesire = function(obj){
		desires.push(new DesireStruct(obj));
	}

	this.update = function(){
		/*/update lastValue of each desire
		for(var i = 0; i < desires.length; i += 1){
			var desire = desires[i];

			desire.value = (desire.valueIsMethod ? desire.context.value(desire.param) : desire.context.value)
		}*/

		//add new desires based on beleifs
		//for every belief in generalBeliefs
		for (var i = 0; i < componentLinks["Belief"].getBeliefs.general.length; i++) {
			var belief = componentLinks["Belief"].generalBeliefs.general[i];
			//if belief.affirmative is true
			if((belief.affirmative) && !isDesire(belief.subject)){
				//if belief.assertion contains a desireTigger
				if(isTrigger(belief.assertion, true)){
					//create new Desire to learn more
					var dObj = {
						context : that,
						value : componentLinks["Belief"].getNumberOfAssertions,
						lastValue : componentLinks["Belief"].getNumberOfAssertions,
						param : subject,
						direction : 1				
					};

					that.newDesire(dObj);
					
					//create new Desire to be close to belief.subject
					//!!!NEED TO DO!!!

				//else if belief.assertion contains a fearTigger
				} else if(isTrigger(belief.assertion,false)){
					//create new Desire to learn more
					var dObj = {
						context : that,
						value : componentLinks["Belief"].getNumberOfAssertions,
						lastValue : componentLinks["Belief"].getNumberOfAssertions,
						param : subject,
						direction : -1				
					};

					that.newDesire(dObj);
					
					//create new Desire to be close to belief.subject
					//!!!NEED TO DO!!!
				}
			}
		}
	}

	//appraisal
}