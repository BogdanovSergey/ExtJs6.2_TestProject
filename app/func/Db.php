<?php

    $SYS->db = mysqli_connect("localhost", "u1102051_default", "M8YgeMg!", "u1102051_default");

    if (!$SYS->db){
        print("Ошибка: Невозможно подключиться к MySQL " . mysqli_connect_error());

    }

    $SYS->db->set_charset("utf8");