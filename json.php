<?php

    $SYS = (object) Array();

    require("app/func/Db.php");
    require("app/func/Users.php");
    require("app/func/Products.php");

    $response       = (object) array();
    $response->data = [];
    $response->message = '';

    header("Content-Type: application/json;charset=UTF-8");


    if(!isset($_REQUEST['action'])) {
        $response->success = false;
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
    }


    switch($_REQUEST['action']) {
        case 'SaveForm':

            $ResArr = UsersAddNew($_REQUEST);

            $response->success = $ResArr['success'];
            $response->message = $ResArr['message'];
            if(isset($ResArr['data'])) {
                $response->data = $ResArr['data'];
            }

            break;

        case 'CheckUserSession':
            $response->success = false;
            if(!isset($_REQUEST['UserSession'])) break;

            $ResArr = UsersCheckUserSession($_REQUEST['UserSession']);

            $response->success          = $ResArr['success'];
            $response->data['LoggedAs'] = $ResArr['LoggedAs'];
            break;


        case 'CheckUserAuth':
            $response->success = false;
            if(!isset($_REQUEST['UserLogin']) || !isset($_REQUEST['UserPassword'])) {
                $response = (object)['success'=>false,'message'=>'Ай, яй, яй :_('];
                break;
            }

            $ResArr = UsersCheckUserAuth($_REQUEST['UserLogin'], $_REQUEST['UserPassword']);

            $response->success          = $ResArr['success'];
            if(isset($ResArr['data'])) {
                $response->data = $ResArr['data'];
            }

            break;


        case 'AddProductRank':



            $ResArr = UsersCheckUserSession($_COOKIE['UserSession']);
            if($ResArr['success']) {

                // проверка на входящие данные
                if(!isset($ResArr['UserId'])) {
                    $response = (object)['success'=>false,'message'=>'Cant get UserId ?!'];
                    break;
                }
                $RequiredFieldsArr = ['ProductId','Rank','RankMessage'];
                foreach($RequiredFieldsArr as $item) {
                    if(!isset($_REQUEST[$item])) {
                        $response = (object)['success'=>false,'message'=>$item.' required']; break 2;
                    } elseif(strlen($_REQUEST[$item]) < 1 ) {
                        $response = (object)['success'=>false,'message'=>'error in field: '.$item]; break 2;
                    }
                }

                //собственно сохранение оценки и коммента
                $ProdResArr         = ProductAddProductRank($_REQUEST['ProductId'], $ResArr['UserId'], $_REQUEST['Rank'], $_REQUEST['RankMessage']); //$ProductId, $UserId, $Rank, $RankMessage
                $response->success  = $ProdResArr['success'];

            } else {
                $response = (object)['success'=>false, 'message'=>'Зачем вы удалили куку?'];
            }

            break;



        case  'ProductGetRanks':
            if(@$_REQUEST['ProductId']) {
                $response = (object)ProductGetRanks($_REQUEST['ProductId']);

            } else {
                $response = (object)['success'=>false, 'message'=>'ProductId is unknown'];
            }
            break;

        case 'ProductGetList':
            $response = (object)ProductGetList();

            break;


        default:
            $response = (object)['success'=>false, 'message'=>'unknown request'];
            break;
    }




echo json_encode($response, JSON_UNESCAPED_UNICODE);