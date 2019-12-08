 //Name:    Budgety JavaScript Application
 //Author:  Dean Catterson
 //Date:    19/11/2019


 var budgetController = (function() {

 	//TODO

 })();

 var uiController = (function() {

 	var domStrings = {
 		inputType: '.add__type',
 		inputDescription: '.add__description',
 		inputValue: '.add__value',
 		inputBtn: '.add__btn'
 	}

 	return {
 		getinput: function() {
 			return {
 				type: document.querySelector(domStrings.inputType).value, //Will be either inc or exp
 				description: document.querySelector(domStrings.inputDescription).value,
 				value: document.querySelector(domStrings.inputValue).value
 			};
 		},

 		getdomStrings: function() {
 			return domStrings;
 		}
 	};

 	//TODO

 })();

//Global App Controller
 var appController = (function(budgetCtrl, uiCtrl) {

 	var DOM = uiCtrl.getdomStrings();

  	var ctrlAddItem = function() {

 		//TODO

 		//1. Get filed input data
 		var input = uiCtrl.getinput();
 		console.log('Input: ', input);

 		//2. Add item to the budget controller

 		//3. Add new item to UI

 		//4. Calculate budget

 		//5. Display budget on the UI

 		console.log('IT works')
 	}

 	// document.querySelector(DOM.inputButton)
 	// .addEventListener('click', ctrlAddItem);
 	document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

 	document.addEventListener('keypress', function(event) {
 		if (event.keyCode === 13 || event.which === 13) {
 		ctrlAddItem();
 		}
 	});

 })(budgetController, uiController);