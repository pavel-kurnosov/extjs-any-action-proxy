extjs-any-action-proxy
======================

Allows to add any action to model and use it as model action - same as default crud operations

Usage: 

1. Add files to your app.js;
2. Create model with new rest:

``` js
Ext.define('app.model.Folder', {
    extend: 'Ext.data.Model',
    proxy: {
        type: 'phrest', // our new rest proxy
        url: 'rooms/{roomId}/documents/folder',
        
        // action that we add
        actionMethods: {
            'flagThisFolder': 'PUT'
        },

        // url for action
        api: {
            flagThisFolder: 'rooms/{roomId}/documents/folder/{nodeId}/markThisFolder'
        }
    },
    
    // usage of action
    markFolder: function (callback) {
        var options = {};
        options.customAction = 'flagThisFolder';
        options.callback = callback;
        this.doPost(options);
    },
});
```
3. Use in your code: 

``` js
Ext.create('app.model.Folder').markFolder({success: function(){console.log('done');}});
