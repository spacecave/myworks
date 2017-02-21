<%@ page language="java" contentType="text/html;charset=GB2312" pageEncoding="GB2312"%>
<%@ page import="com.zhongying.view.flowmonitor.busi.FlowMonitorClient" %>
<%
  response.setHeader("Cache-Control", "no-cache, must-revalidate");
  response.setHeader("Pragma", "no-cache");
  response.setHeader("Expires", "0");
  
  new FlowMonitorClient(request,response).execute();
%>