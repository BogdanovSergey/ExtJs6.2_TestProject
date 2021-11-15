Ext.define('MyApp.view.main.Main', {
    extend: 'Ext.panel.Panel',

    requires: [
         'MyApp.view.main.MainController',
    ],
    controller  : 'main',
    xtype       : 'mainview',
    title       : '<a href="/" style="color:white">Веб приложение рекомендательной сети</a>',
    items       : [
        Ext.create('Ext.panel.Panel', {
            header  : false,
            reference : 'AuthPanel',
            padding : 10,
            border  : false,
            layout  : 'hbox',
            defaults: {
                xtype : 'panel'
            },
            items:[
                {
                    /* растягивающая пружинка (симуляция "align:right" для кнопок) */
                    xtype   : 'component',
                    flex    : 1
                },
                {
                    xtype   : 'button',
                    text    : 'Зарегистрироваться',
                    handler : 'onBtnRegistrationWindowClick',
                    reference : 'btnRegistration'
                },
                {
                    xtype       : 'button',
                    text        : 'Вход',
                    reference   : 'btnEnter',
                    handler     : 'onBtnEnterClick'
                },
                {
                    xtype       : 'label',
                    reference   : 'labelLoggedAs',
                    hidden      : true,
                    html        : 'logged as...',
                    margin      : '5 50 0 0', ////(top, right, bottom, left).

                },
                {
                    xtype       : 'button',
                    text        : 'Выйти',
                    reference   : 'btnExit',
                    hidden      : true,
                    handler     : 'onBtnExitClick',

                },
                ],
            listeners:{
                afterRender : 'afterRenderAuthPanel'
            },
            }),
        Ext.create('Ext.panel.Panel', {
            header  : false,
            border  : false,
            layout  : 'column',
            items   : [
                Ext.create('Ext.panel.Panel', {
                    padding     : 10,
                    id          : "ProductPanel",
                    title       : 'Список товаров',
                    columnWidth : 0.6,
                    //layout: 'hbox',
                    layout      : 'column',
                    /*layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },*/
                    //bodyStyle: 'margin: 10px; padding: 5px 3px;',
                    //bodyPadding: '5 5 10',
                    listeners:{
                        afterRender : 'afterRenderProductPanel'
                    },
                    items: [
                        //product list from ajax
                    ]
                }),

                Ext.create('Ext.panel.Panel', {
                    //renderTo: Ext.getBody(),
                    columnWidth: 0.4,
                    padding :   10,
                    header  : false,
                    layout: {
                        type    : 'vbox',
                        align   : 'stretch'
                    },
                    items: [{
                        xtype       : 'form',
                        reference   : 'RankForm',
                        url         : 'json.php?action=AddProductRank',
                        hidden      : true,
                        title       : 'Ваш отзыв о товаре',
                        items       : [
                            Ext.create('Ext.form.ComboBox', {
                                fieldLabel      : 'Ваша оценка',
                                margin          : '10 10 10 10', //(top, right, bottom, left).
                                //displayField    : 'name', // !
                                width           : 250,
                                valueField      : 'Rank',
                                name            : 'Rank',
                                forceSelection  : true,
                                editable        : false,
                                store           : Ext.create('Ext.data.Store', {
                                    data: [
                                        { name: '<img src="images/sys/star1.gif">', Rank: 1 },
                                        { name: '<img src="images/sys/star2.gif">', Rank: 2 },
                                        { name: '<img src="images/sys/star3.gif">', Rank: 3 },
                                        { name: '<img src="images/sys/star4.gif">', Rank: 4 },
                                        { name: '<img src="images/sys/star5.gif">', Rank: 5 }
                                    ]
                                }),
                                tpl: Ext.create('Ext.XTemplate',
                                    '<ul class="x-list-plain"><tpl for=".">',
                                    '<li role="option" class="x-boundlist-item">{name}</li>', /* отражение списка во время drop down'a */
                                    '</tpl></ul>'
                                ),
                                displayTpl: Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    ' ', /* выбор после клика-select'a */
                                    '</tpl>'
                                ),
                                listeners: {
                                    afterrender : function(me) {me.inputEl.setStyle('cursor','pointer');},
                                    click       : { element: 'el',fn: function() { Ext.getCmp(this.id).expand(); } },
                                    select      : function (comboBox, records) {
                                                    var record = records[0];
                                                    comboBox.inputEl.setStyle({
                                                        'background-image':    'url(images/sys/star'+comboBox.getValue()+'.gif)',
                                                        'background-repeat':   'no-repeat',
                                                        'background-position': '3px center',
                                                        'padding-left':        '25px'
                                                    });
                                                }
                                }
                            }),
                            {
                                xtype       : 'textfield',
                                margin      : '0 10 0 10', //(top, right, bottom, left).
                                anchor      : '100%',
                                name        : 'ProductName',
                                reference   : 'ProductName',
                                emptyText   : "Выберите товар из списка справа",
                                editable    : false,
                                allowBlank  : false
                            },
                            {
                                xtype      : 'hidden',
                                name       : 'ProductId',
                                reference  : 'ProductId',
                                value      : 0,
                            },
                            {
                                xtype     : 'textarea',
                                margin    : '10 10 10 10', //(top, right, bottom, left).
                                grow      : true,
                                name      : 'RankMessage',
                                reference : 'RankMessage',
                                field     : false,
                                anchor    : '100%',
                                emptyText   : "Текст вашего отзыва о товаре",
                                minLength   : 10,
                                minLengthText: 'Не ленитесь, напишите интересный текст от 10 знаков',
                                allowBlank : false
                            },
                        ],
                        buttons: [ {
                            text: 'Добавить отзыв',
                            formBind: true, //only enabled once the form is valid
                            disabled: false,
                            handler : 'AddProductRank'
                        }],
                    },

                        Ext.create('Ext.grid.Panel', {
                            id          : "RankGrid",
                            title       : 'Последние 10 отзывов о товаре',
                            hideHeaders : true,
                            store       : Ext.create('MyApp.store.RankStore'),
                            /*store: Ext.create('Ext.data.Store', {
                                storeId: 'simpsonsStore',
                                fields:[ 'RateWho', 'RateText', 'RateStars'],
                                data: [
                                    { RateWho: 'Lisa<br>14.07.2020', RateText: 'блаблабла', RateStars: 4 },
                                    { RateWho: 'Bart<br>14.07.2020', RateText: 'лалалалалал', RateStars: 5 },
                                ]
                            }),*/
                            columns: [
                                { text: 'Кто,когда',    dataIndex: 'WhoAndWhen', width:150 },
                                { text: 'текст',        dataIndex: 'RankMessage', flex: 1 },
                                { text: 'оценка',       dataIndex: 'Rank', width:100,
                                    renderer: function(value) {
                                        return Ext.String.format('<img src="images/sys/star'+value+'.gif" title="Оценка {0} баллов">', value);
                                    },
                                }
                            ],
                            //height: 200,
                            width: 400,
                            flex: 1
                            //renderTo: Ext.getBody()
                        })


                        // ,{
                        //     xtype: 'panel',
                        //     title: 'Третья панель',
                        //     height:100
                        // }
                    ]
                })
            ]
        })
    ]


});
