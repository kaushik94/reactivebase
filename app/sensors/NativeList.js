import { default as React, Component } from 'react';
import { ItemCheckboxList } from './component/ItemCheckboxList.js';
import { ItemList } from './component/ItemList.js';
import classNames from 'classnames';
import { manager } from '../middleware/ChannelManager.js';
import { StaticSearch } from './component/StaticSearch.js';
var helper = require('../middleware/helper.js');

export class NativeList extends Component {
	constructor(props, context) {
		super(props);
		this.state = {
			items: [],
			storedItems: [],
			rawData: {
				hits: {
					hits: []
				}
			},
			defaultSelectAll: false
		};
		this.sortObj = {
			aggSort: this.props.sortBy
		};
		this.previousSelectedSensor = {};
		this.channelId = null;
		this.channelListener = null;
		this.defaultSelected = this.props.defaultSelected;
		this.handleSelect = this.handleSelect.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
		this.filterBySearch = this.filterBySearch.bind(this);
		this.selectAll = this.selectAll.bind(this);
		this.type = this.props.multipleSelect ? 'Terms' : 'Term';
		this.defaultQuery = this.defaultQuery.bind(this);
	}

	// Get the items from Appbase when component is mounted
	componentDidMount() {
		this.setQueryInfo();
		this.handleSelect('');
		this.createChannel();
	}

	// build query for this sensor only
	defaultQuery(value) {
		if(value) {
			let type = typeof value === 'object' ? 'terms' : 'term';
			return {
				[type]: {
					[this.props.appbaseField]: value
				}
			};
		}
	}

	componentWillUpdate() {
		setTimeout(() => {
			if (this.defaultSelected != this.props.defaultSelected) {
				this.defaultSelected = this.props.defaultSelected;
				let items = this.state.items;

				items = items.map((item) => {
					item.key = item.key.toString();
					item.status = this.defaultSelected && this.defaultSelected.indexOf(item.key) > -1 ? true : false;
					return item;
				});

				this.setState({
					items: items,
					storedItems: items
				});
				this.handleSelect(this.defaultSelected);
			}
			if (this.sortBy !== this.props.sortBy) {
				this.sortBy = this.props.sortBy;
				this.handleSortSelect();
			}
			if (this.size !== this.props.size) {
				this.size = this.props.size;
				this.removeChannel();
				this.createChannel();
			}
		}, 300);
	}

	// stop streaming request and remove listener when component will unmount
	componentWillUnmount() {
		this.removeChannel();
	}

	removeChannel() {
		if(this.channelId) {
			manager.stopStream(this.channelId);
		}
		if(this.channelListener) {
			this.channelListener.remove();
		}
	}

