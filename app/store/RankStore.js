Ext.define('MyApp.store.RankStore', {
    extend    : 'Ext.data.Store',
    storeId   : 'RankStore',
    autoLoad  : true,
    proxy : {
        type        : 'ajax',
        url         : 'json.php?action=ProductGetRanks',
        reader      : { type: 'json', rootProperty: 'data', totalProperty: 'total' },
        extraParams : {}

    }
});
