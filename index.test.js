
test("test1", ()=>{
  const o = fold_args( [{a:1}, {b:2}] );
  expect(o).toEqual({
    a:[1],b:[2]
  })
  console.error(o);
});

test("test2", ()=>{
  const o = fold_args( [{a:1}, {b:2}], [ 'c', 'd' ]  );
  expect(o).toEqual({
    a:[1],b:[2],c:[],d:[],
  })
  console.error(o);
});

test("test3", ()=>{
  const o = fold_args( {a:[1,2,3,4]}, {a:1,b:1}, { a:the_last, b:the_last });
  expect(o).toEqual({
    a:4,b:1
  })
  console.error(o);
});

test("test4", ()=>{
  const o = fold_args( [{a:1}, {b:2},{a:3}, {b:4},  ], [ 'c', 'd' ], [{ a:the_last, b:the_last}] );
  expect(o).toEqual({
    a:3,b:4,c:[],d:[],
  })
  console.error(o);
});


test("test5", ()=>{
  const o = fold_args( [{a:1}, {b:2},{a:3}, {b:4},  ], [ {'c': 'foo'  } , 'd' ], [{ a:the_last, b:the_last}] );
  expect(o).toEqual({
    a:3,b:4,c:['foo'],d:[],
  })
  console.error(o);
});


test("test6 default symbol ... 1 ", ()=>{
  const o = fold_args( [{a:1}], [ Symbol.for('sym'),'a','b' ], [] );
  console.error(o);
  expect(o).toEqual(
    {a:[1],b:[],[Symbol.for('sym')]:[]}
  )
  console.error(o);
});

test("test7 default symbol ... 2 ", ()=>{
  const o = fold_args( [{a:1}], [ Symbol.for('string'),'a','b' ], [] );
  console.error(o);
  expect(o).toEqual(
    {a:[1],b:[],[Symbol.for('string')]:[]}
  )
  console.error(o);
});

/*
 * Each named argument is aggregated into an array and the array is processed
 * by a corresponding transformer which is specified in transformers_for_args.
 * ADDED (Mon, 25 Dec 2023 17:19:15 +0900)
 */
test("test7 default value ... 2 ", ()=>{
  {
    const o = fold_args( [{a:5}], { a:[] } , {a:the_all } );
    console.error(o);
    expect(o).toEqual( {a:[]})
  }
  console.error(o);
});
