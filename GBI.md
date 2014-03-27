##Goals/Desires/Beliefs/Intentions

```json
{
	"goals" : [{
		"object" : "Lemma String" || obj reference,
		
		"descrip" : {
			"type" : integer, // -1, 0 ,or 1 => decrease, maintain, increase
			
			"prop" : "propString"
		},
		
		"magnitude" : float // -1 to 1
					
	}],
	
	"desires" : [{
		"object" : "Lemma String" || obj reference,
		
		"descrip" : {
			"type" : integer, // -1, 0 ,or 1 => decrease, maintain, increase
			
			"prop" : "propString"
		},
		
		"magnitude" : float // -1 to 1
					
	}],
	
	"beliefs" : {
		"aboutSelf" : [{
			"relation" : "POS String",
			
			"assertion" : "Lemma String",
			
			"sentiment" : float, // -1 to 1
			
			"magnitude" : float // -1 to 1
		}],
		
		"aboutOther" : [{
			"relation" : "POS String",
			
			"assertion" : "Lemma String",
			
			"sentiment" : float, // -1 to 1
			
			"magnitude" : float // -1 to 1
		}],
		
		"aboutConversation : [{
			"subject" : "Lemma String",
			
			"relation" : "POS String",
			
			"assertion" : "Lemma String",
			
			"affirmative" : boolean,
			
			"magnitude" : float // -1 to 1
			
			"sentiment" : float, // -1 to 1
			
		}]
	},
	
	"intentions" : [{ //NEEDS WORK
		"object" : "Lemma String",
		
		"relation" : "POS String",
		
		"sentiment" : float // -1 to 1
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
