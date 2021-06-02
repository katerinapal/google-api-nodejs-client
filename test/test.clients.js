"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _assert = require("assert");

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var assert = _assert2.default;
var fs = _fs2.default;
var googleapis = require('../lib/googleapis.js');

describe('Clients', function () {

  it('should create request helpers according to the resource on discovery API response', function () {
    var plus = googleapis.plus('v1');
    assert.equal(_typeof(plus.people.get), 'function');
    assert.equal(_typeof(plus.activities.search), 'function');
    assert.equal(_typeof(plus.comments.list), 'function');
  });

  it('should be able to gen top level methods', function () {
    assert.equal(_typeof(googleapis.oauth2('v2').tokeninfo), 'function');
    assert.equal(_typeof(googleapis.freebase('v1').reconcile), 'function');
  });

  it('should be able to gen top level methods and resources', function () {
    var oauth2 = googleapis.oauth2('v2');
    assert.equal(_typeof(oauth2.tokeninfo), 'function');
    assert.equal(_typeof(oauth2.userinfo), 'object');
  });

  it('should be able to gen nested resources and methods', function () {
    var oauth2 = googleapis.oauth2('v2');
    assert.equal(_typeof(oauth2.userinfo), 'object');
    assert.equal(_typeof(oauth2.userinfo.v2), 'object');
    assert.equal(_typeof(oauth2.userinfo.v2.me), 'object');
    assert.equal(_typeof(oauth2.userinfo.v2.me.get), 'function');
  });

  it('should be able to require all api files without error', function () {
    function getFiles(dir, files_) {
      files_ = files_ || [];
      if (typeof files_ === 'undefined') files_ = [];
      var files = fs.readdirSync(dir);
      for (var i in files) {
        if (!files.hasOwnProperty(i)) continue;
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
          getFiles(name, files_);
        } else {
          files_.push(name);
        }
      }
      return files_;
    }

    var api_files = getFiles(__dirname + '/../apis');

    assert.doesNotThrow(function () {
      for (var i in api_files) {
        var obj = require(api_files[i]);
      }
    });
  });
});