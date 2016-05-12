
# Highextend文档


## 使用方法

```js
 	Hxt.line(elem, data, options);         //渲染默认折线图
	Hxt.spline(elem, data, options);         //曲线图
	Hxt.scatter(elem, data, options);         //散点图
	Hxt.bubble(elem, data, options);         //bubble图
	Hxt.column(elem, data, options);         //柱状图
	Hxt.bar(elem, data, options);         //bar图，（横向柱状图）
	Hxt.area(elem, data, options);         //区域图（默认为平滑区域图）
	Hxt.pie(elem, data, options);         //圆饼图
	Hxt.polar(elem, data, options);         //雷达图
	Hxt.pyramid(elem, data, options);         //金字塔图
	Hxt.mix(elem, data, options);         //混合图
```


- elem：绘制图表元素的id
- data：图表的数据。数据格式见[图表接口规范文档](http://csfe.alibaba.net:8888/doc/3)。
- options：图表配置项,`可以为空，为空则使用默认配置。`

example:

```js
	var chart = Hxt.spline('line-chart3', data, {    //显示流量数据（线图）。
		Xtype: 'datetime',
		Ytype: 'rate',
		shared: true,
		Ytitle: '使用流量情况(kb)'
	});
```


另外，你还可以[去demo中心看看](http://localhost:3010/)

## 配置项说明

### 公共配置项

- `emptyHtml`: 数据为空时的提示信息，支持html格式。

- `backgroundColor`: 图表背景颜色，默认为’白色‘。

- `marginTop`: 图形的上边距，例如 marginTop: 60。

- `marginRight`: 图形的上边距，例如 marginRight: 60。

- `chartLoad`: 设置图形加载方式。一般实时动态数据会配置此项。

- `colors`: 颜色，`类型为数组`。非必选，有默认的颜色。

- `title`: 图表标题，默认为空。

- `subtitle`: 副标题，默认为空。

- `markerEnabled`: 是否显示线条上的点，默认`true`为显示。

- `markerSymbol`: 线条上点的形状，默认为‘circle’圆形，并且默认样式为空心。其他值有‘square’，‘diamond’，‘triangle’等。

- `legendEnabled`: 图例是否显示，默认为`true`，显示图例。

- `legendLayout`: 图例显示方式，默认为水平方向：‘horizontal’。 ‘vertical’为垂直方向。

- `legendAlign`: 水平方向显示位置，默认中间位置：‘center’，其他值有‘right’，‘left’。

- `legendVerticalAlign`: 垂直方向显示位置，默认‘bottom’，其他值有‘top’，‘middle’。

- `legendItemMarginBottom`: 每个图例的下边距，默认为4px。

- `shared`: tooltip提示框是否被共享。默认为`false`。

- `valuePrefix`: tooltip悬浮框value值前面的字符，默认为空。

- `valueSuffix`: tooltip悬浮框value值后面的字符，默认为空。

- `xDateFormat`: tooltip中时间转化格式，默认为‘%Y-%m-%d’，即‘2016-01-10’。

- `chartLabel`： 图形中的提示文案，格式为对象，如：{html:'title', style:{left:'30px', top: '5px'}}。


### 线图/柱状图配置项


- `Xtype`: 横坐标类型，默认为空。`如设置'datetime'，则为时间类型，默认转为'01-01'格式`。

- `Ytitle`: 纵坐标标题，默认为空。

- `Ytype`: 纵坐标类型，默认为空。`如设置'rate',则用1024为单位计算，且默认单位为‘kb’，大于1024单位变为‘M’`。



### 饼图配置项

- `size`: 饼图的整体大小（百分比），默认为100%。

- `innerSize`: 内圆所占的百分比，默认为55%。

- `showInLegend`: 设置圆饼图的图例是否显示，默认为`true`。

- `startAngle`: 圆饼图的开始角度。

- `endAngle`: 圆饼图的结束角度。

- `pieLabel`: 设置圆饼图的series文案，默认为`数量`。

- `pieClick`: 圆饼图的点击事件。

- `pieMouseOut`: 圆饼图的mouseout事件。

- `pieMouseOver`: 圆饼图的mouseover事件。


### 雷达图配置项

- `polarType`: 雷达图的形状，可设置为‘circle’－圆形，默认为‘polygon’－菱形。

- `polarSize`: 雷达图大小百分比，默认95%。


### 正负对比图（bar）配置项

- `barStacking`: 设置为“normal”－表示正负对比图。


### 混合图特有配置项

- `mixPieCenter`: 混合图中饼图的特有设置--中心原点坐标，如[100,50]。

- `mixPieSize`: 混合图中饼图的特有设置--饼图大小，默认为‘60%’。

- `mixPieInnerSize`: 混合图中饼图的特有设置--饼图空心圆大小，默认为0。

- `miePieShowInLegend`: 混合图中饼图的特有设置--是否显示legend，默认为false。




## 实例方法

上述使用方法中创建了一个chart示例。

这个实例有一些特有的方法。

- bindEvent:  添加事件。
- reLoad： 刷新图表。


除此之外，此实例还拥有所有Highcharts暴露出的所有方法。
