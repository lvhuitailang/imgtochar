

var txtDiv = document.getElementById('txt');
var fileBtn = document.getElementById("up-button");
var copyBtn = document.getElementById("coby");

let size = 6;//图片大小：整数，默认6（数值越小则图片越大,最低1）
let charArr = ['8','&','$','*','A','o','!',';','.'];//填充字符(长度:9)
// let charArr = ['[', ',', ']', '*', 'O', '.', '@', '\\', '`', '/', '=', '^', 'o'];//填充字符(长度:9)

// let charArrTest = ['我','是','大','帅','哥','!',';','.'];//填充字符(长度:9)

let totalImgArr = [];
let totalSourctImgArr = [];

fileBtn.onchange = readImg;
// 根据灰度生成相应字符
function toText(g) {
    let sepNum = parseInt(255/charArr.length);
    let charIndex = parseInt(g / sepNum);
    if(charIndex > charArr.length-1){
        charIndex = charIndex-1;
    }
    return charArr[charIndex];
}
// 根据rgb值计算灰度
function getGray(r, g, b) {
    return 0.299 * r + 0.578 * g + 0.114 * b;
}
// 转换
function init() {
    totalSourctImgArr.push(this);

    let cv  = document.createElement('canvas');
    let c = cv.getContext('2d');

    let gl_width = this.width;
    let gl_height = this.height;

    txtDiv.style.width = gl_width + 'px';
    cv.width = gl_width;
    cv.height = gl_height;
    c.drawImage(this, 0, 0);
    var imgData = c.getImageData(0, 0, gl_width, gl_height);
    var imgDataArr = imgData.data;
    let singleImgArr = [];
    for (h = 0; h < gl_height; h += size*2) {
        let textArrLine = [];
        for (w = 0; w < gl_width; w += size) {
            var index = (w + gl_width * h) * 4;
            var r = imgDataArr[index + 0];
            var g = imgDataArr[index + 1];
            var b = imgDataArr[index + 2];
            var gray = getGray(r, g, b);
            textArrLine.push(gray);
        }
        singleImgArr.push(textArrLine);
    }
    totalImgArr.push(singleImgArr);

}
// 获取图片
function readImg() {
    totalImgArr = [];
    totalSourctImgArr = [];
    let file = this.files[0];
    let type = file.type;

    let img_data_list = [];
    if('image/gif' == type){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            let divTemp = document.createElement('div');
            let imgTemp = document.createElement('img');
            divTemp.appendChild(imgTemp);
            imgTemp.src = reader.result;
            imgTemp.onload=function(){
                let rub = new SuperGif({ gif: imgTemp} );
                rub.load(() => {
                    for (let i=1; i <= rub.get_length(); i++) {
                        rub.move_to(i);
                        img_data_list.push(rub.get_canvas().toDataURL('image/jpeg',0.8));
                    }
                    genImageData(img_data_list);
                });
            }
        }

    }else if('image/jpeg' == type || 'image/png' == type){
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            img_data_list.push(reader.result);
            genImageData(img_data_list);
        }

    }


}
//生成
function genImageData(img_list){
    for(let img_index = 0;img_index < img_list.length;img_index++){
        let imgItem = img_list[img_index];
        let imgTemp = new Image();
        imgTemp.onload = init;
        imgTemp.src=imgItem;
    }
    drawChar(totalImgArr);
    drawSourImg(totalSourctImgArr);

}

function drawChar(charArr){
    setTimeout(()=>{
        if(charArr.length == 1){
            let textArr = charArr[0];
            let html = '';
            for(let lines of textArr){
                let p = '<p>';
                for(let col of lines){
                    p += toText(col);
                }
                p += '</p>';
                html+=p;

            }
            txtDiv.innerHTML = html;

        }else{
            let imgIndex = 0;
            setInterval(()=>{
                if(imgIndex >= charArr.length){
                    imgIndex = 0;
                }

                let textArr = charArr[imgIndex];
                let html = '';
                for(let lines of textArr){
                    let p = '<p>';
                    for(let col of lines){
                        p += toText(col);
                    }
                    p += '</p>';
                    html+=p;

                }
                txtDiv.innerHTML = html;
                imgIndex=imgIndex+1;

            },300);
        }

    },1000);

}
function drawSourImg(imgArr){
    var cv = document.getElementById('sourceImg');
    var c = cv.getContext('2d');

    setTimeout(()=>{
        if(imgArr.length == 1){
            let gl_width = imgArr[0].width;
            let gl_height = imgArr[0].height;
            cv.width = gl_width;
            cv.height = gl_height;
            c.drawImage(imgArr[0], 0, 0);


        }else{
            let gl_width = imgArr[0].width;
            let gl_height = imgArr[0].height;
            cv.width = gl_width;
            cv.height = gl_height;
            let imgIndex = 0;
            setInterval(()=>{
                if(imgIndex >= imgArr.length){
                    imgIndex = 0;
                }

                let singleImg = imgArr[imgIndex];
                c.clearRect(0,0,gl_width,gl_height);
                c.drawImage(singleImg, 0, 0);
                imgIndex=imgIndex+1;

            },300);


        }
    },1000);
}