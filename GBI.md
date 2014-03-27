##Goals/Desires/Beliefs/Intentions

Intentions need work

```json
{
	"goals" : [{
		"object" : "RefString",
		
		"descrip" : {
			"type" : 0,
			
			"prop" : "propString"
		},
		
		"magnitude" : 0.0
					
	}],
	
	"desires" : [{
		"object" : "RefString",
		
		"descrip" : {
			"type" : 0,
			
			"prop" : "propString"
		},
		
		"magnitude" : 0.0
					
	}],
	
	"beliefs" : {
		"aboutSelf" : [{
			"relation" : "POS String",
			
			"assertion" : "Lemma String",
			
			"sentiment" : 0.0,
			
			"magnitude" : 0.0
		}],
		
		"aboutOther" : [{
			"relation" : "POS String",
			
			"assertion" : "Lemma String",
			
			"sentiment" : 0.0
			
			"magnitude" : 0.0
		}],
		
		"aboutConversation" : [{
			"subject" : "Lemma String",
			
			"relation" : "POS String",
			
			"assertion" : "Lemma String",
			
			"affirmative" : true,
			
			"magnitude" : 0.0,
			
			"sentiment" : 0.0
			
		}]
	},
	
	"intentions" : [{
		"object" : "Lemma String",
		
		"relation" : "POS String",
		
		"sentiment" : 0.0
	}]
}
```

##Populating GBI

Goals refer to long-term, persistent aims. It is populated by (some object in) the server, 
and remain constant during chat duration. 

New goals are also created on the server. When an instance is terminated, it reports its
current GBI back to the server. With this information, the server creates more goals. Goals
that are being considered, but that have not reached a confidence level to be instantiated 
in new instances are stores in a ```Potential Goals``` array.

```javascript

function checkForNewPotentialGoals(GBI){
	//for all desires d in GBI.desires[] that are beyond a magnitude threshold
		//if d is already in potentialGoals[]
			//increment potentialGoals[d]
		//otherwise add it to potentialGoals
		
}

function synthesizeGoals(){
	//for all goals g in potentialGoals[] that are beyond a certain increment threshold
		//add them to goals[]
} 
```
Desires refer to short-term aims that are based on current beliefs. They are modified when
the agent's beliefs are changed.

```javascript
```

Beliefs are assertions based on the current conversation.
```javascript
```
Intentions refer to the intention of the last utterance.
```javascript
```
