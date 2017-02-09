/**
 * 灰色半透明背景风格
 */
Highcharts.theme_gray = {
	colors: ["#DDDF0D",  "#55BF3B",  "#2DC0F0", "#DF5353", "#9F72F8","#F77C08", "#B7F218"],
	chart: {
		backgroundColor: 'rgba(96, 96, 96,0.55)',
		borderWidth: 0,
		borderRadius: 3,
		plotBackgroundColor: null,
		plotShadow: false,
		plotBorderWidth: 0
	},
	title: {
		style: {
			color: '#FFF',
			font: 'normal 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
		},
		y:8,
		margin:20
	},
	xAxis: {
		gridLineWidth: 0,
		lineColor: '#c0c0c0',
		tickColor: '#c0c0c0',
		labels: {
			style: {
				color: '#fff'
			},
			y:18
		}
	},
	yAxis: {
		alternateGridColor: null,
		minorTickInterval: null,
		gridLineColor: 'rgba(255, 255, 255, .4)',
		minorGridLineColor: 'rgba(255,255,255,1)',
		lineWidth: 0,
		tickWidth: 0,
		labels: {
			style: {
				color: '#f0f0f0'
			},
			formatter: function(){
                    if(this.value>=10000)
                        return this.value/10000+' 万';
                    else if(this.value>=1000)
                        return this.value/1000 +' 千'; 
                    else
                        return this.value
            }
		},
		title: {
			style: {
				color: '#f0f0f0',
				font: 'normal 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
			}
		}
	},
	legend: {
		itemStyle: {
			color: '#f8f8f8',
			font: 'normal 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
		},
		itemHoverStyle: {
			color: '#FFF'
		},
		itemHiddenStyle: {
			color: '#777'
			
		},
		backgroundColor:"rgba(175,252,254,.1)",
		borderWidth:0,
		borderRadius:5,
		y:10
	},
	labels: {
		style: {
			color: '#CCC'
		}
	},
	tooltip: {
		backgroundColor: {
			linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
			stops: [
				[0, 'rgba(66, 66, 66, .5)'],
				[1, 'rgba(16, 16, 16, .5)']
			]
		},
		borderWidth: 0,
		style: {
			color: '#FFF'
		},
		snap:5,
        hideDelay:0,
		shadow:false
	},
	plotOptions: {
		series: {
			shadow: false
		},
		line: {
			dataLabels: {
				color: '#CCC'
			},
			marker: {
				lineWidth:0,
				radius:1
			}
		},
		spline: {
			marker: {
				lineWidth:0,
				radius:0
			}
		},
		column:{
		    borderWidth:0,
		    borderRadius:1
		},
		area:{
		   lineWidth:0,
		   marker:{
                lineWidth:0,
				radius:0
		   	}
		},
		scatter: {
			marker: {
				lineColor: '#333'
			}
		},
		candlestick: {
			lineColor: 'white'
		},
		pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'white'
                    }
                }
            }
	},
	toolbar: {
		itemStyle: {
			color: '#CCC'
		}
	},
	navigation: {
		buttonOptions: {
			symbolStroke: '#DDDDDD',
			hoverSymbolStroke: '#FFFFFF',
			theme: {
				fill: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
					stops: [
						[0.4, '#606060'],
						[0.6, '#333333']
					]
				},
				stroke: '#000000'
			}
		}
	},
	// scroll charts
	rangeSelector: {
		buttonTheme: {
			fill: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
					[0.4, '#888'],
					[0.6, '#555']
				]
			},
			stroke: '#000000',
			style: {
				color: '#CCC',
				fontWeight: 'bold'
			},
			states: {
				hover: {
					fill: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
						stops: [
							[0.4, '#BBB'],
							[0.6, '#888']
						]
					},
					stroke: '#000000',
					style: {
						color: 'white'
					}
				},
				select: {
					fill: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
						stops: [
							[0.1, '#000'],
							[0.3, '#333']
						]
					},
					stroke: '#000000',
					style: {
						color: 'yellow'
					}
				}
			}
		},
		inputStyle: {
			backgroundColor: '#333',
			color: 'silver'
		},
		labelStyle: {
			color: 'silver'
		}
	},

	navigator: {
		handles: {
			backgroundColor: '#666',
			borderColor: '#AAA'
		},
		outlineColor: '#CCC',
		maskFill: 'rgba(16, 16, 16, 0.5)',
		series: {
			color: '#7798BF',
			lineColor: '#A6C7ED'
		}
	},

	scrollbar: {
		barBackgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
					[0.4, '#888'],
					[0.6, '#555']
				]
			},
		barBorderColor: '#CCC',
		buttonArrowColor: '#CCC',
		buttonBackgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
					[0.4, '#888'],
					[0.6, '#555']
				]
			},
		buttonBorderColor: '#CCC',
		rifleColor: '#FFF',
		trackBackgroundColor: {
			linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
			stops: [
				[0, '#000'],
				[1, '#333']
			]
		},
		trackBorderColor: '#666'
	},

	// special colors for some of the demo examples
	legendBackgroundColor: 'rgba(48, 48, 48, 0.8)',
	legendBackgroundColorSolid: 'rgb(70, 70, 70)',
	dataLabelsColor: '#444',
	textColor: '#E0E0E0',
	maskColor: 'rgba(255,255,255,0.3)'
};
/**
 * 默认风格
 */
