<?php
/**
 * The Header for our theme.
 * @package WordPress
 * @subpackage Sunswift
 * @since Sunswift 1.0
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<title><?php
	/*
	 * Print the <title> tag based on what is being viewed.
	 */
	global $page, $paged;
	wp_title( '|', true, 'right' );
	// Add the blog name.
	bloginfo( 'name' );
	// Add the blog description for the home/front page.
	$site_description = get_bloginfo( 'description', 'display' );
	if ( $site_description && ( is_home() || is_front_page() ) )
		echo " | $site_description";	
	// Add a page number if necessary:
	if ( $paged >= 2 || $page >= 2 )
		echo ' | ' . sprintf( __( 'Page %s', 'sunswift' ), max( $paged, $page ) );
	?></title>
<link rel="stylesheet" href="/wp-content/themes/sunswift/style.css" type="text/css" media="screen" title="no title" charset="utf-8">
<!--[if IE]>
<link rel="stylesheet" type="text/css" media="all" href="/wp-content/themes/sunswift/styles/style-ie.css" />
<![endif]-->
<!--[if lte IE 7]>
<link rel="stylesheet" type="text/css" media="all" href="/wp-content/themes/sunswift/styles/style-ie7.css" />
<![endif]-->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js" type="text/javascript"></script>
<script src="<?php echo SCRIPTSPATH; ?>/libraries.min.js" type="text/javascript" charset="utf-8"></script>
<script src="<?php echo SCRIPTSPATH; ?>/javascript.js" type="text/javascript" charset="utf-8"></script>

<?php wp_head(); ?>
<?php if (is_404()): ?>
<style>
body {
	background-color:#fff;
	background-image:none;
}
</style>
<?php endif; ?>
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />
<!--[if IE 6]>
<script src="<?php echo SCRIPTSPATH; ?>/jquery.supersleight.js" type="text/javascript" charset="utf-8"></script>
<![endif]-->
<!--[if IE 6]>
<script>
$(window).load(function(){
	$('body').supersleight({shim: PATHPREFIX+'/images/transparent.gif'});
});
</script>
<![endif]-->
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-8965962-4']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>
</head>
