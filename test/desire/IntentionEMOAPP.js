EMOAPP.Intention = function(){
	var id = "Intention"
	var that = this;

	//grab utlities
	var util = new EMOAPP.Util();
	var PosSentence = util.PosSentence;

	//grab dependent components
	var componentLinks = {};
	var dependentComponents = [""];
	
	this.linkComponent = function(id,compo){
		componentLinks[id] = compo;
	}

	this.getDependents = function(){
		return dependentComponents;
	}

	//history
	var log = [];

	//most recent intentions
	var self;
	var other;

	//private constructors
	//Internal Representation on an Intention
	var IntentStruct = function(s,q,d,i,bool){

		this.string = s;

		this.values = {
			isQuestYN  : q.yn,

			isQuestAlt : q.alt,
			
			isQuestOpen : q.open,
			
			isImper : i,
			
			isDeclar : d
		};

		this.own = bool;
	}

	

	//create new intentions
	this.newIntention = function(sentence,selfBool){

		var sent = new IntentSentence(sentence.trim());
		var _self = selfBool || true;
		if(_self){
			self = new IntentStruct(sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper(),true);

			log.push(new IntentStruct(sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper(),true));
		} else {
			other = new IntentStruct(sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper(),false);

			log.push(new IntentStruct(sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper()),false);
		}
		return log;	
	}

	var IntentSentence = function(sentence){
		var sent = sentence.split(" ");
		var posSent = new PosSentence(sentence).specialSentence;
		var verbFound = false;

		for(var i = 0; i < posSent.length; i+=1){
			var posWord = posSent[i];
			if(posWord.type == "V"){
				verbFound = true;
				break;
			}
		}

		if(!verbFound) posSent[0].type = "V";

		this.string = sentence;

		this.isQuestion = function(){
			var confidence = { yn : 0, alt : 0, open : 0 };

			for(var i = 0; i < sent.length; i++){
				var word = sent[i].toLowerCase();
				
				if(word == "or" || word == "and"){
					confidence.alt += 0.15;
				}

				
				if((word == "can") ||
					(word == "did") ||
					(word == "are") ||
					(word == "do") ||
					(word == "does") ||
					(word == "is") ||
					(word == "would") ||
					(word == "should") ||
					(word == "could") ||
					(word == "do") ||
					(word == "will")){
						if(i == 0){
							confidence.yn += .5;
							confidence.alt += .3;
						} else {
							confidence.yn += .3;
							confidence.alt += .2;
						}
				}

				if((word == "what") ||
					(word == "where") ||
					(word == "who") ||
					(word == "what") ||
					(word == "which") ||
					(word == "how") ||
					(word == "why")){
						if(i == 0){
							confidence.open += .5;
						} else {
							confidence.open += .3;
						}
				}

				if(word.indexOf("?") != -1){
					confidence.yn += .45; 
					confidence.alt += .45;
					confidence.open += .45; 
				}
			}

			return confidence;
		}

		this.isDeclar = function(){
			var confidence = 0;

			if(posSent[0].type != "V"){
				confidence += .4;
			}

			if(posSent[posSent.length-1].word == "."){
				confidence += .2;
			}

			return confidence;
		}

		this.isImper = function(){
			var confidence = 0;

			if(posSent[0].type == "V"){
				confidence += .4;
			}

			if(posSent[posSent.length-1].word == "."){
				confidence += .2;
			}

			return confidence;
		}
	}

	//EMOAPPS requires
	this.update = function(obj){
		return this.newIntention(obj.sentence, obj.self);
	}
	

	this.getAppraisalVariables = function(){
		if(!self && !other) 
			return []

		var modification = [];

		//was a question asked
		var mod1 = {};
		var lastIntentOther = that.getIntent(false);
		var judgementOther = util.largestValueInObject(lastIntentOther.values);
		if((judgementOther.key == "isQuestOpen") || (judgementOther.key == "isQuestAlt") || (judgementOther.key == "isQuestYN")){
			mod1.id = "happiness";
			mod1.val = 0.3;
			mod1.rep = "I was asked a question";
			modification.push(mod1);
		}

		//was a question asked after your question
		var mod2 = {};
			mod2.rep = "My question was responded to with a question"

		var lastIntentSelf = that.getIntent();
		var judgementSelf = util.largestValueInObject(lastIntentSelf.values);

		if((judgementSelf.key == "isQuestOpen") || (judgementSelf.key == "isQuestAlt") || (judgementSelf.key == "isQuestYN")){
			if(judgementOther.key == "isQuestYN"){
				mod2.id = "anger";
				mod2.val = 0.8;
				modification.push(mod2);
			} else if(judgementOther.key == "isQuestAlt"){
				mod2.id = "anger"
				mod2.val = 0.5;
				modification.push(mod2);
			} else if(judgementOther.key == "isQuestOpen"){
				mod2.id = "anger";
				mod2.val = 0.4;
				modification.push(mod2);
				modification.push({
					id : "surprise",
					val : 0.3,
					rep : "This question may be a response to my question"
				})
			}
		}

		console.log("~~~Intentions~~~")
		console.log(log);
		return modification;
	}

	//get
	this.getId = function(){
		return id;
	}

	this.getLog = function(){
		return log;
	}
	
	this.getIntent = function(type){
		var _self = type || true;
		
		if(typeof _self == "string"){
			var sent = new IntentSentence(_self.trim());
			return new IntentStruct(sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper());
		}
		
		if(_self) return self;

		return other;
		
	}

}