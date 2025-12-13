/**************************************************
** GAME KEYBOARD CLASS
**************************************************/
	var Keys = function() {
	this.up = false
	this.left = false;
	this.right = false;
	this.down = false;
	this.space = false;
	this.r = false;
	this.n = false;

	this.onKeyDown = function(e) {
		switch (e.keyCode) {
			// Controls
			case 37:
			case 65: // Left
				this.left = true;
				break;
			case 38:
			case 87: // Up
				this.up = true;
				break;
			case 39:
			case 68: // Right
				this.right = true; // Will take priority over the left key
				break;
			case 40:
			case 83: // Down
				this.down = true;
				break;
			case 32: // Space
				this.space = true;
				break;
			case 82: // R
				this.r = true;
				break;
			case 78: // N (Nitro)
				this.n = true;
				break;
		};
	};

	this.onKeyUp = function(e) {
		var that = this,
			c = e.keyCode;
		switch (c) {
			case 37:
			case 65: // Left
				this.left = false;
				break;
			case 38:
			case 87: // Up
				this.up = false;
				break;
			case 39:
			case 68: // Right
				this.right = false;
				break;
			case 40:
			case 83: // Down
				this.down = false;
				break;
			case 32: // Space
				this.space = false;
				break;
			case 82: // R
				this.r = false;
				break;
			case 78: // N (Nitro)
				this.n = false;
				break;
		};
	};
}
