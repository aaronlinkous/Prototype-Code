/**
 * Naked Modals
 *
 * Bare Bones modal plugin.
 *
 * Copyright 2011, Aaron Linkous
 * @version 0.1 (30th April 2012)
 **/

(function( $ ){
	$.modal = function(options) {
		var settings = {
			close_id : "modal_close_button",
			close_label : "close",
			confirm_id : "modal_confirm_button",
			modal_message : "",
			confirm_label : "confirm",

			modal_header : true,
			modal_title : "Modal Title",
			modal_close : "&times;",
			modal_add_class : "",

			moveable : true,

			open_callback : function(){},
			confirm_callback : function(){},
			close_callback : function(){}
		};

		var options = $.extend(settings, options);

		function open_callback(){
			settings.open_callback.call(this);
		}

		function confirm_callback(){
			settings.confirm_callback.call(this);
		}

		function close_callback(){
			settings.close_callback.call(this);
		}

		var modal_close_button = '';
		var modal_confirm_button = '';
		var header = '';
		var body;
		var buttons = '';

		var modal_title_container = '';
		var modal_close_container = '';

		if(settings.close_id) modal_close_button = '<button id="'+settings.close_id+'">'+settings.close_label+'</button>';
		if(settings.confirm_id) modal_confirm_button = '<button id="'+settings.confirm_id+'">'+settings.confirm_label+'</button>';
		if(modal_close_button || modal_confirm_button) buttons = '<div class="modal_buttons">'+modal_close_button+modal_confirm_button+'</div>';

		if(settings.modal_header){
			if(settings.modal_title) modal_title_container = '<div class="modal_title">'+settings.modal_title+'</div>';
			if(settings.modal_close) modal_close_container = '<div class="modal_close">'+settings.modal_close+'</div>';
			header = '<div class="modal_header">'+modal_title_container+modal_close_container+'</div>';
		}

		body = '<div class="modal_content">'+settings.modal_message+'</div>';

		if(settings.moveable){
			$("body").append('<div class="modal moveable '+settings.modal_add_class+'">'+header+body+buttons+'</div>');
			$(".modal.moveable").draggable({
				containment: "document",
				handle: ".modal_header"
			});
		}else{
			$("body").append('<div class="modal_bg"><div class="modal_container"><div class="modal_wrapper"><div class="modal fixed '+settings.modal_add_class+'">'+header+body+buttons+'</div></div></div></div>');
		}

		open_callback();
		$("#"+settings.confirm_id).bind("click", confirm_callback);

		$(".modal_close, #modal_close_button").bind("click", function(){
			$(this).closest(".modal_bg").remove();
			$(this).closest(".modal").remove();
			close_callback();
		});
	};
})(jQuery);