params: body
'use strict';

function inspect(s) {
  return JSON.stringify( s, (k,v)=>typeof v === 'function' ? v.toString() : v, 2 );
}





<%=body%>

export {
  fold_args,
  the_last,
  the_first,
  the_all,
};

