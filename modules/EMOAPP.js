function EMOAPP(){

		var components = [];
		var aems = [];
		var appraisalVar = [];

		this.updateFactors = function(){
			for (var i = 0; i < components.length; i++) {
				var component = components[i];

				for(var j = 0; j < aems.length; j++){
					var aem = aems[j];
					if(component.getId() == aem.getId()){
						components[i].update(aems[i].deliver());
						break;
					}
				}
			}
		}

		this.addComponent = function(comp){
			components.push(comp);
			aems.push(new comp.AEM())
		}

		this.getComponents = function(){
			return { components : components, aems : aems }
		}

		this.populateAEMS = function(objArray){
			for(var i=0; i < objArray.length; i += 1){
				var obj = objArray[i];
				for (var j = 0; j < aems.length; j++) {
					var aem = aems[j];
					if(aem.getId() == obj.id){
						aem.populate(obj);
					}
				}
			}
		}

		//MODULES//
		///////////
		this.Util = function() {
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
		}//end of util

}