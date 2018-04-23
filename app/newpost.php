<?php
  $compiler = include('compiler.php');
  $data['title'] = 'Index';
  $data['newpost'] = true;

  $data['introductionTitle'] = 'Uw ideale post';
  $data['introductionSubtitle'] = 'U bent nog maar een paar stappen verwijderd van de enige inspiratiebron die er toe doet.';
  $data['introductionBlockquote'] = 'Het resultaat is een weergave gebaseerd op uw eerdere zoekvoorkeuren en handelingen.';

  echo $compiler->render('newpost', $data);
?>