Highcharts.theme_white = {
	colors: [ "#70C624","#DB810A", "#09C3B6","#0994C3","#2DC0F0",   "#DDDF0D", "#B7F218"],
	chart: {
		backgroundColor: 'rgba(243, 243, 243,1)',
		borderWidth: 0,
		borderRadius: 3,
		plotBackgroundColor: null,
		plotShadow: false,
		plotBorderWidth: 0
	},
	title: {
		style: {
			color: '#444',
			font: 'normal 12px Microsoft Yahei,Arial,Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
		}
	},
	subtitle: {
		style: {
			color: 'black'
		}
	},
	tooltip: {
		borderWidth: 0
	},
	legend: {
		itemStyle: {
			color:'#444',
			font: 'normal 12px Microsoft Yahei,Arial,Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
		}
	},
	xAxis: {
		labels: {
			style: {
				color: '#6e6e70'
			}
		}
	},
	yAxis: {
		gridLineColor: "#DDD",
		labels: {
			style: {
				color: '#6e6e70',
				font: 'normal 12px Microsoft Yahei,Arial,Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
			}
		},
		title:{
		  style:{color:'#6e6e70'}
		}
	},
	plotOptions: {
		series: {
			shadow: false
		},
		line: {
			dataLabels: {
				color: '#CCC'
			}
		},
		spline: {
		},
		column:{
		    borderWidth:0,
		    borderRadius:2,
		    pointWidth: 10
		},
		area:{
		   lineWidth:0,
		   marker:{
                lineWidth:0,
				radius:0
		   	}
		},
		scatter: {
			marker: {
				lineColor: '#333'
			}
		},
		pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            showInLegend: true,
            dataLabels: {
                enabled: false,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: '#555'
                }
            }
        }
	}
};
/**
 * maml 新增theme_transparent
 */
