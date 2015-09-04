var Content = {
	total_images:0,
	current_images:0,
	all_added:false,

	check_load:function() {
		if(this.current_images >= this.total_images && this.all_added) {
			setInterval(main, 1000 / FPS);
		}
	},

	image_loaded:function() {
		Content.current_images++;
		Content.check_load();
	},

	add_image:function(name, source) {
		this.total_images++;
		Content[name] = new Image();
		Content[name].onload = this.image_loaded;
		Content[name].src = source;
	},

	finalize:function() {
		this.all_added = true;
		this.check_load();
	}
};