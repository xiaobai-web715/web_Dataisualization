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
            }
            if(typeof(callbackThird) == 'function'){
                callbackThird(json);
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
                // 注意这里给obj对象添加属性一定是要用这种形式的，不要用.属性名的形式，因为cT[i]提取出来的是字符串，.name不能是字符串，而是一个变量名
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
// 从这里开始是地区数据可视化操作
function callbackThird(result){
    // console.log(result);
    var wA = [];
    var num;
    for(num in result){
        wA.push(result[num].地区.split('-')[0]);
    }
    // console.log(wA);
    // 取出了地区列表
    var obj = {};
    var len = wA.length;
    // console.log(len);
    for(var g = 0 ; g < len ; g++){
        if(wA[g] != '异地招聘'){
            obj[wA[g]] = (obj[wA[g]] + 1) || 1;
        }
    }
    // 加一个冒泡排序法来获得地区次数排名
    var areaNumber = [];
    for(var area in obj){
        areaNumber.push(obj[area]);
    }
    var areaNumberLen = areaNumber.length;
    // var areaNumberList = [];
    // for(var a = 0 ; a < areaNumberLen ; a++){
    //     for(var b = 0 ; b <= a ; b++){
    //         if(areaNumber[a] < areaNumber[b]){
    //             areaNumberList = areaNumber[a];
    //             areaNumber[a] = areaNumber[b];
    //             areaNumber[b] = areaNumberList;
    //         }
    //     }
    // }
    // 这里换成.sort方法,当返回值时大于0的数的时候就会将两个数的位置进行调换,从而实现升序排列
    areaNumber.sort(function(largeNumber,smallNumber){
        return largeNumber - smallNumber;
    })
    // console.log(areaNumber);
    var numMin = areaNumber[0];
    var numMax = areaNumber[areaNumberLen - 1];
    // 这里获取最大与最小值，提供给下面的颜色选择使用
    // console.log(numMin,numMax);
    // 加一个冒泡排序法
    // console.log(obj);
    var params = [];
        for(var key in obj){
            var param = {};
            param.value = obj[key];
            param.name = key;
            params.push(param);
        }
    // console.log(params);
    var geoCoordMap = {
        '海门':[121.15,31.89],
        '鄂尔多斯':[109.781327,39.608266],
        '招远':[120.38,37.35],
        '舟山':[122.207216,29.985295],
        '齐齐哈尔':[123.97,47.33],
        '盐城':[120.13,33.38],
        '赤峰':[118.87,42.28],
        '青岛':[120.33,36.07],
        '乳山':[121.52,36.89],
        '金昌':[102.188043,38.520089],
        '泉州':[118.58,24.93],
        '莱西':[120.53,36.86],
        '日照':[119.46,35.42],
        '胶南':[119.97,35.88],
        '南通':[121.05,32.08],
        '拉萨':[91.11,29.97],
        '云浮':[112.02,22.93],
        '梅州':[116.1,24.55],
        '文登':[122.05,37.2],
        '上海':[121.48,31.22],
        '攀枝花':[101.718637,26.582347],
        '威海':[122.1,37.5],
        '承德':[117.93,40.97],
        '厦门':[118.1,24.46],
        '汕尾':[115.375279,22.786211],
        '潮州':[116.63,23.68],
        '丹东':[124.37,40.13],
        '太仓':[121.1,31.45],
        '曲靖':[103.79,25.51],
        '烟台':[121.39,37.52],
        '福州':[119.3,26.08],
        '瓦房店':[121.979603,39.627114],
        '即墨':[120.45,36.38],
        '抚顺':[123.97,41.97],
        '玉溪':[102.52,24.35],
        '张家口':[114.87,40.82],
        '阳泉':[113.57,37.85],
        '莱州':[119.942327,37.177017],
        '湖州':[120.1,30.86],
        '汕头':[116.69,23.39],
        '昆山':[120.95,31.39],
        '宁波':[121.56,29.86],
        '湛江':[110.359377,21.270708],
        '揭阳':[116.35,23.55],
        '荣成':[122.41,37.16],
        '连云港':[119.16,34.59],
        '葫芦岛':[120.836932,40.711052],
        '常熟':[120.74,31.64],
        '东莞':[113.75,23.04],
        '河源':[114.68,23.73],
        '淮安':[119.15,33.5],
        '泰州':[119.9,32.49],
        '南宁':[108.33,22.84],
        '营口':[122.18,40.65],
        '惠州':[114.4,23.09],
        '江阴':[120.26,31.91],
        '蓬莱':[120.75,37.8],
        '韶关':[113.62,24.84],
        '嘉峪关':[98.289152,39.77313],
        '广州':[113.23,23.16],
        '延安':[109.47,36.6],
        '太原':[112.53,37.87],
        '清远':[113.01,23.7],
        '中山':[113.38,22.52],
        '昆明':[102.73,25.04],
        '寿光':[118.73,36.86],
        '盘锦':[122.070714,41.119997],
        '长治':[113.08,36.18],
        '深圳':[114.07,22.62],
        '珠海':[113.52,22.3],
        '宿迁':[118.3,33.96],
        '咸阳':[108.72,34.36],
        '铜川':[109.11,35.09],
        '平度':[119.97,36.77],
        '佛山':[113.11,23.05],
        '海口':[110.35,20.02],
        '江门':[113.06,22.61],
        '章丘':[117.53,36.72],
        '肇庆':[112.44,23.05],
        '大连':[121.62,38.92],
        '临汾':[111.5,36.08],
        '吴江':[120.63,31.16],
        '石嘴山':[106.39,39.04],
        '沈阳':[123.38,41.8],
        '苏州':[120.62,31.32],
        '茂名':[110.88,21.68],
        '嘉兴':[120.76,30.77],
        '长春':[125.35,43.88],
        '胶州':[120.03336,36.264622],
        '银川':[106.27,38.47],
        '张家港':[120.555821,31.875428],
        '三门峡':[111.19,34.76],
        '锦州':[121.15,41.13],
        '南昌':[115.89,28.68],
        '柳州':[109.4,24.33],
        '三亚':[109.511909,18.252847],
        '自贡':[104.778442,29.33903],
        '吉林':[126.57,43.87],
        '阳江':[111.95,21.85],
        '泸州':[105.39,28.91],
        '西宁':[101.74,36.56],
        '宜宾':[104.56,29.77],
        '呼和浩特':[111.65,40.82],
        '成都':[104.06,30.67],
        '大同':[113.3,40.12],
        '镇江':[119.44,32.2],
        '桂林':[110.28,25.29],
        '张家界':[110.479191,29.117096],
        '宜兴':[119.82,31.36],
        '北海':[109.12,21.49],
        '西安':[108.95,34.27],
        '金坛':[119.56,31.74],
        '东营':[118.49,37.46],
        '牡丹江':[129.58,44.6],
        '遵义':[106.9,27.7],
        '绍兴':[120.58,30.01],
        '扬州':[119.42,32.39],
        '常州':[119.95,31.79],
        '潍坊':[119.1,36.62],
        '重庆':[106.54,29.59],
        '台州':[121.420757,28.656386],
        '南京':[118.78,32.04],
        '滨州':[118.03,37.36],
        '贵阳':[106.71,26.57],
        '无锡':[120.29,31.59],
        '本溪':[123.73,41.3],
        '克拉玛依':[84.77,45.59],
        '渭南':[109.5,34.52],
        '马鞍山':[118.48,31.56],
        '宝鸡':[107.15,34.38],
        '焦作':[113.21,35.24],
        '句容':[119.16,31.95],
        '北京':[116.46,39.92],
        '徐州':[117.2,34.26],
        '衡水':[115.72,37.72],
        '包头':[110,40.58],
        '绵阳':[104.73,31.48],
        '乌鲁木齐':[87.68,43.77],
        '枣庄':[117.57,34.86],
        '杭州':[120.19,30.26],
        '淄博':[118.05,36.78],
        '鞍山':[122.85,41.12],
        '溧阳':[119.48,31.43],
        '库尔勒':[86.06,41.68],
        '安阳':[114.35,36.1],
        '开封':[114.35,34.79],
        '济南':[117,36.65],
        '德阳':[104.37,31.13],
        '温州':[120.65,28.01],
        '九江':[115.97,29.71],
        '邯郸':[114.47,36.6],
        '临安':[119.72,30.23],
        '兰州':[103.73,36.03],
        '沧州':[116.83,38.33],
        '临沂':[118.35,35.05],
        '南充':[106.110698,30.837793],
        '天津':[117.2,39.13],
        '富阳':[119.95,30.07],
        '泰安':[117.13,36.18],
        '诸暨':[120.23,29.71],
        '郑州':[113.65,34.76],
        '哈尔滨':[126.63,45.75],
        '聊城':[115.97,36.45],
        '芜湖':[118.38,31.33],
        '唐山':[118.02,39.63],
        '平顶山':[113.29,33.75],
        '邢台':[114.48,37.05],
        '德州':[116.29,37.45],
        '济宁':[116.59,35.38],
        '荆州':[112.239741,30.335165],
        '宜昌':[111.3,30.7],
        '义乌':[120.06,29.32],
        '丽水':[119.92,28.45],
        '洛阳':[112.44,34.7],
        '秦皇岛':[119.57,39.95],
        '株洲':[113.16,27.83],
        '石家庄':[114.48,38.03],
        '莱芜':[117.67,36.19],
        '常德':[111.69,29.05],
        '保定':[115.48,38.85],
        '湘潭':[112.91,27.87],
        '金华':[119.64,29.12],
        '岳阳':[113.09,29.37],
        '长沙':[113,28.21],
        '衢州':[118.88,28.97],
        '廊坊':[116.7,39.53],
        '菏泽':[115.480656,35.23375],
        '合肥':[117.27,31.86],
        '武汉':[114.31,30.52],
        '大庆':[125.03,46.58]
    };
    var convertData = function (params) {
        var res = [];
        for (var i = 0; i < params.length; i++) {
            var geoCoord = geoCoordMap[params[i].name];
            if (geoCoord) {
                res.push({
                    name: params[i].name,
                    value: geoCoord.concat(params[i].value)
                });
            }
        }
        return res;
    };
    var myChart = echarts.init(document.getElementById('demo3'));
    var option;
    option = {
        title: {
            text: '人才需求分布图',
            left: 'center',
            top: 20
        },
        geo: {
            map: 'china',
            roam: true,// 一定要关闭拖拽
            zoom: 1.23,
            center: [105, 36], // 调整地图位置
            // 对于显示省份的调整
            label: {
                normal: {
                    show: false, //关闭省份名展示
                    // fontSize: "12",
                    // color: "rgba(0,0,0,1)"
                },
                emphasis: {
                    show: true,
                    fontSize: "12",
                    color: "rgba(0,0,0,1)"
                }
            }
        },
        // 给数值添加颜色的属性
        visualMap: {
            min: numMin,
            max: numMax,
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            inRange: {
                color: ['lightskyblue', 'yellow', 'orangered']
            }
        },
        series : [
            {
                // name: 'pm2.5',
                type: 'scatter',
                coordinateSystem: 'geo',
                // 注意在这里要修改一下，变成上面调用地图的方式
                data: convertData(params),
                symbolSize: 10,
                // 这里用来设置圆形图标的大小
                encode: {
                    value: 2
                },
                label: {
                    formatter: '{b}',
                    position: 'right',
                    show: false
                },
                emphasis: {
                    label: {
                        show: true
                    }
                }
            },
        ]
    };
    option && myChart.setOption(option);
}