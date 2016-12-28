
          document.addEventListener('WebComponentsReady', function() {
            a1.addEventListener('click', _onTap);
            a2.addEventListener('click', _onTap);
          });
          function _onTap(e) {
            var target = e.target;
            if (!target.down) {
              target.elevation += 1;
              if (target.elevation === 5) {
                target.down = true;
              }
            } else {
              target.elevation -= 1;
              if (target.elevation === 0) {
                target.down = false;
              }
            }
          };
        