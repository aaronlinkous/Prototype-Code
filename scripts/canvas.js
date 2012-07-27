var w,h,pos,id,multiple_sel,single_sel;

var resize_opts = {
	handles: 'n,e,s,w,ne,se,sw,nw',
	minWidth: 20,
	minHeight: 20,
	containment: '#canvas'
}

function box_properties(){
	form = "form goes here";
	return form;
	}

$(document).ready(function(){
	$(".element:not[.editing]").draggable({
		snap: ".marker",
		snapMode: "outer",
		cursor: 'move',
		containment: "#canvas",
		snapTolerance: 15,
		opacity: 0.7,
		start: function(event, ui){
			id = $(this).attr("id");
			w = $(this).width();
			h = $(this).height();
		},
		drag: function(event, ui){
			$(".element").removeClass("most_active active_element");
			$(this).addClass("active_element").resizable(resize_opts);
			pos = $(this).position();

			var snapped = $(this).data('draggable').snapElements;
	        var snappedTo = $.map(snapped, function(element) {
	            return element.snapping ? element.item : null;
	        });

	        var result = "";
	        $.each(snappedTo, function(idx, item) {
	            result += $(item).attr("id") + ", ";
	        });

	        val = result == "" ? 0 : 1;
	        result == "" ? $(".marker").css("opacity",val) : $("#"+result).css("opacity",val);
		},
		stop: function(event,ui){
			$(".marker").css("opacity",0);
			move_markers(id,pos.top,pos.left,w,h);
		}
	});

	$(".active_element").resizable(resize_opts);

	$(".element").on("click", function(e){
		if(!$(this).hasClass("not_active")){
			e.stopPropagation();
	   		if(e.shiftKey){
		    	if($(this).hasClass("active_element")){
			    	$(this).removeClass("active_element");
		    	}else{
			    	$(this).addClass("active_element ui-selected");
		    	}
		    	$(".element").removeClass("most_active");
		    }else{
			    if(multiple_sel){
				    $(".element").removeClass("most_active");
				    $(this).addClass("most_active");
			    }else{
				    $(".element").removeClass("most_active active_element");
				    $(this).addClass("active_element ui-selected");
			    }
		    }
	    }
	    selected_element();
    });


	$(".element").on("dblclick", function(e){
		e.stopPropagation();
	    $(".element").removeClass("most_active active_element editing").addClass("not_active");
	    $(this).addClass("active_element editing").removeClass("not_active");

	    if($(this).attr("etype") == "text"){
		    //launch iframe editor thingy magig
	    }else{
			$.modal({
				modal_message: box_properties(),
				modal_title: "Properties",
				close_label: "cancel"
			});
	    }
    });

    $("#canvas").selectable({
	    filter: ".element",
	    stop: function(e,ui){
		    $(".ui-selected").each(function(){
			    $(this).addClass("active_element");
		    });
		    selected_element();
	    },
	    unselected: function(e,ui){
		    $(".element").removeClass("active_element most_active editing not_active");
		    selected_element();
		    $(".element").resizable("destroy");
	    }
    });
});