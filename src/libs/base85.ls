export encode = ->
  bit = [...it].map ->
    it |> Number |>-> it.toString 2 |> -> it.padStart 8,\0 
  .join ''
  n = 32
  mod = bit.length % n
  padding-bit = bit
  if mod != 0
    for i from 0 til n - mod
      padding-bit = "#{padding-bit}00"
  base = new RegExp ".{#{n}}",\g |> padding-bit.match |> -> it.map ->
    con = 85
    dec = it |> -> parseInt it,2
    a = dec % con
    b = ((dec - a) / con) % con
    c = ((dec - (a + b * con)) / con ** 2) % con
    d = ((dec - (a + b * con + c * con ** 2)) / con ** 3) % con
    e = ((dec - (a + b * con + c * con ** 2 + d * con ** 3)) / con ** 4) % con
    [e, d, c, b, a]
  result = base.flat!.map ->
    it + 33 |> String.fromCharCode
  .join '' |> -> it.replace /!!!!!/g,\z
  "<~#{result}~>"

export decode = ->
  if it.match /^<~/ || it.match /~>$/
    replaced = it.replace /^<~/g,'' .replace /~>$/g,'' .replace /z/g,'!!!!!'
    n = 5
    mod = replaced.length % n
    diff = n - mod
    replaced-arr
    if mod == 0
      replaced-arr = replaced.match /.{5}/g
    else
      padd-replaced = replaced
      for i from 0 til diff
        padd-replaced = "#{padd-replaced}u"
      replaced-arr = padd-replaced.match /.{5}/g
    ascii-arr = replaced-arr.map ->
      it.match /./g
        .map (i,n) -> ((i.charCodeAt 0) - 33) * 85 ** (4 - n)
        .reduce (s,e) -> s + e
        .toString 2
        .padStart 32,\0
        .match /.{8}/g
        .map -> parseInt it,2
    .flat!
    if mod != 0
      for i from 0 til diff
        ascii-arr.pop!
    new Uint8Array ascii-arr
  else
    throw new Error 'base86: invalid input'