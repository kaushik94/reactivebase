'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _app = require('../app.js');

var _helper = require('../middleware/helper.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

require('./list.css');

var TextFieldDefault = function (_Component) {
	_inherits(TextFieldDefault, _Component);

	function TextFieldDefault(props) {
		_classCallCheck(this, TextFieldDefault);

		var _this = _possibleConstructorReturn(this, (TextFieldDefault.__proto__ || Object.getPrototypeOf(TextFieldDefault)).call(this, props));

		_this.onData = _this.onData.bind(_this);
		_this.nameQuery = _this.nameQuery.bind(_this);
		return _this;
	}

	_createClass(TextFieldDefault, [{
		key: 'componentDidMount',
		value: function componentDidMount() {
			(0, _helper.ResponsiveStory)();
		}
	}, {
		key: 'nameQuery',
		value: function nameQuery(value) {
			if (value) {
				return {
					match: {
						'cars.name': value
					}
				};
			} else return null;
		}
	}, {
		key: 'onData',
		value: function onData(res) {
			var _this2 = this;

			var result = void 0,
			    combineData = res.currentData;
			if (res.mode === 'historic') {
				combineData = res.currentData.concat(res.newData);
			}
			if (combineData) {
				result = combineData.map(function (markerData, index) {
					var marker = markerData._source;
					return _this2.itemMarkup(marker, markerData);
				});
			}
			return result;
		}
	}, {
		key: 'itemMarkup',
		value: function itemMarkup(marker, markerData) {
			return _react2.default.createElement(
				'a',
				{ className: 'full_row single-record single_record_for_clone',
					href: '#',
					key: markerData._id },
				_react2.default.createElement(
					'div',
					{ className: 'text-container full_row', style: { 'paddingLeft': '10px' } },
					_react2.default.createElement(
						'div',
						{ className: 'text-head text-overflow full_row' },
						_react2.default.createElement(
							'span',
							{ className: 'text-head-info text-overflow' },
							marker.name ? marker.name : '',
							' - ',
							marker.brand ? marker.brand : ''
						),
						_react2.default.createElement(
							'span',
							{ className: 'text-head-city' },
							marker.brand ? marker.brand : ''
						)
					),
					_react2.default.createElement(
						'div',
						{ className: 'text-description text-overflow full_row' },
						_react2.default.createElement(
							'ul',
							{ className: 'highlight_tags' },
							marker.price ? 'Priced at $' + marker.price : 'Free Test Drive'
						)
					)
				)
			);
		}
	}, {
		key: 'render',
		value: function render() {
			return _react2.default.createElement(
				_app.ReactiveBase,
				{
					appname: 'car-store',
					username: 'cf7QByt5e',
					password: 'd2d60548-82a9-43cc-8b40-93cbbe75c34c'
				},
				_react2.default.createElement(
					'div',
					{ className: 'row' },
					_react2.default.createElement(
						'div',
						{ className: 'col s6 col-xs-6' },
						_react2.default.createElement(_app.TextField, _extends({
							sensorId: 'NameTextSensor',
							appbaseField: this.props.mapping.name,
							title: 'Type a search string'
						}, this.props))
					),
					_react2.default.createElement(
						'div',
						{ className: 'col-xs-6' },
						_react2.default.createElement(_app.ResultList, {
							sensorId: 'SearchResult',
							appbaseField: this.props.mapping.name,
							title: 'Cars',
							from: 0,
							size: 20,
							onData: this.onData,
							depends: {
								NameTextSensor: { "operation": "must", defaultQuery: this.NameQuery }
							}
						})
					)
				)
			);
		}
	}]);

	return TextFieldDefault;
}(_react.Component);

exports.default = TextFieldDefault;


TextFieldDefault.defaultProps = {
	mapping: {
		name: 'name'
	}
};