	// set the query type and input data
	setQueryInfo() {
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

	includeAggQuery() {
		var obj = {
			key: this.props.sensorId+'-sort',
			value: this.sortObj
		};
		helper.selectedSensor.setSortInfo(obj);
	}

	handleSortSelect() {
		this.sortObj = {
			aggSort: this.props.sortBy
		};
		let obj = {
			key: this.props.sensorId+'-sort',
			value: this.sortObj
		};
		helper.selectedSensor.set(obj, true, 'sortChange');
	}

	// Create a channel which passes the depends and receive results whenever depends changes
	createChannel() {
		// Set the depends - add self aggs query as well with depends
		let depends = this.props.depends ? this.props.depends : {};
		depends['aggs'] = {
			key: this.props.appbaseField,
			sort: this.props.sortBy,
			size: this.props.size,
			sortRef: this.props.sensorId+'-sort'
		};
		depends[this.props.sensorId+'-sort'] = {
			'operation': 'must'
		};
		this.includeAggQuery();
		// create a channel and listen the changes
		var channelObj = manager.create(this.context.appbaseRef, this.context.type, depends);
		this.channelId = channelObj.channelId;
		this.channelListener = channelObj.emitter.addListener(this.channelId, function(res) {
			let data = res.data;
			let rawData;
			if(res.mode === 'streaming') {
				rawData = this.state.rawData;
				rawData.hits.hits.push(res.data);
			} else if(res.mode === 'historic') {
				rawData = data;
			}
			this.setState({
				rawData: rawData
			});
			this.setData(rawData);
		}.bind(this));
	}

	setData(data) {
		if(data.aggregations && data.aggregations[this.props.appbaseField] && data.aggregations[this.props.appbaseField].buckets) {
			this.addItemsToList(data.aggregations[this.props.appbaseField].buckets);
		}
	}

	addItemsToList(newItems) {
		newItems = newItems.map((item) => {
			item.key = item.key.toString();
			item.status = this.defaultSelected && this.defaultSelected.indexOf(item.key) > -1 ? true : false;
			return item
		});
		this.setState({
			items: newItems,
			storedItems: newItems
		});
	}

	// Handler function when a value is selected
	handleSelect(value) {
		this.setValue(value, true)
	}

	// Handler function when a value is deselected or removed
	handleRemove(value, isExecuteQuery=false) {
		this.setValue(value, isExecuteQuery)
	}

	// set value
	setValue(value, isExecuteQuery=false) {
		var obj = {
			key: this.props.sensorId,
			value: value
		};
		helper.selectedSensor.set(obj, isExecuteQuery);
	}

	// selectAll
	selectAll(value, defaultSelected, cb) {
		let items = this.state.items.filter((item) => {item.status = value; return item; });
		if(value) {
			this.defaultSelected = defaultSelected;
		}
		this.setState({
			items: items,
			storedItems: items,
			defaultSelectAll: value
		}, cb);
	}

	// filter
	filterBySearch(value) {
		if(value) {
			let items = this.state.storedItems.filter(function(item) {
				return item.key && item.key.toLowerCase().indexOf(value.toLowerCase()) > -1;
			});
			this.setState({
				items: items
			});
		} else {
			this.setState({
				items: this.state.storedItems
			});
		}
	}

	render() {
		// Checking if component is single select or multiple select
		let listComponent,
			searchComponent = null,
			title = null;

		if (this.props.multipleSelect) {
			listComponent = <ItemCheckboxList
				items={this.state.items}
				onSelect={this.handleSelect}
				onRemove={this.handleRemove}
				showCount={this.props.showCount}
				selectAll={this.selectAll}
				defaultSelected={this.props.defaultSelected}
				selectAllLabel={this.props.selectAllLabel} />
		}
		else {
			listComponent = <ItemList
				items={this.state.items}
				onSelect={this.handleSelect}
				onRemove={this.handleRemove}
				showCount={this.props.showCount}
				defaultSelected={this.props.defaultSelected}
				selectAllLabel={this.props.selectAllLabel} />
		}

		// set static search
		if(this.props.showSearch) {
			searchComponent = <StaticSearch
				placeholder={this.props.placeholder}
				changeCallback={this.filterBySearch}
			/>
		}

		if(this.props.title) {
			title = (<h4 className="rbc-title col s12 col-xs-12">{this.props.title}</h4>);
		}

		let cx = classNames({
			'rbc-search-active': this.props.showSearch,
			'rbc-search-inactive': !this.props.showSearch,
			'rbc-title-active': this.props.title,
			'rbc-title-inactive': !this.props.title,
			'rbc-placeholder-active': this.props.placeholder,
			'rbc-placeholder-inactive': !this.props.placeholder,
			'rbc-singlelist': !this.props.multipleSelect,
			'rbc-multilist': this.props.multipleSelect
		});

		return (
			<div className={`rbc col s12 col-xs-12 card thumbnail ${cx}`}>
				{title}
				{searchComponent}
				{listComponent}
			</div>
		);
	}
}

NativeList.propTypes = {
	appbaseField: React.PropTypes.string.isRequired,
	size: helper.sizeValidation,
	showCount: React.PropTypes.bool,
	multipleSelect: React.PropTypes.bool,
	sortBy: React.PropTypes.oneOf(['asc', 'desc', 'count']),
	selectAllLabel: React.PropTypes.string
};

// Default props value
NativeList.defaultProps = {
	showCount: true,
	multipleSelect: true,
	sortBy: 'count',
	size: 100,
	showSearch: false,
	title: null,
	placeholder: 'Search',
	selectAllLabel: null
};

// context type
NativeList.contextTypes = {
	appbaseRef: React.PropTypes.any.isRequired,
	type: React.PropTypes.any.isRequired
};
