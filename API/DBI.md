Desires/Beliefs/Intentions (DBI)
================================

```json
{	
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


#Desires

Desires refer to the aims and goals of the agent. Goals must be able to be quantifiable. The success or failure of a goal depends on if some value is changing according to the specified ```preference```.

Represented as JSON
```json
{
	"id" : 0,

	"object" : "refString",

	"value" : "propString",

	"last" : 0.0,
			
	"preference" : 0,
	
	"mutable" : true,

	"magnitude" : 0.0
				
}
```
###Properties

```id``` is an integer that represents when it was pushed into the desires array. Automatically
incremented.

As JSON, ```object``` is a string reference to the object that contains the ```value``` to be measure. As Javascript, it is an object that contains ```value```. When specified as a String, the object will be aquired from the current context i.e. => ```window["referenceString"]```. By default, the context is set to ```window```. To change this, call ```changeDesireContext(newContext)```. This is useful if the desired object is buried inside of other objects.

```value```  is a string reference to the property or method that will return the value. This value will  be used to determine the success or failure of a goal. The return type of the property/method must be a number.

```last``` is a number that represents the state of ```value``` during the last comparison. Updates
automatically.

```preference``` is an integer between -1 and 1. If set to 1, that means the agent desires the value 
specified by ```property``` to increase. If set to -1, that means the agent desires the value 
to decrease. If set to 0, then the agent desires that value be maintained.

```mutable``` is a boolean that determines if the desire can be modified.

###Functions

Desires are stored as objects inside an array called ```desires```. There are three functions 
that allow the ```desires``` array to be modified.

```javascript
	var model = new emotionalAppraisal.DBI(DBIjson);

	model.newDesire({	
		object : "string",		//string or object
		value : "string",		//@default: "error->desire must have specified value(string)""
		preference : 1,			//@default: 1
		persistant : false,		//@default: false
		magnitude : 0.2 		//@default: 0.2
	}); 

	

	model.removeDesire({	//function 2
		id : 0,				//Removes desires from the array that match specified params
		object : "string,
		value : "string,
		preference : 0,
		persistant : true,
		magnitude : 0.0
	}); 

	model.updateDesires(potentialDesires,config,checkFunction); //function 3
```
```updateDesires``` should be called every time the agent's relationship to it's environment
changes. For example, in the case of a chatbot, this would be called after the chatlog changes.
1.```potentialDesires``` is an array of objects that represent all of the object that could potentially become new desires. The construction of this array is left to the user.

2.```config``` is an object that represents configuration details. It is just like the parameter of ```newDesire```, except if ```object``` is set to the string ```"_SELF"``` the object property will automatically be set to ```potentialDesires[i]```. 

3. ```checkFunction``` will take each ```potentialDesires[i]``` as a parameter and return a boolean value. If true, then the desire will get pushed into the ```desires``` array.



As an example, say you wanted a chatbot to "desire" words that have a positive sentiment.
```javascript
	//grab potentialDesires
	var wordbank = object.getWordbank(); 
	//let's say this returns an array of Word{} that look like => 
	// {string : "word", sentiment : 0.0, timesUttered : 32 }

	//define the checkFunction
	function isGood(word){
		if(word.sentiment > 0.6)
			return true;
	}

	//automatically updates desires with words that have a high sentiment
	model.updateDesires(wordbank,{ object : "_SELF", value : "timeUttered" },isGood); 
```



Beliefs are assertions based on the current conversation.
```javascript
```
Intentions refer to the intention of the last utterance.
```javascript
```
