<?php
/*
* @package WordPress
* @subpackage Sunswift
* @since Sunswift 1.0
*/


add_action( 'after_setup_theme', 'sunswift_setup' );

if ( ! function_exists( 'sunswift_setup' ) ):

function sunswift_setup () {
	define('PATHPREFIX', '/wp-content/themes/sunswift/');
	
	define( 'LOGO_IMAGE', PATHPREFIX.'/images/logo.png' );	// TODO: Not hardcoded
	define( 'SCRIPTSPATH', PATHPREFIX.'js');
	
	if ( !is_admin() ) { // instruction to only load if it is not the admin area
	   // register your script location, dependencies and version
	
	/*
	   	wp_deregister_script( 'jquery' );
	   wp_register_script( 'jquery', 'http://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js');
		//wp_register_script( 'jquery', get_bloginfo('template_directory') . '/js/jquery.js');
	   	wp_register_script('libraries', get_bloginfo('template_directory') . '/js/libraries.js', array('jquery') );
	   	wp_register_script('live', get_bloginfo('template_directory') . '/js/live.js', array('libraries') );
		wp_register_script('javascript', get_bloginfo('template_directory') . '/js/javascript.js', array('libraries') );
		wp_enqueue_script('jquery');
		wp_enqueue_script('libraries');
		wp_enqueue_script('live');
		wp_enqueue_script('javascript');
	
	*/
	}
}

endif;

if ( ! function_exists( 'get_navigation' ) ):

function get_navigation () {
	
	$args = array('title_li' => '');
	
	wp_list_pages( $args);
?>
<!--
<ul>
					<li>Home</li>
					<li>About
						<ul>
							<li>Us</li>
							<li>Our Cars</li>
							<li>Our Achievements</li>
							<li>The University</li>
							<li>The Race</li>
						</ul>
					</li>
					<li>Supporters
						<ul>
							<li>Our Sponsors</li>
							<li>Our Donors</li>
							<li>More Information</li>
						</ul>
					</li>
					<li>Community
						<ul>
							<li>Education</li>
							<li>Open Source</li>
						</ul>
					</li>
					<li>Press
						<ul>
							<li>Press Releases</li>
							<li>Media Resources</li>
						</ul>
					</li>
					<li>Contact</li>
				</ul>
			-->

<?php
}

endif;

if ( ! function_exists( 'get_panel_image ') ) :

function get_panel_image() {
?>
<img src="<?php echo PATHPREFIX; ?>/images/panels/panel1.jpg" width="780" height="225" alt="Home Panel">
<?php
}

endif;

if ( ! function_exists( 'sunswift_posted_on' ) ) :

function sunswift_posted_on() {
	printf( __( '<span class="%1$s">Posted on</span> %2$s <span class="meta-sep">by</span> %3$s', 'sunswift' ),
		'meta-prep meta-prep-author',
		sprintf( '<a href="%1$s" title="%2$s" rel="bookmark"><span class="entry-date">%3$s</span></a>',
			get_permalink(),
			esc_attr( get_the_time() ),
			get_the_date()
		),
		sprintf( '<span class="author vcard"><a class="url fn n" href="%1$s" title="%2$s">%3$s</a></span>',
			get_author_posts_url( get_the_author_meta( 'ID' ) ),
			sprintf( esc_attr__( 'View all posts by %s', 'sunswift' ), get_the_author() ),
			get_the_author()
		)
	);
}
endif;


if ( ! function_exists( 'sunswift_comment' ) ) :
/**
 * Template for comments and pingbacks.
 *
 * To override this walker in a child theme without modifying the comments template
 * simply create your own sunswift_comment(), and that function will be used instead.
 *
 * Used as a callback by wp_list_comments() for displaying the comments.
 *
 * @since Sunswift 1.0
 */
function sunswift_comment( $comment, $args, $depth ) {
	$GLOBALS['comment'] = $comment;
	switch ( $comment->comment_type ) :
		case '' :
	?>
	<li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>">
		<div id="comment-<?php comment_ID(); ?>">
		<div class="comment-author vcard">
			<?php echo get_avatar( $comment, 40 ); ?>
			<?php printf( __( '%s <span class="says">says:</span>', 'sunswift' ), sprintf( '<cite class="fn">%s</cite>', get_comment_author_link() ) ); ?>
		</div><!-- .comment-author .vcard -->
		<?php if ( $comment->comment_approved == '0' ) : ?>
			<em><?php _e( 'Your comment is awaiting moderation.', 'sunswift' ); ?></em>
			<br />
		<?php endif; ?>

		<div class="comment-meta commentmetadata"><a href="<?php echo esc_url( get_comment_link( $comment->comment_ID ) ); ?>">
			<?php
				/* translators: 1: date, 2: time */
				printf( __( '%1$s at %2$s', 'sunswift' ), get_comment_date(),  get_comment_time() ); ?></a><?php edit_comment_link( __( '(Edit)', 'sunswift' ), ' ' );
			?>
		</div><!-- .comment-meta .commentmetadata -->

		<div class="comment-body"><?php comment_text(); ?></div>

		<div class="reply">
			<?php comment_reply_link( array_merge( $args, array( 'depth' => $depth, 'max_depth' => $args['max_depth'] ) ) ); ?>
		</div><!-- .reply -->
	</div><!-- #comment-##  -->

	<?php
			break;
		case 'pingback'  :
		case 'trackback' :
	?>
	<li class="post pingback">
		<p><?php _e( 'Pingback:', 'sunswift' ); ?> <?php comment_author_link(); ?><?php edit_comment_link( __('(Edit)', 'sunswift'), ' ' ); ?></p>
	<?php
			break;
	endswitch;
}
endif;

if ( ! function_exists( 'sunswift_live' ) ) :

function sunswift_live() {
	require("live.php");
}

endif;


function get_live_replay_events() {
?>
<select id="replay_events">
	<option value="default">Loading...</option>
</select>

<?php
}


?>