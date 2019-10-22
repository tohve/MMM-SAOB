/* global Module */

/* Magic Mirror
 * Module: MMM-SAOB
 *
 * By Tohmas Vennberg
 * MIT Licensed.
 */

Module.register("MMM-SAOB", {
	
	// Default module config.
	defaults: {
		animationSpeed: 1000,
		title: "Dagens ord från SAOB"
	},

	getHeader: function() {
		return "<span class='bright'>" + this.config.title + "</span>";
	},

	// Define required translations.
	getTranslations: function() {
		// The translations for the defaut modules are defined in the core translation files.
		// Therefor we can just return false. Otherwise we should have returned a dictionairy.
		// If you're trying to build yiur own module including translations, check out the documentation.
		return false;
	},

	// Define start sequence.
	start: function() {

		Log.info("Starting module: " + this.name);
		this.loaded = false;
		this.updateWord();
	},

	// Override dom generator.
	getDom: function() {

		var wrapper = document.createElement("div");

		if (!this.loaded) {
			wrapper.innerHTML = this.translate("LOADING");
			wrapper.className =	"dimmed light small";
			return wrapper;
		}

		// The word
		var large = document.createElement("div");
		large.className = "large light";
			
		var word = document.createElement("span");
		word.innerHTML = this.word;

		large.appendChild(word);
		wrapper.appendChild(large);
		
		return wrapper;
	},

	/* updateWord()
	 * Causes read of html from saob.se
	 */
	updateWord: function() {
		
		Log.info(this.name + ": Getting the Word!")
		var self = this;
		this.sendSocketNotification("GET_WORD", this.config);
	},

	/* socketNotificationReceived(notification, payload)
	 * From node_helper
	 *
	 * notification - the message
	 * payload - soab content
	 */
	socketNotificationReceived: function(notification, payload) {
		let self = this;
		if (notification === "THE_WORD") {
			Log.info(this.name + ": Word received!");
			self.processSAOB(payload);
		}
	},
	
	/* notificationReceived(notification, payload, sender)
	 * From MMM-ModuleScheduler, initiates update of word
	 *
	 * notification - the message
	 * payload - ignored
	 * sender - ignored
	 */
	notificationReceived: function(notification, payload, sender) {
		if (notification === "UPDATE_SAOB") {
			Log.info(this.name + " Received UPDATE_SAOB. Payload: ", payload);
			this.updateWord();
		}
	},

	/* processSAOB(data)
	 * Uses the received data from saob.se to find todays word.
	 *
	 * argument data object - the html page from saob
	 */
	processSAOB: function(
		data
	) {
		// Number of lines in webpage
		var lines = data.split('\n');
		Log.info(this.name + "Webpage has " + lines.length + " lines.");
		
		// Find key "Dagens ord</"
		for (var i = 0; i < lines.length; i++) {
			if (lines[i].search("Dagens ord</") > 0) {
				Log.info("Found key on line " + i);
				
				// Dagens ord is two lines below the key
				Log.info(lines[i+2]);
				
				// Strip line from tags
				var div = document.createElement("div");
				div.innerHTML = lines[i+2];
				this.word = div.textContent;
				break;
			}
		}
		this.loaded = true;
		this.updateDom(
			this
				.config
				.animationSpeed
		);
	},
});
