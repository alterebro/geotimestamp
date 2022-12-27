;(function (window) {

    'use strict';
    const geotimestamp = (function() {

        const base = {
            alpha : '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
            encode: integer => {
                if (integer === 0) { return '0'; }
                let s = [];
                while (integer > 0) {
                    s = [base.alpha[integer % base.alpha.length], ...s];
                    integer = Math.floor(integer / base.alpha.length);
                }
                return s.join('');
            },
            decode: chars => chars.split('').reverse().reduce((prev, curr, i) => prev + (base.alpha.indexOf(curr) * (base.alpha.length ** i)), 0)
        }

        const cantor = {
            pair : (x, y) => ((x + y) * (x + y + 1)) / 2 + y,
            unpair :  z => {
                let t = Math.floor((-1 + Math.sqrt(1 + 8 * z))/2);
                let x = t * (t + 3) / 2 - z;
                let y = z - t * (t + 1) / 2;
                return [x, y];
            }
        }

        const caesar = (str, shift) => str.split('').map( char => base.alpha[((base.alpha).indexOf(char) + shift) % ((base.alpha).length)] ).join('');

        const encode = function(lat, lng, timestamp) {

            // Latitude ranges between -90 and 90 degrees, inclusive.
            let _lat = lat + 90; // 0 - 180
                _lat = Math.round( _lat * 1e5 );

            // Longitude ranges between -180 and 180 degrees, inclusive.
            let _lng = lng + 180; // 0 - 360
                _lng = Math.floor( _lng * 1e5 );

            let _coords = cantor.pair(_lat, _lng);
                _coords = base.encode( _coords );
                _coords = _coords.padStart(9,'0')

            // Timestamp
            let _timestamp = Math.round( timestamp / 1e3 );
                _timestamp = base.encode( _timestamp );
                _timestamp = _timestamp.padStart(6,'0')

            // Entropy
            let _str = `${_coords}${_timestamp}`; // [9][6]
            let _prefix = _str.slice(0, -1);
            let _shift = _str.slice(-1);
            let _rot = (base.alpha).indexOf(_shift);

            return `${caesar(_prefix, _rot)}${_shift}`;
        }

        const decode = function(guid) {

            let _prefix = guid.slice(0, -1);
            let _shift = guid.slice(-1);
            let _rot = (base.alpha).indexOf(_shift);
            let _str = `${caesar(_prefix, ((base.alpha).length-_rot))}${_shift}`

                let timestamp = (base.decode(_str.slice(-6)) * 1e3);

            let _coords = cantor.unpair(base.decode(_str.slice(0, -6)));

                let lat = parseFloat(((_coords[0] / 1e5) - 90).toFixed(5));
                let lng = parseFloat(((_coords[1] / 1e5) - 180).toFixed(5));

            return { lat, lng, timestamp }
        }

        return { encode, decode }

    })();

    // ~~~~~~~~~

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
        // Node: Export function
		module.exports = geotimestamp;
    } 
    else if (typeof define === 'function' && define.amd) {
        // AMD/requirejs: Define the module
        define(function () {return geotimestamp;});
    }
    else {
        // Browser: Expose to window
        window.geotimestamp = geotimestamp;
	}

})(this);
