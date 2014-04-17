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

			var punct = that.isPunct(posSentence[posSentence.length-1].word);

			//verb check
			for(var i = 0; i < posSentence.length; i+=1){
			var posWord = posSentence[i];
			if(posWord.type == "V"){
				break;
			}
		}
			
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

        console.log("~~Affect~~");
        console.log(affect);
        console.log("");

		return affect
	}

    this.linkComponents = function(){
        for(var i=0; i < components.length; i += 1){
            var component = components[i];
            var dependents = component.getDependents();

            for(var j = 0; j < components.length; j += 1){

                for(var x = 0; x < dependents.length; x += 1){
                    var neededComp = components[j];

                    if(neededComp.getId() == dependents[x]){
                        component.linkComponent(neededComp.getId(),neededComp);
                    }
                }
            }
        }
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


String.prototype.removeStopWords = function() {
    var x;
    var y;
    var word;
    var stop_word;
    var regex_str;
    var regex;
    var cleansed_string = this.valueOf();
    var stop_words = new Array(
        'a',
        'about',
        'above',
        'across',
        'after',
        'again',
        'against',
        'all',
        'almost',
        'alone',
        'along',
        'already',
        'also',
        'although',
        'always',
        'among',
        'an',
        'and',
        'another',
        'any',
        'anybody',
        'anyone',
        'anything',
        'anywhere',
        'are',
        'area',
        'areas',
        'around',
        'as',
        'ask',
        'asked',
        'asking',
        'asks',
        'at',
        'away',
        'b',
        'back',
        'backed',
        'backing',
        'backs',
        'be',
        'became',
        'because',
        'become',
        'becomes',
        'been',
        'before',
        'began',
        'behind',
        'being',
        'beings',
        'best',
        'better',
        'between',
        'big',
        'both',
        'but',
        'by',
        'c',
        'came',
        'can',
        'cannot',
        'case',
        'cases',
        'certain',
        'certainly',
        'clear',
        'clearly',
        'come',
        'could',
        'd',
        'did',
        'differ',
        'different',
        'differently',
        'do',
        'does',
        'done',
        'down',
        'down',
        'downed',
        'downing',
        'downs',
        'during',
        'e',
        'each',
        'early',
        'either',
        'end',
        'ended',
        'ending',
        'ends',
        'enough',
        'even',
        'evenly',
        'ever',
        'every',
        'everybody',
        'everyone',
        'everything',
        'everywhere',
        'f',
        'face',
        'faces',
        'fact',
        'facts',
        'far',
        'felt',
        'few',
        'find',
        'finds',
        'first',
        'for',
        'four',
        'from',
        'full',
        'fully',
        'further',
        'furthered',
        'furthering',
        'furthers',
        'g',
        'gave',
        'general',
        'generally',
        'get',
        'gets',
        'give',
        'given',
        'gives',
        'go',
        'going',
        'good',
        'goods',
        'got',
        'great',
        'greater',
        'greatest',
        'group',
        'grouped',
        'grouping',
        'groups',
        'h',
        'had',
        'has',
        'have',
        'having',
        'he',
        'her',
        'here',
        'herself',
        'high',
        'high',
        'high',
        'higher',
        'highest',
        'him',
        'himself',
        'his',
        'how',
        'however',
        'if',
        'important',
        'in',
        'interest',
        'interested',
        'interesting',
        'interests',
        'into',
        'is',
        'it',
        'its',
        'itself',
        'j',
        'just',
        'k',
        'keep',
        'keeps',
        'kind',
        'knew',
        'know',
        'known',
        'knows',
        'l',
        'large',
        'largely',
        'last',
        'later',
        'latest',
        'least',
        'less',
        'let',
        'lets',
        'likely',
        'long',
        'longer',
        'longest',
        'm',
        'made',
        'make',
        'making',
        'man',
        'many',
        'may',
        'me',
        'member',
        'members',
        'men',
        'might',
        'more',
        'most',
        'mostly',
        'mr',
        'mrs',
        'much',
        'must',
        'my',
        'myself',
        'n',
        'necessary',
        'need',
        'needed',
        'needing',
        'needs',
        'never',
        'new',
        'new',
        'newer',
        'newest',
        'next',
        'no',
        'nobody',
        'non',
        'noone',
        'not',
        'nothing',
        'now',
        'nowhere',
        'number',
        'numbers',
        'o',
        'of',
        'off',
        'often',
        'old',
        'older',
        'oldest',
        'on',
        'once',
        'one',
        'only',
        'open',
        'opened',
        'opening',
        'opens',
        'or',
        'order',
        'ordered',
        'ordering',
        'orders',
        'other',
        'others',
        'our',
        'out',
        'over',
        'p',
        'part',
        'parted',
        'parting',
        'parts',
        'per',
        'perhaps',
        'place',
        'places',
        'rather',
        'really',
        'right',
        'right',
        'room',
        'rooms',
        's',
        'said',
        'same',
        'saw',
        'say',
        'says',
        'second',
        'seconds',
        'see',
        'seem',
        'seemed',
        'seeming',
        'seems',
        'sees',
        'several',
        'shall',
        'she',
        'should',
        'show',
        'showed',
        'showing',
        'shows',
        'side',
        'sides',
        'since',
        'so',
        'some',
        'somebody',
        'someone',
        'something',
        'somewhere',
        'state',
        'states',
        'still',
        'still',
        'such',
        'sure',
        't',
        'take',
        'taken',
        'than',
        'that',
        'the',
        'their',
        'them',
        'then',
        'there',
        'therefore',
        'these',
        'they',
        'thing',
        'things',
        'think',
        'thinks',
        'this',
        'those',
        'though',
        'three',
        'through',
        'thus',
        'to',
        'today',
        'together',
        'too',
        'totally',
        'took',
        'toward',
        'turn',
        'turned',
        'turning',
        'turns',
        'two',
        'under',
        'until',
        'up',
        'upon',
        'use',
        'used',
        'uses',
        'v',
        'very',
        'w',
        'want',
        'wanted',
        'wanting',
        'wants',
        'was',
        'way',
        'ways',
        'we',
        'well',
        'wells',
        'went',
        'were',
        'what',
        'when',
        'where',
        'whether',
        'which',
        'while',
        'who',
        'whole',
        'whose',
        'why',
        'will',
        'with',
        'within',
        'without',
        'work',
        'worked',
        'works',
        'would',
        'x',
        'y',
        'year',
        'years',
        'yet',
        'young',
        'younger',
        'youngest',
        'z'
    )
         
    // Split out all the individual words in the phrase
    words = cleansed_string.match(/[^\s]+|\s+[^\s+]$/g)
 
    // Review all the words
    for(x=0; x < words.length; x++) {
        // For each word, check all the stop words
        for(y=0; y < stop_words.length; y++) {
            // Get the current word
            word = words[x].replace(/\s+|[^a-z]+/ig, "");   // Trim the word and remove non-alpha
             
            // Get the stop word
            stop_word = stop_words[y];
             
            // If the word matches the stop word, remove it from the keywords
            if(word.toLowerCase() == stop_word) {
                // Build the regex
                regex_str = "^\\s*"+stop_word+"\\s*$";      // Only word
                regex_str += "|^\\s*"+stop_word+"\\s+";     // First word
                regex_str += "|\\s+"+stop_word+"\\s*$";     // Last word
                regex_str += "|\\s+"+stop_word+"\\s+";      // Word somewhere in the middle
                regex = new RegExp(regex_str, "ig");
             
                // Remove the word from the keywords
                cleansed_string = cleansed_string.replace(regex, " ");
            }
        }
    }
    return cleansed_string.replace(/^\s+|\s+$/g, "");
}