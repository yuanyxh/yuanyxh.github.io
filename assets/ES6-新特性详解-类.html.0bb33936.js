import{_ as l}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as i,c as u,a as s,b as n,d as a,w as p,e as o,r as c}from"./app.db8bad9b.js";const d={},r=s("h2",{id:"简述",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#简述","aria-hidden":"true"},"#"),n(" 简述")],-1),k=s("p",null,[n("文章理解并讲述 "),s("code",null,"ES6"),n(" 新特性："),s("code",null,"class"),n("。内容有误请指出，内容有缺请补充。")],-1),v=s("code",null,"ES6",-1),m=s("code",null,"JavaScript",-1),b=s("code",null,"ES6",-1),h=s("code",null,"类",-1),_=s("code",null,"JavaScript",-1),g=o('<h2 id="概念" tabindex="-1"><a class="header-anchor" href="#概念" aria-hidden="true">#</a> 概念</h2><p>类，在一些面向对象语言中是非常常见的，如 <code>java</code>、<code>c++</code> 等；类可以看作是某一类事物的抽象，泛指一组拥有相同特性相同行为的数据集合，依据某个类接口构造的具体事物称之为该类的实例，是独一无二的个体。</p><p>在早期的 <code>JavaScript</code> 中并没有类这样的特性，<code>ES6</code> 让 <code>JavaScript</code> 也拥有了类这样的语法，但 <code>JavaScript</code> 中的类与传统面向对象编程中的类是不同的，其本质还是原型与原型继承。</p><h2 id="语法" tabindex="-1"><a class="header-anchor" href="#语法" aria-hidden="true">#</a> 语法</h2><p>类可以看作是一个特殊函数，其行为与普通函数并没有太大不同。一个类主要由以下部分组成</p><ul><li>构造器</li><li>实例方法</li><li>静态方法</li><li>getter、setter 方法</li><li>私有、公有字段（实验特性）</li></ul><p>这些组成部分都不是必须的，一个空的类声明依旧被 <code>JS</code> 引擎认为是有效的。</p><h3 id="类的声明" tabindex="-1"><a class="header-anchor" href="#类的声明" aria-hidden="true">#</a> 类的声明</h3>',8),y=s("code",null,"class",-1),w=s("code",null,"class",-1),f=o(`<ul><li>全局作用域下声明的类不会成为 <code>window</code> 的属性</li><li>块作用域</li><li>同一作用域不能重复声明</li><li>没有声明提升</li></ul><p>同时，类中的代码都运行在严格模式下，任何严格模式下禁止的操作都会抛出错误</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 类声明</span>
<span class="token keyword">class</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token comment">// 类表达式</span>
<span class="token keyword">const</span> Person <span class="token operator">=</span> <span class="token keyword">class</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="构造器" tabindex="-1"><a class="header-anchor" href="#构造器" aria-hidden="true">#</a> 构造器</h3><p>构造器即 <code>constructor</code> 方法，一般会在该方法内进行初始化操作</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span>
  <span class="token comment">// 构造器</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 初始化数据</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>age <span class="token operator">=</span> age<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="实例方法" tabindex="-1"><a class="header-anchor" href="#实例方法" aria-hidden="true">#</a> 实例方法</h3><p>实例方法，即定义在类原型上的方法，所有当前类的实例都能够访问</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span>
  <span class="token comment">// 实例方法</span>
  <span class="token function">sayHi</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;hi&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> person_1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
person_1<span class="token punctuation">.</span><span class="token function">sayHi</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// hi</span>

<span class="token keyword">const</span> person_2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
person_2<span class="token punctuation">.</span><span class="token function">sayHi</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// hi</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="静态方法" tabindex="-1"><a class="header-anchor" href="#静态方法" aria-hidden="true">#</a> 静态方法</h3><p>静态方法，即定义在类身上的方法，通过类自身访问，静态方法通过 <code>static</code> 关键字定义</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span>
  <span class="token comment">// 静态方法</span>
  <span class="token keyword">static</span> <span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">const</span> person <span class="token operator">=</span> Person<span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>person<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// {} 空对象</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="getter-setter" tabindex="-1"><a class="header-anchor" href="#getter-setter" aria-hidden="true">#</a> getter/setter</h3><p>即访问器和设置器，用于设置属性访问函数与属性设置函数</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span>
  <span class="token comment">// 实例属性访问器</span>
  <span class="token keyword">get</span> <span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>_name<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 实例属性设置器</span>
  <span class="token keyword">set</span> <span class="token function">name</span><span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>_name <span class="token operator">=</span> name<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 静态属性访问器</span>
  <span class="token keyword">static</span> <span class="token keyword">get</span> <span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>_name<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
  <span class="token comment">// 静态属性设置器</span>
  <span class="token keyword">static</span> <span class="token keyword">set</span> <span class="token function">name</span><span class="token punctuation">(</span><span class="token parameter">name</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>_name <span class="token operator">=</span> name<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 实例属性</span>
<span class="token keyword">const</span> p1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
p1<span class="token punctuation">.</span>name <span class="token operator">=</span> <span class="token string">&#39;yuanyxh&#39;</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>p1<span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// yuanyxh</span>

<span class="token comment">// 静态属性</span>
Person<span class="token punctuation">.</span>name <span class="token operator">=</span> <span class="token string">&#39;jack&#39;</span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>Person<span class="token punctuation">.</span>name<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// jack</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="公有、私有字段" tabindex="-1"><a class="header-anchor" href="#公有、私有字段" aria-hidden="true">#</a> 公有、私有字段</h3><p>类的公有、私有字段定义目前属于实验特性，不应该直接在生产环境中使用，应该使用 <code>babel</code> 之类的编译器编译转换</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token keyword">class</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span>
  <span class="token comment">// 公有字段</span>
  whoami <span class="token operator">=</span> <span class="token string">&#39;yuanyxh&#39;</span><span class="token punctuation">;</span>

  <span class="token comment">// 私有字段</span>
  #whoami <span class="token operator">=</span> <span class="token string">&#39;yuanyxh&#39;</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>字段定义所有当前类实例上拥有的数据，公有字段定义允许被外部访问并修改的数据，私有字段定义不应该被外部访问的数据</p><h3 id="继承" tabindex="-1"><a class="header-anchor" href="#继承" aria-hidden="true">#</a> 继承</h3><p>面向对象编程三大特性其中之一就是继承，继承后的子类能够访问父类的属性，而要在 <code>JavaScript</code> 中实现类的继承，需要使用 <code>extends</code> 关键字，且 <code>extends</code> 不只能继承类，还可以继承函数</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 类</span>
<span class="token keyword">class</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span>
  <span class="token comment">// 构造器</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 初始化数据</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>age <span class="token operator">=</span> age<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 子类 继承</span>
<span class="token keyword">class</span> <span class="token class-name">Worker</span> <span class="token keyword">extends</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>

<span class="token comment">// -----------------------------</span>

<span class="token comment">// 函数</span>
<span class="token keyword">function</span> <span class="token function">Person</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>
  <span class="token keyword">this</span><span class="token punctuation">.</span>age <span class="token operator">=</span> age<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// 子类 继承</span>
<span class="token keyword">class</span> <span class="token class-name">Worker</span> <span class="token keyword">extends</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="super" tabindex="-1"><a class="header-anchor" href="#super" aria-hidden="true">#</a> super</h3><p><code>super</code> 关键字用于调用父类构造函数或获取父类数据，具体行为取决于在何处使用，具体规则如下</p><ul><li><code>super</code> 在子类构造器中使用时，指向父类构造器，必须在 <code>this</code> 关键词前调用</li><li><code>super</code> 在实例方法或实例字段中使用时，指向<mark>父类原型</mark></li><li><code>super</code> 在静态方法或静态字段中使用时，指向<mark>父类</mark></li><li>通过 <code>super</code> 设置属性时，属性被设置到当前 <code>this</code> 身上</li><li><code>super</code> 并不是变量，不能当作变量操作</li></ul><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 类</span>
<span class="token keyword">class</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span>
  <span class="token comment">// 构造器</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 初始化数据</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>age <span class="token operator">=</span> age<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 静态方法</span>
  <span class="token keyword">static</span> <span class="token function">create</span><span class="token punctuation">(</span><span class="token parameter"><span class="token operator">...</span>args</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token operator">...</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 实例方法</span>
  <span class="token function">sayHi</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span><span class="token string">&#39;hi&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment">// 子类 继承</span>
<span class="token keyword">class</span> <span class="token class-name">Worker</span> <span class="token keyword">extends</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span>
  <span class="token function">constructor</span><span class="token punctuation">(</span><span class="token parameter">name<span class="token punctuation">,</span> age<span class="token punctuation">,</span> job</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 此处 super 引用父类构造器</span>
    <span class="token comment">// 调用父类构造器并传参</span>
    <span class="token keyword">super</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span> age<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>job <span class="token operator">=</span> job<span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 静态方法</span>
  <span class="token keyword">static</span> <span class="token function">createPerson</span><span class="token punctuation">(</span><span class="token parameter"><span class="token operator">...</span>args</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 此处 super 引用父类本身</span>
    <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">create</span><span class="token punctuation">(</span><span class="token operator">...</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>

  <span class="token comment">// 实例方法</span>
  <span class="token function">sayHi</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 此处 super 引用 父类原型</span>
    <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">sayHi</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,26),x={href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/super",target:"_blank",rel:"noopener noreferrer"},j=s("code",null,"this",-1),E=s("code",null,"super",-1),S={href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes",target:"_blank",rel:"noopener noreferrer"},P=s("h2",{id:"结语",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#结语","aria-hidden":"true"},"#"),n(" 结语")],-1),B=s("p",null,[n("文章只简要介绍了部分类语法，没有深入探究类的特性，究其原因还是因为 "),s("code",null,"JS"),n(" 中的类只是语法糖，若想深入了解 "),s("code",null,"JavaScript"),n(" 中的面向对象编程，还是应该学习并理解原型及原型继承，通过原型与原型继承能够模拟出很多模式，包括类。")],-1),J=s("h2",{id:"参考资料",tabindex:"-1"},[s("a",{class:"header-anchor",href:"#参考资料","aria-hidden":"true"},"#"),n(" 参考资料")],-1),N=s("br",null,null,-1),A=s("br",null,null,-1),C={href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/",target:"_blank",rel:"noopener noreferrer"};function z(H,W){const t=c("RouterLink"),e=c("ExternalLinkIcon");return i(),u("div",null,[r,k,s("p",null,[n("学习 "),v,n(" 类之前请先了解 "),m,n(" 中的 "),a(t,{to:"/posts/javascript/%E6%A6%82%E5%BF%B5/JavaScript-%E6%A6%82%E5%BF%B5-%E5%8E%9F%E5%9E%8B%E4%B8%8E%E7%BB%A7%E6%89%BF.html"},{default:p(()=>[n("原型与继承")]),_:1}),n("；"),b,n(" 中的类并不是真正意义上的 "),h,n("，可以理解为对原型与原型继承的一种封装，类模式在 "),_,n(" 中是一种可选的模式，而不是必须的。")]),g,s("p",null,[n("类使用关键字 "),y,n(" 声明，"),w,n(" 关键字的特性与 "),a(t,{to:"/posts/javascript/es6/ES6-%E6%96%B0%E7%89%B9%E6%80%A7%E8%AF%A6%E8%A7%A3%20-%20let%E4%B8%8Econst.html"},{default:p(()=>[n("let/const")]),_:1}),n(" 一样")]),f,s("p",null,[n("关于 "),s("a",x,[n("super"),a(e)]),n("，虽然它会动态改变引用，但它并不代表 "),j,n("，"),E,n(" 永远指向父类或父类原型。")]),s("p",null,[n("类的其他语法规则可看 "),s("a",S,[n("MDN#Classes"),a(e)]),n("，文章只简要描述。")]),P,B,J,s("blockquote",null,[s("p",null,[n("《JavaScript 高级程序设计》"),N,n(" 《你不知道的 JavaScript》"),A,n(" _"),s("a",C,[n("MDN"),a(e)])])])])}const R=l(d,[["render",z],["__file","ES6-新特性详解-类.html.vue"]]);export{R as default};
