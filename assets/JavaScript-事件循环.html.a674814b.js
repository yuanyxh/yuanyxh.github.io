import{_ as p}from"./_plugin-vue_export-helper.cdc0426e.js";import{o,c as l,a as s,b as n,d as e,e as t,r as i}from"./app.83d30316.js";const c={},u=t('<h2 id="前言" tabindex="-1"><a class="header-anchor" href="#前言" aria-hidden="true">#</a> 前言</h2><p>你可能会疑惑，关于事件循环的文章在网上已经有很多了，为什么还要写这样一篇专门解读它的文章呢？</p><p>其实我本来也以为在看了网上诸多这类文章后对于事件循环的机制已经了然于胸了，但最近一次关于事件循环的讨论狠狠的打了我的脸，让我催生出了写这篇文章的想法，同时希望看到这篇文章的读者们能有所收获。</p><h2 id="概念" tabindex="-1"><a class="header-anchor" href="#概念" aria-hidden="true">#</a> 概念</h2><p><code>JavaScript</code> 是一门单线程语言，这是由最初的环境（浏览器）决定的，单线程避免了多线程竞态的问题（如：在同一时刻修改同一个 DOM 元素），但同时也带来了新的问题：单线程意味着一个网页的逻辑都由一个线程调度。</p><p>如果网页的逻辑都是同步的，这没什么问题，但那是不可能的，同步执行代码会导致页面长时间无法响应，这对于用户而言是难以接受的，但是即使引入了异步任务的概念，任务的完成时间也是不确定的，那浏览器是如何合理调度任务的呢，这就是本文的主角：事件循环。</p><h2 id="事件循环" tabindex="-1"><a class="header-anchor" href="#事件循环" aria-hidden="true">#</a> 事件循环</h2>',7),r={href:"https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model",target:"_blank",rel:"noopener noreferrer"},d=t(`<p>首先，事件循环，我们可以理解为一个无限循环，那么对应的代码如下：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 包裹在函数内只是为了明确代码的语义</span>
<span class="token keyword">function</span> <span class="token function">eventLoop</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>根据规范定义，如果事件循环存在，它必须不断的执行以下步骤：</p><p>1、让 oldestTask 和 taskStartTime 为 null</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">eventLoop</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> oldestTask <span class="token comment">/* 已经出队的任务 */</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
      taskStartTime <span class="token comment">/* 任务开始事件 */</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>2、如果事件循环有一个包含至少一个可运行任务的任务队列，那么：</p><ol><li>让 taskQueue 成为这样一个任务队列，以实现定义的方式选择（这里也表明了任务队列可能不止一个，但在事件循环中运行的只有一个）</li><li>将 taskStartTime 设置为不安全的共享当前时间</li><li>将 oldestTask 设置为 taskQueue 中的第一个可运行任务， 并将其从 taskQueue 中移除</li><li>将事件循环的当前运行任务设置为 oldestTask</li><li>执行 oldestTask 的 setps</li><li>将事件循环的当前运行任务设置回 null</li></ol><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">eventLoop</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

  <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> oldestTask <span class="token comment">/* 已经出队的任务 */</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
      taskStartTime <span class="token comment">/* 任务开始事件 */</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

    <span class="token comment">// 新增--------------------------------------------</span>

    <span class="token keyword">let</span> taskQueue <span class="token comment">/* 任务队列 */</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
      currentlyRunningTask <span class="token comment">/* 当前运行任务 */</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

    <span class="token comment">// 选择任务队列，注意：selectQueue 只是一个假设函数</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>taskQueue <span class="token operator">=</span> <span class="token function">selectQueue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

      <span class="token comment">// 设置任务开始时间</span>
      taskStartTime <span class="token operator">=</span> Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token comment">// 任务出队</span>
      oldestTask <span class="token operator">=</span> taskQueue<span class="token punctuation">.</span><span class="token function">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token comment">// 当前运行任务设置为 oldestTask</span>
      currentlyRunningTask <span class="token operator">=</span> oldestTask<span class="token punctuation">;</span>

      <span class="token comment">// 执行任务步骤</span>
      oldestTask<span class="token punctuation">.</span><span class="token function">setps</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token comment">// 重置当前运行任务</span>
      currentlyRunningTask <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这一步是在检查任务队列中是否有（宏）任务待处理，如果有则执行相关步骤。注意：在这一步中只会取出一个（宏）任务并执行。</p><p>任务在计算机形式上表现为一个数据结构，拥有许多属性，其中 <code>setps</code> 为完成这个任务所需执行的一系列步骤，这里我们理解为一系列的函数调用。</p><p>3、执行微任务检查点</p><ol><li>如果事件循环执行微任务检查点为真，则返回</li><li>将事件循环的执行微任务检查点设置为 true</li><li>当事件循环的微任务队列不为空时： <ol><li>让 oldestMicrotask 成为 从事件循环的微任务队列中出队的结果</li><li>将事件循环的当前运行任务设置为 oldestMicrotask</li><li>运行 oldestMicrotask</li><li>将事件循环的当前运行任务设置回 null</li></ol></li><li>略。。。</li><li>略。。。</li><li>略。。。</li><li>将事件循环的执行微任务检查点设置为 false</li></ol><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">eventLoop</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

  <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> oldestTask <span class="token comment">/* 已经出队的任务 */</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
      taskStartTime <span class="token comment">/* 任务开始事件 */</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

    <span class="token keyword">let</span> taskQueue <span class="token comment">/* 任务队列 */</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">,</span>
      currentlyRunningTask <span class="token comment">/* 当前运行任务 */</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

    <span class="token comment">// 选择任务队列，注意：selectQueue 只是一个假设函数</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>taskQueue <span class="token operator">=</span> <span class="token function">selectQueue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

      <span class="token comment">// 设置任务开始时间</span>
      taskStartTime <span class="token operator">=</span> Date<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token comment">// 任务出队</span>
      oldestTask <span class="token operator">=</span> taskQueue<span class="token punctuation">.</span><span class="token function">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token comment">// 当前运行任务设置为 oldestTask</span>
      currentlyRunningTask <span class="token operator">=</span> oldestTask<span class="token punctuation">;</span>

      <span class="token comment">// 执行任务步骤</span>
      oldestTask<span class="token punctuation">.</span><span class="token function">setps</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

      <span class="token comment">// 重置当前运行任务</span>
      currentlyRunningTask <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 新增--------------------------------------------</span>

    <span class="token comment">// 执行微任务检查点</span>
    <span class="token keyword">let</span> hasRuningMicroTaskOpportunity <span class="token comment">/* 开关 */</span> <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
    <span class="token punctuation">(</span><span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      
      <span class="token comment">// 如果微任务队列正在执行则返回</span>
      <span class="token keyword">if</span> <span class="token punctuation">(</span>hasRuningMicroTaskOpportunity<span class="token punctuation">)</span> <span class="token keyword">return</span><span class="token punctuation">;</span>
      
      <span class="token comment">// 开关设置为 true，防止重入调用</span>
      hasRuningMicroTaskOpportunity <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>

      <span class="token keyword">let</span> oldestMicrotask <span class="token comment">/* 已出队微任务 */</span><span class="token punctuation">;</span>

      <span class="token keyword">while</span> <span class="token punctuation">(</span>oldestMicrotask <span class="token operator">=</span> microTaskQueue<span class="token punctuation">.</span><span class="token function">shift</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 设置当前运行任务为 oldestMicrotask</span>
        currentlyRunningTask <span class="token operator">=</span> oldestMicrotask<span class="token punctuation">;</span>

        <span class="token comment">// 执行微任务</span>
        oldestMicrotask<span class="token punctuation">.</span><span class="token function">setps</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 重置当前运行任务</span>
        currentlyRunningTask <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
      <span class="token punctuation">}</span>

      <span class="token comment">// ...</span>

      <span class="token comment">// 重置开关，表示微任务队列消耗完毕</span>
      hasRuningMicroTaskOpportunity <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,13),k=s("code",null,"IIFE",-1),v=s("code",null,"true",-1),m={href:"https://baike.baidu.com/item/%E5%8F%AF%E9%87%8D%E5%85%A5%E4%BB%A3%E7%A0%81/1955592",target:"_blank",rel:"noopener noreferrer"},b=t(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code>Promise<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>
  <span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
    Promise<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
      <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上述代码中，两个微任务会在同一次循环内被执行，过程大概如下：</p><ol><li>没有需要执行的（宏）任务，下一步</li><li>检查开关变量，可以执行微任务</li><li>微任务队列中存在一个微任务，取出执行</li><li>执行过程中向微任务队列添加一个微任务</li><li>微任务队列中还有一个微任务，取出执行</li><li>微任务队列消耗完毕</li><li>执行其他代码</li><li>下一次循环</li></ol><p>第三步微任务相关的逻辑执行完后，第 4、5、6 的步骤对我们理解事件循环并没有帮助，所以不会详述。</p><p>第 7 步特定于窗口事件循环，所谓窗口事件循环，可以理解为引擎需要与浏览器窗口交互，在这一步中，引擎会执行更新渲染等逻辑。</p><p>第 8 步同样特定于窗口事件循环，在满足以下条件时，事件循环会在时间间隔内运行，间隔上限为 50ms，未来 50ms 的上限是为了确保在人类感知的阈值内对用户输入的响应</p><ol><li>这是一个窗口事件循环</li><li>此事件循环的 任务队列中没有文档完全处于活动状态的任务</li><li>这个事件循环的微任务队列是空的</li><li>hasARenderingOpportunity 为假</li></ol><p>看到这里，其实有关事件循环需要我们理解的地方已经足够了，关于事件循环的执行机制，可以简述为</p><ol><li>初始化数据</li><li>执行（宏）任务（如果存在）</li><li>消耗微任务队列</li><li>更新渲染</li><li>休眠（没有其他任务时）</li></ol><p>但是等等，从代码执行顺序来说，（宏）任务是比微任务更早执行的，那么为什么经常说微任务永远比（宏）任务先执行呢？下列代码的输出结果也是微任务先输出</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token function">setTimeout</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
  console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;setTimeout&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span><span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

Promise<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
  <span class="token punctuation">.</span><span class="token function">then</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">=&gt;</span> console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;Promise&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>其实是因为我们遗漏了一个重要的（宏）任务，那就是整段代码的执行，这一段程序其实也是一个任务，这个任务添加了一个（宏）任务和一个微任务，这个新入队的（宏）任务在下一个循环中才会执行，而微任务却在本次循环中就已经被执行了。</p><h2 id="结语" tabindex="-1"><a class="header-anchor" href="#结语" aria-hidden="true">#</a> 结语</h2><p>理解 <code>JavaScript</code> 事件循环对理解代码的执行顺序是非常有帮助的，而想要深入理解，依据规范编写相同逻辑的伪代码则不失为一个好办法。</p><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料" aria-hidden="true">#</a> 参考资料</h2>`,15),h={href:"https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model",target:"_blank",rel:"noopener noreferrer"};function f(g,w){const a=i("ExternalLinkIcon");return o(),l("div",null,[u,s("p",null,[n("关于事件循环，作者并不想描述太多概念性的东西，而是带领大家依据一步一步编写符合规范的伪代码，这样能够更加的深入理解事件循环的执行机制，规范地址："),s("a",r,[n("JavaScript 事件循环规范"),e(a)]),n("。")]),d,s("p",null,[n("在这一步中我们执行了一个 "),k,n("，并对开关变量进行了检查，如果开关变量为 "),v,n("，则表明微任务正在执行，直接返回，防止 "),s("a",m,[n("重入调用"),e(a)]),n("，否则不断消耗微任务队列直到队列为空。注意：在微任务队列中的任务都会在本次循环中被执行，即便是在其他任务中添加的微任务。")]),b,s("blockquote",null,[s("p",null,[s("a",h,[n("JavaScript 事件循环规范"),e(a)])])])])}const _=p(c,[["render",f],["__file","JavaScript-事件循环.html.vue"]]);export{_ as default};
