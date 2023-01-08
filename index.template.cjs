params: body
'use strict'

function inspect(s) {
  return JSON.stringify( s, (k,v)=>typeof v === 'function' ? v.toString() : v, 2 );
}





<%=body %>


module.exports.fold_args = fold_args;
module.exports.the_last  = the_last;
module.exports.the_first = the_first;
module.exports.the_all   = the_all;

