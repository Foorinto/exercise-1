/**
 * Creation of the menu
 * @class Menu
 * @param {boolean} subMenuArrows Add arrows to submenu.
 * @param {array} children List menu of children.
 * @param {boolean} isActive State of the menu.
 * @param parentUL Dom Element parent of the menu.
 */

class Menu {
	constructor (options = {}) {
		this.subMenuArrows = options.subMenuArrows;
		this.children = [];
		this.isActive = false;
		this.parentUL = document.createElement("ul");
		let classesMenu = ['menu', 'horizontal', 'ltr'];
		this.parentUL.classList.add(...classesMenu);
	}

	// Add a child to the menu
	add(item) {
		this.children.push(item);
	}

	// Creation of the menu
	createTree(children) {	
		for (let child of children) {
			this.parentUL.appendChild(child.createElementItem(this.subMenuArrows));
		}

		return this.parentUL;
	}

	// Change class name (state hover) of the menu item
	toggleHoverClasses(elem) {
		if (elem.classList.contains('with_child')) {
			elem.classList.add('with_child_on');
		} else {
			elem.classList.add('no_child_on');
		}

		elem.classList.remove('all_off');
	}

	// Remove all menu items classes
	toggleOffAllClasses(level = 0) {
		let liInNav = this.navigation.querySelectorAll('li');

		for (const elem of liInNav) {
			if (elem.dataset.level >= level) {
				elem.classList.add('all_off');
				elem.classList.remove('no_child_on');
				elem.classList.remove('with_child_on');
			}
		};
	}

	// Create navigation and add it to the DOM
	appendTo(elem) {
		this.navigation = this.createTree(this.children);
		let liInNav = this.navigation.querySelectorAll('li');

		// Handle clas/states of the item on hover
		for (const elem of liInNav) {
			elem.addEventListener('mouseover', function(e) {
				e.stopPropagation();
				let levelLi = elem.dataset.level;
				if (this.isActive && elem.classList.contains('with_child')) {
					if (elem.dataset.level === "0" && elem.classList.contains('all_off')) {
						this.toggleOffAllClasses();
					} else if (elem.classList.contains('with_child_on') && elem.dataset.level > 0) {
						this.toggleOffAllClasses(parseInt(elem.dataset.level) + 1);
					}
					this.toggleHoverClasses(elem);
 				} else if (this.isActive && elem.classList.contains('no_child')) {
					this.toggleOffAllClasses(levelLi);
					this.toggleHoverClasses(elem);
				} 
			}.bind(this));
		}

		// Click outside navigation
		document.addEventListener('click', function(e) {
			let foundMenu = false;

			for (let elem of e.path) {
				if ((elem instanceof HTMLElement) && elem.classList.length > 0 && elem.classList.contains('menu')) {
					foundMenu = true;
					break;	
				}
			}

			if (this.isActive && foundMenu) {
				let liClicked = e.srcElement.closest('li');
				if (liClicked.classList.contains('no_child') && liClicked.classList.contains('no_child')) {
					this.toggleOffAllClasses();
					this.isActive = false;
					return;
				} else {
					return;
				}
			} else if (this.isActive && !foundMenu) {
				this.toggleOffAllClasses();
				this.isActive = false;
				return;
			} else if (foundMenu) {
				let elemClicked = e.srcElement;
				this.toggleHoverClasses(elemClicked.closest('li'));
				this.isActive = true;
				return
			}
		}.bind(this));

		elem.appendChild(this.navigation);
	}
}

/**
 * Creation of a menu item
 * @class MenuItem
 * @param {string} label Label of the item.
 * @param {Icon} icon Parent element menu.
 * @param {string} href Parent element menu.
 * @param {Function} action Parent element menu.
 * @param {Array} children List menu of children.
 */

class MenuItem extends Menu {
	constructor (options = {}) {
		super();
		this.label = options.label;
		this.icon = options.icon ? options.icon : "";
		this.href = options.href ? options.href : "";
		this.action = options.click ? options.click : "";
		this.children = [];
	}

	// Add new navigation item
	add(item) {
		this.children.push(item);
	}

	// Create a new menu item
	createElementItem(subMenuArrows, level = 0) {
		// Create LI element
		const li = document.createElement("li");

		// Add SPAN with action or A with href to LI element
		if (this.href) {
			const a = document.createElement('a');
			a.textContent = this.label;
			a.setAttribute('href', this.href);
			if (this.href.includes("http")) {
				a.setAttribute('target', '_blank');
			}
			if (this.icon) {
				a.prepend(this.icon.img);
			}
			li.appendChild(a);
		} else {
			const span = document.createElement('span');
			span.textContent = this.label;
			if (this.action) {
				span.addEventListener("click", this.action);
			}
			if (this.icon) {
				span.prepend(this.icon.img);
			}
			li.appendChild(span);
		}

		// Add classes and data attribute "level" to LI element
		let classes = [this.children.length > 0 ? 'with_child' : 'no_child' , 'all_off', subMenuArrows && this.children.length > 0 ? "with-arrow" : "no-arrow"];
		li.classList.add(...classes);
		li.dataset.level = level;


		// Create sub menu
		if (this.children.length > 0) {
			const ulSubMenu = document.createElement('ul');
			for (const child of this.children) {
				 let newElem = child.createElementItem(subMenuArrows, level + 1); 
				 ulSubMenu.appendChild(newElem);
			} 
			li.appendChild(ulSubMenu);
		}

		return li;
	}
}

/**
 * Creation of an IMG element
 * @class Icon
 * @param {string} src Path to image
 */

class Icon {
	constructor (file = "") {
		this.img = document.createElement("img");
		this.img.setAttribute('src', file);
	}
}
