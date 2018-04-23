<?php
  $compiler = include('compiler.php');
  $data['title'] = 'Index';
  $data['search'] = true;

  echo $compiler->render('index', $data);
?>
