import ext_assert_assert from "assert";
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

var google, drive, authClient, OAuth2;

describe('Path params', function() {

  function noop() {}

  beforeEach(function() {
    google = new googleapis_google.GoogleApis();
    drive = google.drive('v2');
  });

  it('should not throw error if not included and required', function(done) {
    ext_assert_assert.doesNotThrow(function() {
      drive.files.get({}, noop);
      done();
    });
  });

  it('should return an err object if not included and required', function(done) {
    var req = drive.files.get({}, function(err, resp) {
      ext_assert_assert.notEqual(err, null);
      done();
    });
  });

  it('should return null response object if not included and required', function(done) {
    var req = drive.files.get({}, function(err, resp) {
      ext_assert_assert.equal(resp, null);
      done();
    });
  });

  it('should return null request object if not included and required', function() {
    var req = drive.files.get({}, noop);
    ext_assert_assert.equal(req, null);
  });

  it('should return null request object if not included and required and no callback', function() {
    var req = drive.files.get({}, noop);
    ext_assert_assert.equal(req, null);
  });

  it('should not be modifiable directly', function() {
    var drive = google.drive('v2');
    var options = { fileId: '123' };
    ext_assert_assert.doesNotThrow(
      function() {
        // should not modify options object
        drive.files.get(options, noop);
        drive.files.get(options, noop);
      });
  });

  it('should be put in URL of path', function() {
    var req = drive.files.get({ fileId: 'abc123' }, noop);
    ext_assert_assert.equal(req.uri.path, '/drive/v2/files/abc123');
  });

  it('should be put in URL of pathname', function() {
    var req = drive.files.get({ fileId: '123abc' }, noop);
    ext_assert_assert.equal(req.uri.pathname, '/drive/v2/files/123abc');
  });

  it('should keep query params null if only path params', function() {
    var req = drive.files.get({ fileId: '123abc' }, noop);
    ext_assert_assert.equal(req.uri.query, null);
  });

  it('should keep query params as is', function() {
    var req = drive.files.get({ fileId: '123abc', hello: 'world' }, noop);
    ext_assert_assert.equal(req.uri.query, 'hello=world');
  });
});
