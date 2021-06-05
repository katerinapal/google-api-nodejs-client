import ext_assert_assert from "assert";
import ext_nock_nock from "nock";
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

ext_nock_nock.disableNetConnect();

describe('Compute auth client', function() {

  it('should get an initial access token', function(done) {
    var compute = new googleapis.auth.Compute();
    compute.transporter = {
      request: function(opts, opt_callback) {
        opt_callback(null, {
          'access_token': 'initial-access-token',
          'token_type': 'Bearer',
          'expires_in': 3600
        }, {});
      }
    };
    compute.authorize(function() {
      ext_assert_assert.equal('initial-access-token', compute.credentials.access_token);
      ext_assert_assert.equal('compute-placeholder', compute.credentials.refresh_token);
      done();
    });
  });

  it('should refresh if access token has expired', function(done) {
    var scope = ext_nock_nock('http://metadata')
        .get('/computeMetadata/v1beta1/instance/service-accounts/default/token')
        .reply(200, { access_token: 'abc123', expires_in: 10000 });
    var compute = new googleapis.auth.Compute();
    compute.credentials = {
      access_token: 'initial-access-token',
      refresh_token: 'compute-placeholder',
      expiry_date: (new Date()).getTime() - 2000
    };
    compute.request({}, function() {
      ext_assert_assert.equal(compute.credentials.access_token, 'abc123');
      scope.done();
      done();
    });
  });

  it('should not refresh if access token has expired', function(done) {
    var scope = ext_nock_nock('http://metadata')
        .get('/computeMetadata/v1beta1/instance/service-accounts/default/token')
        .reply(200, { access_token: 'abc123', expires_in: 10000 });
    var compute = new googleapis.auth.Compute();
    compute.credentials = {
      access_token: 'initial-access-token',
      refresh_token: 'compute-placeholder'
    };
    compute.request({}, function() {
      ext_assert_assert.equal(compute.credentials.access_token, 'initial-access-token');
      ext_assert_assert.equal(false, scope.isDone());
      ext_nock_nock.cleanAll();
      done();
    });
  });
});
