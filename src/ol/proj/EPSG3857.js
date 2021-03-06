/**
 * @module ol/proj/EPSG3857
 */
import {inherits} from '../index.js';
import {cosh} from '../math.js';
import Projection from '../proj/Projection.js';
import Units from '../proj/Units.js';
const _ol_proj_EPSG3857_ = {};


/**
 * @classdesc
 * Projection object for web/spherical Mercator (EPSG:3857).
 *
 * @constructor
 * @extends {ol.proj.Projection}
 * @param {string} code Code.
 * @private
 */
_ol_proj_EPSG3857_.Projection_ = function(code) {
  Projection.call(this, {
    code: code,
    units: Units.METERS,
    extent: _ol_proj_EPSG3857_.EXTENT,
    global: true,
    worldExtent: _ol_proj_EPSG3857_.WORLD_EXTENT,
    getPointResolution: function(resolution, point) {
      return resolution / cosh(point[1] / _ol_proj_EPSG3857_.RADIUS);
    }
  });
};
inherits(_ol_proj_EPSG3857_.Projection_, Projection);


/**
 * Radius of WGS84 sphere
 *
 * @const
 * @type {number}
 */
_ol_proj_EPSG3857_.RADIUS = 6378137;


/**
 * @const
 * @type {number}
 */
_ol_proj_EPSG3857_.HALF_SIZE = Math.PI * _ol_proj_EPSG3857_.RADIUS;


/**
 * @const
 * @type {ol.Extent}
 */
_ol_proj_EPSG3857_.EXTENT = [
  -_ol_proj_EPSG3857_.HALF_SIZE, -_ol_proj_EPSG3857_.HALF_SIZE,
  _ol_proj_EPSG3857_.HALF_SIZE, _ol_proj_EPSG3857_.HALF_SIZE
];


/**
 * @const
 * @type {ol.Extent}
 */
_ol_proj_EPSG3857_.WORLD_EXTENT = [-180, -85, 180, 85];


/**
 * Projections equal to EPSG:3857.
 *
 * @const
 * @type {Array.<ol.proj.Projection>}
 */
_ol_proj_EPSG3857_.PROJECTIONS = [
  new _ol_proj_EPSG3857_.Projection_('EPSG:3857'),
  new _ol_proj_EPSG3857_.Projection_('EPSG:102100'),
  new _ol_proj_EPSG3857_.Projection_('EPSG:102113'),
  new _ol_proj_EPSG3857_.Projection_('EPSG:900913'),
  new _ol_proj_EPSG3857_.Projection_('urn:ogc:def:crs:EPSG:6.18:3:3857'),
  new _ol_proj_EPSG3857_.Projection_('urn:ogc:def:crs:EPSG::3857'),
  new _ol_proj_EPSG3857_.Projection_('http://www.opengis.net/gml/srs/epsg.xml#3857')
];


/**
 * Transformation from EPSG:4326 to EPSG:3857.
 *
 * @param {Array.<number>} input Input array of coordinate values.
 * @param {Array.<number>=} opt_output Output array of coordinate values.
 * @param {number=} opt_dimension Dimension (default is `2`).
 * @return {Array.<number>} Output array of coordinate values.
 */
_ol_proj_EPSG3857_.fromEPSG4326 = function(input, opt_output, opt_dimension) {
  const length = input.length;
  const dimension = opt_dimension > 1 ? opt_dimension : 2;
  let output = opt_output;
  if (output === undefined) {
    if (dimension > 2) {
      // preserve values beyond second dimension
      output = input.slice();
    } else {
      output = new Array(length);
    }
  }
  const halfSize = _ol_proj_EPSG3857_.HALF_SIZE;
  for (let i = 0; i < length; i += dimension) {
    output[i] = halfSize * input[i] / 180;
    let y = _ol_proj_EPSG3857_.RADIUS *
        Math.log(Math.tan(Math.PI * (input[i + 1] + 90) / 360));
    if (y > halfSize) {
      y = halfSize;
    } else if (y < -halfSize) {
      y = -halfSize;
    }
    output[i + 1] = y;
  }
  return output;
};


/**
 * Transformation from EPSG:3857 to EPSG:4326.
 *
 * @param {Array.<number>} input Input array of coordinate values.
 * @param {Array.<number>=} opt_output Output array of coordinate values.
 * @param {number=} opt_dimension Dimension (default is `2`).
 * @return {Array.<number>} Output array of coordinate values.
 */
_ol_proj_EPSG3857_.toEPSG4326 = function(input, opt_output, opt_dimension) {
  const length = input.length;
  const dimension = opt_dimension > 1 ? opt_dimension : 2;
  let output = opt_output;
  if (output === undefined) {
    if (dimension > 2) {
      // preserve values beyond second dimension
      output = input.slice();
    } else {
      output = new Array(length);
    }
  }
  for (let i = 0; i < length; i += dimension) {
    output[i] = 180 * input[i] / _ol_proj_EPSG3857_.HALF_SIZE;
    output[i + 1] = 360 * Math.atan(
      Math.exp(input[i + 1] / _ol_proj_EPSG3857_.RADIUS)) / Math.PI - 90;
  }
  return output;
};
export default _ol_proj_EPSG3857_;
