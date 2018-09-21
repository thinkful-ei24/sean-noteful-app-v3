
const mongoose = require('mongoose');

// FIX... lots of duplicate code but this isn't a great abstractino

// accepts an array of required field names
// further args to the function are the names checked against the array
// ignores: extra fields that aren't required
// returns: an error stating one missing field that was found
// function validateInput(reqFields) {
//   const argLookup = new Set(arguments.slice(1));

//   reqFields.forEach(field => {
//     if(!argLookup.has(field)) {
//       const err = new Error(`Missing field '${field}' in req body`);
//       err.status = 400;
//       return err;
//     }
//   });
// }
