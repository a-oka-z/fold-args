'use strict'

function inspect(s) {
  return JSON.stringify( s, (k,v)=>typeof v === 'function' ? v.toString() : v, 2 );
}






const convert_to_object = (type,value)=>({ [Symbol.for(type)] : [value]});
const return_as_it_is   = (type,value)=>value;
const ignore            = (type,value)=>({});
const fold_args_map = (()=>{
  return {
    "boolean"   : convert_to_object,
    "number"    : convert_to_object,
    "bigint"    : convert_to_object,
    "string"    : convert_to_object,
    "symbol"    : convert_to_object,
    "function"  : convert_to_object,
    "object"    : return_as_it_is,

    "null"      : ignore,
    "undefined" : ignore,
    "default"   : ignore,
  };
})();

const SYSTEM_SYMBOL_LIST = [
  Symbol.for( "boolean"  ),
  Symbol.for( "number"   ),
  Symbol.for( "bigint"   ),
  Symbol.for( "string"   ),
  Symbol.for( "symbol"   ),
  Symbol.for( "function" ),
];;

const fold_args_check_type = (value)=>{
  if ( value === undefined ) {
    return 'undefined';
  } else if ( value === null  ) {
    return 'null';
  } else {
    return typeof value;
  }
};

const symbolicEntries = (o)=>
  Object.getOwnPropertySymbols(o).map(e=>[e,o[e]]);

const fold_args_proc = ( args, initial_object={})=>{
  if ( ! Array.isArray( args ) ) {
    args = [ args ];
  }
  if ( initial_object === null || initial_object === undefined ) {
    throw new TypeError( 'the parameter `initial_object` must be an object' );
  }
  if ( typeof initial_object !== 'object' ) {
    throw new TypeError( 'the parameter `initial_object` must be an object' );
  }

  return args.map((value)=>{
    const type   = fold_args_check_type( value );
    const result = fold_args_map[ type ](type,value) ?? fold_args_map['default'](type,value);
    return result;
  }).reduce((accumlator,e)=>{
    Object.entries( e ).concat(symbolicEntries(e)).forEach(([k,v])=>{
      const va = Array.isArray(v) ? v : [v];
      if ( k in accumlator ) {
        accumlator[k].push(...va);
      } else {
        accumlator[k] = [...va];
      }
    });
    return accumlator;
  },initial_object);
};

const SYM_STRING = Symbol.for('string');
const SYM_NUMBER = Symbol.for('number');
const SYM_SYMBOL = Symbol.for('symbol');

const fold_args = ( args, default_args=[], transformers_for_args=[])=>{
  // if ( ! Array.isArray( args ) ) {
  //   throw new TypeError( 'the parameter `args` must be an array object' );
  // }
  // if ( ! Array.isArray( default_args ) ) {
  //   throw new TypeError( 'the parameter `default_args` must be an array object' );
  // }
  // if ( ! Array.isArray( transformers_for_args ) ) {
  //   throw new TypeError( 'the parameter `transformers_for_args` must be an array object' );
  // }

  const parsed_default_args = fold_args_proc( default_args );
  const initial_object = { ...parsed_default_args };

  // console.error( parsed_default_args );
  {
    // Remove all system symbols;
    SYSTEM_SYMBOL_LIST.forEach( e=>delete initial_object[e] );

    [].concat(
      ( ( SYM_SYMBOL in parsed_default_args ) ? parsed_default_args[SYM_SYMBOL] : [] ),
      ( ( SYM_STRING in parsed_default_args ) ? parsed_default_args[SYM_STRING] : [] ),
      ( ( SYM_NUMBER in parsed_default_args ) ? parsed_default_args[SYM_NUMBER] : [] )).forEach(
        (e)=>{
          if ( e in initial_object ) {
            // initial_object[e] = initial_object[e];
          } else {
            initial_object[e] = [];
          }
        },
      );

    // Convert all non-array values into arrays.
    Object.getOwnPropertyNames( initial_object ).forEach( e=>{if ( ! Array.isArray( initial_object[e])) {initial_object[e] = [ initial_object[e] ]}});
  }


  // console.error( 'initial_object', initial_object );

  const transformers = fold_args_proc( transformers_for_args );

  Object.entries( transformers ).forEach(([k,v])=>{
    transformers[k] = v.pop();
    if ( typeof transformers[k]  !== 'function' ) {
      throw new TypeError( `the specified transformer ${k} is not a function but ${v}` );
    }
  });

  const result = fold_args_proc( args, initial_object );

  Object.entries( transformers ).forEach(([k,v])=>{
    if ( k in result ) {
      result[k] = v( result[k], result );
    } else {
      throw new TypeError( `a transformer was specified on ${k} but the field ${k} is missing on the object` );
    }
  });

  return result;
}

// See :
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
//
// > destructured property can have a default value. The default value is used
// > when the property is not present, or has value undefined. It is not used if
// > the property has value null.
//
// THEREFORE, THESE VALUES MUST BE `undefined` VALUES, NOT `null` !important.

const the_last  = (e)=>0<e.length ? e.pop()   : undefined;
const the_first = (e)=>0<e.length ? e.shift() : undefined;
const the_all   = (e)=>e;

// module.exports.fold_args = fold_args;
// module.exports.the_last  = the_last;
// module.exports.the_first = the_first;
// module.exports.the_all   = the_all;




//   default_args.forEach(e=>{
//     if ( e === null || e === undefined ) {
//       // ignore it
//     } else if ( typeof e === 'string' || typeof e === 'number' ) {
//       initial_object[e]=[];
//     } else if ( typeof e === 'object' ) {
//       if ( Array.isArray(e) ) {
//         throw new TypeError( `Setting Array objects as a default value specifier is not supported` );
//       } else {
//         Object.entries(e).forEach(([key,value])=>{
//           if ( (typeof key !== 'string') && (typeof key !== 'number') ) {
//             throw new TypeError( `the value for '${key}' must be an array object` );
//           }
//           if ( ! Array.isArray( value ) ) {
//             throw new TypeError( `the value for '${e.key}' must be an array object` );
//           }
//           initial_object[key]=value;
//         });
//       }
//     } else {
//       throw new TypeError( `found an unsupported typed value '${e}'` );
//     }
//   });



module.exports.fold_args = fold_args;
module.exports.the_last  = the_last;
module.exports.the_first = the_first;
module.exports.the_all   = the_all;