var event = {
	/**
	 * @param {*} name 监听的事件名
	 * @param {*} fn 事件的回调方法
	 */
	on : function(name , fn){
		!this.map[name] && (this.map[name] = []);
		this.map[name].push(fn);
	} ,
	/**
	 * @param {*} name 取消监听的事件名
	 * @param {*} fn 取肖监听的事件方法，省略此参数，表示取消所有为name的事件监听
	 */
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
	/**
	 * @param {*} name 发送{name}事件
	 * @param {*} entry 发送事件并带上数据{entry}，此参数可省略
	 * @param {*} once once=true，表示发送{name}事件，之后立即取消监听{name}事件
	 */
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
