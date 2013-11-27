Ext.define('app.lib.model.PhModel', {
    override: 'Ext.data.Model',
    inheritableStatics: {
        load: function (id, config) {
            config = Ext.apply({}, config);
            config = Ext.applyIf(config, {
                action: config.action ? config.action : 'read'
            });
            if (id) {
                config = Ext.applyIf(config, {
                    id: id
                });
            }


            var operation = new Ext.data.Operation(config),
                scope = config.scope || this,
                record = null,
                callback;

            callback = function (operation) {

                if (operation.wasSuccessful()) {
                    record = operation.getRecords()[0];
                    Ext.callback(config.success, scope, [record, operation]);
                } else {
                    Ext.callback(config.failure, scope, [record, operation]);
                }
                Ext.callback(config.callback, scope, [record, operation]);
            };

            this.proxy.read(operation, callback, this);
        }
    },

    doPost: function (params) {
        this.save(params);
    }
});