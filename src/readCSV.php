<?php
$pathForeigners = '../OGDResources/Bev_Gemeinde_auslStaatsangeh_GrGruppen_2015_2019.csv';
$pathSwiss = '../OGDResources/Bev_Gemeinde_Geschlecht_Nationalitaet_Aggr_2015_2019.csv';


function getLines($path){
    $csv = fopen($path,"r");
    if($csv) {
        fgetcsv($csv, 1000);
        $lines = array();
        while (($line = fgetcsv($csv, 1000, ",")) !== FALSE) {
            $data = explode(";", $line[0]);
            array_push($lines, $data);
        }
        fclose($csv);
        return $lines;
    }
    return 0;
}


$linesForeigners = getLines($pathForeigners);
$linesSwiss = getLines($pathSwiss);

$returnArray = array();
for($i = 0; $i < sizeof($linesSwiss); $i+=4){
    $count = $linesSwiss[$i][9] + $linesSwiss[$i + 2][9];
    array_push($returnArray, array("id"=>$linesSwiss[$i][0], "year"=>$linesSwiss[$i][4], "nation"=>"Schweiz", "count"=>strval($count)));
}

foreach($linesForeigners as $data){
    array_push($returnArray, array("id"=>$data[0], "year"=>$data[4], "nation"=>$data[6], "count"=>$data[7]));
}


echo json_encode($returnArray);


