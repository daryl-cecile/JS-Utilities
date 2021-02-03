/**
 * Performs a deep clone on the source object, taking care of circular references.
 *
 * @param {object} sourceObj - The object to be cloned
 * @return {object} A clone of the source object
 *
 */
export function cloneObject(sourceObj) {
	const CLONE_KEY = Symbol("$$_clone_identifier");
	let clonedStubs = {};
	let toClean = [];

	function innerClone(obj) {
		let ret = { ...obj };
		
		if ( !(typeof obj === "object" && obj !== null) && !Array.isArray(obj) ) return obj;
			
		if ( obj.hasOwnProperty(CLONE_KEY) && clonedStubs.hasOwnProperty(obj[CLONE_KEY]) ){
			return clonedStubs[obj[CLONE_KEY]];
		}
		
		if ( typeof obj === "object" && obj !== null && !obj.hasOwnProperty(CLONE_KEY) ){
			obj[CLONE_KEY] = GenIdentifier('xxxx-xxxx-xxxx-xxxx-xxxx');
			toClean.push(obj);
			clonedStubs[obj[CLONE_KEY]] = ret;
		}
		
		for ( var [key, value] of Object.entries(obj) ){
			if ( Array.isArray(value) ){
				ret[key] = value.map((v) => innerClone(v));
			} else if ( typeof value === "object" && value !== null ){
				ret[key] = innerClone(value);
			} else {
				ret[key] = value;
			}
		}
		return ret;
	}

	let final = innerClone(sourceObj);
	toClean.forEach((obj) => delete obj[CLONE_KEY]);
	return final;
}

/**
 * Creates a roughly unique ID using a provided pattern, where `x` is to be replaced by a letter or digit
 *
 * @param {object} sourceObj - The object to be cloned
 * @return {object} A clone of the source object
 *
 * @example
 *	GetIdentifier('xxxx-xxxx-xxxxxxxx-xxxx-xxxx');
 *
 */
export function GenIdentifier(pattern){
	let final = pattern;
  
	function mk(length){
		let chars = (Math.random() + 1).toString(36).substr(2, length);
		if (chars.length < length){
			chars += mk(length - chars.length);
  		}
    		return chars;
  	}
  
 	return final.replace(/[x]+/gm, function(r){
	    	return mk(r.length)
  	});
}
