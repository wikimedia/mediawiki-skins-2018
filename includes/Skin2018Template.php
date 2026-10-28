<?php

use MediaWiki\Html\TemplateParser;

/**
 * BaseTemplate class for the 2018 skin
 *
 * @ingroup Skins
 */
class Skin2018Template extends BaseTemplate {
	/**
	 * Outputs the content of the page
	 */
	public function execute() {
		// Rearrange parts of $this->data for easier handling in the template
		unset( $this->data['nav_urls']['mainpage'] );
		if ( isset( $this->data['content_navigation']['actions']['watch'] ) ) {
			$this->data['watch_indicator'] = $this->data['content_navigation']['actions']['watch'];
			unset( $this->data['content_navigation']['actions']['watch'] );
		} elseif ( isset( $this->data['content_navigation']['actions']['unwatch'] ) ) {
			$this->data['watch_indicator'] = $this->data['content_navigation']['actions']['unwatch'];
			unset( $this->data['content_navigation']['actions']['unwatch'] );
		}

		$this->data['personal_urls_2018'] = array_values(
				array_merge(
				$this->data['content_navigation']['user-page'],
				$this->data['content_navigation']['user-menu']
			)
		);
		// Output <body> using Mustache
		$templateParser = new TemplateParser( __DIR__ . '/../resources/templates' );

		$html = $templateParser->processTemplate(
			'main', $this->data
		);
		echo $html;
	}
}
