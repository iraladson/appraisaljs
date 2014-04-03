/*
DEPENDENCIES
<script src="lexicon.js_"></script>
<script src="lexer.js"></script>
<script src="POSTagger.js"></script>
*/

function Intention_emoFact(){
	var log = [];
	var currentId = 0;
	//var threshold = 0.5;

	var self;

	var other;

	var IntentStruct = function(id,s,q,d,i,bool){

		this.id = id;

		this.string = s;

		this.wasQuestYN = q.yn;
		
		this.wasQuestAlt = q.alt;
		
		this.wasQuestOpen = q.open;

		this.wasDeclar = d;

		this.wasImper = i;

		this.own = bool;
	}

	this.newIntention = function(sentence,selfBool){
		var sent = new IntentSentence(sentence.trim());
		var _self = selfBool || true;
		
		if(_self){
			self = new IntentStruct(currentId,sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper(),true);

			log.push(new IntentStruct(currentId,sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper(),true));
		} else {
			other = new IntentStruct(currentId,sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper(),false);

			log.push(new IntentStruct(currentId,sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper()),false);
		}


		currentId += 1;
	}

	this.getlog = function(){
		return log;
	}
	

	this.getIntent = function(type){
		var _self = type || true;
		
		if(typeof _self == "string"){
			var sent = new IntentSentence(_self.trim());
			return new IntentStruct(currentId,sent.string,sent.isQuestion(),sent.isDeclar(),sent.isImper());
		} else {
			if(_self) return self;

			return other;
		}
	}
}

function IntentSentence(sentence){
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

//		for(ele in confidence){
//			if(confidence[ele] >= threshold){
				return confidence;
//			}
//			return undefined;
//		}
	}

	this.isDeclar = function(){
		var confidence = 0;

		if(posSent[0].type != "V"){
			confidence += .4;
		}

		if(posSent[posSent.length-1] == "."){
			confidence += .2;
		}

		return confidence;
	}

	this.isImper = function(){
		var confidence = 0;

		if(posSent[0].type == "V"){
			confidence += .4;
		}

		if(posSent[posSent.length-1] == "."){
			confidence += .2;
		}

		return confidence;
	}
}

function PosWord(sentWord, sentType){
	this.word = sentWord;
	this.type = sentType;
}

function PosSentence(theInput){
	var words = new Lexer().lex(theInput);
	var taggedWords = new POSTagger().tag(words);
	
	this.specialSentence = [];
		   
	for (i in taggedWords) {
		var taggedWord = taggedWords[i];
		var word = taggedWord[0];
		var tag = taggedWord[1].charAt(0);; 

		this.specialSentence.push(new PosWord(word, tag));
	}
}