import{_ as e}from"./_plugin-vue_export-helper.cdc0426e.js";import{o,c,a as n,b as s,d as t,e as p,r as l}from"./app.6aef24fd.js";const i={},u=p('<h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> 前言</h2><p>最近入职了一家公司，做的是房屋租赁平台；技术栈是 uniapp 做多端，包含 Android、IOS，两个端都需要做 H5、微信 H5 和 APP，总共是 6 个端。</p><p>项目是已经上线运行的，目前主要的工作是解决一些历史遗留的 Bug，完善项目的可用性；在解决这些 Bug 的时候也学到了很多东西，也遇到了很多难以解决的问题，在这里做个总结。</p><h2 id="输入框-emoji-渲染" tabindex="-1"><a class="header-anchor" href="#输入框-emoji-渲染" aria-hidden="true">#</a> 输入框 Emoji 渲染</h2><p>这个问题应该有很多成熟的插件可以实现，但是询问了同事，告知找了很多 uniapp 的插件都不能满足需求；目前项目对于这个功能是分 Android 和 IOS 做不同适配，Android 中使用 editor 渲染，而 IOS 中使用 textarea，然后将 emoji 转换为 <code>[哭脸]</code> 这样的方式去渲染，为什么 IOS 不用 editor 的原因没有去深究。</p><p>我也找了很多相关的插件，比较友好的一种方式是将项目的 emoji 图片转化为字体，通过字体的方式去渲染，在多端中也能保持一致。</p><p>但是实际操作下来，在 IOS 端会有问题，见下图对比：</p><p>Android</p><p><img src="http://qkc148.bvimg.com/18470/a91e750a3e749afd.jpg" alt="android emoji" loading="lazy"></p><p>IOS</p><p><img src="http://qkc148.bvimg.com/18470/7c0bb10a14c53d63.jpg" alt="ios emoji" loading="lazy"></p><p>可以发现 IOS 中 emoji 实在是太小了，与字体大小不匹配，造成的视觉落差比较大。</p>',12),r=n("code",null,"unicode-range",-1),k=n("code",null,"size-adjust",-1),d={href:"https://www.zhangxinxu.com/wordpress/2022/03/css-size-adjust-font-unicode-range/",target:"_blank",rel:"noopener noreferrer"},v=n("code",null,"size-adjust",-1),m=p(`<h2 id="uniapp-picker-组件的一些问题" tabindex="-1"><a class="header-anchor" href="#uniapp-picker-组件的一些问题" aria-hidden="true">#</a> uniapp picker 组件的一些问题</h2><p>uniapp 的 picker 不能定制样式，而项目对多端统一的要求比较高，以往在 APP 端是通过修改基座源码来改变 picker 样式的，因为麻烦，而且之前有过忘了修改基座源码而导致多端样式不一致的问题，所以目前需求是使用插件或自定义组件来实现。</p><p>使用封装组件的方式，利用 <code>uni-popup</code> 做弹出控制，<code>picker-view</code> 做 picker 的渲染控制，模拟实现 picker 组件；同时在自定义组件统一解决项目中关于 picker 组件的问题，代码如下：</p><div class="language-vue line-numbers-mode" data-ext="vue"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span>
    <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>uarea-picker<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{ hidden: hidden }<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">v-bind</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>$attrs<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">v-on</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>$listeners<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">@tap</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>openPicker<span class="token punctuation">&quot;</span></span>
  <span class="token punctuation">&gt;</span></span>
    <span class="token comment">&lt;!-- 默认插槽，实现类 picker 结构 --&gt;</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>slot</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>default<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>slot</span><span class="token punctuation">&gt;</span></span>

    <span class="token comment">&lt;!-- picker 选择器弹出控制 --&gt;</span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>uni-popup</span>
      <span class="token attr-name">ref</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>picker<span class="token punctuation">&quot;</span></span>
      <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>uarea-picker-popup<span class="token punctuation">&quot;</span></span>
      <span class="token attr-name">:style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{ zIndex: zIndex }<span class="token punctuation">&quot;</span></span>
      <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bottom<span class="token punctuation">&quot;</span></span>
      <span class="token attr-name">:is-mask-click</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>false<span class="token punctuation">&quot;</span></span>
      <span class="token attr-name">@maskClick</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>handleMaskClick<span class="token punctuation">&quot;</span></span>
    <span class="token punctuation">&gt;</span></span>
      <span class="token comment">&lt;!-- 选择器容器 --&gt;</span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>view</span>
        <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>picker-view-container<span class="token punctuation">&quot;</span></span>
        <span class="token attr-name">:style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{ height: normalizeHeight }<span class="token punctuation">&quot;</span></span>
        <span class="token attr-name">@tap.stop</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span><span class="token punctuation">&quot;</span></span>
      <span class="token punctuation">&gt;</span></span>
        <span class="token comment">&lt;!-- 顶部操作栏 --&gt;</span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>view</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>operator-container<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>slot</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>operator<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
            <span class="token comment">&lt;!-- 取消按钮 --&gt;</span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>view</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>picker-view-operator<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
              <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span>
                <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>picker-view-btn<span class="token punctuation">&quot;</span></span>
                <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>default<span class="token punctuation">&quot;</span></span>
                <span class="token attr-name">:plain</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span>
                <span class="token attr-name">@tap</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>cancel<span class="token punctuation">&quot;</span></span>
              <span class="token punctuation">&gt;</span></span>
                {{ cancelText }}
              <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>

              <span class="token comment">&lt;!-- 确认按钮 --&gt;</span>
              <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>button</span>
                <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>picker-view-btn<span class="token punctuation">&quot;</span></span>
                <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>default<span class="token punctuation">&quot;</span></span>
                <span class="token attr-name">:plain</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>true<span class="token punctuation">&quot;</span></span>
                <span class="token attr-name">@tap</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>complete<span class="token punctuation">&quot;</span></span>
              <span class="token punctuation">&gt;</span></span>
                {{ confirmText }}
              <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>button</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>view</span><span class="token punctuation">&gt;</span></span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>slot</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>view</span><span class="token punctuation">&gt;</span></span>

        <span class="token comment">&lt;!-- picker-view --&gt;</span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>picker-view</span>
          <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>picker-view<span class="token punctuation">&quot;</span></span>
          <span class="token attr-name">:value</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>normalizeValue<span class="token punctuation">&quot;</span></span>
          <span class="token attr-name">@change</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>handleDataChange<span class="token punctuation">&quot;</span></span>
        <span class="token punctuation">&gt;</span></span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span> <span class="token attr-name">v-for</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>(column, index) in getRange(range)<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
            <span class="token comment">&lt;!-- v-if 为了解决多列时, 滑动某一列快速滑动当前列后的列表时出现的视图错乱问题 --&gt;</span>
            <span class="token comment">&lt;!-- v-if 后使用 $nextTick 重新 render, 视图不会抖动 --&gt;</span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>picker-view-column</span>
              <span class="token attr-name">v-if</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>afterChangeIndexs.includes(index) === false<span class="token punctuation">&quot;</span></span>
              <span class="token attr-name">:key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>index<span class="token punctuation">&quot;</span></span>
            <span class="token punctuation">&gt;</span></span>
              <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>view</span>
                <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>picker-view-item<span class="token punctuation">&quot;</span></span>
                <span class="token attr-name">v-for</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>(row, index) in column<span class="token punctuation">&quot;</span></span>
                <span class="token attr-name">:key</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>getKey(row, index)<span class="token punctuation">&quot;</span></span>
              <span class="token punctuation">&gt;</span></span>
                {{ getDisplayText(row) }}
              <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>view</span><span class="token punctuation">&gt;</span></span>
            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>picker-view-column</span><span class="token punctuation">&gt;</span></span>
          <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>picker-view</span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>view</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>uni-popup</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">import</span> Vue <span class="token keyword">from</span> <span class="token string">&quot;vue&quot;</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * TODO:
 *
 * 组件使用 uni-popup + picker-view 实现, 为了满足样式需求及集中处理需要解决的问题。
 * 使用组件时需要注意, 如果组件被含有 transform 属性的元素包裹, 则组件样式可能会出现问题
 * uni-popup 使用 fixed 固定定位实现遮罩功能, fixed 遇到含有 transform 属性的父元素时, 相对于该元素偏移
 * 如果出现这种情况, 可以将组件放置在最外层, 通过自定义的元素调用组件的 openPicker 方法 \`$refs.picker.openPicker()\`
 *
 * */</span>

<span class="token doc-comment comment">/**
 * FIXME:
 *
 * 修复 BUG:
 *
 * 1. 死循环
 *   - 实测发现滑动到多列时, 频繁滑动到边界, 此时会触发 normalizeRange 的侦听器
 *   - 侦听器中对所有列进行了判断, 如果当前列选择的索引大于当前列, 则将索引重置为 0
 *   - 此时出现无限死循环, 原因未知
 *   - 实测发现 rerender 后所有列都会重置为 0 (需要修改, 体验优化), 所以侦听器目前无效, 暂先注释
 *
 * 2. 滑动选择后, 不确认关闭 picker, 再次打开不滑动直接确认, 此时选中变为上一次滑动后的结果
 *    - 关闭时未重置 cancheData 导致的
 *
 * 3. 多列选择器, 快速滑动时, 触发列改变事件, 此时外界修改 range, 如果列数发生改变, 此时快速点击确认, value 个数和 range 列数不匹配
 *
 * 4. rerender 后, 后续列被重置为 0, 但数据不确定是否被修改
 *    - 默认重置当前 change 列后面的所有列选择索引为 0
 *
 * 体验优化:
 *
 * 1. 选中前一列后, 不管后一列选择索引是否超过列长度都会重置为 0
 */</span>

<span class="token doc-comment comment">/**
 * 事件类型
 */</span>
<span class="token keyword">const</span> eventType <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token doc-comment comment">/** change */</span>
  <span class="token constant">CHANGE</span><span class="token operator">:</span> <span class="token string">&quot;change&quot;</span><span class="token punctuation">,</span>
  <span class="token doc-comment comment">/** cancel */</span>
  <span class="token constant">CANCEL</span><span class="token operator">:</span> <span class="token string">&quot;cancel&quot;</span><span class="token punctuation">,</span>
  <span class="token constant">COLUMN_CHANGE</span><span class="token operator">:</span> <span class="token string">&quot;columnchange&quot;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/**
 * 模式
 */</span>
<span class="token keyword">const</span> modeType <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token constant">SELECTOR</span><span class="token operator">:</span> <span class="token string">&quot;selector&quot;</span><span class="token punctuation">,</span>
  <span class="token constant">MULTI_SELECTOR</span><span class="token operator">:</span> <span class="token string">&quot;multiSelector&quot;</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> Vue<span class="token punctuation">.</span><span class="token function">extend</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">&quot;uarea-picker&quot;</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/** picker 高度 */</span>
    <span class="token literal-property property">height</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token punctuation">[</span>String<span class="token punctuation">,</span> Number<span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token keyword">default</span><span class="token operator">:</span> <span class="token string">&quot;554rpx&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/** popup 层级 */</span>
    <span class="token literal-property property">zIndex</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> Number<span class="token punctuation">,</span>
      <span class="token keyword">default</span><span class="token operator">:</span> <span class="token number">99</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/** 选中数据 */</span>
    <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token punctuation">[</span>Number<span class="token punctuation">,</span> String<span class="token punctuation">,</span> Array<span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token literal-property property">required</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/** 模式，只支持单列 selector 和多列 multiSelector */</span>
    <span class="token literal-property property">mode</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> String<span class="token punctuation">,</span>
      <span class="token keyword">default</span><span class="token operator">:</span> <span class="token string">&quot;selector&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/** 选择列表 */</span>
    <span class="token literal-property property">range</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> Array<span class="token punctuation">,</span>
      <span class="token literal-property property">required</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/** 当每列的数据项是 object 时, rangeKey 用于选择视图展示对象中的哪个属性 */</span>
    <span class="token literal-property property">rangeKey</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> String<span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/** 是否隐藏 */</span>
    <span class="token literal-property property">hidden</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> Boolean<span class="token punctuation">,</span>
      <span class="token keyword">default</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/** 是否禁用 */</span>
    <span class="token literal-property property">disabled</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> Boolean<span class="token punctuation">,</span>
      <span class="token keyword">default</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/** 取消文字 */</span>
    <span class="token literal-property property">cancelText</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> String<span class="token punctuation">,</span>
      <span class="token keyword">default</span><span class="token operator">:</span> <span class="token string">&quot;取消&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/** 确认文字 */</span>
    <span class="token literal-property property">confirmText</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> String<span class="token punctuation">,</span>
      <span class="token keyword">default</span><span class="token operator">:</span> <span class="token string">&quot;确认&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      <span class="token doc-comment comment">/** 规整化 value */</span>
      <span class="token literal-property property">normalizeValue</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token doc-comment comment">/** change 数据 */</span>
      <span class="token literal-property property">cancheData</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token doc-comment comment">/** 点击完成 */</span>
      <span class="token literal-property property">clickIntoComplete</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
      <span class="token doc-comment comment">/** 防止频繁点击 */</span>
      <span class="token literal-property property">disabledClick</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
      <span class="token doc-comment comment">/** 记录当前列改变时后面列的索引 */</span>
      <span class="token literal-property property">afterChangeIndexs</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">watch</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/** 侦听 value 变化, 变化后规整化数据 */</span>
    <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token function">handler</span><span class="token punctuation">(</span><span class="token parameter">val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>mode <span class="token operator">===</span> modeType<span class="token punctuation">.</span><span class="token constant">MULTI_SELECTOR</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>normalizeValue <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">transform</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">this</span><span class="token punctuation">.</span>normalizeValue <span class="token operator">=</span> Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span> <span class="token operator">?</span> val<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token punctuation">[</span>val<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token literal-property property">immediate</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token literal-property property">deep</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">computed</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> 规整化 height
     */</span>
    <span class="token function">normalizeHeight</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> <span class="token keyword">this</span><span class="token punctuation">.</span>height <span class="token operator">===</span> <span class="token string">&quot;string&quot;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>height<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>height <span class="token operator">+</span> <span class="token string">&quot;px&quot;</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 添加定时器，防止频繁触发事件
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">timer</span> 禁止其他事件触发的时长
     */</span>
    <span class="token function">preventFrequentClicks</span><span class="token punctuation">(</span><span class="token parameter">timer <span class="token operator">=</span> <span class="token number">300</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>disabledClick <span class="token operator">===</span> <span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>disabledClick <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>

        <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>disabledClick <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">,</span> timer<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 统一调度事件处理程序
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Function<span class="token punctuation">}</span></span> <span class="token parameter">cb</span> 回调
     */</span>
    <span class="token function">runIn</span><span class="token punctuation">(</span><span class="token parameter">cb</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>disabledClick <span class="token operator">===</span> <span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">preventFrequentClicks</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        cb <span class="token operator">&amp;&amp;</span> <span class="token function">cb</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> 打开 picker
     */</span>
    <span class="token function">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>disabled<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>

      <span class="token keyword">this</span><span class="token punctuation">.</span>clickIntoComplete <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>$refs<span class="token punctuation">.</span>picker<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">runIn</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$refs<span class="token punctuation">.</span>picker<span class="token punctuation">.</span><span class="token function">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> 关闭 picker
     */</span>
    <span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>$refs<span class="token punctuation">.</span>picker<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">runIn</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>$refs<span class="token punctuation">.</span>picker<span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> open 别名
     */</span>
    <span class="token function">openPicker</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">open</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 消息传递
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">type</span>
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>any<span class="token punctuation">}</span></span> <span class="token parameter">data</span>
     */</span>
    <span class="token function">emit</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> data</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">$emit</span><span class="token punctuation">(</span>type<span class="token punctuation">,</span> data<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * 
     * <span class="token keyword">@description</span> 规整化 range
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">range</span> 
     */</span>
    <span class="token function">getRange</span><span class="token punctuation">(</span><span class="token parameter">range</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>mode <span class="token operator">===</span> modeType<span class="token punctuation">.</span><span class="token constant">MULTI_SELECTOR</span> <span class="token operator">?</span> range <span class="token operator">:</span> <span class="token punctuation">[</span>range<span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 计算 key 值
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token operator">|</span>object<span class="token punctuation">}</span></span> <span class="token parameter">row</span>
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">index</span>
     */</span>
    <span class="token function">getKey</span><span class="token punctuation">(</span><span class="token parameter">row<span class="token punctuation">,</span> index</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>rangeKey <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>rangeKey <span class="token operator">!==</span> <span class="token keyword">undefined</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> row<span class="token punctuation">[</span><span class="token keyword">this</span><span class="token punctuation">.</span>rangeKey<span class="token punctuation">]</span> <span class="token operator">+</span> index<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">return</span> row <span class="token operator">+</span> index<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 获取展示文本
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token operator">|</span>object<span class="token punctuation">}</span></span> <span class="token parameter">row</span>
     */</span>
    <span class="token function">getDisplayText</span><span class="token punctuation">(</span><span class="token parameter">row</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>
        <span class="token keyword">typeof</span> row <span class="token operator">===</span> <span class="token string">&quot;object&quot;</span> <span class="token operator">&amp;&amp;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>rangeKey <span class="token operator">!==</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>rangeKey <span class="token operator">!==</span> <span class="token keyword">undefined</span>
      <span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> row<span class="token punctuation">[</span><span class="token keyword">this</span><span class="token punctuation">.</span>rangeKey<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">return</span> row<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 创建自定义事件对象
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>object<span class="token punctuation">}</span></span> <span class="token parameter">detail</span>
     */</span>
    <span class="token function">createCustomEvent</span><span class="token punctuation">(</span><span class="token parameter">detail</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> <span class="token punctuation">{</span> <span class="token literal-property property">detail</span><span class="token operator">:</span> detail <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 转换数据
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token operator">|</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">val</span>
     */</span>
    <span class="token function">transform</span><span class="token punctuation">(</span><span class="token parameter">val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">let</span> result <span class="token operator">=</span> val<span class="token punctuation">;</span>

      result <span class="token operator">=</span> Array<span class="token punctuation">.</span><span class="token function">isArray</span><span class="token punctuation">(</span>val<span class="token punctuation">)</span> <span class="token operator">?</span> val<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token punctuation">[</span>val<span class="token punctuation">]</span><span class="token punctuation">;</span>

      result <span class="token operator">=</span> result<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">int</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span><span class="token function">parseInt</span><span class="token punctuation">(</span>int<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">return</span> result<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * 
     * <span class="token keyword">@description</span> columnchange 事件在 change 事件之前, 发送的数据可能会改变列数, change 事件时的 value 值便不对了, 需要加以限制
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">value</span> 
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">range</span> 
     */</span>
    <span class="token function">preventOverflow</span><span class="token punctuation">(</span><span class="token parameter">value<span class="token punctuation">,</span> range</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">let</span> multiValue <span class="token operator">=</span> value<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> range<span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span>

      multiValue <span class="token operator">=</span> multiValue<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Array</span><span class="token punctuation">(</span>range<span class="token punctuation">.</span>length <span class="token operator">-</span> multiValue<span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">fill</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> multiValue<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>multiValue<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">&gt;=</span> range<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          multiValue<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">return</span> multiValue<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 处理选择数据改变事件处理函数
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>CustomEvent<span class="token punctuation">}</span></span> <span class="token parameter">e</span>
     */</span>
    <span class="token function">handleDataChange</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> value <span class="token operator">=</span> e<span class="token punctuation">.</span>detail<span class="token punctuation">.</span>value<span class="token punctuation">;</span>

      <span class="token keyword">this</span><span class="token punctuation">.</span>cancheData <span class="token operator">=</span> value<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>mode <span class="token operator">===</span> modeType<span class="token punctuation">.</span><span class="token constant">MULTI_SELECTOR</span><span class="token punctuation">)</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">handleColumnChange</span><span class="token punctuation">(</span>value<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>clickIntoComplete<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">confirm</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 某列改变时触发
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Array<span class="token punctuation">}</span></span> <span class="token parameter">val</span>
     */</span>
    <span class="token function">handleColumnChange</span><span class="token punctuation">(</span><span class="token parameter">val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> nValue <span class="token operator">=</span> val<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">const</span> oValue <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>normalizeValue<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">let</span> changeColumnIndex <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span>

      <span class="token doc-comment comment">/** 获取改变后的列所在索引 */</span>
      <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> oValue<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>oValue<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">!==</span> nValue<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          changeColumnIndex <span class="token operator">=</span> i<span class="token punctuation">;</span>
          <span class="token keyword">break</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span>changeColumnIndex <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>

      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span>
        eventType<span class="token punctuation">.</span><span class="token constant">COLUMN_CHANGE</span><span class="token punctuation">,</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">createCustomEvent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
          <span class="token literal-property property">column</span><span class="token operator">:</span> changeColumnIndex<span class="token punctuation">,</span>
          <span class="token literal-property property">value</span><span class="token operator">:</span> nValue<span class="token punctuation">[</span>changeColumnIndex<span class="token punctuation">]</span><span class="token punctuation">,</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span>
      <span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token doc-comment comment">/** 如果改变的不是最后一列, 则后面列需要进行视图刷新 */</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>changeColumnIndex <span class="token operator">!==</span> nValue<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> needResetColumn <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">let</span> i <span class="token operator">=</span> changeColumnIndex <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> nValue<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          needResetColumn<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span>i<span class="token punctuation">)</span><span class="token punctuation">;</span>

          <span class="token comment">// 默认重置后续列为 0, 如果不重置会导致很多 bug</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span>eventType<span class="token punctuation">.</span><span class="token constant">COLUMN_CHANGE</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">createCustomEvent</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">column</span><span class="token operator">:</span> i<span class="token punctuation">,</span> <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token number">0</span> <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">this</span><span class="token punctuation">.</span>afterChangeIndexs <span class="token operator">=</span> needResetColumn<span class="token punctuation">;</span>

        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">$nextTick</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span>afterChangeIndexs <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> 点击遮罩事件处理程序
     */</span>
    <span class="token function">handleMaskClick</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">cancel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> 点击确认按钮的事件处理程序
     */</span>
    <span class="token function">complete</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>clickIntoComplete <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">confirm</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> 点击取消按钮的事件处理程序
     */</span>
    <span class="token function">cancel</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span>eventType<span class="token punctuation">.</span><span class="token constant">CANCEL</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">createCustomEvent</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">this</span><span class="token punctuation">.</span>cancheData <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>clickIntoComplete <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> 确认事件处理程序
     */</span>
    <span class="token function">confirm</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">close</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>cancheData<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span>
          eventType<span class="token punctuation">.</span><span class="token constant">CHANGE</span><span class="token punctuation">,</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">createCustomEvent</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
            <span class="token literal-property property">value</span><span class="token operator">:</span>
              <span class="token keyword">this</span><span class="token punctuation">.</span>mode <span class="token operator">===</span> modeType<span class="token punctuation">.</span><span class="token constant">MULTI_SELECTOR</span>
                <span class="token operator">?</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">preventOverflow</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>cancheData<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>range<span class="token punctuation">)</span>
                <span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>cancheData<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
          <span class="token punctuation">}</span><span class="token punctuation">)</span>
        <span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">this</span><span class="token punctuation">.</span>clickIntoComplete <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>cancheData <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span>
          eventType<span class="token punctuation">.</span><span class="token constant">CHANGE</span><span class="token punctuation">,</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">createCustomEvent</span><span class="token punctuation">(</span><span class="token punctuation">{</span> <span class="token literal-property property">value</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>normalizeValue<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">}</span><span class="token punctuation">)</span>
        <span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">this</span><span class="token punctuation">.</span>clickIntoComplete <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,4),b=n("code",null,"uni-popup",-1),y=n("code",null,"transform",-1),w=n("code",null,"root",-1),h={href:"https://www.html5plus.org/doc/h5p.html",target:"_blank",rel:"noopener noreferrer"},g={href:"https://www.html5plus.org/doc/h5p.html",target:"_blank",rel:"noopener noreferrer"},f=p(`<h2 id="fixed-注意事项" tabindex="-1"><a class="header-anchor" href="#fixed-注意事项" aria-hidden="true">#</a> fixed 注意事项</h2><p>因为项目主要是移动端，所以做了宽度限制，在宽屏（PC 或平板横屏）中项目展示区域可能不会使用到所有可视区域，此时会在两边留有空白区域，如果按平常的固定定位写法：</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.fixed</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> fixed<span class="token punctuation">;</span>
  <span class="token property">top</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">right</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">bottom</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token property">left</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
  <span class="token comment">/* or */</span>
  <span class="token property">inset</span><span class="token punctuation">:</span> 0<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="http://qkc148.bvimg.com/18470/5ad854c2d983a0ec.png" alt="20231113002311" loading="lazy"></p><p>会出现上图中的问题，此时正确的写法应该是加上 uniapp 官方提供的上下左右边距：</p><div class="language-css line-numbers-mode" data-ext="css"><pre class="language-css"><code><span class="token selector">.fixed</span> <span class="token punctuation">{</span>
  <span class="token property">position</span><span class="token punctuation">:</span> fixed<span class="token punctuation">;</span>
  <span class="token property">top</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--window-top<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">right</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--window-right<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">bottom</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--window-bottom<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token property">left</span><span class="token punctuation">:</span> <span class="token function">var</span><span class="token punctuation">(</span>--window-left<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="http://qkc148.bvimg.com/18470/6fab4c889ad83d01.png" alt="20231113002605" loading="lazy"></p><h2 id="ios-h5-阻尼滚动" tabindex="-1"><a class="header-anchor" href="#ios-h5-阻尼滚动" aria-hidden="true">#</a> ios H5 阻尼滚动</h2><p>项目用到滚动的地方基本都是用 scroll-view（虽然性能不好，但当时好像也是为了解决 ios 微信 H5 的一个 bug 才使用的，可以说是填了一个坑又来一个坑），在 scroll-view 滚动时可能会触发页面的滚动，因为 ios 是自带有阻尼回弹效果的，当页面滚动到边界时触发阻尼效果，此时 scroll-view 的滚动会失效，出现页面无法滑动的假象，如下图：</p><p><img src="http://qkc148.bvimg.com/18470/756781ca9cc5bef5.jpg" alt="ios h5 阻尼回弹" loading="lazy"></p><p>可以看到触发了页面的滚动，而 scroll-view 的滚动无法触发，导致出现滑不动的情况，需要等待几秒后才能继续滑动。</p><p>这个问题目前还没有好的解决方案，如果需要处理最好是使用页面的滚动行为，对于性能也会更好一点。</p><h2 id="ios-h5-输入框聚焦后底部出现留白" tabindex="-1"><a class="header-anchor" href="#ios-h5-输入框聚焦后底部出现留白" aria-hidden="true">#</a> ios H5 输入框聚焦后底部出现留白</h2><p>这其实是正常的现象，因为 ios H5 会在输入框聚焦软键盘弹出时给底部添加一块空白区域来让页面上推，防止有区域被软键盘遮挡，如下图：</p><p><img src="http://qkc148.bvimg.com/18470/19ed420928e13979.jpg" alt="ios H5 底部留白" loading="lazy"></p><p>虽然是正常现象，奈何老板有命，不得不从。</p><p>为了看不到这个空白区域，一个简单的想法是空白区域即将出现在可视区时，阻止页面继续滑动，为此我们需要知道两个关键的变量：</p><ul><li>软键盘的高度</li><li>软键盘弹出时页面卷上去的高度（也就是底部空白块的高度）</li></ul><p>然后就可以愉快的侦听页面滚动和触摸事件了，因为页面滚动是无法取消的，所以这里的做法是每次滚动超出时回滚页面，而触摸事件则可以阻止默认的行为，代码如下：</p><div class="language-vue line-numbers-mode" data-ext="vue"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>input</span> <span class="token attr-name">@focus</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>handleFocus<span class="token punctuation">&quot;</span></span> <span class="token punctuation">/&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">keyboardHeight</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
      <span class="token literal-property property">blackAreaHeight</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
      <span class="token literal-property property">isFocus</span><span class="token operator">:</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// #ifdef H5</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>isIos <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>isWXBrower <span class="token operator">===</span> <span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// window.resize 无法侦听到 ios 软键盘挤压页面的事件，只能用 window.visualViewport</span>
      window<span class="token punctuation">.</span>visualViewport<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&quot;resize&quot;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>handleResize<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token comment">// 软键盘弹出底部块顶起页面时会触发 scroll，此时获取 window.scrollY 即可知道底部空白块的高度</span>
      window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&quot;scroll&quot;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>handleScrollGetBlackAreaHeight<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token comment">// 滚动无法阻止，只能回滚页面</span>
      window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&quot;scroll&quot;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>handleScroll<span class="token punctuation">)</span><span class="token punctuation">;</span>

      window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&quot;touchstart&quot;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>handleTouchStart<span class="token punctuation">,</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">passive</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&quot;touchmove&quot;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>handleTouchMove<span class="token punctuation">,</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">passive</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      window<span class="token punctuation">.</span><span class="token function">addEventListener</span><span class="token punctuation">(</span><span class="token string">&quot;touchend&quot;</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>handleTouchEnd<span class="token punctuation">,</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">passive</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// #endif</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">handleFocus</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// focus 时软键盘即将弹出</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>isFocus <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>blackAreaHeight <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

      <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>isFocus <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">500</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// window.resize 无法侦听到 ios 软键盘挤压页面的事件，只能用 window.visualViewport</span>
    <span class="token function">handleResize</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 获取键盘高度</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>keyboardHeight <span class="token operator">=</span> window<span class="token punctuation">.</span>innerHeight <span class="token operator">-</span> e<span class="token punctuation">.</span>target<span class="token punctuation">.</span>height<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// 软键盘弹出底部块顶起页面时会触发 scroll，此时获取 window.scrollY 即可知道底部空白块的高度</span>
    <span class="token function">handleScrollGetBlackAreaHeight</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>isFocus<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 获取底部空白块高度</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>blackAreaHeight <span class="token operator">=</span> window<span class="token punctuation">.</span>scrollY<span class="token punctuation">;</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>isFocus <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token comment">// 滚动无法阻止，只能回滚页面</span>
    <span class="token function">handleScroll</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>window<span class="token punctuation">.</span>scrollY <span class="token operator">&gt;=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>keyboardHeight <span class="token operator">+</span> <span class="token keyword">this</span><span class="token punctuation">.</span>scrollTop <span class="token operator">||</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        window<span class="token punctuation">.</span><span class="token function">scrollTo</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>keyboardHeight <span class="token operator">+</span> <span class="token keyword">this</span><span class="token punctuation">.</span>scrollTop <span class="token operator">||</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">handleTouchStart</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>startY <span class="token operator">=</span> e<span class="token punctuation">.</span>touches <span class="token operator">?</span> e<span class="token punctuation">.</span>touches<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>screenY <span class="token operator">:</span> e<span class="token punctuation">.</span>screenY<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">handleTouchMove</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>window<span class="token punctuation">.</span>scrollY <span class="token operator">&gt;=</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>keyboardHeight <span class="token operator">+</span> <span class="token keyword">this</span><span class="token punctuation">.</span>scrollTop <span class="token operator">||</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">5</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">const</span> endY <span class="token operator">=</span> e<span class="token punctuation">.</span>touches <span class="token operator">?</span> e<span class="token punctuation">.</span>touches<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>screenY <span class="token operator">:</span> e<span class="token punctuation">.</span>screenY<span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>startY <span class="token operator">&gt;</span> endY<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          e<span class="token punctuation">.</span><span class="token function">preventDefault</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
          e<span class="token punctuation">.</span><span class="token function">stopPropagation</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">handleTouchEnd</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>startY <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码虽然有效，但还有几个需要解决的地方：</p><ul><li><code>window.visualViewport</code> 在 ios 13 中才开始支持，需要找到其他兼容性更好的方式获取软键盘高度</li><li>如果触发滚动时手指缓慢滑动至边界且不松手，此时会频繁触发 <strong>滚动溢出 &lt;-&gt; 回滚</strong> 而导致页面抖动</li><li>在两个输入框中进行切换，且输入框类型不相同（普通输入框和密码输入框），如果两个输入框高度不一致，此时获取到的键盘高度是不正确的</li></ul><h2 id="ios-h5-侧滑返回" tabindex="-1"><a class="header-anchor" href="#ios-h5-侧滑返回" aria-hidden="true">#</a> ios H5 侧滑返回</h2><p>这个问题可能不常见，但是触发比较简单。只要从页面 A 进入页面 B，页面 B 中的路由阻止了路由跳转事件（<code>next(false)</code>），此时通过其他方式是不能离开页面 B 的，但是通过侧滑返回可以返回到页面 A。这个时候如果你去操作页面 A 会发现非常卡顿，且等待一段时间后又会回到页面 B。</p><p>关于这个问题主要是看具体的需求，这里我的需求就是侧滑返回时操作页面不能卡顿，所以在页面路由中进行了判断，如果是 ios H5 的侧滑返回则不阻止它跳转。</p><h2 id="android-app-请求权限问题" tabindex="-1"><a class="header-anchor" href="#android-app-请求权限问题" aria-hidden="true">#</a> Android App 请求权限问题</h2>`,26),q={href:"https://www.html5plus.org/doc/h5p.html",target:"_blank",rel:"noopener noreferrer"},x=n("code",null,"getInfo",-1),_=n("code",null,"getOAID",-1),T=n("p",null,"因为项目在启动时是默认调用相关 API 的，就会导致频繁的向用户请求授权，同时还要考虑用户永久拒绝权限的情况，可能需要通过其他方式来识别用户设备身份。",-1),S=n("h2",{id:"阻尼回弹",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#阻尼回弹","aria-hidden":"true"},"#"),s(" 阻尼回弹")],-1),E={href:"https://github.com/cubiq/iscroll",target:"_blank",rel:"noopener noreferrer"},C=p(`<p>下面是写的组件源码，无法在实际项目中使用，但研究下思路进行完善也是可以的：</p><div class="language-vue line-numbers-mode" data-ext="vue"><pre class="language-vue"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>view</span>
    <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>scroller-container<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>scroller-container<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>{ width: width, height: height }<span class="token punctuation">&quot;</span></span>

    <span class="token attr-name">:scroll-x</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>scrollX<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:change:scroll-x</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bounce.updateScrollX<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:scroll-y</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>scrollY<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:change:scroll-y</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bounce.updateScrollY<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:scrollLeft</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>scrollLeft<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:change:scrollLeft</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bounce.updateScrollLeft<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:scrollTop</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>scrollTop<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:change:scrollTop</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bounce.updateScrollTop<span class="token punctuation">&quot;</span></span>

    <span class="token attr-name">:width</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>width<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:height</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>height<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:change:width</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bounce.updateScrollerContainerRect<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">:change:height</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bounce.updateScrollerContainerRect<span class="token punctuation">&quot;</span></span>

    <span class="token attr-name">@touchstart</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bounce.handleStart<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">@touchmove</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bounce.handleMove<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">@touchend</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bounce.handleEnd<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">@touchcancel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bounce.handleCancel<span class="token punctuation">&quot;</span></span>

    <span class="token attr-name">@mousedown</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bounce.handleStart<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">@mousemove</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bounce.handleMove<span class="token punctuation">&quot;</span></span>
    <span class="token attr-name">@mouseup</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bounce.handleEnd<span class="token punctuation">&quot;</span></span>
  <span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>view</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>scroller<span class="token punctuation">&quot;</span></span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>scroller<span class="token punctuation">&quot;</span></span> <span class="token attr-name">@transitionend</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bounce.handleTransitionend<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span>
      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>slot</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>default<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>slot</span><span class="token punctuation">&gt;</span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>view</span><span class="token punctuation">&gt;</span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>view</span><span class="token punctuation">&gt;</span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/** 滚动容器宽度 */</span>
    <span class="token literal-property property">width</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token punctuation">[</span>String<span class="token punctuation">,</span> Number<span class="token punctuation">]</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/** 滚动容器高度 */</span>
    <span class="token literal-property property">height</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token punctuation">[</span>String<span class="token punctuation">,</span> Number<span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token literal-property property">require</span><span class="token operator">:</span> <span class="token boolean">true</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/** x 轴滚动 */</span>
    <span class="token literal-property property">scrollX</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> Boolean<span class="token punctuation">,</span>
      <span class="token keyword">default</span><span class="token operator">:</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/** y 轴滚动 */</span>
    <span class="token literal-property property">scrollY</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> Boolean<span class="token punctuation">,</span>
      <span class="token keyword">default</span><span class="token operator">:</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/** x 轴滚动距离 */</span>
    <span class="token literal-property property">scrollLeft</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> Number<span class="token punctuation">,</span>
      <span class="token keyword">default</span><span class="token operator">:</span> <span class="token number">0</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/** y 轴滚动距离 */</span>
    <span class="token literal-property property">scrollTop</span><span class="token operator">:</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> Number<span class="token punctuation">,</span>
      <span class="token keyword">default</span><span class="token operator">:</span> <span class="token number">0</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 向父组件发送消息
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">type</span>
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>any<span class="token punctuation">}</span></span> <span class="token parameter">payload</span>
     */</span>
    <span class="token function">emit</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> payload</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">$emit</span><span class="token punctuation">(</span>type<span class="token punctuation">,</span> payload<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 统一事件管理
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>CustomEvent<span class="token punctuation">}</span></span> <span class="token parameter">e</span>
     */</span>
    <span class="token function">handleEvent</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">emit</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>type<span class="token punctuation">,</span> e<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span> <span class="token attr-name">module</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>bounce<span class="token punctuation">&quot;</span></span> <span class="token attr-name">lang</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">&quot;</span>renderjs<span class="token punctuation">&quot;</span></span><span class="token punctuation">&gt;</span></span><span class="token script"><span class="token language-javascript">
