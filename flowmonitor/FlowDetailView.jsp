
<!DOCTYPE HTML>
<html>
<head>
<title>������ϸ��ͼ</title>
<meta charset="GB2312">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
<link rel="stylesheet" type="text/css" href="css/style.css">
</head>

<body>
  <input type="hidden" id="circuitID" value="<%=circuitID%>" />
  <div id="wrapper">
    <p id="circuit-info">��·���ƣ�<span id="circuitName"></span><br> ��·����<span id="bandwidth"></span>������ɼ�ʱ�䣺<span id="fluxtime"></span>��</p>
    <div id="chart-day" class="chart"></div>
    <div id="chart-week" class="chart"></div>
    <div id="chart-month" class="chart"></div>
    <div id="chart-year" class="chart"></div>
  </div>
  <script type="text/javascript" src="scripts/jquery-1.8.0.min.js"></script>
  <script type="text/javascript" src="scripts/util.js"></script>
  <script type="text/javascript" src="scripts/echarts.min.js"></script>
  <script type="text/javascript" src="mock/mock.js"></script>
	<script type="text/javascript" src="mock/use-mock.js"></script>
  <script type="text/javascript" src="scripts/flowDetailView.js"></script>
</body>
</html>
