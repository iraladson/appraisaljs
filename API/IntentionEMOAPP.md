#Intention

This module can help determine the intentions of a sentence. 

###Functions
`newintention(sentence,self)```

`sentence` is a string of the sentence is question.
`self` is a boolean. Set to `true`, it means the sentence is the agent's intention. Deafaults to `true`.

The function looks at ```sentence``` and creates an intentionObject. It returns the array that contains all intentionObjects that have been created. Each intentionObject has five properties.
1. `id` is an id. Automatically incremented as more intentions are logged.
2. `isQuestYN` is a float that represents confidence that sentence is expecting a yes or no answer.
3. `isQuestAlt` => confidence that the sentence is looking for a choice between alternate responses.
4. `isQuestOpen` => confidence that the sentence is looking for an open answer.
5. `isDeclar` => confidence that the sentence is a declarative.
6. `isImper` => confidence that the sentence is imperative.

----------------------

`getLog()`

Returns the array that contains all intentionObjects that have been created.

----------------------

`getIntent(type)`

`type` is a boolean. If true, the function returns the most recent intention of the agent. If false, it returns the most recent intention of the 'other'.