<span class="token doc-comment comment">/** 回弹动画时长 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> <span class="token constant">BOUNCE_TIME</span> <span class="token operator">=</span> <span class="token number">600</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/** 事件类型 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> eventType <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token doc-comment comment">/**
   * <span class="token keyword">@description</span> 触摸事件类型 1
   */</span>
  <span class="token literal-property property">touchstart</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
  <span class="token literal-property property">touchmove</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
  <span class="token literal-property property">touchend</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>
  <span class="token literal-property property">touchcancel</span><span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">,</span>


  <span class="token doc-comment comment">/**
   * <span class="token keyword">@description</span> 鼠标事件类型 2
   */</span>
  <span class="token literal-property property">mousedown</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
  <span class="token literal-property property">mousemove</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>
  <span class="token literal-property property">mouseup</span><span class="token operator">:</span> <span class="token number">2</span><span class="token punctuation">,</span>

  <span class="token doc-comment comment">/**
   * <span class="token keyword">@description</span> 指针事件类型 3
   */</span>
  <span class="token literal-property property">pointerdown</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
  <span class="token literal-property property">pointermove</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
  <span class="token literal-property property">pointerup</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>

  <span class="token doc-comment comment">/**
   * <span class="token keyword">@description</span> IE 指针事件类型 4
   */</span>
  <span class="token literal-property property">MSPointerDown</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
  <span class="token literal-property property">MSPointerMove</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>
  <span class="token literal-property property">MSPointerUp</span><span class="token operator">:</span> <span class="token number">3</span><span class="token punctuation">,</span>

  <span class="token doc-comment comment">/**
   * <span class="token keyword">@description</span>  app 端 onTouch 事件类型 5
   */</span>
  <span class="token literal-property property">onTouchstart</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span>
  <span class="token literal-property property">onTouchmove</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span>
  <span class="token literal-property property">onTouchend</span><span class="token operator">:</span> <span class="token number">4</span><span class="token punctuation">,</span>
  <span class="token literal-property property">onTouchcancel</span><span class="token operator">:</span> <span class="token number">4</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/** start 事件类型 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> startEventType <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string">&#39;touchstart&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;mousedown&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;pointerdown&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;MSPointerDown&#39;</span><span class="token punctuation">,</span> <span class="token string">&#39;onTouchstart&#39;</span><span class="token punctuation">]</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/** 暴露的事件 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> event <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token constant">SCROLL_TO_UPPER</span><span class="token operator">:</span> <span class="token string">&#39;scrolltoupper&#39;</span><span class="token punctuation">,</span>
  <span class="token constant">SCROLL_TO_LOWER</span><span class="token operator">:</span> <span class="token string">&#39;scrolltolower&#39;</span><span class="token punctuation">,</span>
  <span class="token constant">SCROLL</span><span class="token operator">:</span> <span class="token string">&#39;scroll&#39;</span><span class="token punctuation">,</span>
  <span class="token constant">ON_SCROLL</span><span class="token operator">:</span> <span class="token string">&#39;onScroll&#39;</span><span class="token punctuation">,</span>
  <span class="token constant">REFRESHER_PULLING</span><span class="token operator">:</span> <span class="token string">&#39;refresherpulling&#39;</span><span class="token punctuation">,</span>
  <span class="token constant">REFRESHER_REFRESH</span><span class="token operator">:</span> <span class="token string">&#39;refresherrefresh&#39;</span><span class="token punctuation">,</span>
  <span class="token constant">REFRESHER_RESTORE</span><span class="token operator">:</span> <span class="token string">&#39;refresherrestore&#39;</span><span class="token punctuation">,</span>
  <span class="token constant">REFRESHER_ABORT</span><span class="token operator">:</span> <span class="token string">&#39;refresherabort&#39;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/** 默认回弹动画事件函数 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> circular <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">style</span><span class="token operator">:</span> <span class="token string">&quot;cubic-bezier(0.1, 0.57, 0.1, 1)&quot;</span><span class="token punctuation">,</span>
  <span class="token function-variable function">fn</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">k</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> Math<span class="token punctuation">.</span><span class="token function">sqrt</span><span class="token punctuation">(</span><span class="token number">1</span> <span class="token operator">-</span> <span class="token operator">--</span>k <span class="token operator">*</span> k<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>

<span class="token doc-comment comment">/** 特定回弹动画事件函数 */</span>
<span class="token keyword">export</span> <span class="token keyword">const</span> quadratic <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">style</span><span class="token operator">:</span> <span class="token string">&quot;cubic-bezier(0.25, 0.46, 0.45, 0.94)&quot;</span><span class="token punctuation">,</span>
  <span class="token function-variable function">fn</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">k</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> k <span class="token operator">*</span> <span class="token punctuation">(</span><span class="token number">2</span> <span class="token operator">-</span> k<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>


