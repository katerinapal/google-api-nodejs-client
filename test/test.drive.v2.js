import ext_assert_assert from "assert";
import ext_nock_nock from "nock";
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

ext_nock_nock.disableNetConnect();

describe('drive:v2', function() {

  function noop() {}

  it('should exist', function(done) {
    ext_assert_assert.notEqual(typeof googleapis_google.drive, null);
    done();
  });

  it('should be a function', function(done) {
    ext_assert_assert.equal(typeof googleapis_google.drive, 'function');
    done();
  });

  it('should create a drive object', function(done) {
    var drive = googleapis_google.drive('v2');
    ext_assert_assert.notEqual(typeof drive, 'undefined');
    done();
  });

  it('should be frozen (immutable)', function(done) {
    var drive = googleapis_google.drive('v2');
    ext_assert_assert.equal(Object.isFrozen(drive), true);
    done();
  });

  describe('.files', function() {
    it('should exist', function(done) {
      var drive = googleapis_google.drive('v2');
      ext_assert_assert.notEqual(typeof drive.files, 'undefined');
      done();
    });

    it('should be an object', function(done) {
      var drive = googleapis_google.drive('v2');
      ext_assert_assert.equal(typeof drive.files, 'object');
      done();
    });

    describe('.insert', function() {
      it('should exist', function(done) {
        var drive = googleapis_google.drive('v2');
        ext_assert_assert.notEqual(typeof drive.files.insert, 'undefined');
        done();
      });

      it('should be a function', function(done) {
        var drive = googleapis_google.drive('v2');
        ext_assert_assert.equal(typeof drive.files.insert, 'function');
        done();
      });

      it('should return a Request object', function(done) {
        var drive = googleapis_google.drive('v2');
        var req = drive.files.insert({}, noop);
        ext_assert_assert.equal(req.constructor.name, 'Request');
        done();
      });
    });

    describe('.get', function() {
      it('should exist', function() {
        var drive = googleapis_google.drive('v2');
        ext_assert_assert.notEqual(typeof drive.files.get, 'undefined');
      });

      it('should be a function', function() {
        var drive = googleapis_google.drive('v2');
        ext_assert_assert.equal(typeof drive.files.get, 'function');
      });

      it('should return a Request object', function() {
        var drive = googleapis_google.drive('v2');
        var req = drive.files.get({ fileId: '123' }, noop);
        ext_assert_assert.equal(req.constructor.name, 'Request');
      });
    });
  });

  describe('._options', function() {
    it('should exist', function() {
      var drive = googleapis_google.drive('v2');
      ext_assert_assert.notEqual(typeof drive._options, 'undefined');
    });

    it('should be an object', function() {
      var drive = googleapis_google.drive('v2');
      ext_assert_assert.equal(typeof drive._options, 'object');
    });
  });

  describe('.files.list()', function() {
    it('should not return missing param error', function(done) {
      Array.prototype.lol = function() {};
      var scope = ext_nock_nock('https://www.googleapis.com')
        .get('/drive/v2/files?q=hello')
        .reply(200);
      var drive = googleapis_google.drive('v2');
      var req = drive.files.list({ q: 'hello' }, function(err, body) {
        ext_assert_assert.equal(err, null);
        done();
      });
    });
  });
});
