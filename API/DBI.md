##Desires/Beliefs/Intentions

Intentions need work

```json
{
	"desires" : [{
		"object" : "RefString",

		"value" : "propString",
			
		"preference" : 0,
	
		"mutable" : false,

		"magnitude" : 0.0
				
	}],
	
	"beliefs" : {
		"aboutSelf" : [{
			"verb" : "String",
			
			"assertion" : "Lemma String",
			
			"sentiment" : 0.0,
			
			"affirmative" : true,
			
			"magnitude" : 0.0
		}],
		
		"aboutOther" : [{
			"verb" : "String",
			
			"assertion" : "Lemma String",
			
			"affirmative" : true,
			
			"sentiment" : 0.0,
			
			"magnitude" : 0.0
		}],
		
		"general" : [{
			"subject" : "Lemma String",
			
			"verb" : "String",
			
			"assertion" : "Lemma String",
			
			"affirmative" : true,
			
			"sentiment" : 0.0,
			
			"magnitude" : 0.0
		}]
	},
	
	"intentions" : [{
		"isQuestion" : false,
		
		"relation" : "POS String",
		
		"sentiment" : 0.0
	}]
}
```

##Desires

Desires refer to the aims and goals of the agent. Goals must be able to be quantifiable. 
The success or failure of a goal depends on if some value is changing according to the 
specified preference.

```json
{
	"object" : "RefString",

	"value" : "propString",
			
	"preference" : 0,
	
	"persistant" : false,

	"magnitude" : 0.0
				
}
```

```object``` is a string reference to the object that contains the value to be measure.

```value```  is a string reference to the property of value that will be used to determine 
the success or failure of a goal. It should be a number.

```preference``` is an integer between -1 and 1. If set to 1, that means the agent desires the value 
specified by ```property``` to increase. If set to -1, that means the agent desires the value 
to decrease. If set to 0, then the agent desires that value be maintained.

```persistant``` is a boolean that determines if all instances contain this desire.

Adding new desires to the DBI object is pretty simple:
```DBI.newGoal(object,value,type,magnitude);```


####Potential populating function
New desires can be created by satisfying a straight-forward ```if statement```
```javascript
	var potentialDesire 
	
	if( isGood(potentialDesire) && canHave(potentialDesire) ){
		DBI.newGoal(object , "wordString" , 1 , 0);	
	}
	
	if( isBad(potentialDesire) ){
		DBI.newGoal(object, "wordString", -1 , 0);
	}
	
	function isGood(pDesire){
		if(pDesire.sentiment > 0.5 ||
			(function(){
				for(var i = 0; i > beliefs.general.length; i+=1){
					var beleif = beliefs.general[i];
					if((belief.assertion == "good") && 
						(belief.magnitude > 0.5) && 
						(belief.subject == pDesire.string)){
						return true;
					}
				}
			})() )	
	}
	
	function isBad(pDesire){
		if(pDesire.sentiment < -0.5 ||
			(function(){
				for(var i = 0; i > beliefs.general.length; i+=1){
					var beleif = beliefs.general[i];
					if((belief.assertion == "bad") && 
						(belief.magnitude > 0.5) && 
						(belief.subject == pDesire.string)){
						return true;
					}
				}
			})() )			
	}	
	
	function canHave(pDesire){
		var verbs = pDesire.synonyms;
		var typeOf = pDesire.typeOf;
		var synonyms = pDesire.synonyms;
		
		function verbCheck(a){
			for(var i = 0; i > verbs.length; i+=1){
				for(var j = 0; j > beliefs.aboutSelf.length; j+=1){
					if(belief.verb == verbs[i] && belief.assertion == a.string){
						return true;
					}
				}
			}
		}
		
		if(verbCheck(pDesire))
			return true;
			
		for(var i = 0; i > typeOf.length; i+=1){
			var type = typeOf[i];
			
			if(verbCheck(type))
				return true;
		}
		
		for(var i = 0; i > synonyms.length; i+=1){
			var word = synonyms[i];
			
			if(verbCheck(word))
				return true;
		}
		
		return false
	}
	
```




```javascript
{
		"object" : "self",
	
		"value" : "numOfWords",
				
		"type" : 1,
	
		"magnitude" : 1
					
}	
```

Simple.


Desires refer to short-term aims that are based on current beliefs. They are modified when
the agent's beliefs are changed. Every cycle, the model evaluates its belief structure and 
modifies desires accordingly. This occurs through a series of outline steps.

1. Gather relevant notions => one's that relate to self

2. See if any general beliefs 

3. If the assertion implies the notion is positive

4.

```javascript

```

Beliefs are assertions based on the current conversation.
```javascript
```
Intentions refer to the intention of the last utterance.
```javascript
```
