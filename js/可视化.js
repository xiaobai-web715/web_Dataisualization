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
            // 这里就将数据转化成json格式
            if(typeof(callback) == 'function'){
                callback(json);
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
    for (num in result){
        var companyType = result[num].公司类型.split('（')[0]
        cT.push(companyType);
        // 将传进来的json数据,通过for循环来遍历所有的对象，然后通过.属性名来拿到想要的值，并通过split()[0]来拿到指定字符前的数据，并通过.push写进事先声明好的数组里面
    }
    // console.log(cT);
    function getCompanyTypeCnt(){
        var len = cT.length;
        var obj = {};
        // console.log(len);
        for(var i = 0 ; i < len ; i++){
            if(cT[i] !=''){
                obj[cT[i]] = (obj[cT[i]] + 1) || 1;
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



