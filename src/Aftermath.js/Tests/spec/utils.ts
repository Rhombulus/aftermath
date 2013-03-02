/// <reference path="../../typings/jasmine.d.ts" />
/// <reference path="../../aftermath.ts" />



describe('aftermath', function () {
    describe('utils', function () {

        describe('isNumber', function () {
            var fn = aftermath.utils.isNumber;
            it('should work in the first place', () => expect(fn(9393)).toBe(true));
            it('should not convert strings', () => expect(fn('9393')).toBe(false));
            it('should handle undefined', () => expect(fn(undefined)).toBe(false));
            it('should handle null', () => expect(fn(null)).toBe(false));
            it('should handle several number arguments', () => expect(fn(1,2,3)).toBe(true));
            it('should handle several non-number arguments', () => expect(fn('asdf',[], true)).toBe(false));
            it('should handle undefined arguments', () => expect(fn('asdf',undefined, true)).toBe(false));
        });
        describe('isArray', function () {
            var fn = aftermath.utils.isArray;
            it('should work when they\'re empty', () => expect(fn([])).toBe(true));
            it('should handle several array arguments', () => expect(fn([],[],[])).toBe(true));
            it('should handle several non-array arguments', () => expect(fn('asdf',2, true)).toBe(false));
            it('should handle undefined', () => expect(fn(undefined)).toBe(false));
            it('should handle null', () => expect(fn(null)).toBe(false));
            it('should handle undefined arguments', () => expect(fn('asdf',undefined, true)).toBe(false));
        });

        
    });
});
