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

	var calculateTotal = function(type) {
		var sum = 0;

		data.allItems[type].forEach(function(cur) {
			sum += cur.value;
		});
		data.totals[type] = sum;
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
		addItem: function (type, des, val) {
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

		calculateBudget: function() {
			//calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			//calculate budget: income - expenses

			//calculate the percentage of income spent

		},

		testing: function () {
			console.log(data);
		}
	};

})();

var uiController = (function () {

	var domStrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list'
	}

	return {
		getInput: function () {
			return {
				type: document.querySelector(domStrings.inputType).value, //Will be either inc or exp
				description: document.querySelector(domStrings.inputDescription).value,
				value: parseFloat(document.querySelector(domStrings.inputValue).value)
			};
		},

		addListItem: function (obj, type) {
			var html, newHtml, element;
			// Create html string with placeholder tags

			if (type === 'inc') {
				element = domStrings.incomeContainer;
				html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = domStrings.expensesContainer;
				html = '<div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			//Replace placeholder tags with actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			//Insert the html into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},

		clearFields: function () {
			var fields, fieldsArray;

			fields = document.querySelectorAll(domStrings.inputDescription + ', ' + domStrings.inputValue);

			fieldsArray = Array.prototype.slice.call(fields);

			fieldsArray.forEach(function (current, index, array) {
				current.value = "";
			});

			fieldsArray[0].focus();
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

	var updateBudget = function () {
		//1. Calculate budget

		//2. Return the budget

		//3. Display budget on the UI

	};



	var ctrlAddItem = function () {

		var input, newItem;

		//TODO

		//1. Get filed input data
		input = uiCtrl.getInput();

		if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
			//2. Add item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			//3. Add new item to UI
			uiCtrl.addListItem(newItem, input.type);

			//4. Clear the fields
			uiCtrl.clearFields();

			//5. Calculate & update budget
			updateBudget();

		}




	};

	return {
		init: function () {
			console.log('Application has started.');
			setupEventListeners();
		}
	}

})(budgetController, uiController);

appController.init();