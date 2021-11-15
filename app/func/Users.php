<?php

    function UsersAddNew($ParamArr) {
        global $SYS;

        $RequiredFieldsArr = ['UserEmail','UserLogin','UserPassword'];

        foreach($RequiredFieldsArr as $item) {
            if(!isset($ParamArr[$item])) {
                return ['success'=>false,'message'=>$item.' required'];
            }
        }

        if( UsersCheckUserLoginExist($ParamArr['UserLogin']) ) {
            return ['success'=>false,'message'=>'Пользователь с таким логином уже есть, выберите другой'];
        }

        $UserSessionKey = md5($ParamArr['UserLogin'] . $ParamArr['UserPassword'] . rand(0,1000000));

        $sql = sprintf("INSERT INTO Users (UserLogin,UserEmail,UserPassword,UserSession) VALUES ('%s','%s','%s','%s')",
            $ParamArr['UserLogin'],
            $ParamArr['UserEmail'],
            $ParamArr['UserPassword'],
            $UserSessionKey);
        $res = mysqli_query($SYS->db, $sql);

        if ($res ) {
            return ['success'=>true, 'message' => 'Пользователь успешно добавлен.<br>Сессия сохранена.<br>Открываем форму добавления отзыва.',
                    "data"=>["UserSessionKey" => $UserSessionKey,
                            "LoggedAs"=>'Вы вошли как: '.$ParamArr['UserLogin']]];
        } else {
            return ['success'=>false, 'message'=>'Техническая ошибка или вы пытаетесь сломать систему? ;-)'];
        }
    }

    function UsersCheckUserLoginExist($UserLogin) {
        global $SYS;
        $sql = sprintf("SELECT 1 AS Exist FROM Users WHERE UserLogin = '%s'", $UserLogin);
        $res = mysqli_fetch_array( mysqli_query($SYS->db, $sql) );
        return ($res['Exist'] == 1) ? true : false;
    }

    function UsersCheckUserSession($UserSession) {
        global $SYS;
        $sql = sprintf("SELECT id AS UserId, UserLogin AS UserLogin FROM Users WHERE UserSession = '%s'", $UserSession);
        $res = mysqli_fetch_array( mysqli_query($SYS->db, $sql) );

        if(isset($res['UserLogin'])) {
            return ['success'=>true, 'UserId'=>$res['UserId'], 'LoggedAs'=>'Вы вошли как: ' . $res['UserLogin']];
        } else {
            return ['success'=>false];
        }
    }

    function UsersCheckUserAuth($UserLogin, $UserPassword) {
        global $SYS;
        $sql = sprintf("SELECT 1 AS Exist FROM Users WHERE UserLogin = '%s' AND UserPassword = '%s'", $UserLogin, $UserPassword);
        $res = mysqli_fetch_array( mysqli_query($SYS->db, $sql) );

        if(isset($res['Exist'])) {
            // обновляем сессию
            $UserSessionKey = md5($UserLogin . $UserPassword . rand(0,1000000));
            $sql = sprintf("UPDATE Users SET UserSession = '%s' WHERE UserLogin = '%s' AND UserPassword = '%s'",
                $UserSessionKey,
                $UserLogin,
                $UserPassword);
            mysqli_query($SYS->db, $sql);

            return ['success'=>true,
                    "data"=>["UserSessionKey" => $UserSessionKey,
                    "LoggedAs"=>'Вы вошли как: ' .$UserLogin]
            ];
        } else {
            return ['success'=>false];
        }
    }


