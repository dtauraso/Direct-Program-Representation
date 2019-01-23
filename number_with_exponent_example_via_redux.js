import { createStore } from 'redux'
import * as hcssm from './hierarchial_context_sensitive_state_machine.js'
import * as cf from './common_functions.js'


// each state has a case.  I can visit the same state at a different point in time and use the same function or use a different function(it can be similar or completely different).  The point is that the main idea of the processing(the current state) can be used for many different things(they have to be small things).  If the different things are too big, the (state, case) must be the name of another graph



var isMinus = (store, var_store) => {

	return cf.getChar(store, var_store) == '-'

}

var isX = (store, var_store) => {

	return cf.getChar(store, var_store) == 'x'

}
var isStar = (store, var_store) => {
	return cf.getChar(store, var_store) == '*'

}
var isExponent = (store, var_store) => {

	return cf.getChar(store, var_store) == '^'

}
var addExponent = (store, var_store) => {

	return true

}
var doesNothing = (store, var_store) => {
	return true
}





let parsing_checks2 = {
	'-' : [isMinus],
	'#' : [cf.isDigit],
	'x' : [isX],
	'exponent' : [isExponent],
	'number' : [doesNothing],
	'*' : [isStar]
}

let parents2 = {


	'number' : [{'root': '0'} ],
	'-' : [{'number': '0'}],
	'#' : [{}],
	'x' : [{}],
	'exponent' : [{}],
	'*' : [{}],
	'end_of#' : [{}],
	'end' : [{}]

}


var end = (store, var_store) => {

	let i = var_store['i']
	let input = var_store['input']
	//console.log(i, input.length)
	return i >= input.length
}
// this control graph uses string for states and number for case
let node_graph2_ = {

	'number' : 	{'next': [{'x':'0'}], 'children':[{'-': '0'}], 'functions':[doesNothing]},
	'x' : 		{'next': [{'exponent':'0', '*':'0'}], 'children':[{}], 'functions':[cf.parseChar]},
	'exponent' :  {'next': [{'number':'0'}], 'children':[{}], 'functions':[cf.parseChar]},
	'*' : 			{'next': [{'end':'0'}], 'children':[{}], 'functions':[cf.parseChar]},

	// parses the number
	'-' : 	{'next': [{'#':'0'}], 'children':[{}], 'functions':[cf.parseChar]},
	'#'  : 		{'next': [{'#':'0', 'end_of#':'0'}], 'children':[{}], 'functions':[cf.parseChar]},
	'end_of#': 		{'next':[{}], 'children': [{}], 'functions' : [cf.isNotDigit]},
	'end' : {'next': [{}], 'children':[{}], 'functions':[end]}

}


var state_machine = {
	'parents': parents2,
	'i' : 0,
	'j' : [],
	'input' : '-6876543x^-7x*',
	'node_graph2' : node_graph2_,

	'count' : 0,

	'parsing_checks' : parsing_checks2,
    action_succeded: false,


}


var nodeReducer3 = (state = {state_machine}, action) => {

    //console.log("got here", action.type, action)
    // set this false when the item enteres
    return hcssm.universalReducer(state, action, state.state_machine)

}



var recursive_reducer = createStore(nodeReducer3)
hcssm.visitRedux(['number', '0'], recursive_reducer, state_machine, 0)
console.log('done w machine')
