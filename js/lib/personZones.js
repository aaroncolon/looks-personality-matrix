(function(exports) {
  "use strict";

  const Zones = (function() {
    const dangerZone = {
      lower: [5,5],
      upper: [10,0]
    };
    dangerZone.line = calcDangerLine();

    function findZone(position) {
      const looks       = Number(position[0]);
      const personality = Number(position[1]);

      if (isZoneNoGo(looks, personality)) {
        return 'No Go';
      }
      else if (isZoneDanger(looks, personality)) {
        return 'Danger';
      }
      else if (isZoneFun(looks, personality)) {
        return 'Fun';
      }
      else if (isZoneDate(looks, personality)) {
        return 'Date';
      }
      else if (isZoneSpouse(looks, personality)) {
        return 'Spouse';
      }
      else if (isZoneUnicorn(looks, personality)) {
        return 'Unicorn';
      }
      return null;
    }

    function averageZone(positions) {
      const looks       = averageLooks(positions);
      const personality = averagePersonality(positions);

      return findZone([looks, personality]);
    }

    function averageLooks(positions) {
      let looks = 0;

      for (let i = 0; i < positions.length; i++) {
        looks += positions[i][0];
      }

      looks = (looks / positions.length);

      return looks;
    }

    function averagePersonality(positions) {
      let personality = 0;

      for (let i = 0; i < positions.length; i++) {
        personality += positions[i][1];
      }

      personality = (personality / positions.length);

      return personality;
    }

    function calcDangerLine(_a = dangerZone.lower, _b = dangerZone.upper) {
      const [ a, b ]   = [ _a, _b ]; // destructuring
      const slope      = calcSlope(a, b);
      const intercept  = calcIntercept(a, slope);
      const dangerLine = [];

      for (let x = a[0]; x <= b[0]; x++) {
        let y = slope * x + intercept;
        dangerLine.push([x,y]);
      }

      return dangerLine;
    }

    function isZoneNoGo(looks, personality) {
      if (looks < 5 && personality < 8) {
        return true;
      }
      return false;
    }

    function isZoneDanger(looks, personality) {
      if (!isZoneNoGo(looks, personality)) {
        for (let i = 0; i < dangerZone.line.length; i++) {
          if (looks > dangerZone.line[i][0]) {
            continue;
          }
          else if (looks === dangerZone.line[i][0]) {
            if (personality <= dangerZone.line[i][1]) {
              return true;
            }
            return false;
          }
        }
      }
    }

    // function isZoneDanger(looks, personality) {
    //   if ( !isZoneNoGo(looks, personality)
    //      && ((looks == 5 && personality > 7)
    //      || (looks == 6 && personality > 7.5)
    //      || (looks == 7 && personality > 8.5)
    //      || (looks == 8 && personality > 9)
    //      || (looks == 9 && personality > 9.5)
    //      || (looks == 10 && personality == 10)) ) {
    //     return true;
    //   }
    //   return false;
    // }

    function isZoneFun(looks, personality) {
      if (!isZoneDanger(looks, personality) && looks >= 5 && looks < 8) {
        return true;
      }
      return false;
    }

    function isZoneDate(looks, personality) {
      if (!isZoneDanger(looks, personality) && looks >= 8 && looks <= 10 && personality <= 7) {
        return true;
      }
      return false;
    }

    function isZoneSpouse(looks, personality) {
      if (!isZoneDanger(looks, personality) && looks >= 8 && looks <= 10 && personality > 7 && personality < 9) {
        return true;
      }
      return false;
    }

    function isZoneUnicorn(looks, personality) {
      if (!isZoneDanger(looks, personality) && looks >= 8 && looks <= 10 && personality >= 9 && personality <= 10) {
        return true;
      }
      return false;
    }

    function roundHalf(n) {
      return (Math.round(n * 2) / 2).toFixed(1);
    }

    /**
     * Calculate the slope between two points
     *
     * @param {Array} a the lower point
     * @param {Array} b the upper point
     */
    function calcSlope(a, b) {
      if (a[0] === b[0]) {
        return null;
      }
      return ((b[1] - a[1]) / (b[0] - a[0]));
    }

    /**
     * Calculate the intercept given a point and a slope
     *
     * @param {Array}  point the lower point
     * @param {Number} slope the slope
     */
    function calcIntercept(point, slope) {
      if (slope === null) {
        // vertical line
        return point[0];
      }
      return point[1] - slope * point[0];
    }

    return {
      findZone           : findZone,
      averageZone        : averageZone,
      averageLooks       : averageLooks,
      averagePersonality : averagePersonality,
      roundHalf          : roundHalf
    }

  })(); // Zones

  exports.acZones = Zones;

})(window)
