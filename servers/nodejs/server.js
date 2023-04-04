/*
* Server nodejs
* Description: Get video, audio player
* Author: AlekPet
*/
const http = require('http');
const url  = require('url');

function code(res,params){
	let path_vid = params.path_vid || null,
	name_vid = params.name_vid || null,
	index_vid = params.index_vid || 1,
	
	styles = '',
	body = ''
	codeHTML = ''
	
	if (!path_vid && !name_vid){
		body = `<h3>NOT CORRECT REQUEST: Not valid 'path_vid' = ${path_vid} or 'name_vid' = ${name_vid}!</h3>`
	} else {
	
            path_vid = decodeURIComponent(path_vid)
            name_vid = decodeURIComponent(name_vid)
            
            let link_tor = `${path_vid}&index=${index_vid}&play`,
            source = ''
			styles = '<link href="https://vjs.zencdn.net/7.20.3/video-js.css" rel="stylesheet" />'

		
			if (name_vid.lastIndexOf('.mp3')!=-1 || name_vid.lastIndexOf('.ogg') !=-1){
                source = `<source src="${link_tor}" type="audio/mp3" />`                
			} else if (name_vid.lastIndexOf('.m3u8')!=-1){
                source = `<source src="${link_tor}" type="application/x-mpegURL" />`                
			} else {
				source = `<source src="${link_tor}" type="video/mp4" />`
			}

			
			body = `<video-js id="media_tor">
            ${source}
            <p class="vjs-no-js">To view this video or audio please enable JavaScript, and consider upgrading to a web browser that<a href="https://videojs.com/html5-video-support/" target="_blank">supports HTML5 video or video</a></p>
        </video-js>
        
        <script src="https://vjs.zencdn.net/7.20.3/video.min.js" type="text/javascript"></script>

        <script>
			const player = videojs('media_tor', {
              controls: true,
              autoplay: true,
              preload: 'auto',
              muted: true,
              //fluid: true,
              //fill: true
              aspectRatio: '16:9',
              responsive: true,
            })

            /*player.ready(function() {
                this.play()
                setTimeout(function(){
                    player.muted(false)
                    this.play()
                }, 5000)                
            });*/		
		</script>`
	}

	codeHTML = `<!doctype html>
<html>
    <head>
        <style>
        * {{
            padding:0;
            margin:0;
        }}
        </style>
		${styles}
    </head>
    <body>
        ${body}
    </body>
</html>`
	res.writeHead(200, {"Content-Type": "text/html; charset=utf-8;"});
	res.end(codeHTML)	
}

function get_params(path){
	let _path = path,
	params = {}
	
	if(_path.includes('&')){
		_path.split('&').forEach((zn, indx)=>{
			let [par, val] = zn.split('=')			
			params[par] = val
		})
		} else {
		let [par, val] = _path.split('=')
		params[par] = val
	}
	return params
}

const requestListener = function (req, res) {
	let path_r = url.parse(req.url),
	params = {}
	
	if(path_r.path.includes('?')){		
		params = get_params(path_r.query)
	}	
	
	if(path_r.pathname === '/frame'){
		code(res,params)
	} else {	
		res.writeHead(200, {"Content-Type": "text/html; charset=utf-8;"});
		res.end('<b>Incorrect request!</b>');	
	}

}

const server = http.createServer(requestListener),
host = 'localhost'
port = 8000

server.listen(port, host, function(){
	console.log(`Server running on ${host}:${port}`)
});