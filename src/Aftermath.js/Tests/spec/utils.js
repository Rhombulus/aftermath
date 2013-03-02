describe('aftermath', function () {
    describe('utils', function () {
        describe('isNumber', function () {
            var fn = aftermath.utils.isNumber;
            it('should work in the first place', function () {
                return expect(fn(9393)).toBe(true);
            });
            it('should not convert strings', function () {
                return expect(fn('9393')).toBe(false);
            });
            it('should handle undefined', function () {
                return expect(fn(undefined)).toBe(false);
            });
            it('should handle null', function () {
                return expect(fn(null)).toBe(false);
            });
            it('should handle several number arguments', function () {
                return expect(fn(1, 2, 3)).toBe(true);
            });
            it('should handle several non-number arguments', function () {
                return expect(fn('asdf', [], true)).toBe(false);
            });
            it('should handle undefined arguments', function () {
                return expect(fn('asdf', undefined, true)).toBe(false);
            });
        });
        describe('isArray', function () {
            var fn = aftermath.utils.isArray;
            it('should work when they\'re empty', function () {
                return expect(fn([])).toBe(true);
            });
            it('should handle several array arguments', function () {
                return expect(fn([], [], [])).toBe(true);
            });
            it('should handle several non-array arguments', function () {
                return expect(fn('asdf', 2, true)).toBe(false);
            });
            it('should handle undefined', function () {
                return expect(fn(undefined)).toBe(false);
            });
            it('should handle null', function () {
                return expect(fn(null)).toBe(false);
            });
            it('should handle undefined arguments', function () {
                return expect(fn('asdf', undefined, true)).toBe(false);
            });
        });
    });
});
//@ sourceMappingURL=utils.js.map
