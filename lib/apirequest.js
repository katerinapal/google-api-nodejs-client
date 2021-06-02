"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _stream = require("stream");

var _stream2 = _interopRequireDefault(_stream);

var _transporters = require("./transporters.js");

var _transporters2 = _interopRequireDefault(_transporters);

var _utils = require("./utils.js");

var _utils2 = _interopRequireDefault(_utils);

var _multipartStream = require("multipart-stream");

var _multipartStream2 = _interopRequireDefault(_multipartStream);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright 2014 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var Multipart = _multipartStream2.default;
var utils = _utils2.default;
var DefaultTransporter = _transporters2.default;
var transporter = new DefaultTransporter();
var stream = _stream2.default;

function isReadableStream(obj) {
  return obj instanceof stream.Stream && typeof obj._read == 'function' && _typeof(obj._readableState) == 'object';
}

function logErrorOnly(err) {
  if (err) {
    console.error(err);
  }
}

function createCallback(callback) {
  return typeof callback === 'function' ? callback : logErrorOnly;
}

function isValidParams(params, keys, callback) {
  for (var i = 0, len = keys.length; i < len; i++) {
    if (!params[keys[i]]) {
      callback(new Error('Missing required parameter: ' + keys[i]), null);
      return false;
    }
  }
  return true;
}

/**
 * Create and send request to Google API
 * @param  {object}   parameters Parameters used to form request
 * @param  {Function} callback   Callback when request finished or error found
 * @return {Request}             Returns Request object or null
 */
function createAPIRequest(parameters, callback) {
  var req, body;
  var mediaUrl = parameters.mediaUrl;
  var context = parameters.context;
  var params = parameters.params;
  var options = parameters.options || {};
  var requiredParams = parameters.requiredParams || [];
  var pathParams = parameters.pathParams || [];

  /**
   * If the params are not present, and callback was passed instead,
   * use params as the callback and create empty params.
   */
  if (typeof params === 'function') {
    callback = params;
    params = {};
  } else {
    params = utils.extend({}, params);
  }

  var callback = createCallback(callback);

  if (!isValidParams(params, requiredParams, callback)) {
    return null;
  }

  var method = options.method;
  var media = params.media || {};
  var resource = params.resource;
  var authClient = params.auth || context._options.auth || context.google._options.auth;
  var defaultMime = typeof media.body === 'string' ? 'text/plain' : 'application/octet-stream';
  delete params.media;
  delete params.resource;
  delete params.auth;

  // delete required parameters
  for (var i = 0, len = pathParams.length; i < len; i++) {
    delete params[pathParams[i]];
  }

  // if authClient is actually a string, use it as an API KEY
  if (typeof authClient === 'string') {
    params.key = params.key || authClient;
    authClient = null;
  }

  if (mediaUrl && media && media.body) {
    options.url = mediaUrl;
    if (resource) {
      // Create a boundary identifier and multipart read stream
      var boundary = Math.random().toString(36).slice(2);
      body = new Multipart(boundary);

      // Use multipart upload
      params.uploadType = 'multipart';

      options.headers = {
        'Content-Type': 'multipart/related; boundary="' + boundary + '"'
      };

      // Add parts to multipart request
      body.addPart({
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resource)
      });

      body.addPart({
        headers: {
          'Content-Type': media.mimeType || resource && resource.mimeType || defaultMime
        },
        body: media.body // can be a readable stream or raw string!
      });
    } else {
      params.uploadType = 'media';
      options.headers = {
        'Content-Type': media.mimeType || defaultMime
      };

      if (isReadableStream(media.body)) {
        body = media.body;
      } else {
        options.body = media.body;
      }
    }
  } else {
    options.json = resource || (method === 'GET' || method === 'DELETE' ? true : {});
  }

  options.qs = params;
  options = utils.extend({}, context.google._options, context._options, options);
  delete options.auth; // is overridden by our auth code

  // create request (using authClient or otherwise and return request obj)
  if (authClient) {
    req = authClient.request(options, callback);
  } else {
    req = transporter.request(options, callback);
  }

  if (body) body.pipe(req);
  return req;
}

/**
 * Exports helper functionsj
 * @type {object}
 */
module.exports = {
  createAPIRequest: createAPIRequest
};