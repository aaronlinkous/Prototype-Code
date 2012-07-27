var tools = {
	layer: function(dir){
		if(!$(".most_active").length){
			alert("Please select an element to be layered off of.");
			return false;
		}

		z = $(".most_active").css("z-index");
		zindex = dir != "-" ? --z : ++z;
		$(".active_element:not(.most_active)").css("z-index",zindex);
	},

	align: function(pos){
		if(!$(".most_active").length){
			alert("Please select an element to be aligned to.");
			return false;
		}

		var where_to, align_to = $(".most_active").position();
		var axis = pos == "l" || pos == "c" || pos == "r" ? "left" : "top";

		var align_to_w = $(".most_active").outerWidth();
		var align_to_h = $(".most_active").outerHeight();

		$(".active_element:not(.most_active)").each(function(){
			my_w = $(this).outerWidth();
			my_h = $(this).outerHeight();
			switch(pos){
				case "l":
					where_to = align_to.left;
				break;
				case "c":
					where_to = (align_to.left + align_to_w / 2) - (my_w / 2);
				break;
				case "r":
					where_to = align_to.left + (align_to_w - my_w);
				break;
				case "t":
					where_to = align_to.top;
				break;
				case "m":
					where_to = (align_to.top + align_to_h / 2) - (my_h / 2);
				break;
				case "b":
					where_to = align_to.top + (align_to_h - my_h);
				break;	
			}

			$(this).css(axis, where_to);
			move_markers($(this).attr("id"),$(this).position().top,$(this).position().left,my_w,my_h);
		});
	},

}


var activate_buttons = {};
	activate_buttons["text"] = ["single"];
	activate_buttons["box"] = ["single"];

	activate_buttons["text"]["single"] = ["bold","italic","underline","text_align_l","text_align_c","text_align_r","ul","text_color_badge","text_color_hex","bg_color_badge","bg_color_hex"];
	activate_buttons["box"]["single"] = ["bg_color_badge","bg_color_hex"];

	var activate_multiple_buttons = ["align_t","align_m","align_b","align_l","align_c","align_r","fore","back"];

function save_properties(string){
	var properties = string.split(";");
	settings = {};
	var temp, key, value;
	for (p in properties){
		temp = properties[p].split(":");
		key = $.trim(temp[0]);
		value = $.trim(temp[1]);

		if(key) settings[key] = value;
	}

	return settings;
}

var num_types;
function selected_element(){
	multiple_sel = $(".active_element").length > 1 ? true : false;
	single_sel = $(".active_element").length >= 1 ? true : false;

	num_types = [];
	$("#styleguide li").removeClass("inactive_style active");
	$(".active_element").resizable(resize_opts);

	//count different types for active elements
	$(".active_element").each(function(){
		if($.inArray($(this).attr("etype"), num_types) == -1) num_types.push($(this).attr("etype"));
	});

	//turn buttons on or off
	$(".active_tool").addClass("inactive_tool").removeClass("active_tool");
	$(".active_element").each(function(){
		type = $(this).attr("etype");

		if($(this).hasClass("has_style")){
			style = $(this).attr("styleguide");
			$("#"+style).addClass("active");
		}

		if(num_types.length <= 1){
			for(var s = activate_buttons[type]["single"].length-1; s>=0; --s ){
				button = activate_buttons[type]["single"][s];
				single_sel ? $("#"+button).removeClass("inactive_tool").addClass("active_tool") : $("#"+button).addClass("inactive_tool").removeClass("active_tool");
	  		}
  		}else{
	  		for(var s = activate_buttons[type]["single"].length-1; s>=0; --s ){
				button = activate_buttons[type]["single"][s];
				$("#"+button).addClass("inactive_tool").removeClass("active_tool");
	  		}
  		}
	});

	//turn on multiple selected buttons
	if(multiple_sel){
		for(var m = activate_multiple_buttons.length-1; m>=0; --m ){
			button = activate_multiple_buttons[m];
			multiple_sel ? $("#"+button).removeClass("inactive_tool").addClass("active_tool") : $("#"+button).addClass("inactive_tool").removeClass("active_tool");
		}
	}


	if(num_types.length == 1){
		$("#styleguide li:not(.e"+num_types[0]+")").addClass("inactive_style");
	}else if(multiple_sel && num_types.length > 1){
		$("#styleguide li").addClass("inactive_style").removeClass("active");
	}

}

function move_markers(id,top,left,w,h){
	$("#"+id+"_marker_v").css("left",left);
	$("#"+id+"_marker_h").css("top",top);
	$("#"+id+"_marker_v2").css("left",left + w);
	$("#"+id+"_marker_h2").css("top",top + h);
}

$(document).ready(function(){

	$("#save").on("click", function(){
		all_settings = new Array;
		all_data = new Array;
		$(".element").each(function(){
			all_settings.push(save_properties("id: "+id+"; "+$("#"+id).attr("style")));
			all_data.push(save_properties("id: "+id+"; "+$("#"+id).attr("attributes")));
		});

		console.log(all_settings,all_data);
	});

	$("#menu .hide").on("click", function(){
		$("#menu").hide();
		$("#show_menu").show();
	});

	$("#show_menu").on("click", function(){
		$("#menu").show();
		$("#show_menu").hide();
	});

	$("#styleguide ul li").on("click", function(){
		if($(this).hasClass("inactive_style") || $(".active_element").length == 0) return false;
		$("#styleguide ul li").removeClass("active important");
		$(this).addClass("active");

		$(".active_element").addClass("has_style").attr("styleguide",$(this).attr("id"));
	});

	$(".attr").on("click", function(){
		if($(this).hasClass("inactive_tool")) return false
		if($(this).hasClass("ind")){
			$(this).addClass("active").siblings().removeClass("active");
		}else if($(this).hasClass("active")){
			$(this).removeClass("active");
		}else{
			$(this).addClass("active");
		}

		apply_attr($(this).attr("attributes"));
	});

	$(".action").on("click", function(e){
		if($(this).hasClass("inactive_tool")) return false
		action = $(this).data("action");
		variable = $(this).data("variable");

		tools[action](variable);
	});

	$("#styleguide_close").on("click", function(){
		if($(this).hasClass("closed_styleguide")){
			$("#styleguide").width(200);
			$(this).removeClass("closed_styleguide").css("right",201);
		}else{
			$("#styleguide").width(0);
			$(this).addClass("closed_styleguide").css("right",0);
		}
	});
});