Ext.define('MyApp.view.main.MainController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.main',
    /*
    TODO
    onProductClick: function() {
        alert(1);
    },*/
    afterRenderProductPanel: function() {
        var ProductPanel = Ext.getCmp("ProductPanel");
        var RankForm     = this.lookupReference('RankForm');

        Ext.Ajax.request({
            url     : 'json.php?action=ProductGetList',
            success: function (response, o) {
                var response = Ext.decode(response.responseText);
                //console.log(response.data);
                for(var i =0;i<response.data.length;i++){
                    var ProductItemArr = response.data[i];
                    //var nam = ProductItemArr['ProductName'];
                    //console.log( ProductItemArr );
                    ProductPanel.add(
                        {
                            xtype       : 'panel',
                            title       : ' ' + ProductItemArr['ProductName'],
                            //height: 100,
                            id          : "product"+ProductItemArr['ProductId'],
                            reference   : "product"+ProductItemArr['ProductId'],
                            ProductId   : ProductItemArr['ProductId'],
                            ProductName : ProductItemArr['ProductName'],
                            border      : true,
                            maxWidth    : 200,
                            //maxHeigth   : 100,
                            //*split: true,
                            margin      : 10,
                            //columnWidth : 0.5,

                            layout: 'column',
                            items:[
                                {
                                    xtype: 'panel',
                                    border: false,
                                    columnWidth: 0.5,
                                    /*style: {
                                        color: '#FFFFFF',
                                        backgroundColor:'#000000'
                                    },*/
                                    html    : '<img src="' + ProductItemArr['ProductImg'] + '" width="100" height="100">',
                                    layout  : {
                                        //type: 'hbox',
                                        //align: 'stretch'
                                    }
                                },
                                {
                                    xtype       : 'panel',
                                    border      : false,
                                    columnWidth : 0.4,
                                    //margin      : '0 0 0 5', //(top, right, bottom, left).
                                    html        : (ProductItemArr['ProductAvgRank'] >=1) ?
                                        '<img src="images/sys/star'+ProductItemArr['ProductAvgRank']+'.gif" title="Средняя оценка: '+ProductItemArr['ProductAvgRank']+'"> '+ProductItemArr['ProductDescription'] :
                                        ProductItemArr['ProductDescription']
                                },
                                /*{
                                    xtype       : 'panel',
                                    border      : true,
                                    columnWidth : 1,
                                    html        : ProductItemArr['ProductDescription'],
                                    height      : 30
                                },*/
                            ],
                            listeners:{
                                afterrender: function() {
                                    this.setStyle('cursor','pointer');
                                },
                                //click: onProductClick, //TODO: send to apart controller method
                                click: {
                                    element: 'el',
                                    fn: function() {
                                        var store = Ext.getCmp("RankGrid").getStore();

                                        store.getProxy().extraParams.ProductId = this.component.ProductId;
                                        store.reload();

                                        // не показываем панель если нет сессии (внутри защищено)
                                        if( typeof(Ext.util.Cookies.get('UserSession')) != 'undefined' &&
                                            Ext.util.Cookies.get('UserSession').length > 0
                                        ) {
                                            RankForm.setHidden(false);
                                        }

                                        //TODO как обратиться к элементу формы по name?
                                        RankForm.items.get(1).setValue( this.component.ProductName ); // 1 = ProductName
                                        RankForm.items.get(2).setValue( this.component.ProductId ); // 2 = ProductId

                                    }
                                }
                            }
                        }
                    );
                }
            },
            failure : function(){

            }
        });
    },

    AddProductRank: function() {
        var RankForm     = this.lookupReference('RankForm');

        if (RankForm.isValid()) {
            RankForm.submit({
                success: function (form, action) {
                    var data = action.result.data;
                    if (action.result.success == true) {

                        Ext.Msg.show({
                            title   : 'Ваш отзыв успешно сохранен',
                            message : 'Спасибо!',
                            buttons : Ext.Msg.OK,
                            icon    : Ext.Msg.INFO,
                            fn: function(btn) {

                                RankForm.setHidden(true);
                                //RankForm.setDisabled(true);

                                var store = Ext.getCmp("RankGrid").getStore();

                                store.reload();

                            }
                        });

                    } else {
                        console.log(response);
                    }
                },
                failure: function () {
                    Ext.Msg.show({
                        title   : 'Извините',
                        message : 'Программист устал крутить педали и не может добавить ваш отзыв!',
                        buttons : Ext.Msg.OK,
                        icon    : Ext.Msg.WARNING
                    });

                }
            });
        }


    },

    onBtnEnterSystemClick: function() {
        var EnterSystemForm     = this.lookupReference('EnterSystemForm');
        var EnterSystemWindow   = this.lookupReference('EnterSystemWindow');

        var RankForm            = this.lookupReference('RankForm');
        var btnEnter           = this.lookupReference('btnEnter');
        var btnExit            = this.lookupReference('btnExit');
        var btnRegistration    = this.lookupReference('btnRegistration');
        var labelLoggedAs      = this.lookupReference('labelLoggedAs');

        if (EnterSystemForm.isValid()) {
            EnterSystemForm.submit({
                    success: function(form, action) {
                    var data = action.result.data;
                    if(action.result.success == true) {
                        var LoggedAsMessage = data.LoggedAs;
                        var UserSessionKey  = data.UserSessionKey;
                        var days            = 3;
                        var expires         = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * days));
                        Ext.util.Cookies.set('UserSession', UserSessionKey, expires);

                        RankForm.setHidden(false);
                        btnEnter.setHidden(true);
                        btnExit.setHidden(false);
                        btnRegistration.setHidden(true);
                        labelLoggedAs.update(LoggedAsMessage);
                        labelLoggedAs.setHidden(false);

                        EnterSystemWindow.close();

                    } else {
                        console.log(response);
                    }
                },
                failure : function(){
                    Ext.Msg.show({
                        title   :'Не могу войти',
                        message : 'Неправильные логин или пароль, попробуйте еще раз.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.WARNING,
                        /*fn: function(btn) {
                            if (btn === 'yes') {
                                console.log('Yes pressed');
                            } else if (btn === 'no') {
                                console.log('No pressed');
                            } else {
                                console.log('Cancel pressed');
                            }
                        }*/
                    });

                }
            });
        }
    },
    afterRenderAuthPanel: function() {
        var AuthPanel  = this.lookupReference('AuthPanel');
        var RankForm            = this.lookupReference('RankForm');
        var btnEnter           = this.lookupReference('btnEnter');
        var btnExit           = this.lookupReference('btnExit');
        var btnRegistration    = this.lookupReference('btnRegistration');
        var labelLoggedAs      = this.lookupReference('labelLoggedAs');

        Ext.Ajax.request({
                url     : 'json.php?action=CheckUserSession',
                params:{
                    UserSession: Ext.util.Cookies.get('UserSession')
                },
                success: function (response, o) {
                    var response = Ext.decode(response.responseText);
                    if(response.success == true) {
                        var LoggedAsMessage = response.data.LoggedAs;

                        RankForm.setHidden(false);
                        btnEnter.setHidden(true);
                        btnExit.setHidden(false);
                        btnRegistration.setHidden(true);
                        labelLoggedAs.update(LoggedAsMessage);
                        labelLoggedAs.setHidden(false);
                    }
                },
                failure : function(){

                }
        });
    },
    onProductClick: function () {
        alert("onProductClick");
    },
    onBtnRegistrationSaveClick: function () {

        var RegistrationWindow  = this.lookupReference('RegistrationWindow');
        var RegistrationForm    = this.lookupReference('RegistrationForm');
        var RankForm            = this.lookupReference('RankForm');
        var btnEnter           = this.lookupReference('btnEnter');
        var btnExit           = this.lookupReference('btnExit');

        var btnRegistration    = this.lookupReference('btnRegistration');
        var labelLoggedAs      = this.lookupReference('labelLoggedAs');

        if (RegistrationForm.isValid()) {
            RegistrationForm.submit({
                success: function(form, action) {
                    console.log(action.result.data.UserSessionKey);

                    var UserSessionKey  = action.result.data.UserSessionKey;
                    var LoggedAsMessage = action.result.data.LoggedAs;
                    var days            = 3;
                    var expires         = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * days));

                    //if( +Ext.util.Cookies.get('UserSession') == 1) {
                    Ext.util.Cookies.set('UserSession', UserSessionKey, expires);

                    Ext.Msg.show({
                        title   :'Успешно',
                        message : action.result.message,
                        buttons : Ext.Msg.OK,
                        icon    : Ext.Msg.INFO,
                        fn: function(btn) {
                            RegistrationWindow.close();
                            RankForm.setHidden(false);

                            btnEnter.setHidden(true);
                            btnExit.setHidden(false);
                            btnRegistration.setHidden(true);
                            labelLoggedAs.update(LoggedAsMessage);
                            labelLoggedAs.setHidden(false);

                        }
                    });

                },
                failure: function(form, action) {
                    Ext.Msg.show({
                        title:'Ошибка',
                        message: action.result.message,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.WARNING,
                        /*fn: function(btn) {
                            if (btn === 'yes') {
                                console.log('Yes pressed');
                            } else if (btn === 'no') {
                                console.log('No pressed');
                            } else {
                                console.log('Cancel pressed');
                            }
                        }*/
                    });



                }
            });
        }

        //console.log(this.getView().up('form').getForm());
    },
    onBtnEnterClick: function () {
        Ext.create('Ext.window.Window', {
            title       : 'Вход в систему',
            reference   : 'EnterSystemWindow',
            padding     : 10,
            border      : false,
            modal       : true,
            minHeight   : 200,
            minWidth    : 300,
            layout      : 'fit',
            items       : {
                xtype       : 'form',
                reference   : 'EnterSystemForm',
                url         : 'json.php',
                timeout     : 10,
                border      : false,
                defaultType : 'textfield',
                items       : [
                    {
                        xtype       : 'hidden',
                        name        : 'action',
                        value       : 'CheckUserAuth'
                    },
                    {
                        width       : 300,
                        labelWidth  : 150,
                        fieldLabel  : 'Ваш логин',
                        name        : 'UserLogin',
                        regex        : /^[0-9A-Za-zА-Яа-я]{3,}$/,
                        allowBlank  : false
                    },
                    {
                        width       : 300,
                        labelWidth  : 150,
                        fieldLabel  : 'Ваш пароль',
                        name        : 'UserPassword',
                        inputType   : 'password',
                        regex        : /^[0-9A-Za-zА-Яа-я]{3,}$/,
                        allowBlank  : false
                    },

                ],
                buttons: [
                    {
                        text        : 'Войти',
                        formBind    : true,
                        handler     : 'onBtnEnterSystemClick'

                    },
                ]
            }
        }).show();
    },

    onBtnRegistrationWindowClick: function () {
        var RandGarb = Ext.Number.randomInt(0,1000000);
        Ext.create('Ext.window.Window', {
            title       : 'Регистрация нового пользователя',
            reference   : 'RegistrationWindow',
            padding     : 10,
            border      : false,
            modal       : true,
            minHeight   : 300,
            minWidth    : 400,
            layout      : 'fit',
            items       : {
                xtype       : 'form',
                reference   : 'RegistrationForm',
                url         : 'json.php?' + RandGarb,
                timeout     : 10,
                border      : false,
                defaultType : 'textfield',
                items       : [
                    {
                        xtype       : 'hidden',
                        name        : 'action',
                        value       : 'SaveForm'
                    },
                    {
                        fieldLabel  : 'E-mail',
                        vtype       : 'email',
                        emptyText   : 'email@domain.ru',
                        width       : 400,
                        labelWidth  : 150,
                        name        : 'UserEmail',
                        allowBlank  : false
                    },
                    {
                        width       : 400,
                        labelWidth  : 150,
                        fieldLabel  : 'Логин',
                        name        : 'UserLogin',
                        emptyText   : 'минимум 3 буквы/цифры',
                        invalidText : 'Обязательное поле, минимум 3 буквы/цифры',
                        blankText   : 'Это поле является обязательным',
                        //vtype       : 'alphanum',
                        regex        : /^[0-9A-Za-zА-Яа-я]{3,}$/,
//                        minLength   : 3,
                        allowBlank  : false
                    },
                    {
                        width       : 400,
                        labelWidth  : 150,
                        fieldLabel  : 'Пароль',
                        name        : 'UserPassword',
                        inputType   : 'password',
                        emptyText   : 'минимум 3 буквы/цифры',
                        invalidText : 'Обязательное поле, минимум 3 буквы/цифры',
                        blankText   : 'Это поле является обязательным',
                        regex        : /^[0-9A-Za-zА-Яа-я]{3,}$/,
                        allowBlank  : false
                    },
                    {
                        xtype       : 'component',
                        width       : 400,
                        style       : {
                            top     : '50px'
                        },
                        html        : 'Пожалуйста, заполните <u>все</u> поля'
                    },
                ],
                buttons: [
                    {
                        text        : 'Сброс',
                        handler     : function() {
                            this.up('form').getForm().reset();
                        }
                    },
                    {
                        text        : 'Зарегистрироваться',
                        formBind    : true,
                        handler     : 'onBtnRegistrationSaveClick'

                    },
                ]
            }
        }).show();



    },

    onBtnExitClick : function() {
        //var days            = 3;
        //var expires         = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * days));
        Ext.util.Cookies.set('UserSession', '');
        document.location.reload(true);

    }

});