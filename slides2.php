<!DOCTYPE  HTML>
<html>
	<head>
		<title></title>
		<script src="scripts/jquery.js"></script>

<style>
	.timeline {
		border-top: 1px solid #000;
		list-style: none;
		padding: 0;
		position: relative;
		display: block;
		height: 70px;
		margin: 0;
	}

	.timeline:after {
		content: " ";
		height: 0;
		zoom: 0;
		clear: both;
		display: block;
	}

	.slide {
		height: 50px;
		width: 50px;
		background: red;
		margin: 10px;
		float: left;
		padding: 0;
	}

	.placeholder {
		background: none;
	}

	.optional, .hold{
		position: absolute;
	}

	#context {
		display: none;
		position: absolute;
		z-index: 2;
		background: #ccc;
		float: left;
	}

	.active {
		background: blue;
	}

	.context {
		background: green;
	}

	.hold {
		z-index: 3;
		background: rgba(255,0,0, .5);
	}
</style>


<script>
	function set_pos(){
		$(".hold").each(function(){
			from = $(this).attr("from");
			to = $(this).attr("to");

			from_x = $(".primary #s"+from).position().left
			to_x = $(".primary #s"+to).position().left + $(".primary #s"+to).width();

			$(this).css("left", from_x).width(to_x);
		});

		$(".optional").each(function(){
			slide = $(this).attr("slide");
			p_slide = $(".primary #s"+slide).position().left;
			
			$(this).css("left", p_slide);
		});
	}

	var navigation = {};
	function make_nav(){
		navigation = {};
		$(".timeline").each(function(i){
			navigation[i] = $(this).attr("timeline");

			navigation[i] = [];
			$(this).children(".slide:not(.placeholder)").each(function(x){
				num = $(this).hasClass("hold") ? $(this).attr("from")+'-'+$(this).attr("to") : $(this).attr("slide");

				navigation[i][x] = num;
			});
		});

		console.log(navigation);
	}

	$(document).ready(function(){
		set_pos();
		make_nav();

		$(".slide").live("dblclick", function(){
			$(".slide").removeClass("active");
			$(this).addClass("active");
		});

		$(".dup").live("click", function(){
			var clone = $(".context").clone().removeClass("active");
			var extras = "";

			if($(".context").hasClass("hold")){
				for(from = $(".context").attr("from"); from <= $(".context").attr("to"); from++){
					extras += '<li id="s'+from+'" class="slide optional placeholder from'+$(".context").attr("from")+'-'+$(".context").attr("to")+'" slide="'+from+'"></li>';
				}
			}else{
				clone.addClass("optional");
			}

			if($(this).hasClass("new_timeline")){
				new_time = prompt("Name?");
				$("#timelines").append('<ul id="time_'+new_time+'" class="timeline newest" timeline="'+new_time+'"></ul>');
				$(".newest").append(clone,extras).removeClass("newest");
			}else if($(this).hasClass("delete_slide")){
				delete_slide = confirm("Are you sure you want to remove this slide?");
				if(delete_slide){
					delete_from = $(".context").parent().attr("timeline");
					$("#time_"+delete_from).children(".from"+$(".context").attr("from")+"-"+$(".context").attr("to")).remove();
					$(".context").remove();
				}
				
			}else{
				dup_to = $(this).attr("timeline");
				$("#time_"+dup_to).append(clone,extras);
			}

			set_pos();
			make_nav();
		});

		$(".slide").live("contextmenu", function(e) {
			e.preventDefault();
			$(".slide").removeClass("context");
			$(this).addClass("context");

			new_slide = [];

			if($(this).hasClass("hold")){
				for(from = $(this).attr("from"); from <= $(this).attr("to"); from++){
					new_slide.push(from);
				}
			}else{
				new_slide.push($(this).attr("slide"));
			}

			$("#context li:not(.new_timeline, .delete_slide)").remove();

			//loop through timelines, and then though each slide in new_slide array to see if there is a conflict.
			var conflict = false;
			$(".timeline:not(.primary)").each(function(){
				val = $(this).attr("timeline");
				conflict = false;
				$.each(new_slide, function(i){
					if($("#time_"+val).children("#s"+new_slide[i]).length) conflict = true;
					if(!conflict) $("#context ul").append('<li class="dup" timeline="'+val+'">'+val+' Timeline</li>');
				});
			});

			$("#context").show();
			$(this).addClass("context");

			return false;
		});

		$(document).live("click", function(){
			$("#context").hide();
			$(".slide").removeClass("context"); 
		});
	});
</script>
		
	</head>
	<body>

		<div id="context">
			duplicate to:
			<ul>
				<li class="dup delete_slide">Delete Slide</li>
				<li class="dup new_timeline">Add to new timeline</li>
			</ul>
		</div>

		<div id="timelines">
			<ul class="timeline primary" timeline="primary">
				<li id="s1" class="slide" slide="1"></li>
				<li id="s2" class="slide" slide="2"></li>
				<li id="s3" class="slide" slide="3"></li>
			</ul>
	
			<ul id="time_secondary" class="timeline" timeline="secondary">
				<li id="s2" class="slide optional" slide="2"></li>
			</ul>
	
			<ul id="time_third" class="timeline" timeline="third">
				<li class="slide hold" from="1" to="2"></li>
				<li id="s1" class="slide optional placeholder from1-2" slide="1"></li>
				<li id="s2" class="slide optional placeholder from1-2" slide="2"></li>
				<li id="s3" class="slide optional" slide="3"></li>
			</ul>
		</div>
	</body>
</html>