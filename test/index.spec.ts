import * as util from 'util';
import * as now from 'jest-mock-now';
import * as main from '../src/index.ls';

describe('index', (): void => {
  describe('N-gram', (): void => {
    const str = '響け！ユーフォニアム';
    const result: string[] = main.ngram(str);
    test('Number of elements', (): void => {
      expect(result.length).toBe(str.length);
    });
    test('String length for each element', (): void => {
      result.map((i: string): void => expect(i.length).toBe(str.length + 1));
    });
    test('Type determination for each element', (): void => {
      result.map((i: string): void =>
        expect(typeof i === 'string').toBeTruthy()
      );
    });
  });
  describe('Base85', (): void => {
    describe('Encode', (): void => {
      test('Success', (): void => {
        const str: Uint8Array = new TextEncoder().encode('Dream Theater');
        const encode: string = main.base85.encode(str);
        expect(encode).toBe("<~6uljID'2ekART[lEW?(>~>");
      });
    });
    describe('Decode', (): void => {
      test('Success', (): void => {
        const str = '<~87cURD]i,"Ebo8=~>';
        const decode: string = new TextDecoder().decode(
          main.base85.decode(str)
        );
        expect(decode).toBe('Hello World.');
      });
      test('Failed', (): void => {
        try {
          const str = '87cURD]i,"Ebo8=';
          main.base85.decode(str);
        } catch (e) {
          expect(e).toEqual(Error('base86: invalid input'));
        }
      });
    });
  });
  describe('Snowflake', (): void => {
    const snowflake = main.snowflake(512);
    test('Ids are correctly sortable chronologically', (): void => {
      const list: bigint[] = [...Array(999).keys()].map((): bigint =>
        BigInt(snowflake.next().value)
      );
      expect(list).toEqual([...list].sort());
    });
    test('Ids can generate more than 4096 without failing and are still k-sortable', (): void => {
      const list: bigint[] = [...Array(4999).keys()].map((): bigint =>
        BigInt.asUintN(64, BigInt(snowflake.next().value) >> 22n)
      );
      util.inspect.defaultOptions.maxArrayLength = null;
      expect(list).toEqual([...list].sort());
    });
    test('Ids are always unique', (): void => {
      const list: string[] = [...Array(49999).keys()].map(
        (): string => snowflake.next().value
      );
      expect(new Set(list).size === list.length).toBeTruthy();
    });
    test('Ids throw an error if they generate >4096 in 1 millisecond', (): void => {
      now(new Date('2017-06-22'));
      for (let i = 0; i < 4096; i++) {
        snowflake.next().value;
      }
      expect(snowflake.next().value).toEqual(
        Error('Failed to generate snowflake id.')
      );
    });
  });
});
