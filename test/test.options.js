'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

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

var assert = _assert2.default;
var googleapis = require('../lib/googleapis.js');
var OAuth2 = googleapis.auth.OAuth2;
var google, drive, authClient;

describe('Options', function () {

  function noop() {}

  beforeEach(function () {
    google = new googleapis.GoogleApis();
    drive = google.drive('v2');
  });

  it('should be a function', function () {
    assert.equal(_typeof(google.options), 'function');
  });

  it('should expose _options', function () {
    google.options({ hello: 'world' });
    assert.equal(JSON.stringify(google._options), JSON.stringify({ hello: 'world' }));
  });

  it('should expose _options values', function () {
    google.options({ hello: 'world' });
    assert.equal(google._options.hello, 'world');
  });

  it('should promote endpoint options over global options', function () {
    google.options({ hello: 'world' });
    var drive = google.drive({ version: 'v2', hello: 'changed' });
    var req = drive.files.get({ fileId: '123' }, noop);
    assert.equal(req.hello, 'changed');
  });

  it('should promote auth apikey options on request basis', function () {
    google.options({ auth: 'apikey1' });
    var drive = google.drive({ version: 'v2', auth: 'apikey2' });
    var req = drive.files.get({ auth: 'apikey3', fileId: 'woot' }, noop);
    assert.equal(req.url.query, 'key=apikey3');
  });

  it('should apply google options to request object like proxy', function () {
    google.options({ proxy: 'http://proxy.example.com' });
    var drive = google.drive({ version: 'v2', auth: 'apikey2' });
    var req = drive.files.get({ auth: 'apikey3', fileId: 'woot' }, noop);
    assert.equal(req.proxy.host, 'proxy.example.com');
    assert.equal(req.proxy.protocol, 'http:');
  });

  it('should apply endpoint options to request object like proxy', function () {
    var drive = google.drive({ version: 'v2', auth: 'apikey2', proxy: 'http://proxy.example.com' });
    var req = drive.files.get({ auth: 'apikey3', fileId: 'woot' }, noop);
    assert.equal(req.proxy.host, 'proxy.example.com');
    assert.equal(req.proxy.protocol, 'http:');
    assert.equal(req.uri.query, 'key=apikey3');
  });

  it('should apply endpoint options like proxy to oauth transporter', function () {
    authClient = new OAuth2('CLIENTID', 'CLIENTSECRET', 'REDIRECTURI');
    authClient.setCredentials({ access_token: 'abc' });
    var drive = google.drive({ version: 'v2', auth: 'apikey2', proxy: 'http://proxy.example.com' });
    var req = drive.files.get({ auth: authClient, fileId: 'woot' }, noop);
    assert.equal(req.proxy.host, 'proxy.example.com');
    assert.equal(req.proxy.protocol, 'http:');
    assert.equal(req.headers['Authorization'], 'Bearer abc');
  });
});