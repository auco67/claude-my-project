const { add, findMax, reverseString } = require('../src/exsample');

describe('add', () => {
  describe('正常系', () => {
    test('正の整数同士を加算できる', () => {
      expect(add(1, 2)).toBe(3);
    });

    test('負の数を含む加算ができる', () => {
      expect(add(-5, 3)).toBe(-2);
      expect(add(-5, -3)).toBe(-8);
    });

    test('小数の加算ができる', () => {
      expect(add(0.1, 0.2)).toBeCloseTo(0.3);
    });
  });

  describe('境界値', () => {
    test('0 との加算は元の値を返す', () => {
      expect(add(0, 0)).toBe(0);
      expect(add(7, 0)).toBe(7);
    });

    test('MAX_SAFE_INTEGER 付近の加算', () => {
      expect(add(Number.MAX_SAFE_INTEGER - 1, 1)).toBe(Number.MAX_SAFE_INTEGER);
    });

    test('MIN_SAFE_INTEGER 付近の加算', () => {
      expect(add(Number.MIN_SAFE_INTEGER + 1, -1)).toBe(Number.MIN_SAFE_INTEGER);
    });

    test('Number.MAX_VALUE を超えると Infinity になる', () => {
      expect(add(Number.MAX_VALUE, Number.MAX_VALUE)).toBe(Infinity);
    });

    test('Infinity と -Infinity の加算は NaN になる', () => {
      expect(add(Infinity, -Infinity)).toBeNaN();
    });
  });

  describe('エラー処理（現在の挙動の記録）', () => {
    test('文字列を渡すと文字列連結になる', () => {
      expect(add('1', 2)).toBe('12');
    });

    test('引数が不足すると NaN を返す', () => {
      expect(add(1)).toBeNaN();
    });

    test('NaN を渡すと NaN を返す', () => {
      expect(add(NaN, 1)).toBeNaN();
    });
  });
});

describe('findMax', () => {
  describe('正常系', () => {
    test('正の整数配列の最大値を返す', () => {
      expect(findMax([1, 5, 3])).toBe(5);
    });

    test('負の数のみの配列の最大値を返す', () => {
      expect(findMax([-10, -3, -7])).toBe(-3);
    });

    test('小数を含む配列の最大値を返す', () => {
      expect(findMax([1.5, 2.7, 2.6])).toBe(2.7);
    });

    test('元の配列を変更しない', () => {
      const numbersList = [3, 1, 2];
      findMax(numbersList);
      expect(numbersList).toEqual([3, 1, 2]);
    });
  });

  describe('境界値', () => {
    test('要素が1つの配列はその値を返す', () => {
      expect(findMax([42])).toBe(42);
    });

    test('全要素が同じ値の配列', () => {
      expect(findMax([4, 4, 4])).toBe(4);
    });

    test('Infinity を含む配列は Infinity を返す', () => {
      expect(findMax([1, Infinity, 3])).toBe(Infinity);
    });

    test('NaN を含む配列は NaN を返す', () => {
      expect(findMax([1, NaN, 3])).toBeNaN();
    });
  });

  describe('エラー処理', () => {
    test('空配列の場合はエラーを投げる', () => {
      expect(() => findMax([])).toThrow('配列が空です');
    });

    test('null を渡すと TypeError を投げる', () => {
      expect(() => findMax(null)).toThrow(TypeError);
    });

    test('undefined を渡すと TypeError を投げる', () => {
      expect(() => findMax(undefined)).toThrow(TypeError);
    });

    test('配列以外（数値）を渡すと TypeError を投げる', () => {
      expect(() => findMax(5)).toThrow(TypeError);
    });
  });
});

describe('reverseString', () => {
  describe('正常系', () => {
    test('英字の文字列を反転する', () => {
      expect(reverseString('hello')).toBe('olleh');
    });

    test('日本語の文字列を反転する', () => {
      expect(reverseString('あいう')).toBe('ういあ');
    });

    test('空白や記号を含む文字列を反転する', () => {
      expect(reverseString('a b!')).toBe('!b a');
    });
  });

  describe('境界値', () => {
    test('空文字列は空文字列を返す', () => {
      expect(reverseString('')).toBe('');
    });

    test('1文字の文字列はそのまま返す', () => {
      expect(reverseString('a')).toBe('a');
    });

    test('2文字の文字列を反転する', () => {
      expect(reverseString('ab')).toBe('ba');
    });

    test('回文は同じ文字列を返す', () => {
      expect(reverseString('level')).toBe('level');
    });
  });

  describe('エラー処理', () => {
    test('null を渡すと TypeError を投げる', () => {
      expect(() => reverseString(null)).toThrow(TypeError);
    });

    test('undefined を渡すと TypeError を投げる', () => {
      expect(() => reverseString(undefined)).toThrow(TypeError);
    });

    test('数値を渡すと TypeError を投げる', () => {
      expect(() => reverseString(123)).toThrow(TypeError);
    });
  });
});
