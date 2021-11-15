Ext.application({
    name : 'MyApp',
    extend: 'MyApp.Application',


    requires: [
        'MyApp.view.main.Main',

    ],

    // The name of the initial view to create. With the classic toolkit this class
    // will gain a "viewport" plugin if it does not extend Ext.Viewport. With the
    // modern toolkit, the main view will be added to the Viewport.
    //
    mainView: 'MyApp.view.main.Main'


    /*launch : function() {
        console.log('app.js launch');
        //Ext.Msg.alert('Fiddle', 'Welcome to Sencha Fiddle!');

    }*/
});