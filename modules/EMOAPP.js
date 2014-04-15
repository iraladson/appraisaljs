var EMOAPP = {};

EMOAPP.AppraisalVar = function(id,br,at){
	var _id = id;
	var magnitude = 0.0;
	var numberOfModifications = 0;
	var representations = [];

	this.bodilyResponse = function(){

		return [magnitude * br[0], magnitude * br[1]] 
	};

	this.actionTendencies = function(){
		return [magnitude * br[0], magnitude * br[1]]
	};

	this.feelings = function(){
		return representations
	}

	this.adjust = function(modifications){
		for(var i = 0; i < modifications.length; i += 1){
			var mod = modifications[i];

			if(mod.id == id){
				numberOfModifications += 1;

				if(mod.val) magnitude += mod.val;

				if(mod.rep) representations.push(mod.rep);
			}
		}
	}

	this.reset = function(){
		magnitude = 0.0;
		numberOfModifications = 0;
		representations = [];
	} 

	this.getInfo = function(){
		return { id : id, mag : magnitude, numb : numberOfModifications, rep : representations}
	}

	this.getPureEmotion = function(){
		return br
	}

	this.synthesize = function(){
		if(numberOfModifications > 0)
			magnitude = (magnitude / numberOfModifications);
	}
}



EMOAPP.Util = function() {
	var that = this;
	//Part Of Speech
	if(Lexer && POSTagger){
		this.PosWord = function(sentWord, sentType){
			this.word = sentWord;
			this.type = sentType;
		}

		this.PosSentence = function(theInput){
			var words = new Lexer().lex(theInput);
			var taggedWords = new POSTagger().tag(words);
			
			this.specialSentence = [];
				   
			for (i in taggedWords) {
				var taggedWord = taggedWords[i];
				var word = taggedWord[0];
				var tag = taggedWord[1].charAt(0);
				this.specialSentence.push(new that.PosWord(word, tag));
			}

		}

		this.identifySVO = function(posSentence){
			var subject = [];
			var verb = [];
			var object = [];
			var index = 0;

			var punct = isPunct(posSentence[posSentence.length-1].word);
			
			(function(){
				for(var i=index;i<posSentence.length;i += 1){
					if(posSentence[i].type != 'V'){
						subject.push(posSentence[i]);
					} else {
						index = i;
						return;
					}
				}
			})();
			
			(function(){
					verb.push(posSentence[index]);
					
					if(punct){
						verb.push(posSentence[posSentence.length-1]);
					}
					index += 1;
					return;
			})();
			
			(function(){
				for(var i=index;i<posSentence.length;i += 1){
					if(!punct || (punct && i != posSentence.length-1)){
						object.push(posSentence[i]);
					}
				}
			})();

			return { s : subject, v : verb, o : object };
		}

	} else {
		console.log("No part of speech utility");
	}

	//Syntax
	this.isPunct = function(test){
		if(test == "," || this.isEnd(test)){
			return true
		} else {
			return false;
		}
	}

	this.isEnd = function(test){
		if(test == "."){ 
			return "."
		} else if(test == "!"){
			return "!"
		} else if(test == "?"){
			return "?"
		} else if(test == ";"){
			return ";"
		} else {
			return false;
		}
	}

	//general
	this.largestValueInObject = function(obj){
		var max = -1;
		var key;

		for(var i in obj){
			if(obj[i] > max){
				max = obj[i];
				key = i;
			}
		}

		return { key : key, value : max }
	}
}



EMOAPP.Core = function(){
	//COLLECTIONS
	//Populated by Components
	var components = [];

	/* ~~Components~~
	** ==============
	** Components produce appraisal variables
	** They contain their own representations of the agent-enviornment model (aem)
	** They must all contain an 'update function'
	*/

	//@usage: push new components into the components[]
	//@param: comp == component
	this.addComponent = function(comp){
		components.push(comp);
	}

	//@return: obj containing components[] and aems[]
	this.getComponents = function(){
		return { components : components }
	}


	this.process = function(){
		var appVars = createAppraisalVariables();
		var affect = {};
		affect.mood = [0,0];
		affect.feelings = [];

		for(var appVar in appraisalVars){
			var _appVar = appraisalVars[appVar];
			var representation = {};
			
			//mood vector
			_appVar.synthesize();
			var vector = _appVar.bodilyResponse();
			affect.mood[0] += vector[0];
			affect.mood[1] += vector[1];

			//feelings
			var feel = _appVar.feelings();
			for(var i=0; i<feel.length ; i+=1){
				affect.feelings.push({ emotion : appVar, rep : feel[i] });
			}

		}

		affect.mood[0] = (affect.mood[0]/5);
		affect.mood[1] = (affect.mood[1]/5);

		affect.mood[0] = (moodLog[moodLog.length-1][0] + affect.mood[0])/2
		affect.mood[1] = (moodLog[moodLog.length-1][1] + affect.mood[1])/2

		moodLog.push(affect.mood);

		return affect
	}

	/* ~~Appraisal Variables~~
	** =======================
	** Appraisal variables produce emotion and are produced by components.
	*/

	/*
	console.log('~~before new emo.appvar~~');
	console.log("~~EMOAPP~~");
	console.log(EMOAPP);
	*/

	var anger = new EMOAPP.AppraisalVar("anger",[-5,3],[-5,3]);
	var fear = new EMOAPP.AppraisalVar("fear",[-3,5],[-3,5]);
	var happiness =	new EMOAPP.AppraisalVar("happiness",[5,3],[5,3]);
	var sadness = new EMOAPP.AppraisalVar("sadness",[-5,-2],[-5,-2]);
	var surprise = new EMOAPP.AppraisalVar("surprise",[1,5],[1,5]);

	var appraisalVars = { 
		anger : anger,
		fear : fear,
		happiness : happiness,
		sadness : sadness,
		surprise : surprise
	}

	var moodLog = [[0,0]];

	this.getMoodLog = function(){
		return moodLog
	}

	this.getAppraisalVars = function(){
		return appraisalVars
	}

	var createAppraisalVariables = function(){
		//reset all appraisal variables
		for(var key in appraisalVars){
			appraisalVars[key].reset();
		}
		//modify the appVars accodring to the modifications of the components
		for(var i = 0; i < components.length; i += 1){
			var modifications = components[i].getAppraisalVariables();

			for(var key in appraisalVars){
				appraisalVars[key].adjust(modifications);
			}
		}

		//return appVars
		return appraisalVars;
	}
}