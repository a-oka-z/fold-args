
 fold-args
================================================================================

A named-argument parser which also defines a consistent protocol for JavaScript
functions.


 Synopsis
--------------------------------------------------------------------------------

```javascript
function fold_args( 
    args,                 // : array of arguments, 
    default_args,         // : array or an object, 
    transformers_for_args // : array or an object )
```

### If multiple arguments are specified, merge them to a single object ###

```javascript
const { fold_args } = require( 'fold-args' );
function func( ...args ) {
  const nargs = fold_args( args );
  console.log( nargs );
}

func( {foo:'FOO'}, {bar:'BAR'} );

> {foo:['FOO'], bar:['BAR']}

```

### It is able to specify a default set of names for named arguments ###

```javascript
const { fold_args } = require( 'fold-args' );
function func( ...args ) {
  const nargs = fold_args( args, ['foo','bar'] );
  console.log( nargs );
}

// note that foo and bar are not specified.
func( {bum:'bum'} ); 

// foo and bar are appeared, though. 
> {foo:[],bar:[],bum:['bum']}
```


### It is able to specify precedence for each arguments ###

```javascript
const { fold_args } = require( 'fold-args' );
const { the_last }  = require( 'fold-args' );

function func( ...args ) {
  const nargs = fold_args( args, [], [{ foo: the_last }] );
  console.log( nargs );
}

func( {foo:'foo'}, {foo:'FOO'} );

> {foo:'FOO'}
```

### Description ###

Each value in the arguments are processed in a same manner:

1. if it is not an array object, wrap it by an array object.
2. if it is not an object, convert it to an object as if it is processed by the following code:

```javascript
(o)=>( typeof o === 'object' ? o : {[Symbol.for(typeof o)] : o });
```

3. The all objects are merged into an object.
For example,  if there are two objects like

```javascript
const o1 = {
  'foo' : 1,
};
const o2 = {
  'bar' : 2,
},
```

The processed object is 
```javascript
const processed = {
  'foo' : [1],
  'bar' : [2],
};
```





