

(function() {

	Polymer({
		is: 'paper-expansion-panel',
		properties: {
			/**
			 * Text in the header row
			 */
			header: String,

			/**
			 * Summary of the expandible area
			 */
			summary: String,

			/**
			 * True if the content section is opened
			 */
			opened: {
				type: Boolean,
				reflectToAttribute: true,
				notify: true
			},

			_toggleIcon: {
				type: String,
				computed: '_computeToggleIcon(opened)'
			}
		},

		// Private methods
		/**
		 * Fired whenever the status is changed (opened/closed)
		 *
		 * @event toggle
		 */
		_toggleOpened: function(e) {
			this.opened = !this.opened;
			this.fire('toggle', this);
		},
		_computeToggleIcon: function(opened) {
			return opened ? 'icons:expand-less' : 'icons:expand-more';
		}
	});

})();

