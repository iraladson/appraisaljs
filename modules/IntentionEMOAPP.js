EMOAPP.Intention = function(){

	//grab utlities
	var util = new EMOAPP().Util;
	var PosSentence = new util().PosSentence;

	//private vars
	var id = "Intention";
	var log = [];
	var currentId = 0;
	var self;
	var other;

	//private constructors
	var IntentStruct = function(id,s,q,d,i,bool){

		this.id = id;

		this.string = s;

		this.isQuestYN = q.yn;
		
		this.isQuestAlt = q.alt;
		
		this.isQuestOpen = q.open;

		this.isDeclar = d;

		this.isImper = i;

		this.own = bool;
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

	//EMOAPPS core
	this.update = function(obj){
		return this.newIntention(obj.sentence, obj.self);
	}
	
	this.AEM = function(){
		//var that = this;
		var id = "Intention";

		this.string = "";
		this.self = true;

		this.populate = function(obj){
			this.string = obj.sentence;
			this.self = obj.self || true;
		}

		this.deliver = function(){
			return { sentence : this.string, self : this.self }
		}

		this.getId = function(){
			return id;
		}
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
			var sent = new IntentSentence(sentence.trim());
			return new IntentStruct(currentId,sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper());
		}
		
		if(_self) return self;

		return other;
		
	}

	//general public functions
	this.newIntention = function(sentence,selfBool){
		var sent = new IntentSentence(sentence.trim());
		var _self = selfBool || true;
		console.log("Intent sentence made")
		if(_self){
			self = new IntentStruct(currentId,sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper(),true);

			log.push(new IntentStruct(currentId,sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper(),true));
		} else {
			other = new IntentStruct(currentId,sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper(),false);

			log.push(new IntentStruct(currentId,sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper()),false);
		}
		console.log(log);		

		return log;	
	}
}