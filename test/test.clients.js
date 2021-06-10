import ext_assert_assert from "assert";
import ext_fs_fs from "fs";
/**
 * Copyright 2013 Google Inc. All Rights Reserved.
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

describe('Clients', function() {

  it('should create request helpers according to the resource on discovery API response', function() {
    var plus = googleapis.plus('v1');
    ext_assert_assert.equal(typeof plus.people.get, 'function');
    ext_assert_assert.equal(typeof plus.activities.search, 'function');
    ext_assert_assert.equal(typeof plus.comments.list, 'function');
  });

  it('should be able to gen top level methods', function() {
    ext_assert_assert.equal(typeof googleapis.oauth2('v2').tokeninfo, 'function');
    ext_assert_assert.equal(typeof googleapis.freebase('v1').reconcile, 'function');
  });

  it('should be able to gen top level methods and resources', function() {
    var oauth2 = googleapis.oauth2('v2');
    ext_assert_assert.equal(typeof oauth2.tokeninfo, 'function');
    ext_assert_assert.equal(typeof oauth2.userinfo, 'object');
  });

  it('should be able to gen nested resources and methods', function() {
    var oauth2 = googleapis.oauth2('v2');
    ext_assert_assert.equal(typeof oauth2.userinfo, 'object');
    ext_assert_assert.equal(typeof oauth2.userinfo.v2, 'object');
    ext_assert_assert.equal(typeof oauth2.userinfo.v2.me, 'object');
    ext_assert_assert.equal(typeof oauth2.userinfo.v2.me.get, 'function');
  });

  it('should be able to require all api files without error', function() {
    function getFiles(dir, files_) {
      files_ = files_ || [];
      if (typeof files_ === 'undefined') files_ = [];
      var files = ext_fs_fs.readdirSync(dir);
      for (var i in files) {
          if (!files.hasOwnProperty(i)) continue;
          var name = dir + '/' + files[i];
          if (ext_fs_fs.statSync(name).isDirectory()) {
              getFiles(name, files_);
          } else {
              files_.push(name);
          }
      }
      return files_;
    }

    var api_files = getFiles(__dirname + '/../apis');

    ext_assert_assert.doesNotThrow(function() {
      for (var i in api_files) {
        var obj = require(api_files[i]);
      }
    });
  });
});
