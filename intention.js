

function Intention_emoFact(){
	var log = [];
	var currentId = 0;
	var threshold = 0.55;

	var self;

	var other;

	var IntentStruct = function(id,q,d,i){
		this.id = id,

		this.wasQuestion = q,

		this.wasDeclar = d,

		this.wasImper = i
	}

	this.newIntention = function(sentence,self){
		var sent = new intentSentence(sentence.trim(),threshold);

		if(sent.isQuestion()){
			console.log(sent.isQuestion());
		}

	}
}

function intentSentence(sentence,threshold){
	var sent = sentence.split(" ");

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
						confidence.yn += .3;
						confidence.alt += .2;
					} else {
						confidence.yn += .15;
						confidence.alt += .1;
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
						confidence.open += .4;
					} else {
						confidence.open += .2;
					}
			}

			if(word.indexOf("?") != -1){
				confidence.yn += .4; 
				confidence.alt += .4;
				confidence.open += .4; 
			}

		}

		for(ele in confidence){
			if(confidence[ele] >= threshold){
				return confidence;
			}
			return false;
		}
	}
}
