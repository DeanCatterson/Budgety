//Name:    Budgety JavaScript Application
//Author:  Dean Catterson
//Date:    19/11/2019


var budgetController = (function () {

	var Expense = function (id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function(totalIncome) {
		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function() {
		return this.percentage;
	}


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
		},
		budget: 0,
		percentage: -1
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


		deleteItem: function(type, id) {
			var ids, index;


			ids = data.allItems[type].map(function(current) {
				return current.id;
			});


			index = ids.indexOf(id);

			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}

		},


		calculateBudget: function() {
			//calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			//calculate budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;

			//calculate the percentage of income spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100); 
			} else {
				data.percentage = -1;
			}

		},


		calculatePercentages: function() {
			data.allItems.exp.forEach(function(cur) {
				cur.calcPercentage(data.totals.inc);
			});
		},


		getPercentages: function() {
			var allPercentages = data.allItems.exp
			.map(function(cur) {
				return cur.getPercentage();
			});
			return allPercentages;
		},


		getBudget: function() {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
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
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		percentageLabel: '.budget__expenses--percentage',
		container: '.container'
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
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = domStrings.expensesContainer;
				html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			//Replace placeholder tags with actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', obj.value);

			//Insert the html into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

		},


		deleteListItem: function(selectorId) {
			var el = document.getElementById(selectorId)
			el.parentNode.removeChild(el)
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

		displayBudget: function(obj) {
			document.querySelector(domStrings.budgetLabel).textContent = obj.budget;
			document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc;
			document.querySelector(domStrings.expensesLabel).textContent = obj.totalExp;

			if (obj.percentage > 0) {
				document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '---';
			}
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

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
	};


	var updateBudget = function () {
		//1. Calculate budget
		budgetCtrl.calculateBudget();

		//2. Return the budget
		var budget = budgetCtrl.getBudget();

		//3. Display budget on the UI
		uiCtrl.displayBudget(budget);
	};


	var updatePercentages = function() {

		//1. calculate percentages
		budgetCtrl.calculatePercentages();

		//2. read percentages from budget controller
		var percentages = budgetCtrl.getPercentages();

		//3. update ui with new percentages
		console.log('Percentages: ', percentages)

	};



	var ctrlAddItem = function () {

		var input, newItem;

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

			//6. Calculate & update percentages
			updatePercentages();
		}
	};


	var ctrlDeleteItem = function(event) {
		var itemId, splitId;

		itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
		// console.log('itemId: ', itemId);
		// console.log('hack: ', itemId = event.target.parentNode);
		// console.log('hack.id: ', itemId = event.target.parentNode.id);
		// console.log('hack: ', itemId = event.target);

		if (itemId) {
			splitId = itemId.split('-');
			type = splitId[0];
			Id = parseInt(splitId[1]);

			//1. delete item from data structure
			budgetCtrl.deleteItem(type, Id);

			//2. delete item from UI
			uiCtrl.deleteListItem(itemId);

			//3. update and show new budget
			updateBudget();

			//4. Calculate & update percentages
			updatePercentages();
		}

	};

	return {
		init: function () {
			console.log('Application has started.');
			uiCtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners();
		}
	}

})(budgetController, uiController);

appController.init();