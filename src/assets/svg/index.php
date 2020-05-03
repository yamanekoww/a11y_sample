<?php

createSVG();
function createSVG(){
	$filename = basename($_SERVER['REQUEST_URI']);
	$filename = str_replace("?" . $_SERVER['QUERY_STRING'], "", $filename);

	$color = isset($_GET['c']) ? htmlspecialchars($_GET['c'], ENT_QUOTES) : "";

	//指定拡張子はSVGか
	if(strrchr($filename, '.') === '.svg'){
		//コンテンツ取得
		if($file = @file_get_contents('./' . $filename) ){
			//色指定があるか
			if( preg_match('/^([a-f0-9]{3}){1,2}$/i',$color)){
				// fill箇所の置換
				$pattern = '/(fill|stroke)="#([a-f0-9]{3}){1,2}"/i';
				$file = preg_replace($pattern, "$1='#{$color}'", $file);
				// echo "色変更";
			}else{
				// echo "<br>色指定が適切ではありません";
			}

			//SVG出力
			header("content-type:image/svg+xml; charset=utf-8");
			// http_response_code(200);
			echo $file;
			exit;
		}else{
			// echo "<br>svgの取得に失敗しました";
			errorOutput();
		}
	}else{
		//error404出力
		// echo "<br>svg拡張子ではありません";
		errorOutput();
	}

}
function errorOutput(){
	// http_response_code(404);
	header('HTTP/1.1 404 Not Found');
	exit;
}
?>