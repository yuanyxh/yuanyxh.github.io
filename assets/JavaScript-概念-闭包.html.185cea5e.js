import{_ as i}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as c,c as l,a as s,b as n,d as a,w as u,e as t,r as e}from"./app.87e95f22.js";const d={},r=t(`<h2 id="概念" tabindex="-1"><a class="header-anchor" href="#概念" aria-hidden="true">#</a> 概念</h2><p><em><strong>闭包</strong></em>，是存在于 <code>JavaScript</code> 世界中的重要概念，我们无时不刻不在使用闭包，单从其名字来看，闭包可以理解为与外界隔离的闭环空间，也就意味着外部无法直接修改这个空间内的状态，当我们理解闭包以后也会发现的确如此。</p><p>接下来我们就开始学习闭包的相关概念，并了解使用闭包的优点与缺点。</p><h2 id="创建闭包" tabindex="-1"><a class="header-anchor" href="#创建闭包" aria-hidden="true">#</a> 创建闭包</h2><p>了解闭包是如何产生的有助于理解闭包，关于创建闭包，我们需要先知道几个概念：作用域，作用域链，以及变量的访问规则。</p><p>作用域：可以简单理解为变量的作用范围，它规定了变量在何处能够被访问。</p><p>作用域链：多个嵌套的作用域相互链接形成链条。</p><p>变量访问：变量以变量名为标识符进行访问，访问一个变量时会首先在当前作用域内查找，未找到则沿作用域链向上查找，在顶层作用域依旧未找到则抛出错误，找到时则直接返回对应变量的值。</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> global_ <span class="token operator">=</span> <span class="token string">&#39;global&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">outside</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> outside_ <span class="token operator">=</span> <span class="token string">&#39;outside&#39;</span><span class="token punctuation">;</span>

  <span class="token keyword">function</span> <span class="token function">inside</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> inside_ <span class="token operator">=</span> <span class="token string">&#39;inside&#39;</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>观察上述代码</p><p>在上述代码中存在三个相互嵌套的作用域：全局作用域，<code>outside</code> 函数作用域与 <code>inside</code> 函数作用域，它们的关系如下图</p><p><img src="http://qkc148.bvimg.com/18470/53a0d59308b01bb1.png" alt="作用域嵌套" loading="lazy"></p><p>其中</p><ul><li>全局作用域内的变量在应用程序的生命周期内存在，且全局作用域总是位于作用域链的最顶层，根据变量的访问规则，全局作用域下的变量能够在任何地方访问</li><li>函数作用域（或块作用域）内的变量在进入作用域时被创建，在代码执行完毕离开当前作用域以后被销毁。</li></ul><p>在上述代码中，全局作用域下存在变量 <code>global_</code> 与函数 <code>outside</code>，这是除了内置 <code>Api</code> 外全局作用域下能够访问的数据； <code>outside</code> 函数中存在变量 <code>outside_</code> 与函数 <code>inside</code>，同时由于变量访问规则与作用域链，<code>outside</code> 函数内还能够访问上层作用域的变量；<code>inside</code> 函数内所能访问的变量与 <code>outside</code> 类似。</p><p>这三个相互嵌套的作用域形成的作用域链如下图</p><p><img src="http://qkc148.bvimg.com/18470/ec4e0ff3c6eab643.png" alt="作用域链" loading="lazy"></p><p>从这些规则中可以发现，外层作用域无法直接访问内层作用域内的变量，比如示例代码中，全局作用域下无法访问变量 <code>outside_</code> 和 函数 <code>inside</code> ，<code>outside</code> 函数内无法访问 <code>inside</code> 函数内的变量 <code>inside_</code>。</p><p>如果我们需要使用这些变量，则意味着我们必须进入对应的作用域内，即调用对应的函数</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> global_ <span class="token operator">=</span> <span class="token string">&#39;global&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">outside</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> outside_ <span class="token operator">=</span> <span class="token string">&#39;outside&#39;</span><span class="token punctuation">;</span>

  <span class="token keyword">function</span> <span class="token function">inside</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> inside_ <span class="token operator">=</span> <span class="token string">&#39;inside&#39;</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 调用 inside</span>
  <span class="token function">inside</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 调用 outside</span>
<span class="token function">outside</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>用文字说明上述代码的执行，可以简述为</p><ol><li>程序启动，收集全局数据 <code>global_</code>、<code>outside</code></li><li>调用 <code>outside</code></li><li>切换执行上下文，并将当前执行上下文推入执行栈中</li><li>收集当前上下文内数据 <code>outside_</code>、<code>inside</code> 并链接上层作用域</li><li>调用 <code>inside</code></li><li>切换执行上下文，并将当前执行上下文推入执行栈中</li><li>收集当前上下文内数据 <code>inside_</code> 并链接上层作用域</li><li><code>inside</code> 执行完毕，作用域内变量被销毁，当前执行上下文从执行栈中弹出，上下文切换至 <code>outside</code></li><li><code>outside</code> 执行完毕，作用域内变量被销毁，当前执行上下文从执行栈中弹出，上下文切换至全局上下文</li><li>代码执行完毕，退出线程</li></ol><p>同时，我们也能通过返回内部的变量值以供外部使用</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> global_ <span class="token operator">=</span> <span class="token string">&#39;global&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">outside</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> outside_ <span class="token operator">=</span> <span class="token string">&#39;outside&#39;</span><span class="token punctuation">;</span>

  <span class="token keyword">function</span> <span class="token function">inside</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> inside_ <span class="token operator">=</span> <span class="token string">&#39;inside&#39;</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 调用 inside</span>
  <span class="token function">inside</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// 返回 outside_ 的值</span>
  <span class="token keyword">return</span> outside_<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 调用 outside 并保存返回值</span>
<span class="token keyword">let</span> $$ <span class="token operator">=</span> <span class="token function">outside</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>$$<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// outside</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>既然能够返回变量，也意味着能够返回函数，毕竟 <code>JavaScript</code> 中函数是一等公民</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> global_ <span class="token operator">=</span> <span class="token string">&#39;global&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">outside</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> outside_ <span class="token operator">=</span> <span class="token string">&#39;outside&#39;</span><span class="token punctuation">;</span>

  <span class="token keyword">function</span> <span class="token function">inside</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> inside_ <span class="token operator">=</span> <span class="token string">&#39;inside&#39;</span><span class="token punctuation">;</span>

    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>inside_<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 返回 inside</span>
  <span class="token keyword">return</span> inside<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 调用 outside 并保存返回值</span>
<span class="token keyword">let</span> $inside <span class="token operator">=</span> <span class="token function">outside</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>$inside<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// f ()</span>

<span class="token comment">// 调用返回的 inside 内部函数</span>
<span class="token function">$inside</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// inside</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>等等，先让我们思考一下，如果将函数当作值返回给调用者，这个函数还能使用上层作用域的变量吗？</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> global_ <span class="token operator">=</span> <span class="token string">&#39;global&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">outside</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> outside_ <span class="token operator">=</span> <span class="token string">&#39;outside&#39;</span><span class="token punctuation">;</span>

  <span class="token keyword">function</span> <span class="token function">inside</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> inside_ <span class="token operator">=</span> <span class="token string">&#39;inside&#39;</span><span class="token punctuation">;</span>

    <span class="token comment">// 引用 outside 作用域内变量</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>outside_<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 返回 inside</span>
  <span class="token keyword">return</span> inside<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 调用 outside 并保存返回值</span>
<span class="token keyword">let</span> $inside <span class="token operator">=</span> <span class="token function">outside</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 调用返回的 inside 内部函数</span>
<span class="token function">$inside</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 输出什么???</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>答案是可以，因为变量访问规则其实是基于词法作用域的，所谓词法作用域，可以理解为编码位置，代码编写在何处这些代码所能访问的数据就已经决定了，在何处能访问到这些代码也是如此，它们之间进行了词法绑定</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> global_ <span class="token operator">=</span> <span class="token string">&#39;global&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">outside</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> outside_ <span class="token operator">=</span> <span class="token string">&#39;outside&#39;</span><span class="token punctuation">;</span>

  <span class="token keyword">function</span> <span class="token function">inside</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> inside_ <span class="token operator">=</span> <span class="token string">&#39;inside&#39;</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">function</span> <span class="token function">inside2</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> inside2_ <span class="token operator">=</span> <span class="token string">&#39;inside2&#39;</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上述代码为例，它们的词法作用域以及所能访问的作用域分别如下</p><p><img src="http://qkc148.bvimg.com/18470/2faf8ca411c3f816.png" alt="词法作用域" loading="lazy"></p><p>现在还有一个问题：函数执行完毕以后，它所在作用域内的变量应该被销毁了才对，为什么还能访问呢？</p><p>我们知道，<code>JS</code> 是动态编译的语言，浏览器在真正执行 <code>JavaScript</code> 代码前会对代码进行预编译，编译阶段会经历 <em><strong>词法解析</strong></em>、<em><strong>语法解析</strong></em> 并最终生成可执行代码，这中间 <code>JS</code> 引擎会发现内部函数引用了外部函数的变量且内部函数的引用离开了其词法作用域，那么在代码执行的时候，外部函数的作用域在其代码执行完毕以后并不会被销毁，这样就形成了 <em><strong>闭包</strong></em></p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">let</span> global_ <span class="token operator">=</span> <span class="token string">&#39;global&#39;</span><span class="token punctuation">;</span>

<span class="token keyword">function</span> <span class="token function">outside</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> outside_ <span class="token operator">=</span> <span class="token string">&#39;outside&#39;</span><span class="token punctuation">;</span>

  <span class="token keyword">function</span> <span class="token function">inside</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">let</span> inside_ <span class="token operator">=</span> <span class="token string">&#39;inside&#39;</span><span class="token punctuation">;</span>

    <span class="token comment">// 引用 outside 作用域内变量</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>outside_<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 返回 inside</span>
  <span class="token keyword">return</span> inside<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 调用 outside 并保存返回值</span>
<span class="token keyword">let</span> $inside <span class="token operator">=</span> <span class="token function">outside</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

<span class="token comment">// 调用返回的 inside 内部函数</span>
<span class="token function">$inside</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// outside</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>此时 <code>$inside</code> 就是一个闭包，因为 <code>inside</code> 函数离开了其词法作用域且内部引用了 <code>outside</code> 函数内的变量，同时 <code>outside</code> 作用域因为闭包的存在而无法被释放。</p><h2 id="作用" tabindex="-1"><a class="header-anchor" href="#作用" aria-hidden="true">#</a> 作用</h2><p>说完了如何创建闭包，我们再来说说闭包有什么作用，又为什么说它是非常重要的概念。</p><p>关于闭包的作用主要有两点：</p><ul><li>延长变量生命周期</li><li>制造私有变量</li></ul><h3 id="延长生命周期" tabindex="-1"><a class="header-anchor" href="#延长生命周期" aria-hidden="true">#</a> 延长生命周期</h3><p>关于这一点，其实从上面的代码中就能看出来，因为闭包引用着上层作用域内的变量，导致上层作用域无法被释放，自然变量也就会一直存在</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">function</span> <span class="token function">outside</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">let</span> outside <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>

  <span class="token keyword">return</span> <span class="token keyword">function</span> <span class="token function">inside</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>outside<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> $inside <span class="token operator">=</span> <span class="token function">outside</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token function">$inside</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 0</span>
<span class="token function">$inside</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 1</span>
<span class="token function">$inside</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 2</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上面的代码中，<code>$inside</code> 是一个闭包，内部使用了 <code>outside</code> 的变量，每次使用这个闭包的时候，都会打印闭包变量并加一，这也表明变量的生命周期确实被延长了。</p><h3 id="私有变量" tabindex="-1"><a class="header-anchor" href="#私有变量" aria-hidden="true">#</a> 私有变量</h3><p>在 <code>JS</code> 中，私有变量是没有原生支持的，这给我们带来了很多的问题，如变量污染，状态共享等问题。</p><p>举一个简单例子：一个库维护了一个内部状态，这个状态本该由该库的开发者进行维护，但由于没有私有变量的原生支持，导致使用者也能随意的修改这个状态，这就会导致一些不知名的 <code>bug</code>，尽管这些 <code>bug</code> 本不该出现。</p><p>在 <code>ES6</code> 模块化推出前，解决办法就是利用闭包来模拟私有变量</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// copy from MDN</span>
<span class="token keyword">var</span> Counter <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">var</span> privateCounter <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
  <span class="token keyword">function</span> <span class="token function">changeBy</span><span class="token punctuation">(</span><span class="token parameter">val</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    privateCounter <span class="token operator">+=</span> val<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">return</span> <span class="token punctuation">{</span>
    <span class="token function-variable function">increment</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">changeBy</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function-variable function">decrement</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token function">changeBy</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token function-variable function">value</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
      <span class="token keyword">return</span> privateCounter<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>Counter<span class="token punctuation">.</span><span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">/* logs 0 */</span>
Counter<span class="token punctuation">.</span><span class="token function">increment</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
Counter<span class="token punctuation">.</span><span class="token function">increment</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>Counter<span class="token punctuation">.</span><span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">/* logs 2 */</span>
Counter<span class="token punctuation">.</span><span class="token function">decrement</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>Counter<span class="token punctuation">.</span><span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">/* logs 1 */</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在上述代码中，<code>privateCounter</code> 就是一个私有变量，因为我们无法直接访问并修改它，只能通过提供的方法来访问。</p>`,50),k=t('<h2 id="缺点" tabindex="-1"><a class="header-anchor" href="#缺点" aria-hidden="true">#</a> 缺点</h2><p>关于闭包的缺点，其实在 <a href="#%E5%88%9B%E5%BB%BA%E9%97%AD%E5%8C%85">创建闭包</a> 一节末尾就可窥见一斑，闭包会引用上层作用域的变量，导致上层作用域一直无法被释放，对应的内存也就不能被回收，如果大量使用闭包，可能会造成内存泄漏，解决办法也很简单，只要在不需要使用上层作用域的变量时，将变量的引用清空即可。</p><h2 id="结语" tabindex="-1"><a class="header-anchor" href="#结语" aria-hidden="true">#</a> 结语</h2><p>本文理解并讲述了闭包是什么，并就闭包的作用与注意事项进行了讨论。</p><p>内容有误请指出，内容有缺请补充。</p><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料" aria-hidden="true">#</a> 参考资料</h2>',6),v=s("br",null,null,-1),m=s("br",null,null,-1),b={href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript",target:"_blank",rel:"noopener noreferrer"};function g(f,h){const p=e("RouterLink"),o=e("ExternalLinkIcon");return c(),l("div",null,[r,s("p",null,[n("关于闭包的更多运用，可以看 "),a(p,{to:"/posts/javascript/%E6%A6%82%E5%BF%B5/JavaScript-%E6%A6%82%E5%BF%B5-%E9%AB%98%E9%98%B6%E5%87%BD%E6%95%B0.html"},{default:u(()=>[n("JavaScript 概念 - 高阶函数")]),_:1}),n("，其实高阶函数的很多运用也可以看作是闭包的运用，当然依赖于闭包还能实现更多特性，读者可自行探索。")]),k,s("blockquote",null,[s("p",null,[n("《JavaScript 高级程序设计》"),v,n(" 《你不知道的 JavaScript》"),m,s("a",b,[n("MDN"),a(o)])])])])}const w=i(d,[["render",g],["__file","JavaScript-概念-闭包.html.vue"]]);export{w as default};
