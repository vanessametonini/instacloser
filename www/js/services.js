angular.module('starter.services', [])

.directive('distance', function () {
  return {
    restrict: 'E',
    link: function ($scope, $element, $attributes) {

      var radlat1 = Math.PI * parseFloat($attributes.fromLatitude) / 180,
          radlat2 = Math.PI * parseFloat($attributes.toLatitude) / 180,

          theta = parseFloat($attributes.fromLongitude) - parseFloat($attributes.toLongitude),
          radtheta = Math.PI * theta / 180,
          dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;

      var unit = (unit !== 'N') ? 'K' : unit;

      if (unit === 'K') {
          dist = dist * 1.609344;
      }

      if (unit === 'N') {
          dist = dist * 0.8684;
      }

      if (dist < 1) {
          dist = Math.round(dist * 1000) + 'm';
      } else {
          dist = dist.toFixed(2) + 'Km';
      }

      $element.text(dist + ' away')
    }
  }
})

.service('$ga', function ($rootScope, $state, $log) {

  var canTrackIt = false;

  var setUp = function (UA) {
    ga('create', UA)
    ga('send', 'pageview', 'homepage');
    canTrackIt = true;
  },
  trackIt = function (run) {
    if (trackIt) {
      run();
    }
  },
  trackPageview = function (url) {
    trackIt(function () {
      ga('send', 'pageview', url);
    });

    $log.debug('send', 'pageview', url);
  },
  trackEvent = function (eventType, eventName) {

    trackIt(function () {
      ga('send', 'event', eventType, eventName);
    });

    $log.debug('send', 'event', eventType, eventName);
  }

  $rootScope.$on('$stateChangeSuccess', function(event, toState) {
    if ($state.current.name === 'app.nearby') { return }

    trackPageview($state.href(toState.name));
  });

  return {
    setUp: setUp,
    trackPageview: trackPageview,
    trackEvent: trackEvent
  }
});
