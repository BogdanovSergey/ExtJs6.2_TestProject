Ext.define('MyApp.Application', {
    extend: 'Ext.app.Application',

    name: 'MyApp',

    stores: [
        // TODO: add global / shared stores here
    ],

    launch: function () {

        console.log('launch');
        //Ext.Msg.alert('app', 'MyApp.Application');
    },

});