##Desires/Beliefs/Intentions

Intentions need work

```json
{
	"desires" : [{
		"object" : "RefString",
		
		"descrip" : {
			
			"property" : "propString",
			
			"type" : 0
		},
		
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
		
		"aboutConversation" : [{
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

##Populating DBI

Desires refer to aims and goals of the agent. Since the agent is a chabot and experiences 
their environment as text only, the multiplicity of goals that apply to humans do not apply 
in this case. Obviously, all goals must be quantifiable in some way, and must relate to the
experience of a chatbot. Each goal is represented as an object.

```json
{
	"object" : "RefString",

	"value" : "propString",
			
	"type" : 0,

	"magnitude" : 0.0
				
}
```

```object``` is a string reference for the object that will used to measure the
goal.

```value```  is a string reference to the specific property of ```object``` that will
	be used to determine the success or failure of a goal. It should be a number.

```type``` is an integer between -1 and 1. If set to 1, that means the agent desires the value 
specified by ```property``` to increase. If set to -1, that means the agent desires the value 
to decrease. If set to 0, then the agent desires that value be maintained.

The ```magnitude``` property is a float value between 0 and 1 that represents the importance
of the desire.

Adding new desires to the DBI object is pretty simple.

```javascript
	newGoal(object,value,type,magnitude);
```
Below is an example goal. It represents the goal of wanting to learn more words.
```self``` is a reference to the agent object itself. ```numOfWords``` is a reference to property
in the agent that returns how many words it has stored in it's "memory".

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
