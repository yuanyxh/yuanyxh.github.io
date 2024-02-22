import{_ as p}from"./_plugin-vue_export-helper.cdc0426e.js";import{o,c,a as n,b as s,d as t,e,r as i}from"./app.7f917e11.js";const l={},u=e('<h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> 前言</h2><p>总结 uniapp 多端项目三个月开发维护的经验，遇到并解决了什么困难，收获了什么。多端指：</p><ul><li>Andorid: H5、微信 H5、App</li><li>iOS: H5、微信 H5、App</li></ul><h2 id="issues" tabindex="-1"><a class="header-anchor" href="#issues" aria-hidden="true">#</a> issues</h2><h3 id="android-拍照闪退问题" tabindex="-1"><a class="header-anchor" href="#android-拍照闪退问题" aria-hidden="true">#</a> Android 拍照闪退问题</h3>',5),r=n("code",null,"uniapp",-1),d={href:"https://yuanyxh.com/posts/produce/flashback_analysis_and_develop_native_plug.html",target:"_blank",rel:"noopener noreferrer"},k=n("p",null,"解决方案：",-1),v=n("ul",null,[n("li",null,"如果项目有需要保活的相关功能，可以做保活来提升应用优先级，避免拍照时进入后台被系统回收资源。"),n("li",null,"如果项目没有保活的业务，做了保活很大概率无法通过应用商店的审核，此时可以考虑通过自定义应用相机来实现。")],-1),m={href:"https://zh.uniapp.dcloud.io/component/live-pusher.html",target:"_blank",rel:"noopener noreferrer"},b=n("p",null,[n("img",{src:"https://qkc148.bvimg.com/18470/a7b0db6a8f7131b6.gif",alt:"cameraX gif",loading:"lazy"})],-1),h=n("p",null,"主要使用了三个依赖库来完成拍照、编辑、裁切功能：",-1),f={href:"https://github.com/natario1/CameraView",target:"_blank",rel:"noopener noreferrer"},y={href:"https://github.com/burhanrashid52/PhotoEditor",target:"_blank",rel:"noopener noreferrer"},g={href:"https://github.com/Yalantis/uCrop",target:"_blank",rel:"noopener noreferrer"},w={href:"https://github.com/yuanyxh/u-android-native-plugin/tree/master/camera",target:"_blank",rel:"noopener noreferrer"},_={href:"https://github.com/yuanyxh/u-android-native-plugin/tree/master/apk",target:"_blank",rel:"noopener noreferrer"},x=e('<p>搞这个还是花了不少时间的，毕竟不是专业的 Android 开发，后续可能会就实现这个功能写一篇文章作为经验分享。</p><h3 id="应用内通知" tabindex="-1"><a class="header-anchor" href="#应用内通知" aria-hidden="true">#</a> 应用内通知</h3><p>项目是 C 端项目，有 C 到 C 的通讯需求，也接入了各大平台的推送通知功能；系统自带的通知在应用处于前台时是不会弹出提示的，而项目要尽量跟微信对齐，需要能够在应用内弹出通知，也就是这种效果：</p><p><img src="http://qkc148.bvimg.com/18470/6c1a546c851e1a75.jpg" alt="QQ图片20240108021430" loading="lazy"></p><p>这里我对比了微信 Android 端和 iOS 端的应用内通知，区别如下：</p><ul><li>Android 端使用的是系统通知接口，与推送通知是相同的（需要通知权限）。</li><li>iOS 端，微信是自定义了一个通知视图，与系统推送通知不同，猜测可能是 iOS 没有提供相关接口，无法创建系统通知。</li></ul><p>这个需求在项目中是使用自定义组件来完成的，这种解决方式有两个很明显的缺点：</p><ol><li>App 端无法使用全局组件，自定义组件必须在所有页面中引入一遍。</li><li>App 端，切换页面时，即使在新的页面继续弹出通知，也会出现闪烁的情况。</li></ol>',8),H={href:"https://github.com/yongfengnice/NotificationToast",target:"_blank",rel:"noopener noreferrer"},L=n("code",null,"Toast",-1),C=n("p",null,[n("img",{src:"http://qkc148.bvimg.com/18470/932cf2370da9d520.gif",alt:"notify",loading:"lazy"})],-1),E=n("p",null,[s("因为只是一个 "),n("code",null,"Toast"),s(" 轻提示, 所以不需要通知权限，可以做到的功能大概如下（PS：不建议使用这种方式代替系统通知，当做应用内通知使用还是可以的）：")],-1),T=n("ul",null,[n("li",null,"自定义视图"),n("li",null,"自定义触摸、点击事件，以此可以完成清除通知、跳转页面等功能"),n("li",null,"应用内、应用外弹出通知")],-1),q=n("p",null,"想做到但没有做到的功能：自定义弹出动画，尝试了网上的一些文章都不能很好的完成效果。",-1),I=n("p",null,"iOS 端，因为没有 iOS 的开发经验，所以不知道有什么方式可以解决，不过也就是添加一个视图，肯定也是能够实现的。",-1),M={href:"https://github.com/yuanyxh/u-android-native-plugin/tree/master/notify",target:"_blank",rel:"noopener noreferrer"},A={href:"https://github.com/yuanyxh/u-android-native-plugin/tree/master/apk",target:"_blank",rel:"noopener noreferrer"},S=n("h3",{id:"ios-侧滑返回",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#ios-侧滑返回","aria-hidden":"true"},"#"),s(" iOS 侧滑返回")],-1),O={href:"https://yuanyxh.com/skill/uniapp_multi_end_adaptation_problem.html",target:"_blank",rel:"noopener noreferrer"},V=e(`<p><img src="http://qkc148.bvimg.com/18470/b771ed59da0587f0.gif" alt="slide" loading="lazy"></p><p>用户通过侧滑强制返回时，不能阻止，所以需要知道当前是否是侧滑；经过查找资料和测试，侧滑返回可以靠以下特征来标识：</p><ol><li>touchstart 的触摸坐标 x 点在指定区域内（比如 0-50px 的范围）</li><li>touchmove 时，触摸坐标 x 点变为负值</li></ol><p>基于这些特征我写了个判断是否是侧滑返回的工具：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">/*
 * @Author: yuanyxh 
 * @Date: 2023-12-27 12:04:11 
 * @Last Modified by:   yuanyxh 
 * @Last Modified time: 2023-12-27 12:04:11 
 */</span>

<span class="token keyword">import</span> Vue <span class="token keyword">from</span> <span class="token string">&quot;vue&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">ZERO</span> <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/** 最小左侧触摸开始位置 */</span>
<span class="token keyword">const</span> <span class="token constant">MINIMUM_LEFT_DISTANCE</span> <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 最小移动距离 */</span>
<span class="token keyword">const</span> <span class="token constant">MINIMUM_MOVE_DISTANCE</span> <span class="token operator">=</span> <span class="token number">50</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 最小间隔事件 */</span>
<span class="token keyword">const</span> <span class="token constant">MINIMUM_TIME_INTERVAL</span> <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 
 * <span class="token keyword">@callback</span> OnSideSlipListener
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">sideTime</span> 上次侧滑事件
*/</span>

<span class="token doc-comment comment">/**
 *
 * <span class="token keyword">@description</span> 侦听 ios 侧滑事件, 通过此工具配合 beforeRouteLeave 导航守卫判断是否侧滑返回
 */</span>
<span class="token keyword">const</span> sideSlip <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token function">sideSlipListener</span><span class="token punctuation">(</span><span class="token parameter">global</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> startX <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span>
    endX <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> sideTime <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

  <span class="token keyword">const</span> vm <span class="token operator">=</span> <span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">;</span>

  <span class="token doc-comment comment">/** <span class="token keyword">@type</span> <span class="token class-name"><span class="token punctuation">{</span>OnSideSlipListener<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">}</span></span> */</span>
  <span class="token keyword">const</span> callbackList <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

  <span class="token keyword">function</span> <span class="token function">start</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> point <span class="token operator">=</span> e<span class="token punctuation">.</span>touches<span class="token operator">?.</span>length <span class="token operator">?</span> e<span class="token punctuation">.</span>touches<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">:</span> e<span class="token punctuation">;</span>

    startX <span class="token operator">=</span> point<span class="token punctuation">.</span>pageX<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">end</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> point <span class="token operator">=</span> e<span class="token punctuation">.</span>changedTouched<span class="token operator">?.</span>length <span class="token operator">?</span> e<span class="token punctuation">.</span>changedTouched<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">:</span> e<span class="token punctuation">;</span>

    endX <span class="token operator">=</span> point<span class="token punctuation">.</span>pageX<span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>
      startX <span class="token operator">&gt;=</span> <span class="token constant">ZERO</span> <span class="token operator">&amp;&amp;</span>
      startX <span class="token operator">&lt;=</span> <span class="token constant">MINIMUM_LEFT_DISTANCE</span> <span class="token operator">&amp;&amp;</span>
      endX <span class="token operator">&lt;</span> <span class="token constant">ZERO</span> <span class="token operator">&amp;&amp;</span>
      vm<span class="token punctuation">.</span>windowWidth <span class="token operator">-</span> Math<span class="token punctuation">.</span><span class="token function">abs</span><span class="token punctuation">(</span>endX<span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token constant">MINIMUM_MOVE_DISTANCE</span>
    <span class="token punctuation">)</span> <span class="token punctuation">{</span>
      sideTime <span class="token operator">=</span> Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      callbackList<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">callback</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token function">callback</span><span class="token punctuation">(</span>sideTime<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">isWithinValidityPeriod</span><span class="token punctuation">(</span><span class="token parameter">time</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> interval <span class="token operator">=</span> Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> time<span class="token punctuation">;</span>

    <span class="token keyword">return</span> interval <span class="token operator">&gt;=</span> <span class="token constant">ZERO</span> <span class="token operator">&amp;&amp;</span> interval <span class="token operator">&lt;</span> <span class="token constant">MINIMUM_TIME_INTERVAL</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>vm<span class="token punctuation">.</span>isIos<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    global<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&quot;touchstart&quot;</span><span class="token punctuation">,</span> start<span class="token punctuation">)</span><span class="token punctuation">;</span>
    global<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&quot;touchend&quot;</span><span class="token punctuation">,</span> end<span class="token punctuation">)</span><span class="token punctuation">;</span>
    global<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&quot;touchcancel&quot;</span><span class="token punctuation">,</span> end<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> 是否左滑
     * <span class="token keyword">@readonly</span>
     */</span>
    <span class="token keyword">get</span> <span class="token function">isSideSlip</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>vm<span class="token punctuation">.</span>isIos<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token function">isWithinValidityPeriod</span><span class="token punctuation">(</span>sideTime<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> 判断侧滑时间是否在有效期内
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">time</span> 侧滑时间
     * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>boolean<span class="token punctuation">}</span></span> 是否有效
     */</span>
    <span class="token literal-property property">isWithinValidityPeriod</span><span class="token operator">:</span> isWithinValidityPeriod<span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * 
     * <span class="token keyword">@description</span> 侦听侧滑
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>OnSideSlipListener<span class="token punctuation">}</span></span> <span class="token parameter">callback</span> 
     */</span>
    <span class="token function">on</span><span class="token punctuation">(</span><span class="token parameter">callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> callback <span class="token operator">===</span> <span class="token string">&#39;function&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        callbackList<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>callback<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> 取消事件侦听
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>OnSideSlipListener<span class="token punctuation">}</span></span> <span class="token parameter">callback</span> 
     */</span>
    <span class="token function">off</span><span class="token punctuation">(</span><span class="token parameter">callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> i <span class="token operator">=</span> callbackList<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span>callback<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">===</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>

      callbackList<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span>i<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span>
  <span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> global <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> window <span class="token operator">!==</span> <span class="token string">&quot;undefined&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token punctuation">(</span>global <span class="token operator">=</span> window<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    global <span class="token operator">=</span> <span class="token punctuation">{</span>
      <span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token function">removeEventListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>

    <span class="token keyword">return</span> global<span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
<span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> sideSlip<span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>具体逻辑为：判断是否侧滑返回，touchend 时记录当前时间，在指定时间间隔内触发了诸如 <code>onUnload</code>、<code>beforeRouteLeave</code> 等钩子时就可以认为是侧滑返回。</p><h3 id="小米浏览器滑动冲突" tabindex="-1"><a class="header-anchor" href="#小米浏览器滑动冲突" aria-hidden="true">#</a> 小米浏览器滑动冲突</h3><p>不知道从什么版本开始，小米浏览器加了一个让人恼火的功能：左右滑屏手势。通过这个功能可以让左右滑动手势控制网页的前进后退，如下：</p><p><img src="http://qkc148.bvimg.com/18470/1608a9246b7a0b42.gif" alt="lr-slide" loading="lazy"></p><p>看起来很美好，但却与很多项目中的滑动手势冲突，比如 Element 中的滑块功能：</p><p><img src="http://qkc148.bvimg.com/18470/d26017b2b2503862.gif" alt="g2ye1-52lb3" loading="lazy"></p><p>这时候一般就会想到阻止冒泡、阻止默认事件来禁用左右滑动手势了，但恼火的点就在于没有效果，由此可以猜测这个功能的实现没有在浏览器内核中或者没有适配我们熟知的那一套 js 事件体系。</p><p>目前还没有研究出解决方案，有知道如何解决的大佬欢迎讨论。</p><h3 id="后台定时器" tabindex="-1"><a class="header-anchor" href="#后台定时器" aria-hidden="true">#</a> 后台定时器</h3><p>因为内核的限制，网页和基于 webview 实现的框架下使用定时器时，进入后台一段时间后定时器会被挂起，回到前台时才继续执行，导致程序的运行和我们预想的有偏差。</p><p>解决方案：</p>`,16),P=n("li",null,"一种比较简单的解决方案是定时器 + 系统时间的结合，但是系统时间可以被更改，这种方式适用于不是那么重要的定时任务。",-1),N=n("code",null,"performance.now()",-1),z=n("code",null,"performance.now()",-1),K={href:"https://developer.mozilla.org/zh-CN/docs/Web/API/DOMHighResTimeStamp#the_time_origin",target:"_blank",rel:"noopener noreferrer"},U=n("li",null,"以上两种方式都不能在定时器被挂起时继续执行任务，如果需要在后台时继续执行任务，可以考虑使用 worker 的方式。",-1),j=e(`<p>这里给出个人认为的最佳实践：</p><ol><li>如果使用了定时器来完成持续的动画效果或视图变化，在程序进入后台时主动停止，回到前台时恢复</li><li>较简单的定时任务，可以使用定时器 + 系统时间的组合，能够在多端生效</li><li>需要保证任务的执行逻辑，H5 可以使用定时器 + <code>performance.now()</code>，App 可以使用 worker 或原生插件</li><li>对于需要持续执行，不影响视图的任务，使用 worker</li></ol><h3 id="软键盘高度的获取" tabindex="-1"><a class="header-anchor" href="#软键盘高度的获取" aria-hidden="true">#</a> 软键盘高度的获取</h3><p>App 端软键盘高度的获取还是比较简单的，H5 端就比较难受了，因为不同浏览器对于软键盘弹出时的页面模式是不能确认的，导致我们不能简单的通过 <code>window.onresize</code> 事件来判断软键盘是否弹出，好在目前主流浏览器都支持了 <code>Window.visualViewport</code> 接口，也能兼容到大部分的主流浏览器版本。</p><p>我们可以通过 <code>Window.visualViewport</code> 接口的 <code>resize</code> 事件，接收到可视窗口变化的事件，以此计算出软键盘的高度。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">import</span> Vue <span class="token keyword">from</span> <span class="token string">&quot;vue&quot;</span><span class="token punctuation">;</span>

<span class="token keyword">const</span> <span class="token constant">DELAY_TIME</span> <span class="token operator">=</span> <span class="token number">300</span><span class="token punctuation">;</span>

<span class="token keyword">let</span> callbackList <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
<span class="token keyword">let</span> unimplementedChangeList <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">emit</span><span class="token punctuation">(</span><span class="token parameter">target<span class="token punctuation">,</span> payload</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>target<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> target<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      target<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">(</span>payload<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 页面原始高度</span>
<span class="token keyword">let</span> windowHeight <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token keyword">function</span> <span class="token function">onKeyboardHeightChangeWithH5</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> extraHeight <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> hasFocus <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
  <span class="token keyword">let</span> originScrollY <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

  <span class="token keyword">let</span> cancheHeight <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

  <span class="token keyword">let</span> keyboardChangeTimer <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

  <span class="token keyword">function</span> <span class="token function">exec</span><span class="token punctuation">(</span><span class="token parameter">height</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> keyboardHeight <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> windowHeight <span class="token operator">-</span> height<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>cancheHeight <span class="token operator">===</span> keyboardHeight<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    cancheHeight <span class="token operator">=</span> keyboardHeight<span class="token punctuation">;</span>

    <span class="token keyword">const</span> <span class="token punctuation">{</span> isIos <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">;</span>

    <span class="token function">emit</span><span class="token punctuation">(</span>callbackList<span class="token punctuation">,</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">extra</span><span class="token operator">:</span> isIos <span class="token operator">?</span> extraHeight <span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
      <span class="token literal-property property">height</span><span class="token operator">:</span> keyboardHeight<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span>
    <span class="token string">&quot;focus&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>
        e <span class="token keyword">instanceof</span> <span class="token class-name">FocusEvent</span> <span class="token operator">&amp;&amp;</span>
        <span class="token punctuation">(</span>e<span class="token punctuation">.</span>target <span class="token keyword">instanceof</span> <span class="token class-name">HTMLInputElement</span> <span class="token operator">||</span>
          e<span class="token punctuation">.</span>target <span class="token keyword">instanceof</span> <span class="token class-name">HTMLTextAreaElement</span> <span class="token operator">||</span>
          e<span class="token punctuation">.</span>target<span class="token punctuation">.</span>contenteditable<span class="token punctuation">)</span>
      <span class="token punctuation">)</span> <span class="token punctuation">{</span>
        hasFocus <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>

        originScrollY <span class="token operator">=</span> window<span class="token punctuation">.</span>scrollY<span class="token punctuation">;</span>

        <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
          hasFocus <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">600</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span> <span class="token literal-property property">capture</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>

  window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span>
    <span class="token string">&quot;blur&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>
        e <span class="token keyword">instanceof</span> <span class="token class-name">FocusEvent</span> <span class="token operator">&amp;&amp;</span>
        <span class="token punctuation">(</span>e<span class="token punctuation">.</span>target <span class="token keyword">instanceof</span> <span class="token class-name">HTMLInputElement</span> <span class="token operator">||</span>
          e<span class="token punctuation">.</span>target <span class="token keyword">instanceof</span> <span class="token class-name">HTMLTextAreaElement</span> <span class="token operator">||</span>
          e<span class="token punctuation">.</span>target<span class="token punctuation">.</span>contenteditable<span class="token punctuation">)</span>
      <span class="token punctuation">)</span> <span class="token punctuation">{</span>
        hasFocus <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>

        <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
          hasFocus <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token constant">DELAY_TIME</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span> <span class="token literal-property property">capture</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>

  window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span>
    <span class="token string">&quot;scroll&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>hasFocus<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        extraHeight <span class="token operator">=</span> window<span class="token punctuation">.</span>scrollY <span class="token operator">-</span> originScrollY<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token punctuation">{</span> <span class="token literal-property property">capture</span><span class="token operator">:</span> <span class="token boolean">true</span> <span class="token punctuation">}</span>
  <span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> window<span class="token punctuation">.</span>visualViewport <span class="token operator">!==</span> <span class="token string">&quot;undefined&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> window<span class="token punctuation">.</span>visualViewport<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&quot;resize&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>hasFocus <span class="token operator">===</span> <span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token function">emit</span><span class="token punctuation">(</span>unimplementedChangeList<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span>keyboardChangeTimer<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">clearTimeout</span><span class="token punctuation">(</span>keyboardChangeTimer<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      keyboardChangeTimer <span class="token operator">=</span> <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token function">exec</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>target<span class="token punctuation">.</span>height<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token constant">DELAY_TIME</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&quot;resize&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>hasFocus <span class="token operator">===</span> <span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token function">emit</span><span class="token punctuation">(</span>unimplementedChangeList<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>keyboardChangeTimer<span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">clearTimeout</span><span class="token punctuation">(</span>keyboardChangeTimer<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    keyboardChangeTimer <span class="token operator">=</span> <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
      <span class="token function">exec</span><span class="token punctuation">(</span>window<span class="token punctuation">.</span>innerHeight<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token constant">DELAY_TIME</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">let</span> isInited <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">initKeyboardHeightChangeListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// #ifdef APP-PLUS</span>
  uni<span class="token punctuation">.</span><span class="token function">onKeyboardHeightChange</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">res</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    <span class="token function">emit</span><span class="token punctuation">(</span>callbackList<span class="token punctuation">,</span> <span class="token punctuation">{</span> <span class="token literal-property property">extra</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span> <span class="token literal-property property">height</span><span class="token operator">:</span> res<span class="token punctuation">.</span>height <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// #endif</span>

  <span class="token comment">// #ifdef H5</span>

  windowHeight <span class="token operator">=</span> <span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">.</span>windowHeight<span class="token punctuation">;</span>

  <span class="token function">onKeyboardHeightChangeWithH5</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token comment">// #endif</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * <span class="token keyword">@callback</span> OnKeyboardHeightChangeCallback
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span><span class="token punctuation">{</span> extra<span class="token operator">:</span> number<span class="token punctuation">;</span> height<span class="token operator">:</span> number <span class="token punctuation">}</span><span class="token punctuation">}</span></span> 键盘高度(ios 中还有底部块的高度)
 */</span>
<span class="token doc-comment comment">/**
 * <span class="token keyword">@typedef</span> <span class="token class-name">Options</span>
 * <span class="token keyword">@type</span> <span class="token class-name"><span class="token punctuation">{</span>Object<span class="token punctuation">}</span></span>
 * <span class="token keyword">@property</span> <span class="token class-name"><span class="token punctuation">{</span>boolean<span class="token punctuation">}</span></span> <span class="token parameter">reset</span> app 端对 uni.onKeyboardHeightChange 重置侦听
 */</span>
<span class="token doc-comment comment">/**
 *
 * <span class="token keyword">@description</span> 侦听键盘高度变化事件, 对多端做兼容处理
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>OnKeyboardHeightChangeCallback<span class="token punctuation">}</span></span> <span class="token parameter">callback</span> 键盘高度变化事件回调
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Options<span class="token punctuation">}</span></span> <span class="token parameter">options</span> 额外参数
 */</span>
<span class="token keyword">function</span> <span class="token function">onKeyboardHeightChange</span><span class="token punctuation">(</span><span class="token parameter">callback<span class="token punctuation">,</span> options <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> isPc <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">;</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>isPc<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>
      <span class="token string">&quot;PC devices do not need to listen for soft keyboard height&quot;</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// #ifdef APP-PLUS</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>options<span class="token punctuation">.</span>reset<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    isInited <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>

    callbackList <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// #endif</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> callback <span class="token operator">===</span> <span class="token string">&quot;function&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    callbackList<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>callback<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>isInited <span class="token operator">===</span> <span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    isInited <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>

    <span class="token function">initKeyboardHeightChangeListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 *
 * <span class="token keyword">@description</span> 移除事件侦听函数
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>OnKeyboardHeightChangeCallback<span class="token punctuation">}</span></span> <span class="token parameter">callback</span> 需要移除的已注册函数
 */</span>
<span class="token keyword">function</span> <span class="token function">offKeyboardHeightChange</span><span class="token punctuation">(</span><span class="token parameter">callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> callback <span class="token operator">===</span> <span class="token string">&quot;function&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> index <span class="token operator">=</span> callbackList<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span>callback<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>index <span class="token operator">&gt;=</span> <span class="token number">0</span><span class="token punctuation">)</span> callbackList<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span>index<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 *
 * <span class="token keyword">@description</span> H5 页面高度变化但未执行键盘高度变化事件时触发
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>OnKeyboardHeightChangeCallback<span class="token punctuation">}</span></span> <span class="token parameter">callback</span> 需要添加的注册函数
 */</span>
<span class="token keyword">function</span> <span class="token function">onUnimplementedChange</span><span class="token punctuation">(</span><span class="token parameter">callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">const</span> <span class="token punctuation">{</span> isPc <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token class-name">Vue</span><span class="token punctuation">.</span>prototype<span class="token punctuation">;</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>isPc<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> console<span class="token punctuation">.</span><span class="token function">error</span><span class="token punctuation">(</span>
      <span class="token string">&quot;PC devices do not need to listen for soft keyboard height&quot;</span>
    <span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> callback <span class="token operator">===</span> <span class="token string">&quot;function&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    unimplementedChangeList<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>callback<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">if</span> <span class="token punctuation">(</span>isInited <span class="token operator">===</span> <span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    isInited <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>

    <span class="token function">initKeyboardHeightChangeListener</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 *
 * <span class="token keyword">@description</span> H5 页面高度变化但未执行键盘高度变化事件时触发
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>OnKeyboardHeightChangeCallback<span class="token punctuation">}</span></span> <span class="token parameter">callback</span> 需要添加的注册函数
 */</span>
<span class="token keyword">function</span> <span class="token function">offUnimplementedChange</span><span class="token punctuation">(</span><span class="token parameter">callback</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> callback <span class="token operator">===</span> <span class="token string">&quot;function&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">const</span> index <span class="token operator">=</span> unimplementedChangeList<span class="token punctuation">.</span><span class="token function">indexOf</span><span class="token punctuation">(</span>callback<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>index <span class="token operator">&gt;=</span> <span class="token number">0</span><span class="token punctuation">)</span> unimplementedChangeList<span class="token punctuation">.</span><span class="token function">splice</span><span class="token punctuation">(</span>index<span class="token punctuation">,</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  onKeyboardHeightChange<span class="token punctuation">,</span>
  offKeyboardHeightChange<span class="token punctuation">,</span>
  onUnimplementedChange<span class="token punctuation">,</span>
  offUnimplementedChange<span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码对于软键盘高度的获取做了统一的封装，对于 App 端使用 <code>uni.onKeyboardHeightChange</code> 接口；H5 端利用 <code>Window.visualViewport</code>，同时使用 <code>window.onresize</code> 兜底。</p><h2 id="思路与看法" tabindex="-1"><a class="header-anchor" href="#思路与看法" aria-hidden="true">#</a> 思路与看法</h2><h3 id="全局弹窗" tabindex="-1"><a class="header-anchor" href="#全局弹窗" aria-hidden="true">#</a> 全局弹窗</h3><p>用过 uniapp 的人应该都对全局这个词很敏感，因为很实用但却无法实现（除 H5 外）。接触这个项目后我也感到了局部组件带来的一些问题：</p><ul><li>书写相同的结构代码，做同一件事</li><li>一个页面多个实例，状态不能统一（如一个通用的弹窗组件，在一个页面引入了多次，代码逻辑同时弹出了其中两个弹窗，弹窗重叠在一起；如果使用全局弹窗就能在内部维护，关闭第一个后再弹出第二个）</li><li>。。。</li></ul><p>这些问题看起来很小，但对项目的影响巨大，所以我也在找能够实现全局弹窗的办法。</p><p>看过插件市场的一些全局弹窗实现，基本思路都是使用一个页面作为全局弹窗的载体，需要弹出时跳转至这个页面即可。</p>`,13),D={href:"https://www.html5plus.org/doc/zh_cn/webview.html",target:"_blank",rel:"noopener noreferrer"},F={href:"https://github.com/dcloudio/uni-app/tree/dev/src/platforms/app-plus/view/components/picker",target:"_blank",rel:"noopener noreferrer"},R=n("code",null,"picker",-1),W={href:"https://www.html5plus.org/doc/zh_cn/webview.html",target:"_blank",rel:"noopener noreferrer"},X=n("p",null,"我们还需要考虑这个全局弹窗的可扩展、可重用性：",-1),Y=n("ul",null,[n("li",null,"考虑结构的可扩展性，是否可以传递组件实例在 webview 中创建"),n("li",null,"考虑事件的传递"),n("li",null,"考虑对外接口的封装")],-1),Z=n("h3",{id:"对项目的看法",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#对项目的看法","aria-hidden":"true"},"#"),s(" 对项目的看法")],-1),B=n("p",null,"这个项目是一个比较老的项目了，给我的感觉就是乱，很乱，没有一个统一的规范，你想写什么样的代码都可以，导致经过多个开发人员的手之后，各种风格的代码夹杂其中，给后续的开发维护造成很大的影响。",-1),Q=n("p",null,"项目的初期没有规划好，在开发过程中也没有考虑封装统一，比如：",-1),G=n("li",null,[s("输入框的封装 "),n("ul",null,[n("li",null,"目前关于输入框和软键盘的问题还有很多，如果初期考虑了封装的话能够统一解决，会轻松很多")])],-1),J=n("li",null,"弹窗的封装",-1),$={href:"https://github.com/xiangyuecn/Recorder",target:"_blank",rel:"noopener noreferrer"},nn=n("li",null,[s("全局事件的封装 "),n("ul",null,[n("li",null,[s("在 H5 中经常使用 "),n("code",null,"window.onresize"),s(" 之类的接口完成功能，可能一个组件就添加一个事件，应该封装为模块，内部注册一次事件，提供对外接口，事件触发时再分发出去")])])],-1),sn=e('<h3 id="重构" tabindex="-1"><a class="header-anchor" href="#重构" aria-hidden="true">#</a> 重构</h3><p>一开始接手这个项目时就感觉项目问题很大，天天喊着需要重构重构，需要几个月的时间对项目进行大的重构，后来需求要将项目中使用 <code>scroll-view</code> 的列表替换为三方组件，在完成这个需求时就发现了所谓大的重构是不切实际的。</p><p>在进行这个需求时出现的比较明显的问题：</p><ol><li>组件与 uniapp <code>scroll-view</code> 的属性、逻辑不兼容，替换需要格外小心，耗时是很漫长的</li><li>替换过程中，可能遗漏了部分逻辑或结构出现错误；如果列表功能复杂，可能很长时间内不会发现这个问题</li></ol><p>从这个需求中也更能体会到 《重构2》 中作者所践行的 <em><strong>一步一测试</strong></em> 的必要性了，也更深刻的理解了作者表达的：<em><strong>当你有时间且你认为这段代码需要重构时才进行重构，对于那些永远不会碰到的，不要去碰它（让营地比你来时更干净）</strong></em></p><h3 id="项目进度" tabindex="-1"><a class="header-anchor" href="#项目进度" aria-hidden="true">#</a> 项目进度</h3><p>一个星期前是试用期结束，告知我试用期没有通过，理由是进度缓慢，我也接受了，这里不是为了吐槽，只是谈谈对于项目进度的看法。</p><p>上面也说了，这是一个 C 端的老项目，且存在着比较大的问题，对于我而言，我会让营地比我来时更干净，这是为了后续的项目维护考虑，同时尽量保证项目的逻辑在我的可接受范围内，毕竟连自己都不能接受的程序怎么保证用户的体验呢？</p><p>--end</p>',9);function an(tn,en){const a=i("ExternalLinkIcon");return o(),c("div",null,[u,n("p",null,[s("部分机型中调用 "),r,s(" 提供的 Api 进行拍照会偶现应用闪退，具体分析在 "),n("a",d,[s("应用闪退分析与 uniapp 安卓原生插件开发"),t(a)]),s("，已经确认是系统回收资源，结束了应用进程导致的（调用系统相机进行拍摄，应用处于后台）。")]),k,v,n("p",null,[s("目前 uniapp 插件市场有很多自定义相机可以使用，或者可以基于 uniapp 官方的 "),n("a",m,[s("live-pusher"),t(a)]),s(" 组件和 nvue 结合自定义自己的相机；这里我是写了个仿微信应用内相机的原生插件：")]),b,h,n("ul",null,[n("li",null,[n("a",f,[s("CameraView"),t(a)])]),n("li",null,[n("a",y,[s("PhotoEditor"),t(a)])]),n("li",null,[n("a",g,[s("uCrop"),t(a)])])]),n("p",null,[s("感兴趣的可以去 "),n("a",w,[s("u-android-native-plugin-camera"),t(a)]),s(" 看看，或者下载 "),n("a",_,[s("demo"),t(a)]),s(" 体验。")]),x,n("p",null,[s("我尝试使用原生插件的方式来解决，参考了 "),n("a",H,[s("NotificationToast"),t(a)]),s(" 的实现方式，使用 Andorid 中的 "),L,s(" 类并加上一些黑科技来模拟系统通知，如下：")]),C,E,T,q,I,n("p",null,[s("感兴趣的可以去 "),n("a",M,[s("u-android-native-plugin-notify"),t(a)]),s(" 看看，或者下载 "),n("a",A,[s("demo"),t(a)]),s(" 体验。")]),S,n("p",null,[s("这个问题在 "),n("a",O,[s("入职一个月，总结下 uniapp 多端项目遇到的一些问题与解决方案"),t(a)]),s(" 中提到过，iOS 侧滑返回是无法阻止的，如果我们在导航守卫中阻止用户离开，而用户使用了侧滑进行了强制返回，此时会出现这种情况：页面卡顿，一段时间后重新回到那个阻止离开的页面，如下图：")]),V,n("ul",null,[P,n("li",null,[s("H5 中也可以尝试使用定时器 + "),N,s(" 结合来完成，"),z,s(" 返回的是距 "),n("a",K,[s("时间源"),t(a)]),s(" 过去的时间，且不会被系统时间影响。")]),U]),j,n("p",null,[s("App 端中一个页面就是一个 webview，其实我们可以通过 "),n("a",D,[s("H5+"),t(a)]),s(" Api 的方式创建 webview 来作为全局弹窗的载体，会比页面的形式更好一点，查看 "),n("a",F,[s("uni-app-picker"),t(a)]),s(" 组件的源码也可以发现，App 端的 "),R,s(" 就是依赖于 "),n("a",W,[s("H5+"),t(a)]),s(" webview 接口实现的，且经过实验，创建的 webview 是可以做到全局重用的。")]),X,Y,Z,B,Q,n("ul",null,[G,J,n("li",null,[s("录音功能的封装 "),n("ul",null,[n("li",null,[s("多端中录音实现都不同，H5 使用 "),n("a",$,[s("Recorder"),t(a)]),s("、微信 H5 使用 wx-jssdk、App 使用 uniapp 提供的接口；直接在页面中内嵌代码，而没有考虑封装为一个模块，内部区分，对外提供一致接口")])])]),nn]),sn])}const cn=p(l,[["render",an],["__file","uniapp_project_development_experience_summary.html.vue"]]);export{cn as default};
