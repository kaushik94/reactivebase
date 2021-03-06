'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.DatePicker = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDates = require('react-dates');

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _ChannelManager = require('../middleware/ChannelManager.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var moment = require('moment');
var momentPropTypes = require('react-moment-proptypes');

var helper = require('../middleware/helper.js');

var DatePicker = exports.DatePicker = function (_Component) {
	_inherits(DatePicker, _Component);

	function DatePicker(props, context) {
		_classCallCheck(this, DatePicker);

		var _this = _possibleConstructorReturn(this, (DatePicker.__proto__ || Object.getPrototypeOf(DatePicker)).call(this, props));

		_this.state = {
			currentValue: _this.props.date,
			focused: _this.props.focused
		};
		_this.type = 'range';
		_this.handleChange = _this.handleChange.bind(_this);
		_this.defaultQuery = _this.defaultQuery.bind(_this);
		return _this;
	}

	// Set query information


	_createClass(DatePicker, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			this.setQueryInfo();
		}

		// set the query type and input data

	}, {
		key: 'setQueryInfo',
		value: function setQueryInfo() {
			var obj = {
				key: this.props.sensorId,
				value: {
					queryType: this.type,
					inputData: this.props.appbaseField,
					defaultQuery: this.defaultQuery
				}
			};
			helper.selectedSensor.setSensorInfo(obj);
		}

		// build query for this sensor only

	}, {
		key: 'defaultQuery',
		value: function defaultQuery(value) {
			var query = null;
			if (value) {
				query = {
					'range': _defineProperty({}, this.props.appbaseField, {
						gte: value,
						lt: moment(value).add(1, 'days')
					})
				};
			}
			return query;
		}

		// use this only if want to create actuators
		// Create a channel which passes the depends and receive results whenever depends changes

	}, {
		key: 'createChannel',
		value: function createChannel() {
			var depends = this.props.depends ? this.props.depends : {};
			var channelObj = _ChannelManager.manager.create(this.context.appbaseRef, this.context.type, depends);
		}

		// handle the input change and pass the value inside sensor info

	}, {
		key: 'handleChange',
		value: function handleChange(inputVal) {
			this.setState({
				'currentValue': inputVal
			});
			var obj = {
				key: this.props.sensorId,
				value: inputVal
			};
			// pass the selected sensor value with sensorId as key,
			var isExecuteQuery = true;
			helper.selectedSensor.set(obj, isExecuteQuery);
		}

		// handle focus

	}, {
		key: 'handleFocus',
		value: function handleFocus(focus) {
			this.setState({
				focused: focus
			});
		}

		// allow all dates

	}, {
		key: 'allowAllDates',
		value: function allowAllDates() {
			var outsideObj = void 0;
			if (this.props.allowAllDates) {
				outsideObj = {
					isOutsideRange: isOutsideRange
				};
			}
			function isOutsideRange() {
				return false;
			}
			// isOutsideRange={() => false}
			return outsideObj;
		}

		// render

	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var title = null;
			if (this.props.title) {
				title = _react2.default.createElement(
					'h4',
					{ className: 'rbc-title col s12 col-xs-12' },
					this.props.title
				);
			}

			var cx = (0, _classnames2.default)({
				'rbc-title-active': this.props.title,
				'rbc-title-inactive': !this.props.title
			});
			return _react2.default.createElement(
				'div',
				{ className: 'rbc rbc-datepicker col s12 col-xs-12 card thumbnail ' + cx },
				title,
				_react2.default.createElement(
					'div',
					{ className: 'col s12 col-xs-12' },
					_react2.default.createElement(_reactDates.SingleDatePicker, _extends({
						id: this.props.sensorId,
						date: this.state.currentValue,
						placeholder: this.props.placeholder,
						focused: this.state.focused,
						numberOfMonths: this.props.numberOfMonths
					}, this.props.extra, this.allowAllDates(), {
						onDateChange: function onDateChange(date) {
							_this2.handleChange(date);
						},
						onFocusChange: function onFocusChange(_ref) {
							var focused = _ref.focused;
							_this2.handleFocus(focused);
						}
					}))
				)
			);
		}
	}]);

	return DatePicker;
}(_react.Component);

DatePicker.propTypes = {
	sensorId: _react2.default.PropTypes.string.isRequired,
	appbaseField: _react2.default.PropTypes.string,
	title: _react2.default.PropTypes.string,
	placeholder: _react2.default.PropTypes.string,
	date: momentPropTypes.momentObj,
	focused: _react2.default.PropTypes.bool,
	numberOfMonths: _react2.default.PropTypes.number,
	allowAllDates: _react2.default.PropTypes.bool,
	extra: _react2.default.PropTypes.any
};

// Default props value
DatePicker.defaultProps = {
	placeholder: 'Select Date',
	numberOfMonths: 1,
	focused: true,
	allowAllDates: true,
	date: null
};

// context type
DatePicker.contextTypes = {
	appbaseRef: _react2.default.PropTypes.any.isRequired,
	type: _react2.default.PropTypes.any.isRequired
};