let SETTING = {};

$(function () {
	SETTING = {
		ACTIVE:"is-active", //アクティブ時のクラス名
		CURRENT:"is-current", //カレント時のクラス名
		DEVICE:"", //デバイス判定
		$body:$('body'), //DOM全体
		isbodyFixed:false, //スクロール禁止判定
		isHeaderFixed:false, //ヘッダー固定判定
	}
});