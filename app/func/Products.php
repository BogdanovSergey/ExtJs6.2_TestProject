<?php

    function ProductAddProductRank($ProductId, $UserId, $Rank, $RankMessage) {
        global $SYS;
        $sql   = sprintf("INSERT INTO Ranks (ProductId, UserId, Rank, RankMessage) VALUES(%d, %d, %d, '%s')", $ProductId, $UserId, $Rank, nl2br($RankMessage));
        $res = mysqli_query($SYS->db, $sql);

        if($res) {
            // Обновляем среднюю оценку продукта
            $sql = sprintf("
                    UPDATE Products AS p SET p.ProductAvgRank = 
                        (SELECT ROUND(AVG(r.Rank)) FROM Ranks AS r WHERE r.ProductId=%d)
                    WHERE p.id=%d", $ProductId, $ProductId);
            mysqli_query($SYS->db, $sql);

            return ['success'=>true];
        } else {
            return ['success'=>false];
        }
    }


    function ProductGetList() {
        global $SYS;

        $sql   = "SELECT *, id AS ProductId FROM Products ORDER BY ProductAvgRank DESC";
        $items = [];
        $res = mysqli_query($SYS->db, $sql);
        while ($row = mysqli_fetch_object( $res )) {
            //print_r($row);
            $items[] = $row;
        }

        $result = [ "success"=>true,
                    "data"=>$items,
                    "total"=>count($items) ];
//print_r($result);

        return $result;

        //return ['success'=>false];
    }


    function ProductGetRanks($ProductId) {
        global $SYS;

        $sql   = sprintf("SELECT *,
                            CONCAT('Добавил: ',
                                (SELECT u.UserLogin FROM Users AS u WHERE u.id=UserId),'<br>',
                                AddedDate
                            ) AS WhoAndWhen
                          FROM Ranks WHERE ProductId=%d
                          ORDER BY AddedDate DESC
                          LIMIT 10 
                          ", $ProductId);
        $items = [];
        $res = mysqli_query($SYS->db, $sql);
        while ($row = mysqli_fetch_object( $res )) {
            $items[] = $row;
        }

        $result = ["success"=>true,
            "data"=>$items,
            "total"=>count($items) ];

        return $result;

        return ['success'=>false];
    }

