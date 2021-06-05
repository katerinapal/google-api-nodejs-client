import ext_assert_assert from "assert";
import { DefaultTransporter as transporters_DefaultTransporter } from "../lib/transporters";
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

describe('Transporters', function() {

  function noop() {}

  var defaultUserAgentRE = 'google-api-nodejs-client/\\d+\.\\d+\.\\d+';
  var transporter = new transporters_DefaultTransporter();

  it('should set default client user agent if none is set', function() {
    var opts = transporter.configure({});
    var re = new RegExp(defaultUserAgentRE);
    ext_assert_assert(re.test(opts.headers['User-Agent']));
  });

  it('should append default client user agent to the existing user agent', function() {
    var applicationName = 'MyTestApplication-1.0';
    var opts = transporter.configure({
      headers: { 'User-Agent': applicationName }
    });
    var re = new RegExp(applicationName + ' ' + defaultUserAgentRE);
    ext_assert_assert(re.test(opts.headers['User-Agent']));
  });

  it('should automatically add content-type for POST requests', function() {
    var drive = googleapis_google.drive('v2');
    var req = drive.comments.insert({
        fileId: 'a'
    }, noop);
    ext_assert_assert.equal(req.headers['content-type'], 'application/json');
  });

  it('should not add body for GET requests', function() {
    var drive = googleapis_google.drive('v2');
    var req = drive.files.list(noop);
    ext_assert_assert.equal(req.headers['content-type'], null);
    ext_assert_assert.equal(req.body, null);
  });

  it('should not add body for DELETE requests', function() {
    var drive = googleapis_google.drive('v2');
    var req = drive.files.delete({
        fileId: 'test'
    }, noop);
    ext_assert_assert.equal(req.headers['content-type'], null);
    ext_assert_assert.equal(req.body, null);
  });
});
