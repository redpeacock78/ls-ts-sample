export main = ->
  len = [...it].length
  len+1 |> it.repeat |> -> new RegExp ".{#{len+1}}",'g' |> it.match