Highcharts.theme_transparent = {
	colors: ["#FF6666","#FF9900"],
	chart: {
		backgroundColor: 'rgba(96, 96, 96,0)',
		borderWidth: 0,
		borderRadius: 0,
		plotBackgroundColor: null,
		plotShadow: false,
		plotBorderWidth: 0
	},
	title: {
		style: {
			color: '#FFF',
			font: 'normal 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
		},
		y:8,
		margin:20
	},
	xAxis: {
		gridLineWidth: 0,
		lineColor: '#c0c0c0',
		tickColor: '#c0c0c0',
		labels: {
			style: {
				color: '#fff'
			},
			y:4
		}
	},
	yAxis: {
		alternateGridColor: null,
		minorTickInterval: null,
		gridLineColor: "#666666",
		minorGridLineColor: 'rgba(255,255,255,1)',
		lineWidth: 0,
		tickWidth: 0,
		labels: {
			style: {
				color: '#f0f0f0'
			}
		},
		title: {
			style: {
				color: '#f0f0f0',
				font: 'normal 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
			}
		}
	},
	legend: {
		itemStyle: {
			color: '#f8f8f8',
			font: 'normal 12px Lucida Grande, Lucida Sans Unicode, Verdana, Arial, Helvetica, sans-serif'
		},
		itemHoverStyle: {
			color: '#FFF'
		},
		itemHiddenStyle: {
			color: '#777'
		},
		backgroundColor:"rgba(0,51,102,.3)",
		borderWidth:0,
		borderRadius:5,
		y:10
	},
	labels: {
		style: {
			color: '#CCC'
		}
	},
	tooltip: {
		backgroundColor: "rgba(0,51,102,1)",
		borderWidth: 0,
		style: {
			color: '#CCC'
		},
		snap:5,
        hideDelay:0,
		shadow:false
	},
	plotOptions: {
		series: {
			shadow: false
		},
		line: {
			dataLabels: {
				color: '#CCC'
			}
		},
		spline: {
		},
		column:{
		    borderWidth:0,
		    borderRadius:1
		},
		area:{
		   lineWidth:0,
		   marker:{
                lineWidth:0,
				radius:0
		   	}
		},
		bar:{
			borderWidth:0,
			borderColor:"#FFF"
		},
		scatter: {
			marker: {
				lineColor: '#333'
			}
		},
		candlestick: {
			lineColor: 'white'
		},
		pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: true,
                format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                style: {
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                }
            }
        }
	},
	toolbar: {
		itemStyle: {
			color: '#CCC'
		}
	},
	navigation: {
		buttonOptions: {
			symbolStroke: '#DDDDDD',
			hoverSymbolStroke: '#FFFFFF',
			theme: {
				fill: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
					stops: [
						[0.4, '#606060'],
						[0.6, '#333333']
					]
				},
				stroke: '#000000'
			}
		}
	},
	// scroll charts
	rangeSelector: {
		buttonTheme: {
			fill: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
					[0.4, '#888'],
					[0.6, '#555']
				]
			},
			stroke: '#000000',
			style: {
				color: '#CCC',
				fontWeight: 'bold'
			},
			states: {
				hover: {
					fill: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
						stops: [
							[0.4, '#BBB'],
							[0.6, '#888']
						]
					},
					stroke: '#000000',
					style: {
						color: 'white'
					}
				},
				select: {
					fill: {
						linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
						stops: [
							[0.1, '#000'],
							[0.3, '#333']
						]
					},
					stroke: '#000000',
					style: {
						color: 'yellow'
					}
				}
			}
		},
		inputStyle: {
			backgroundColor: '#333',
			color: 'silver'
		},
		labelStyle: {
			color: 'silver'
		}
	},

	navigator: {
		handles: {
			backgroundColor: '#666',
			borderColor: '#AAA'
		},
		outlineColor: '#CCC',
		maskFill: 'rgba(16, 16, 16, 0.5)',
		series: {
			color: '#7798BF',
			lineColor: '#A6C7ED'
		}
	},

	scrollbar: {
		barBackgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
					[0.4, '#888'],
					[0.6, '#555']
				]
			},
		barBorderColor: '#CCC',
		buttonArrowColor: '#CCC',
		buttonBackgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
				stops: [
					[0.4, '#888'],
					[0.6, '#555']
				]
			},
		buttonBorderColor: '#CCC',
		rifleColor: '#FFF',
		trackBackgroundColor: {
			linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
			stops: [
				[0, '#000'],
				[1, '#333']
			]
		},
		trackBorderColor: '#666'
	},

	// special colors for some of the demo examples
	legendBackgroundColor: 'rgba(48, 48, 48, 0.8)',
	legendBackgroundColorSolid: 'rgb(70, 70, 70)',
	dataLabelsColor: '#444',
	textColor: '#E0E0E0',
	maskColor: 'rgba(255,255,255,0.3)'
};
// Apply the theme
//var highchartsOptions = Highcharts.setOptions(Highcharts.theme);
