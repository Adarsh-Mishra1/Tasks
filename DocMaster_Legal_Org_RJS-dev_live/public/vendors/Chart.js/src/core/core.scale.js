"use strict";

module.exports = function (Chart) {
	var helpers = Chart.helpers;

	Chart.defaults.scale = {
		display: true,
		position: "left",

		// grid line settings
		gridLines: {
			display: true,
			color: "rgba(0, 0, 0, 0.1)",
			lineWidth: 1,
			drawBorder: true,
			drawOnChartArea: true,
			drawTicks: true,
			tickMarkLength: 10,
			zeroLineWidth: 1,
			zeroLineColor: "rgba(0,0,0,0.25)",
			offsetGridLines: false,
		},

		// scale label
		scaleLabel: {
			// actual label
			labelString: "",

			// display property
			display: false,
		},

		// label settings
		ticks: {
			beginAtZero: false,
			minRotation: 0,
			maxRotation: 50,
			mirror: false,
			padding: 10,
			reverse: false,
			display: true,
			autoSkip: true,
			autoSkipPadding: 0,
			labelOffset: 0,
			callback: function (value) {
				return "" + value;
			},
		},
	};

	Chart.Scale = Chart.Element.extend({
		// These methods are ordered by lifecyle. Utilities then follow.
		// Any function defined here is inherited by all scale types.
		// Any function can be extended by the scale type

		beforeUpdate: function () {
			helpers.callCallback(this.options.beforeUpdate, [this]);
		},
		update: function (maxWidth, maxHeight, margins) {
			// Update Lifecycle - Probably don't want to ever extend or overwrite this function ;)
			this.beforeUpdate();

			// Absorb the master measurements
			this.maxWidth = maxWidth;
			this.maxHeight = maxHeight;
			this.margins = helpers.extend(
				{
					left: 0,
					right: 0,
					top: 0,
					bottom: 0,
				},
				margins,
			);

			// Dimensions
			this.beforeSetDimensions();
			this.setDimensions();
			this.afterSetDimensions();

			// Data min/max
			this.beforeDataLimits();
			this.determineDataLimits();
			this.afterDataLimits();

			// Ticks
			this.beforeBuildTicks();
			this.buildTicks();
			this.afterBuildTicks();

			this.beforeTickToLabelConversion();
			this.convertTicksToLabels();
			this.afterTickToLabelConversion();

			// Tick Rotation
			this.beforeCalculateTickRotation();
			this.calculateTickRotation();
			this.afterCalculateTickRotation();
			// Fit
			this.beforeFit();
			this.fit();
			this.afterFit();
			//
			this.afterUpdate();

			return this.minSize;
		},
		afterUpdate: function () {
			helpers.callCallback(this.options.afterUpdate, [this]);
		},

		//

		beforeSetDimensions: function () {
			helpers.callCallback(this.options.beforeSetDimensions, [this]);
		},
		setDimensions: function () {
			// Set the unconstrained dimension before label rotation
			if (this.isHorizontal()) {
				// Reset position before calculating rotation
				this.width = this.maxWidth;
				this.left = 0;
				this.right = this.width;
			} else {
				this.height = this.maxHeight;

				// Reset position before calculating rotation
				this.top = 0;
				this.bottom = this.height;
			}

			// Reset padding
			this.paddingLeft = 0;
			this.paddingTop = 0;
			this.paddingRight = 0;
			this.paddingBottom = 0;
		},
		afterSetDimensions: function () {
			helpers.callCallback(this.options.afterSetDimensions, [this]);
		},

		// Data limits
		beforeDataLimits: function () {
			helpers.callCallback(this.options.beforeDataLimits, [this]);
		},
		determineDataLimits: helpers.noop,
		afterDataLimits: function () {
			helpers.callCallback(this.options.afterDataLimits, [this]);
		},

		//
		beforeBuildTicks: function () {
			helpers.callCallback(this.options.beforeBuildTicks, [this]);
		},
		buildTicks: helpers.noop,
		afterBuildTicks: function () {
			helpers.callCallback(this.options.afterBuildTicks, [this]);
		},

		beforeTickToLabelConversion: function () {
			helpers.callCallback(this.options.beforeTickToLabelConversion, [
				this,
			]);
		},
		convertTicksToLabels: function () {
			// Convert ticks to strings
			this.ticks = this.ticks.map(function (numericalTick, index, ticks) {
				if (this.options.ticks.userCallback) {
					return this.options.ticks.userCallback(
						numericalTick,
						index,
						ticks,
					);
				}
				return this.options.ticks.callback(numericalTick, index, ticks);
			}, this);
		},
		afterTickToLabelConversion: function () {
			helpers.callCallback(this.options.afterTickToLabelConversion, [
				this,
			]);
		},

		//

		beforeCalculateTickRotation: function () {
			helpers.callCallback(this.options.beforeCalculateTickRotation, [
				this,
			]);
		},
		calculateTickRotation: function () {
			var context = this.ctx;
			var globalDefaults = Chart.defaults.global;
			var optionTicks = this.options.ticks;

			//Get the width of each grid by calculating the difference
			//between x offsets between 0 and 1.
			var tickFontSize = helpers.getValueOrDefault(
				optionTicks.fontSize,
				globalDefaults.defaultFontSize,
			);
			var tickFontStyle = helpers.getValueOrDefault(
				optionTicks.fontStyle,
				globalDefaults.defaultFontStyle,
			);
			var tickFontFamily = helpers.getValueOrDefault(
				optionTicks.fontFamily,
				globalDefaults.defaultFontFamily,
			);
			var tickLabelFont = helpers.fontString(
				tickFontSize,
				tickFontStyle,
				tickFontFamily,
			);
			context.font = tickLabelFont;

			var firstWidth = context.measureText(this.ticks[0]).width;
			var lastWidth = context.measureText(
				this.ticks[this.ticks.length - 1],
			).width;
			var firstRotated;

			this.labelRotation = optionTicks.minRotation || 0;
			this.paddingRight = 0;
			this.paddingLeft = 0;

			if (this.options.display) {
				if (this.isHorizontal()) {
					this.paddingRight = lastWidth / 2 + 3;
					this.paddingLeft = firstWidth / 2 + 3;

					if (!this.longestTextCache) {
						this.longestTextCache = {};
					}
					var originalLabelWidth = helpers.longestText(
						context,
						tickLabelFont,
						this.ticks,
						this.longestTextCache,
					);
					var labelWidth = originalLabelWidth;
					var cosRotation;
					var sinRotation;

					// Allow 3 pixels x2 padding either side for label readability
					// only the index matters for a dataset scale, but we want a consistent interface between scales
					var tickWidth =
						this.getPixelForTick(1) - this.getPixelForTick(0) - 6;

					//Max label rotation can be set or default to 90 - also act as a loop counter
					while (
						labelWidth > tickWidth &&
						this.labelRotation < optionTicks.maxRotation
					) {
						cosRotation = Math.cos(
							helpers.toRadians(this.labelRotation),
						);
						sinRotation = Math.sin(
							helpers.toRadians(this.labelRotation),
						);

						firstRotated = cosRotation * firstWidth;

						// We're right aligning the text now.
						if (
							firstRotated + tickFontSize / 2 >
							this.yLabelWidth
						) {
							this.paddingLeft = firstRotated + tickFontSize / 2;
						}

						this.paddingRight = tickFontSize / 2;

						if (sinRotation * originalLabelWidth > this.maxHeight) {
							// go back one step
							this.labelRotation--;
							break;
						}

						this.labelRotation++;
						labelWidth = cosRotation * originalLabelWidth;
					}
				}
			}

			if (this.margins) {
				this.paddingLeft = Math.max(
					this.paddingLeft - this.margins.left,
					0,
				);
				this.paddingRight = Math.max(
					this.paddingRight - this.margins.right,
					0,
				);
			}
		},
		afterCalculateTickRotation: function () {
			helpers.callCallback(this.options.afterCalculateTickRotation, [
				this,
			]);
		},

		//

		beforeFit: function () {
			helpers.callCallback(this.options.beforeFit, [this]);
		},
		fit: function () {
			// Reset
			var minSize = (this.minSize = {
				width: 0,
				height: 0,
			});

			var opts = this.options;
			var globalDefaults = Chart.defaults.global;
			var tickOpts = opts.ticks;
			var scaleLabelOpts = opts.scaleLabel;
			var display = opts.display;
			var isHorizontal = this.isHorizontal();

			var tickFontSize = helpers.getValueOrDefault(
				tickOpts.fontSize,
				globalDefaults.defaultFontSize,
			);
			var tickFontStyle = helpers.getValueOrDefault(
				tickOpts.fontStyle,
				globalDefaults.defaultFontStyle,
			);
			var tickFontFamily = helpers.getValueOrDefault(
				tickOpts.fontFamily,
				globalDefaults.defaultFontFamily,
			);
			var tickLabelFont = helpers.fontString(
				tickFontSize,
				tickFontStyle,
				tickFontFamily,
			);

			var scaleLabelFontSize = helpers.getValueOrDefault(
				scaleLabelOpts.fontSize,
				globalDefaults.defaultFontSize,
			);
			var scaleLabelFontStyle = helpers.getValueOrDefault(
				scaleLabelOpts.fontStyle,
				globalDefaults.defaultFontStyle,
			);
			var scaleLabelFontFamily = helpers.getValueOrDefault(
				scaleLabelOpts.fontFamily,
				globalDefaults.defaultFontFamily,
			);
			var scaleLabelFont = helpers.fontString(
				scaleLabelFontSize,
				scaleLabelFontStyle,
				scaleLabelFontFamily,
			);

			var tickMarkLength = opts.gridLines.tickMarkLength;

			// Width
			if (isHorizontal) {
				// subtract the margins to line up with the chartArea if we are a full width scale
				minSize.width = this.isFullWidth()
					? this.maxWidth - this.margins.left - this.margins.right
					: this.maxWidth;
			} else {
				minSize.width = display ? tickMarkLength : 0;
			}

			// height
			if (isHorizontal) {
				minSize.height = display ? tickMarkLength : 0;
			} else {
				minSize.height = this.maxHeight; // fill all the height
			}

			// Are we showing a title for the scale?
			if (scaleLabelOpts.display && display) {
				if (isHorizontal) {
					minSize.height += scaleLabelFontSize * 1.5;
				} else {
					minSize.width += scaleLabelFontSize * 1.5;
				}
			}

			if (tickOpts.display && display) {
				// Don't bother fitting the ticks if we are not showing them
				if (!this.longestTextCache) {
					this.longestTextCache = {};
				}

				var largestTextWidth = helpers.longestText(
					this.ctx,
					tickLabelFont,
					this.ticks,
					this.longestTextCache,
				);

				if (isHorizontal) {
					// A horizontal axis is more constrained by the height.
					this.longestLabelWidth = largestTextWidth;

					// TODO - improve this calculation
					var labelHeight =
						Math.sin(helpers.toRadians(this.labelRotation)) *
							this.longestLabelWidth +
						1.5 * tickFontSize;

					minSize.height = Math.min(
						this.maxHeight,
						minSize.height + labelHeight,
					);
					this.ctx.font = tickLabelFont;

					var firstLabelWidth = this.ctx.measureText(
						this.ticks[0],
					).width;
					var lastLabelWidth = this.ctx.measureText(
						this.ticks[this.ticks.length - 1],
					).width;

					// Ensure that our ticks are always inside the canvas. When rotated, ticks are right aligned which means that the right padding is dominated
					// by the font height
					var cosRotation = Math.cos(
						helpers.toRadians(this.labelRotation),
					);
					var sinRotation = Math.sin(
						helpers.toRadians(this.labelRotation),
					);
					this.paddingLeft =
						this.labelRotation !== 0
							? cosRotation * firstLabelWidth + 3
							: firstLabelWidth / 2 + 3; // add 3 px to move away from canvas edges
					this.paddingRight =
						this.labelRotation !== 0
							? sinRotation * (tickFontSize / 2) + 3
							: lastLabelWidth / 2 + 3; // when rotated
				} else {
					// A vertical axis is more constrained by the width. Labels are the dominant factor here, so get that length first
					var maxLabelWidth = this.maxWidth - minSize.width;

					// Account for padding
					var mirror = tickOpts.mirror;
					if (!mirror) {
						largestTextWidth += this.options.ticks.padding;
					} else {
						// If mirrored text is on the inside so don't expand
						largestTextWidth = 0;
					}

					if (largestTextWidth < maxLabelWidth) {
						// We don't need all the room
						minSize.width += largestTextWidth;
					} else {
						// Expand to max size
						minSize.width = this.maxWidth;
					}

					this.paddingTop = tickFontSize / 2;
					this.paddingBottom = tickFontSize / 2;
				}
			}

			if (this.margins) {
				this.paddingLeft = Math.max(
					this.paddingLeft - this.margins.left,
					0,
				);
				this.paddingTop = Math.max(
					this.paddingTop - this.margins.top,
					0,
				);
				this.paddingRight = Math.max(
					this.paddingRight - this.margins.right,
					0,
				);
				this.paddingBottom = Math.max(
					this.paddingBottom - this.margins.bottom,
					0,
				);
			}

			this.width = minSize.width;
			this.height = minSize.height;
		},
		afterFit: function () {
			helpers.callCallback(this.options.afterFit, [this]);
		},

		// Shared Methods
		isHorizontal: function () {
			return (
				this.options.position === "top" ||
				this.options.position === "bottom"
			);
		},
		isFullWidth: function () {
			return this.options.fullWidth;
		},

		// Get the correct value. NaN bad inputs, If the value type is object get the x or y based on whether we are horizontal or not
		getRightValue: function getRightValue(rawValue) {
			// Null and undefined values first
			if (rawValue === null || typeof rawValue === "undefined") {
				return NaN;
			}
			// isNaN(object) returns true, so make sure NaN is checking for a number
			if (typeof rawValue === "number" && isNaN(rawValue)) {
				return NaN;
			}
			// If it is in fact an object, dive in one more level
			if (typeof rawValue === "object") {
				if (rawValue instanceof Date || rawValue.isValid) {
					return rawValue;
				} else {
					return getRightValue(
						this.isHorizontal() ? rawValue.x : rawValue.y,
					);
				}
			}

			// Value is good, return it
			return rawValue;
		},

		// Used to get the value to display in the tooltip for the data at the given index
		// function getLabelForIndex(index, datasetIndex)
		getLabelForIndex: helpers.noop,

		// Used to get data value locations.  Value can either be an index or a numerical value
		getPixelForValue: helpers.noop,

		// Used to get the data value from a given pixel. This is the inverse of getPixelForValue
		getValueForPixel: helpers.noop,

		// Used for tick location, should
		getPixelForTick: function (index, includeOffset) {
			if (this.isHorizontal()) {
				var innerWidth =
					this.width - (this.paddingLeft + this.paddingRight);
				var tickWidth =
					innerWidth /
					Math.max(
						this.ticks.length -
							(this.options.gridLines.offsetGridLines ? 0 : 1),
						1,
					);
				var pixel = tickWidth * index + this.paddingLeft;

				if (includeOffset) {
					pixel += tickWidth / 2;
				}

				var finalVal = this.left + Math.round(pixel);
				finalVal += this.isFullWidth() ? this.margins.left : 0;
				return finalVal;
			} else {
				var innerHeight =
					this.height - (this.paddingTop + this.paddingBottom);
				return (
					this.top + index * (innerHeight / (this.ticks.length - 1))
				);
			}
		},

		// Utility for getting the pixel location of a percentage of scale
		getPixelForDecimal: function (decimal /*, includeOffset*/) {
			if (this.isHorizontal()) {
				var innerWidth =
					this.width - (this.paddingLeft + this.paddingRight);
				var valueOffset = innerWidth * decimal + this.paddingLeft;

				var finalVal = this.left + Math.round(valueOffset);
				finalVal += this.isFullWidth() ? this.margins.left : 0;
				return finalVal;
			} else {
				return this.top + decimal * this.height;
			}
		},

		getBasePixel: function () {
			var me = this;
			var min = me.min;
			var max = me.max;

			return me.getPixelForValue(
				me.beginAtZero
					? 0
					: min < 0 && max < 0
						? max
						: min > 0 && max > 0
							? min
							: 0,
			);
		},

		// Actualy draw the scale on the canvas
		// @param {rectangle} chartArea : the area of the chart to draw full grid lines on
		draw: function (chartArea) {
			var options = this.options;
			if (!options.display) {
				return;
			}

			var context = this.ctx;
			var globalDefaults = Chart.defaults.global;
			var optionTicks = options.ticks;
			var gridLines = options.gridLines;
			var scaleLabel = options.scaleLabel;

			var setContextLineSettings;
			var isRotated = this.labelRotation !== 0;
			var skipRatio;
			var scaleLabelX;
			var scaleLabelY;
			var useAutoskipper = optionTicks.autoSkip;

			// figure out the maximum number of gridlines to show
			var maxTicks;
			if (optionTicks.maxTicksLimit) {
				maxTicks = optionTicks.maxTicksLimit;
			}

			var tickFontColor = helpers.getValueOrDefault(
				optionTicks.fontColor,
				globalDefaults.defaultFontColor,
			);
			var tickFontSize = helpers.getValueOrDefault(
				optionTicks.fontSize,
				globalDefaults.defaultFontSize,
			);
			var tickFontStyle = helpers.getValueOrDefault(
				optionTicks.fontStyle,
				globalDefaults.defaultFontStyle,
			);
			var tickFontFamily = helpers.getValueOrDefault(
				optionTicks.fontFamily,
				globalDefaults.defaultFontFamily,
			);
			var tickLabelFont = helpers.fontString(
				tickFontSize,
				tickFontStyle,
				tickFontFamily,
			);
			var tl = gridLines.tickMarkLength;

			var scaleLabelFontColor = helpers.getValueOrDefault(
				scaleLabel.fontColor,
				globalDefaults.defaultFontColor,
			);
			var scaleLabelFontSize = helpers.getValueOrDefault(
				scaleLabel.fontSize,
				globalDefaults.defaultFontSize,
			);
			var scaleLabelFontStyle = helpers.getValueOrDefault(
				scaleLabel.fontStyle,
				globalDefaults.defaultFontStyle,
			);
			var scaleLabelFontFamily = helpers.getValueOrDefault(
				scaleLabel.fontFamily,
				globalDefaults.defaultFontFamily,
			);
			var scaleLabelFont = helpers.fontString(
				scaleLabelFontSize,
				scaleLabelFontStyle,
				scaleLabelFontFamily,
			);

			var labelRotationRadians = helpers.toRadians(this.labelRotation);
			var cosRotation = Math.cos(labelRotationRadians);
			var sinRotation = Math.sin(labelRotationRadians);
			var longestRotatedLabel = this.longestLabelWidth * cosRotation;
			var rotatedLabelHeight = tickFontSize * sinRotation;

			// Make sure we draw text in the correct color and font
			context.fillStyle = tickFontColor;

			if (this.isHorizontal()) {
				setContextLineSettings = true;
				var yTickStart =
					options.position === "bottom" ? this.top : this.bottom - tl;
				var yTickEnd =
					options.position === "bottom" ? this.top + tl : this.bottom;
				skipRatio = false;

				// Only calculate the skip ratio with the half width of longestRotateLabel if we got an actual rotation
				// See #2584
				if (isRotated) {
					longestRotatedLabel /= 2;
				}

				if (
					(longestRotatedLabel + optionTicks.autoSkipPadding) *
						this.ticks.length >
					this.width - (this.paddingLeft + this.paddingRight)
				) {
					skipRatio =
						1 +
						Math.floor(
							((longestRotatedLabel +
								optionTicks.autoSkipPadding) *
								this.ticks.length) /
								(this.width -
									(this.paddingLeft + this.paddingRight)),
						);
				}

				// if they defined a max number of optionTicks,
				// increase skipRatio until that number is met
				if (maxTicks && this.ticks.length > maxTicks) {
					while (
						!skipRatio ||
						this.ticks.length / (skipRatio || 1) > maxTicks
					) {
						if (!skipRatio) {
							skipRatio = 1;
						}
						skipRatio += 1;
					}
				}

				if (!useAutoskipper) {
					skipRatio = false;
				}

				helpers.each(
					this.ticks,
					function (label, index) {
						// Blank optionTicks
						var isLastTick = this.ticks.length === index + 1;

						// Since we always show the last tick,we need may need to hide the last shown one before
						var shouldSkip =
							(skipRatio > 1 && index % skipRatio > 0) ||
							(index % skipRatio === 0 &&
								index + skipRatio >= this.ticks.length);
						if (
							(shouldSkip && !isLastTick) ||
							label === undefined ||
							label === null
						) {
							return;
						}
						var xLineValue = this.getPixelForTick(index); // xvalues for grid lines
						var xLabelValue = this.getPixelForTick(
							index,
							gridLines.offsetGridLines,
						); // x values for optionTicks (need to consider offsetLabel option)

						if (gridLines.display) {
							if (
								index ===
								(typeof this.zeroLineIndex !== "undefined"
									? this.zeroLineIndex
									: 0)
							) {
								// Draw the first index specially
								context.lineWidth = gridLines.zeroLineWidth;
								context.strokeStyle = gridLines.zeroLineColor;
								setContextLineSettings = true; // reset next time
							} else if (setContextLineSettings) {
								context.lineWidth = gridLines.lineWidth;
								context.strokeStyle = gridLines.color;
								setContextLineSettings = false;
							}

							xLineValue += helpers.aliasPixel(context.lineWidth);

							// Draw the label area
							context.beginPath();

							if (gridLines.drawTicks) {
								context.moveTo(xLineValue, yTickStart);
								context.lineTo(xLineValue, yTickEnd);
							}

							// Draw the chart area
							if (gridLines.drawOnChartArea) {
								context.moveTo(xLineValue, chartArea.top);
								context.lineTo(xLineValue, chartArea.bottom);
							}

							// Need to stroke in the loop because we are potentially changing line widths & colours
							context.stroke();
						}

						if (optionTicks.display) {
							context.save();
							context.translate(
								xLabelValue + optionTicks.labelOffset,
								isRotated
									? this.top + 12
									: options.position === "top"
										? this.bottom - tl
										: this.top + tl,
							);
							context.rotate(labelRotationRadians * -1);
							context.font = tickLabelFont;
							context.textAlign = isRotated ? "right" : "center";
							context.textBaseline = isRotated
								? "middle"
								: options.position === "top"
									? "bottom"
									: "top";
							context.fillText(label, 0, 0);
							context.restore();
						}
					},
					this,
				);

				if (scaleLabel.display) {
					// Draw the scale label
					context.textAlign = "center";
					context.textBaseline = "middle";
					context.fillStyle = scaleLabelFontColor; // render in correct colour
					context.font = scaleLabelFont;

					scaleLabelX = this.left + (this.right - this.left) / 2; // midpoint of the width
					scaleLabelY =
						options.position === "bottom"
							? this.bottom - scaleLabelFontSize / 2
							: this.top + scaleLabelFontSize / 2;

					context.fillText(
						scaleLabel.labelString,
						scaleLabelX,
						scaleLabelY,
					);
				}
			} else {
				setContextLineSettings = true;
				var xTickStart =
					options.position === "right" ? this.left : this.right - 5;
				var xTickEnd =
					options.position === "right" ? this.left + 5 : this.right;

				helpers.each(
					this.ticks,
					function (label, index) {
						// If the callback returned a null or undefined value, do not draw this line
						if (label === undefined || label === null) {
							return;
						}

						var yLineValue = this.getPixelForTick(index); // xvalues for grid lines

						if (gridLines.display) {
							if (
								index ===
								(typeof this.zeroLineIndex !== "undefined"
									? this.zeroLineIndex
									: 0)
							) {
								// Draw the first index specially
								context.lineWidth = gridLines.zeroLineWidth;
								context.strokeStyle = gridLines.zeroLineColor;
								setContextLineSettings = true; // reset next time
							} else if (setContextLineSettings) {
								context.lineWidth = gridLines.lineWidth;
								context.strokeStyle = gridLines.color;
								setContextLineSettings = false;
							}

							yLineValue += helpers.aliasPixel(context.lineWidth);

							// Draw the label area
							context.beginPath();

							if (gridLines.drawTicks) {
								context.moveTo(xTickStart, yLineValue);
								context.lineTo(xTickEnd, yLineValue);
							}

							// Draw the chart area
							if (gridLines.drawOnChartArea) {
								context.moveTo(chartArea.left, yLineValue);
								context.lineTo(chartArea.right, yLineValue);
							}

							// Need to stroke in the loop because we are potentially changing line widths & colours
							context.stroke();
						}

						if (optionTicks.display) {
							var xLabelValue;
							var yLabelValue = this.getPixelForTick(
								index,
								gridLines.offsetGridLines,
							); // x values for optionTicks (need to consider offsetLabel option)

							context.save();

							if (options.position === "left") {
								if (optionTicks.mirror) {
									xLabelValue =
										this.right + optionTicks.padding;
									context.textAlign = "left";
								} else {
									xLabelValue =
										this.right - optionTicks.padding;
									context.textAlign = "right";
								}
							} else {
								// right side
								if (optionTicks.mirror) {
									xLabelValue =
										this.left - optionTicks.padding;
									context.textAlign = "right";
								} else {
									xLabelValue =
										this.left + optionTicks.padding;
									context.textAlign = "left";
								}
							}

							context.translate(
								xLabelValue,
								yLabelValue + optionTicks.labelOffset,
							);
							context.rotate(labelRotationRadians * -1);
							context.font = tickLabelFont;
							context.textBaseline = "middle";
							context.fillText(label, 0, 0);
							context.restore();
						}
					},
					this,
				);

				if (scaleLabel.display) {
					// Draw the scale label
					scaleLabelX =
						options.position === "left"
							? this.left + scaleLabelFontSize / 2
							: this.right - scaleLabelFontSize / 2;
					scaleLabelY = this.top + (this.bottom - this.top) / 2;
					var rotation =
						options.position === "left"
							? -0.5 * Math.PI
							: 0.5 * Math.PI;

					context.save();
					context.translate(scaleLabelX, scaleLabelY);
					context.rotate(rotation);
					context.textAlign = "center";
					context.fillStyle = scaleLabelFontColor; // render in correct colour
					context.font = scaleLabelFont;
					context.textBaseline = "middle";
					context.fillText(scaleLabel.labelString, 0, 0);
					context.restore();
				}
			}

			if (gridLines.drawBorder) {
				// Draw the line at the edge of the axis
				context.lineWidth = gridLines.lineWidth;
				context.strokeStyle = gridLines.color;
				var x1 = this.left,
					x2 = this.right,
					y1 = this.top,
					y2 = this.bottom;

				var aliasPixel = helpers.aliasPixel(context.lineWidth);
				if (this.isHorizontal()) {
					y1 = y2 =
						options.position === "top" ? this.bottom : this.top;
					y1 += aliasPixel;
					y2 += aliasPixel;
				} else {
					x1 = x2 =
						options.position === "left" ? this.right : this.left;
					x1 += aliasPixel;
					x2 += aliasPixel;
				}

				context.beginPath();
				context.moveTo(x1, y1);
				context.lineTo(x2, y2);
				context.stroke();
			}
		},
	});
};
