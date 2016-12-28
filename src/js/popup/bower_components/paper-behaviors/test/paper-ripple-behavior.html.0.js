
    HTMLImports.whenReady(function() {
      Polymer({
        is: 'test-ripple',
        behaviors: [
          Polymer.IronButtonState,
          Polymer.IronControlState,
          Polymer.PaperRippleBehavior
        ]
      });
    });
    