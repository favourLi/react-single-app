var util = {
	// 格式化金额（后台返回的是分，换算成两位小数）
    formatMoney(amount) {
        return (amount/100).toFixed(2)
    }
}

export default util;