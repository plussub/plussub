
			suite('<paper-expansion-panel>', function() {
				suite('open/close behavior', function() {
					var element;

					setup(function() {
						element = fixture('TrivialElement');
					});

					test('defaults to closed', function() {
						expect(element.opened).to.be.eql(false);
					});

					test('shows open toggle icon when closed', function() {
						element.opened = false;
						expect(element._toggleIcon).to.be.eql('icons:expand-more');
					});

					test('shows open toggle icon when opened', function() {
						element.opened = true;
						expect(element._toggleIcon).to.be.eql('icons:expand-less');
					});
				});
			});
		