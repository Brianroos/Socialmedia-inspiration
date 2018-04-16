<?php
  $compiler = include('compiler.php');
  $data['title'] = 'Index';

  echo $compiler->render('index', $data);
?>
