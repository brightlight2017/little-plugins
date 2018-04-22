/*
 * @Author: scl
 * @Date:   2018-04-22 12:13:47
 * @Last Modified by:   scl
 * @Last Modified time: 2018-04-22 14:46:41
 * 依赖于jQuery的插件
 * $("form").dataResult();
 * 扩展用法：
 * $.fn.dataResult.extension({
 *   "min-length":function(data){
 *   		return this.val().length>=Number(data);
 *   }
 * })
 * html标签上直接添加data-dr-min-length=6,data-dr-min-length-message="xxx"属性即可
 */
(function(root, factory, plug) {
	factory(jQuery, plug);
})(this, function(jQuery, plug) {
	//默认参数配置
	var config = {
		initEvent: "input",
		plugName: "dr"
	}
	//校验引擎
	var _RULES = {
		"regexp": function(data) {
			return new RegExp(data).test(this.val());
		},
		"required": function() {
			return this.val();
		}
	}

	$.fn[plug] = function(options) {
		if (!this.is("form")) return;
		this.$find = this.find("input");
		$.extend(this, config, options);

		this.$find.on(this.initEvent, function() {
			var _this = $(this);
			_this.siblings('p').remove();
			$.each(_RULES, function(key, fn)) {
				var $name = _this.data(config.plugName + "-" + key);
				var $message = _this.data(config.plugName + "-" + key + "-message");
				if ($name) {
					var result = fn.call(_this, $name);
					if (!result) {
						_this.after("<p style='color:red;'>" + $message + "</p>");
					}
				}
			}
		})
	}

	//扩展接口
	$.fn[plug].extension = function(options) {
		$.extend(_RULES, options);
	}
}, "dataResult")