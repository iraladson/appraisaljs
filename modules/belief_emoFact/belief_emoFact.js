function belief_emoFact(){
	var aboutSelf = [];
	var aboutOther = [];
	var general = [];

	this.newBelief = function(obj){
		var belief = {

	        verb : obj.string,

	        assertion : obj.assertion,

	        affirmative : obj.affirmative || true,

	        relation : obj.posString,

	        sentiment : obj.sentiment || 00,

	        magnitude : obj.magnitude || 0.25
		};

		if(obj.type == "aboutSelf"){
			aboutSelf.push(belief);
		} else if (obj.type == "aboutOther") {
			aboutOther.push(belief);
		} else {
			belief.subject = obj.type;
			general.push(belief);
		}

	}
}