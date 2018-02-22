(function($) {
  // xx2xx 方法均来源的于网络

  /**
   * Color Ops
   * @param {string} color Color.
   * @param {float} level Number Float.
   * @return {string} color Hex Color.
   */
  $.fn.colorDarken = function(color, level) {

    var rgbColor = '';
        colorFormat = _colorFormat(color);

    switch (colorFormat) {
      case "HEX": { rgbColor = _hex2rgb(color); break; }
      case "RGB": { rgbColor = color; break; }
      case "HSL": { rgbColor = _hsl2rgb(color); break; }
      default: { }
    }

    return _rgb2hex(_colorDarken(rgbColor, level));

  };

  /**
   * Color Ops
   * @param {string} color Color.
   * @param {float} level Number Float.
   * @return {string} color Hex Color.
   */
  $.fn.colorLighten = function(color, level) {

    var rgbColor = '';
        colorFormat = _colorFormat(color);

    switch (colorFormat) {
      case "HEX": { rgbColor = _hex2rgb(color); break; }
      case "RGB": { rgbColor = color; break; }
      case "HSL": { rgbColor = _hsl2rgb(color); break; }
      default: { }
    }

    return _rgb2hex(_colorLighten(rgbColor, level));

  };

  /**
   * Color Ops
   * @param {string} color Color.
   * @return {string} color Hex Color.
   */
  $.fn.colorWebSafe = function(color) {

    var rgbColor = '';
        colorFormat = _colorFormat(color);

    switch (colorFormat) {
      case "HEX": { rgbColor = _hex2rgb(color); break; }
      case "RGB": { rgbColor = color; break; }
      case "HSL": { rgbColor = _hsl2rgb(color); break; }
      default: { }
    }

    return _rgb2hex(_colorWebSafe(rgbColor, level));

  };

  // Privates:

  // jQuery method
  /**
   * Color Ops
   * @param {string} color color.
   * @return {string} "HEX" "RGB" "HSL".
   */
  $.fn.ColorFormat = function(color) { return _colorFormat(color); };

  var _colorFormat = function(color) {

    var hex = /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i;
        rgb = /(^rgb|RGB)/;
        hsl = /(^hsl|HSL)/;

    if (hex.test(color)) {
      return 'HEX';
    } else if (rgb.test(color)) {
      return 'RGB';
    } else if (hsl.test(color)) {
      return 'HSL';
    } else {
      return '';
    }

  };

  // jQuery method
  /**
   * Color Ops
   * @param {string} color hex color.
   * @return {string} color rgb color.
   */
  $.fn.HEXToRGB = function(color) { return _hex2rgb(color); };

  var _hex2rgb = function(color) {
    const rgx = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const hex = color.replace(rgx, (m, r, g, b) => r + r + g + g + b + b );
    const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    const r = parseInt(rgb[1], 16);
    const g = parseInt(rgb[2], 16);
    const b = parseInt(rgb[3], 16);
    return `rgb(${r},${g},${b})`;
  };

  // jQuery method
  /**
   * Color Ops
   * @param {string} color hsl color.
   * @return {string} color rgb color.
   */
  $.fn.HSLToRGB = function(color) { return _hsl2rgb(color); };
  // 未验证
  var _hsl2rgb = function(color) {
    const hsl = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g.exec(color);
    const h = parseInt(hsl[1]) / 360;
    const s = parseInt(hsl[2]) / 100;
    const l = parseInt(hsl[3]) / 100;
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }
    let r, g, b;
    if (s == 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return `rgb(${r * 255},${g * 255},${b * 255})`;
  };

  /**
   * Color Ops
   * @param {string} color rgb color.
   * @return {string} color hex color.
   */
  $.fn.RGBToHEX = function(color) { return _rgb2hex(color); };

  var _rgbArray = function(color) {
    var rgb = color.replace(/(^rgb|RGB)/, "").split(',');
    console.log(rgb);
    var r = parseInt(rgb[0].replace("(", ""));
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].replace(")", ""));
    console.log(r + ":" + g + ":" + b);
    return [r, g, b];
  };

  var _rgb2hex = function(color) {
    var rgb = _rgbArray(color);
    var hex = "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1);
    return hex;
  };

  /**
   * Color Ops
   * @param {string} color rgb color.
   * @return {string} color hsl color.
   */
  $.fn.RGBToHSL = function(color) { return _rgb2hsl(color); };

  var _rgb2hsl = function(color) {
    return '';
  };

  /**
	 * Color Ops
	 * @param {string} color RGB Color.
   * @param {float} level Number Float.
	 * @return {string} color RGB Color.
	 */
  // $.fn.colorDarken = function(color, level) { return _colorDarken(color, level); };

  var _colorDarken = function(color, level) {

    if (level > 1 || level < 0 || level === null) { return color; }

    var rgb = _rgbArray(color);
    for (var i = 0; i < 3; i++) { rgb[i] = Math.floor(parseInt(rgb[i]) * (1 - level)); }
    // console.log("_colorDarken Start");console.log(rgb);console.log("_colorDarken End");
    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;

  };

  /**
	 * Color Ops
	 * @param {string} color RGB Color.
   * @param {float} level Number Float.
	 * @return {string} color RGB Color.
	 */
  var _colorLighten = function(color, level) {

    if (level > 1 || level < 0 || level === null) { return color; }

    var rgb = _rgbArray(color);
    for (var i = 0; i < 3; i++) { rgb[i] = Math.floor((255 - parseInt(rgb[i])) * level + parseInt(rgb[i])); }

    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;

  };

  /**
	 * Color Ops
	 * @param {string} color RGB Color.
	 * @return {string} color RGB Color.
	 */
  var _colorWebSafe = function(color) {

    var rgb = _rgbArray(color);
    for (var i = 0; i < 3; i++) {
      var q1 = Math.floor(parseInt(rgb[i]) / 51.0) * 51;
      //ceil向上取整
      var q2 = Math.ceil(parseInt(rgb[i]) / 51.0) * 51;
      //abs绝对值
      if (Math.abs(q1 - parseInt(rgb[i])) <= Math.abs(q2 - parseInt(rgb[i]))) { parseInt(rgb[i]) = q1; }
      else { parseInt(rgb[i]) = q2; }
    }

    return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;

  };

})(jQuery);
