'use strict';

describe('watchApp.version module', function() {
  beforeEach(module('watchApp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
