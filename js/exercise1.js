class Menu {
	constructor (options = {}) {
		this.subMenuArrows = options.subMenuArrows;
		this.menuElement = document.createElement('ul');
		this.children = [];
	}

	add(item) {
		this.children.push(item);
	}

	appendTo(elem, level = 0, children = this.children) {
		if (!children || !children.length) return;

		const ul = document.createElement("ul");
		if (level === 0) {
			let classesMenu = ['menu', 'horizontal', 'ltr'];
			ul.classList.add(...classesMenu);	
		}

		for (const child of children) {
			const li = document.createElement("li");

			if (child.href) {
				const a = document.createElement('a');
				a.textContent = child.label;
				a.setAttribute('href', child.href);
				if (child.icon) {
					a.prepend(child.icon.img);
				}
				li.appendChild(a);
			} else {
				const span = document.createElement('span');
				span.textContent = child.label;
				if (level === 0) {
					span.classList.add("first-level");
				}
				if (child.icon) {
					span.prepend(child.icon.img);
				}
				li.appendChild(span);
			}

			let classes = [child.children.length > 0 ? 'with_child' : 'no_child' , 'all_off', this.subMenuArrows && child.children.length > 0 ? "with-arrow" : "no-arrow"];
			li.classList.add(...classes);

			if (child.children.length > 0) {
				this.appendTo(li, level+1, child.children);  

				const nearestSpan = li.querySelector('span');

				if (level > 0) {
					nearestSpan.addEventListener("mouseover", function (e) {
						const nearestUL = li.querySelectorAll(':scope > ul');
						if (nearestUL[0].classList.contains('open')) {
							nearestUL[0].classList.remove('open');
						} else {
							nearestUL[0].classList.add('open');
						}
					});
				}
			}

			if (child.action) {
				li.addEventListener("click", child.action);
			}

			li.addEventListener("mouseover", function () {
				if (li.classList.contains('with_child')) {
					li.classList.add('with_child_on');
					li.classList.remove('all_off');
				} else {
					li.classList.add('no_child_on');
					li.classList.remove('all_off');
				}
			});

			li.addEventListener("mouseout", function () {
				if (li.classList.contains('with_child')) {
					li.classList.remove('with_child_on');
					li.classList.add('all_off');
				} else {
					li.classList.remove('no_child_on');
					li.classList.add('all_off');
				}
			});

			ul.appendChild(li);
		}

		elem.appendChild(ul);
	}
}

class MenuItem {
	constructor (options = {}) {
		this.label = options.label;
		this.icon = options.icon ? options.icon : "";
		this.href = options.href;
		this.action = options.click;
		this.children = [];
	}

	add(item) {
		this.children.push(item);
	}
}

class Icon {
	constructor (file = "") {
		this.img = document.createElement("img");
		this.img.setAttribute('src', file);
	}
}

document.addEventListener('click', function (e) {
	const allUL = document.querySelectorAll('#mainNav ul');
	
	for (const simpleUL of allUL) {
		if (!e.composedPath().includes(document.querySelector('#mainNav'))) {
			simpleUL.classList.remove('open');
		} else {
			if (e.target !== simpleUL.parentNode.querySelector('span')) {
				simpleUL.classList.remove('open');
			} else {
				if (simpleUL.classList.contains('open')) {
					simpleUL.classList.remove('open');
				} else {
					simpleUL.classList.add('open');
				}
			}
		}
	}
})
