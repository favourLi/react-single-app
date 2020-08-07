var event = {
	on : function(name , fn){
		!this.map[name] && (this.map[name] = []);
		this.map[name].push(fn);
	} ,
	off : function(name , fn){
		!fn && delete this.map[name];
		var list = this.map[name];
		for(var i=0; i<list.length; i++){
			if(list[i] === fn){
				list.splice(i ,1);
				break;
			}
		}
		!list.length && delete this.map[name];
	},
	emit : function(name , entry , once){
		var list = this.map[name];
		list && list.map((fn) => {
			fn(entry);
		});
		if(once){
			delete this.map[name];
		}
	},
	map : {
	}
}

export default event;
