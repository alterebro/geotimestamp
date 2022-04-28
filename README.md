# geotimestamp

> Latitude, Longitude and Time Encoding

Encode a geographic point location coordinates (latitude, longitude) along with a datetime value into a 15-chars short url-safe Base62 text string of letters and digits.

- **[Online encoder/decoder](https://codepen.io/alterebro/full/YzeKWGO)**

## Install

```html
<!-- npm i geotimestamp -->
<script src="https://unpkg.com/geotimestamp"></script>
```


## Use

```js
geotimestamp.encode( 36.6226298,-4.5015973, Date.parse("2022-04-23T19:22:12Z") )
// output: GJezYednAFrmZYE

geotimestamp.decode( 'N7YUlm7KWMxoZVL' )
// output: { lat: 45.19124, lng: 5.71463, timestamp: 1634746235000 }
```


*MIT License, 2022 ( Jorge Moreno, __[@alterebro](https://twitter.com/alterebro)__ )*
