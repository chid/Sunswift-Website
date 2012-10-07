<?php
/*	
* @package WordPress
* @subpackage Sunswift
* @since Sunswift 1.0
*/
get_header(); ?>
<body>
<div id="container">
	<div id="header">
		<div id="topHeader">
			<div id="textHeader">Welcome to the UNSW Solar Racing Team</div>
			<div id="navHeader"><ul><?php get_navigation(); ?></ul></div>
			<a href='http://www.sunswift.com'><img src="<?php echo LOGO_IMAGE; ?>" width="200" alt="Sunswift Logo" class="logo"></a>
		</div>
		<div id="mediaHeader">
			<div id="panel_image"><?php get_panel_image(); ?></div>
			<div id="media_container"></div>
			<div id="live_container"><?php sunswift_live(); ?></div>
		</div>
	</div>
	<div id="body">
		<div id="body-container">
			<div id="content">
				<div id="page">
					<div class="page_title"><?php wp_title('',true,''); ?></div>
					<div class="page_content">
						<?php if(have_posts()) :
							while (have_posts()) : the_post(); 
								the_content();
							endwhile; // TODO: post.php so to include an anchor for #comments
						endif; ?>
					</div>
				</div>
			</div>
		</div>
		<div id="sidebar"><?php get_sidebar(); ?></div>
	</div>
	<div id="footer"><?php get_footer(); ?></div>
</div>
</body>
</html>