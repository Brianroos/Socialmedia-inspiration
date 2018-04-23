<?php
  $compiler = include('compiler.php');
  $data['title'] = 'Index';
  $data['search'] = true;

  $data['introductionTitle'] = 'Inspiratiebronnen';
  $data['introductionSubtitle'] = 'Hier kunt u een selectie maken van de getoonde inspiratiebronnen die er voor u uitspringen.';
  $data['introductionBlockquote'] = 'De inspiratiebronnen worden weergegeven aan de hand van uw zoekvoorkeuren.';

  echo $compiler->render('index', $data);
?>
