let FUNC = {};



/*---------------------------------------------------------------------
	getDevice (デバイス判定の取得)

	デバイスの切り替え時にリロードする場合
	changeFlg:
		0 = 切り替え時リロード無し
		1 = sp <-> tab pc 切り替え時リロード
		2 = sp <-> tab <-> pc 切り替え時リロード
---------------------------------------------------------------------*/
FUNC.getDevice = function (changeFlg){
	if(typeof changeFlg === 'undefined') changeFlg = 0;

	const $hideTab = $('.hide-tab[data-device]').eq(0);
	const $hidePc = $('.hide-pc[data-device]').eq(0);
	let deviceBefore = ''; //画面サイズ変更前のデバイス情報
	let deviceAfter = ''; //画面サイズ変更後のデバイス情報

	function refresh(){
		// デバイスサイズの設定
		if ( $hidePc.is(':hidden') ) {
			deviceAfter = 'pc';

		}else if( $hideTab.is(':hidden') ){
			deviceAfter = 'tab';

		}else{
			deviceAfter = 'sp';

		}

		// デバイスサイズ切り替え時の処理
		if( deviceBefore == '' ){
			//初回：設定のみ
			SETTING.DEVICE = deviceAfter;
			deviceBefore = deviceAfter;

		}else if( deviceAfter != deviceBefore){
			//デバイス設定更新
			SETTING.DEVICE = deviceAfter;

			//切り替え処理
			if( changeFlg != 0 && ( deviceAfter == 'sp' || deviceBefore == 'sp' ) ){
				//changeFlg 1 = sp <-> tab pc 切り替え時リロード
				location.reload();

			}else if( changeFlg == 2 ){
				//changeFlg 2 = sp <-> tab <-> pc 切り替え時リロード
				location.reload();

			}else{
				FUNC.layoutReset();
			}

			// 画面サイズ変更前のデバイス情報更新
			deviceBefore = deviceAfter;
		}
	}

	$(window).on(
		'resize',
		$.throttle (150,function(){
			refresh();
		})
	);


	refresh();
};


//レイアウト初期化
FUNC.layoutReset = function () {
};


/*---------------------------------------------------------------------
	pageTop (ページトップへ戻るボタンの初期化)

	isFade:
		true = スクロールしたらフェードで表示する
		false = 常に表示
	isFixed:
		true = フッターにめり込まないようにする
		false = 常にfixed状態、フッター位置に影響されない
---------------------------------------------------------------------*/
FUNC.pageTop = function (isFade,isFixed){
	if(typeof isFade === 'undefined') isFade = true;
	if(typeof isFixed === 'undefined') isFixed = true;
	const $win = $(window);
	const $pagetop = $('[data-pagetop]');
	const $pagetopBtn = $pagetop.find('[data-pagetop-btn]');


	if(isFade){
		$win.on('scroll', $.throttle ( 150, function(){
			const scrollTop = $win.scrollTop();

			if ( scrollTop > 50 ) {
				$pagetop.fadeIn(200);
			}
			else {
				$pagetop.fadeOut(200);
			}
		}));
	}else{
		$pagetop.show();
	}


	if(isFixed){

		$win.on('scroll', function(){
			const scrollHeight = $(document).height(); //ドキュメントの高さ
			const scrollPosition = $win.height() + $win.scrollTop(); //現在地
			const footHeight = $("#l-footer").innerHeight(); //footerの高さ（＝止めたい位置
			let abjustPosY = 18;

			if( SETTING.DEVICE != 'sp') {
				abjustPosY = 23;
			}

			if ( scrollHeight - scrollPosition  <= footHeight ) { //ドキュメントの高さと現在地の差がfooterの高さ以下になったら
				$pagetopBtn.css({
					"position":"absolute", //pisitionをabsolute（親：wrapperからの絶対値）に変更
					"bottom": footHeight + abjustPosY //下からfooterの高さ + 20px上げた位置に配置
				});
			}else{ //それ以外の場合は
				$pagetopBtn.css({
					"position":"fixed", //固定表示
					"bottom": abjustPosY //下から20px上げた位置に
				});
			}
		});
	}
};





/*---------------------------------------------------------------------
	accordion（アコーディオン）
---------------------------------------------------------------------*/
FUNC.accordion = function () {
	$('[data-accordion] [aria-controls]').each(function(){
		const $this = $(this);

			$this.on('click', function(e){
				const $this = $(this);
				if(
					$this.closest('[data-accordion]').data('accordion') == "" ||
					( $this.closest('[data-accordion]').data('accordion').match(/sp/) && SETTING.DEVICE == 'sp') ||
					( $this.closest('[data-accordion]').data('accordion').match(/tab/) && SETTING.DEVICE == 'tab') ||
					( $this.closest('[data-accordion]').data('accordion').match(/pc/) && SETTING.DEVICE == 'pc')

				){
					e.preventDefault();

					const $this = $(this);
					const $parent = $this.closest('[data-accordion]');
					const $target = $parent.find('[aria-hidden]');

					if ( $parent.hasClass(SETTING.ACTIVE) ) {
						$target.stop().slideUp();
						$parent.removeClass(SETTING.ACTIVE);

						$this.attr('aria-expanded',false );
						$target.attr('aria-hidden',true );

					} else {
						$parent.addClass(SETTING.ACTIVE);
						$target.stop().slideDown();
						$this.attr('aria-expanded',true );
						$target.attr('aria-hidden',false );
					}
				}
			});

	});
};



