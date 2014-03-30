##Desires/Beliefs/Intentions

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

```value```  is a string reference to the property or method that will return the value. This value will 
be used to determine the success or failure of a goal. The return type of the property/method must be a
number.

```preference``` is an integer between -1 and 1. If set to 1, that means the agent desires the value 
specified by ```property``` to increase. If set to -1, that means the agent desires the value 
to decrease. If set to 0, then the agent desires that value be maintained.

```persistant``` is a boolean that determines if the desire can be modified.


Desires are stored as objects inside an array. There are three functions that allow the ```desires``` array 
to be modified.

```javascript
	var model = new emoChatter.DBI(DBIjson);

	model.newDesire({		//method 1
		object : "string",		//@default: "error->desire must have specified object(string)"
		value : "string",		//@default: "error->desire must have specified value(string)""
		preference : 1,			//@default: 1
		persistant : false,		//@default: false
		magnitude : 0.2 		//@default: 0.2
		id : "0",				//@default: automatic increment "0","1"..."x"
	}); 

	model.removeDesire({	//method 2
		id : 0,				//Removes desires from the array that match specified params
		object : "string,
		value : "string,
		preference : 0,
		persistant : true,
		magnitude : 0.0
	}); 

	model.updateDesires(potentialDesires,config,checkFunction); //method 3
```
METHOD 3
========
This function can be called everytime the agent's relationship to it's environment
changes. In the case of a chatbot, for instance, this moment would be after every update
in the chatlog.

The function looks at each object in the ```potentialDesires``` array and uses the ```checkFunction``` to
see if it should be a new desire. If ```checkFunction(potentialDesires[i])``` returns a truthy value, then
```PotentialDesires[i]``` is pushed into the ```desires``` array. 

```config``` is an object that specifies the properites of the new desires.

As an example, say you wanted a chatbot to "desire" words that have a positive sentiment.
```javascript
	//grab potentialDesires
	var wordbank = object.getWordbank(); //an array of words {string : "word", sentiment : 0.0 }

	//define checkFunction
	function isGood(word){
		if(word.sentiment > 0.6)
			return true;
	}

	//automatically updates desires with words that have a high sentiment
	model.updateDesires(wordbank,{ object : wordbank, value : "timeUttered" },isGood); 
```



Beliefs are assertions based on the current conversation.
```javascript
```
Intentions refer to the intention of the last utterance.
```javascript
```
