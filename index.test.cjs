'use strict';

const { fold_args, the_last, the_first, the_all } = require( './index.cjs' );

  


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
