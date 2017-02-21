<%@ page language="java" contentType="text/html; charset=GB2312" pageEncoding="GB2312"%>

<!DOCTYPE HTML>
<html>
<head>
<title>流量监控配置</title>
<meta charset="GB2312">
<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
<link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="bootstrap/css/bootstrap.fontface.css">
<link rel="stylesheet" type="text/css" href="bootstrap/colorpicker/css/bootstrap-colorpicker.min.css">
<link rel="stylesheet" type="text/css" href="/nms/jquery-easyui-1.4/themes/bootstrap/easyui.css">
<link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<%
String viewID = request.getParameter("viewid")==null?"":request.getParameter("viewid");
%>
<body>
  <div id="wrapper">
    <div class="view-holder" id="top-level">
      <div class="view-config-holder">
        <div class="view-config"></div>  
      </div>
      <div class="view-tip"><span>请点击右上角按钮进行添加区域</span></div>
      <span class="glyphicon glyphicon-plus" id="top-add-btn"></span>
    </div>
    <div class="view-holder" id="center-level">
      <div class="view-config">
        <div class="view-area">
          <table>
            <tr>
              <td width="40%" align="right">区域名称：</td>
              <td width="60%" name="area-name" align="left"></td>
            </tr>
            <tr>
              <td width="40%" align="right">中心设备：</td>
              <td width="60%" name="devices-name" align="left"></td>
            </tr>
            <tr>
              <td width="40%" align="right">互联电路属性：</td>
              <td width="60%" name="incirprop-text" align="left"></td>
            </tr>
          </table>
        </div>
      </div>
      <div class="view-tip"><span>请点击右上角按钮进行配置区域</span></div>
      <span class="glyphicon glyphicon-pencil" id="center-edit-btn"></span>
    </div>
    <div class="view-holder" id="bottom-level">
      <div class="view-config-holder"><div class="view-config"></div></div>
      <div class="view-tip"><span>请点击右上角按钮进行添加区域</span></div>
      <span class="glyphicon glyphicon-plus" id="bottom-add-btn"></span>
    </div>
    <div class="legend-holder">
      <div class="legend-config-holder">
        <ul>
        </ul>
      </div>
      <div class="view-tip"><span>请点击右上角按钮进行配置图例</span></div>
      <span class="glyphicon glyphicon-pencil" id="legend-edit-btn"></span>
    </div>
    <div class="btn-holder">
      <span class="btn btn-ok">确定</span>
    </div>
  </div>
  <div id="window-holder">
    <div class="config-window" id="top-config-window">
      <table>
        <tr>
          <td width="20%" align="right">区域名称：</td>
          <td width="80%"><input name="area-name" type="text" /></td>
        </tr>
        <tr>
          <td width="20%" align="right">背景颜色：</td>
          <td width="80%"><input name="bg-color" type="text" data-format="hex" /></td>
        </tr>
        <tr>
          <td width="20%" align="right">中心设备：</td>
          <td width="80%"><ul class="selected-devices"></ul><span class="small-btn select-device-btn" config-window="top-config-window">选择</span></td>
        </tr>
        <tr>
          <td width="20%" align="right">上联电路属性：</td>
          <td width="80%"><input class="cirprop upcirprop" type="text" /></td>
        </tr>
        <tr>
          <td width="20%" align="right">互联电路属性：</td>
          <td width="80%"><input class="cirprop incirprop" type="text" /></td>
        </tr>
        <tr>
          <td width="20%" align="right">下联电路属性：</td>
          <td width="80%"><input class="cirprop downcirprop" type="text" /></td>
        </tr>
      </table>
      <div class="btn-holder">
        <span class="btn btn-ok" config-window="top-config-window" rel-level="top-level">确定</span>
        <span class="btn btn-cancle" config-window="top-config-window" rel-level="top-level">取消</span>
      </div>
    </div>
    <div class="config-window" id="center-config-window">
      <table>
        <tr>
          <td width="20%" align="right">区域名称：</td>
          <td width="80%"><input name="area-name" type="text" /></td>
        </tr>
        <tr>
          <td width="20%" align="right">背景颜色：</td>
          <td width="80%"><input name="bg-color" type="text" data-format="hex" /></td>
        </tr>
        <tr>
          <td width="20%" align="right">中心设备：</td>
          <td width="80%"><ul class="selected-devices"></ul><span class="small-btn select-device-btn" config-window="center-config-window">选择</span></td>
        </tr>
        <tr>
          <td width="20%" align="right">互联电路属性：</td>
          <td width="80%"><input class="cirprop incirprop" type="text" /></td>
        </tr>
      </table>
      <div class="btn-holder">
        <span class="btn btn-ok" config-window="center-config-window" rel-level="center-level">确定</span>
        <span class="btn btn-cancle" config-window="center-config-window" rel-level="center-level">取消</span>
      </div>
    </div>
    <div class="config-window" id="bottom-config-window">
      <table>
        <tr>
          <td width="20%" align="right">区域名称：</td>
          <td width="80%"><input name="area-name" type="text" /></td>
        </tr>
        <tr>
          <td width="20%" align="right">背景颜色：</td>
          <td width="80%"><input name="bg-color" type="text" data-format="hex" /></td>
        </tr>
        <tr>
          <td width="20%" align="right">中心设备：</td>
          <td width="80%"><ul class="selected-devices"></ul><span class="small-btn select-device-btn" config-window="bottom-config-window">选择</span></td>
        </tr>
        <tr>
          <td width="20%" align="right">上联电路属性：</td>
          <td width="80%"><input class="cirprop upcirprop" type="text" /></td>
        </tr>
        <tr>
          <td width="20%" align="right">互联电路属性：</td>
          <td width="80%"><input class="cirprop incirprop" type="text" /></td>
        </tr>
        <tr>
          <td width="20%" align="right">下联电路属性：</td>
          <td width="80%"><input class="cirprop downcirprop" type="text" /></td>
        </tr>
      </table>
      <div class="btn-holder">
        <span class="btn btn-ok" config-window="bottom-config-window" rel-level="bottom-level">确定</span>
        <span class="btn btn-cancle" config-window="bottom-config-window" rel-level="bottom-level">取消</span>
      </div>
    </div>
    <div class="legend-config-window" id="legend-config-window">
      <ul></ul>
      <div class="btn-holder">
        <span class="btn btn-ok" config-window="legend-config-window" >确定</span>
        <span class="btn btn-cancle" config-window="legend-config-window">取消</span>
      </div>
    </div>
  </div>
  <input type="hidden" id="tempDeviceID" value="" />
  <input type="hidden" id="tempDeviceName" value="" />
  <input type="hidden" id="viewID" value="<%=viewID %>" />
  <script type="text/javascript" src="scripts/jquery-1.8.0.min.js"></script>
  <script type="text/javascript" src="/nms/jquery-easyui-1.4/jquery.easyui.min.js"></script>
  <script type="text/javascript" src="bootstrap/colorpicker/js/bootstrap-colorpicker.min.js"></script>
  <script type="text/javascript" src="scripts/util.js"></script>
  <script type="text/javascript" src="scripts/flowMonitorConfig.js"></script>
</body>
</html>
