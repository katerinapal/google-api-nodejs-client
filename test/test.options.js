import ext_assert_assert from "assert";
import { google as googleapis_google } from "../lib/googleapis.js";
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

var OAuth2 = googleapis_google.auth.OAuth2;
var google, drive, authClient;

describe('Options', function() {

  function noop() {}

  beforeEach(function() {
    google = new googleapis_google.GoogleApis();
    drive = google.drive('v2');

  });

  it('should be a function', function() {
    ext_assert_assert.equal(typeof google.options, 'function');
  });

  it('should expose _options', function() {
    google.options({ hello: 'world' });
    ext_assert_assert.equal(JSON.stringify(google._options), JSON.stringify({ hello: 'world' }));
  });

  it('should expose _options values', function() {
    google.options({ hello: 'world' });
    ext_assert_assert.equal(google._options.hello, 'world');
  });

  it('should promote endpoint options over global options', function() {
    google.options({ hello: 'world' });
    var drive = google.drive({ version: 'v2', hello: 'changed' });
    var req = drive.files.get({ fileId: '123' }, noop);
    ext_assert_assert.equal(req.hello, 'changed');
  });

  it('should promote auth apikey options on request basis', function() {
    google.options({ auth: 'apikey1' });
    var drive = google.drive({ version: 'v2', auth: 'apikey2' });
    var req = drive.files.get({ auth: 'apikey3', fileId: 'woot' }, noop);
    ext_assert_assert.equal(req.url.query, 'key=apikey3');
  });

  it('should apply google options to request object like proxy', function() {
    google.options({ proxy: 'http://proxy.example.com' });
    var drive = google.drive({ version: 'v2', auth: 'apikey2' });
    var req = drive.files.get({ auth: 'apikey3', fileId: 'woot' }, noop);
    ext_assert_assert.equal(req.proxy.host, 'proxy.example.com');
    ext_assert_assert.equal(req.proxy.protocol, 'http:');
  });

  it('should apply endpoint options to request object like proxy', function() {
    var drive = google.drive({ version: 'v2', auth: 'apikey2', proxy: 'http://proxy.example.com' });
    var req = drive.files.get({ auth: 'apikey3', fileId: 'woot' }, noop);
    ext_assert_assert.equal(req.proxy.host, 'proxy.example.com');
    ext_assert_assert.equal(req.proxy.protocol, 'http:');
    ext_assert_assert.equal(req.uri.query, 'key=apikey3');
  });

  it('should apply endpoint options like proxy to oauth transporter', function() {
    authClient = new OAuth2('CLIENTID', 'CLIENTSECRET', 'REDIRECTURI');
    authClient.setCredentials({ access_token: 'abc' });
    var drive = google.drive({ version: 'v2', auth: 'apikey2', proxy: 'http://proxy.example.com' });
    var req = drive.files.get({ auth: authClient, fileId: 'woot' }, noop);
    ext_assert_assert.equal(req.proxy.host, 'proxy.example.com');
    ext_assert_assert.equal(req.proxy.protocol, 'http:');
    ext_assert_assert.equal(req.headers['Authorization'], 'Bearer abc');
  });
});
