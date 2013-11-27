Ext.define('app.lib.model.proxy.PhRestProxy', {
	alias: 'proxy.phrest',
	extend: 'Ext.data.proxy.Rest',

	actionMethods: {
		create: 'POST',
		read: 'GET',
		update: 'PUT',
		destroy: 'DELETE'
	},

	constructor: function (config) {
		var me = this;

		config = config || {};
		config.actionMethods = Ext.merge(me.actionMethods, config.actionMethods || {});
		if (me.api) {
			delete me.api.destroy;
			delete me.api.create;
			delete me.api.update;
			delete me.api.read;
		}
		me.api = Ext.merge(config.api || {}, me.api);

		me.callParent([config]);
	},

	buildRequest: function (operation) {
		var me = this,
		// Clone params right now so that they can be mutated at any point further down the call stack
			params = operation.params = Ext.apply({}, operation.params, me.extraParams),
			request;

		//copy any sorters, filters etc into the params so they can be sent over the wire
		Ext.applyIf(params, me.getParams(operation));

		// Set up the entity id parameter according to the configured name.
		// This defaults to "id". But TreeStore has a "nodeParam" configuration which
		// specifies the id parameter name of the node being loaded.
		if (operation.id !== undefined && params[me.idParam] === undefined) {
			params[me.idParam] = operation.id;
		}

		request = new Ext.data.Request({
			params: params,
			action: operation.action,
			customAction: operation.customAction,
			records: operation.records,
			loadMask: operation.loadMask !== undefined ? operation.loadMask : false,
			operation: operation,
			url: operation.url,
			async: operation.async !== undefined ? operation.async : true,
			// this is needed by JsonSimlet in order to properly construct responses for
			// requests from this proxy
			proxy: me
		});

		if (operation.customAction) {
			request.url = me.getUrl(request);
		} else {
			request.url = me.buildUrl(request);
		}

		/*
		 * Save the request on the Operation. Operations don't usually care about Request and Response data, but in the
		 * ServerProxy and any of its subclasses we add both request and response as they may be useful for further processing
		 */
		operation.request = request;

		return request;
	},

	getUrl: function (request) {
		return request.url || this.api[request.customAction] || this.api[request.action] || this.url;
	},

	getMethod: function (request) {
		return request.customAction ? this.actionMethods[request.customAction] : this.actionMethods[request.action];
	}
});