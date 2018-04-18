<?php

require_once('twitter_proxy.php');

// Twitter OAuth Config options
$oauth_access_token = $_POST['accessToken'];
$oauth_access_token_secret = $_POST['accessTokenSecret'];
$consumer_key = $_POST['consumerKey'];
$consumer_secret = $_POST['consumerSecret'];
$user_id = $_POST['userId'];
$screen_name = $_POST['screenName'];
$url = $_POST['url'];

// Create a Twitter Proxy object from the twitter_proxy.php class
$twitter_proxy = new TwitterProxy(
  $oauth_access_token,         // 'Access token' on https://apps.twitter.com
  $oauth_access_token_secret,  // 'Access token secret' on https://apps.twitter.com
  $consumer_key,               // 'API key' on https://apps.twitter.com
  $consumer_secret,            // 'API secret' on https://apps.twitter.com
  $user_id,                    // User id (http://gettwitterid.com/)
  $screen_name                 // Twitter handle
);

// Invoke the GET method to retrieve results via a cURL request
$tweets = $twitter_proxy->get($url);
echo $tweets;

?>
