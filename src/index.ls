require! './libs/ngram': ngram
require! './libs/base85': base85
require! './libs/snowflake': snowflake

export
  ngram: ngram.main
  base85:
    encode: base85.encode
    decode: base85.decode
  snowflake: snowflake.generator
