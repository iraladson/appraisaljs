function DBI(DBIjson){
	var that = this;

	var desires = DBIjson["desires"];

	var beliefs = DBIjson["beliefs"];

	var intentions = DBIjson["intentions"];

	/*DESIRES*/
	/****/
	this.newDesire = function(config){
		var obj = config.object;
		var val = config.value;

		if(!obj){
			console.log("error->desire must have specified object(string)");
			return;
		} else if(!val){
			console.log("error->desire must have specified value(string)");				
			return;
		}

		var pref = config.preference || 1,
			pers = config.persistant || false,
			mag = config.magnitude || 0.2,
			id = config.id || desires.length;

		desires.push({
			object : obj,
			value : val,
			last : val,		
			preference : pref,			
			persistant : false,		
			magnitude : 0.2, 		
			id : id,	
		});

		return that;		
	}
	/****/
	/****/
	this.removeDesire = function(config){
		var returnArray = [];

		for(var i=0;i<desires.length;i+=1){
			var desire = desires[i];

			if(config.object != undefined){
				if (desire.object = config.object) {
					returnArray.push(desire);
					desires.splice(i,1)
					i -= 1;
					continue;
				};
			}

			if(config.value != undefined){
				if (desire.value = config.value) {
					returnArray.push(desire);
					desires.splice(i,1)
					i -= 1;
					continue;
				};
			}

			if(config.preference != undefined){
				if (desire.preference = config.preference) {
					returnArray.push(desire);
					desires.splice(i,1)
					i -= 1;
					continue;
				};
			}

			if(config.persistant != undefined){
				if (desire.persistant = config.persistant) {
					returnArray.push(desire);
					desires.splice(i,1)
					i -= 1;
					continue;
				};
			}

			if(config.magnitude != undefined){
				if (desire.magnitude = config.magnitude) {
					returnArray.push(desire);
					desires.splice(i,1)
					i -= 1;
					continue;
				};
			}

			if(config.id != undefined){
				if (desire.id = config.id) {
					returnArray.push(desire);
					desires.splice(i,1)
					i -= 1;
					continue;
				};
			}
		}
		return that;
	}
	/****/
	/****/
	this.updateDesires = function(potentialDesires,config,checkFunction){
		for(var i = 0; i < potentialDesires.length; i+=1){
			var desire = potentialDesires[i];
			if(checkFunction(desire)){
				if(config.object == "_SELF"){
					config.object = desire;
					this.newDesire(config);
					config.object = "_SELF";

				} else {
					this.newDesire(config);
				}
			}
		}
	}	

	this.getDesires = function(){
		return desires;
	}
}

var dbison = {
	"desires" : [],
	
	"beliefs" : {
		"aboutSelf" : [],
		
		"aboutOther" : [],
		
		"general" : []
	},
	
	"intentions" : []
}
	
var person = { name : "Bob", age : 24};
var person1 = { name : "Richard", age : 56};
var person2 = { name : "Karen", age : 40};

function isOldEnough(person){
	if(person.age > 30)
		return true
}




