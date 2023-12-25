
 fold-args
================================================================================
`fold-args` is a multi-purpose named-arguments parser with a consistent robust
protocol.

 Synopsis
--------------------------------------------------------------------------------
The main funciton of `fold-args` is `fold_args()` function.


```javascript
function fold_args(
    args,                 // : array of arguments,
    default_args,         // : array or an object,
    transformers_for_args // : array or an object )
```

The function `fold_args()` is designed to parse passed arguments.

Sometime you may want to write a function such as:

```javascript
var result = set_user_info({
  username : 'B_B_King',
  age      :  30,
  comment  : 'foobar',
});
```

And you may implement the function as following:

```javascript
function set_user_info({
  username=null,
  age=null,
  comment=null,
}) {
  const user = get_user( usename );
  user.set_info( age, comment );
  user.commit();
}
```

In such case, `fold-args` may allow you to define functions in a flexable way.

For example, `fold-args` allows you to define functions take multiple arguments.

Usually such functions with named-arguments takes only the first argument.

```javascript
// This may not work.
set_user_info( { age: 30 },  { username: 'B_B_King' } );
```

The main functionality of `fold_args()` function is merging all objects specified in
arguments.


```javascript
function set_user_info(...nargs) {
  // process arguments by `fold_args()` function
  const {
    username=null,
    age=null,
    comment=null,
  } = fold_args( nargs );
  const user = get_user( usename );
  user.set_info( age, comment );
  user.commit();
}

// This works
set_user_info( { age: 30 },  { username: 'B_B_King' } );
```

There are some other functionalities which may help to implement flexable
argument parsing.


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

 History
--------------------------------------------------------------------------------
#### v1.0.0 ####
Relased.
(Jan 8 2023)

#### v1.0.1 ####
Updated `README.md`.
(Jan 8 2023)

#### v1.0.2 ####
Updated `README.md`.
(Sun, 08 Jan 2023 17:01:38 +0900)


 Conclusion
--------------------------------------------------------------------------------
Thank you very much for your attention.

[Atsushi Oka][] / I'm from Tokyo. For further information, see my github account.

[Github Repository of `fold-args`](Github)

[Github]: https://github.com/a-oka-z/fold-args
[Atsushi Oka]: https://github.com/a-oka-z/

[]: <> ( vim: set ts=2 sw=2: )
