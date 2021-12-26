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
});
