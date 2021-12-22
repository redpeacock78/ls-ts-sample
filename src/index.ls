require! './libs/ngram': ngram
require! './libs/base85': base85

export
  ngram: ngram.main
  base85:
    encode: base85.encode
    decode: base85.decode