<span class="token keyword">let</span> timerId <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/**
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">time</span>
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Function<span class="token punctuation">}</span></span> <span class="token parameter">fn</span>
 */</span>
<span class="token keyword">export</span> <span class="token keyword">function</span> <span class="token function">debounce</span><span class="token punctuation">(</span><span class="token parameter">time<span class="token punctuation">,</span> fn</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>timerId<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token function">clearTimeout</span><span class="token punctuation">(</span>timerId<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  timerId <span class="token operator">=</span> <span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    timerId <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token function">fn</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> Array<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>arguments<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span> time<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">let</span> ownnerPos <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">x</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token literal-property property">y</span><span class="token operator">:</span> <span class="token number">0</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/** 滚动容器 */</span>
<span class="token keyword">let</span> scrollerContainer <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 滚动目标 */</span>
<span class="token keyword">let</span> scroller <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 滚动容器 rect */</span>
<span class="token keyword">let</span> scrollerContainerRect <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">left</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token literal-property property">top</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token literal-property property">width</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token literal-property property">height</span><span class="token operator">:</span> <span class="token number">0</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 滚动目标 rect */</span>
<span class="token keyword">let</span> scrollerRect <span class="token operator">=</span> <span class="token punctuation">{</span>
  <span class="token literal-property property">left</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token literal-property property">top</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token literal-property property">width</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
  <span class="token literal-property property">height</span><span class="token operator">:</span> <span class="token number">0</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** x 轴最大滚动距离 */</span>
<span class="token keyword">let</span> maxScrollX <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** y 轴最大滚动距离 */</span>
<span class="token keyword">let</span> maxScrollY <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 允许 x 轴滚动 */</span>
<span class="token keyword">let</span> hasHorizontalScroll <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 允许 y 轴滚动 */</span>
<span class="token keyword">let</span> hasVerticalScroll <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 是否在过渡中 */</span>
<span class="token keyword">let</span> isInTransition <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 开始时间 */</span>
<span class="token keyword">let</span> startTime <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 结束时间 */</span>
<span class="token keyword">let</span> endTime <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 当前事件类型，同属一组的事件数据一致，(touchstart, touchmove, touchend) */</span>
<span class="token keyword">let</span> initiated <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 是否移动中 */</span>
<span class="token keyword">let</span> moved <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** x 点 */</span>
<span class="token keyword">let</span> x <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** y 点 */</span>
<span class="token keyword">let</span> y <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 开始 x 点 */</span>
<span class="token keyword">let</span> startX <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 开始 y 点 */</span>
<span class="token keyword">let</span> startY <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 页面 x 点 */</span>
<span class="token keyword">let</span> pointX <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 页面 y 点 */</span>
<span class="token keyword">let</span> pointY <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 区域 x 点 */</span>
<span class="token keyword">let</span> distX <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 区域 y 点 */</span>
<span class="token keyword">let</span> distY <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 方向 x 点 */</span>
<span class="token keyword">let</span> directionX <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token doc-comment comment">/** 方向 y 点 */</span>
<span class="token keyword">let</span> directionY <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

<span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span>
  <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">bounceScrollX</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
      <span class="token literal-property property">bounceScrollY</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span>
      <span class="token literal-property property">bounceScrollLeft</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
      <span class="token literal-property property">bounceScrollTop</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">watch</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token function">bounceScrollX</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">bounceScrollY</span><span class="token punctuation">(</span><span class="token parameter">val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">bounceScrollLeft</span><span class="token punctuation">(</span><span class="token parameter">val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">scrollTo</span><span class="token punctuation">(</span>val<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>bounceScrollTop<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function">bounceScrollTop</span><span class="token punctuation">(</span><span class="token parameter">val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">scrollTo</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>bounceScrollLeft<span class="token punctuation">,</span> val<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token doc-comment comment">/** init */</span>
  <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    scrollerContainer <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;scroller-container&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    scroller <span class="token operator">=</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">&#39;scroller&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">updateScrollerContainerRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">updateScrollerRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setTransitionTime</span><span class="token punctuation">(</span>circular<span class="token punctuation">.</span>style<span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">scrollTo</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>bounceScrollLeft<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">.</span>bounceScrollTop<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 设置过渡时长
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">time</span>
     */</span>
     <span class="token function">setTransitionTime</span><span class="token punctuation">(</span><span class="token parameter">time</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      scroller<span class="token punctuation">.</span>style<span class="token punctuation">[</span><span class="token string">&#39;transitionDuration&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> time <span class="token operator">+</span> <span class="token string">&#39;ms&#39;</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 设置过渡时间线函数
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">easing</span>
     */</span>
    <span class="token function">setTransitionTimingFunction</span><span class="token punctuation">(</span><span class="token parameter">easing</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      scroller<span class="token punctuation">.</span>style<span class="token punctuation">[</span><span class="token string">&#39;transitionTimingFunction&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> easing<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 设置转换
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">_x</span>
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">_y</span>
     */</span>
    <span class="token function">setTransForm</span><span class="token punctuation">(</span><span class="token parameter">_x<span class="token punctuation">,</span> _y</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      scroller<span class="token punctuation">.</span>style<span class="token punctuation">[</span><span class="token string">&#39;transform&#39;</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">translate(</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>_x<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">px, </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>_y<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">px) translateZ(0)</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> 更新滚动容器矩形
    */</span>
    <span class="token function">updateScrollerContainerRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>scrollerContainer<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        scrollerContainerRect <span class="token operator">=</span> scrollerContainer<span class="token punctuation">.</span><span class="token function">getBoundingClientRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> 更新滚动目标矩形
    */</span>
    <span class="token function">updateScrollerRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>scroller<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        scrollerRect <span class="token operator">=</span> scroller<span class="token punctuation">.</span><span class="token function">getBoundingClientRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> 更新 x 轴是否可滚动
    */</span>
    <span class="token function">updateScrollX</span><span class="token punctuation">(</span><span class="token parameter">n</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>bounceScrollX <span class="token operator">=</span> n<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> 更新 x 轴距离
    */</span>
    <span class="token function">updateScrollLeft</span><span class="token punctuation">(</span><span class="token parameter">n</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>bounceScrollLeft <span class="token operator">=</span> n<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> 更新 y 轴距离
    */</span>
    <span class="token function">updateScrollTop</span><span class="token punctuation">(</span><span class="token parameter">n</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>bounceScrollTop <span class="token operator">=</span> n<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> 更新 y 轴是否可滚动
    */</span>
    <span class="token function">updateScrollY</span><span class="token punctuation">(</span><span class="token parameter">n</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span>bounceScrollY <span class="token operator">=</span> n<span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * 
     * <span class="token keyword">@description</span> 计算当前位置
    */</span>
    <span class="token function">getComputedPosition</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">let</span> matrix <span class="token operator">=</span> window<span class="token punctuation">.</span><span class="token function">getComputedStyle</span><span class="token punctuation">(</span>scroller<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      
      <span class="token keyword">let</span> _x <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
      <span class="token keyword">let</span> _y <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

      matrix <span class="token operator">=</span> matrix<span class="token punctuation">[</span><span class="token string">&#39;transform&#39;</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">&quot;)&quot;</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">&quot;, &quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      _x <span class="token operator">=</span> <span class="token operator">+</span><span class="token punctuation">(</span>matrix<span class="token punctuation">[</span><span class="token number">12</span><span class="token punctuation">]</span> <span class="token operator">||</span> matrix<span class="token punctuation">[</span><span class="token number">4</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      _y <span class="token operator">=</span> <span class="token operator">+</span><span class="token punctuation">(</span>matrix<span class="token punctuation">[</span><span class="token number">13</span><span class="token punctuation">]</span> <span class="token operator">||</span> matrix<span class="token punctuation">[</span><span class="token number">5</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">return</span> <span class="token punctuation">{</span> <span class="token literal-property property">x</span><span class="token operator">:</span> _x<span class="token punctuation">,</span> <span class="token literal-property property">y</span><span class="token operator">:</span> _y <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     * <span class="token keyword">@description</span> 更新数据
    */</span>
    <span class="token function">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">updateScrollerContainerRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">updateScrollerRect</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      maxScrollX <span class="token operator">=</span> scrollerContainerRect<span class="token punctuation">.</span>width <span class="token operator">-</span> scrollerRect<span class="token punctuation">.</span>width<span class="token punctuation">;</span>
      maxScrollY <span class="token operator">=</span> scrollerContainerRect<span class="token punctuation">.</span>height <span class="token operator">-</span> scrollerRect<span class="token punctuation">.</span>height<span class="token punctuation">;</span>

      hasHorizontalScroll <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>bounceScrollX <span class="token operator">&amp;&amp;</span> maxScrollX <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">;</span>
      hasVerticalScroll <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>bounceScrollY <span class="token operator">&amp;&amp;</span> maxScrollY <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">;</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span>hasHorizontalScroll <span class="token operator">===</span> <span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        maxScrollX <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token comment">// this.scrollerWidth = this.wrapperWidth;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span>hasVerticalScroll <span class="token operator">===</span> <span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        maxScrollY <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token comment">// this.scrollerHeight = this.wrapperHeight;</span>
      <span class="token punctuation">}</span>

      endTime <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
      directionX <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
      directionY <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">resetPosition</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 统一运行环境
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>string<span class="token punctuation">}</span></span> <span class="token parameter">type</span>
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Function<span class="token punctuation">}</span></span> <span class="token parameter">fn</span>
     */</span>
    <span class="token keyword">async</span> <span class="token function">runIn</span><span class="token punctuation">(</span><span class="token parameter">type<span class="token punctuation">,</span> fn</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>initiated <span class="token operator">===</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> startEventType<span class="token punctuation">.</span><span class="token function">includes</span><span class="token punctuation">(</span>type<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        initiated <span class="token operator">=</span> eventType<span class="token punctuation">[</span>type<span class="token punctuation">]</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span>initiated <span class="token operator">!==</span> eventType<span class="token punctuation">[</span>type<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token function">fn</span><span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> Array<span class="token punctuation">.</span><span class="token function">from</span><span class="token punctuation">(</span>arguments<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 重置 (回弹) 位置
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">time</span>
     */</span>
    <span class="token function">resetPosition</span><span class="token punctuation">(</span><span class="token parameter">time <span class="token operator">=</span> <span class="token number">0</span></span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">let</span> _x <span class="token operator">=</span> x<span class="token punctuation">;</span>
      <span class="token keyword">let</span> _y <span class="token operator">=</span> y<span class="token punctuation">;</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span>hasHorizontalScroll <span class="token operator">===</span> <span class="token boolean">false</span> <span class="token operator">||</span> x <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        _x <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>x <span class="token operator">&lt;</span> maxScrollX<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        _x <span class="token operator">=</span> maxScrollX<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span>hasVerticalScroll <span class="token operator">===</span> <span class="token boolean">false</span> <span class="token operator">||</span> y <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        _y <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>y <span class="token operator">&lt;</span> maxScrollY<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        _y <span class="token operator">=</span> maxScrollY<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span>_x <span class="token operator">===</span> x <span class="token operator">&amp;&amp;</span> _y <span class="token operator">===</span> y<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">scrollTo</span><span class="token punctuation">(</span>_x<span class="token punctuation">,</span> _y<span class="token punctuation">,</span> time<span class="token punctuation">,</span> circular<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 计算目标点及到底目标点应该使用的时间
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">current</span>
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">start</span>
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">time</span>
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">lowerMargin</span>
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">wrapperSize</span>
     */</span>
    <span class="token function">momentum</span><span class="token punctuation">(</span><span class="token parameter">current<span class="token punctuation">,</span> start<span class="token punctuation">,</span> time<span class="token punctuation">,</span> lowerMargin<span class="token punctuation">,</span> wrapperSize</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token comment">// 距离</span>
      <span class="token keyword">let</span> distance <span class="token operator">=</span> current <span class="token operator">-</span> start<span class="token punctuation">;</span>
      <span class="token comment">// 目的地</span>
      <span class="token keyword">let</span> destination <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
      <span class="token comment">// 时长</span>
      <span class="token keyword">let</span> duration <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

      <span class="token comment">// 阻尼系数</span>
      <span class="token keyword">const</span> deceleration <span class="token operator">=</span> <span class="token number">0.0006</span><span class="token punctuation">;</span>
      <span class="token comment">// 速度</span>
      <span class="token keyword">const</span> speed <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">abs</span><span class="token punctuation">(</span>distance<span class="token punctuation">)</span> <span class="token operator">/</span> time<span class="token punctuation">;</span>

      destination <span class="token operator">=</span>
        current <span class="token operator">+</span>
        <span class="token punctuation">(</span><span class="token punctuation">(</span>speed <span class="token operator">*</span> speed<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token punctuation">(</span><span class="token number">2</span> <span class="token operator">*</span> deceleration<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token punctuation">(</span>distance <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token operator">-</span><span class="token number">1</span> <span class="token operator">:</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      duration <span class="token operator">=</span> speed <span class="token operator">/</span> deceleration<span class="token punctuation">;</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span>destination <span class="token operator">&lt;</span> lowerMargin<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        destination <span class="token operator">=</span> wrapperSize
          <span class="token operator">?</span> lowerMargin <span class="token operator">-</span> <span class="token punctuation">(</span>wrapperSize <span class="token operator">/</span> <span class="token number">2.5</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token punctuation">(</span>speed <span class="token operator">/</span> <span class="token number">8</span><span class="token punctuation">)</span>
          <span class="token operator">:</span> lowerMargin<span class="token punctuation">;</span>
        distance <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">abs</span><span class="token punctuation">(</span>destination <span class="token operator">-</span> current<span class="token punctuation">)</span><span class="token punctuation">;</span>
        duration <span class="token operator">=</span> distance <span class="token operator">/</span> speed<span class="token punctuation">;</span>
      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>destination <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        destination <span class="token operator">=</span> wrapperSize <span class="token operator">?</span> <span class="token punctuation">(</span>wrapperSize <span class="token operator">/</span> <span class="token number">2.5</span><span class="token punctuation">)</span> <span class="token operator">*</span> <span class="token punctuation">(</span>speed <span class="token operator">/</span> <span class="token number">8</span><span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">;</span>
        distance <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">abs</span><span class="token punctuation">(</span>current<span class="token punctuation">)</span> <span class="token operator">+</span> destination<span class="token punctuation">;</span>
        duration <span class="token operator">=</span> distance <span class="token operator">/</span> speed<span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">return</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">destination</span><span class="token operator">:</span> Math<span class="token punctuation">.</span><span class="token function">round</span><span class="token punctuation">(</span>destination<span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token literal-property property">duration</span><span class="token operator">:</span> duration<span class="token punctuation">,</span>
      <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 移动元素
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">_x</span>
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">_y</span>
     */</span>
    <span class="token function">translate</span><span class="token punctuation">(</span><span class="token parameter">_x<span class="token punctuation">,</span> _y</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      _x <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">round</span><span class="token punctuation">(</span>_x<span class="token punctuation">)</span><span class="token punctuation">;</span>
      _y <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">round</span><span class="token punctuation">(</span>_y<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setTransForm</span><span class="token punctuation">(</span>_x<span class="token punctuation">,</span> _y<span class="token punctuation">)</span><span class="token punctuation">;</span>

      x <span class="token operator">=</span> _x<span class="token punctuation">;</span>
      y <span class="token operator">=</span> _y<span class="token punctuation">;</span>

      ownnerPos <span class="token operator">=</span> <span class="token punctuation">{</span>
        <span class="token literal-property property">x</span><span class="token operator">:</span> _x<span class="token punctuation">,</span>
        <span class="token literal-property property">y</span><span class="token operator">:</span> _y
      <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 滚动到目标
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">_x</span>
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">_y</span>
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">time</span>
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>object<span class="token punctuation">}</span></span> <span class="token parameter">easing</span>
     */</span>
    <span class="token function">scrollTo</span><span class="token punctuation">(</span><span class="token parameter">_x<span class="token punctuation">,</span> _y<span class="token punctuation">,</span> time <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> easing</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      isInTransition <span class="token operator">=</span> time <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">;</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span>easing<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setTransitionTimingFunction</span><span class="token punctuation">(</span>easing<span class="token punctuation">.</span>style<span class="token punctuation">)</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setTransitionTime</span><span class="token punctuation">(</span>time<span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">translate</span><span class="token punctuation">(</span>_x<span class="token punctuation">,</span> _y<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 对比两者相差距离是否小于一定量
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">num</span>
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>number<span class="token punctuation">}</span></span> <span class="token parameter">num2</span>
     */</span>
    <span class="token function">compared</span><span class="token punctuation">(</span><span class="token parameter">num<span class="token punctuation">,</span> num2</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">const</span> <span class="token constant">MAXIMUM_ALLOWABLE_VALUE</span> <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span>

      <span class="token keyword">return</span> Math<span class="token punctuation">.</span><span class="token function">abs</span><span class="token punctuation">(</span>num <span class="token operator">-</span> num2<span class="token punctuation">)</span> <span class="token operator">&lt;=</span> <span class="token constant">MAXIMUM_ALLOWABLE_VALUE</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 事件开始处理程序
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>MouseEvent<span class="token operator">|</span>TouchEvent<span class="token punctuation">}</span></span> <span class="token parameter">e</span>
     */</span>
    <span class="token function">handleStart</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">runIn</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>type<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token comment">// 获取触摸点</span>
        <span class="token keyword">const</span> point <span class="token operator">=</span> e<span class="token punctuation">.</span>touches <span class="token operator">?</span> e<span class="token punctuation">.</span>touches<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">:</span> e<span class="token punctuation">;</span>

        <span class="token comment">// 未移动</span>
        moved <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>

        <span class="token comment">// 每次移动的距离</span>
        distX <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        distY <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

        <span class="token comment">// 计算方向</span>
        directionX <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        directionY <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

        <span class="token comment">// 获取开始时间</span>
        startTime <span class="token operator">=</span> Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 如果在滚动中，取消滚动</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>isInTransition<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setTransitionTime</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

          isInTransition <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>

          <span class="token comment">// 获取当前位置，以便暂停滚动，防止完全回弹</span>
          <span class="token comment">// #ifdef APP-PLUS</span>
          <span class="token keyword">const</span> pos <span class="token operator">=</span> ownnerPos<span class="token punctuation">;</span>
          <span class="token comment">// #endif</span>

          <span class="token comment">// #ifdef H5</span>
          <span class="token keyword">const</span> pos <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getComputedPosition</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
          <span class="token comment">// #endif</span>

          <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">translate</span><span class="token punctuation">(</span>pos<span class="token punctuation">.</span>x<span class="token punctuation">,</span> pos<span class="token punctuation">.</span>y<span class="token punctuation">)</span><span class="token punctuation">;</span>

          <span class="token comment">// scrollEnd 滚动结束</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 开始点</span>
        startX <span class="token operator">=</span> x<span class="token punctuation">;</span>
        startY <span class="token operator">=</span> y<span class="token punctuation">;</span>

        <span class="token comment">// 此次事件点在页面上的位置</span>
        pointX <span class="token operator">=</span> point<span class="token punctuation">.</span>pageX<span class="token punctuation">;</span>
        pointY <span class="token operator">=</span> point<span class="token punctuation">.</span>pageY<span class="token punctuation">;</span>

        <span class="token comment">// beforeScrollStart 滚动即将开始</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 移动中事件处理程序
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>MouseEvent<span class="token operator">|</span>TouchEvent<span class="token punctuation">}</span></span> <span class="token parameter">e</span>
     */</span>
    <span class="token function">handleMove</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">runIn</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>type<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token comment">// 当前点</span>
        <span class="token keyword">const</span> point <span class="token operator">=</span> e<span class="token punctuation">.</span>touches <span class="token operator">?</span> e<span class="token punctuation">.</span>touches<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">:</span> e<span class="token punctuation">;</span>

        <span class="token comment">// 距上次的偏移</span>
        <span class="token keyword">let</span> deltaX <span class="token operator">=</span> point<span class="token punctuation">.</span>pageX <span class="token operator">-</span> pointX<span class="token punctuation">;</span>
        <span class="token keyword">let</span> deltaY <span class="token operator">=</span> point<span class="token punctuation">.</span>pageY <span class="token operator">-</span> pointY<span class="token punctuation">;</span>

        <span class="token comment">// 当前时间</span>
        <span class="token keyword">const</span> timestamp <span class="token operator">=</span> Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 新的位置</span>
        <span class="token keyword">let</span> newX <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token keyword">let</span> newY <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

        <span class="token comment">// 绝对距离</span>
        <span class="token keyword">let</span> absDistX <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token keyword">let</span> absDistY <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

        <span class="token comment">// 点在页面上的位置</span>
        pointX <span class="token operator">=</span> point<span class="token punctuation">.</span>pageX<span class="token punctuation">;</span>
        pointY <span class="token operator">=</span> point<span class="token punctuation">.</span>pageY<span class="token punctuation">;</span>

        <span class="token comment">// 累计距离加上本次移动距离</span>
        distX <span class="token operator">+=</span> deltaX<span class="token punctuation">;</span>
        distY <span class="token operator">+=</span> deltaY<span class="token punctuation">;</span>

        <span class="token comment">// 绝对偏移距离</span>
        absDistX <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">abs</span><span class="token punctuation">(</span>distX<span class="token punctuation">)</span><span class="token punctuation">;</span>
        absDistY <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">abs</span><span class="token punctuation">(</span>distY<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 结束时间到现在必须大于 300ms, 且移动距离超过 10 像素</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>timestamp <span class="token operator">-</span> endTime <span class="token operator">&gt;</span> <span class="token number">300</span> <span class="token operator">&amp;&amp;</span> absDistX <span class="token operator">&lt;</span> <span class="token number">10</span> <span class="token operator">&amp;&amp;</span> absDistY <span class="token operator">&lt;</span> <span class="token number">10</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">return</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 判断是否需要锁定某个方向</span>
        deltaX <span class="token operator">=</span> hasHorizontalScroll <span class="token operator">?</span> deltaX <span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">;</span>
        deltaY <span class="token operator">=</span> hasVerticalScroll <span class="token operator">?</span> deltaY <span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">;</span>

        <span class="token comment">// 新的位置</span>
        newX <span class="token operator">=</span> x <span class="token operator">+</span> deltaX<span class="token punctuation">;</span>
        newY <span class="token operator">=</span> y <span class="token operator">+</span> deltaY<span class="token punctuation">;</span>

        <span class="token keyword">if</span> <span class="token punctuation">(</span>newX <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token operator">||</span> newX <span class="token operator">&lt;</span> maxScrollX<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          newX <span class="token operator">=</span> x <span class="token operator">+</span> deltaX <span class="token operator">/</span> <span class="token number">3</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">if</span> <span class="token punctuation">(</span>newY <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token operator">||</span> newY <span class="token operator">&lt;</span> maxScrollY<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          newY <span class="token operator">=</span> y <span class="token operator">+</span> deltaY <span class="token operator">/</span> <span class="token number">3</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 当前方向</span>
        directionX <span class="token operator">=</span> deltaX <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token operator">-</span><span class="token number">1</span> <span class="token operator">:</span> deltaX <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token number">1</span> <span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">;</span>
        directionY <span class="token operator">=</span> deltaY <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token operator">-</span><span class="token number">1</span> <span class="token operator">:</span> deltaY <span class="token operator">&lt;</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token number">1</span> <span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">;</span>

        <span class="token comment">// 未移动</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>moved <span class="token operator">===</span> <span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token comment">// scrollStart 滚动开始</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 开始移动</span>
        moved <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>

        <span class="token comment">// 改变位置</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">translate</span><span class="token punctuation">(</span>newX<span class="token punctuation">,</span> newY<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 设置数据</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>timestamp <span class="token operator">-</span> startTime <span class="token operator">&gt;</span> <span class="token number">300</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          startTime <span class="token operator">=</span> timestamp<span class="token punctuation">;</span>
          startX <span class="token operator">=</span> x<span class="token punctuation">;</span>
          startY <span class="token operator">=</span> y<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 结束事件处理程序
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>MouseEvent<span class="token operator">|</span>TouchEvent<span class="token punctuation">}</span></span> <span class="token parameter">e</span>
     */</span>
    <span class="token function">handleEnd</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">runIn</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span>type<span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token comment">// 获取点</span>
        <span class="token keyword">const</span> point <span class="token operator">=</span> e<span class="token punctuation">.</span>changedTouches <span class="token operator">?</span> e<span class="token punctuation">.</span>changedTouches<span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span> <span class="token operator">:</span> e<span class="token punctuation">;</span>

        <span class="token comment">// 持续时长</span>
        <span class="token keyword">const</span> duration <span class="token operator">=</span> Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> startTime<span class="token punctuation">;</span>

        <span class="token comment">// 新的点</span>
        <span class="token keyword">let</span> newX <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">round</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">let</span> newY <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">round</span><span class="token punctuation">(</span>y<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 距离</span>
        <span class="token keyword">const</span> distanceX <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">abs</span><span class="token punctuation">(</span>newX <span class="token operator">-</span> startX<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">const</span> distanceY <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">abs</span><span class="token punctuation">(</span>newY <span class="token operator">-</span> startY<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 时长</span>
        <span class="token keyword">let</span> time <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

        <span class="token comment">// 时间线函数</span>
        <span class="token keyword">let</span> easing <span class="token operator">=</span> <span class="token keyword">undefined</span><span class="token punctuation">;</span>

        <span class="token comment">// 距上次移动偏移</span>
        <span class="token keyword">let</span> momentumX <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token keyword">let</span> momentumY <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

        <span class="token comment">// 非过渡状态</span>
        isInTransition <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>

        <span class="token comment">// 重置事件</span>
        initiated <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

        <span class="token comment">// 获取结束时间</span>
        endTime <span class="token operator">=</span> Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 如果重置位置</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">resetPosition</span><span class="token punctuation">(</span><span class="token constant">BOUNCE_TIME</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">return</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 滚动到新位置</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">scrollTo</span><span class="token punctuation">(</span>newX<span class="token punctuation">,</span> newY<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>moved<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token comment">// scrollCancel 滚动取消事件</span>
          <span class="token keyword">return</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 持续时长小于 300ms</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>duration <span class="token operator">&lt;</span> <span class="token number">300</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
          momentumX <span class="token operator">=</span> hasHorizontalScroll
            <span class="token operator">?</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">momentum</span><span class="token punctuation">(</span>
                x<span class="token punctuation">,</span>
                startX<span class="token punctuation">,</span>
                duration<span class="token punctuation">,</span>
                maxScrollX<span class="token punctuation">,</span>
                scrollerContainerRect<span class="token punctuation">.</span>width
              <span class="token punctuation">)</span>
            <span class="token operator">:</span> <span class="token punctuation">{</span>
                <span class="token literal-property property">destination</span><span class="token operator">:</span> newX<span class="token punctuation">,</span>
                <span class="token literal-property property">duration</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
              <span class="token punctuation">}</span><span class="token punctuation">;</span>

          momentumY <span class="token operator">=</span> hasVerticalScroll
            <span class="token operator">?</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">momentum</span><span class="token punctuation">(</span>
                y<span class="token punctuation">,</span>
                startY<span class="token punctuation">,</span>
                duration<span class="token punctuation">,</span>
                maxScrollY<span class="token punctuation">,</span>
                scrollerContainerRect<span class="token punctuation">.</span>height
              <span class="token punctuation">)</span>
            <span class="token operator">:</span> <span class="token punctuation">{</span>
                <span class="token literal-property property">destination</span><span class="token operator">:</span> newY<span class="token punctuation">,</span>
                <span class="token literal-property property">duration</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span>
              <span class="token punctuation">}</span><span class="token punctuation">;</span>

          newX <span class="token operator">=</span> momentumX<span class="token punctuation">.</span>destination<span class="token punctuation">;</span>
          newY <span class="token operator">=</span> momentumY<span class="token punctuation">.</span>destination<span class="token punctuation">;</span>

          time <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span>momentumX<span class="token punctuation">.</span>duration<span class="token punctuation">,</span> momentumY<span class="token punctuation">.</span>duration<span class="token punctuation">)</span><span class="token punctuation">;</span>

          isInTransition <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">if</span> <span class="token punctuation">(</span>newX <span class="token operator">!==</span> x <span class="token operator">||</span> newY <span class="token operator">!==</span> y<span class="token punctuation">)</span> <span class="token punctuation">{</span>
          <span class="token keyword">if</span> <span class="token punctuation">(</span>newX <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token operator">||</span> newX <span class="token operator">&lt;</span> maxScrollX <span class="token operator">||</span> newY <span class="token operator">&gt;</span> <span class="token number">0</span> <span class="token operator">||</span> newY <span class="token operator">&lt;</span> maxScrollY<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            easing <span class="token operator">=</span> quadratic<span class="token punctuation">;</span>
          <span class="token punctuation">}</span>

          <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">scrollTo</span><span class="token punctuation">(</span>newX<span class="token punctuation">,</span> newY<span class="token punctuation">,</span> time<span class="token punctuation">,</span> easing<span class="token punctuation">)</span><span class="token punctuation">;</span>

          <span class="token keyword">return</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// scrollEnd 滚动结束事件</span>
      <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 事件中断处理程序
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>MouseEvent<span class="token operator">|</span>TouchEvent<span class="token punctuation">}</span></span> <span class="token parameter">e</span>
     */</span>
    <span class="token function">handleCancel</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">handleEnd</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token doc-comment comment">/**
     *
     * <span class="token keyword">@description</span> 过渡结束事件处理程序
     * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Event<span class="token punctuation">}</span></span> <span class="token parameter">e</span>
     */</span>
    <span class="token function">handleTransitionend</span><span class="token punctuation">(</span><span class="token parameter">e</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>isInTransition <span class="token operator">===</span> <span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">setTransitionTime</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">resetPosition</span><span class="token punctuation">(</span><span class="token constant">BOUNCE_TIME</span><span class="token punctuation">)</span> <span class="token operator">===</span> <span class="token boolean">false</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        isInTransition <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>

        <span class="token comment">// scrollEnd 滚动结束事件</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">&gt;</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>目前想要实现较为丝滑的阻尼回弹效果可能需要替换为 nvue 页面，使用官方的 list 组件来完成了。</p><h2 id="输入框的一些问题" tabindex="-1"><a class="header-anchor" href="#输入框的一些问题" aria-hidden="true">#</a> 输入框的一些问题</h2><p>这个没什么好说的，多端适配一堆问题，很多都不好解决。总结下项目中遇到的：</p>`,5),Y=n("li",null,"输入框 emoji 渲染",-1),I={href:"https://zh.uniapp.dcloud.io/component/input.html#%E5%85%B3%E4%BA%8E%E8%BD%AF%E9%94%AE%E7%9B%98%E5%BC%B9%E5%87%BA%E7%9A%84%E9%80%BB%E8%BE%91%E8%AF%B4%E6%98%8E",target:"_blank",rel:"noopener noreferrer"},X=n("ul",null,[n("li",null,"关于软键盘弹出，比较多的问题是软键盘弹出回弹导致的布局异常"),n("li",null,"在 Android 中，软键盘弹出页面顶起是没有过渡的，会比较生硬；ios 会丝滑一点"),n("li",null,"软键盘弹起时是否会顶起页面，使输入框可见。（一个思路是屏蔽原生的顶起效果，使用过渡来实现平滑上移下移效果）")],-1),A=n("li",null,"快速双击输入框可能会导致软键盘闪现",-1),M={href:"https://ask.dcloud.net.cn/question/181250",target:"_blank",rel:"noopener noreferrer"},L=n("li",null,"软键盘收起页面底部偶现出现空白",-1),R=n("li",null,[s("ios 输入框聚焦后快速点击 "),n("code",null,"picker"),s(" 类组件从底部弹起，页面底部出现空白")],-1),H={href:"https://developer.mozilla.org/zh-CN/docs/Glossary/Cross-site_scripting",target:"_blank",rel:"noopener noreferrer"},z=n("p",null,"上述问题基本都没有得到有效解决，后续可能需要封装组件进行统一的处理，也欢迎各位大佬提出自己的想法。",-1),P=n("p",null,"-- end",-1);function V(B,O){const a=l("ExternalLinkIcon");return o(),c("div",null,[u,n("p",null,[s("我有尝试过使用 "),r,s(" + "),k,s("（见 "),n("a",d,[s("使用CSS size-adjust和unicode-range改变任意文字尺寸"),t(a)]),s("）来单独控制 emoji 的大小，在最新版 Chrome 中是有效的，但在 safari 中不能正常渲染，原因在于 "),v,s(" 的兼容性不好。到这里也没有再继续研究。")]),m,n("p",null,[s("这个组件因为使用了 "),b,s(" 做弹出控制，所以样式可能会被含有 "),y,s(" 属性的父元素干扰，我去翻过 picker 组件的源码，主要是通过分端实现，在 H5 中直接使用 DOM API 将元素挂载到 "),w,s(" 元素下，而在 APP 端通过 "),n("a",h,[s("HTML5+"),t(a)]),s(" API 创建 webview 视图来实现（PS：有时间研究下 "),n("a",g,[s("HTML5+"),t(a)]),s(" 和 uniapp 源码还是挺好的，可以知其然而知其所以然）。")]),f,n("p",null,[s("因为项目有做推流、黑名单之类的功能，所以需要用户的设备信息来识别身份，不可避免的使用到 "),n("a",q,[s("HTML5+"),t(a)]),s(" 的 "),x,s("、"),_,s(" API 获取设备 id，但是目前主流的 Android 版本对于这些信息都要求要用户授权才能获取。")]),T,S,n("p",null,[s("老板要多端同步实现阻尼回弹效果，还要非常丝滑的那种。找到了一个老牌 js 滚动插件 "),n("a",E,[s("iscroll"),t(a)]),s("，研究了它滚动部分的源码，然后照猫画虎写了一个适配 uniapp 的组件，在 H5 端效果还是可以的，APP 端如果只是简单的展示列表也比较丝滑，可惜放在项目中就一个字：卡！！！")]),C,n("ul",null,[Y,n("li",null,[s("多端软键盘弹出的差异（见 uniapp "),n("a",I,[s("关于软键盘弹出的逻辑说明"),t(a)]),s("） "),X]),n("li",null,[s("快速操作时的 bug "),n("ul",null,[A,n("li",null,[s("在 Android APP 下使用状态控制输入框时，聚焦后快速点击空白处使其失焦大概率会频繁的触发聚焦失焦事件（见 "),n("a",M,[s("【报Bug】Android App 下，输入框会频繁聚焦失焦！！！"),t(a)]),s("）")])])]),L,R]),n("p",null,[s("还有一些问题与多端适配无关，比如输入框需要过滤特殊字符防止 xss 攻击，这个还是要重视的（"),n("a",H,[s("Cross-site scripting（跨站脚本攻击）"),t(a)]),s("）。")]),z,P])}const N=e(i,[["render",V],["__file","uniapp_multi_end_adaptation_problem.html.vue"]]);export{N as default};
