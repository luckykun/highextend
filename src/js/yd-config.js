/**
 * created by yikun on 2016-03-03
 */
(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = root.document ?
            factory(root) :
            factory;
    } else {
        root.Highextend = factory(root);
    }
}(typeof window !== 'undefined' ? window : this, function(win) {

    function error(msg, stop) {
        var message = 'Highextend error: ' + msg;
        if (stop) {
            throw new Error(message);
        }
        if (win.console) {
            console.error(message);
        }
    }

    var Highextend;
    var version = '0.0.3';
    var H = win.Highcharts || error('Highcharts is not found', true);
    var emptyHtml = '<div style="padding-top:100px;text-align:center;font-size:16px;">sorry,没有查询到数据！</div>';

    var defaultConfig = {
        chart: {
            backgroundColor: '#fff',
            events: {
                load: null
            }
        },

        title: {
            text: null
        },

        subtitle: {
            text: ''
        },

        labels: {
            items: []
        },

        legend: {
            itemStyle: {
                color: '#606060'
            },
            itemHoverStyle: {
                color: '#999'
            }
        },

        credits: {
            enabled: false
        },

        colors: ['#09c', '#ff9800', '#096', '#00bcd4', '#fc6', '#0277bd', '#f63', '#4caf50', '#9c27b0', '#607d8b', '#069', '#e91e63', '#cddc39', '#673ab7', '#795548'],

        xAxis: {
            tickmarkPlacement: 'on',
            labels: {

            }
        },
        yAxis: {
            gridLineInterpolation: 'polygon', //只针对雷达图有效
            title: {
                text: '' //y轴的单位
            },
            labels: {

            }
        },
        pane: { //针对雷达图的设置
            size: '100%'
        },

        tooltip: {
            xDateFormat: '%Y-%m-%d',
            backgroundColor: {
                linearGradient: {
                    x1: 0,
                    y1: 0,
                    x2: 0,
                    y2: 1
                },
                stops: [
                    [0, 'rgba(96, 96, 96, .8)'],
                    [1, 'rgba(16, 16, 16, .8)']
                ]
            },
            borderWidth: 0,
            style: {
                color: '#FFF'
            }
        },

        plotOptions: {
            series: {
                fillOpacity: 0.2, //只对区域图有效
                marker: {
                    symbol: 'circle',
                    fillColor: '#fff',
                    lineWidth: 2
                        // lineColor: null
                }
            },
            pie: {
                showInLegend: true,
                allowPointSelect: true, //点击时，是否允许突出
                size: '105%',
                innerSize: '55%',
                dataLabels: {
                    enabled: false,
                    color: '#333333',
                    connectorColor: '#333333',
                    format: '<b>{point.name}</b>:{point.percentage:.1f}%'
                },
                events: {

                }
            },
            scatter: {
                marker: {
                    radius: 8,
                    states: {
                        hover: {
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.key}</b><br/>'
                }
            },
            bubble: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                tooltip: {
                    headerFormat: '<b>{point.key}</b><br/>'
                }
            },
            bar: {

            },
            areaspline: {

            }
        }

    };

    var map = {
        config: {},
        legendArr: ['legendEnabled', 'legendLayout', 'legendAlign', 'legendItemMarginBottom', 'legendVerticalAlign'],
        tooltipArr: ['valuePrefix', 'valueSuffix', 'xDateFormat', 'shared'],
        pieArr: ['size', 'innerSize', 'showInLegend', 'startAngle', 'endAngle'],
        pieEventArr: ['pieClick', 'pieMouseOut', 'pieMouseOver']
    };

    var mods = { //基础函数

        convertData: function(data, opts, type) {
            var d = data.items || [];
            var dataArr = [];

            if (type == 'pie' || type == 'pyramid') {
                for (var i = 0; i < d.length; i++) {
                    dataArr.push([d[i].name, d[i].data]);
                }
                return [{
                    name: opts.valueSuffix == '%' ? '占比' : opts.pieLabel || '数量',
                    data: dataArr
                }];
            } else if (type == 'polar') {
                for (var j = 0; j < d.length; j++) {
                    d[j].pointPlacement = 'on';
                }
                return d;
            } else if (type == 'mix') { // 混合图特有的配置
                var map = {
                    center: opts.mixPieCenter && opts.mixPieCenter || [100, 60],
                    size: opts.mixPieSize && opts.mixPieSize || '60%',
                    innerSize: opts.mixPieInnerSize && opts.mixPieInnerSize || 0,
                    showInLegend: opts.miePieShowInLegend ? true : false
                };
                for (var k = 0; k < d.length; k++) {
                    if (d[k].type == 'pie') {
                        for (var n in map) {
                            d[k][n] = map[n];
                        }
                    }
                }
                return d;
            } else {
                return d;
            }

        },

        replaceStr: function(str, key) { //去掉str中的key字符串 ,然后首字母变小写, 比如：pieClick --> click
            var str1 = str.replace(key, '');
            return str1.replace(/\b\w+\b/g, function(word) {
                return word.substring(0, 1).toLowerCase() + word.substring(1);
            });
        },

        formatRate: function(value) { //flag指的是坐标轴还是tooltip
            return value < 1024 ? (function() {
                return value == 0 ? 0 : value + 'KB';
            })() : (function() {
                return value < 1048576 ? Math.round((value / 1024) * Math.pow(10, 2)) / Math.pow(10, 2) + 'MB' : (function() {
                    return Math.round((value / 1048576) * Math.pow(10, 2)) / Math.pow(10, 2) + 'GB';
                })();
            })();
        },

        cloneObj: function(obj) {
            var o = obj.constructor == Object ? new obj.constructor() : new obj.constructor(obj.valueOf());
            for (var key in obj) {
                if (o[key] != obj[key]) {
                    if (typeof(obj[key]) == 'object') {
                        o[key] = mods.cloneObj(obj[key]);
                    } else {
                        o[key] = obj[key];
                    }
                }
            }
            return o;
        },

        dateFormatter: function(value, options, d, type) { //type表示坐标轴还是tooltip
            if (options.Xtype == 'datetime') {
                var interval = parseInt(d.timeScope.interval);
                if (interval >= (24 * 3600 * 1000)) { //一天
                    return type == 'axis' ? Highcharts.dateFormat('%m-%d', value) : (function() {
                        return type == 'tooltip' ? '%Y-%m-%d' : Highcharts.dateFormat('%Y-%m-%d', value);
                    })();
                } else if (interval >= 3600000) { //一小时到一天
                    return type == 'axis' ? Highcharts.dateFormat('%H:%M', value) : (function() {
                        return type == 'tooltip' ? '%Y-%m-%d %H:%M' : Highcharts.dateFormat('%Y-%m-%d %H:%M', value);
                    })();
                } else {
                    return type == 'axis' ? Highcharts.dateFormat('%H:%M:%S', value) : (function() {
                        return type == 'tooltip' ? '%Y-%m-%d %H:%M:%S' : Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', value);
                    })();
                }
            } else {
                return value;
            }
        }

    };

    var Chart = function() { //图表类
        this.version = version;
        this.defaultConfig = defaultConfig;
    };

    Chart.prototype = {

        set: function(str, value) {
            if (value === undefined) return;

            var arr = str.split('.');

            if (arr.length == 1) {
                map.config[arr[0]] = value;
            } else if (arr.length == 2) {
                map.config[arr[0]][arr[1]] = value;
            } else if (arr.length == 3) {
                map.config[arr[0]][arr[1]][arr[2]] = value;
            } else if (arr.length == 4) {
                map.config[arr[0]][arr[1]][arr[2]][arr[3]] = value;
            }
        },

        setExtendConfig: function(d, options) { //非饼图，需要坐标轴配置

            var rateUnit = options.rateUnit || 1;
            this.set('xAxis.categories', d.categories);
            this.set('xAxis.type', options.Xtype);
            this.set('xAxis.tickWidth', options.XtickWidth);
            this.set('yAxis.title.text', options.Ytitle);
            this.set('yAxis.tickInterval', options.Ytype == 'rate' ? (1024 * rateUnit) : null);
            this.set('xAxis.labels.formatter', function() {
                return mods.dateFormatter(this.value, options, d, 'axis');
            });
            this.set('yAxis.labels.formatter', function() {
                var value = parseInt(this.value);
                if (options.Ytype == 'rate') { //如果y轴按流量计算
                    return mods.formatRate(value);
                } else {
                    return this.value;
                }
            });

            this.set('plotOptions.areaspline.fillColor', (function() { //如果只有一条线，区域图使用渐变色。
                if (!d.items || d.items.length > 1) return;
                return {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                    ]
                };
            })());

            this.set('tooltip.xDateFormat', mods.dateFormatter('', options, d, 'tooltip'));

            if (options.Ytype == 'rate') { //如果是流量类型，需要自定义tooltip格式
                this.set('tooltip.formatter', function() {
                    var value = mods.dateFormatter(this.x, options, d, 'rateTooltip');

                    var h = '<b>' + value + '</b>';

                    if (options.shared && typeof(this.points) == 'object') {
                        var arr = this.points;
                        for (var i = 0; i < arr.length; i++) {
                            h += '<br/>' + '<span style="color:' + arr[i].color + '">●</span>  ' + arr[i].series.name + ': ' + mods.formatRate(arr[i].y);
                        }
                    } else {
                        h += '<br/>' + '<span style="color:' + this.point.color + '">●</span>  ' + this.point.series.name + ': ' + mods.formatRate(this.point.y);
                    }
                    return h;
                });
            }
        },

        setPieConfig: function(d, options) { //饼图需要的配置项
            var pieArr = map.pieArr;
            if (options.pieClick) {
                this.set('plotOptions.pie.allowPointSelect', false);
                this.set('plotOptions.pie.cursor', 'pointer');
            }
            this.set('plotOptions.pie.dataLabels.enabled', options.showPercentLabels || false);
            for (var i = 0; i < pieArr.length; i++) {
                var str = pieArr[i];
                this.set('plotOptions.pie.' + str, options[str]);
            }
            var pieEventArr = map.pieEventArr;
            for (var j = 0; j < pieEventArr.length; j++) {
                var str1 = pieEventArr[j];
                this.set('plotOptions.pie.events.' + mods.replaceStr(str1, 'pie'), options[str1]);
            }
        },

        setPolarConfig: function(d, options) { //雷达图需要的配置项
            this.set('xAxis.categories', d.categories);
            this.set('yAxis.gridLineInterpolation', options.polarType);
            this.set('pane.size', options.polarSize);
            this.set('xAxis.lineWidth', 0);
        },

        setBarConfig: function(d, options) { //正负对比图的配置
            var arr = [{
                categories: d.categories,
                labels: {
                    step: 1
                }
            }, { // mirror axis on right side
                opposite: true,
                categories: d.categories,
                linkedTo: 0,
                labels: {
                    step: 1
                }
            }];
            this.set('xAxis', arr);
            this.set('plotOptions.bar.stacking', options.barStacking || null);
        },

        getConfig: function(elem, d, options, type) {

            if (type == 'polar') {
                this.set('chart.polar', true);
            } else {
                this.set('chart.type', type);
            }

            this.set('chart.renderTo', elem);
            this.set('chart.backgroundColor', options.backgroundColor);
            this.set('chart.marginTop', options.marginTop);
            this.set('chart.marginRight', options.marginRight);
            this.set('chart.events.load', options.chartLoad);
            this.set('colors', options.colors);
            this.set('title.text', options.title || null);
            this.set('subtitle.text', options.subtitle);

            var arr = [];
            var obj = arr.push(options.chartLabel && options.chartLabel || {});
            this.set('labels.items', arr);

            this.set('plotOptions.series.pointStart', d.timeScope && parseInt(d.timeScope.start) || null);
            this.set('plotOptions.series.pointInterval', d.timeScope && parseInt(d.timeScope.interval) || null);
            this.set('plotOptions.series.marker.enabled', options.markerEnabled);
            this.set('plotOptions.series.marker.symbol', options.markerSymbol);
            this.set('plotOptions.series.marker.lineColor', null);

            this.set('series', mods.convertData(d, options, type));


            var legendArr = map.legendArr;
            for (var i = 0; i < legendArr.length; i++) {
                var str = legendArr[i];
                var attr = mods.replaceStr(str, 'legend');
                this.set('legend.' + attr, options[str]);
            }

            this.set('tooltip.crosshairs', options.shared);
            var tooltipArr = map.tooltipArr;
            for (var j = 0; j < tooltipArr.length; j++) {
                var str1 = tooltipArr[j];
                this.set('tooltip.' + str1, options[str1]);
            }
            this.set('tooltip.pointFormatter', function() {
                var pre = options.valuePrefix ? options.valuePrefix : '';
                var suf = options.valueSuffix ? options.valueSuffix : '';
                return '<span style="color:' + this.color + '">●</span> ' + pre + this.series.name + ': ' + Math.abs(this.y) + suf + '<br/>';
            });

            if (type == 'scatter' || type == 'bubble') {
                this.set('plotOptions.series.marker', {});
                this.set('plotOptions.series.marker.symbol', 'circle');
                this.set('chart.zoomType', 'xy');
            }

            return map.config;
        },

        getChartConfig: function(elem, d, options, type) {
            map.config = mods.cloneObj(this.defaultConfig);

            if (type == 'pie') {
                this.setPieConfig(d, options);
            } else if (type == 'polar') {
                this.setPolarConfig(d, options);
            } else if (type == 'bar' && options.barStacking == 'normal') { //bar图形，并且带有正负比较
                this.setBarConfig(d, options);
                this.set('yAxis.labels.formatter', function() { //负数显示绝对值
                    return Math.abs(this.value);
                });
            } else {
                this.setExtendConfig(d, options); //坐标轴配置
            }

            var config = this.getConfig(elem, d, options, type);

            return config;

        }
    };

    function Hxt(elem, data, options) { //绘制图表类
        this.elem = elem;
        this.data = data || {};
        this.options = options || {};
    }

    Hxt.prototype = new Chart();
    Hxt.prototype.constructor = Hxt;
    Hxt.prototype.draw = function(str) {
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        this.type = str;
        var elem = this.elem,
            data = this.data,
            options = this.options;

        if (!data.items || data.items.length === 0) {
            var empty = options.emptyHtml || emptyHtml;
            if (typeof(elem) == 'string') {
                document.getElementById(elem).innerHTML = empty;
            } else {
                elem.html(empty);
            }
            return;
        }

        var type = str || 'spline';

        if (typeof(elem) == 'string') { // elem代表元素id

            var config = this.getChartConfig(elem, data, options, type);
            this.fn = new Highcharts.Chart(config);

        } else { // elem代表dom对象

            var config = this.getChartConfig('', data, options, type);
            delete config.chart.renderTo;
            elem.highcharts(config);

        }

        return this;
    };
    Hxt.prototype.reload = function() {
        this.draw(this.type);
    };


    Highextend = {
        line: function(selector, data, config) {
            return new Hxt(selector, data, config).draw('line');
        },

        spline: function(selector, data, config) {
            return new Hxt(selector, data, config).draw('spline');
        },

        scatter: function(selector, data, config) {
            return new Hxt(selector, data, config).draw('scatter');
        },

        bubble: function(selector, data, config) {
            return new Hxt(selector, data, config).draw('bubble');
        },

        column: function(selector, data, config) {
            return new Hxt(selector, data, config).draw('column');
        },

        bar: function(selector, data, config) {
            return new Hxt(selector, data, config).draw('bar');
        },

        area: function(selector, data, config) {
            return new Hxt(selector, data, config).draw('areaspline');
        },

        pie: function(selector, data, config) {
            return new Hxt(selector, data, config).draw('pie');
        },

        polar: function(selector, data, config) {
            return new Hxt(selector, data, config).draw('polar');
        },

        pyramid: function(selector, data, config) {
            return new Hxt(selector, data, config).draw('pyramid');
        },

        mix: function(selector, data, config) {
            return new Hxt(selector, data, config).draw('mix');
        }

    };

    /**
     * Exposed Static method
     * Example: Hxt.line()
     * return: object Hxt
     */


    if (win.Hxt) {
        error('Hxt is already exits', true);
    } else {
        win.Hxt = Highextend;
    }

}));
