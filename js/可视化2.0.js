// 这里是将excel里面的数据拿出来
if(document.getElementById('readFile')){
    // console.log('使用id为readFile的input dom对象获取上传文件的内容，并以json格式返回数据');
    document.getElementById('readFile').addEventListener('change',function(excelFile){
        let  files = excelFile.target.files;
        // 这里不太懂!!!
        // console.log(files);
		if(files.length == 0) {
            alert('Excel文件上传失败');
        }
        else{
            alert('Excel文件上传成功');
        }
		let  file = files[0];
        // console.log(file);
		let  reader = new FileReader();
        // console.log(reader+'是这个哦');
        // 创建一个reader对象
        // 紧跟着的是read对象的属性和方法
		reader.readAsBinaryString(file);
        reader.onload = function(excelFile){
            let data = excelFile.target.result;
            // console.log(data);这里出来的是乱码
            let workbook = XLSX.read(data,{type : 'binary'});
            // console.log(workbook);
            let sheetNames = workbook.SheetNames;
            // console.log(sheetNames);
            let worksheet = workbook.Sheets[sheetNames[0]];
            // console.log(worksheet);
            // 这一步操作就把excal表拿到了
            let json = XLSX.utils.sheet_to_json(worksheet);
            // 以上这4个也明白！！！
            // console.log(json);
            // 这里就将数据转化成json格式,这里返回的是一个列表数据，里面的内容是每一行excal的数据，转化的字典数据
            if(typeof(callback) == 'function'){
                callback(json);
            }
            if(typeof(callbackSecond) == 'function'){
                callbackSecond(json);
                document.getElementById('readFile').value = null;
            }
            // 回调函数，当复函数执行完成之后，会执行回调函数
        }
    });
}
// 这里开始就是echarts对公司类型进行数据可视化操作
function callback(result){
    // alert('完成'+typeof(result));
    var cT = [];
    var num;
    for (num in result){
        var companyType = result[num].公司类型.split('（')[0]
        cT.push(companyType);
        // 将传进来的json数据,通过for循环来遍历列表中所有的元素(即每个对象，也可以叫做字典)，然后通过.属性名来拿到想要的值，并通过split()[0]来拿到指定字符前的数据，并通过.push写进事先声明好的数组里面
    }
    // console.log(cT);
    function getCompanyTypeCnt(){
        var len = cT.length;
        var obj = {};
        // console.log(len);
        for(var i = 0 ; i < len ; i++){
            if(cT[i] !=''){
                obj[cT[i]] = (obj[cT[i]] + 1) || 1;
                // 注意这里给obj对象添加属性一定是要用这种形式的，不要用.属性名的形式
            } 
        }
        // 这里使用了对象的特点，当对象属性不在的时候利用obj[cT[i]] = (obj[cT[i]] + 1) || 1;创建一个对象并赋值为1，当对象名在的时候，就是去修改对象属性的值，也就是obj[cT[i]] + 1实现对数组中元素的计数。
        // console.log(obj);
        var params = [];
        for(var key in obj){
            var param = {};
            param.value = obj[key];
            param.name = key;
            params.push(param);
        }
        // 这里查看的网上的教程，是为了变成满足echarts要求的数据格式，即数组里面嵌套着字典
        // console.log(params);
        // 这里往下就是echarts的使用
        var chartDom = document.getElementById('demo');
        var myChart = echarts.init(chartDom);
        var option;
        option = {
            title: {
                text: '公司类型',
                left: 'center',
                top : 35
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '访问来源',
                    type: 'pie',
                    radius: '50%',
                    data: params,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        option && myChart.setOption(option);
    }
    getCompanyTypeCnt();
}

// 这里开始就是echarts对公司规模进行数据可视化操作
function callbackSecond(result){
    // console.log('真的成功了')
    var cZ = [];
    var num;
    for (num in result){
        var companySize = result[num].公司规模;
        cZ.push(companySize);
    }
    // console.log(cZ);
    var obj = {};
    var len = cZ.length;
    var companySizeParseIntY = [];
    var companySizeParseIntX = [];
    var companySizeY = [];
    var companySizeX = [];
    for (var i = 0 ; i < len ; i++){
        if(cZ[i] != ''){
            if(cZ[i] == '少于50人'){
                obj['2-50人'] = (obj['2-50人']+ 1) || 1;
            }
            else{
                obj[cZ[i]] = (obj[cZ[i]]+ 1) || 1;
                // 注意这里给obj对象添加属性一定是要用这种形式的，不要用.属性名的形式
            }  
        }
    }
    // console.log(obj);
    for(var k in obj){
        // console.log(k);
        companySizeParseIntY.push(parseInt(k));
        // 这里是冒泡排序，之后多看看
        let temp = [];
        var len = companySizeParseIntY.length;
        for (var t = 0 ; t < len; t++) {
            for (var j = 0; j <= t; j++) {
                if (companySizeParseIntY[t] < companySizeParseIntY[j]) {
                    temp = companySizeParseIntY[t];
                    companySizeParseIntY[t] = companySizeParseIntY[j];
                    companySizeParseIntY[j] = temp;
                }
            }
        }
    }
    // console.log(companySizeParseIntY);
    // 这里获得的就是想要的按顺序的人数列表
    for(var h = 0 ; h < len ; h++){
        // console.log(len);
        for(var k in obj){
            // console.log(k);
            if(companySizeParseIntY[h] == parseInt(k)){
                companySizeY.push(k);
                companySizeX.push(obj[k]);
            }
        }
    }
    // 这个双层for循环就是为了通过排序好的列表，按照想要的顺序去写入对应的x与y值的列表
    // console.log(companySizeY);
    // console.log(companySizeX);
    var chartDom = document.getElementById('demo2');
    var myChart = echarts.init(chartDom);
    var option;
    option = {
        title: {
            text: '公司规模',
            left: 'center',
            top:20
        },
        yAxis: {
            type: 'category',
            data: companySizeY
        },
        xAxis: {
            type: 'value'
        },
        series: [{
            data: companySizeX,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
                color: 'rgba(180, 180, 180, 0.2)'
            },
            itemStyle: {      
                normal: {
                    label: {
                        show: true, 
                        position: 'right', 
                        textStyle: { 
                            color: 'black',
                            fontSize: 14
                        }
                    }
                }
            }
        }]
    };
    option && myChart.setOption(option);        
}