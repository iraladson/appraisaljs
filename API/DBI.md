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

```magnitude``` is a float between 0 and 1 and represents the intensity of the desire.

###Functions

Desires are stored as objects inside an array called ```desires```. There are three functions for (de)populating the 

```javascript
	var model = new EmoAppraisal.DBI(DBIjson);

	//FUNCTION 1
	//
	model.newDesire({	
		object : "string",		//string or object cannot be undefined
		value : "string",		//"must have specified value(string)""
		preference : 1,			//@default: 1
		persistant : false,		//@default: false
		magnitude : 0.2 		//@default: 0.2
	}); 

	
	//FUNCTION 2
	//
	model.removeDesire({	
		id : 0,				//Removes desires from the array that match specified params
		object : "string,
		value : "string,
		preference : 0,
		persistant : true,
		magnitude : 0.0
	}); 

	//FUNCTION 3
	//
	model.updateDesires(potentialDesires,config,checkFunction);

```
#####Notes on FUNCTION 3

```updateDesires``` should be called every time the agent's relationship to it's environment
changes. For example, in the case of a chatbot, this would be called after the chatlog changes.

1. ```potentialDesires``` is an array of objects that represent all of the object that could potentially become new desires. The construction of this array is left to the user.

2. ```config``` is an object that represents configuration details. It is just like the parameter of ```newDesire```, except if ```object``` is set to the string ```"_SELF"``` the object property will automatically be set to ```potentialDesires[i]```. 

3. ```checkFunction``` will take each ```potentialDesires[i]``` as a parameter and return a boolean value. If true, then the desire will get pushed into the ```desires``` array.

######Example
Say you wanted an agent to "desire" things that have a positive sentiment.
```javascript
	//grab potentialDesires as an array
	// {string : "word", sentiment : 0.0, amountOwned : 3 }
	var collectionArray = object.getCollection(); 

	//define the checkFunction
	function isGood(word){
		if(word.sentiment > 0.6)
			return true;
	}

	//automatically updates desires with words that have a high sentiment
	model.updateDesires(wordbank,{ object : "_SELF", value : "timeUttered" },isGood); 
```


#Beliefs

Beliefs are assertions based on the current conversation.

Represented as json
```json
	{
		"aboutSelf" : [{
			"verb" : "String",
			
			"assertion" : "Lemma String",
			
			"relation" : "partOfSpeech",
			
			"sentiment" : 0.0,
			
			"affirmative" : true,
			
			"magnitude" : 0.0
		}],
		
		"aboutOther" : [{
			"verb" : "String",
			
			"assertion" : "Lemma String",
			
			"affirmative" : true,
			
			"relation" : "partOfSpeech",
			
			"sentiment" : 0.0,
			
			"magnitude" : 0.0
		}],
		
		"general" : [{
			"subject" : "string",
			
			"verb" : "string",
			
			"assertion" : "string"
			
			"affirmative" : true,
			
			"relation" : "posString",
			
			"sentiment" : 0.0,
			
			"magnitude" : 0.0
		}]
	}
```
###Properties

```aboutSelf``` is an array of objects. Each object represents a belief about the agent has about itself.

```aboutOther``` is an array of objects. Each object represents a belief about the person with whom the agent is currently chatting.

```general`` is an array of objects. Each object represents a general belief.

Within each belief object, there are several properties:
1. ```subject``` is a string that represents the subject of the assertion. It only exist in the ```general``` array because the other two have implied subjects.
2. ```verb``` is a string that represents the verb connection between the ```subject``` and ```assertion```.
3. ```assertion``` is a string that representes the claim made about the subject.
4. ```affirmative``` is a boolean value. A value of ```false``` means that the agent believes the associated belief is NOT true.
5. ```relation``` is a string that represents the part of speech relation between the subject and the assertion. The ```assertion``` is a ```relation``` of the ```subject```.
6. ```sentiment``` is a float value between -1 an 1. It represents any sentiment associated with the belief. Neutral beliefs have a ```sentiment``` of 0.
7. ```magnitude``` is a float value between 0 and 1. It represents how strongly the agent in convinced a belief is true.

###Functions

Beliefs are populated in a pretty straightforward way.

```javascript
	model.newBelief({
		type : "aboutSelf", //or "aboutOther" or a string
		
		verb : "string",
		
		assertion : "string",
		
		affirmative : true, //@deafault: true
		
		relation : "posString", //@default: pos of assertion string.
		
		sentiment : 0.0, //@default: 0.0
		
		magnitude : 0.0 //@default: 0.25
	})
```

The API also has an automatic parser. Set the paramater to a sentence, and it will attempt to create the new belief for you.

```javascript
	/*push is a boolean. @defaults: false
	**false->The new belief won't be pushed into the array.
	*/returns-> belief object representing the new belief
	
	model.findBelief("sentence",[opt]push); 
```

It is, however, suggested that you create a custom parsing method and populate the beliefs array with the ```newBelief``` function. The reason for this is two-fold. 
1. The ambiguity of conversation and it's reliance on contextual information (which the api does not store) will limit the performance of the parser. 
2. The strings that are stored in each belief are the same strings returned to you. You can use them as identifiers to find the objects they reference.



#Intentions

Intentions are representations of the aim of the most recent sentence.

As JSON
```json
	{
		self : [{
			id
			wasQuestion
			wasDeclar
			wasImper
			}],
		other :[{
			id
			wasQuestion
			wasDeclar
			wasImper
		}]
	}
```






