'use strict';

/* Magic Mirror
 * Module: MMM-SAOB / node_helper
 *
 * By Tohmas Vennberg
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
var request = require('request');

module.exports = NodeHelper.create({

	start: function() {
		console.log(this.name + " is started!")
		this.started = false;
		this.config = null;
	},

	socketNotificationReceived: function(notification, payload) {
		var self = this;
		if (notification === 'GET_WORD') {
			console.log(this.name + " order to get word!")
			self.getData();
		}
	},

	getData: function() {
		var self = this;
		
		var myUrl = "https://www.saob.se";
				
		request({
			url: myUrl,
			method: 'GET',
			headers: ''
		}, function (error, response, body) {
			
			if (!error && response.statusCode == 200) {
				self.sendSocketNotification("THE_WORD", body);
			}
			else {
				console.log(this.name + error)
			}
		});
	}
});
