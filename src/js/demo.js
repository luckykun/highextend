$(document).ready(function() {
    var mods = {
        Ajax: function(url, success) {
            $.ajax({
                url: url,
                type: 'get',
                dataType: 'json',
                timeout: 10000,
                success: function(d) {
                    var data = d.data;
                    success && success(data);
                },
                error: function(e) {
                    throw new Error(e);
                }
            });
        }
    };

    var fn = {
        bindEvent: function() {
            $('.left-nav li a').click(function() {
                $('.left-nav li a').removeClass('active');
                $(this).addClass('active');
            });

            $('.nav-tab').delegate('li', 'click', function() {
                var me = $(this);
                me.addClass('active');
                me.siblings().removeClass('active');
                var className = me.attr('data-area');
                // console.log(className);
                me.parents('.one-chart-area').find('.code').hide();
                me.parents('.one-chart-area').delay(100).find('div.' + className).show();
            });
        },

        drawChart: function() {

            mods.Ajax('/lineGrid1.json', function(data) {

                // var chart = Hxt.line('line-chart1', data);   //默认线图
                // var chart = Hxt.line('line-chart1', data);
                var elem = $('#line-chart1');
                Hxt.line(elem, data);

                var chart1 = Hxt.scatter('scatter-chart1', data, { //散点图
                    valueSuffix: '分'
                });

                var chart2 = Hxt.bubble('scatter-chart2', data, { //bubble图
                    legendEnabled: false,
                    shared: true,
                    valueSuffix: '分'
                });
                var chart3 = Hxt.column('column-chart1', data, { //column图
                    shared: true,
                    valueSuffix: '分'
                });
                var chart4 = Hxt.bar('column-chart2', data, { //column图
                    shared: true,
                    colors: ['#090', '#f90'],
                    valueSuffix: '分'
                });

                // $('.refresh').click(function(){
                //     chart.reload();
                // })
            });

            mods.Ajax('/lineGrid2.json', function(data) {
                var chart = Hxt.spline('line-chart2', data, { //曲线图
                    Xtype: 'datetime',
                    shared: true
                });
                // console.log(chart);
                chart.fn.setTitle({
                    text: '这是我动态设置的标题'
                });

                var chart1 = Hxt.area('area-chart2', data, { //曲线图
                    Xtype: 'datetime',
                    shared: true
                });
            });

            mods.Ajax('/lineGrid3.json', function(data) {
                var chart = Hxt.spline('line-chart3', data, { //显示流量数据（线图）。
                    Xtype: 'datetime',
                    Ytype: 'rate',
                    rateUnit: 2,
                    shared: true,
                    Ytitle: '使用流量情况(kb)'
                });
                var chart1 = Hxt.column('column-chart3', data, { //显示流量数据（柱状图）。
                    Xtype: 'datetime',
                    Ytype: 'rate',
                    shared: true
                });
            });

            mods.Ajax('/oneData.json', function(data) {
                var chart = Hxt.area('area-chart1', data, { //显示流量数据。
                    legendEnabled: false,
                    valueSuffix: '分'
                });
            });

            mods.Ajax('/liveData.json', function(data) {
                var chart = Hxt.spline('line-chart5', data, {
                    legendEnabled: false
                });
                var time = function() {
                    setTimeout(function() {
                        mods.Ajax('/liveData.json', function(d) {
                            var arr = d.categories;
                            var series = chart.fn.series[0]; //如果有多条线，可用循环chart.fn.series操作
                            var x = 'addX';
                            var y = Math.random().toFixed(2) * 50;
                            series.addPoint([x, y], true, true);

                            time();
                        });
                    }, 2000);
                };
                time();

                var chart2 = Hxt.spline('line-chart6', data, {
                    shared: true
                });

                var num = 1;
                var time1 = function() {
                    var colors = chart2.fn.options.colors;
                    if (num < 4) {
                        setTimeout(function() {
                            chart2.fn.addSeries({
                                name: 'name' + num,
                                data: [num * 50, num * 50, num * 50, num * 50, num * 50, num * 50, num * 50],
                                color: colors[num]
                            });
                            num++;
                            time1();
                        }, 3000);
                    } else {
                        setTimeout(function() {
                            var series = chart2.fn.series;
                            series[series.length - 1].remove();
                            num = num == 6 ? 1 : num + 1;
                            time1();
                        }, 3000);
                    }
                };
                time1();

            });

            mods.Ajax('/pieData1.json', function(data) {
                // var chart = Hxt.pie('pie-chart1', data);
                var elem = $('#pie-chart1');
                Hxt.pie(elem, data);

                var chart1 = Hxt.pie('pie-chart2', data, {
                    startAngle: -90,
                    endAngle: 90
                });
                var chart2 = Hxt.pie('pie-chart3', data, {
                    size: '90%',
                    innerSize: '0%',
                    pieLabel: '一共有',
                    valueSuffix: '台',
                    showInLegend: false
                });
                var chart4 = Hxt.pie('pie-chart5', data, {
                    size: '90%',
                    showInLegend: false,
                    pieClick: function(e) {
                        console.log(e.point.name);
                    },
                    pieMouseOut: function() {
                        console.log('leave');
                    }
                });

            });

            mods.Ajax('/pieData2.json', function(data) {
                var chart3 = Hxt.pie('pie-chart4', data, {
                    valueSuffix: '%',
                    showPercentLabels: true
                });
                var chart4 = Hxt.pyramid('more-chart2', data, {
                    marginRight: 50
                });
            });

            mods.Ajax('/barData.json', function(data) {
                var chart1 = Hxt.bar('column-chart4', data, {
                    barStacking: 'normal',
                    valueSuffix: '人',
                    shared: true
                });
            });

            mods.Ajax('/polarData.json', function(data) {
                var chart1 = Hxt.polar('more-chart1', data, {
                    marginTop: 30,
                    legendEnabled: false,
                    valueSuffix: '分',
                    shared: true,
                    markerEnabled: false
                });
            });

            mods.Ajax('/emptyData.json', function(data) {
                var chart = Hxt.spline('line-chart4', data, {
                    emptyHtml: '<div style="padding-top:100px;text-align:center;font-size:16px;">sorry，没有查询到相关数据...</div>'
                });
            });

            mods.Ajax('/mixData.json', function(data) {
                var chart = Hxt.mix('mix-chart1', data, {
                    valueSuffix: '斤',
                    mixPieCenter: [60, 50],
                    mixPieSize: '55%',
                    shared: true,
                    chartLabel: {
                        html: '水果两天的总销量',
                        style: {
                            left: '30px',
                            top: '5px'
                        }
                    }
                });
            });


            //测试图表在这里绘制
            var data = {
                "items": [{
                    "data": [1,2,3, 4, 5],
                    "name": "tom"
                }, {
                    "data": [5,5,5,5,5],
                    "name": "jane"
                }],
                "timeScope": {
                    "interval": 86400000,
                    "start": 1452700800000
                }
            };

            var config = {
                valueSuffix: '条',
                Xtype: 'datetime',
                shared: true
            };

            var elem = $('#test-chart');
            Hxt.area(elem, data, config);
        }
    };


    var init = function() {
        fn.bindEvent();
        fn.drawChart();



        $(window).scroll(function() {
            var a = $(window).scrollTop();

            if (a > 100) {
                $('.go-top').fadeIn();
            } else {
                $('.go-top').fadeOut();
            }
        });

        $(".go-top").click(function() {
            $("html,body").animate({
                scrollTop: "0px"
            }, '600');
        });


    };

    init();


});
