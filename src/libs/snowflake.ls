export generator = ->*
  seq = 0 |> BigInt
  shiftLeftTime = 22 |> BigInt
  machine = (it |> BigInt) .<<. (12 |> BigInt)
  lastTime = Date.now! |> BigInt
  while true
    try
      seq++
      time = Date.now! |> BigInt
      shiftedTime = time .<<. shiftLeftTime
      if time == lastTime && seq >= (4096 |> BigInt)
        throw new Error 'Exceeded 4096 ids in 1 millisecond.'
      if time != lastTime 
        seq = 0 |> BigInt
      id = shiftedTime .|. machine .|. seq |> -> BigInt.asUintN 64,it
      lastTime = time
      yield id.toString!
    catch e
      yield new Error 'Failed to generate snowflake id.'
