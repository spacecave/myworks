<%@ page language="java" contentType="text/html; charset=GB2312" pageEncoding="GB2312"%>
<%@ page import="java.util.List" %>
<%@ page import="com.zhongying.view.flowmonitor.busi.FlowMonitorBusiBean" %>
<!DOCTYPE HTML>
<html>
  <head>
    <title>流量监控视图</title>
    <meta charset="GB2312">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1" />
    <link rel="stylesheet" type="text/css" href="css/style.css" >
  </head>
  <%
  FlowMonitorBusiBean bean = new FlowMonitorBusiBean();
  %>
  <body class="noscroll">
    <%
    String userName = session.getAttribute("LoginName")==null?"":session.getAttribute("LoginName").toString();
    String isframe = request.getParameter("isframe");
    if(bean.checkUserViewExist(userName)){
    %>
    <script type="text/javascript">
      window.location.href= "FlowMonitorView.jsp?viewid=<%=userName%>&isframe=<%=isframe%>";
    </script>
    <%}else{ 
        List<String[]> views = bean.loadViews();
    %>
    <div id="wrapper">
      <% if(0==views.size()){ %>
      <div class="btn-holder">
        <span class="btn" id="add-view-btn">新增视图</span>
      </div>
      <%}else{ %>
      <div class="select-view-holder">
        <label for="view">选择视图：</label>
        <select id="view">
        <%
        for(int i=0,len=views.size();i<len;i++){
        %>
        <option value="<%=views.get(i)[0]%>"><%=views.get(i)[1]%></option>
        <%} %>
        </select>
      </div>
      <div class="btn-holder">
        <span class="btn" id="add-view-btn">新增视图</span>
        <span class="btn" id="preview-btn">预览视图</span>
        <span class="btn" id="select-view-btn">选定视图</span>
      </div>
      <%} %>
    </div>
    <script type="text/javascript" src="scripts/jquery-1.8.0.min.js"></script>
    <script type="text/javascript" src="scripts/flowMonitorViewEntry.js"></script>
    <%} %>
  </body>
</html>
