<?php

    $SYS->db = mysqli_connect("localhost", "", "", "");

    if (!$SYS->db){
        print("Ошибка: Невозможно подключиться к MySQL " . mysqli_connect_error());

    }

    $SYS->db->set_charset("utf8");