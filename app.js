//Name:    Budgety JavaScript Application
//Author:  Dean Catterson
//Date:    19/11/2019


var budgetController = (function () {

	var Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		}
	};

	return {
		addItem: function(type, des, val) {
			var newItem, ID;

			//Create new ID
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
 
			} else {
				ID = 0;
			}


			//Create new item based on inc or exp type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);

			}

			//Push it into our data structure
			data.allItems[type].push(newItem);

			//Return the element
			return newItem;
		},

		testing: function() {
			console.log(data);
		}
	};

})();

var uiController = (function () {

	var domStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn'
	}

	return {
		getInput: function () {
			return {
				type: document.querySelector(domStrings.inputType).value, //Will be either inc or exp
				description: document.querySelector(domStrings.inputDescription).value,
				value: document.querySelector(domStrings.inputValue).value
			};
		},

		getdomStrings: function () {
			return domStrings;
		}
	};

	//TODO

})();

//Global App Controller
var appController = (function (budgetCtrl, uiCtrl) {

	var setupEventListeners = function () {
		var DOM = uiCtrl.getdomStrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

		document.addEventListener('keypress', function (event) {
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});
	};




	var ctrlAddItem = function () {

		var input, newItem;

		//TODO

		//1. Get filed input data
		input = uiCtrl.getInput();

		//2. Add item to the budget controller
		newItem = budgetCtrl.addItem(input.type, input.description, input.value);


		//3. Add new item to UI

		//4. Calculate budget

		//5. Display budget on the UI

		console.log('IT works')
	}

	return {
		init: function () {
			console.log('Application has started.');
			setupEventListeners();
		}
	}

})(budgetController, uiController);

appController.init();